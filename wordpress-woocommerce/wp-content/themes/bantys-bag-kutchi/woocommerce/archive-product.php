<?php
/**
 * WooCommerce Archive Product Template (Shop & Category Archives)
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>

<section class="bb-catalog">
	<div class="bb-container">
		<div style="padding-bottom: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--bb-slate-200);">
			<div class="bb-meta-line" style="margin-bottom: 0.5rem;">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Storefront</a>
				<span aria-hidden="true">/</span>
				<span><?php woocommerce_page_title(); ?></span>
			</div>
			<h1 class="font-display" style="font-size: clamp(1.75rem, 3vw, 2.25rem); color: var(--bb-slate-900);">
				<?php woocommerce_page_title(); ?>
			</h1>
			<?php if ( term_description() ) : ?>
				<div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--bb-slate-600); max-width: 56ch;">
					<?php echo wp_kses_post( term_description() ); ?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ( woocommerce_product_loop() ) : ?>
			<div class="bb-grid-3">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/product-card' );
				endwhile;
				?>
			</div>
			<div style="margin-top: 2.5rem;">
				<?php woocommerce_pagination(); ?>
			</div>
		<?php else : ?>
			<div style="background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:3rem; text-align:center;">
				<h2 class="font-display" style="font-size:1.25rem;">No Kutchi garments found in this collection</h2>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="bb-btn-dark" style="margin-top:1.25rem;">Return to Collection</a>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
