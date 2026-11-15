import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { OrderRecord, ProductReview } from '../src/types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'bantys_bag.sqlite');
export const db = new DatabaseSync(DB_PATH);

export function initDatabase(): void {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT NOT NULL,
      craft_village TEXT NOT NULL,
      primary_material TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      status_note TEXT NOT NULL,
      lead_time_label TEXT NOT NULL,
      lead_time_days INTEGER NOT NULL,
      summary TEXT NOT NULL,
      dimensions_json TEXT NOT NULL,
      craftsmanship_notes_json TEXT NOT NULL,
      care_instructions_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_variations (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      swatch_hex TEXT NOT NULL,
      price_delta INTEGER NOT NULL DEFAULT 0,
      lead_time_days INTEGER NOT NULL DEFAULT 2,
      in_stock INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      location TEXT NOT NULL,
      rating INTEGER NOT NULL,
      review_date TEXT NOT NULL,
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount_percent INTEGER NOT NULL,
      description TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      estimated_delivery TEXT NOT NULL,
      status TEXT NOT NULL,
      shipping_method TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      customer_json TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      discount INTEGER NOT NULL,
      promo_code TEXT,
      shipping_cost INTEGER NOT NULL,
      tax_amount INTEGER NOT NULL,
      total INTEGER NOT NULL,
      created_ts INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);

  seedInitialData();
}

