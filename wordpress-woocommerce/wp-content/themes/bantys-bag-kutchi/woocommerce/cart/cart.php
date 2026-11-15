<?php
/**
 * WooCommerce Cart Template
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<div style="background: var(--bb-slate-50); padding: 2.5rem 0 4rem;">
	<div class="bb-container-narrow">
		<div style="padding-bottom: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--bb-slate-200);">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="font-size:0.75rem; font-weight:500; color:var(--bb-slate-700);">
				&larr; Continue Exploring Kutchi Apparel
			</a>
			<h1 class="font-display" style="margin-top:0.5rem; font-size:clamp(1.5rem, 2.5vw, 2rem); color:var(--bb-slate-900);">
				Banty&apos;s Bag — Shopping Bag
			</h1>
		</div>

		<div style="background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:2rem;">
			<?php echo do_shortcode( '[woocommerce_cart]' ); ?>
		</div>
	</div>
</div>
<?php
get_footer();
