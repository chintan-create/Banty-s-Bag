import React, { useEffect, useState } from 'react';
import { ArrowLeft, Database, Download, FileCode2, FolderTree, PackageCheck } from 'lucide-react';

interface WordPressExportViewProps {
  onBackToStore: () => void;
}

interface ExportSummary {
  files: string[];
  dbStats: {
    products: number;
    variations: number;
    orders: number;
    coupons: number;
    customReviews: number;
  };
}

export const WordPressExportView: React.FC<WordPressExportViewProps> = ({ onBackToStore }) => {
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/wp-export/summary')
      .then((res) => res.json())
      .then((data: ExportSummary) => {
        if (active) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-slate-50 py-10 sm:py-14 min-h-[70vh]">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
            <h1 className="font-display text-2xl sm:text-3xl text-slate-900">
              WordPress, WooCommerce &amp; MySQL Database Package
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Complete PHP theme, companion WooCommerce plugin, MySQL/MariaDB schema dump, and CSV
              importer ready for WordPress hosting or Docker.
            </p>
          </div>

          <a
            href="/api/wp-export/bundle.tar.gz"
            download="bantys-bag-wordpress-woocommerce.tar.gz"
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Full WP + DB Bundle (.tar.gz)</span>
          </a>
        </div>

        {/* Direct Database & CSV Downloads */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Database className="w-4 h-4 text-blue-700" />
                <span>MySQL / MariaDB SQL Dump</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Includes <code className="font-mono">wp_posts</code>,{' '}
                <code className="font-mono">wp_postmeta</code>,{' '}
                <code className="font-mono">wp_wc_product_meta_lookup</code>, 5% Handloom GST,
                Pan-India courier zones, <code className="font-mono">KUTCH10</code> coupons, and
                verified patron reviews.
              </p>
            </div>
            <a
              href="/api/wp-export/database.sql"
              download="bantys_bag_woocommerce.sql"
              className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[38px] text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download bantys_bag_woocommerce.sql</span>
            </a>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <FileCode2 className="w-4 h-4 text-blue-700" />
                <span>WooCommerce CSV Importer</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Standard WooCommerce variable product CSV with all 6 Kutchi parent garments (
                <code className="font-mono">KT-01</code>–<code className="font-mono">KT-06</code>)
                and 16 variations for one-click import in WP Admin.
              </p>
            </div>
            <a
              href="/api/wp-export/products.csv"
              download="woocommerce-products-import.csv"
              className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[38px] text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download woocommerce-products-import.csv</span>
            </a>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <PackageCheck className="w-4 h-4 text-blue-700" />
                <span>Live SQLite Database Status</span>
              </div>
              {summary ? (
                <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs tabular-nums">
                  <div>
                    <dt className="text-slate-500">Products</dt>
                    <dd className="text-slate-900 font-semibold">{summary.dbStats.products}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Variations</dt>
                    <dd className="text-slate-900 font-semibold">{summary.dbStats.variations}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Coupons</dt>
                    <dd className="text-slate-900 font-semibold">{summary.dbStats.coupons}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Recorded Orders</dt>
                    <dd className="text-slate-900 font-semibold">{summary.dbStats.orders}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Loading database metrics...</p>
              )}
            </div>
            <p className="mt-4 text-[11px] text-slate-500">
              All orders and reviews submitted in this storefront persist in{' '}
              <code className="font-mono">data/bantys_bag.sqlite</code>.
            </p>
          </div>
        </div>

        {/* Generated WordPress / WooCommerce File Tree */}
        <section className="mt-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
            <FolderTree className="w-4 h-4 text-blue-700" />
            <span>Converted WordPress &amp; WooCommerce Package Files</span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500">Inspecting generated package...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-xs text-slate-700">
              {(summary?.files || []).map((filePath) => (
                <div
                  key={filePath}
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 truncate"
                  title={filePath}
                >
                  wordpress-woocommerce/{filePath}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