function seedInitialData(): void {
  const existingCoupons = db.prepare('SELECT COUNT(*) as cnt FROM coupons').get() as { cnt: number };
  if (existingCoupons.cnt === 0) {
    const insertCoupon = db.prepare(
      'INSERT OR IGNORE INTO coupons (code, discount_percent, description, active) VALUES (?, ?, ?, 1)'
    );
    insertCoupon.run('KUTCH10', 10, '10% Kutch craft patron discount');
    insertCoupon.run('BHUJ10', 10, '10% Bhuj atelier patron discount');
  }

  const existingProducts = db.prepare('SELECT COUNT(*) as cnt FROM products').get() as { cnt: number };
  if (existingProducts.cnt === 0) {
    const seedProducts = [
      {
        id: 'ajrakhpur-indigo-kurta',
        sku: 'KT-01',
        name: 'Ajrakhpur 16-Step Natural Indigo Kurta',
        category: 'Kurtas & Tunics',
        subCategory: 'Ajrakh Block Print',
        craftVillage: 'Ajrakhpur, Kutch',
        primaryMaterial: 'Organic Cotton · Natural Indigo & Madder',
        basePrice: 4850,
        statusNote: 'Ready to Ship',
        leadTimeLabel: 'Dispatches from Bhuj within 48 hours',
        leadTimeDays: 2,
        summary:
          'Hand-block printed in Ajrakhpur using carved seasoned Burma teak blocks through a traditional 16-stage process.',
        dimensions: { chestOrWidthCm: 104, lengthCm: 112, sleeveOrBorderCm: 58, fabricWeightGsm: 145, isDrape: false },
        finishes: [
          { id: 'indigo-madder-s', name: 'Indigo & Madder Crimson — Size S (Chest 38")', swatchHex: '#1E3A5F', priceDelta: 0, leadTimeDays: 2 },
          { id: 'indigo-madder-m', name: 'Indigo & Madder Crimson — Size M (Chest 40")', swatchHex: '#25476E', priceDelta: 0, leadTimeDays: 2 },
          { id: 'kashish-earth-l', name: 'Kashish Iron-Earth & Indigo — Size L (Chest 42")', swatchHex: '#5A382E', priceDelta: 250, leadTimeDays: 3 },
        ],
      },
      {
        id: 'kediyu-kala-cotton-angrakha',
        sku: 'KT-02',
        name: 'Kediyu Pintucked Kala Cotton Angrakha',
        category: 'Kediyu & Jackets',
        subCategory: 'Kediyu & Wrap Tops',
        craftVillage: 'Bhujodi & Khamir Cluster, Kutch',
        primaryMaterial: '100% Rain-Fed Indigenous Kala Cotton',
        basePrice: 3950,
        statusNote: 'Ready to Ship',
        leadTimeLabel: 'Dispatches from Bhuj within 48 hours',
        leadTimeDays: 2,
        summary:
          'A contemporary everyday silhouette rooted in the pastoral Kutchi Kediyu—tailored from zero-irrigation indigenous short-staple Kala cotton.',
        dimensions: { chestOrWidthCm: 99, lengthCm: 68, sleeveOrBorderCm: 56, fabricWeightGsm: 165, isDrape: false },
        finishes: [
          { id: 'kora-ecru-s', name: 'Unbleached Kora Ecru — Size S (Bust/Chest 36")', swatchHex: '#EAE2D3', priceDelta: 0, leadTimeDays: 2 },
          { id: 'kora-ecru-m', name: 'Unbleached Kora Ecru — Size M (Bust/Chest 38")', swatchHex: '#E4DBC9', priceDelta: 0, leadTimeDays: 2 },
          { id: 'kora-ecru-l', name: 'Unbleached Kora Ecru — Size L (Bust/Chest 41")', swatchHex: '#DDD3BE', priceDelta: 0, leadTimeDays: 2 },
        ],
      },
      {
        id: 'rabari-mirror-bandi-jacket',
        sku: 'KT-03',
        name: 'Rabari Abhla Mirror Kala Cotton Bandi',
        category: 'Kediyu & Jackets',
        subCategory: 'Embroidered Jackets',
        craftVillage: 'Sumrasar Sheikh, Kutch',
        primaryMaterial: 'Handspun Kala Cotton & Shisha Mirrors',
        basePrice: 5600,
        statusNote: 'Small Batch',
        leadTimeLabel: 'Ships in 3–4 business days',
        leadTimeDays: 3,
        summary:
          'Tailored from structured charcoal-dyed Kala cotton and hand-embroidered by women artisans of the pastoral Rabari community.',
        dimensions: { chestOrWidthCm: 104, lengthCm: 69, sleeveOrBorderCm: 24, fabricWeightGsm: 220, isDrape: false },
        finishes: [
          { id: 'charcoal-rabari-m', name: 'Charcoal Black / Multi-Resham — Size M (40")', swatchHex: '#2B2D2F', priceDelta: 0, leadTimeDays: 3 },
          { id: 'charcoal-rabari-l', name: 'Charcoal Black / Multi-Resham — Size L (42")', swatchHex: '#1F2022', priceDelta: 0, leadTimeDays: 3 },
          { id: 'deep-indigo-rabari-xl', name: 'Deep Indigo / Crimson Mirror — Size XL (44")', swatchHex: '#1D2E4A', priceDelta: 300, leadTimeDays: 5 },
        ],
      },
      {
        id: 'mashru-silk-suf-tunic',
        sku: 'KT-04',
        name: 'Mashru Silk-Cotton Suf Embroidered Dress',
        category: 'Kurtas & Tunics',
        subCategory: 'Mashru Silk Apparel',
        craftVillage: 'Mandvi & Bhuj, Kutch',
        primaryMaterial: 'Handloom Mashru Silk-Cotton & Suf Stitch',
        basePrice: 7400,
        statusNote: 'Artisan Edition',
        leadTimeLabel: 'Ships in 4–6 business days',
        leadTimeDays: 5,
        summary:
          'Woven in the historic satin-weave Mashru technique—placing lustrous jewel-striped mulberry silk on the exterior face while keeping pure soft cotton against the skin.',
        dimensions: { chestOrWidthCm: 102, lengthCm: 108, sleeveOrBorderCm: 46, fabricWeightGsm: 175, isDrape: false },
        finishes: [
          { id: 'peacock-turmeric-s', name: 'Peacock Teal & Turmeric Stripe — Size S (36")', swatchHex: '#136F72', priceDelta: 0, leadTimeDays: 5 },
          { id: 'peacock-turmeric-m', name: 'Peacock Teal & Turmeric Stripe — Size M (38")', swatchHex: '#C58B24', priceDelta: 0, leadTimeDays: 5 },
          { id: 'madder-emerald-l', name: 'Crimson & Emerald Stripe — Size L (41")', swatchHex: '#8E2430', priceDelta: 400, leadTimeDays: 6 },
        ],
      },
      {
        id: 'bhujodi-kala-cotton-shawl',
        sku: 'KT-05',
        name: 'Bhujodi Extra-Weft Kala Cotton Shawl',
        category: 'Shawls & Dupattas',
        subCategory: 'Bhujodi Handloom',
        craftVillage: 'Bhujodi Village, Kutch',
        primaryMaterial: 'Pit-Loom Kala Cotton · Extra-Weft',
        basePrice: 4200,
        statusNote: 'Ready to Ship',
        leadTimeLabel: 'Dispatches from Bhuj within 24 hours',
        leadTimeDays: 1,
        summary:
          'Handwoven on throw-shuttle pit looms by Vankar master weavers in Bhujodi village, featuring tactile raised Chaumak and Sachchi Kor geometric motifs.',
        dimensions: { chestOrWidthCm: 92, lengthCm: 215, sleeveOrBorderCm: 18, fabricWeightGsm: 190, isDrape: true },
        finishes: [
          { id: 'ecru-terracotta-charcoal', name: 'Natural Kora / Terracotta & Charcoal Motifs', swatchHex: '#B6533E', priceDelta: 0, leadTimeDays: 1 },
          { id: 'indigo-ecru-dhabla', name: 'Deep Indigo / Kora Extra-Weft Motifs', swatchHex: '#233B5D', priceDelta: 350, leadTimeDays: 2 },
        ],
      },
      {
        id: 'bandhani-gajji-silk-dupatta',
        sku: 'KT-06',
        name: 'Jhinkhu Bandhani Pure Gajji Silk Odhani',
        category: 'Shawls & Dupattas',
        subCategory: 'Kutchi Bandhani',
        craftVillage: 'Bhuj & Mandvi, Kutch',
        primaryMaterial: 'Pure Gajji Silk & Zari Pallu',
        basePrice: 11800,
        statusNote: 'Masterpiece Loom',
        leadTimeLabel: 'Ships in 5–7 business days',
        leadTimeDays: 6,
        summary:
          'An heirloom Kutchi Jhinkhu (fine-dot) Bandhani odhani worked on fluid, heavy-drape pure Gajji silk—hand-pinched and tied with over 18,000 tiny rai knots.',
        dimensions: { chestOrWidthCm: 110, lengthCm: 245, sleeveOrBorderCm: 22, fabricWeightGsm: 115, isDrape: true },
        finishes: [
          { id: 'crimson-haldi-gajji', name: 'Madder Crimson & Haldi Saffron / Gold Zari', swatchHex: '#981B2B', priceDelta: 0, leadTimeDays: 6 },
          { id: 'morpankh-indigo-gajji', name: 'Morpankh Emerald & Deep Maroon / Gold Zari', swatchHex: '#15524B', priceDelta: 600, leadTimeDays: 7 },
        ],
      },
    ];

    const insertProd = db.prepare(`
      INSERT INTO products (id, sku, name, category, sub_category, craft_village, primary_material, base_price, status_note, lead_time_label, lead_time_days, summary, dimensions_json, craftsmanship_notes_json, care_instructions_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]')
    `);
    const insertVar = db.prepare(`
      INSERT INTO product_variations (id, product_id, name, swatch_hex, price_delta, lead_time_days, in_stock)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    for (const p of seedProducts) {
      insertProd.run(
        p.id,
        p.sku,
        p.name,
        p.category,
        p.subCategory,
        p.craftVillage,
        p.primaryMaterial,
        p.basePrice,
        p.statusNote,
        p.leadTimeLabel,
        p.leadTimeDays,
        p.summary,
        JSON.stringify(p.dimensions)
      );
      for (const f of p.finishes) {
        insertVar.run(f.id, p.id, f.name, f.swatchHex, f.priceDelta, f.leadTimeDays);
      }
    }
  }
}

export function getCustomReviewsByProduct(): Record<string, ProductReview[]> {
  const rows = db
    .prepare('SELECT id, product_id, author, role, location, rating, review_date, title, comment FROM reviews ORDER BY created_at DESC')
    .all() as Array<{
    id: string;
    product_id: string;
    author: string;
    role: string;
    location: string;
    rating: number;
    review_date: string;
    title: string;
    comment: string;
  }>;

  const grouped: Record<string, ProductReview[]> = {};
  for (const r of rows) {
    if (!grouped[r.product_id]) grouped[r.product_id] = [];
    grouped[r.product_id].push({
      id: r.id,
      author: r.author,
      role: r.role,
      location: r.location,
      rating: r.rating,
      date: r.review_date,
      title: r.title,
      comment: r.comment,
    });
  }
  return grouped;
}

export function addReviewToDb(productId: string, review: ProductReview): ProductReview {
  db.prepare(`
    INSERT INTO reviews (id, product_id, author, role, location, rating, review_date, title, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    review.id,
    productId,
    review.author,
    review.role,
    review.location,
    review.rating,
    review.date,
    review.title,
    review.comment
  );
  return review;
}

export function getAllOrdersFromDb(): OrderRecord[] {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_ts DESC').all() as Array<{
    id: string;
    created_at: string;
    estimated_delivery: string;
    status: OrderRecord['status'];
    shipping_method: OrderRecord['shippingMethod'];
    payment_method: OrderRecord['paymentMethod'];
    customer_json: string;
    items_json: string;
    subtotal: number;
    discount: number;
    promo_code: string | null;
    shipping_cost: number;
    tax_amount: number;
    total: number;
  }>;

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    estimatedDelivery: row.estimated_delivery,
    status: row.status,
    shippingMethod: row.shipping_method,
    paymentMethod: row.payment_method,
    customer: JSON.parse(row.customer_json),
    items: JSON.parse(row.items_json),
    subtotal: row.subtotal,
    discount: row.discount,
    promoCode: row.promo_code || undefined,
    shippingCost: row.shipping_cost,
    taxAmount: row.tax_amount,
    total: row.total,
  }));
}

