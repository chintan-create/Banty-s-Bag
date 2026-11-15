<?php
/**
 * Front Page Template — Hero, Interactive Kutchi Catalog, Studio Provenance
 */
get_header();

$hero_img      = get_template_directory_uri() . '/assets/images/hero-kutchi-atelier.jpg';
$products_q    = new WP_Query( array(
	'post_type'      => 'product',
	'posts_per_page' => 24,
	'post_status'    => 'publish',
	'orderby'        => 'menu_order date',
	'order'          => 'ASC',
) );
$total_count   = $products_q->found_posts;
$ajrakh_link   = home_url( '/product/ajrakhpur-16-step-natural-indigo-kurta/' );
$bhujodi_link  = home_url( '/product/bhujodi-extra-weft-kala-cotton-shawl/' );
$bandhani_link = home_url( '/product/jhinkhu-bandhani-pure-gajji-silk-odhani/' );
?>

<!-- Editorial Courtyard Hero -->
<section class="bb-hero">
	<div class="bb-container">
		<div class="bb-hero-grid">
			<div class="bb-hero-left">
				<div>
					<div class="bb-meta-line">
						<span>Bhuj &amp; Ajrakhpur, Kutch</span>
						<span aria-hidden="true">&middot;</span>
						<span>GI-Certified Handloom</span>
						<span aria-hidden="true">&middot;</span>
						<span>Free Courier Over <?php echo esc_html( bb_format_inr( BB_FREE_SHIPPING_THRESHOLD ) ); ?></span>
					</div>

					<h1 class="bb-hero-title font-display">
						Kutchi heritage textiles woven in Kala cotton, natural indigo, and Gajji silk.
					</h1>

					<p class="bb-hero-desc">
						Every Banty&apos;s Bag garment is crafted directly with master Khatri block-printers,
						Bhujodi Vankar pit-loom weavers, and Rabari embroidery collectives across Kutch,
						Gujarat.
					</p>

					<div style="margin-top: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
						<a href="#catalog-section" class="bb-btn-primary">
							<span>Explore Kutchi Collection</span>
							<span aria-hidden="true">&rarr;</span>
						</a>
						<a href="<?php echo esc_url( $ajrakh_link ); ?>" style="padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: var(--bb-slate-700); text-decoration: underline; text-underline-offset: 4px;">
							Inspect Ajrakh Kurta
						</a>
					</div>
				</div>

				<div class="bb-hero-stats">
					<div>
						<p class="font-mono tabular-nums" style="margin:0; font-size:0.875rem; font-weight:500; color:var(--bb-slate-900);">16 Steps</p>
						<p style="margin:0.125rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">Natural vat-dyed Ajrakh</p>
					</div>
					<div>
						<p class="font-mono tabular-nums" style="margin:0; font-size:0.875rem; font-weight:500; color:var(--bb-slate-900);">100% Pure</p>
						<p style="margin:0.125rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">Rain-fed Kala cotton</p>
					</div>
					<div>
						<p class="font-mono tabular-nums" style="margin:0; font-size:0.875rem; font-weight:500; color:var(--bb-slate-900);">Pan-India</p>
						<p style="margin:0.125rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">Insured dispatch &amp; COD</p>
					</div>
				</div>
			</div>

			<div class="bb-hero-right">
				<img src="<?php echo esc_url( $hero_img ); ?>" alt="Kutchi natural indigo Ajrakh hand-block printed organic cotton ensemble and draped Bhujodi handwoven geometric shawl in Bhuj, Gujarat" />
				<div class="bb-hero-scrim">
					<p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: #cbd5e1;">
						Featured Kutch Craft Editions — Click to inspect weave &amp; sizing:
					</p>
					<div style="display:flex; flex-wrap:wrap; gap: 0.5rem 1.25rem; font-size:0.875rem; font-weight:500;">
						<a href="<?php echo esc_url( $ajrakh_link ); ?>">01. Ajrakh Indigo Kurta <span class="font-mono tabular-nums" style="color:#cbd5e1;"><?php echo esc_html( bb_format_inr( 4850 ) ); ?></span></a>
						<span aria-hidden="true" style="color:#94a3b8;">&middot;</span>
						<a href="<?php echo esc_url( $bhujodi_link ); ?>">02. Bhujodi Shawl <span class="font-mono tabular-nums" style="color:#cbd5e1;"><?php echo esc_html( bb_format_inr( 4200 ) ); ?></span></a>
						<span aria-hidden="true" style="color:#94a3b8;">&middot;</span>
						<a href="<?php echo esc_url( $bandhani_link ); ?>">03. Bandhani Gajji Silk <span class="font-mono tabular-nums" style="color:#cbd5e1;"><?php echo esc_html( bb_format_inr( 11800 ) ); ?></span></a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Interactive WooCommerce Product Catalog -->
