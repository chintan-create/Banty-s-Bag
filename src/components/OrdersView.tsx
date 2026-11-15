import React from 'react';
import { ArrowLeft, CheckCircle2, Package, Printer } from 'lucide-react';
import { OrderRecord, PaymentMethod, ShippingMethod } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface OrdersViewProps {
  orders: OrderRecord[];
  highlightedOrderId: string | null;
  onBackToStore: () => void;
  onInspectProduct: (productId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  highlightedOrderId,
  onBackToStore,
  onInspectProduct,
}) => {
  return (
    <div className="bg-slate-50 py-10 sm:py-14 min-h-[70vh]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Collection</span>
            </button>
            <h1 className="font-display text-2xl sm:text-3xl text-slate-900">
              Order Verification &amp; Shipment Tracking
            </h1>
          </div>

          <p className="font-mono text-xs text-slate-500 tabular-nums">
            {orders.length} {orders.length === 1 ? 'recorded order' : 'recorded orders'}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 bg-white border border-slate-200 rounded-xl p-12 text-center">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
            <h2 className="font-display text-xl text-slate-900">No orders placed yet</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Once you complete checkout, your confirmed Banty&apos;s Bag order number, Bhuj atelier
              inspection status, and itemized rupee GST receipt appear here.
            </p>
            <button
              type="button"
              onClick={onBackToStore}
              className="mt-6 px-5 py-2.5 min-h-[40px] text-sm font-semibold text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Explore Kutchi Apparel
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {orders.map((order) => {
              const isJustConfirmed = order.id === highlightedOrderId;

              return (
                <article
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  {/* Confirmation Banner Header */}
                  <div
                    className={`px-6 sm:px-8 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 ${
                      isJustConfirmed ? 'bg-blue-50/50' : 'bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                      <div>
                        <h2 className="font-sans text-base font-semibold text-slate-900">
                          Order #{order.id} {order.status}
                        </h2>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span>Placed {order.createdAt}</span>
                          <span aria-hidden="true">·</span>
                          <span>Estimated Arrival: {order.estimatedDelivery}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {order.paymentMethod === PaymentMethod.CashOnDelivery
                              ? 'Cash on Delivery (COD)'
                              : 'Paid via Card / UPI'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print GST Receipt</span>
                    </button>
                  </div>

                  {/* 4-Stage Fulfillment Progress */}
                  <div className="px-6 sm:px-8 py-5 border-b border-slate-200">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="font-mono text-[11px] text-blue-700 font-medium">
                          01 · Completed
                        </p>
                        <p className="font-medium text-slate-900 mt-0.5">Order Verified</p>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] text-blue-700 font-medium">
                          02 · In Progress
                        </p>
                        <p className="font-medium text-slate-900 mt-0.5">
                          Bhuj Loom &amp; Dye Inspection
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] text-slate-400">03 · Upcoming</p>
                        <p className="text-slate-500 mt-0.5">Mulmul Wrapping &amp; Dispatch</p>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] text-slate-400">
                          04 · {order.estimatedDelivery}
                        </p>
                        <p className="text-slate-500 mt-0.5">
                          {order.shippingMethod === ShippingMethod.ExpressGift
                            ? 'Express Air Gift Box Arrival'
                            : 'Insured Doorstep Delivery'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Itemized Receipt & Recipient Summary */}
                  <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 divide-y divide-slate-200">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4"
                        >
                          <button
                            type="button"
                            onClick={() => onInspectProduct(item.productId)}
                            className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer"
                          >
                            <ResilientImage
                              src={item.image}
                              alt={item.name}
                              fallbackTitle={item.name}
                              className="w-full h-full object-cover"
                            />
                          </button>
                          <div className="flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => onInspectProduct(item.productId)}
                              className="text-sm font-semibold text-slate-900 hover:text-blue-700 text-left cursor-pointer"
                            >
                              {item.name}
                            </button>
                            <p className="text-xs text-slate-500 mt-0.5">{item.finishName}</p>
                            <p className="font-mono text-[11px] text-slate-400 tabular-nums mt-0.5">
                              {item.sku} · Qty {item.quantity} × {formatINR(item.unitPrice)}
                            </p>
                          </div>
                          <span className="font-mono text-sm font-medium text-slate-900 tabular-nums">
                            {formatINR(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Delivery Address</p>
                        <p className="text-slate-700">{order.customer.fullName}</p>
                        <p className="text-slate-600">{order.customer.streetAddress}</p>
                        {order.customer.apartment && (
                          <p className="text-slate-600">{order.customer.apartment}</p>
                        )}
                        <p className="text-slate-600">
                          {order.customer.city} — {order.customer.postalCode},{' '}
                          {order.customer.stateName}
                        </p>
                        <p className="text-slate-500 mt-1">
                          {order.customer.phone} · {order.customer.email}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 space-y-1.5">
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal</span>
                          <span className="font-mono tabular-nums">
                            {formatINR(order.subtotal)}
                          </span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-700">
                            <span>Patron Discount</span>
                            <span className="font-mono tabular-nums">
                              -{formatINR(order.discount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600">
                          <span>Courier Dispatch</span>
                          <span className="font-mono tabular-nums">
                            {order.shippingCost === 0 ? 'Free' : formatINR(order.shippingCost)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Handloom GST (5%)</span>
                          <span className="font-mono tabular-nums">
                            {formatINR(order.taxAmount)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-semibold text-slate-900">
                          <span>
                            {order.paymentMethod === PaymentMethod.CashOnDelivery
                              ? 'Payable on Delivery'
                              : 'Total Paid'}
                          </span>
                          <span className="font-mono tabular-nums">{formatINR(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
