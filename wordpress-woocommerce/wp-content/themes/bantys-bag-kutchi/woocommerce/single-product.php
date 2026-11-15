<?php
/**
 * WooCommerce Single Product Template — Sticky Gallery + Blueprint + Colorway Swatches + Craft Accordions + Reviews
 */
defined( 'ABSPATH' ) || exit;
get_header();

while ( have_posts() ) :
	the_post();
	global $product;
	if ( ! $product instanceof WC_Product ) {
		$product = wc_get_product( get_the_ID() );
	}

	$product_id       = $product->get_id();
	$sku              = $product->get_sku();
	$sub_category     = get_post_meta( $product_id, '_bb_sub_category', true ) ?: 'Kutchi Handloom';
	$craft_village    = get_post_meta( $product_id, '_bb_craft_village', true ) ?: 'Bhuj, Kutch';
	$primary_material = get_post_meta( $product_id, '_bb_primary_material', true ) ?: 'Handloom Textile';
	$craft_notes      = json_decode( get_post_meta( $product_id, '_bb_craft_notes_json', true ) ?: '[]', true );
	$care_notes       = json_decode( get_post_meta( $product_id, '_bb_care_notes_json', true ) ?: '[]', true );
	$dimensions       = json_decode( get_post_meta( $product_id, '_bb_dimensions_json', true ) ?: '{}', true );
	$finishes         = json_decode( get_post_meta( $product_id, '_bb_finishes_json', true ) ?: '[]', true );
	$base_price       = (float) $product->get_price();
	$img_url          = get_the_post_thumbnail_url( $product_id, 'full' ) ?: get_template_directory_uri() . '/assets/images/kt-01-ajrakh-kurta.jpg';

	$terms       = get_the_terms( $product_id, 'product_cat' );
	$cat_term    = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0] : null;
	$reviews     = get_comments( array(
		'post_id' => $product_id,
		'status'  => 'approve',
		'type'    => 'review',
	) );
	$rating_avg  = $product->get_average_rating() ?: '5.0';
	$variation_ids = $product->is_type( 'variable' ) ? $product->get_children() : array();
	?>

	<div style="background: var(--bb-slate-50); padding: 1.5rem 0 4rem;">
		<div class="bb-container">
			<!-- Breadcrumb -->
			<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; padding-bottom:1.5rem; border-bottom:1px solid var(--bb-slate-200);">
				<div class="bb-meta-line">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="font-weight:500; color:var(--bb-slate-700);">&larr; All Apparel</a>
					<?php if ( $cat_term ) : ?>
						<span>/</span>
						<a href="<?php echo esc_url( get_term_link( $cat_term ) ); ?>"><?php echo esc_html( $cat_term->name ); ?></a>
					<?php endif; ?>
					<span>/</span>
					<span style="color:var(--bb-slate-900); font-weight:500;"><?php the_title(); ?></span>
				</div>
				<span class="font-mono tabular-nums" style="font-size:0.75rem; color:var(--bb-slate-500);">
					Cluster Ref <?php echo esc_html( $sku ); ?> &middot; <?php echo esc_html( $craft_village ); ?>
				</span>
			</div>

			<div class="bb-pdp-grid">
				<!-- Left Sticky Gallery & Measurement Blueprint -->
				<div class="bb-pdp-left">
					<div style="aspect-ratio:4/3; border-radius:0.75rem; overflow:hidden; background:#ffffff; border:1px solid var(--bb-slate-200);">
						<div id="bb-pdp-photo" style="width:100%; height:100%;">
							<img src="<?php echo esc_url( $img_url ); ?>" alt="<?php the_title_attribute(); ?>" style="width:100%; height:100%; object-fit:cover; display:block;" />
						</div>
						<div id="bb-pdp-blueprint" style="display:none; width:100%; height:100%;">
							<?php
							get_template_part( 'template-parts/technical-blueprint', null, array(
								'sku'        => $sku,
								'name'       => get_the_title(),
								'dimensions' => $dimensions,
							) );
							?>
						</div>
					</div>

					<div style="margin-top:1rem; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.75rem;">
						<div class="bb-tablist">
							<button type="button" class="bb-tab is-active" id="bb-mode-photo" onclick="window.bbSwitchGalleryMode('photo')">Studio Photograph</button>
							<button type="button" class="bb-tab" id="bb-mode-blueprint" onclick="window.bbSwitchGalleryMode('blueprint')">Garment Measurements</button>
						</div>
						<p class="font-mono tabular-nums" style="margin:0; font-size:0.75rem; color:var(--bb-slate-500);">
							<?php echo esc_html( ! empty( $dimensions['isDrape'] ) ? 'Width' : 'Chest' ); ?>
							<?php echo esc_html( $dimensions['chestOrWidthCm'] ?? 104 ); ?> cm &times;
							Length <?php echo esc_html( $dimensions['lengthCm'] ?? 112 ); ?> cm &middot;
							<?php echo esc_html( $dimensions['fabricWeightGsm'] ?? 145 ); ?> GSM
						</p>
					</div>
				</div>

				<!-- Right Sticky Purchase Module -->
				<div class="bb-pdp-right bb-pdp-panel">
					<div class="bb-meta-line">
						<span><?php echo esc_html( $sub_category ); ?></span>
						<span>&middot;</span>
						<span><?php echo esc_html( $craft_village ); ?></span>
						<span>&middot;</span>
						<span class="tabular-nums"><?php echo esc_html( $rating_avg ); ?> &#9733; (<?php echo esc_html( count( $reviews ) ); ?> reviews)</span>
					</div>

					<h1 class="font-display" style="margin-top:0.5rem; font-size:clamp(1.5rem, 2.5vw, 1.875rem); color:var(--bb-slate-900);">
						<?php the_title(); ?>
					</h1>

					<div style="margin-top:0.75rem; display:flex; flex-wrap:wrap; align-items:baseline; gap:0.75rem;">
						<span id="bb-pdp-unit-price" class="font-mono tabular-nums" style="font-size:1.5rem; font-weight:500; color:var(--bb-slate-900);">
							<?php echo esc_html( bb_format_inr( $base_price ) ); ?>
						</span>
						<span style="font-size:0.75rem; color:var(--bb-slate-500);">
							5% Handloom GST calculated at checkout &middot; Free courier over <?php echo esc_html( bb_format_inr( BB_FREE_SHIPPING_THRESHOLD ) ); ?>
						</span>
					</div>

					<div style="margin-top:1rem; font-size:0.875rem; color:var(--bb-slate-600); line-height:1.625;">
						<?php the_content(); ?>
					</div>

					<!-- Colorway & Size Swatch Variations -->
					<?php if ( ! empty( $finishes ) ) : ?>
						<div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--bb-slate-200);">
							<div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.75rem;">
								<span style="font-weight:500; color:var(--bb-slate-900);">Colorway &amp; Size</span>
								<span id="bb-selected-finish-label" style="color:var(--bb-slate-600);"><?php echo esc_html( $finishes[0]['name'] ); ?></span>
							</div>

							<div style="display:flex; flex-direction:column; gap:0.5rem;">
								<?php foreach ( $finishes as $idx => $finish ) :
									$var_id    = $variation_ids[ $idx ] ?? 0;
									$var_price = $base_price + (float) ( $finish['priceDelta'] ?? 0 );
									?>
									<button
										type="button"
										class="bb-variation-option <?php echo 0 === $idx ? 'is-selected' : ''; ?>"
										data-variation-btn
										data-variation-id="<?php echo esc_attr( $var_id ); ?>"
										data-price="<?php echo esc_attr( $var_price ); ?>"
										data-label="<?php echo esc_attr( $finish['name'] ); ?>"
										data-lead="<?php echo esc_attr( $finish['leadTimeDays'] ?? 2 ); ?>"
									>
										<span style="display:flex; align-items:center; gap:0.75rem;">
											<span class="bb-swatch-dot" style="width:16px; height:16px; background-color:<?php echo esc_attr( $finish['swatchHex'] ); ?>;"></span>
											<span style="font-size:0.8125rem; font-weight:500;"><?php echo esc_html( $finish['name'] ); ?></span>
										</span>
										<span class="font-mono tabular-nums" style="font-size:0.75rem; color:var(--bb-slate-600);">
											<?php echo esc_html( bb_format_inr( $var_price ) ); ?>
										</span>
									</button>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endif; ?>

					<!-- Quantity & Add to Bag -->
					<div style="margin-top:1.25rem; display:flex; align-items:center; gap:0.75rem;">
						<div style="display:inline-flex; align-items:center; border:1px solid var(--bb-slate-200); border-radius:0.5rem; background:var(--bb-slate-50); height:44px;">
							<button type="button" onclick="window.bbStepQty(-1)" style="width:40px; height:100%; border:none; background:transparent; cursor:pointer;">&minus;</button>
							<span id="bb-pdp-qty" class="font-mono tabular-nums" style="width:32px; text-align:center; font-size:0.875rem; font-weight:500;">1</span>
							<button type="button" onclick="window.bbStepQty(1)" style="width:40px; height:100%; border:none; background:transparent; cursor:pointer;">+</button>
						</div>

						<button
							type="button"
							id="bb-pdp-add-btn"
							class="bb-btn-primary"
							style="flex:1;"
							data-product-id="<?php echo esc_attr( $product_id ); ?>"
							data-variation-id="<?php echo esc_attr( $variation_ids[0] ?? 0 ); ?>"
							data-unit-price="<?php echo esc_attr( $base_price ); ?>"
						>
							Add to Bag — <span id="bb-pdp-btn-total" class="font-mono tabular-nums"><?php echo esc_html( bb_format_inr( $base_price ) ); ?></span>
						</button>
					</div>

					<!-- Save & Share -->
					<div style="margin-top:0.75rem; display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
						<button type="button" data-wishlist-toggle="<?php echo esc_attr( $product_id ); ?>" style="height:40px; border-radius:0.5rem; border:1px solid var(--bb-slate-200); background:#ffffff; font-size:0.75rem; font-weight:500; cursor:pointer;">
							Save to Wishlist
						</button>
						<button type="button" onclick="window.bbCopyShareLink()" style="height:40px; border-radius:0.5rem; border:1px solid var(--bb-slate-200); background:#ffffff; font-size:0.75rem; font-weight:500; cursor:pointer;">
							Share Piece
						</button>
					</div>

					<!-- Craft, Care & Courier Accordions -->
					<div style="margin-top:1.75rem; border-top:1px solid var(--bb-slate-200);">
						<details open style="border-bottom:1px solid var(--bb-slate-200); padding:0.875rem 0;">
							<summary style="font-size:0.875rem; font-weight:500; cursor:pointer;">Weave, Dye &amp; Garment Specifications</summary>
							<div style="margin-top:0.75rem; font-size:0.75rem; color:var(--bb-slate-600); line-height:1.6;">
								<?php if ( is_array( $craft_notes ) ) : ?>
									<ul style="padding-left:1rem; margin:0 0 0.75rem;">
										<?php foreach ( $craft_notes as $note ) : ?>
											<li><?php echo esc_html( $note ); ?></li>
										<?php endforeach; ?>
									</ul>
								<?php endif; ?>
							</div>
						</details>

						<details style="border-bottom:1px solid var(--bb-slate-200); padding:0.875rem 0;">
							<summary style="font-size:0.875rem; font-weight:500; cursor:pointer;">Natural Dye &amp; Handloom Wash Care</summary>
							<div style="margin-top:0.75rem; font-size:0.75rem; color:var(--bb-slate-600); line-height:1.6;">
								<?php if ( is_array( $care_notes ) ) : ?>
									<?php foreach ( $care_notes as $line ) : ?>
										<p style="margin:0.25rem 0;">&bull; <?php echo esc_html( $line ); ?></p>
									<?php endforeach; ?>
								<?php endif; ?>
							</div>
						</details>

						<details style="border-bottom:1px solid var(--bb-slate-200); padding:0.875rem 0;">
							<summary style="font-size:0.875rem; font-weight:500; cursor:pointer;">Pan-India Courier, Cash on Delivery &amp; Exchanges</summary>
							<p style="margin-top:0.75rem; font-size:0.75rem; color:var(--bb-slate-600); line-height:1.6;">
								Complimentary insured courier across India on all orders over <?php echo esc_html( bb_format_inr( BB_FREE_SHIPPING_THRESHOLD ) ); ?> (<?php echo esc_html( bb_format_inr( 250 ) ); ?> flat rate below). Express Air Dispatch in an Ajrakh keepsake box available for <?php echo esc_html( bb_format_inr( 650 ) ); ?>. UPI, Cards &amp; COD accepted.
							</p>
						</details>
					</div>
				</div>
			</div>

			<!-- Verified Patron Reviews -->
			<section style="margin-top:4rem; padding-top:3rem; border-top:1px solid var(--bb-slate-200);">
				<h2 class="font-display" style="font-size:1.5rem; color:var(--bb-slate-900); margin-bottom:1.5rem;">
					Verified Craft &amp; Wardrobe Reviews (<?php echo esc_html( count( $reviews ) ); ?>)
				</h2>

				<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
					<?php foreach ( $reviews as $review ) :
						$r_title    = get_comment_meta( $review->comment_ID, 'bb_review_title', true ) ?: 'Verified Craft Review';
						$r_role     = get_comment_meta( $review->comment_ID, 'bb_review_role', true ) ?: 'Verified Patron';
						$r_location = get_comment_meta( $review->comment_ID, 'bb_review_location', true ) ?: 'India';
						$r_stars    = (int) ( get_comment_meta( $review->comment_ID, 'rating', true ) ?: 5 );
						?>
						<article style="background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:1.5rem;">
							<div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--bb-slate-500);">
								<span style="color:var(--bb-slate-900);"><?php echo esc_html( str_repeat( '★', $r_stars ) ); ?></span>
								<span><?php echo esc_html( get_comment_date( 'F Y', $review ) ); ?></span>
							</div>
							<h3 class="font-sans" style="margin-top:0.75rem; font-size:0.875rem; font-weight:600; color:var(--bb-slate-900);">
								<?php echo esc_html( $r_title ); ?>
							</h3>
							<p style="margin-top:0.5rem; font-size:0.875rem; color:var(--bb-slate-600); line-height:1.6;">
								<?php echo esc_html( $review->comment_content ); ?>
							</p>
							<div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--bb-slate-100); font-size:0.75rem; color:var(--bb-slate-500);">
								<strong style="color:var(--bb-slate-800);"><?php echo esc_html( $review->comment_author ); ?></strong> &middot; <?php echo esc_html( $r_role ); ?> &middot; <?php echo esc_html( $r_location ); ?>
							</div>
						</article>
					<?php endforeach; ?>
				</div>
			</section>
		</div>
	</div>

<?php
endwhile;
get_footer();
