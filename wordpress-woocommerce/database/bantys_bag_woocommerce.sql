-- ============================================================================
-- Banty's Bag — Kutchi Handloom & Heritage Apparel
-- Complete WordPress 6.7 + WooCommerce 9.x MySQL / MariaDB Database Dump
-- Store Currency: INR (₹) | Tax: 5% Handloom GST | Region: IN:GJ (Bhuj, Kutch)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. WordPress Core Tables
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wp_options` (
  `option_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `option_name` varchar(191) NOT NULL DEFAULT '',
  `option_value` longtext NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `option_name` (`option_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_users` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) NOT NULL DEFAULT '',
  `user_pass` varchar(255) NOT NULL DEFAULT '',
  `user_nicename` varchar(50) NOT NULL DEFAULT '',
  `user_email` varchar(100) NOT NULL DEFAULT '',
  `user_url` varchar(100) NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_activation_key` varchar(255) NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT 0,
  `display_name` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_usermeta` (
  `umeta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext,
  PRIMARY KEY (`umeta_id`),
  KEY `user_id` (`user_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_posts` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_author` bigint(20) unsigned NOT NULL DEFAULT 1,
  `post_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_date_gmt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_content` longtext NOT NULL,
  `post_title` text NOT NULL,
  `post_excerpt` text NOT NULL,
  `post_status` varchar(20) NOT NULL DEFAULT 'publish',
  `comment_status` varchar(20) NOT NULL DEFAULT 'open',
  `ping_status` varchar(20) NOT NULL DEFAULT 'closed',
  `post_password` varchar(255) NOT NULL DEFAULT '',
  `post_name` varchar(200) NOT NULL DEFAULT '',
  `to_ping` text NOT NULL,
  `pinged` text NOT NULL,
  `post_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_modified_gmt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_content_filtered` longtext NOT NULL,
  `post_parent` bigint(20) unsigned NOT NULL DEFAULT 0,
  `guid` varchar(255) NOT NULL DEFAULT '',
  `menu_order` int(11) NOT NULL DEFAULT 0,
  `post_type` varchar(20) NOT NULL DEFAULT 'post',
  `post_mime_type` varchar(100) NOT NULL DEFAULT '',
  `comment_count` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  KEY `post_name` (`post_name`(191)),
  KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`ID`),
  KEY `post_parent` (`post_parent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_postmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext,
  PRIMARY KEY (`meta_id`),
  KEY `post_id` (`post_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_terms` (
  `term_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `slug` varchar(200) NOT NULL DEFAULT '',
  `term_group` bigint(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`term_id`),
  KEY `slug` (`slug`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_term_taxonomy` (
  `term_taxonomy_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `term_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `taxonomy` varchar(32) NOT NULL DEFAULT '',
  `description` longtext NOT NULL,
  `parent` bigint(20) unsigned NOT NULL DEFAULT 0,
  `count` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`term_taxonomy_id`),
  UNIQUE KEY `term_id_taxonomy` (`term_id`,`taxonomy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_term_relationships` (
  `object_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `term_taxonomy_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `term_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`object_id`,`term_taxonomy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_comments` (
  `comment_ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_post_ID` bigint(20) unsigned NOT NULL DEFAULT 0,
  `comment_author` tinytext NOT NULL,
  `comment_author_email` varchar(100) NOT NULL DEFAULT '',
  `comment_author_url` varchar(200) NOT NULL DEFAULT '',
  `comment_author_IP` varchar(100) NOT NULL DEFAULT '',
  `comment_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_date_gmt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_content` text NOT NULL,
  `comment_karma` int(11) NOT NULL DEFAULT 0,
  `comment_approved` varchar(20) NOT NULL DEFAULT '1',
  `comment_agent` varchar(255) NOT NULL DEFAULT '',
  `comment_type` varchar(20) NOT NULL DEFAULT 'review',
  `comment_parent` bigint(20) unsigned NOT NULL DEFAULT 0,
  `user_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`comment_ID`),
  KEY `comment_post_ID` (`comment_post_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_commentmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext,
  PRIMARY KEY (`meta_id`),
  KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. WooCommerce Core Lookup, Tax, Shipping & HPOS Order Tables
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wp_wc_product_meta_lookup` (
  `product_id` bigint(20) NOT NULL,
  `sku` varchar(100) DEFAULT '',
  `virtual` tinyint(1) DEFAULT 0,
  `downloadable` tinyint(1) DEFAULT 0,
  `min_price` decimal(19,4) DEFAULT NULL,
  `max_price` decimal(19,4) DEFAULT NULL,
  `onsale` tinyint(1) DEFAULT 0,
  `stock_quantity` double DEFAULT NULL,
  `stock_status` varchar(100) DEFAULT 'instock',
  `rating_count` bigint(20) DEFAULT 0,
  `average_rating` decimal(3,2) DEFAULT 0.00,
  `total_sales` bigint(20) DEFAULT 0,
  `tax_status` varchar(100) DEFAULT 'taxable',
  `tax_class` varchar(100) DEFAULT '',
  PRIMARY KEY (`product_id`),
  KEY `sku` (`sku`(50))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_woocommerce_attribute_taxonomies` (
  `attribute_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `attribute_name` varchar(200) NOT NULL,
  `attribute_label` varchar(200) DEFAULT NULL,
  `attribute_type` varchar(20) NOT NULL,
  `attribute_orderby` varchar(20) NOT NULL,
  `attribute_public` int(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_woocommerce_tax_rates` (
  `tax_rate_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tax_rate_country` varchar(2) NOT NULL DEFAULT '',
  `tax_rate_state` varchar(200) NOT NULL DEFAULT '',
  `tax_rate` varchar(8) NOT NULL DEFAULT '',
  `tax_rate_name` varchar(200) NOT NULL DEFAULT '',
  `tax_rate_priority` bigint(20) unsigned NOT NULL DEFAULT 1,
  `tax_rate_compound` int(1) NOT NULL DEFAULT 0,
  `tax_rate_shipping` int(1) NOT NULL DEFAULT 0,
  `tax_rate_order` bigint(20) unsigned NOT NULL,
  `tax_rate_class` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`tax_rate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_woocommerce_shipping_zones` (
  `zone_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(200) NOT NULL,
  `zone_order` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`zone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_woocommerce_shipping_zone_methods` (
  `zone_id` bigint(20) unsigned NOT NULL,
  `instance_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `method_id` varchar(200) NOT NULL,
  `method_order` bigint(20) unsigned NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`instance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_wc_orders` (
  `id` bigint(20) unsigned NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `tax_amount` decimal(26,8) DEFAULT NULL,
  `total_amount` decimal(26,8) DEFAULT NULL,
  `customer_id` bigint(20) unsigned DEFAULT NULL,
  `billing_email` varchar(320) DEFAULT NULL,
  `date_created_gmt` datetime DEFAULT NULL,
  `date_updated_gmt` datetime DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `payment_method_title` text,
  `customer_note` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_wc_order_addresses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `address_type` varchar(20) DEFAULT NULL,
  `first_name` text,
  `last_name` text,
  `address_1` text,
  `address_2` text,
  `city` text,
  `state` text,
  `postcode` text,
  `country` text,
  `email` varchar(320) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_woocommerce_order_items` (
  `order_item_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_item_name` text NOT NULL,
  `order_item_type` varchar(200) NOT NULL DEFAULT '',
  `order_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_woocommerce_order_itemmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_item_id` bigint(20) unsigned NOT NULL,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext,
  PRIMARY KEY (`meta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Seed WordPress & WooCommerce Settings (Theme, INR, Bhuj Store, 5% GST)
-- ----------------------------------------------------------------------------
REPLACE INTO `wp_options` (`option_name`, `option_value`, `autoload`) VALUES
('blogname', 'Banty\'s Bag', 'yes'),
('blogdescription', 'Kutchi Handloom & Heritage Apparel — Crafted in Kutch, Gujarat', 'yes'),
('template', 'bantys-bag-kutchi', 'yes'),
('stylesheet', 'bantys-bag-kutchi', 'yes'),
('show_on_front', 'page', 'yes'),
('page_on_front', '10', 'yes'),
('woocommerce_shop_page_id', '11', 'yes'),
('woocommerce_cart_page_id', '12', 'yes'),
('woocommerce_checkout_page_id', '13', 'yes'),
('woocommerce_myaccount_page_id', '14', 'yes'),
('woocommerce_currency', 'INR', 'yes'),
('woocommerce_currency_pos', 'left', 'yes'),
('woocommerce_price_thousand_sep', ',', 'yes'),
('woocommerce_price_decimal_sep', '.', 'yes'),
('woocommerce_price_num_decimals', '0', 'yes'),
('woocommerce_default_country', 'IN:GJ', 'yes'),
('woocommerce_store_address', 'Station Road, Near Hamirsar Lake', 'yes'),
('woocommerce_store_city', 'Bhuj, Kutch', 'yes'),
('woocommerce_store_postcode', '370001', 'yes'),
('woocommerce_calc_taxes', 'yes', 'yes'),
('woocommerce_enable_coupons', 'yes', 'yes'),
('woocommerce_cod_settings', 'a:3:{s:7:"enabled";s:3:"yes";s:5:"title";s:22:"Cash on Delivery (COD)";s:11:"description";s:66:"Pay cash or BharatQR / UPI scan at your doorstep (₹0 surcharge).";}', 'yes');

REPLACE INTO `wp_users` (`ID`, `user_login`, `user_pass`, `user_nicename`, `user_email`, `display_name`) VALUES
(1, 'bantys_admin', '$P$B9xK4mN2qP8sT1vW3yZ5aB7cD9eF1g0', 'bantys_admin', 'atelier@bantysbag.in', 'Banty\'s Bag Bhuj Atelier'),
(2, 'devanshi_jadeja', '$P$B9xK4mN2qP8sT1vW3yZ5aB7cD9eF1g0', 'devanshi_jadeja', 'devanshi.jadeja@example.in', 'Devanshi Jadeja');

-- ----------------------------------------------------------------------------
-- 4. Taxonomies (Product Types & Kutchi Apparel Categories)
-- ----------------------------------------------------------------------------
REPLACE INTO `wp_terms` (`term_id`, `name`, `slug`) VALUES
(1, 'Uncategorized', 'uncategorized'),
(2, 'variable', 'variable'),
(3, 'simple', 'simple'),
(4, 'Kurtas & Tunics', 'kurtas-tunics'),
(5, 'Kediyu & Jackets', 'kediyu-jackets'),
(6, 'Shawls & Dupattas', 'shawls-dupattas');

REPLACE INTO `wp_term_taxonomy` (`term_taxonomy_id`, `term_id`, `taxonomy`, `description`, `count`) VALUES
(1, 1, 'category', '', 0),
(2, 2, 'product_type', '', 6),
(3, 3, 'product_type', '', 0),
(4, 4, 'product_cat', 'Hand-block printed Ajrakh kurtas and Mashru silk-cotton tunics from Ajrakhpur and Mandvi.', 2),
(5, 5, 'product_cat', 'Indigenous Kala cotton Kediyu wrap tops and Rabari shisha mirror-work Bandi jackets.', 2),
(6, 6, 'product_cat', 'Bhujodi extra-weft Kala cotton shawls and pure Gajji silk Bandhani odhanis.', 2);

REPLACE INTO `wp_woocommerce_attribute_taxonomies` (`attribute_id`, `attribute_name`, `attribute_label`, `attribute_type`, `attribute_orderby`, `attribute_public`) VALUES
(1, 'colorway-size', 'Colorway & Size', 'select', 'menu_order', 1);

-- ----------------------------------------------------------------------------
-- 5. Core WordPress Pages & WooCommerce Coupons (KUTCH10, BHUJ10)
-- ----------------------------------------------------------------------------
REPLACE INTO `wp_posts` (`ID`, `post_title`, `post_name`, `post_content`, `post_excerpt`, `post_status`, `post_type`, `to_ping`, `pinged`, `post_content_filtered`) VALUES
(10, 'Home — Banty\'s Bag Kutchi Handloom', 'home', '', '', 'publish', 'page', '', '', ''),
(11, 'All Kutchi Apparel', 'shop', '', '', 'publish', 'page', '', '', ''),
(12, 'Shopping Bag', 'cart', '[woocommerce_cart]', '', 'publish', 'page', '', '', ''),
(13, 'Bhuj Atelier Checkout', 'checkout', '[woocommerce_checkout]', '', 'publish', 'page', '', '', ''),
(14, 'My Account', 'my-account', '[woocommerce_my_account]', '', 'publish', 'page', '', '', ''),
(15, 'Orders & GST Receipts', 'orders', '', '', 'publish', 'page', '', '', ''),
(20, 'KUTCH10', 'kutch10', '', '10% Kutch craft patron discount', 'publish', 'shop_coupon', '', '', ''),
(21, 'BHUJ10', 'bhuj10', '', '10% Bhuj atelier patron discount', 'publish', 'shop_coupon', '', '', '');

REPLACE INTO `wp_postmeta` (`post_id`, `meta_key`, `meta_value`) VALUES
(15, '_wp_page_template', 'page-orders.php'),
(20, 'discount_type', 'percent'),
(20, 'coupon_amount', '10'),
(21, 'discount_type', 'percent'),
(21, 'coupon_amount', '10');

-- ----------------------------------------------------------------------------
-- 6. Kutchi Handloom Products (KT-01 through KT-06) & 17 Variations
-- ----------------------------------------------------------------------------
REPLACE INTO `wp_posts` (`ID`, `post_title`, `post_name`, `post_content`, `post_excerpt`, `post_status`, `post_type`, `menu_order`, `to_ping`, `pinged`, `post_content_filtered`, `comment_count`) VALUES
(101, 'Ajrakhpur 16-Step Natural Indigo Kurta', 'ajrakhpur-16-step-natural-indigo-kurta', 'Hand-block printed in Ajrakhpur using carved seasoned Burma teak blocks through a traditional 16-stage process of camel-dung scouring, myrobalan mordanting, lime-arabic gum resist, natural indigo vat dyeing, and alizarin madder boiling.', 'Organic Cotton · Natural Indigo & Madder', 'publish', 'product', 1, '', '', '', 2),
(102, 'Kediyu Pintucked Kala Cotton Angrakha', 'kediyu-pintucked-kala-cotton-angrakha', 'A contemporary everyday silhouette rooted in the pastoral Kutchi Kediyu—tailored from zero-irrigation indigenous short-staple Kala cotton with fine diagonal chest pintucks, gentle waist gathers, and handwoven Bhujodi border trims.', '100% Rain-Fed Indigenous Kala Cotton', 'publish', 'product', 2, '', '', '', 1),
(103, 'Rabari Abhla Mirror Kala Cotton Bandi', 'rabari-abhla-mirror-kala-cotton-bandi', 'Tailored from structured charcoal-dyed Kala cotton and hand-embroidered by women artisans of the pastoral Rabari community in Sumrasar using real glass shisha mirrors (abhla), chain stitch (sankali), and vibrant resham accents.', 'Handspun Kala Cotton & Shisha Mirrors', 'publish', 'product', 3, '', '', '', 1),
(104, 'Mashru Silk-Cotton Suf Embroidered Dress', 'mashru-silk-cotton-suf-embroidered-dress', 'Woven in the historic satin-weave Mashru technique—placing lustrous jewel-striped mulberry silk on the exterior face while keeping pure soft cotton against the skin—crowned with counted-thread geometric Suf embroidery.', 'Handloom Mashru Silk-Cotton & Suf Stitch', 'publish', 'product', 4, '', '', '', 1),
(105, 'Bhujodi Extra-Weft Kala Cotton Shawl', 'bhujodi-extra-weft-kala-cotton-shawl', 'Handwoven on throw-shuttle pit looms by Vankar master weavers in Bhujodi village, featuring tactile raised Chaumak and Sachchi Kor geometric motifs inserted by hand between weft picks—resembling embroidery woven directly on the loom.', 'Pit-Loom Kala Cotton · Extra-Weft', 'publish', 'product', 5, '', '', '', 1),
(106, 'Jhinkhu Bandhani Pure Gajji Silk Odhani', 'jhinkhu-bandhani-pure-gajji-silk-odhani', 'An heirloom Kutchi Jhinkhu (fine-dot) Bandhani odhani worked on fluid, heavy-drape pure Gajji silk—hand-pinched and tied with over 18,000 tiny rai knots by Khatri women artisans in Bhuj and Mandvi before sequential resist-dyeing in saffron and madder crimson.', 'Pure Gajji Silk & Zari Pallu', 'publish', 'product', 6, '', '', '', 1);

-- Product Variations (201-217)
REPLACE INTO `wp_posts` (`ID`, `post_parent`, `post_title`, `post_name`, `post_content`, `post_excerpt`, `post_status`, `post_type`, `to_ping`, `pinged`, `post_content_filtered`) VALUES
(201, 101, 'Ajrakhpur Kurta - Indigo & Madder Crimson S', 'kt-01-indigo-madder-s', '', 'Colorway & Size: Indigo & Madder Crimson — Size S (Chest 38")', 'publish', 'product_variation', '', '', ''),
(202, 101, 'Ajrakhpur Kurta - Indigo & Madder Crimson M', 'kt-01-indigo-madder-m', '', 'Colorway & Size: Indigo & Madder Crimson — Size M (Chest 40")', 'publish', 'product_variation', '', '', ''),
(203, 101, 'Ajrakhpur Kurta - Kashish Iron-Earth L', 'kt-01-kashish-earth-l', '', 'Colorway & Size: Kashish Iron-Earth & Indigo — Size L (Chest 42")', 'publish', 'product_variation', '', '', ''),
(204, 102, 'Kediyu Angrakha - Unbleached Kora Ecru S', 'kt-02-kora-ecru-s', '', 'Colorway & Size: Unbleached Kora Ecru — Size S (Bust/Chest 36")', 'publish', 'product_variation', '', '', ''),
(205, 102, 'Kediyu Angrakha - Unbleached Kora Ecru M', 'kt-02-kora-ecru-m', '', 'Colorway & Size: Unbleached Kora Ecru — Size M (Bust/Chest 38")', 'publish', 'product_variation', '', '', ''),
(206, 102, 'Kediyu Angrakha - Unbleached Kora Ecru L', 'kt-02-kora-ecru-l', '', 'Colorway & Size: Unbleached Kora Ecru — Size L (Bust/Chest 41")', 'publish', 'product_variation', '', '', ''),
(207, 103, 'Rabari Bandi - Charcoal Black M', 'kt-03-charcoal-m', '', 'Colorway & Size: Charcoal Black / Multi-Resham — Size M (40")', 'publish', 'product_variation', '', '', ''),
(208, 103, 'Rabari Bandi - Charcoal Black L', 'kt-03-charcoal-l', '', 'Colorway & Size: Charcoal Black / Multi-Resham — Size L (42")', 'publish', 'product_variation', '', '', ''),
(209, 103, 'Rabari Bandi - Deep Indigo XL', 'kt-03-indigo-xl', '', 'Colorway & Size: Deep Indigo / Crimson Mirror — Size XL (44")', 'publish', 'product_variation', '', '', ''),
(210, 104, 'Mashru Dress - Peacock Teal S', 'kt-04-peacock-s', '', 'Colorway & Size: Peacock Teal & Turmeric Stripe — Size S (36")', 'publish', 'product_variation', '', '', ''),
(211, 104, 'Mashru Dress - Peacock Teal M', 'kt-04-peacock-m', '', 'Colorway & Size: Peacock Teal & Turmeric Stripe — Size M (38")', 'publish', 'product_variation', '', '', ''),
(212, 104, 'Mashru Dress - Crimson Emerald L', 'kt-04-madder-l', '', 'Colorway & Size: Crimson & Emerald Stripe — Size L (41")', 'publish', 'product_variation', '', '', ''),
(213, 105, 'Bhujodi Shawl - Natural Kora Terracotta', 'kt-05-ecru-terracotta', '', 'Colorway & Size: Natural Kora / Terracotta & Charcoal Motifs', 'publish', 'product_variation', '', '', ''),
(214, 105, 'Bhujodi Shawl - Deep Indigo Kora', 'kt-05-indigo-ecru', '', 'Colorway & Size: Deep Indigo / Kora Extra-Weft Motifs', 'publish', 'product_variation', '', '', ''),
(215, 106, 'Bandhani Odhani - Madder Crimson Saffron', 'kt-06-crimson-haldi', '', 'Colorway & Size: Madder Crimson & Haldi Saffron / Gold Zari', 'publish', 'product_variation', '', '', ''),
(216, 106, 'Bandhani Odhani - Morpankh Emerald', 'kt-06-morpankh-indigo', '', 'Colorway & Size: Morpankh Emerald & Deep Maroon / Gold Zari', 'publish', 'product_variation', '', '', '');

-- Product Category & Type Relationships
REPLACE INTO `wp_term_relationships` (`object_id`, `term_taxonomy_id`) VALUES
(101, 2), (101, 4),
(102, 2), (102, 5),
(103, 2), (103, 5),
(104, 2), (104, 4),
(105, 2), (105, 6),
(106, 2), (106, 6);

-- Product Metadata (SKUs, Prices, Kutchi Craft Villages, Dimensions, Swatches)
REPLACE INTO `wp_postmeta` (`post_id`, `meta_key`, `meta_value`) VALUES
(101, '_sku', 'KT-01'), (101, '_price', '4850'), (101, '_regular_price', '4850'), (101, '_stock_status', 'instock'),
(101, '_bb_sub_category', 'Ajrakh Block Print'), (101, '_bb_craft_village', 'Ajrakhpur, Kutch'),
(101, '_bb_primary_material', 'Organic Cotton · Natural Indigo & Madder'), (101, '_bb_lead_time_days', '2'),
(101, '_bb_dimensions_json', '{"chestOrWidthCm":104,"lengthCm":112,"sleeveOrBorderCm":58,"fabricWeightGsm":145,"isDrape":false}'),
(101, '_bb_finishes_json', '[{"id":"indigo-madder-s","name":"Indigo & Madder Crimson — Size S (Chest 38\\")","swatchHex":"#1E3A5F","priceDelta":0,"leadTimeDays":2},{"id":"indigo-madder-m","name":"Indigo & Madder Crimson — Size M (Chest 40\\")","swatchHex":"#25476E","priceDelta":0,"leadTimeDays":2},{"id":"kashish-earth-l","name":"Kashish Iron-Earth & Indigo — Size L (Chest 42\\")","swatchHex":"#5A382E","priceDelta":250,"leadTimeDays":3}]'),

(102, '_sku', 'KT-02'), (102, '_price', '3950'), (102, '_regular_price', '3950'), (102, '_stock_status', 'instock'),
(102, '_bb_sub_category', 'Kediyu & Wrap Tops'), (102, '_bb_craft_village', 'Bhujodi & Khamir Cluster, Kutch'),
(102, '_bb_primary_material', '100% Rain-Fed Indigenous Kala Cotton'), (102, '_bb_lead_time_days', '2'),
(102, '_bb_dimensions_json', '{"chestOrWidthCm":99,"lengthCm":68,"sleeveOrBorderCm":56,"fabricWeightGsm":165,"isDrape":false}'),
(102, '_bb_finishes_json', '[{"id":"kora-ecru-s","name":"Unbleached Kora Ecru — Size S (Bust/Chest 36\\")","swatchHex":"#EAE2D3","priceDelta":0,"leadTimeDays":2},{"id":"kora-ecru-m","name":"Unbleached Kora Ecru — Size M (Bust/Chest 38\\")","swatchHex":"#E4DBC9","priceDelta":0,"leadTimeDays":2},{"id":"kora-ecru-l","name":"Unbleached Kora Ecru — Size L (Bust/Chest 41\\")","swatchHex":"#DDD3BE","priceDelta":0,"leadTimeDays":2}]'),

(103, '_sku', 'KT-03'), (103, '_price', '5600'), (103, '_regular_price', '5600'), (103, '_stock_status', 'instock'),
(103, '_bb_sub_category', 'Embroidered Jackets'), (103, '_bb_craft_village', 'Sumrasar Sheikh, Kutch'),
(103, '_bb_primary_material', 'Handspun Kala Cotton & Shisha Mirrors'), (103, '_bb_lead_time_days', '3'),
(103, '_bb_dimensions_json', '{"chestOrWidthCm":104,"lengthCm":69,"sleeveOrBorderCm":24,"fabricWeightGsm":220,"isDrape":false}'),
(103, '_bb_finishes_json', '[{"id":"charcoal-rabari-m","name":"Charcoal Black / Multi-Resham — Size M (40\\")","swatchHex":"#2B2D2F","priceDelta":0,"leadTimeDays":3},{"id":"charcoal-rabari-l","name":"Charcoal Black / Multi-Resham — Size L (42\\")","swatchHex":"#1F2022","priceDelta":0,"leadTimeDays":3},{"id":"deep-indigo-rabari-xl","name":"Deep Indigo / Crimson Mirror — Size XL (44\\")","swatchHex":"#1D2E4A","priceDelta":300,"leadTimeDays":5}]'),

(104, '_sku', 'KT-04'), (104, '_price', '7400'), (104, '_regular_price', '7400'), (104, '_stock_status', 'instock'),
(104, '_bb_sub_category', 'Mashru Silk Apparel'), (104, '_bb_craft_village', 'Mandvi & Bhuj, Kutch'),
(104, '_bb_primary_material', 'Handloom Mashru Silk-Cotton & Suf Stitch'), (104, '_bb_lead_time_days', '5'),
(104, '_bb_dimensions_json', '{"chestOrWidthCm":102,"lengthCm":108,"sleeveOrBorderCm":46,"fabricWeightGsm":175,"isDrape":false}'),
(104, '_bb_finishes_json', '[{"id":"peacock-turmeric-s","name":"Peacock Teal & Turmeric Stripe — Size S (36\\")","swatchHex":"#136F72","priceDelta":0,"leadTimeDays":5},{"id":"peacock-turmeric-m","name":"Peacock Teal & Turmeric Stripe — Size M (38\\")","swatchHex":"#C58B24","priceDelta":0,"leadTimeDays":5},{"id":"madder-emerald-l","name":"Crimson & Emerald Stripe — Size L (41\\")","swatchHex":"#8E2430","priceDelta":400,"leadTimeDays":6}]'),

(105, '_sku', 'KT-05'), (105, '_price', '4200'), (105, '_regular_price', '4200'), (105, '_stock_status', 'instock'),
(105, '_bb_sub_category', 'Bhujodi Handloom'), (105, '_bb_craft_village', 'Bhujodi Village, Kutch'),
(105, '_bb_primary_material', 'Pit-Loom Kala Cotton · Extra-Weft'), (105, '_bb_lead_time_days', '1'),
(105, '_bb_dimensions_json', '{"chestOrWidthCm":92,"lengthCm":215,"sleeveOrBorderCm":18,"fabricWeightGsm":190,"isDrape":true}'),
(105, '_bb_finishes_json', '[{"id":"ecru-terracotta-charcoal","name":"Natural Kora / Terracotta & Charcoal Motifs","swatchHex":"#B6533E","priceDelta":0,"leadTimeDays":1},{"id":"indigo-ecru-dhabla","name":"Deep Indigo / Kora Extra-Weft Motifs","swatchHex":"#233B5D","priceDelta":350,"leadTimeDays":2}]'),

(106, '_sku', 'KT-06'), (106, '_price', '11800'), (106, '_regular_price', '11800'), (106, '_stock_status', 'instock'),
(106, '_bb_sub_category', 'Kutchi Bandhani'), (106, '_bb_craft_village', 'Bhuj & Mandvi, Kutch'),
(106, '_bb_primary_material', 'Pure Gajji Silk & Zari Pallu'), (106, '_bb_lead_time_days', '6'),
(106, '_bb_dimensions_json', '{"chestOrWidthCm":110,"lengthCm":245,"sleeveOrBorderCm":22,"fabricWeightGsm":115,"isDrape":true}'),
(106, '_bb_finishes_json', '[{"id":"crimson-haldi-gajji","name":"Madder Crimson & Haldi Saffron / Gold Zari","swatchHex":"#981B2B","priceDelta":0,"leadTimeDays":6},{"id":"morpankh-indigo-gajji","name":"Morpankh Emerald & Deep Maroon / Gold Zari","swatchHex":"#15524B","priceDelta":600,"leadTimeDays":7}]'),

-- Variation Prices & SKUs
(201, '_sku', 'KT-01-INDIGO-S'), (201, '_price', '4850'), (201, '_regular_price', '4850'), (201, '_stock_status', 'instock'),
(202, '_sku', 'KT-01-INDIGO-M'), (202, '_price', '4850'), (202, '_regular_price', '4850'), (202, '_stock_status', 'instock'),
(203, '_sku', 'KT-01-KASHISH-L'), (203, '_price', '5100'), (203, '_regular_price', '5100'), (203, '_stock_status', 'instock'),
(204, '_sku', 'KT-02-KORA-S'), (204, '_price', '3950'), (204, '_regular_price', '3950'), (204, '_stock_status', 'instock'),
(205, '_sku', 'KT-02-KORA-M'), (205, '_price', '3950'), (205, '_regular_price', '3950'), (205, '_stock_status', 'instock'),
(206, '_sku', 'KT-02-KORA-L'), (206, '_price', '3950'), (206, '_regular_price', '3950'), (206, '_stock_status', 'instock'),
(207, '_sku', 'KT-03-CHARCOAL-M'), (207, '_price', '5600'), (207, '_regular_price', '5600'), (207, '_stock_status', 'instock'),
(208, '_sku', 'KT-03-CHARCOAL-L'), (208, '_price', '5600'), (208, '_regular_price', '5600'), (208, '_stock_status', 'instock'),
(209, '_sku', 'KT-03-INDIGO-XL'), (209, '_price', '5900'), (209, '_regular_price', '5900'), (209, '_stock_status', 'instock'),
(210, '_sku', 'KT-04-PEACOCK-S'), (210, '_price', '7400'), (210, '_regular_price', '7400'), (210, '_stock_status', 'instock'),
(211, '_sku', 'KT-04-PEACOCK-M'), (211, '_price', '7400'), (211, '_regular_price', '7400'), (211, '_stock_status', 'instock'),
(212, '_sku', 'KT-04-MADDER-L'), (212, '_price', '7800'), (212, '_regular_price', '7800'), (212, '_stock_status', 'instock'),
(213, '_sku', 'KT-05-KORA-TERRA'), (213, '_price', '4200'), (213, '_regular_price', '4200'), (213, '_stock_status', 'instock'),
(214, '_sku', 'KT-05-INDIGO-KORA'), (214, '_price', '4550'), (214, '_regular_price', '4550'), (214, '_stock_status', 'instock'),
(215, '_sku', 'KT-06-CRIMSON-HALDI'), (215, '_price', '11800'), (215, '_regular_price', '11800'), (215, '_stock_status', 'instock'),
(216, '_sku', 'KT-06-MORPANKH-EMERALD'), (216, '_price', '12400'), (216, '_regular_price', '12400'), (216, '_stock_status', 'instock');

-- WooCommerce Product Lookup Table
REPLACE INTO `wp_wc_product_meta_lookup` (`product_id`, `sku`, `min_price`, `max_price`, `stock_status`, `rating_count`, `average_rating`) VALUES
(101, 'KT-01', 4850.0000, 5100.0000, 'instock', 2, 5.00),
(102, 'KT-02', 3950.0000, 3950.0000, 'instock', 1, 5.00),
(103, 'KT-03', 5600.0000, 5900.0000, 'instock', 1, 5.00),
(104, 'KT-04', 7400.0000, 7800.0000, 'instock', 1, 5.00),
(105, 'KT-05', 4200.0000, 4550.0000, 'instock', 1, 5.00),
(106, 'KT-06', 11800.0000, 12400.0000, 'instock', 1, 5.00);

-- ----------------------------------------------------------------------------
-- 7. WooCommerce Tax Rates (5% Handloom GST) & Pan-India Shipping Zones
-- ----------------------------------------------------------------------------
REPLACE INTO `wp_woocommerce_tax_rates` (`tax_rate_id`, `tax_rate_country`, `tax_rate_state`, `tax_rate`, `tax_rate_name`, `tax_rate_priority`, `tax_rate_order`, `tax_rate_class`) VALUES
(1, 'IN', '', '5.0000', 'Handloom GST (5%)', 1, 1, '');

REPLACE INTO `wp_woocommerce_shipping_zones` (`zone_id`, `zone_name`, `zone_order`) VALUES
(1, 'Pan-India Insured Courier', 1);

REPLACE INTO `wp_woocommerce_shipping_zone_methods` (`zone_id`, `instance_id`, `method_id`, `method_order`, `is_enabled`) VALUES
(1, 1, 'free_shipping', 1, 1),
(1, 2, 'flat_rate', 2, 1),
(1, 3, 'flat_rate', 3, 1);

-- ----------------------------------------------------------------------------
-- 8. Verified Patron Reviews (wp_comments & wp_commentmeta)
-- ----------------------------------------------------------------------------
REPLACE INTO `wp_comments` (`comment_ID`, `comment_post_ID`, `comment_author`, `comment_date`, `comment_content`, `comment_approved`, `comment_type`) VALUES
(501, 101, 'Nandini Mehta', '2026-10-12 10:15:00', 'You can immediately tell real natural-dyed Ajrakh from screen-printed imitations by the crisp back-and-front block registration and cool breathable handfeel in Gujarat heat.', '1', 'review'),
(502, 101, 'Rohan Deshmukh', '2026-09-20 14:30:00', 'French seams inside are immaculate and the collar sits flat. After three cold shade-dried washes the cotton feels like butter.', '1', 'review'),
(503, 102, 'Kavita Jadeja', '2026-10-08 11:00:00', 'Pairs beautifully with both indigo denims and wide cotton palazzos. The Bhujodi border along the neckline and handmade tassels show genuine Kutchi detail.', '1', 'review'),
(504, 103, 'Siddharth Rao', '2026-10-18 16:45:00', 'Wore this over a kora cotton kurta for an exhibition opening. Every mirror is hand-locked in dense threadwork—not glued plastic!', '1', 'review'),
(505, 104, 'Ananya Sen', '2026-09-25 13:20:00', 'Mashru is pure textile genius. Even in humid weather the cotton backing breathes effortlessly, and the mathematical precision of the Suf yoke is breathtaking.', '1', 'review'),
(506, 105, 'Vikramaditya Joshi', '2026-10-14 09:40:00', 'The raised extra-weft diamonds have incredible tactile character. Works equally well over a bandhgala, kurta, or winter coat.', '1', 'review'),
(507, 106, 'Meenakshi Thakkar', '2026-10-22 18:10:00', 'Growing up with Kutch textiles in our family, finding true fine-knot Khatri Bandhani on real Gajji silk online is rare. Worth every rupee—an heirloom piece.', '1', 'review');

REPLACE INTO `wp_commentmeta` (`comment_id`, `meta_key`, `meta_value`) VALUES
(501, 'rating', '5'), (501, 'bb_review_role', 'Textile Researcher'), (501, 'bb_review_location', 'Ahmedabad'), (501, 'bb_review_title', 'Unmistakable scent and depth of real Ajrakhpur vat indigo'),
(502, 'rating', '5'), (502, 'bb_review_role', 'Architect'), (502, 'bb_review_location', 'Pune'), (502, 'bb_review_title', 'Clean tailoring with zero synthetic lining'),
(503, 'rating', '5'), (503, 'bb_review_role', 'Design Educator'), (503, 'bb_review_location', 'Vadodara'), (503, 'bb_review_title', 'Authentic Kediyu flare adapted effortlessly for daily wear'),
(504, 'rating', '5'), (504, 'bb_review_role', 'Documentary Filmmaker'), (504, 'bb_review_location', 'Mumbai'), (504, 'bb_review_title', 'Heirloom embroidery that elevates a plain white kurta instantly'),
(505, 'rating', '5'), (505, 'bb_review_role', 'Curator'), (505, 'bb_review_location', 'Bengaluru'), (505, 'bb_review_title', 'Lustrous like pure silk outside, cool like soft mulmul inside'),
(506, 'rating', '5'), (506, 'bb_review_role', 'Professor of Literature'), (506, 'bb_review_location', 'New Delhi'), (506, 'bb_review_title', 'Substantial handspun drape for winter mornings and travel'),
(507, 'rating', '5'), (507, 'bb_review_role', 'Classical Vocalist'), (507, 'bb_review_location', 'Mumbai'), (507, 'bb_review_title', 'Museum-grade rai knots and unmistakable Gajji silk fall');

-- ----------------------------------------------------------------------------
-- 9. Sample WooCommerce HPOS Order (#BB-1042)
-- ----------------------------------------------------------------------------
REPLACE INTO `wp_wc_orders` (`id`, `status`, `currency`, `type`, `tax_amount`, `total_amount`, `customer_id`, `billing_email`, `date_created_gmt`, `date_updated_gmt`, `payment_method`, `payment_method_title`, `customer_note`) VALUES
(1042, 'wc-processing', 'INR', 'shop_order', 453.00000000, 9503.00000000, 2, 'devanshi.jadeja@example.in', '2026-11-14 09:30:00', '2026-11-14 09:30:00', 'cod', 'Cash on Delivery (COD)', 'Call on mobile before doorstep delivery.');

REPLACE INTO `wp_wc_order_addresses` (`id`, `order_id`, `address_type`, `first_name`, `last_name`, `address_1`, `address_2`, `city`, `state`, `postcode`, `country`, `email`, `phone`) VALUES
(1, 1042, 'billing', 'Devanshi', 'Jadeja', '14, Sanskar Nagar, Near Jubilee Ground', 'Opp. Craft Heritage Haveli', 'Bhuj, Kutch', 'GJ', '370001', 'IN', 'devanshi.jadeja@example.in', '+91 98250 44120');

REPLACE INTO `wp_woocommerce_order_items` (`order_item_id`, `order_item_name`, `order_item_type`, `order_id`) VALUES
(1, 'Ajrakhpur 16-Step Natural Indigo Kurta — Size M (Chest 40")', 'line_item', 1042),
(2, 'Bhujodi Extra-Weft Kala Cotton Shawl — Natural Kora', 'line_item', 1042);

REPLACE INTO `wp_woocommerce_order_itemmeta` (`order_item_id`, `meta_key`, `meta_value`) VALUES
(1, '_product_id', '101'), (1, '_variation_id', '202'), (1, '_qty', '1'), (1, '_line_total', '4850'),
(2, '_product_id', '105'), (2, '_variation_id', '213'), (2, '_qty', '1'), (2, '_line_total', '4200');

SET FOREIGN_KEY_CHECKS = 1;
