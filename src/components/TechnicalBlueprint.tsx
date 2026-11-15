import React from 'react';
import { ProductDimensions } from '../types';

interface TechnicalBlueprintProps {
  sku: string;
  name: string;
  dimensions: ProductDimensions;
}

export const TechnicalBlueprint: React.FC<TechnicalBlueprintProps> = ({
  sku,
  name,
  dimensions,
}) => {
  const { chestOrWidthCm, lengthCm, sleeveOrBorderCm, fabricWeightGsm, isDrape } = dimensions;
  const toInches = (cm: number) => (cm / 2.54).toFixed(1);

  return (
    <div className="w-full h-full bg-slate-900 text-slate-200 p-6 sm:p-8 flex flex-col justify-between select-none">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="font-mono text-xs text-slate-400 tabular-nums">
            {isDrape ? 'Loom Drape Dimensions' : 'Tailor Flat-Lay Pattern'} · {sku}
          </p>
          <p className="text-sm font-medium text-slate-100 mt-0.5">{name}</p>
        </div>
        <div className="text-right font-mono text-xs text-slate-400 tabular-nums">
          <span>Unit cm / in · {fabricWeightGsm} GSM</span>
        </div>
      </div>

      <div className="my-auto py-4 flex items-center justify-center">
        <svg
          viewBox="0 0 460 265"
          className="w-full max-w-[440px] h-auto overflow-visible"
          role="img"
          aria-label={`Measurement schematic for ${name}: ${chestOrWidthCm}cm wide by ${lengthCm}cm long`}
        >
          <defs>
            <pattern id="loom-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(148, 163, 184, 0.12)"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect x="16" y="16" width="428" height="232" fill="url(#loom-grid)" rx="4" />

          {isDrape ? (
            <>
              {/* Handloom Shawl / Dupatta Flat Schematic */}
              <rect
                x="105"
                y="46"
                width="250"
                height="148"
                fill="rgba(59, 130, 246, 0.08)"
                stroke="#93C5FD"
                strokeWidth="1.5"
              />
              {/* Pallu / Extra-weft End Borders */}
              <rect
                x="105"
                y="46"
                width="32"
                height="148"
                fill="rgba(147, 197, 253, 0.14)"
                stroke="rgba(147, 197, 253, 0.55)"
                strokeWidth="1"
              />
              <rect
                x="323"
                y="46"
                width="32"
                height="148"
                fill="rgba(147, 197, 253, 0.14)"
                stroke="rgba(147, 197, 253, 0.55)"
                strokeWidth="1"
              />
              {/* Fringe ticks */}
              {[60, 82, 104, 126, 148, 170, 184].map((fy) => (
                <g key={fy}>
                  <line x1="93" y1={fy} x2="105" y2={fy} stroke="#93C5FD" strokeWidth="1" />
                  <line x1="355" y1={fy} x2="367" y2={fy} stroke="#93C5FD" strokeWidth="1" />
                </g>
              ))}
              <text
                x="230"
                y="36"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                Full Loom Span &amp; Pallu Border
              </text>

              {/* Length Dimension */}
              <line x1="105" y1="214" x2="355" y2="214" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="105" y1="209" x2="105" y2="219" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="355" y1="209" x2="355" y2="219" stroke="#CBD5E1" strokeWidth="1" />
              <text
                x="230"
                y="230"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10.5"
                fontFamily="JetBrains Mono, monospace"
              >
                Length {lengthCm} cm ({toInches(lengthCm)}&quot;)
              </text>

              {/* Width Dimension */}
              <line x1="78" y1="46" x2="78" y2="194" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="73" y1="46" x2="83" y2="46" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="73" y1="194" x2="83" y2="194" stroke="#CBD5E1" strokeWidth="1" />
              <text
                x="66"
                y="120"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10.5"
                fontFamily="JetBrains Mono, monospace"
                transform="rotate(-90, 66, 120)"
              >
                Width {chestOrWidthCm} cm ({toInches(chestOrWidthCm)}&quot;)
              </text>

              {/* Pallu / Border Span */}
              <text
                x="339"
                y="124"
                textAnchor="middle"
                fill="#93C5FD"
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
                transform="rotate(-90, 339, 124)"
              >
                Pallu {sleeveOrBorderCm}cm
              </text>
            </>
          ) : (
            <>
              {/* Tailored Kurta / Kediyu / Bandi Flat Pattern */}
              <path
                d="M 195 44 Q 230 56 265 44 L 305 56 L 342 118 L 316 130 L 292 86 L 298 196 L 162 196 L 168 86 L 144 130 L 118 118 L 155 56 Z"
                fill="rgba(59, 130, 246, 0.08)"
                stroke="#93C5FD"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Center Placket / Yoke Detail */}
              <line
                x1="230"
                y1="51"
                x2="230"
                y2="132"
                stroke="rgba(147, 197, 253, 0.55)"
                strokeWidth="1"
              />
              {/* Chest Measurement Guide */}
              <line
                x1="168"
                y1="98"
                x2="292"
                y2="98"
                stroke="#CBD5E1"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text
                x="230"
                y="92"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                Chest {chestOrWidthCm} cm ({toInches(chestOrWidthCm)}&quot;)
              </text>

              {/* Garment Length Line */}
              <line x1="96" y1="44" x2="96" y2="196" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="91" y1="44" x2="101" y2="44" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="91" y1="196" x2="101" y2="196" stroke="#CBD5E1" strokeWidth="1" />
              <text
                x="84"
                y="120"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10.5"
                fontFamily="JetBrains Mono, monospace"
                transform="rotate(-90, 84, 120)"
              >
                Length {lengthCm} cm ({toInches(lengthCm)}&quot;)
              </text>

              {/* Sleeve / Armhole Span */}
              <text
                x="352"
                y="88"
                textAnchor="start"
                fill="#93C5FD"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {sleeveOrBorderCm > 30
                  ? `Sleeve ${sleeveOrBorderCm} cm`
                  : `Armhole ${sleeveOrBorderCm} cm`}
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-3 font-mono text-xs text-slate-400 tabular-nums">
        <span>Weave Density: {fabricWeightGsm} GSM Handloom</span>
        <span>Hand-tailored allowance: ±1.0 cm</span>
      </div>
    </div>
  );
};
