import React from 'react';
import { Check, Heart, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { CategoryFilter, Product, SortOption } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: CategoryFilter;
  searchQuery: string;
  sortBy: SortOption;
  inStockOnly: boolean;
  savedOnly: boolean;
  minPriceBound: number;
  maxPriceBound: number;
  priceRange: [number, number];
  wishlistIds: string[];
  recentlyAddedId: string | null;
  onCategoryChange: (category: CategoryFilter) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onToggleInStockOnly: () => void;
  onToggleSavedOnly: () => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  searchQuery,
  sortBy,
  inStockOnly,
  savedOnly,
  minPriceBound,
  maxPriceBound,
  priceRange,
  wishlistIds,
  recentlyAddedId,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onPriceRangeChange,
  onToggleInStockOnly,
  onToggleSavedOnly,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  onResetFilters,
}) => {
  const categories = [
    CategoryFilter.All,
    CategoryFilter.KurtasTunics,
    CategoryFilter.JacketsWraps,
    CategoryFilter.ShawlsDupattas,
  ];

  const [minVal, maxVal] = priceRange;
  const span = Math.max(1, maxPriceBound - minPriceBound);
  const leftPercent = ((minVal - minPriceBound) / span) * 100;
  const rightPercent = 100 - ((maxVal - minPriceBound) / span) * 100;
  const isPriceFiltered = minVal > minPriceBound || maxVal < maxPriceBound;
  const minGap = 500;

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = Math.min(Number(e.target.value), maxVal - minGap);
    onPriceRangeChange([Math.max(minPriceBound, nextMin), maxVal]);
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = Math.max(Number(e.target.value), minVal + minGap);
    onPriceRangeChange([minVal, Math.min(maxPriceBound, nextMax)]);
  };

  return (
    <section id="catalog-section" className="py-12 sm:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Kutchi Handloom &amp; Craft Wardrobe
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {products.length}{' '}
              {products.length === 1 ? 'artisanal garment' : 'artisanal garments'} crafted across
              Ajrakhpur, Bhujodi, Mandvi, and Sumrasar
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Ajrakh, Bandhani, Kala cotton..."
              aria-label="Search Kutchi clothing catalog"
              className="w-full h-10 pl-10 pr-9 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Filter & Sort Workspace Toolbar */}
        <div className="space-y-4 pb-8 mb-8 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Segmented Category Filter Controls */}
            <div
              role="tablist"
              aria-label="Filter collection by garment category"
              className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto"
            >
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-3.5 py-2 min-h-[38px] text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Secondary Utility Filters & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onToggleInStockOnly}
                aria-pressed={inStockOnly}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  inStockOnly
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>Ready to Ship (48h)</span>
              </button>

              <button
                type="button"
                onClick={onToggleSavedOnly}
                aria-pressed={savedOnly}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  savedOnly
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${savedOnly ? 'fill-current' : ''}`} />
                <span className="tabular-nums">Saved ({wishlistIds.length})</span>
              </button>

              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 min-h-[40px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <label
                  htmlFor="catalog-sort"
                  className="text-xs text-slate-500 whitespace-nowrap shrink-0"
                >
                  Sort:
                </label>
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="text-xs font-medium text-slate-900 bg-transparent py-2 pr-1 focus:outline-none cursor-pointer"
                >
                  <option value={SortOption.Featured}>Featured Order</option>
                  <option value={SortOption.PriceAsc}>Price: Low to High</option>
                  <option value={SortOption.PriceDesc}>Price: High to Low</option>
                  <option value={SortOption.LeadTime}>Fastest Dispatch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Base Price Range Slider Filter Row (INR) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
              <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                Base Price
              </span>
              <span className="font-mono text-xs font-medium text-slate-900 tabular-nums whitespace-nowrap">
                {formatINR(minVal)} – {formatINR(maxVal)}
              </span>
              {isPriceFiltered && (
                <button
                  type="button"
                  onClick={() => onPriceRangeChange([minPriceBound, maxPriceBound])}
                  className="text-xs font-medium text-blue-700 hover:text-blue-800 underline underline-offset-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:max-w-md">
              <span className="font-mono text-[11px] text-slate-400 tabular-nums whitespace-nowrap shrink-0">
                {formatINR(minPriceBound)}
              </span>

              <div className="relative flex-1 h-7 flex items-center">
                <div className="w-full h-1.5 bg-slate-200 rounded-full" />
                <div
                  className="absolute h-1.5 bg-blue-700 rounded-full pointer-events-none"
                  style={{
                    left: `${leftPercent}%`,
                    right: `${rightPercent}%`,
                  }}
                />

                <input
                  type="range"
                  min={minPriceBound}
                  max={maxPriceBound}
                  step={250}
                  value={minVal}
                  onChange={handleMinSliderChange}
                  aria-label="Minimum base price in rupees"
                  aria-valuemin={minPriceBound}
                  aria-valuemax={maxVal - minGap}
                  aria-valuenow={minVal}
                  className={`dual-range-input absolute inset-x-0 w-full h-7 m-0 ${
                    minVal > maxPriceBound - 1000 ? 'z-20' : 'z-10'
                  }`}
                />

                <input
                  type="range"
                  min={minPriceBound}
                  max={maxPriceBound}
                  step={250}
                  value={maxVal}
                  onChange={handleMaxSliderChange}
                  aria-label="Maximum base price in rupees"
                  aria-valuemin={minVal + minGap}
                  aria-valuemax={maxPriceBound}
                  aria-valuenow={maxVal}
                  className="dual-range-input absolute inset-x-0 w-full h-7 m-0 z-10"
                />
              </div>

              <span className="font-mono text-[11px] text-slate-400 tabular-nums whitespace-nowrap shrink-0">
                {formatINR(maxPriceBound)}
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <h3 className="font-display text-xl text-slate-900">
              No Kutchi garments match your current filter selection
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Try widening the rupee price slider or clearing your search query.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-6 px-5 py-2.5 min-h-[40px] text-sm font-medium text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* 3-Column Uniform Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const isSaved = wishlistIds.includes(product.id);
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <article
                  key={product.id}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* 4:3 Neutral Studio Image Slot */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product.id)}
                      className="w-full h-full block text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-700"
                      aria-label={`View craft details for ${product.name}`}
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.imageAlt}
                        fallbackTitle={product.name}
                        fallbackCode={product.sku}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={
                        isSaved
                          ? `Remove ${product.name} from saved items`
                          : `Save ${product.name}`
                      }
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-slate-900 flex items-center justify-center shadow-xs transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isSaved ? 'fill-blue-700 text-blue-700' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Clean Unboxed Metadata with Typographic Separators */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <span>{product.subCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.craftVillage}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{product.sku}</span>
                      </div>

                      {/* Title & INR Price Row */}
                      <div className="mt-2 flex items-baseline justify-between gap-4">
                        <h3 className="font-sans text-base font-semibold text-slate-900 leading-snug">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product.id)}
                            className="text-left hover:text-blue-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
                          >
                            {product.name}
                          </button>
                        </h3>
                        <span className="font-mono text-[15px] font-medium text-slate-900 tabular-nums shrink-0">
                          {formatINR(product.basePrice)}
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
                        {product.primaryMaterial}
                      </p>
                    </div>

                    {/* Swatches + Quick Add Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div
                        className="flex items-center gap-1.5"
                        aria-label={`${product.finishes.length} available options`}
                      >
                        {product.finishes.map((finish) => (
                          <span
                            key={finish.id}
                            title={finish.name}
                            style={{ backgroundColor: finish.swatchHex }}
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                          />
                        ))}
                        <span className="text-xs text-slate-500 ml-1 tabular-nums">
                          {product.finishes.length}{' '}
                          {product.finishes.length === 1 ? 'option' : 'options'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onQuickAdd(product)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 ${
                            isJustAdded
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Quick Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
