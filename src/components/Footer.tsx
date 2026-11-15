import React from 'react';
import { CategoryFilter } from '../types';
import { formatINR } from '../utils/currency';

interface FooterProps {
  onSelectCategory: (category: CategoryFilter) => void;
  onNavigateOrders: () => void;
  onOpenBag: () => void;
  onNavigateWpExport: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateOrders,
  onOpenBag,
  onNavigateWpExport,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          {/* Brand & Kutch Studio Identity */}
          <div className="md:col-span-5">
            <span className="font-display text-xl font-semibold text-slate-900 tracking-tight">
              Banty&apos;s Bag
            </span>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm">
              Authentic Kutchi handloom clothing, natural-dyed Ajrakh block prints, Bhujodi Kala
              cotton weaves, Rabari shisha embroidery, and pure Gajji silk Bandhani from Kutch,
              Gujarat.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Atelier &amp; Dispatch House: Station Road, Near Hamirsar Lake, Bhuj, Kutch 370001,
              Gujarat · Mon–Sat 10:30–19:30 IST
            </p>
          </div>

          {/* Collection Links */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-semibold text-slate-900 mb-3">
              Kutchi Collection
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory(CategoryFilter.All)}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  All Kutchi Apparel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory(CategoryFilter.KurtasTunics)}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Ajrakh &amp; Mashru Kurtas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory(CategoryFilter.JacketsWraps)}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Kediyu Tops &amp; Rabari Jackets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory(CategoryFilter.ShawlsDupattas)}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Bhujodi Shawls &amp; Bandhani
                </button>
              </li>
            </ul>
          </div>

          {/* Patron Services */}
          <div className="md:col-span-4">
            <h3 className="font-sans text-xs font-semibold text-slate-900 mb-3">
              Patron &amp; Order Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onNavigateOrders}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Order Tracking &amp; GST Receipts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenBag}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Shopping Bag &amp; Patron Code (KUTCH10)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateWpExport}
                  className="text-blue-700 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                >
                  WordPress, WooCommerce &amp; SQL DB Package
                </button>
              </li>
              <li className="text-xs text-slate-500 pt-1 leading-relaxed">
                Free Pan-India courier over {formatINR(5000)} · UPI, Cards &amp; COD accepted ·
                15-day size exchange
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Banty&apos;s Bag. All rights reserved.</p>
          <p>Crafted in Kutch, Gujarat, India · GI-Lineage Handloom &amp; Natural Dyes</p>
        </div>
      </div>
    </footer>
  );
};