<section id="catalog-section" class="bb-catalog">
	<div class="bb-container">
		<div style="display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:1rem; margin-bottom:2rem;">
			<div>
				<h2 class="font-display" style="font-size:clamp(1.5rem, 2.5vw, 1.875rem); color:var(--bb-slate-900);">
					Kutchi Handloom &amp; Craft Wardrobe
				</h2>
				<p id="bb-catalog-count-label" style="margin:0.25rem 0 0; font-size:0.875rem; color:var(--bb-slate-600);">
					<?php echo esc_html( $total_count ); ?> artisanal garments crafted across Ajrakhpur, Bhujodi, Mandvi, and Sumrasar
				</p>
			</div>

			<div style="width:100%; max-width:20rem;">
				<input
					type="search"
					id="bb-catalog-search"
					class="bb-input"
					placeholder="Search Ajrakh, Bandhani, Kala cotton..."
					aria-label="Search Kutchi clothing catalog"
				/>
			</div>
		</div>

		<div class="bb-toolbar">
			<div class="bb-toolbar-top">
				<div role="tablist" aria-label="Filter collection by garment category" class="bb-tablist">
					<button type="button" class="bb-tab is-active" data-cat-filter="all">All Apparel</button>
					<button type="button" class="bb-tab" data-cat-filter="kurtas-tunics">Kurtas &amp; Tunics</button>
					<button type="button" class="bb-tab" data-cat-filter="kediyu-jackets">Kediyu &amp; Jackets</button>
					<button type="button" class="bb-tab" data-cat-filter="shawls-dupattas">Shawls &amp; Dupattas</button>
				</div>

				<div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.75rem;">
					<button type="button" id="bb-filter-ready" class="bb-pill-toggle" aria-pressed="false">
						Ready to Ship (48h)
					</button>
					<button type="button" id="bb-filter-saved" class="bb-pill-toggle" aria-pressed="false">
						Saved (<span id="bb-saved-count">0</span>)
					</button>
					<select id="bb-catalog-sort" class="bb-input" style="width:auto; height:40px; font-size:0.75rem; font-weight:500;">
						<option value="featured">Sort: Featured Order</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
						<option value="lead-time">Fastest Dispatch</option>
					</select>
				</div>
			</div>

			<!-- Dual INR Price Range Slider -->
			<div class="bb-price-bar">
				<div style="display:flex; align-items:center; gap:0.75rem;">
					<span style="font-size:0.75rem; font-weight:500; color:var(--bb-slate-700);">Base Price</span>
					<span id="bb-price-readout" class="font-mono tabular-nums" style="font-size:0.75rem; font-weight:500; color:var(--bb-slate-900);">₹3,500 – ₹12,000</span>
				</div>
				<div style="display:flex; align-items:center; gap:0.75rem; flex:1; max-width:28rem;">
					<span class="font-mono tabular-nums" style="font-size:11px; color:var(--bb-slate-400);">₹3,500</span>
					<div class="dual-range-wrap">
						<div class="dual-range-track"></div>
						<div id="bb-range-fill" class="dual-range-fill" style="left:0%; right:0%;"></div>
						<input type="range" id="bb-price-min" min="3500" max="12000" step="250" value="3500" class="dual-range-input" aria-label="Minimum base price in rupees" />
						<input type="range" id="bb-price-max" min="3500" max="12000" step="250" value="12000" class="dual-range-input" aria-label="Maximum base price in rupees" />
					</div>
					<span class="font-mono tabular-nums" style="font-size:11px; color:var(--bb-slate-400);">₹12,000</span>
				</div>
			</div>
		</div>

		<div id="bb-product-grid" class="bb-grid-3">
			<?php
			if ( $products_q->have_posts() ) :
				while ( $products_q->have_posts() ) :
					$products_q->the_post();
					get_template_part( 'template-parts/product-card' );
				endwhile;
				wp_reset_postdata();
			endif;
			?>
		</div>

		<div id="bb-empty-state" style="display:none; background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:3rem; text-align:center;">
			<h3 class="font-display" style="font-size:1.25rem; color:var(--bb-slate-900);">No Kutchi garments match your current filter selection</h3>
			<p style="font-size:0.875rem; color:var(--bb-slate-600); margin:0.5rem auto 1.5rem; max-width:28rem;">
				Try widening the rupee price slider or clearing your search query.
			</p>
			<button type="button" id="bb-reset-filters" class="bb-btn-dark">Reset Filters</button>
		</div>
	</div>
