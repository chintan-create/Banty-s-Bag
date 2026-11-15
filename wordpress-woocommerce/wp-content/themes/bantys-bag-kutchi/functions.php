<?php
/**
 * Banty's Bag — Kutchi Handloom & Heritage Apparel Theme Functions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BB_THEME_VERSION', '1.0.0' );
define( 'BB_FREE_SHIPPING_THRESHOLD', 5000 );

/**
 * Theme setup and WooCommerce declarations
 */
function bantys_bag_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'woocommerce', array(
		'thumbnail_image_width' => 800,
		'single_image_width'    => 1000,
		'product_grid'          => array(
			'default_rows'    => 2,
			'default_columns' => 3,
		),
	) );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
}
add_action( 'after_setup_theme', 'bantys_bag_setup' );

/**
 * Enqueue Google Fonts (Fraunces, Plus Jakarta Sans, JetBrains Mono), Theme CSS & Storefront JS
 */
function bantys_bag_scripts() {
	wp_enqueue_style(
		'bantys-bag-fonts',
		'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'bantys-bag-theme',
		get_template_directory_uri() . '/assets/css/theme.css',
		array( 'bantys-bag-fonts' ),
		BB_THEME_VERSION
	);

	wp_enqueue_script(
		'bantys-bag-storefront',
		get_template_directory_uri() . '/assets/js/storefront.js',
		array(),
		BB_THEME_VERSION,
		true
	);

	wp_localize_script( 'bantys-bag-storefront', 'bbStoreData', array(
		'ajaxUrl'               => admin_url( 'admin-ajax.php' ),
		'restUrl'               => esc_url_raw( rest_url( 'bantys-bag/v1/' ) ),
		'nonce'                 => wp_create_nonce( 'bb_store_nonce' ),
		'restNonce'             => wp_create_nonce( 'wp_rest' ),
		'freeShippingThreshold' => BB_FREE_SHIPPING_THRESHOLD,
		'checkoutUrl'           => function_exists( 'wc_get_checkout_url' ) ? wc_get_checkout_url() : home_url( '/checkout/' ),
		'cartUrl'               => function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' ),
		'shopUrl'               => function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'bantys_bag_scripts' );

/**
 * Format Indian Rupee currency cleanly (₹4,850)
 */
function bb_format_inr( $amount ) {
	$num = (int) round( (float) $amount );
	$str = (string) abs( $num );
	if ( strlen( $str ) > 3 ) {
		$last3 = substr( $str, -3 );
		$rest  = substr( $str, 0, -3 );
		$rest  = preg_replace( '/\B(?=(\d{2})+(?!\d))/', ',', $rest );
		$formatted = $rest . ',' . $last3;
	} else {
		$formatted = $str;
	}
	return ( $num < 0 ? '-₹' : '₹' ) . $formatted;
}

/**
 * Force INR currency formatting across WooCommerce
 */
add_filter( 'woocommerce_currency', function () { return 'INR'; } );
add_filter( 'woocommerce_price_trim_zeros', '__return_true' );

/**
 * Custom Indian Checkout Fields (Landmark, Delivery/Gift Notes, State selector)
 */
add_filter( 'woocommerce_checkout_fields', function ( $fields ) {
	$fields['billing']['billing_address_2']['label']       = 'Landmark / Society (Optional)';
	$fields['billing']['billing_address_2']['placeholder'] = 'Near Kutch Museum';
	$fields['billing']['billing_postcode']['label']        = 'PIN Code';
	$fields['billing']['billing_postcode']['placeholder']  = '370001';
	$fields['order']['order_comments']['label']            = 'Delivery or Gift Note (Optional)';
	$fields['order']['order_comments']['placeholder']      = 'Preferred delivery hours or gift message...';
	return $fields;
} );

/**
 * AJAX Handler: Add to WooCommerce Cart & Return Updated Bag Drawer Payload
 */
function bb_ajax_add_to_cart() {
	check_ajax_referer( 'bb_store_nonce', 'nonce' );

	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		wp_send_json_error( array( 'message' => 'WooCommerce cart unavailable.' ) );
	}

	$product_id   = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
	$variation_id = isset( $_POST['variation_id'] ) ? absint( $_POST['variation_id'] ) : 0;
	$quantity     = isset( $_POST['quantity'] ) ? max( 1, absint( $_POST['quantity'] ) ) : 1;

	if ( ! $product_id ) {
		wp_send_json_error( array( 'message' => 'Invalid product ID.' ) );
	}

	$added = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id );
	if ( ! $added ) {
		wp_send_json_error( array( 'message' => 'Unable to add garment to bag.' ) );
	}

	wp_send_json_success( bb_get_cart_drawer_payload() );
}
add_action( 'wp_ajax_bb_add_to_cart', 'bb_ajax_add_to_cart' );
add_action( 'wp_ajax_nopriv_bb_add_to_cart', 'bb_ajax_add_to_cart' );

