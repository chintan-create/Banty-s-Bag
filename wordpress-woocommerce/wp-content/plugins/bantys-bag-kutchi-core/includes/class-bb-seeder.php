<?php
/**
 * Idempotent WordPress + WooCommerce Catalog, Coupon, Page, and Review Seeder
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BB_Catalog_Seeder {

	public static function activate_and_seed() {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		// 1. Configure INR currency & Indian store defaults
		update_option( 'woocommerce_currency', 'INR' );
		update_option( 'woocommerce_currency_pos', 'left' );
		update_option( 'woocommerce_price_num_decimals', 0 );
		update_option( 'woocommerce_default_country', 'IN:GJ' );
		update_option( 'woocommerce_store_address', 'Station Road, Near Hamirsar Lake' );
		update_option( 'woocommerce_store_city', 'Bhuj' );
		update_option( 'woocommerce_store_postcode', '370001' );
		update_option( 'woocommerce_enable_coupons', 'yes' );

		// 2. Ensure core WooCommerce product categories
		$cats = array(
			'kurtas-tunics'   => 'Kurtas & Tunics',
			'kediyu-jackets'  => 'Kediyu & Jackets',
			'shawls-dupattas' => 'Shawls & Dupattas',
		);
		$cat_ids = array();
		foreach ( $cats as $slug => $label ) {
			$term = term_exists( $slug, 'product_cat' );
			if ( ! $term ) {
				$term = wp_insert_term( $label, 'product_cat', array( 'slug' => $slug ) );
			}
			if ( ! is_wp_error( $term ) ) {
				$cat_ids[ $slug ] = (int) ( is_array( $term ) ? $term['term_id'] : $term );
			}
		}

		// 3. Seed Coupons (KUTCH10, BHUJ10)
		foreach ( array( 'KUTCH10', 'BHUJ10' ) as $code ) {
			if ( ! wc_get_coupon_id_by_code( $code ) ) {
				$coupon = new WC_Coupon();
				$coupon->set_code( $code );
				$coupon->set_discount_type( 'percent' );
				$coupon->set_amount( 10 );
				$coupon->set_description( '10% Kutch craft patron discount' );
				$coupon->save();
			}
		}

		// 4. Create Orders Tracking page if missing
		if ( ! get_page_by_path( 'orders' ) ) {
			wp_insert_post( array(
				'post_title'   => 'Orders & GST Receipts',
				'post_name'    => 'orders',
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'page_template'=> 'page-orders.php',
			) );
		}

		// 5. Seed the 6 Kutchi Handloom Variable Products
		$catalog = self::get_seed_catalog();
		foreach ( $catalog as $item ) {
			if ( wc_get_product_id_by_sku( $item['sku'] ) ) {
				continue;
			}

			$product = new WC_Product_Variable();
			$product->set_name( $item['name'] );
			$product->set_slug( $item['slug'] );
			$product->set_sku( $item['sku'] );
			$product->set_status( 'publish' );
			$product->set_description( $item['summary'] );
			$product->set_short_description( $item['primary_material'] );
			$product->set_regular_price( (string) $item['base_price'] );
			$product->set_manage_stock( false );
			$product->set_stock_status( 'instock' );
			if ( isset( $cat_ids[ $item['category_slug'] ] ) ) {
				$product->set_category_ids( array( $cat_ids[ $item['category_slug'] ] ) );
			}

			$attr = new WC_Product_Attribute();
			$attr->set_name( 'Colorway & Size' );
			$attr->set_options( array_column( $item['finishes'], 'name' ) );
			$attr->set_visible( true );
			$attr->set_variation( true );
			$product->set_attributes( array( $attr ) );

			$pid = $product->save();

			update_post_meta( $pid, '_bb_sub_category', $item['sub_category'] );
			update_post_meta( $pid, '_bb_craft_village', $item['craft_village'] );
			update_post_meta( $pid, '_bb_primary_material', $item['primary_material'] );
			update_post_meta( $pid, '_bb_lead_time_days', $item['lead_time_days'] );
			update_post_meta( $pid, '_bb_craft_notes_json', wp_json_encode( $item['craft_notes'] ) );
			update_post_meta( $pid, '_bb_care_notes_json', wp_json_encode( $item['care_notes'] ) );
			update_post_meta( $pid, '_bb_dimensions_json', wp_json_encode( $item['dimensions'] ) );
			update_post_meta( $pid, '_bb_finishes_json', wp_json_encode( $item['finishes'] ) );

			foreach ( $item['finishes'] as $finish ) {
				$var = new WC_Product_Variation();
				$var->set_parent_id( $pid );
				$var->set_sku( $item['sku'] . '-' . strtoupper( $finish['id'] ) );
				$var->set_regular_price( (string) ( $item['base_price'] + $finish['priceDelta'] ) );
				$var->set_stock_status( 'instock' );
				$var->set_attributes( array( 'colorway-size' => $finish['name'] ) );
				$var->save();
			}

			foreach ( $item['reviews'] as $rev ) {
				$cid = wp_insert_comment( array(
					'comment_post_ID'  => $pid,
					'comment_author'   => $rev['author'],
					'comment_content'  => $rev['comment'],
					'comment_type'     => 'review',
					'comment_approved' => 1,
				) );
				if ( $cid ) {
					update_comment_meta( $cid, 'rating', $rev['rating'] );
					update_comment_meta( $cid, 'bb_review_role', $rev['role'] );
					update_comment_meta( $cid, 'bb_review_location', $rev['location'] );
					update_comment_meta( $cid, 'bb_review_title', $rev['title'] );
				}
			}
		}

		flush_rewrite_rules();
	}

	private static function get_seed_catalog() {
		return array(
			array(
				'slug'             => 'ajrakhpur-16-step-natural-indigo-kurta',
				'sku'              => 'KT-01',
				'name'             => 'Ajrakhpur 16-Step Natural Indigo Kurta',
				'category_slug'    => 'kurtas-tunics',
				'sub_category'     => 'Ajrakh Block Print',
				'craft_village'    => 'Ajrakhpur, Kutch',
				'primary_material' => 'Organic Cotton · Natural Indigo & Madder',
				'base_price'       => 4850,
				'lead_time_days'   => 2,
				'summary'          => 'Hand-block printed in Ajrakhpur using carved seasoned Burma teak blocks through a traditional 16-stage process of camel-dung scouring, myrobalan mordanting, lime-arabic gum resist, natural indigo vat dyeing, and alizarin madder boiling.',
				'craft_notes'      => array(
					'Authentic double-sided Riyazi star-and-trellis motifs stamped by 9th-generation Khatri master printers',
					'100% plant and mineral dyes: fermented natural indigo (neel), madder root (majith), and rusted iron-jaggery (kat)',
					'Finished with French-seamed interiors, side pockets, and hand-turned coconut shell buttons',
				),
				'care_notes'       => array(
					'Hand-wash separately in cold water using mild pH-neutral soap (reetha or gentle liquid wash)',
					'Dry strictly in shade to preserve natural indigo depth; natural plant dyes soften and mellow over wear',
				),
				'dimensions'       => array( 'chestOrWidthCm' => 104, 'lengthCm' => 112, 'sleeveOrBorderCm' => 58, 'fabricWeightGsm' => 145, 'isDrape' => false ),
				'finishes'         => array(
					array( 'id' => 'indigo-madder-s', 'name' => 'Indigo & Madder Crimson — Size S (Chest 38")', 'swatchHex' => '#1E3A5F', 'priceDelta' => 0, 'leadTimeDays' => 2 ),
					array( 'id' => 'indigo-madder-m', 'name' => 'Indigo & Madder Crimson — Size M (Chest 40")', 'swatchHex' => '#25476E', 'priceDelta' => 0, 'leadTimeDays' => 2 ),
					array( 'id' => 'kashish-earth-l', 'name' => 'Kashish Iron-Earth & Indigo — Size L (Chest 42")', 'swatchHex' => '#5A382E', 'priceDelta' => 250, 'leadTimeDays' => 3 ),
				),
				'reviews'          => array(
					array( 'author' => 'Nandini Mehta', 'role' => 'Textile Researcher', 'location' => 'Ahmedabad', 'rating' => 5, 'title' => 'Unmistakable scent and depth of real Ajrakhpur vat indigo', 'comment' => 'You can immediately tell real natural-dyed Ajrakh from screen-printed imitations by the crisp back-and-front block registration and cool breathable handfeel in Gujarat heat.' ),
					array( 'author' => 'Rohan Deshmukh', 'role' => 'Architect', 'location' => 'Pune', 'rating' => 5, 'title' => 'Clean tailoring with zero synthetic lining', 'comment' => 'French seams inside are immaculate and the collar sits flat. After three cold shade-dried washes the cotton feels like butter.' ),
				),
			),
			array(
				'slug'             => 'kediyu-pintucked-kala-cotton-angrakha',
				'sku'              => 'KT-02',
				'name'             => 'Kediyu Pintucked Kala Cotton Angrakha',
				'category_slug'    => 'kediyu-jackets',
				'sub_category'     => 'Kediyu & Wrap Tops',
				'craft_village'    => 'Bhujodi & Khamir Cluster, Kutch',
				'primary_material' => '100% Rain-Fed Indigenous Kala Cotton',
				'base_price'       => 3950,
				'lead_time_days'   => 2,
				'summary'          => 'A contemporary everyday silhouette rooted in the pastoral Kutchi Kediyu—tailored from zero-irrigation indigenous short-staple Kala cotton with fine diagonal chest pintucks, gentle waist gathers, and handwoven Bhujodi border trims.',
				'craft_notes'      => array(
					'Woven from 100% organic rain-fed Kutchi Kala cotton grown without synthetic pesticides or groundwater irrigation',
					'Hand-pleated chest yoke paired with double side-tie cords finished with handmade red-and-indigo cotton foomka tassels',
					'Trimmed at cuffs and crossover placket with extra-weft pit-loom borders woven in Bhujodi',
				),
				'care_notes'       => array(
					'Gentle cold hand-wash or delicate cycle inside a laundry bag to protect handmade tassels',
					'Steam or warm-iron while slightly damp; unbleached Kala cotton grows softer with every wash',
				),
				'dimensions'       => array( 'chestOrWidthCm' => 99, 'lengthCm' => 68, 'sleeveOrBorderCm' => 56, 'fabricWeightGsm' => 165, 'isDrape' => false ),
				'finishes'         => array(
					array( 'id' => 'kora-ecru-s', 'name' => 'Unbleached Kora Ecru — Size S (Bust/Chest 36")', 'swatchHex' => '#EAE2D3', 'priceDelta' => 0, 'leadTimeDays' => 2 ),
					array( 'id' => 'kora-ecru-m', 'name' => 'Unbleached Kora Ecru — Size M (Bust/Chest 38")', 'swatchHex' => '#E4DBC9', 'priceDelta' => 0, 'leadTimeDays' => 2 ),
					array( 'id' => 'kora-ecru-l', 'name' => 'Unbleached Kora Ecru — Size L (Bust/Chest 41")', 'swatchHex' => '#DDD3BE', 'priceDelta' => 0, 'leadTimeDays' => 2 ),
				),
				'reviews'          => array(
					array( 'author' => 'Kavita Jadeja', 'role' => 'Design Educator', 'location' => 'Vadodara', 'rating' => 5, 'title' => 'Authentic Kediyu flare adapted effortlessly for daily wear', 'comment' => 'Pairs beautifully with both indigo denims and wide cotton palazzos. The Bhujodi border along the neckline and handmade tassels show genuine Kutchi detail.' ),
				),
			),
			array(
				'slug'             => 'rabari-abhla-mirror-kala-cotton-bandi',
				'sku'              => 'KT-03',
				'name'             => 'Rabari Abhla Mirror Kala Cotton Bandi',
				'category_slug'    => 'kediyu-jackets',
				'sub_category'     => 'Embroidered Jackets',
				'craft_village'    => 'Sumrasar Sheikh, Kutch',
				'primary_material' => 'Handspun Kala Cotton & Shisha Mirrors',
				'base_price'       => 5600,
				'lead_time_days'   => 3,
				'summary'          => 'Tailored from structured charcoal-dyed Kala cotton and hand-embroidered by women artisans of the pastoral Rabari community in Sumrasar using real glass shisha mirrors (abhla), chain stitch (sankali), and vibrant resham accents.',
				'craft_notes'      => array(
					'Each collar yoke and twin patch pocket requires 18+ hours of freehand Rabari needlework and mirror couching',
					'Woven on traditional pit looms in weighty 220 GSM handspun Kala cotton with soft unbleached mulmul lining',
					'Hand-carved sheesham wood front buttons and clean welt chest pocket',
				),
				'care_notes'       => array(
					'Spot-clean or dry-clean only to preserve hand-couched glass shisha mirrors and silk embroidery threads',
					'Air out in indirect breeze after wear; store on a wide wooden hanger',
				),
				'dimensions'       => array( 'chestOrWidthCm' => 104, 'lengthCm' => 69, 'sleeveOrBorderCm' => 24, 'fabricWeightGsm' => 220, 'isDrape' => false ),
				'finishes'         => array(
					array( 'id' => 'charcoal-rabari-m', 'name' => 'Charcoal Black / Multi-Resham — Size M (40")', 'swatchHex' => '#2B2D2F', 'priceDelta' => 0, 'leadTimeDays' => 3 ),
					array( 'id' => 'charcoal-rabari-l', 'name' => 'Charcoal Black / Multi-Resham — Size L (42")', 'swatchHex' => '#1F2022', 'priceDelta' => 0, 'leadTimeDays' => 3 ),
					array( 'id' => 'deep-indigo-rabari-xl', 'name' => 'Deep Indigo / Crimson Mirror — Size XL (44")', 'swatchHex' => '#1D2E4A', 'priceDelta' => 300, 'leadTimeDays' => 5 ),
				),
				'reviews'          => array(
					array( 'author' => 'Siddharth Rao', 'role' => 'Documentary Filmmaker', 'location' => 'Mumbai', 'rating' => 5, 'title' => 'Heirloom embroidery that elevates a plain white kurta instantly', 'comment' => 'Wore this over a kora cotton kurta for an exhibition opening. Every mirror is hand-locked in dense threadwork—not glued plastic!' ),
				),
			),
			array(
				'slug'             => 'mashru-silk-cotton-suf-embroidered-dress',
				'sku'              => 'KT-04',
				'name'             => 'Mashru Silk-Cotton Suf Embroidered Dress',
				'category_slug'    => 'kurtas-tunics',
				'sub_category'     => 'Mashru Silk Apparel',
				'craft_village'    => 'Mandvi & Bhuj, Kutch',
				'primary_material' => 'Handloom Mashru Silk-Cotton & Suf Stitch',
				'base_price'       => 7400,
				'lead_time_days'   => 5,
				'summary'          => 'Woven in the historic satin-weave Mashru technique—placing lustrous jewel-striped mulberry silk on the exterior face while keeping pure soft cotton against the skin—crowned with counted-thread geometric Suf embroidery.',
				'craft_notes'      => array(
					'Traditional warp-faced satin weave (silk outside, breathable cotton inside) engineered for desert-to-evening comfort',
					'Counted-thread Suf triangle embroidery worked from the reverse side of the cloth without drawn guidelines',
					'Relaxed A-line midi silhouette with concealed in-seam pockets and three-quarter sleeves',
				),
				'care_notes'       => array(
					'Dry-clean recommended to retain the luminous satin sheen of the silk warp',
					'Steam lightly from the reverse cotton face on low heat; never spray water directly onto Mashru silk',
				),
				'dimensions'       => array( 'chestOrWidthCm' => 102, 'lengthCm' => 108, 'sleeveOrBorderCm' => 46, 'fabricWeightGsm' => 175, 'isDrape' => false ),
				'finishes'         => array(
					array( 'id' => 'peacock-turmeric-s', 'name' => 'Peacock Teal & Turmeric Stripe — Size S (36")', 'swatchHex' => '#136F72', 'priceDelta' => 0, 'leadTimeDays' => 5 ),
					array( 'id' => 'peacock-turmeric-m', 'name' => 'Peacock Teal & Turmeric Stripe — Size M (38")', 'swatchHex' => '#C58B24', 'priceDelta' => 0, 'leadTimeDays' => 5 ),
					array( 'id' => 'madder-emerald-l', 'name' => 'Crimson & Emerald Stripe — Size L (41")', 'swatchHex' => '#8E2430', 'priceDelta' => 400, 'leadTimeDays' => 6 ),
				),
				'reviews'          => array(
					array( 'author' => 'Ananya Sen', 'role' => 'Curator', 'location' => 'Bengaluru', 'rating' => 5, 'title' => 'Lustrous like pure silk outside, cool like soft mulmul inside', 'comment' => 'Mashru is pure textile genius. Even in humid weather the cotton backing breathes effortlessly, and the mathematical precision of the Suf yoke is breathtaking.' ),
				),
			),
			array(
				'slug'             => 'bhujodi-extra-weft-kala-cotton-shawl',
				'sku'              => 'KT-05',
				'name'             => 'Bhujodi Extra-Weft Kala Cotton Shawl',
				'category_slug'    => 'shawls-dupattas',
				'sub_category'     => 'Bhujodi Handloom',
				'craft_village'    => 'Bhujodi Village, Kutch',
				'primary_material' => 'Pit-Loom Kala Cotton · Extra-Weft',
				'base_price'       => 4200,
				'lead_time_days'   => 1,
				'summary'          => 'Handwoven on throw-shuttle pit looms by Vankar master weavers in Bhujodi village, featuring tactile raised Chaumak and Sachchi Kor geometric motifs inserted by hand between weft picks—resembling embroidery woven directly on the loom.',
				'craft_notes'      => array(
					'GI-tagged Kutchi weaving heritage practiced by Vankar artisan families in Bhujodi',
					'Hand-inserted extra-weft geometric borders in iron-black and madder terracotta on unbleached Kala cotton',
					'Generous 215 × 92 cm full-shoulder wrap finished with hand-knotted twisted warp fringes',
				),
				'care_notes'       => array(
					'Gentle cold hand-wash with mild liquid detergent; do not wring or bleach',
					'Dry flat in shade and press with a medium steam iron',
				),
				'dimensions'       => array( 'chestOrWidthCm' => 92, 'lengthCm' => 215, 'sleeveOrBorderCm' => 18, 'fabricWeightGsm' => 190, 'isDrape' => true ),
				'finishes'         => array(
					array( 'id' => 'ecru-terracotta-charcoal', 'name' => 'Natural Kora / Terracotta & Charcoal Motifs', 'swatchHex' => '#B6533E', 'priceDelta' => 0, 'leadTimeDays' => 1 ),
					array( 'id' => 'indigo-ecru-dhabla', 'name' => 'Deep Indigo / Kora Extra-Weft Motifs', 'swatchHex' => '#233B5D', 'priceDelta' => 350, 'leadTimeDays' => 2 ),
				),
				'reviews'          => array(
					array( 'author' => 'Vikramaditya Joshi', 'role' => 'Professor of Literature', 'location' => 'New Delhi', 'rating' => 5, 'title' => 'Substantial handspun drape for winter mornings and travel', 'comment' => 'The raised extra-weft diamonds have incredible tactile character. Works equally well over a bandhgala, kurta, or winter coat.' ),
				),
			),
			array(
				'slug'             => 'jhinkhu-bandhani-pure-gajji-silk-odhani',
				'sku'              => 'KT-06',
				'name'             => 'Jhinkhu Bandhani Pure Gajji Silk Odhani',
				'category_slug'    => 'shawls-dupattas',
				'sub_category'     => 'Kutchi Bandhani',
				'craft_village'    => 'Bhuj & Mandvi, Kutch',
				'primary_material' => 'Pure Gajji Silk & Zari Pallu',
				'base_price'       => 11800,
				'lead_time_days'   => 6,
				'summary'          => 'An heirloom Kutchi Jhinkhu (fine-dot) Bandhani odhani worked on fluid, heavy-drape pure Gajji silk—hand-pinched and tied with over 18,000 tiny rai knots by Khatri women artisans in Bhuj and Mandvi before sequential resist-dyeing in saffron and madder crimson.',
				'craft_notes'      => array(
					'Over 18,000 individual fingernail-pinched tie-dye knots forming traditional Rasamandala medallion and बेल (vine) borders',
					'Dyed on heavy satin-weave pure Gajji silk with authentic woven golden zari lagdi pallu and selvedge',
					'Delivered partially crushed to showcase authentic hand-tied relief (can be worn textured or steam-relaxed)',
				),
				'care_notes'       => array(
					'Strictly specialist silk dry-clean only; never wash in water or expose wet silk to sunlight',
					'Wrap in unbleached cotton mulmul cloth (included with order) inside your wardrobe',
				),
				'dimensions'       => array( 'chestOrWidthCm' => 110, 'lengthCm' => 245, 'sleeveOrBorderCm' => 22, 'fabricWeightGsm' => 115, 'isDrape' => true ),
				'finishes'         => array(
					array( 'id' => 'crimson-haldi-gajji', 'name' => 'Madder Crimson & Haldi Saffron / Gold Zari', 'swatchHex' => '#981B2B', 'priceDelta' => 0, 'leadTimeDays' => 6 ),
					array( 'id' => 'morpankh-indigo-gajji', 'name' => 'Morpankh Emerald & Deep Maroon / Gold Zari', 'swatchHex' => '#15524B', 'priceDelta' => 600, 'leadTimeDays' => 7 ),
				),
				'reviews'          => array(
					array( 'author' => 'Meenakshi Thakkar', 'role' => 'Classical Vocalist', 'location' => 'Mumbai', 'rating' => 5, 'title' => 'Museum-grade rai knots and unmistakable Gajji silk fall', 'comment' => 'Growing up with Kutch textiles in our family, finding true fine-knot Khatri Bandhani on real Gajji silk online is rare. Worth every rupee—an heirloom piece.' ),
				),
			),
		);
	}
}