</section>

<!-- Studio Provenance & Kutch Craft Ecosystem -->
<section class="bb-provenance">
	<div class="bb-container">
		<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:3rem; align-items:start;">
			<div>
				<div class="bb-meta-line" style="margin-bottom:0.75rem;">
					<span>Kutch Craft Lineage</span>
					<span aria-hidden="true">&middot;</span>
					<span>Ajrakhpur &middot; Bhujodi &middot; Mandvi &middot; Sumrasar</span>
				</div>
				<h2 class="font-display" style="font-size:clamp(1.5rem, 2.5vw, 1.875rem); color:var(--bb-slate-900); max-width:36rem;">
					Rain-fed indigenous cotton, fermented indigo vats, and zero powerloom shortcuts.
				</h2>
				<p style="margin-top:1rem; font-size:1rem; color:var(--bb-slate-600); line-height:1.625; max-width:64ch;">
					Every Banty&apos;s Bag piece supports the self-sustaining textile ecosystem of
					Kachchh, Gujarat—connecting dry-land Kala cotton farmers with Vankar pit-loom
					weavers, Khatri block-printers and Bandhani tiers, and Rabari women embroiderers.
				</p>

				<div style="margin-top:2rem; padding-top:2rem; border-top:1px solid var(--bb-slate-200); display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:1.5rem;">
					<div>
						<p class="font-mono tabular-nums" style="margin:0; font-size:1.5rem; font-weight:500; color:var(--bb-slate-900);">0 Liters</p>
						<p style="margin:0.25rem 0 0; font-size:0.875rem; font-weight:500;">Groundwater Irrigation</p>
						<p style="margin:0.25rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">Indigenous Kutchi Kala cotton thrives purely on monsoon rainfall.</p>
					</div>
					<div>
						<p class="font-mono tabular-nums" style="margin:0; font-size:1.5rem; font-weight:500; color:var(--bb-slate-900);">14–16</p>
						<p style="margin:0.25rem 0 0; font-size:0.875rem; font-weight:500;">Ajrakh Dyeing Stages</p>
						<p style="margin:0.25rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">Hand-stamped teakwood blocks dyed in natural neel indigo &amp; madder.</p>
					</div>
					<div>
						<p class="font-mono tabular-nums" style="margin:0; font-size:1.5rem; font-weight:500; color:var(--bb-slate-900);">85+ Looms</p>
						<p style="margin:0.25rem 0 0; font-size:0.875rem; font-weight:500;">Partner Artisan Families</p>
						<p style="margin:0.25rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">Direct cluster wages settled upon loom completion across 6 villages.</p>
					</div>
				</div>
			</div>

			<div style="background:var(--bb-slate-50); border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:2rem;">
				<div class="bb-meta-line" style="margin-bottom:1rem;">
					<span>Craft Patron Reference</span>
					<span aria-hidden="true">&middot;</span>
					<span>Textile Exhibition &amp; Wardrobe Curation</span>
				</div>
				<blockquote style="margin:0; font-size:1rem; color:var(--bb-slate-800); line-height:1.65;">
					&ldquo;Most online stores sell chemical screen-prints labeled as Ajrakh or polyester
					Bandhani. Commissioning 30 Bhujodi Kala cotton stoles and natural-dyed Ajrakh kurtas
					through Banty&apos;s Bag gave our Ahmedabad craft symposium authentic GI-lineage
					pieces delivered in 5 days with full village artisan attribution.&rdquo;
				</blockquote>
				<div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--bb-slate-200); display:flex; align-items:center; justify-content:space-between; gap:1rem;">
					<div>
						<p style="margin:0; font-size:0.875rem; font-weight:600; color:var(--bb-slate-900);">Dr. Aparna Parikh</p>
						<p style="margin:0.125rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">Lead Curator, Sabarmati Handloom Archive — Ahmedabad, Gujarat</p>
					</div>
					<a href="<?php echo esc_url( $bhujodi_link ); ?>" style="font-size:0.75rem; font-weight:500; color:var(--bb-blue-700); text-decoration:underline; text-underline-offset:4px; white-space:nowrap;">
						View Bhujodi Shawl
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<?php get_footer(); ?>