/**
 * AJAX Handler: Update Cart Quantity / Remove Item / Apply Coupon
 */
function bb_ajax_cart_action() {
	check_ajax_referer( 'bb_store_nonce', 'nonce' );

	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		wp_send_json_error( array( 'message' => 'WooCommerce cart unavailable.' ) );
	}

	$action_type = isset( $_POST['cart_action'] ) ? sanitize_text_field( wp_unslash( $_POST['cart_action'] ) ) : '';
	$cart_key    = isset( $_POST['cart_key'] ) ? sanitize_text_field( wp_unslash( $_POST['cart_key'] ) ) : '';

	if ( 'update_qty' === $action_type && $cart_key ) {
		$qty = isset( $_POST['quantity'] ) ? max( 0, absint( $_POST['quantity'] ) ) : 0;
		WC()->cart->set_quantity( $cart_key, $qty, true );
	} elseif ( 'remove' === $action_type && $cart_key ) {
		WC()->cart->remove_cart_item( $cart_key );
	} elseif ( 'apply_coupon' === $action_type ) {
		$code = isset( $_POST['coupon_code'] ) ? strtoupper( sanitize_text_field( wp_unslash( $_POST['coupon_code'] ) ) ) : '';
		if ( $code ) {
			$applied = WC()->cart->apply_coupon( $code );
			if ( ! $applied ) {
				wp_send_json_error( array(
					'message' => 'Unrecognized code. Try KUTCH10 for 10% craft patron savings.',
				) );
			}
		}
	} elseif ( 'remove_coupon' === $action_type ) {
		$code = isset( $_POST['coupon_code'] ) ? sanitize_text_field( wp_unslash( $_POST['coupon_code'] ) ) : '';
		WC()->cart->remove_coupon( $code );
	}

	WC()->cart->calculate_totals();
	wp_send_json_success( bb_get_cart_drawer_payload() );
}
add_action( 'wp_ajax_bb_cart_action', 'bb_ajax_cart_action' );
add_action( 'wp_ajax_nopriv_bb_cart_action', 'bb_ajax_cart_action' );

/**
 * Build serialized Bag Drawer payload from live WooCommerce session cart
 */
function bb_get_cart_drawer_payload() {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return array(
			'count'        => 0,
			'subtotal'     => 0,
			'discount'     => 0,
			'shipping'     => 0,
			'total'        => 0,
			'appliedPromo' => null,
			'items'        => array(),
		);
	}

	WC()->cart->calculate_totals();
	$items = array();

	foreach ( WC()->cart->get_cart() as $key => $cart_item ) {
		$product   = $cart_item['data'];
		$parent_id = $cart_item['product_id'];
		$sku       = $product->get_sku() ?: get_post_meta( $parent_id, '_sku', true );
		$img_id    = $product->get_image_id() ?: get_post_thumbnail_id( $parent_id );
		$img_url   = $img_id ? wp_get_attachment_image_url( $img_id, 'medium' ) : get_template_directory_uri() . '/assets/images/kt-01-ajrakh-kurta.jpg';
		$unit      = (float) $product->get_price();
		$qty       = (int) $cart_item['quantity'];

		$variation_label = '';
		if ( ! empty( $cart_item['variation'] ) ) {
			$variation_label = implode( ' · ', array_values( $cart_item['variation'] ) );
		}

		$items[] = array(
			'key'           => $key,
			'productId'     => $parent_id,
			'name'          => get_the_title( $parent_id ),
			'sku'           => $sku,
			'variationName' => $variation_label ?: 'Standard Kutchi Edition',
			'unitPrice'     => $unit,
			'lineTotal'     => $unit * $qty,
			'quantity'      => $qty,
			'image'         => $img_url,
			'url'           => get_permalink( $parent_id ),
		);
	}

	$subtotal = (float) WC()->cart->get_subtotal();
	$discount = (float) WC()->cart->get_discount_total();
	$net      = max( 0, $subtotal - $discount );
	$shipping = $net > 0 ? ( $net >= BB_FREE_SHIPPING_THRESHOLD ? 0 : 250 ) : 0;
	$coupons  = WC()->cart->get_applied_coupons();

	return array(
		'count'        => WC()->cart->get_cart_contents_count(),
		'subtotal'     => $subtotal,
		'discount'     => $discount,
		'shipping'     => $shipping,
		'total'        => $net + $shipping,
		'appliedPromo' => ! empty( $coupons ) ? strtoupper( $coupons[0] ) : null,
		'items'        => $items,
	);
}
