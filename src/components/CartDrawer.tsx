import React, { useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../data/products';
import { CartItem, Product } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  products: Product[];
  appliedPromo: string | null;
  onClose: () => void;
  onUpdateQuantity: (productId: string, finishId: string, delta: number) => void;
  onRemoveItem: (productId: string, finishId: string) => void;
  onApplyPromo: (code: string | null) => { valid: boolean; message: string };
  onProceedToCheckout: () => void;
  onInspectProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  products,
  appliedPromo,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromo,
  onProceedToCheckout,
  onInspectProduct,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const detailedItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const finish =
        product.finishes.find((f) => f.id === item.finishId) || product.finishes[0];
      const unitPrice = product.basePrice + finish.priceDelta;
      return {
        ...item,
        product,
        finish,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = detailedItems.reduce((sum, entry) => sum + entry.lineTotal, 0);
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const discountedSubtotal = subtotal - discount;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const shippingProgress = Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onApplyPromo(promoInput.trim().toUpperCase());
    setPromoFeedback(res.message);
    if (res.valid) {
      setPromoInput('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

      {/* Slide-Over Panel */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-slate-900" />
            <h2 className="font-display text-lg text-slate-900">
              Banty&apos;s Bag ({detailedItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Courier Progress Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200">
          <p className="text-xs text-slate-700">
            {remainingForFreeShipping === 0 ? (
              <span className="font-medium text-slate-900">
                Complimentary Pan-India insured courier unlocked.
              </span>
            ) : (
              <>
                Add{' '}
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {formatINR(remainingForFreeShipping)}
                </span>{' '}
                more for free Pan-India courier.
              </>
            )}
          </p>
          <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 transition-transform duration-200 origin-left"
              style={{ transform: `scaleX(${shippingProgress / 100})` }}
            />
          </div>
        </div>

        {/* Bag Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-200">
          {detailedItems.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-display text-lg text-slate-900">Your bag is empty</p>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
                Explore hand-block printed Ajrakh kurtas, Bhujodi Kala cotton weaves, and pure
                Gajji silk Bandhani drapes from Kutch.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 min-h-[40px] text-xs font-semibold text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Explore Kutchi Apparel
              </button>
            </div>
          ) : (
            detailedItems.map((entry) => (
              <div
                key={`${entry.productId}-${entry.finishId}`}
                className="py-4 flex items-start gap-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onInspectProduct(entry.product.id);
                  }}
                  className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer"
                >
                  <ResilientImage
                    src={entry.product.image}
                    alt={entry.product.imageAlt}
                    fallbackTitle={entry.product.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onInspectProduct(entry.product.id);
                      }}
                      className="text-sm font-semibold text-slate-900 hover:text-blue-700 text-left leading-snug cursor-pointer"
                    >
                      {entry.product.name}
                    </button>
                    <span className="font-mono text-sm font-medium text-slate-900 tabular-nums shrink-0">
                      {formatINR(entry.lineTotal)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 truncate">{entry.finish.name}</p>
                  <p className="font-mono text-[11px] text-slate-400 mt-0.5 tabular-nums">
                    {formatINR(entry.unitPrice)} each · {entry.product.sku}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-slate-200 rounded-md bg-slate-50 h-8">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(entry.productId, entry.finishId, -1)}
                        aria-label={`Decrease quantity of ${entry.product.name}`}
                        className="w-8 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-medium text-slate-900 tabular-nums">
                        {entry.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(entry.productId, entry.finishId, 1)}
                        aria-label={`Increase quantity of ${entry.product.name}`}
                        className="w-8 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(entry.productId, entry.finishId)}
                      aria-label={`Remove ${entry.product.name} from bag`}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Summary & Checkout Trigger */}
        {detailedItems.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            {/* Craft Patron Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between text-xs bg-white border border-slate-200 rounded-lg px-3 py-2">
                  <span className="text-slate-700">
                    Patron Code <strong className="font-mono text-slate-900">{appliedPromo}</strong>{' '}
                    applied (-10%)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onApplyPromo(null);
                      setPromoFeedback(null);
                    }}
                    className="text-slate-500 hover:text-slate-900 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Patron code (try KUTCH10)"
                    aria-label="Promotional or craft patron code"
                    className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                  <button
                    type="submit"
                    className="h-9 px-3.5 text-xs font-medium text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoFeedback && (
                <p className="text-[11px] text-slate-500 mt-1">{promoFeedback}</p>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Craft Patron Discount (10%)</span>
                  <span className="font-mono tabular-nums">-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Pan-India Insured Courier</span>
                <span className="font-mono tabular-nums">
                  {discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatINR(250)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-semibold text-slate-900">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums">
                  {formatINR(
                    discountedSubtotal +
                      (discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250)
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full h-11 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