export function saveOrderToDb(order: OrderRecord): OrderRecord {
  db.prepare(`
    INSERT OR REPLACE INTO orders (id, created_at, estimated_delivery, status, shipping_method, payment_method, customer_json, items_json, subtotal, discount, promo_code, shipping_cost, tax_amount, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    order.id,
    order.createdAt,
    order.estimatedDelivery,
    order.status,
    order.shippingMethod,
    order.paymentMethod,
    JSON.stringify(order.customer),
    JSON.stringify(order.items),
    order.subtotal,
    order.discount,
    order.promoCode || null,
    order.shippingCost,
    order.taxAmount,
    order.total
  );
  return order;
}

export function validateCouponInDb(code: string): { valid: boolean; discountPercent: number; message: string } {
  const row = db
    .prepare('SELECT code, discount_percent, description FROM coupons WHERE code = ? AND active = 1')
    .get(code.toUpperCase()) as { code: string; discount_percent: number; description: string } | undefined;

  if (!row) {
    return {
      valid: false,
      discountPercent: 0,
      message: 'Unrecognized code. Try KUTCH10 for 10% craft patron savings.',
    };
  }
  return {
    valid: true,
    discountPercent: row.discount_percent,
    message: `${row.discount_percent}% Kutch craft patron discount applied.`,
  };
}

export function getDatabaseSummary() {
  const products = (db.prepare('SELECT COUNT(*) as cnt FROM products').get() as { cnt: number }).cnt;
  const variations = (db.prepare('SELECT COUNT(*) as cnt FROM product_variations').get() as { cnt: number }).cnt;
  const orders = (db.prepare('SELECT COUNT(*) as cnt FROM orders').get() as { cnt: number }).cnt;
  const coupons = (db.prepare('SELECT COUNT(*) as cnt FROM coupons').get() as { cnt: number }).cnt;
  const customReviews = (db.prepare('SELECT COUNT(*) as cnt FROM reviews').get() as { cnt: number }).cnt;
  return { products, variations, orders, coupons, customReviews };
}
