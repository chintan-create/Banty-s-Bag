<?php
/**
 * Template Part: Garment Measurement Technical Blueprint SVG
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$sku        = $args['sku'] ?? '';
$name       = $args['name'] ?? '';
$dimensions = $args['dimensions'] ?? array(
	'chestOrWidthCm'   => 104,
	'lengthCm'         => 112,
	'sleeveOrBorderCm' => 58,
	'fabricWeightGsm'  => 145,
	'isDrape'          => false,
);

$width_cm  = (int) ( $dimensions['chestOrWidthCm'] ?? 104 );
$length_cm = (int) ( $dimensions['lengthCm'] ?? 112 );
$border_cm = (int) ( $dimensions['sleeveOrBorderCm'] ?? 58 );
$gsm       = (int) ( $dimensions['fabricWeightGsm'] ?? 145 );
$is_drape  = ! empty( $dimensions['isDrape'] );
$width_in  = number_format( $width_cm / 2.54, 1 );
$length_in = number_format( $length_cm / 2.54, 1 );
?>
<div style="width:100%;height:100%;background:#0f172a;color:#e2e8f0;padding:1.75rem;display:flex;flex-direction:column;justify-content:space-between;user-select:none;">
	<div style="display:flex;justify-content:space-between;gap:1rem;border-bottom:1px solid #1e293b;padding-bottom:1rem;">
		<div>
			<p class="font-mono tabular-nums" style="margin:0;font-size:0.75rem;color:#94a3b8;">
				<?php echo esc_html( $is_drape ? 'Loom Drape Dimensions' : 'Tailor Flat-Lay Pattern' ); ?> &middot; <?php echo esc_html( $sku ); ?>
			</p>
			<p style="margin:0.25rem 0 0;font-size:0.875rem;font-weight:500;color:#f1f5f9;"><?php echo esc_html( $name ); ?></p>
		</div>
		<div class="font-mono tabular-nums" style="font-size:0.75rem;color:#94a3b8;">
			Unit cm / in &middot; <?php echo esc_html( $gsm ); ?> GSM
		</div>
	</div>

	<div style="margin:auto 0;padding:1rem 0;display:flex;align-items:center;justify-content:center;">
		<svg viewBox="0 0 460 265" style="width:100%;max-width:440px;height:auto;overflow:visible;" role="img" aria-label="<?php echo esc_attr( 'Measurement schematic for ' . $name ); ?>">
			<defs>
				<pattern id="bb-loom-grid" width="20" height="20" patternUnits="userSpaceOnUse">
					<path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148,163,184,0.12)" stroke-width="0.75" />
				</pattern>
			</defs>
			<rect x="16" y="16" width="428" height="232" fill="url(#bb-loom-grid)" rx="4" />

			<?php if ( $is_drape ) : ?>
				<rect x="105" y="46" width="250" height="148" fill="rgba(59,130,246,0.08)" stroke="#93C5FD" stroke-width="1.5" />
				<rect x="105" y="46" width="32" height="148" fill="rgba(147,197,253,0.14)" stroke="rgba(147,197,253,0.55)" stroke-width="1" />
				<rect x="323" y="46" width="32" height="148" fill="rgba(147,197,253,0.14)" stroke="rgba(147,197,253,0.55)" stroke-width="1" />
				<text x="230" y="36" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="JetBrains Mono, monospace">Full Loom Span &amp; Pallu Border</text>
				<line x1="105" y1="214" x2="355" y2="214" stroke="#CBD5E1" stroke-width="1" />
				<text x="230" y="230" text-anchor="middle" fill="#F8FAFC" font-size="10.5" font-family="JetBrains Mono, monospace">Length <?php echo esc_html( $length_cm ); ?> cm (<?php echo esc_html( $length_in ); ?>&quot;)</text>
				<line x1="78" y1="46" x2="78" y2="194" stroke="#CBD5E1" stroke-width="1" />
				<text x="66" y="120" text-anchor="middle" fill="#F8FAFC" font-size="10.5" font-family="JetBrains Mono, monospace" transform="rotate(-90, 66, 120)">Width <?php echo esc_html( $width_cm ); ?> cm (<?php echo esc_html( $width_in ); ?>&quot;)</text>
				<text x="339" y="124" text-anchor="middle" fill="#93C5FD" font-size="9.5" font-family="JetBrains Mono, monospace" transform="rotate(-90, 339, 124)">Pallu <?php echo esc_html( $border_cm ); ?>cm</text>
			<?php else : ?>
				<path d="M 195 44 Q 230 56 265 44 L 305 56 L 342 118 L 316 130 L 292 86 L 298 196 L 162 196 L 168 86 L 144 130 L 118 118 L 155 56 Z" fill="rgba(59,130,246,0.08)" stroke="#93C5FD" stroke-width="1.5" stroke-linejoin="round" />
				<line x1="230" y1="51" x2="230" y2="132" stroke="rgba(147,197,253,0.55)" stroke-width="1" />
				<line x1="168" y1="98" x2="292" y2="98" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
				<text x="230" y="92" text-anchor="middle" fill="#F8FAFC" font-size="10" font-family="JetBrains Mono, monospace">Chest <?php echo esc_html( $width_cm ); ?> cm (<?php echo esc_html( $width_in ); ?>&quot;)</text>
				<line x1="96" y1="44" x2="96" y2="196" stroke="#CBD5E1" stroke-width="1" />
				<text x="84" y="120" text-anchor="middle" fill="#F8FAFC" font-size="10.5" font-family="JetBrains Mono, monospace" transform="rotate(-90, 84, 120)">Length <?php echo esc_html( $length_cm ); ?> cm (<?php echo esc_html( $length_in ); ?>&quot;)</text>
				<text x="352" y="88" text-anchor="start" fill="#93C5FD" font-size="10" font-family="JetBrains Mono, monospace"><?php echo esc_html( $border_cm > 30 ? "Sleeve {$border_cm} cm" : "Armhole {$border_cm} cm" ); ?></text>
			<?php endif; ?>
		</svg>
	</div>

	<div class="font-mono tabular-nums" style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid #1e293b;padding-top:0.75rem;font-size:0.75rem;color:#94a3b8;">
		<span>Weave Density: <?php echo esc_html( $gsm ); ?> GSM Handloom</span>
		<span>Hand-tailored allowance: &plusmn;1.0 cm</span>
	</div>
</div>
