<?php
/**
 * Template Name: Order Verification & GST Receipts
 */
get_header();

$orders = array();
if ( function_exists( 'wc_get_orders' ) ) {
	$args = array(
		'limit'   => 20,
		'orderby' => 'date',
		'order'   => 'DESC',
	);
	if ( is_user_logged_in() && ! current_user_can( 'manage_woocommerce' ) ) {
		$args['customer_id'] = get_current_user_id();
	}
	$orders = wc_get_orders( $args );
}
?>

<div style="background: var(--bb-slate-50); padding: 2.5rem 0 4rem; min-height: 70vh;">
	<div style="max-width: 1100px; margin: 0 auto; padding: 0 1.5rem;">
		<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; padding-bottom:1.5rem; border-bottom:1px solid var(--bb-slate-200);">
			<div>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="font-size:0.75rem; font-weight:500; color:var(--bb-slate-600);">
					&larr; Back to Collection
				</a>
				<h1 class="font-display" style="margin-top:0.5rem; font-size:clamp(1.5rem, 2.5vw, 1.875rem); color:var(--bb-slate-900);">
					Order Verification &amp; Shipment Tracking
				</h1>
			</div>
			<p class="font-mono tabular-nums" style="margin:0; font-size:0.75rem; color:var(--bb-slate-500);">
				<?php echo esc_html( count( $orders ) ); ?> recorded orders
			</p>
		</div>

		<?php if ( empty( $orders ) ) : ?>
			<div style="margin-top:2.5rem; background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:3rem; text-align:center;">
				<h2 class="font-display" style="font-size:1.25rem; color:var(--bb-slate-900);">No orders placed yet</h2>
				<p style="font-size:0.875rem; color:var(--bb-slate-600); max-width:28rem; margin:0.5rem auto 1.5rem;">
					Once you complete checkout, your confirmed Banty&apos;s Bag order number, Bhuj atelier inspection status, and itemized rupee GST receipt appear here.
				</p>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="bb-btn-dark">Explore Kutchi Apparel</a>
			</div>
		<?php else : ?>
			<div style="margin-top:2rem; display:flex; flex-direction:column; gap:2rem;">
				<?php foreach ( $orders as $order ) :
					/** @var WC_Order $order */
					?>
					<article style="background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; overflow:hidden;">
						<div style="padding:1.25rem 2rem; background:var(--bb-slate-50); border-bottom:1px solid var(--bb-slate-200); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem;">
							<div>
								<h2 class="font-sans" style="margin:0; font-size:1rem; font-weight:600; color:var(--bb-slate-900);">
									Order #<?php echo esc_html( $order->get_order_number() ); ?> — <?php echo esc_html( wc_get_order_status_name( $order->get_status() ) ); ?>
								</h2>
								<p style="margin:0.25rem 0 0; font-size:0.75rem; color:var(--bb-slate-600);">
									Placed <?php echo esc_html( $order->get_date_created()->date_i18n( 'd M Y' ) ); ?> &middot;
									<?php echo esc_html( $order->get_payment_method_title() ); ?>
								</p>
							</div>
							<button type="button" onclick="window.print()" style="padding:0.5rem 0.875rem; font-size:0.75rem; font-weight:500; background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.5rem; cursor:pointer;">
								Print GST Receipt
							</button>
						</div>

						<div style="padding:1.5rem 2rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:2rem;">
							<div>
								<?php foreach ( $order->get_items() as $item ) :
									$product = $item->get_product();
									?>
									<div style="padding:0.625rem 0; border-bottom:1px solid var(--bb-slate-100); display:flex; justify-content:space-between; gap:1rem;">
										<div>
											<p style="margin:0; font-size:0.875rem; font-weight:600; color:var(--bb-slate-900);"><?php echo esc_html( $item->get_name() ); ?></p>
											<p class="font-mono" style="margin:0.125rem 0 0; font-size:0.75rem; color:var(--bb-slate-500);">
												<?php echo esc_html( $product ? $product->get_sku() : '' ); ?> &middot; Qty <?php echo esc_html( $item->get_quantity() ); ?>
											</p>
										</div>
										<span class="font-mono tabular-nums" style="font-size:0.875rem; font-weight:500;">
											<?php echo esc_html( bb_format_inr( $item->get_total() ) ); ?>
										</span>
									</div>
								<?php endforeach; ?>
							</div>

							<div style="background:var(--bb-slate-50); border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:1.25rem; font-size:0.75rem;">
								<p style="margin:0 0 0.25rem; font-weight:600; color:var(--bb-slate-900);">Delivery Address</p>
								<p style="margin:0; color:var(--bb-slate-700);"><?php echo esc_html( $order->get_formatted_billing_full_name() ); ?></p>
								<p style="margin:0; color:var(--bb-slate-600);"><?php echo esc_html( $order->get_billing_address_1() ); ?></p>
								<p style="margin:0; color:var(--bb-slate-600);">
									<?php echo esc_html( $order->get_billing_city() . ' — ' . $order->get_billing_postcode() . ', ' . $order->get_billing_state() ); ?>
								</p>
								<div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--bb-slate-200); display:flex; justify-content:space-between; font-size:0.875rem; font-weight:600;">
									<span>Total (incl. 5% GST)</span>
									<span class="font-mono tabular-nums"><?php echo esc_html( bb_format_inr( $order->get_total() ) ); ?></span>
								</div>
							</div>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
</div>

<?php get_footer(); ?>
