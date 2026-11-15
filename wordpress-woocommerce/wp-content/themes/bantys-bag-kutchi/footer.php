<?php
/**
 * Theme Footer & Slide-Over WooCommerce Bag Drawer
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$cart_payload = bb_get_cart_drawer_payload();
$checkout_url = function_exists( 'wc_get_checkout_url' ) ? wc_get_checkout_url() : home_url( '/checkout/' );
?>
</main>

<footer class="bb-footer">
	<div class="bb-container">
		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; padding-bottom: 3rem; border-bottom: 1px solid var(--bb-slate-200);">
			<div>
				<span class="font-display" style="font-size: 1.25rem; font-weight: 600; color: var(--bb-slate-900);">
					Banty&apos;s Bag
				</span>
				<p style="margin-top: 0.75rem; font-size: 0.875rem; color: var(--bb-slate-600); line-height: 1.625; max-width: 24rem;">
					Authentic Kutchi handloom clothing, natural-dyed Ajrakh block prints, Bhujodi Kala
					cotton weaves, Rabari shisha embroidery, and pure Gajji silk Bandhani from Kutch,
					Gujarat.
				</p>
				<p style="margin-top: 1rem; font-size: 0.75rem; color: var(--bb-slate-500);">
					Atelier &amp; Dispatch House: Station Road, Near Hamirsar Lake, Bhuj, Kutch 370001,
					Gujarat · Mon–Sat 10:30–19:30 IST
				</p>
			</div>

			<div>
				<h3 class="font-sans" style="font-size: 0.75rem; font-weight: 600; color: var(--bb-slate-900); margin: 0 0 0.75rem;">
					Kutchi Collection
				</h3>
				<ul style="list-style: none; margin: 0; padding: 0; font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.625rem;">
					<li><a href="<?php echo esc_url( home_url( '/#catalog-section' ) ); ?>">All Kutchi Apparel</a></li>
					<li><a href="<?php echo esc_url( get_term_link( 'kurtas-tunics', 'product_cat' ) ); ?>">Ajrakh &amp; Mashru Kurtas</a></li>
					<li><a href="<?php echo esc_url( get_term_link( 'kediyu-jackets', 'product_cat' ) ); ?>">Kediyu Tops &amp; Rabari Jackets</a></li>
					<li><a href="<?php echo esc_url( get_term_link( 'shawls-dupattas', 'product_cat' ) ); ?>">Bhujodi Shawls &amp; Bandhani</a></li>
				</ul>
			</div>

			<div>
				<h3 class="font-sans" style="font-size: 0.75rem; font-weight: 600; color: var(--bb-slate-900); margin: 0 0 0.75rem;">
					Patron &amp; Order Services
				</h3>
				<ul style="list-style: none; margin: 0; padding: 0; font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.625rem;">
					<li><a href="<?php echo esc_url( home_url( '/orders/' ) ); ?>">Order Tracking &amp; GST Receipts</a></li>
					<li>
						<button type="button" onclick="window.bbOpenBagDrawer()" style="background: none; border: none; padding: 0; font: inherit; color: inherit; cursor: pointer;">
							Shopping Bag &amp; Patron Code (KUTCH10)
						</button>
					</li>
					<li style="font-size: 0.75rem; color: var(--bb-slate-500); line-height: 1.6;">
						Free Pan-India courier over <?php echo esc_html( bb_format_inr( BB_FREE_SHIPPING_THRESHOLD ) ); ?> · UPI, Cards &amp; COD accepted · 15-day size exchange
					</li>
				</ul>
			</div>
		</div>

		<div style="padding-top: 1.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; font-size: 0.75rem; color: var(--bb-slate-500);">
			<p style="margin: 0;">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Banty&apos;s Bag. All rights reserved.</p>
			<p style="margin: 0;">Crafted in Kutch, Gujarat, India · GI-Lineage Handloom &amp; Natural Dyes</p>
		</div>
	</div>
</footer>

<!-- Slide-Over WooCommerce Bag Drawer -->
<div id="bb-cart-drawer" class="bb-drawer-backdrop" role="dialog" aria-modal="true" aria-label="Shopping bag">
	<div style="flex: 1;" onclick="window.bbCloseBagDrawer()" aria-hidden="true"></div>
	<div class="bb-drawer-panel">
		<div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--bb-slate-200); display: flex; align-items: center; justify-content: space-between;">
			<div style="display: flex; align-items: center; gap: 0.625rem;">
				<h2 class="font-display" style="font-size: 1.125rem; color: var(--bb-slate-900);">
					Banty&apos;s Bag (<span id="bb-drawer-count"><?php echo esc_html( $cart_payload['count'] ); ?></span>)
				</h2>
			</div>
			<button type="button" onclick="window.bbCloseBagDrawer()" aria-label="Close shopping bag" style="width: 36px; height: 36px; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; font-size: 1.25rem; color: var(--bb-slate-600);">
				&times;
			</button>
		</div>

		<div id="bb-drawer-shipping-bar" style="padding: 0.875rem 1.5rem; background: var(--bb-slate-50); border-bottom: 1px solid var(--bb-slate-200);">
			<p id="bb-drawer-shipping-text" style="margin: 0; font-size: 0.75rem; color: var(--bb-slate-700);"></p>
			<div style="margin-top: 0.5rem; height: 6px; width: 100%; background: var(--bb-slate-200); border-radius: 9999px; overflow: hidden;">
				<div id="bb-drawer-shipping-progress" style="height: 100%; background: var(--bb-blue-700); transform-origin: left; transition: transform 200ms ease;"></div>
			</div>
		</div>

		<div id="bb-drawer-items" style="flex: 1; overflow-y: auto; padding: 1rem 1.5rem;"></div>

		<div id="bb-drawer-footer" style="padding: 1.5rem; background: var(--bb-slate-50); border-top: 1px solid var(--bb-slate-200); display: none;">
			<form id="bb-drawer-promo-form" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
				<input type="text" id="bb-drawer-promo-input" class="bb-input" placeholder="Patron code (try KUTCH10)" style="height: 36px; font-size: 0.75rem;" />
				<button type="submit" style="height: 36px; padding: 0 0.875rem; font-size: 0.75rem; font-weight: 500; background: #ffffff; border: 1px solid var(--bb-slate-200); border-radius: 0.5rem; cursor: pointer;">Apply</button>
			</form>
			<p id="bb-drawer-promo-msg" style="font-size: 0.75rem; margin: 0 0 0.75rem; color: var(--bb-slate-600);"></p>
			<div id="bb-drawer-totals" style="font-size: 0.75rem; display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1rem;"></div>
			<a href="<?php echo esc_url( $checkout_url ); ?>" class="bb-btn-primary" style="width: 100%; text-decoration: none;">
				Proceed to Checkout &rarr;
			</a>
		</div>
	</div>
</div>

<div id="bb-toast" class="bb-toast" role="status" aria-live="polite">Link copied!</div>

<script>
window.bbInitialCart = <?php echo wp_json_encode( $cart_payload ); ?>;
</script>

<?php wp_footer(); ?>
</body>
</html>
