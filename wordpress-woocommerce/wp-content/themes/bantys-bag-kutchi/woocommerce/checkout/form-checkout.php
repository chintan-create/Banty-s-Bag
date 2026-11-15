<?php
/**
 * WooCommerce Checkout Template — Banty's Bag Bhuj Atelier Direct Checkout
 */
defined( 'ABSPATH' ) || exit;

if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}
?>

<div style="background: var(--bb-slate-50); padding: 2.5rem 0 4rem;">
	<div class="bb-container-narrow">
		<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; padding-bottom:1.5rem; border-bottom:1px solid var(--bb-slate-200);">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="font-size:0.75rem; font-weight:500; color:var(--bb-slate-700);">
				&larr; Return to Storefront
			</a>
			<span style="font-size:0.75rem; color:var(--bb-slate-500);">
				Bhuj Atelier Direct Checkout &middot; Pan-India Insured Dispatch
			</span>
		</div>

		<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data" style="margin-top:2rem;">
			<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2.5rem; align-items:start;">
				<!-- Left Column: Recipient Address & Shipping -->
				<div style="background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:2rem;">
					<h1 class="font-display" style="font-size:1.5rem; color:var(--bb-slate-900); margin-bottom:0.25rem;">
						01. Recipient &amp; Delivery Address
					</h1>
					<p style="font-size:0.75rem; color:var(--bb-slate-500); margin:0 0 1.5rem;">
						Used for courier tracking SMS and 5% Handloom GST invoice generation.
					</p>
					<?php if ( $checkout->get_checkout_fields() ) : ?>
						<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>
						<div id="customer_details">
							<?php do_action( 'woocommerce_checkout_billing' ); ?>
							<?php do_action( 'woocommerce_checkout_shipping' ); ?>
						</div>
						<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>
					<?php endif; ?>
				</div>

				<!-- Right Column: Sticky WooCommerce Order Summary & Payment -->
				<aside style="background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:2rem; position:sticky; top:6rem;">
					<h2 class="font-display" style="font-size:1.25rem; color:var(--bb-slate-900); padding-bottom:1rem; border-bottom:1px solid var(--bb-slate-200); margin-bottom:1rem;">
						02. Dispatch, GST &amp; Payment
					</h2>
					<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>
					<div id="order_review" class="woocommerce-checkout-review-order">
						<?php do_action( 'woocommerce_checkout_order_review' ); ?>
					</div>
					<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>
				</aside>
			</div>
		</form>
	</div>
</div>
