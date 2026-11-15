import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../data/products';
import {
  CartItem,
  CustomerAddress,
  OrderRecord,
  PaymentMethod,
  Product,
  ShippingMethod,
} from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface CheckoutViewProps {
  items: CartItem[];
  products: Product[];
  appliedPromo: string | null;
  onBackToStore: () => void;
  onCompleteOrder: (order: OrderRecord) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  products,
  appliedPromo,
  onBackToStore,
  onCompleteOrder,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [stateName, setStateName] = useState('Gujarat');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(ShippingMethod.Standard);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CardUpi);

  // Card / UPI inputs (only required when PaymentMethod.CardUpi is active)
  const [cardOrUpiId, setCardOrUpiId] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const lineItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const finish =
        product.finishes.find((f) => f.id === item.finishId) || product.finishes[0];
      const unitPrice = product.basePrice + finish.priceDelta;
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        finishName: finish.name,
        unitPrice,
        quantity: item.quantity,
        image: product.image,
        leadTimeDays: finish.leadTimeDays,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const netSubtotal = subtotal - discount;

  const standardShippingFee = netSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const shippingCost =
    shippingMethod === ShippingMethod.ExpressGift ? 650 : standardShippingFee;
  // 5% Indian GST applicable on handloom apparel
  const taxAmount = Math.round(netSubtotal * 0.05);
  const total = netSubtotal + shippingCost + taxAmount;

  const maxLeadDays = lineItems.reduce((max, i) => Math.max(max, i.leadTimeDays), 2);

  const handleFillSampleAddress = () => {
    setFullName('Devanshi Jadeja');
    setEmail('devanshi.jadeja@example.in');
    setPhone('+91 98250 44120');
    setStreetAddress('14, Sanskar Nagar, Near Jubilee Ground');
    setApartment('Opp. Craft Heritage Haveli');
    setCity('Bhuj, Kutch');
    setPostalCode('370001');
    setStateName('Gujarat');
    setDeliveryNotes('Call on mobile before doorstep delivery.');
    if (paymentMethod === PaymentMethod.CardUpi) {
      setCardOrUpiId('4532 •••• •••• 7719');
      setCardExpiry('08/29');
      setCardCvc('614');
    }
    setFormError(null);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !streetAddress.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      setFormError('Please complete all required recipient and Indian PIN code fields.');
      return;
    }

    if (paymentMethod === PaymentMethod.CardUpi && !cardOrUpiId.trim()) {
      setFormError('Please enter your Card / UPI details or select Cash on Delivery (COD).');
      return;
    }

    const orderNumber = `BB-${Math.floor(1040 + Math.random() * 8900)}`;
    const now = new Date();
    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + maxLeadDays + 3);

    const customer: CustomerAddress = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      streetAddress: streetAddress.trim(),
      apartment: apartment.trim() || undefined,
      city: city.trim(),
      postalCode: postalCode.trim(),
      stateName: stateName.trim(),
      deliveryNotes: deliveryNotes.trim() || undefined,
    };

    const newOrder: OrderRecord = {
      id: orderNumber,
      createdAt: now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'Confirmed — Preparing Shipment',
      shippingMethod,
      paymentMethod,
      customer,
      items: lineItems.map(({ leadTimeDays: _lt, ...rest }) => rest),
      subtotal,
      discount,
      promoCode: appliedPromo || undefined,
      shippingCost,
      taxAmount,
      total,
    };

    onCompleteOrder(newOrder);
  };

  if (lineItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-slate-900">Your bag is currently empty</h1>
        <p className="text-sm text-slate-600 mt-2">
          Add Kutchi handloom kurtas, jackets, or shawls before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={onBackToStore}
          className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-8 sm:py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            <span>Bhuj Atelier Direct Checkout · Pan-India Insured Dispatch</span>
          </div>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Left Column: Customer Verification, Courier & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Recipient & PIN Code Verification */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h1 className="font-display text-xl sm:text-2xl text-slate-900">
                    01. Recipient &amp; Delivery Address
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Used for courier tracking SMS and GST invoice generation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFillSampleAddress}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Fill Sample Gujarat Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Devanshi Jadeja"
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="devanshi@example.in"
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile Number (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98250 44120"
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    House / Bunglow / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="14, Sanskar Nagar, Near Jubilee Ground"
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Landmark / Society (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Near Kutch Museum"
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    City / Taluka *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bhuj / Ahmedabad / Mumbai"
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="370001"
                      className="w-full h-10 px-3 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">State *</label>
                    <select
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full h-10 px-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Telangana">Telangana</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Delivery or Gift Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Preferred delivery hours or gift message..."
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Courier & Mulmul Packaging Service */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
              <h2 className="font-display text-xl text-slate-900 mb-4">
                02. Dispatch &amp; Heirloom Packaging
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShippingMethod(ShippingMethod.Standard)}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    shippingMethod === ShippingMethod.Standard
                      ? 'border-blue-700 bg-blue-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Insured Surface / Air Courier
                    </span>
                    <span className="font-mono text-sm font-medium text-slate-900 tabular-nums">
                      {standardShippingFee === 0 ? 'Free' : formatINR(standardShippingFee)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Wrapped in breathable unbleached cotton mulmul with artisan provenance card (3–5
                    days across India).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod(ShippingMethod.ExpressGift)}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    shippingMethod === ShippingMethod.ExpressGift
                      ? 'border-blue-700 bg-blue-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Express Air &amp; Ajrakh Gift Box
                    </span>
                    <span className="font-mono text-sm font-medium text-slate-900 tabular-nums">
                      {formatINR(650)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Priority 48-hour metro air dispatch inside a hand-lined Ajrakh cloth keepsake
                    box with neem-wood sachet.
                  </p>
                </button>
              </div>
            </section>

            {/* Step 3: Payment Method (Card / UPI or COD) */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
              <h2 className="font-display text-xl text-slate-900 mb-4">03. Payment Method</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod(PaymentMethod.CardUpi)}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    paymentMethod === PaymentMethod.CardUpi
                      ? 'border-blue-700 bg-blue-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <CreditCard className="w-4 h-4 text-blue-700" />
                    <span>Card / UPI Instant Pay</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    RuPay, Visa, Mastercard, or UPI ID with instant Bhuj loom allocation.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod(PaymentMethod.CashOnDelivery)}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    paymentMethod === PaymentMethod.CashOnDelivery
                      ? 'border-blue-700 bg-blue-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Truck className="w-4 h-4 text-blue-700" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Pay cash or UPI QR at your doorstep upon parcel delivery ({formatINR(0)} fee).
                  </p>
                </button>
              </div>

              {paymentMethod === PaymentMethod.CardUpi ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Card Number or UPI ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardOrUpiId}
                      onChange={(e) => setCardOrUpiId(e.target.value)}
                      placeholder="4532 0000 0000 7719 or name@okicici"
                      className="w-full h-10 px-3.5 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Expiry (if Card)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full h-10 px-3 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      CVV (if Card)
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="614"
                      className="w-full h-10 px-3 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 space-y-1.5">
                  <p className="font-semibold text-slate-900">
                    Cash on Delivery (COD) Verification Terms
                  </p>
                  <p>
                    Total payable on arrival:{' '}
                    <strong className="font-mono text-slate-900 tabular-nums">
                      {formatINR(total)}
                    </strong>{' '}
                    (includes{' '}
                    {shippingCost === 0
                      ? 'complimentary Pan-India courier'
                      : `${formatINR(shippingCost)} dispatch`}{' '}
                    and 5% Handloom GST).
                  </p>
                  <p className="text-slate-500">
                    Our Bhuj dispatch desk sends an SMS confirmation prior to shipment. Delivery
                    partners accept cash as well as BharatQR / UPI scan at your doorstep.
                  </p>
                </div>
              )}

              {formError && (
                <p role="alert" className="mt-4 text-xs font-medium text-red-600">
                  {formError}
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl text-slate-900 pb-4 border-b border-slate-200">
              Order Summary ({lineItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            <div className="divide-y divide-slate-200 max-h-80 overflow-y-auto">
              {lineItems.map((item) => (
                <div
                  key={`${item.productId}-${item.finishName}`}
                  className="py-4 flex items-center gap-3.5"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      fallbackTitle={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{item.finishName}</p>
                    <p className="font-mono text-[11px] text-slate-400 tabular-nums">
                      Qty {item.quantity} × {formatINR(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-medium text-slate-900 tabular-nums shrink-0">
                    {formatINR(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Patron Code ({appliedPromo})</span>
                  <span className="font-mono tabular-nums">-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>
                  {shippingMethod === ShippingMethod.ExpressGift
                    ? 'Express Air & Ajrakh Gift Box'
                    : 'Pan-India Insured Courier'}
                </span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'Free' : formatINR(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Handloom GST (5%)</span>
                <span className="font-mono tabular-nums">{formatINR(taxAmount)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base font-semibold text-slate-900">
                <span>Total Payable</span>
                <span className="font-mono text-lg tabular-nums">{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full h-12 px-6 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {paymentMethod === PaymentMethod.CashOnDelivery
                  ? `Confirm COD Order — ${formatINR(total)}`
                  : `Complete Order — ${formatINR(total)}`}
              </span>
            </button>

            <p className="mt-3 text-[11px] text-slate-500 text-center leading-relaxed">
              Authentic Kutchi craft guarantee from Banty&apos;s Bag · 15-day size exchange &amp;
              easy returns.
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
};
