import React from 'react';

interface StudioProvenanceProps {
  onOpenTradeProduct: (productId: string) => void;
}

export const StudioProvenance: React.FC<StudioProvenanceProps> = ({ onOpenTradeProduct }) => {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Kutch Craft Ecosystem & Quantitative Proof */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <span>Kutch Craft Lineage</span>
              <span aria-hidden="true">·</span>
              <span>Ajrakhpur · Bhujodi · Mandvi · Sumrasar</span>
            </div>

            <h2
              className="font-display text-2xl sm:text-3xl text-slate-900 tracking-tight max-w-xl"
              style={{ textWrap: 'balance' }}
            >
              Rain-fed indigenous cotton, fermented indigo vats, and zero powerloom shortcuts.
            </h2>

            <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-[64ch]">
              Every Banty&apos;s Bag piece supports the self-sustaining textile ecosystem of
              Kachchh, Gujarat—connecting dry-land Kala cotton farmers with Vankar pit-loom
              weavers, Khatri block-printers and Bandhani tiers, and Rabari women embroiderers.
            </p>

            {/* Quantitative Rigor Metrics */}
            <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-mono text-2xl font-medium text-slate-900 tabular-nums">0 Liters</p>
                <p className="text-sm font-medium text-slate-900 mt-1">Groundwater Irrigation</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Indigenous Kutchi Kala cotton thrives purely on desert monsoon rainfall without
                  synthetic pesticides.
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-medium text-slate-900 tabular-nums">14–16</p>
                <p className="text-sm font-medium text-slate-900 mt-1">Ajrakh Dyeing Stages</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Hand-stamped teakwood blocks dyed in natural neel indigo, madder root, and
                  pomegranate rind.
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-medium text-slate-900 tabular-nums">85+ Looms</p>
                <p className="text-sm font-medium text-slate-900 mt-1">Partner Artisan Families</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Direct cluster wages settled upon loom completion across 6 villages in Kutch
                  district.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Attributable Patron & Curator Testimonial */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <span>Craft Patron Reference</span>
              <span aria-hidden="true">·</span>
              <span>Textile Exhibition &amp; Wardrobe Curation</span>
            </div>

            <blockquote className="text-base text-slate-800 leading-relaxed">
              &ldquo;Most online stores sell chemical screen-prints labeled as Ajrakh or polyester
              Bandhani. Commissioning 30 Bhujodi Kala cotton stoles and natural-dyed Ajrakh kurtas
              through Banty&apos;s Bag gave our Ahmedabad craft symposium authentic GI-lineage
              pieces delivered in 5 days with full village artisan attribution.&rdquo;
            </blockquote>

            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Dr. Aparna Parikh</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lead Curator, Sabarmati Handloom Archive — Ahmedabad, Gujarat
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenTradeProduct('bhujodi-kala-cotton-shawl')}
                className="text-xs font-medium text-blue-700 hover:text-blue-800 underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
              >
                View Bhujodi Shawl
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
