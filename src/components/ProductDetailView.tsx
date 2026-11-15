import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Ruler,
  Share2,
  Star,
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';
import { TechnicalBlueprint } from './TechnicalBlueprint';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  isWishlisted: boolean;
  customReviews: ProductReview[];
  onBack: () => void;
  onSelectCategory: (category: Product['category']) => void;
  onAddToCart: (productId: string, finishId: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  isWishlisted,
  customReviews,
  onBack,
  onSelectCategory,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  onAddReview,
}) => {
  const [selectedFinishId, setSelectedFinishId] = useState<string>(product.finishes[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [galleryMode, setGalleryMode] = useState<'photo' | 'blueprint'>('photo');
  const [openAccordion, setOpenAccordion] = useState<'specs' | 'care' | 'shipping' | null>('specs');
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);
  const copyToastTimeoutRef = useRef<number | null>(null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRole, setReviewRole] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    setSelectedFinishId(product.finishes[0].id);
    setQuantity(1);
    setGalleryMode('photo');
    setAddedFeedback(false);
    setShowCopyToast(false);
    setShowReviewForm(false);
  }, [product.id, product.finishes]);

  useEffect(() => {
    return () => {
      if (copyToastTimeoutRef.current !== null) {
        window.clearTimeout(copyToastTimeoutRef.current);
      }
    };
  }, []);

  const activeFinish =
    product.finishes.find((f) => f.id === selectedFinishId) || product.finishes[0];
  const unitPrice = product.basePrice + activeFinish.priceDelta;
  const totalPrice = unitPrice * quantity;

  const allReviews = [...customReviews, ...product.reviews];
  const avgRating =
    allReviews.length > 0
      ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
      : '5.0';

  const handlePurchaseClick = () => {
    onAddToCart(product.id, activeFinish.id, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  const handleShareClick = async () => {
    const shareUrlObj = new URL(window.location.href);
    shareUrlObj.searchParams.set('product', product.id);
    const shareUrl = shareUrlObj.toString();

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // Ignore fallback failure
      }
    }

    setShowCopyToast(true);
    if (copyToastTimeoutRef.current !== null) {
      window.clearTimeout(copyToastTimeoutRef.current);
    }
    copyToastTimeoutRef.current = window.setTimeout(() => {
      setShowCopyToast(false);
    }, 2400);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewTitle.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, {
      author: reviewAuthor.trim(),
      role: reviewRole.trim() || 'Verified Patron',
      location: reviewLocation.trim() || 'Gujarat',
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    });
    setReviewAuthor('');
    setReviewRole('');
    setReviewLocation('');
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="bg-slate-50 pb-24 md:pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        {/* Clean Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Apparel</span>
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onSelectCategory(product.category)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {product.category}
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              Cluster Ref {product.sku} · {product.craftVillage}
            </span>
          </div>
        </div>

        {/* Sticky Gallery Left + Contiguous Purchase Module Right */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sticky Gallery Column */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-200">
              {galleryMode === 'photo' ? (
                <ResilientImage
                  src={product.image}
                  alt={product.imageAlt}
                  fallbackTitle={product.name}
                  fallbackCode={product.sku}
                  className="w-full h-full object-cover"
                />
              ) : (
                <TechnicalBlueprint
                  sku={product.sku}
                  name={product.name}
                  dimensions={product.dimensions}
                />
              )}
            </div>

            {/* Interactive Gallery Mode Switcher */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
                <button
                  type="button"
                  onClick={() => setGalleryMode('photo')}
                  className={`px-3.5 py-1.5 min-h-[36px] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    galleryMode === 'photo'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Studio Photograph
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryMode('blueprint')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[36px] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    galleryMode === 'blueprint'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Garment Measurements</span>
                </button>
              </div>

              <p className="font-mono text-xs text-slate-500 tabular-nums">
                {product.dimensions.isDrape ? 'Width' : 'Chest'} {product.dimensions.chestOrWidthCm}{' '}
                cm × Length {product.dimensions.lengthCm} cm · {product.dimensions.fabricWeightGsm}{' '}
                GSM
              </p>
            </div>
          </div>

          {/* Right Sticky Contiguous Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{product.subCategory}</span>
              <span aria-hidden="true">·</span>
              <span>{product.craftVillage}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {avgRating} ★ ({allReviews.length}{' '}
                {allReviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-2xl font-medium text-slate-900 tabular-nums">
                {formatINR(unitPrice)}
              </span>
              <span className="text-xs text-slate-500">
                5% Handloom GST calculated at checkout · Free courier over {formatINR(5000)}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{product.summary}</p>

            {/* Dye Shade & Size Selection */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-medium text-slate-900">Colorway &amp; Size</span>
                <span className="text-slate-600 truncate max-w-[210px]">{activeFinish.name}</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {product.finishes.map((finish) => {
                  const selected = finish.id === activeFinish.id;
                  const finishPrice = product.basePrice + finish.priceDelta;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setSelectedFinishId(finish.id)}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 min-h-[44px] rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
                        selected
                          ? 'border-blue-700 bg-blue-50/40 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span
                          style={{ backgroundColor: finish.swatchHex }}
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {finish.name}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-slate-600 tabular-nums shrink-0">
                        {formatINR(finishPrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unboxed Availability & Lead Time */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-900">
                {activeFinish.inStock ? 'Available at Bhuj Atelier' : 'Loom Pre-Order'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {activeFinish.leadTimeDays <= 2
                  ? 'Dispatches from Bhuj within 48 hours'
                  : `Ships in ${activeFinish.leadTimeDays} business days`}
              </span>
            </div>

            {/* Quantity Stepper + Primary Add to Bag Action */}
            <div className="mt-5 flex items-center gap-3">
              <div
                aria-label="Select quantity"
                className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 h-11"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono text-sm font-medium text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handlePurchaseClick}
                className={`flex-1 h-11 px-5 rounded-lg text-sm font-semibold text-white transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  addedFeedback ? 'bg-emerald-700' : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>
                    Add to Bag —{' '}
                    <span className="font-mono tabular-nums">{formatINR(totalPrice)}</span>
                  </span>
                )}
              </button>
            </div>

            {/* Secondary Utility Actions: Save & Share */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from saved items' : 'Save item'}
                className="h-10 px-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                <Heart
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isWishlisted ? 'fill-blue-700 text-blue-700' : ''
                  }`}
                />
                <span>{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                aria-label={`Share link to ${product.name}`}
                className="h-10 px-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                <Share2 className="w-3.5 h-3.5 shrink-0" />
                <span>Share</span>
              </button>
            </div>

            {/* Expandable Craft & Care Accordions */}
            <div className="mt-7 border-t border-slate-200 divide-y divide-slate-200">
              {/* Accordion 1: Craftsmanship & Measurements */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                  aria-expanded={openAccordion === 'specs'}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-medium text-slate-900 cursor-pointer"
                >
                  <span>Weave, Dye &amp; Garment Specifications</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${
                      openAccordion === 'specs' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'specs' && (
                  <div className="pb-4 space-y-3 text-xs text-slate-600 leading-relaxed">
                    <ul className="space-y-1.5 list-disc pl-4">
                      {product.craftsmanshipNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                    <div className="pt-2 grid grid-cols-2 gap-2 font-mono text-slate-700 tabular-nums">
                      <span>
                        {product.dimensions.isDrape ? 'Width' : 'Chest'}:{' '}
                        {product.dimensions.chestOrWidthCm} cm
                      </span>
                      <span>Length: {product.dimensions.lengthCm} cm</span>
                      <span>
                        {product.dimensions.isDrape ? 'Pallu Border' : 'Sleeve / Arm'}:{' '}
                        {product.dimensions.sleeveOrBorderCm} cm
                      </span>
                      <span>Fabric Weight: {product.dimensions.fabricWeightGsm} GSM</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Textile Care */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                  aria-expanded={openAccordion === 'care'}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-medium text-slate-900 cursor-pointer"
                >
                  <span>Natural Dye &amp; Handloom Wash Care</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${
                      openAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <div className="pb-4 space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {product.careInstructions.map((line, idx) => (
                      <p key={idx}>• {line}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: Pan-India Courier, COD & Exchanges */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')
                  }
                  aria-expanded={openAccordion === 'shipping'}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-medium text-slate-900 cursor-pointer"
                >
                  <span>Pan-India Courier, Cash on Delivery &amp; Exchanges</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 space-y-2 text-xs text-slate-600 leading-relaxed">
                    <p>
                      Complimentary insured courier across India on all orders over{' '}
                      {formatINR(5000)} ({formatINR(250)} flat rate below {formatINR(5000)}).
                      Express Air Dispatch in a cedar-scented mulmul keepsake box available for{' '}
                      {formatINR(650)}.
                    </p>
                    <p>
                      UPI / Card payments and Cash on Delivery (COD) are accepted across all
                      serviceable Indian PIN codes with zero COD surcharge. Easy 15-day size
                      exchange &amp; return policy.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Client & Patron Reviews Section */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Patron Impressions</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{avgRating} / 5.0 Average</span>
              </div>
              <h2 className="font-display text-2xl text-slate-900">
                Verified Craft &amp; Wardrobe Reviews ({allReviews.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm((prev) => !prev)}
              className="px-4 py-2 min-h-[40px] text-xs font-medium text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 bg-white border border-slate-200 rounded-xl p-6 space-y-4 max-w-2xl"
            >
              <h3 className="font-sans text-sm font-semibold text-slate-900">
                Share Your Review for {product.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="Bhumi Patel"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Profession / Role
                  </label>
                  <input
                    type="text"
                    value={reviewRole}
                    onChange={(e) => setReviewRole(e.target.value)}
                    placeholder="Craft Patron"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="Rajkot / Mumbai"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-700"
                  >
                    <option value={5}>5 Stars — Exceptional</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Satisfactory</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Rich natural dyes and breathable weave"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Observations *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share how the fabric, fit, and handwork feel..."
                  className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 min-h-[40px] text-xs font-semibold text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Publish Verified Review
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allReviews.map((review) => (
              <article
                key={review.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-900">
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                      ))}
                    </div>
                    <span>{review.date}</span>
                  </div>
                  <h3 className="mt-3 font-sans text-sm font-semibold text-slate-900">
                    {review.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-medium text-slate-800">{review.author}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{review.role}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{review.location}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Companion Kutchi Garments */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="font-display text-2xl text-slate-900 mb-6">
            Pair With Other Kutchi Handloom Pieces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden group transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => onSelectProduct(item.id)}
                  className="w-full text-left cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <ResilientImage
                      src={item.image}
                      alt={item.imageAlt}
                      fallbackTitle={item.name}
                      fallbackCode={item.sku}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500">
                      {item.subCategory} · {item.craftVillage}
                    </p>
                    <div className="mt-1.5 flex items-baseline justify-between gap-3">
                      <h3 className="font-sans text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-mono text-sm font-medium text-slate-900 tabular-nums shrink-0">
                        {formatINR(item.basePrice)}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="fixed md:hidden inset-x-0 bottom-0 z-20 h-14 bg-white border-t border-slate-200 px-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900 truncate">{product.name}</p>
          <p className="font-mono text-xs text-slate-600 tabular-nums truncate">
            {formatINR(totalPrice)} · {activeFinish.name.split('—')[0]}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePurchaseClick}
          className="px-4 py-2 min-h-[40px] rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {addedFeedback ? 'Added ✓' : 'Add to Bag'}
        </button>
      </div>

      {/* 'Link copied!' Toast Notification */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-18 md:bottom-6 right-4 sm:right-8 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg transition-all duration-150 pointer-events-none ${
          showCopyToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Link copied!</span>
      </div>
    </div>
  );
};
