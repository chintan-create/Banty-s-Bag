/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CATALOG_PRODUCTS } from './data/products';
import {
  CartItem,
  CategoryFilter,
  OrderRecord,
  Product,
  ProductReview,
  SortOption,
} from './types';
import { ActiveRoute, Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { StudioProvenance } from './components/StudioProvenance';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrdersView } from './components/OrdersView';
import { Footer } from './components/Footer';
import { WordPressExportView } from './components/WordPressExportView';

const STORAGE_KEYS = {
  CART: 'bantys_bag_kutchi_cart_v1',
  WISHLIST: 'bantys_bag_kutchi_wishlist_v1',
  ORDERS: 'bantys_bag_kutchi_orders_v1',
  REVIEWS: 'bantys_bag_kutchi_reviews_v1',
  PROMO: 'bantys_bag_kutchi_promo_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const MIN_CATALOG_PRICE =
  Math.floor(Math.min(...CATALOG_PRODUCTS.map((p) => p.basePrice)) / 500) * 500;
const MAX_CATALOG_PRICE =
  Math.ceil(Math.max(...CATALOG_PRODUCTS.map((p) => p.basePrice)) / 500) * 500;

export default function App() {
  const initialProductParam = useMemo(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('product');
      if (param && CATALOG_PRODUCTS.some((p) => p.id === param)) {
        return param;
      }
    } catch {
      // Ignore URL parse errors
    }
    return null;
  }, []);

  const [activeRoute, setActiveRoute] = useState<ActiveRoute>(
    initialProductParam ? 'product' : 'storefront'
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialProductParam);

  // Catalog filter & sort state
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(CategoryFilter.All);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.Featured);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    MIN_CATALOG_PRICE,
    MAX_CATALOG_PRICE,
  ]);

  // Persistent shopper state
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(STORAGE_KEYS.CART, []));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.WISHLIST, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStorage<OrderRecord[]>(STORAGE_KEYS.ORDERS, [])
  );
  const [customReviews, setCustomReviews] = useState<Record<string, ProductReview[]>>(() =>
    readStorage<Record<string, ProductReview[]>>(STORAGE_KEYS.REVIEWS, {})
  );
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() =>
    readStorage<string | null>(STORAGE_KEYS.PROMO, null)
  );

  // Interactive UI state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
    } catch {
      // Ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(customReviews));
    } catch {
      // Ignore
    }
  }, [customReviews]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.PROMO, JSON.stringify(appliedPromo));
    } catch {
      // Ignore
    }
  }, [appliedPromo]);

  // Hydrate persisted orders & reviews from SQLite backend
  useEffect(() => {
    let mounted = true;
    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.orders?.length) {
          setOrders((prev) => {
            const byId = new Map<string, OrderRecord>();
            for (const o of [...data.orders, ...prev]) {
              byId.set(o.id, o);
            }
            return Array.from(byId.values());
          });
        }
      })
      .catch(() => {});

    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.reviewsByProduct) {
          setCustomReviews((prev) => ({ ...prev, ...data.reviewsByProduct }));
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // Sync ?product=<id> query parameter with current view
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activeRoute === 'product' && selectedProductId) {
        url.searchParams.set('product', selectedProductId);
      } else {
        url.searchParams.delete('product');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history errors in restricted sandboxes
    }
  }, [activeRoute, selectedProductId]);

  // Close Cart Drawer on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen]);

  // Filtered and sorted Kutchi clothing catalog
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = CATALOG_PRODUCTS.filter((product) => {
      if (activeCategory !== CategoryFilter.All && product.category !== activeCategory) {
        return false;
      }
      if (product.basePrice < priceRange[0] || product.basePrice > priceRange[1]) {
        return false;
      }
      if (inStockOnly && product.leadTimeDays > 2) {
        return false;
      }
      if (savedOnly && !wishlistIds.includes(product.id)) {
        return false;
      }
      if (q) {
        const haystack = [
          product.name,
          product.sku,
          product.subCategory,
          product.craftVillage,
          product.primaryMaterial,
          product.summary,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === SortOption.PriceAsc) {
      sorted.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === SortOption.PriceDesc) {
      sorted.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === SortOption.LeadTime) {
      sorted.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    }
    return sorted;
  }, [activeCategory, priceRange, searchQuery, sortBy, inStockOnly, savedOnly, wishlistIds]);

  // Computed bag count & INR subtotal
  const { cartCount, cartSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const item of cart) {
      const product = CATALOG_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) continue;
      const finish =
        product.finishes.find((f) => f.id === item.finishId) || product.finishes[0];
      count += item.quantity;
      subtotal += (product.basePrice + finish.priceDelta) * item.quantity;
    }
    return { cartCount: count, cartSubtotal: subtotal };
  }, [cart]);

  // Navigation & Action Handlers
  const handleNavigateHome = () => {
    setActiveRoute('storefront');
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryAndScroll = (category: CategoryFilter) => {
    setActiveCategory(category);
    setSavedOnly(false);
    setActiveRoute('storefront');
    setSelectedProductId(null);
    window.setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleInspectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    productId: string,
    finishId: string,
    quantity: number,
    openDrawer = true
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.finishId === finishId
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { productId, finishId, quantity }];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const handleQuickAdd = (product: Product) => {
    const defaultFinish = product.finishes[0];
    handleAddToCart(product.id, defaultFinish.id, 1, false);
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1300);
  };

  const handleUpdateCartQuantity = (productId: string, finishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.finishId === finishId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, finishId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.finishId === finishId))
    );
  };

  const handleApplyPromo = (code: string | null): { valid: boolean; message: string } => {
    if (!code) {
      setAppliedPromo(null);
      return { valid: true, message: '' };
    }
    if (code === 'KUTCH10' || code === 'BHUJ10') {
      setAppliedPromo(code);
      return { valid: true, message: '10% Kutch craft patron discount applied.' };
    }
    return {
      valid: false,
      message: 'Unrecognized code. Try KUTCH10 for 10% craft patron savings.',
    };
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddReview = (
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date'>
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-custom-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    };
    setCustomReviews((prev) => ({
      ...prev,
      [productId]: [newReview, ...(prev[productId] || [])],
    }));
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, review: reviewData }),
    }).catch(() => {});
  };

  const handleCompleteOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setAppliedPromo(null);
    setHighlightedOrderId(order.id);
    setActiveRoute('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    }).catch(() => {});
  };

  const handleResetFilters = () => {
    setActiveCategory(CategoryFilter.All);
    setSearchQuery('');
    setInStockOnly(false);
    setSavedOnly(false);
    setPriceRange([MIN_CATALOG_PRICE, MAX_CATALOG_PRICE]);
    setSortBy(SortOption.Featured);
  };

  const selectedProduct = selectedProductId
    ? CATALOG_PRODUCTS.find((p) => p.id === selectedProductId) || null
    : null;

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    const sameCat = CATALOG_PRODUCTS.filter(
      (p) => p.id !== selectedProduct.id && p.category === selectedProduct.category
    );
    const others = CATALOG_PRODUCTS.filter(
      (p) => p.id !== selectedProduct.id && p.category !== selectedProduct.category
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [selectedProduct]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeRoute={activeRoute}
        activeCategory={activeCategory}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        ordersCount={orders.length}
        onSelectCategory={handleSelectCategoryAndScroll}
        onNavigateOrders={() => {
          setHighlightedOrderId(null);
          setActiveRoute('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateHome={handleNavigateHome}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {activeRoute === 'storefront' && (
          <>
            <Hero
              onExploreCatalog={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              onInspectProduct={handleInspectProduct}
            />

            <ProductCatalog
              products={filteredProducts}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              sortBy={sortBy}
              inStockOnly={inStockOnly}
              savedOnly={savedOnly}
              minPriceBound={MIN_CATALOG_PRICE}
              maxPriceBound={MAX_CATALOG_PRICE}
              priceRange={priceRange}
              wishlistIds={wishlistIds}
              recentlyAddedId={recentlyAddedId}
              onCategoryChange={(cat) => {
                setActiveCategory(cat);
              }}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onPriceRangeChange={setPriceRange}
              onToggleInStockOnly={() => setInStockOnly((v) => !v)}
              onToggleSavedOnly={() => setSavedOnly((v) => !v)}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={handleInspectProduct}
              onQuickAdd={handleQuickAdd}
              onResetFilters={handleResetFilters}
            />

            <StudioProvenance onOpenTradeProduct={handleInspectProduct} />
          </>
        )}

        {activeRoute === 'product' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            relatedProducts={relatedProducts}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            customReviews={customReviews[selectedProduct.id] || []}
            onBack={handleNavigateHome}
            onSelectCategory={(cat) => handleSelectCategoryAndScroll(cat)}
            onAddToCart={(productId, finishId, qty) =>
              handleAddToCart(productId, finishId, qty, true)
            }
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleInspectProduct}
            onAddReview={handleAddReview}
          />
        )}

        {activeRoute === 'checkout' && (
          <CheckoutView
            items={cart}
            products={CATALOG_PRODUCTS}
            appliedPromo={appliedPromo}
            onBackToStore={handleNavigateHome}
            onCompleteOrder={handleCompleteOrder}
          />
        )}

        {activeRoute === 'orders' && (
          <OrdersView
            orders={orders}
            highlightedOrderId={highlightedOrderId}
            onBackToStore={handleNavigateHome}
            onInspectProduct={handleInspectProduct}
          />
        )}

        {activeRoute === 'wp-export' && (
          <WordPressExportView onBackToStore={handleNavigateHome} />
        )}
      </main>

      <Footer
        onSelectCategory={handleSelectCategoryAndScroll}
        onNavigateOrders={() => {
          setHighlightedOrderId(null);
          setActiveRoute('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBag={() => setIsCartOpen(true)}
        onNavigateWpExport={() => {
          setActiveRoute('wp-export');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        products={CATALOG_PRODUCTS}
        appliedPromo={appliedPromo}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onApplyPromo={handleApplyPromo}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveRoute('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onInspectProduct={handleInspectProduct}
      />
    </div>
  );
}
