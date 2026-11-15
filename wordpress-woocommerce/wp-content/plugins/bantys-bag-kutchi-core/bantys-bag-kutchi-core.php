<?php
/**
 * Plugin Name: Banty's Bag — Kutchi Handloom WooCommerce Core
 * Description: Registers Kutchi craft provenance meta fields, custom WooCommerce INR/GST/shipping rules, REST API endpoints, and one-click catalog seeder for Banty's Bag.
 * Version: 1.0.0
 * Author: Banty's Bag Atelier
 * Requires Plugins: woocommerce
 * Text Domain: bantys-bag-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BB_CORE_PATH', plugin_dir_path( __FILE__ ) );

require_once BB_CORE_PATH . 'includes/class-bb-seeder.php';

register_activation_hook( __FILE__, array( 'BB_Catalog_Seeder', 'activate_and_seed' ) );

/**
 * Add Kutchi Craft Lineage tab to WooCommerce Product Edit screen in WP Admin
 */
add_filter( 'woocommerce_product_data_tabs', function ( $tabs ) {
	$tabs['bb_kutchi_craft'] = array(
		'label'    => __( 'Kutchi Craft & Loom', 'bantys-bag-core' ),
		'target'   => 'bb_kutchi_craft_data',
		'class'    => array( 'show_if_simple', 'show_if_variable' ),
		'priority' => 25,
	);
	return $tabs;
} );

add_action( 'woocommerce_product_data_panels', function () {
	global $post;
	echo '<div id="bb_kutchi_craft_data" class="panel woocommerce_options_panel">';
	woocommerce_wp_text_input( array(
		'id'          => '_bb_sub_category',
		'label'       => __( 'Craft Sub-Category', 'bantys-bag-core' ),
		'placeholder' => 'Ajrakh Block Print',
	) );
	woocommerce_wp_text_input( array(
		'id'          => '_bb_craft_village',
		'label'       => __( 'Craft Village Cluster', 'bantys-bag-core' ),
		'placeholder' => 'Ajrakhpur, Kutch',
	) );
	woocommerce_wp_text_input( array(
		'id'          => '_bb_primary_material',
		'label'       => __( 'Primary Loom / Dye Material', 'bantys-bag-core' ),
		'placeholder' => 'Organic Cotton · Natural Indigo & Madder',
	) );
	woocommerce_wp_text_input( array(
		'id'                => '_bb_lead_time_days',
		'label'             => __( 'Dispatch Lead Time (Days)', 'bantys-bag-core' ),
		'type'              => 'number',
		'custom_attributes' => array( 'min' => '1', 'max' => '30' ),
	) );
	echo '</div>';
} );

add_action( 'woocommerce_process_product_meta', function ( $post_id ) {
	$fields = array( '_bb_sub_category', '_bb_craft_village', '_bb_primary_material', '_bb_lead_time_days' );
	foreach ( $fields as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
} );

/**
 * Custom WP REST API Endpoints (/wp-json/bantys-bag/v1/...)
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'bantys-bag/v1', '/products', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			if ( ! function_exists( 'wc_get_products' ) ) {
				return new WP_Error( 'woocommerce_missing', 'WooCommerce is required.', array( 'status' => 500 ) );
			}
			$products = wc_get_products( array( 'limit' => 50, 'status' => 'publish' ) );
			$out = array();
			foreach ( $products as $p ) {
				$pid = $p->get_id();
				$out[] = array(
					'id'              => $p->get_slug(),
					'wpId'            => $pid,
					'sku'             => $p->get_sku(),
					'name'            => $p->get_name(),
					'basePrice'       => (float) $p->get_price(),
					'subCategory'     => get_post_meta( $pid, '_bb_sub_category', true ),
					'craftVillage'    => get_post_meta( $pid, '_bb_craft_village', true ),
					'primaryMaterial' => get_post_meta( $pid, '_bb_primary_material', true ),
					'leadTimeDays'    => (int) get_post_meta( $pid, '_bb_lead_time_days', true ),
					'dimensions'      => json_decode( get_post_meta( $pid, '_bb_dimensions_json', true ) ?: '{}', true ),
					'finishes'        => json_decode( get_post_meta( $pid, '_bb_finishes_json', true ) ?: '[]', true ),
				);
			}
			return rest_ensure_response( $out );
		},
	) );
} );

/**
 * Apply 5% Handloom GST fee / tax & Free Courier threshold notice
 */
add_action( 'woocommerce_cart_calculate_fees', function ( $cart ) {
	if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
		return;
	}
	$net = max( 0, (float) $cart->get_subtotal() - (float) $cart->get_discount_total() );
	if ( $net > 0 ) {
		$gst = round( $net * 0.05 );
		$cart->add_fee( __( 'Handloom GST (5%)', 'bantys-bag-core' ), $gst, false );
	}
} );
