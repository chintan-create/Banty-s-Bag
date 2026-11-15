<?php
/**
 * Theme Header — 3-Zone Sticky Navigation matching Banty's Bag
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$cart_payload = bb_get_cart_drawer_payload();
$shop_url     = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
$orders_url   = home_url( '/orders/' );
$current_cat  = is_tax( 'product_cat' ) ? get_queried_object()->slug : '';
$is_orders    = is_page( 'orders' ) || is_wc_endpoint_url( 'orders' );
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="bb-header">
	<div class="bb-container bb-header-inner">
		<!-- Zone 1: Wordmark -->
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="bb-wordmark">
			Banty&apos;s Bag
		</a>

		<!-- Zone 2: 5 Concise Single-Line Navigation Links -->
		<nav aria-label="<?php esc_attr_e( 'Primary store navigation', 'bantys-bag-kutchi' ); ?>" class="bb-nav">
			<a href="<?php echo esc_url( home_url( '/#catalog-section' ) ); ?>" class="bb-nav-link <?php echo ( is_front_page() || is_shop() ) ? 'is-active' : ''; ?>">
				All Apparel
			</a>
			<a href="<?php echo esc_url( get_term_link( 'kurtas-tunics', 'product_cat' ) ); ?>" class="bb-nav-link <?php echo 'kurtas-tunics' === $current_cat ? 'is-active' : ''; ?>">
				Kurtas &amp; Tunics
			</a>
			<a href="<?php echo esc_url( get_term_link( 'kediyu-jackets', 'product_cat' ) ); ?>" class="bb-nav-link <?php echo 'kediyu-jackets' === $current_cat ? 'is-active' : ''; ?>">
				Kediyu &amp; Jackets
			</a>
			<a href="<?php echo esc_url( get_term_link( 'shawls-dupattas', 'product_cat' ) ); ?>" class="bb-nav-link <?php echo 'shawls-dupattas' === $current_cat ? 'is-active' : ''; ?>">
				Shawls &amp; Dupattas
			</a>
			<a href="<?php echo esc_url( $orders_url ); ?>" class="bb-nav-link <?php echo $is_orders ? 'is-active' : ''; ?>">
				Orders
			</a>
		</nav>

		<!-- Zone 3: Primary Bag Drawer Trigger -->
		<div>
			<button
				type="button"
				id="bb-open-bag-btn"
				aria-label="<?php echo esc_attr( 'Open shopping bag with ' . $cart_payload['count'] . ' items' ); ?>"
				class="bb-bag-btn"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
				</svg>
				<span>Bag (<span id="bb-header-bag-count"><?php echo esc_html( $cart_payload['count'] ); ?></span>)</span>
				<span id="bb-header-bag-subtotal" class="font-mono text-xs tabular-nums" style="color: #cbd5e1; <?php echo $cart_payload['count'] > 0 ? '' : 'display:none;'; ?>">
					· <?php echo esc_html( bb_format_inr( $cart_payload['subtotal'] ) ); ?>
				</span>
			</button>
		</div>
	</div>
</header>

<main style="flex: 1 1 auto;">
