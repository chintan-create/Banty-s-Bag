<?php
/**
 * Template Part: Kutchi Handloom Product Card
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $product;
if ( ! $product instanceof WC_Product ) {
	$product = wc_get_product( get_the_ID() );
}
if ( ! $product ) {
	return;
}

$product_id       = $product->get_id();
$sku              = $product->get_sku();
$sub_category     = get_post_meta( $product_id, '_bb_sub_category', true ) ?: 'Kutchi Handloom';
$craft_village    = get_post_meta( $product_id, '_bb_craft_village', true ) ?: 'Bhuj, Kutch';
$primary_material = get_post_meta( $product_id, '_bb_primary_material', true ) ?: 'Organic Handloom';
$lead_time_days   = (int) ( get_post_meta( $product_id, '_bb_lead_time_days', true ) ?: 2 );
$base_price       = (float) $product->get_price();
$swatches_json    = get_post_meta( $product_id, '_bb_finishes_json', true );
$finishes         = $swatches_json ? json_decode( $swatches_json, true ) : array();
$terms            = get_the_terms( $product_id, 'product_cat' );
$cat_slug         = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->slug : '';
$img_url          = get_the_post_thumbnail_url( $product_id, 'large' ) ?: get_template_directory_uri() . '/assets/images/kt-01-ajrakh-kurta.jpg';

$default_variation_id = 0;
if ( $product->is_type( 'variable' ) ) {
	$children = $product->get_children();
	if ( ! empty( $children ) ) {
		$default_variation_id = $children[0];
	}
}
?>
<article
	class="bb-card bb-product-item"
	data-product-id="<?php echo esc_attr( $product_id ); ?>"
	data-category="<?php echo esc_attr( $cat_slug ); ?>"
	data-price="<?php echo esc_attr( $base_price ); ?>"
	data-lead-time="<?php echo esc_attr( $lead_time_days ); ?>"
	data-search="<?php echo esc_attr( strtolower( $product->get_name() . ' ' . $sku . ' ' . $sub_category . ' ' . $craft_village . ' ' . $primary_material ) ); ?>"
>
	<div class="bb-card-media">
		<a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>" aria-label="<?php echo esc_attr( 'View craft details for ' . $product->get_name() ); ?>" style="display:block;width:100%;height:100%;">
			<img src="<?php echo esc_url( $img_url ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?>" loading="lazy" />
		</a>
		<button
			type="button"
			class="bb-wish-btn"
			data-wishlist-toggle="<?php echo esc_attr( $product_id ); ?>"
			aria-label="<?php echo esc_attr( 'Save ' . $product->get_name() ); ?>"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
			</svg>
		</button>
	</div>

	<div class="bb-card-body">
		<div>
			<div class="bb-meta-line">
				<span><?php echo esc_html( $sub_category ); ?></span>
				<span aria-hidden="true">&middot;</span>
				<span><?php echo esc_html( $craft_village ); ?></span>
				<span aria-hidden="true">&middot;</span>
				<span class="font-mono tabular-nums"><?php echo esc_html( $sku ); ?></span>
			</div>

			<div style="margin-top: 0.5rem; display: flex; align-items: baseline; justify-content: space-between; gap: 1rem;">
				<h3 class="font-sans" style="font-size: 1rem; font-weight: 600; color: var(--bb-slate-900); line-height: 1.35;">
					<a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>">
						<?php echo esc_html( $product->get_name() ); ?>
					</a>
				</h3>
				<span class="font-mono tabular-nums" style="font-size: 0.9375rem; font-weight: 500; color: var(--bb-slate-900); flex-shrink: 0;">
					<?php echo esc_html( bb_format_inr( $base_price ) ); ?>
				</span>
			</div>

			<p style="margin: 0.375rem 0 0; font-size: 0.75rem; color: var(--bb-slate-500); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
				<?php echo esc_html( $primary_material ); ?>
			</p>
		</div>

		<div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--bb-slate-100); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
			<div style="display: flex; align-items: center; gap: 0.375rem;">
				<?php if ( is_array( $finishes ) ) : ?>
					<?php foreach ( $finishes as $finish ) : ?>
						<span
							class="bb-swatch-dot"
							title="<?php echo esc_attr( $finish['name'] ); ?>"
							style="background-color: <?php echo esc_attr( $finish['swatchHex'] ); ?>;"
						></span>
					<?php endforeach; ?>
					<span style="font-size: 0.75rem; color: var(--bb-slate-500); margin-left: 0.25rem;">
						<?php echo esc_html( count( $finishes ) . ' ' . ( count( $finishes ) === 1 ? 'option' : 'options' ) ); ?>
					</span>
				<?php endif; ?>
			</div>

			<button
				type="button"
				class="bb-quick-add"
				data-quick-add="<?php echo esc_attr( $product_id ); ?>"
				data-variation-id="<?php echo esc_attr( $default_variation_id ); ?>"
			>
				<span>+ Quick Add</span>
			</button>
		</div>
	</div>
</article>
