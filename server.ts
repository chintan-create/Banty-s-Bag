import express from 'express';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  addReviewToDb,
  getAllOrdersFromDb,
  getCustomReviewsByProduct,
  getDatabaseSummary,
  initDatabase,
  saveOrderToDb,
  validateCouponInDb,
} from './server/db.ts';

const execFileAsync = promisify(execFile);
const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  initDatabase();

  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // --- WooCommerce-aligned Storefront & DB API Routes ---
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', db: getDatabaseSummary() });
  });

  app.get('/api/reviews', (_req, res) => {
    res.json({ reviewsByProduct: getCustomReviewsByProduct() });
  });

  app.post('/api/reviews', (req, res) => {
    const { productId, review } = req.body || {};
    if (!productId || !review?.author || !review?.title || !review?.comment) {
      res.status(400).json({ error: 'Missing required review fields.' });
      return;
    }
    const saved = addReviewToDb(String(productId), {
      id: `rev-db-${Date.now()}`,
      author: String(review.author).trim(),
      role: String(review.role || 'Verified Patron').trim(),
      location: String(review.location || 'Gujarat').trim(),
      rating: Math.min(5, Math.max(1, Number(review.rating || 5))),
      date: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      title: String(review.title).trim(),
      comment: String(review.comment).trim(),
    });
    res.status(201).json({ review: saved });
  });

  app.post('/api/coupons/validate', (req, res) => {
    const code = String(req.body?.code || '').trim();
    if (!code) {
      res.json({ valid: true, discountPercent: 0, message: '' });
      return;
    }
    res.json(validateCouponInDb(code));
  });

  app.get('/api/orders', (_req, res) => {
    res.json({ orders: getAllOrdersFromDb() });
  });

  app.post('/api/orders', (req, res) => {
    const order = req.body?.order;
    if (!order || !order.id || !order.customer || !Array.isArray(order.items)) {
      res.status(400).json({ error: 'Invalid order payload.' });
      return;
    }
    const saved = saveOrderToDb(order);
    res.status(201).json({ order: saved });
  });

  // --- WordPress + WooCommerce & SQL DB Export Downloads ---
  app.get('/api/wp-export/summary', (_req, res) => {
    const wpRoot = path.resolve(process.cwd(), 'wordpress-woocommerce');
    const files: string[] = [];
    function walk(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else {
          files.push(path.relative(wpRoot, full));
        }
      }
    }
    walk(wpRoot);
    res.json({
      files: files.sort(),
      dbStats: getDatabaseSummary(),
    });
  });

  app.get('/api/wp-export/database.sql', (_req, res) => {
    const sqlPath = path.resolve(process.cwd(), 'wordpress-woocommerce/database/bantys_bag_woocommerce.sql');
    if (!fs.existsSync(sqlPath)) {
      res.status(404).send('SQL dump not found');
      return;
    }
    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="bantys_bag_woocommerce.sql"');
    res.sendFile(sqlPath);
  });

  app.get('/api/wp-export/products.csv', (_req, res) => {
    const csvPath = path.resolve(process.cwd(), 'wordpress-woocommerce/database/woocommerce-products-import.csv');
    if (!fs.existsSync(csvPath)) {
      res.status(404).send('CSV file not found');
      return;
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="woocommerce-products-import.csv"');
    res.sendFile(csvPath);
  });

  app.get('/api/wp-export/bundle.tar.gz', async (_req, res) => {
    const wpRoot = path.resolve(process.cwd(), 'wordpress-woocommerce');
    if (!fs.existsSync(wpRoot)) {
      res.status(404).send('WordPress package directory not found');
      return;
    }
    const tmpArchive = path.join('/tmp', `bantys-bag-wordpress-woocommerce-${Date.now()}.tar.gz`);
    try {
      await execFileAsync('tar', ['-czf', tmpArchive, '-C', process.cwd(), 'wordpress-woocommerce']);
      res.download(tmpArchive, 'bantys-bag-wordpress-woocommerce.tar.gz', () => {
        fs.unlink(tmpArchive, () => {});
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create bundle archive', detail: String(err) });
    }
  });

  // --- Vite Dev Middleware or Static Production Build ---
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Banty's Bag server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
