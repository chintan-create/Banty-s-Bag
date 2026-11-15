import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { CategoryFilter } from '../types';
import { formatINR } from '../utils/currency';

export type ActiveRoute = 'storefront' | 'product' | 'checkout' | 'orders' | 'wp-export';

interface HeaderProps {
  activeRoute: ActiveRoute;
  activeCategory: CategoryFilter;
  cartCount: number;
  cartSubtotal: number;
  ordersCount: number;
  onSelectCategory: (category: CategoryFilter) => void;
  onNavigateOrders: () => void;
  onNavigateHome: () => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRoute,
  activeCategory,
  cartCount,
  cartSubtotal,
  ordersCount,
  onSelectCategory,
  onNavigateOrders,
  onNavigateHome,
  onOpenCart,
}) => {
  const navItems: { label: string; category?: CategoryFilter; isOrders?: boolean }[] = [
    { label: 'All Apparel', category: CategoryFilter.All },
    { label: 'Kurtas & Tunics', category: CategoryFilter.KurtasTunics },
    { label: 'Kediyu & Jackets', category: CategoryFilter.JacketsWraps },
    { label: 'Shawls & Dupattas', category: CategoryFilter.ShawlsDupattas },
    { label: ordersCount > 0 ? `Orders (${ordersCount})` : 'Orders', isOrders: true },
  ];

  return (
    <header
      className={`${
        activeRoute === 'product' ? 'md:sticky md:top-0' : 'sticky top-0'
      } z-30 bg-white/95 backdrop-blur-md border-b border-slate-200`}
    >
      <div className="max-w-[1360px] mx-auto h-16 px-4 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single wordmark element */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="font-display text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 cursor-pointer"
        >
          Banty&apos;s Bag
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary store navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActive = item.isOrders
              ? activeRoute === 'orders'
              : activeRoute === 'storefront' && activeCategory === item.category;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.isOrders) {
                    onNavigateOrders();
                  } else if (item.category) {
                    onSelectCategory(item.category);
                  }
                }}
                className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                  isActive
                    ? 'text-slate-900 border-slate-900'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex items-center gap-2.5 px-4 py-2 min-h-[40px] text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Bag ({cartCount})</span>
            {cartCount > 0 && (
              <span className="hidden sm:inline font-mono text-xs text-slate-300 tabular-nums">
                · {formatINR(cartSubtotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
