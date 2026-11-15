export enum CategoryFilter {
  All = 'All Apparel',
  KurtasTunics = 'Kurtas & Tunics',
  JacketsWraps = 'Kediyu & Jackets',
  ShawlsDupattas = 'Shawls & Dupattas',
}

export enum SortOption {
  Featured = 'featured',
  PriceAsc = 'price-asc',
  PriceDesc = 'price-desc',
  LeadTime = 'lead-time',
}

export enum ShippingMethod {
  Standard = 'standard',
  ExpressGift = 'express-gift',
}

export enum PaymentMethod {
  CardUpi = 'card-upi',
  CashOnDelivery = 'cod',
}

export interface ProductFinish {
  id: string;
  name: string;
  swatchHex: string;
  priceDelta: number;
  leadTimeDays: number;
  inStock: boolean;
}

export interface ProductDimensions {
  chestOrWidthCm: number;
  lengthCm: number;
  sleeveOrBorderCm: number;
  fabricWeightGsm: number;
  isDrape?: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category:
    | CategoryFilter.KurtasTunics
    | CategoryFilter.JacketsWraps
    | CategoryFilter.ShawlsDupattas;
  subCategory: string;
  craftVillage: string;
  primaryMaterial: string;
  basePrice: number;
  statusNote: string;
  inStock: boolean;
  leadTimeLabel: string;
  leadTimeDays: number;
  image: string;
  imageAlt: string;
  summary: string;
  craftsmanshipNotes: string[];
  careInstructions: string[];
  dimensions: ProductDimensions;
  finishes: ProductFinish[];
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  finishId: string;
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  stateName: string;
  deliveryNotes?: string;
}

export interface OrderLineItem {
  productId: string;
  sku: string;
  name: string;
  finishName: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  estimatedDelivery: string;
  status: 'Confirmed — Preparing Shipment' | 'Bhuj Loom & Dye Quality Check' | 'Dispatched via Insured Courier';
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  customer: CustomerAddress;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shippingCost: number;
  taxAmount: number;
  total: number;
}
