import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_SHOWCASE_IMAGE } from '../data/products';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onExploreCatalog: () => void;
  onInspectProduct: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onInspectProduct }) => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Editorial & Action Column */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-5">
                <span>Bhuj &amp; Ajrakhpur, Kutch</span>
                <span aria-hidden="true">·</span>
                <span>GI-Certified Handloom</span>
                <span aria-hidden="true">·</span>
                <span>Free Courier Over {formatINR(5000)}</span>
              </div>

              <h1
                className="font-display font-normal text-slate-900 tracking-tight leading-[1.1] max-w-xl"
                style={{
                  fontSize: 'clamp(2.25rem, 3.6vw, 3.5rem)',
                  textWrap: 'balance',
                }}
              >
                Kutchi heritage textiles woven in Kala cotton, natural indigo, and Gajji silk.
              </h1>

              <p className="mt-5 text-base text-slate-600 leading-relaxed max-w-[54ch]">
                Every Banty&apos;s Bag garment is crafted directly with master Khatri block-printers,
                Bhujodi Vankar pit-loom weavers, and Rabari embroidery collectives across Kutch,
                Gujarat.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onExploreCatalog}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <span>Explore Kutchi Collection</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onInspectProduct('ajrakhpur-indigo-kurta')}
                  className="inline-flex items-center justify-center px-4 py-3 min-h-[44px] text-sm font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Inspect Ajrakh Kurta
                </button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
              <div>
                <p className="font-mono text-sm font-medium text-slate-900 tabular-nums">16 Steps</p>
                <p className="text-xs text-slate-500 mt-0.5">Natural vat-dyed Ajrakh</p>
              </div>
              <div>
                <p className="font-mono text-sm font-medium text-slate-900 tabular-nums">100% Pure</p>
                <p className="text-xs text-slate-500 mt-0.5">Rain-fed Kala cotton</p>
              </div>
              <div>
                <p className="font-mono text-sm font-medium text-slate-900 tabular-nums">Pan-India</p>
                <p className="text-xs text-slate-500 mt-0.5">Insured dispatch &amp; COD</p>
              </div>
            </div>
          </div>

          {/* Right Kutchi Courtyard Showcase Image */}
          <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[320px] sm:min-h-[420px]">
            <ResilientImage
              src={HERO_SHOWCASE_IMAGE}
              alt="Kutchi natural indigo Ajrakh hand-block printed organic cotton ensemble and draped Bhujodi handwoven geometric shawl in a sunlit courtyard in Bhuj, Gujarat"
              fallbackTitle="Bhuj Courtyard Handloom Showcase"
              className="w-full h-full lg:h-full object-cover"
            />

            {/* Measured contrast scrim for featured pieces */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-16 pb-5 px-5 sm:px-6">
              <p className="text-xs text-slate-300 mb-2">
                Featured Kutch Craft Editions — Click to inspect weave &amp; sizing:
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-white">
                <button
                  type="button"
                  onClick={() => onInspectProduct('ajrakhpur-indigo-kurta')}
                  className="hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                >
                  01. Ajrakh Indigo Kurta{' '}
                  <span className="font-mono text-slate-300 tabular-nums">{formatINR(4850)}</span>
                </button>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <button
                  type="button"
                  onClick={() => onInspectProduct('bhujodi-kala-cotton-shawl')}
                  className="hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                >
                  02. Bhujodi Shawl{' '}
                  <span className="font-mono text-slate-300 tabular-nums">{formatINR(4200)}</span>
                </button>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <button
                  type="button"
                  onClick={() => onInspectProduct('bandhani-gajji-silk-dupatta')}
                  className="hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                >
                  03. Bandhani Gajji Silk{' '}
                  <span className="font-mono text-slate-300 tabular-nums">{formatINR(11800)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
