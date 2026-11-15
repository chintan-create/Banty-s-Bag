# Banty's Bag — WordPress + WooCommerce + MySQL Database Package

This directory contains the complete conversion of **Banty's Bag (Kutchi Handloom & Heritage Apparel)** into a native **WordPress + WooCommerce + MySQL/MariaDB** e-commerce store.

## Package Structure

- `wp-content/themes/bantys-bag-kutchi/` — Custom WooCommerce theme preserving the editorial storefront, Fraunces/Plus Jakarta Sans/JetBrains Mono typography, dual INR price slider, slide-over Bag Drawer, SVG Garment Measurement Blueprint, colorway swatches, craft/care accordions, and Order GST Receipt page.
- `wp-content/plugins/bantys-bag-kutchi-core/` — Companion plugin adding Kutchi craft metadata fields in WP Admin, 5% Handloom GST calculation, `wp-json/bantys-bag/v1/products` REST endpoint, and automatic catalog/coupon seeder.
- `database/bantys_bag_woocommerce.sql` — Full MySQL / MariaDB SQL dump containing WordPress & WooCommerce schema, INR configuration, categories, all 6 variable products (`KT-01`–`KT-06`), 17 variations, 7 patron reviews, `KUTCH10`/`BHUJ10` coupons, 5% GST tax rate, Pan-India shipping zones, and a sample order (`#BB-1042`).
- `database/woocommerce-products-import.csv` — Standard WooCommerce CSV for importing products via **WooCommerce → Products → Import**.
- `docker-compose.yml` — One-command local WordPress + WooCommerce + MariaDB + phpMyAdmin stack.

## Option A: Run Locally with Docker

```bash
cd wordpress-woocommerce
docker compose up -d
```

1. Open `http://localhost:8080` to finish WordPress setup (the MariaDB database is pre-seeded with `database/bantys_bag_woocommerce.sql`).
2. Install & activate **WooCommerce** in **Plugins → Add New**.
3. Activate **Banty's Bag — Kutchi Handloom WooCommerce Core** in **Plugins**.
4. Activate **Banty's Bag — Kutchi Handloom & Heritage Apparel** in **Appearance → Themes**.
5. Inspect the database anytime in phpMyAdmin at `http://localhost:8081`.

## Option B: Deploy to cPanel / Hostinger / Existing WordPress

1. Zip `wp-content/themes/bantys-bag-kutchi` and upload via **Appearance → Themes → Add New → Upload Theme**.
2. Zip `wp-content/plugins/bantys-bag-kutchi-core` and upload via **Plugins → Add New → Upload Plugin**.
3. Ensure **WooCommerce** is active, then import `database/bantys_bag_woocommerce.sql` via phpMyAdmin (or import `database/woocommerce-products-import.csv` via **WooCommerce → Products → Import**).
