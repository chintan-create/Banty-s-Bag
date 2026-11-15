(function () {
  'use strict';

  const WISHLIST_KEY = 'bantys_bag_wp_wishlist_v1';
  let currentCart = window.bbInitialCart || { count: 0, subtotal: 0, discount: 0, shipping: 0, total: 0, items: [] };

  function formatINR(amount) {
    return '₹' + Math.round(Number(amount || 0)).toLocaleString('en-IN');
  }

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function setWishlist(ids) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
    syncWishlistUI();
  }

  function syncWishlistUI() {
    const ids = getWishlist();
    const savedCountEl = document.getElementById('bb-saved-count');
    if (savedCountEl) savedCountEl.textContent = String(ids.length);

    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const pid = btn.getAttribute('data-wishlist-toggle');
      const saved = ids.includes(pid);
      btn.classList.toggle('is-saved', saved);
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', saved ? '#1d4ed8' : 'none');
      }
    });
  }

  window.bbOpenBagDrawer = function () {
    const drawer = document.getElementById('bb-cart-drawer');
    if (drawer) {
      drawer.classList.add('is-open');
      renderCartDrawer(currentCart);
    }
  };

  window.bbCloseBagDrawer = function () {
    const drawer = document.getElementById('bb-cart-drawer');
    if (drawer) drawer.classList.remove('is-open');
  };

  function renderCartDrawer(cart) {
    currentCart = cart;
    const headerCount = document.getElementById('bb-header-bag-count');
    const headerSub = document.getElementById('bb-header-bag-subtotal');
    const drawerCount = document.getElementById('bb-drawer-count');
    if (headerCount) headerCount.textContent = String(cart.count || 0);
    if (drawerCount) drawerCount.textContent = String(cart.count || 0);
    if (headerSub) {
      if (cart.count > 0) {
        headerSub.style.display = 'inline';
        headerSub.textContent = '· ' + formatINR(cart.subtotal);
      } else {
        headerSub.style.display = 'none';
      }
    }

    const threshold = (window.bbStoreData && window.bbStoreData.freeShippingThreshold) || 5000;
    const net = Math.max(0, (cart.subtotal || 0) - (cart.discount || 0));
    const remaining = Math.max(0, threshold - net);
    const pct = Math.min(1, net / threshold);
    const shipText = document.getElementById('bb-drawer-shipping-text');
    const shipProg = document.getElementById('bb-drawer-shipping-progress');
    if (shipText) {
      shipText.innerHTML =
        remaining === 0
          ? '<strong>Complimentary Pan-India insured courier unlocked.</strong>'
          : 'Add <strong class="font-mono">' + formatINR(remaining) + '</strong> more for free Pan-India courier.';
    }
    if (shipProg) {
      shipProg.style.transform = 'scaleX(' + pct + ')';
    }

    const itemsEl = document.getElementById('bb-drawer-items');
    const footerEl = document.getElementById('bb-drawer-footer');
    const totalsEl = document.getElementById('bb-drawer-totals');
    if (!itemsEl || !footerEl) return;

    if (!cart.items || cart.items.length === 0) {
      itemsEl.innerHTML =
        '<div style="padding:3.5rem 1rem;text-align:center;">' +
        '<p class="font-display" style="font-size:1.125rem;color:#0f172a;">Your bag is empty</p>' +
        '<p style="font-size:0.75rem;color:#64748b;margin:0.5rem auto 1.25rem;max-width:18rem;">Explore hand-block printed Ajrakh kurtas, Bhujodi Kala cotton weaves, and pure Gajji silk Bandhani drapes from Kutch.</p>' +
        '<button type="button" onclick="window.bbCloseBagDrawer()" class="bb-btn-dark">Explore Kutchi Apparel</button>' +
        '</div>';
      footerEl.style.display = 'none';
      return;
    }

    footerEl.style.display = 'block';
    itemsEl.innerHTML = cart.items
      .map(
        (item) =>
          '<div style="padding:1rem 0;border-bottom:1px solid #e2e8f0;display:flex;gap:1rem;align-items:flex-start;">' +
          '<img src="' + item.image + '" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:0.5rem;border:1px solid #e2e8f0;flex-shrink:0;" />' +
          '<div style="flex:1;min-width:0;">' +
          '<div style="display:flex;justify-content:space-between;gap:0.5rem;">' +
          '<a href="' + item.url + '" style="font-size:0.875rem;font-weight:600;color:#0f172a;">' + item.name + '</a>' +
          '<span class="font-mono tabular-nums" style="font-size:0.875rem;font-weight:500;">' + formatINR(item.lineTotal) + '</span>' +
          '</div>' +
          '<p style="margin:0.125rem 0;font-size:0.75rem;color:#64748b;">' + item.variationName + '</p>' +
          '<p class="font-mono" style="margin:0;font-size:11px;color:#94a3b8;">' + formatINR(item.unitPrice) + ' each · ' + item.sku + '</p>' +
          '<div style="margin-top:0.625rem;display:flex;align-items:center;justify-content:space-between;">' +
          '<div style="display:inline-flex;border:1px solid #e2e8f0;border-radius:0.375rem;height:30px;">' +
          '<button type="button" onclick="window.bbCartAction(\'update_qty\',\'' + item.key + '\',' + (item.quantity - 1) + ')" style="width:28px;border:none;background:none;cursor:pointer;">-</button>' +
          '<span class="font-mono" style="width:24px;text-align:center;line-height:28px;font-size:0.75rem;">' + item.quantity + '</span>' +
          '<button type="button" onclick="window.bbCartAction(\'update_qty\',\'' + item.key + '\',' + (item.quantity + 1) + ')" style="width:28px;border:none;background:none;cursor:pointer;">+</button>' +
          '</div>' +
          '<button type="button" onclick="window.bbCartAction(\'remove\',\'' + item.key + '\',0)" style="border:none;background:none;font-size:0.75rem;color:#64748b;cursor:pointer;">Remove</button>' +
          '</div></div></div>'
      )
      .join('');

    if (totalsEl) {
      totalsEl.innerHTML =
        '<div style="display:flex;justify-content:space-between;color:#475569;"><span>Subtotal</span><span class="font-mono">' + formatINR(cart.subtotal) + '</span></div>' +
        (cart.discount > 0
          ? '<div style="display:flex;justify-content:space-between;color:#047857;"><span>Craft Patron Discount (' + cart.appliedPromo + ')</span><span class="font-mono">-' + formatINR(cart.discount) + '</span></div>'
          : '') +
        '<div style="display:flex;justify-content:space-between;color:#475569;"><span>Pan-India Insured Courier</span><span class="font-mono">' + (cart.shipping === 0 ? 'Free' : formatINR(cart.shipping)) + '</span></div>' +
        '<div style="padding-top:0.5rem;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:0.875rem;font-weight:600;color:#0f172a;"><span>Estimated Total</span><span class="font-mono">' + formatINR(cart.total) + '</span></div>';
    }
  }

  async function postAjax(action, payload) {
    if (!window.bbStoreData) return null;
    const formData = new FormData();
    formData.append('action', action);
    formData.append('nonce', window.bbStoreData.nonce);
    Object.keys(payload).forEach((k) => formData.append(k, payload[k]));

    const res = await fetch(window.bbStoreData.ajaxUrl, { method: 'POST', body: formData });
    return res.json();
  }

  window.bbCartAction = async function (cartAction, cartKey, qty) {
    const json = await postAjax('bb_cart_action', {
      cart_action: cartAction,
      cart_key: cartKey,
      quantity: qty,
    });
    if (json && json.success) renderCartDrawer(json.data);
  };

  // Single Product Page helpers
  window.bbSwitchGalleryMode = function (mode) {
    const photo = document.getElementById('bb-pdp-photo');
    const bp = document.getElementById('bb-pdp-blueprint');
    const btnPhoto = document.getElementById('bb-mode-photo');
    const btnBp = document.getElementById('bb-mode-blueprint');
    if (!photo || !bp) return;
    const isBp = mode === 'blueprint';
    photo.style.display = isBp ? 'none' : 'block';
    bp.style.display = isBp ? 'block' : 'none';
    if (btnPhoto) btnPhoto.classList.toggle('is-active', !isBp);
    if (btnBp) btnBp.classList.toggle('is-active', isBp);
  };

  let pdpQty = 1;
  window.bbStepQty = function (delta) {
    pdpQty = Math.max(1, Math.min(20, pdpQty + delta));
    const qtyEl = document.getElementById('bb-pdp-qty');
    const addBtn = document.getElementById('bb-pdp-add-btn');
    const btnTotal = document.getElementById('bb-pdp-btn-total');
    if (qtyEl) qtyEl.textContent = String(pdpQty);
    if (addBtn && btnTotal) {
      const unit = Number(addBtn.getAttribute('data-unit-price') || 0);
      btnTotal.textContent = formatINR(unit * pdpQty);
    }
  };

  window.bbCopyShareLink = function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    const toast = document.getElementById('bb-toast');
    if (toast) {
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 2200);
    }
  };

  // Catalog Filtering (Category, Search, Dual Price Slider, Ready-to-Ship, Saved, Sort)
  function applyCatalogFilters() {
    const grid = document.getElementById('bb-product-grid');
    if (!grid) return;

    const activeTab = document.querySelector('.bb-tab[data-cat-filter].is-active');
    const cat = activeTab ? activeTab.getAttribute('data-cat-filter') : 'all';
    const query = (document.getElementById('bb-catalog-search')?.value || '').trim().toLowerCase();
    const readyOnly = document.getElementById('bb-filter-ready')?.classList.contains('is-active');
    const savedOnly = document.getElementById('bb-filter-saved')?.classList.contains('is-active');
    const minPrice = Number(document.getElementById('bb-price-min')?.value || 0);
    const maxPrice = Number(document.getElementById('bb-price-max')?.value || 999999);
    const sortBy = document.getElementById('bb-catalog-sort')?.value || 'featured';
    const wishlist = getWishlist();

    const cards = Array.from(grid.querySelectorAll('.bb-product-item'));
    let visible = 0;

    cards.forEach((card) => {
      const cCat = card.getAttribute('data-category') || '';
      const cPrice = Number(card.getAttribute('data-price') || 0);
      const cLead = Number(card.getAttribute('data-lead-time') || 2);
      const cSearch = card.getAttribute('data-search') || '';
      const cId = card.getAttribute('data-product-id') || '';

      let show = true;
      if (cat !== 'all' && cCat !== cat) show = false;
      if (cPrice < minPrice || cPrice > maxPrice) show = false;
      if (readyOnly && cLead > 2) show = false;
      if (savedOnly && !wishlist.includes(cId)) show = false;
      if (query && !cSearch.includes(query)) show = false;

      card.style.display = show ? 'flex' : 'none';
      if (show) visible++;
    });

    if (sortBy !== 'featured') {
      cards.sort((a, b) => {
        const pa = Number(a.getAttribute('data-price') || 0);
        const pb = Number(b.getAttribute('data-price') || 0);
        const la = Number(a.getAttribute('data-lead-time') || 2);
        const lb = Number(b.getAttribute('data-lead-time') || 2);
        if (sortBy === 'price-asc') return pa - pb;
        if (sortBy === 'price-desc') return pb - pa;
        if (sortBy === 'lead-time') return la - lb;
        return 0;
      });
      cards.forEach((c) => grid.appendChild(c));
    }

    const emptyEl = document.getElementById('bb-empty-state');
    if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncWishlistUI();
    renderCartDrawer(currentCart);

    document.getElementById('bb-open-bag-btn')?.addEventListener('click', window.bbOpenBagDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.bbCloseBagDrawer();
    });

    // Wishlist buttons
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const pid = btn.getAttribute('data-wishlist-toggle');
        const list = getWishlist();
        const next = list.includes(pid) ? list.filter((x) => x !== pid) : [...list, pid];
        setWishlist(next);
        applyCatalogFilters();
      });
    });

    // Quick Add buttons
    document.querySelectorAll('[data-quick-add]').forEach((btn) => {
      btn.addEventListener('click', async function () {
        const pid = btn.getAttribute('data-quick-add');
        const vid = btn.getAttribute('data-variation-id') || 0;
        const json = await postAjax('bb_add_to_cart', { product_id: pid, variation_id: vid, quantity: 1 });
        if (json && json.success) {
          renderCartDrawer(json.data);
          btn.classList.add('is-added');
          btn.innerHTML = '<span>&check; Added</span>';
          setTimeout(() => {
            btn.classList.remove('is-added');
            btn.innerHTML = '<span>+ Quick Add</span>';
          }, 1300);
        }
      });
    });

    // PDP Variation selection
    document.querySelectorAll('[data-variation-btn]').forEach((btn) => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-variation-btn]').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        const vid = btn.getAttribute('data-variation-id') || 0;
        const price = Number(btn.getAttribute('data-price') || 0);
        const label = btn.getAttribute('data-label') || '';
        const lblEl = document.getElementById('bb-selected-finish-label');
        const unitEl = document.getElementById('bb-pdp-unit-price');
        const addBtn = document.getElementById('bb-pdp-add-btn');
        const btnTotal = document.getElementById('bb-pdp-btn-total');
        if (lblEl) lblEl.textContent = label;
        if (unitEl) unitEl.textContent = formatINR(price);
        if (addBtn) {
          addBtn.setAttribute('data-variation-id', vid);
          addBtn.setAttribute('data-unit-price', String(price));
        }
        if (btnTotal) btnTotal.textContent = formatINR(price * pdpQty);
      });
    });

    // PDP Add to Bag
    document.getElementById('bb-pdp-add-btn')?.addEventListener('click', async function () {
      const pid = this.getAttribute('data-product-id');
      const vid = this.getAttribute('data-variation-id') || 0;
      const json = await postAjax('bb_add_to_cart', { product_id: pid, variation_id: vid, quantity: pdpQty });
      if (json && json.success) {
        renderCartDrawer(json.data);
        window.bbOpenBagDrawer();
      }
    });

    // Promo code form in drawer
    document.getElementById('bb-drawer-promo-form')?.addEventListener('submit', async function (e) {
      e.preventDefault();
      const input = document.getElementById('bb-drawer-promo-input');
      const msgEl = document.getElementById('bb-drawer-promo-msg');
      const code = (input?.value || '').trim().toUpperCase();
      if (!code) return;
      const json = await postAjax('bb_cart_action', { cart_action: 'apply_coupon', coupon_code: code });
      if (json && json.success) {
        renderCartDrawer(json.data);
        if (msgEl) msgEl.textContent = '10% Kutch craft patron discount applied.';
        if (input) input.value = '';
      } else if (msgEl) {
        msgEl.textContent = (json && json.data && json.data.message) || 'Unrecognized code. Try KUTCH10.';
      }
    });

    // Catalog Filter Bindings
    document.querySelectorAll('.bb-tab[data-cat-filter]').forEach((tab) => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.bb-tab[data-cat-filter]').forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        applyCatalogFilters();
      });
    });

    document.getElementById('bb-catalog-search')?.addEventListener('input', applyCatalogFilters);
    document.getElementById('bb-catalog-sort')?.addEventListener('change', applyCatalogFilters);
    document.getElementById('bb-filter-ready')?.addEventListener('click', function () {
      this.classList.toggle('is-active');
      applyCatalogFilters();
    });
    document.getElementById('bb-filter-saved')?.addEventListener('click', function () {
      this.classList.toggle('is-active');
      applyCatalogFilters();
    });

    const minSlider = document.getElementById('bb-price-min');
    const maxSlider = document.getElementById('bb-price-max');
    const readout = document.getElementById('bb-price-readout');
    const fill = document.getElementById('bb-range-fill');

    function syncSliders() {
      if (!minSlider || !maxSlider) return;
      let minV = Number(minSlider.value);
      let maxV = Number(maxSlider.value);
      if (minV > maxV - 500) {
        minV = maxV - 500;
        minSlider.value = String(minV);
      }
      const span = 12000 - 3500;
      if (fill) {
        fill.style.left = ((minV - 3500) / span) * 100 + '%';
        fill.style.right = 100 - ((maxV - 3500) / span) * 100 + '%';
      }
      if (readout) readout.textContent = formatINR(minV) + ' – ' + formatINR(maxV);
      applyCatalogFilters();
    }

    minSlider?.addEventListener('input', syncSliders);
    maxSlider?.addEventListener('input', syncSliders);

    document.getElementById('bb-reset-filters')?.addEventListener('click', function () {
      document.querySelectorAll('.bb-tab[data-cat-filter]').forEach((t, idx) => t.classList.toggle('is-active', idx === 0));
      const s = document.getElementById('bb-catalog-search');
      if (s) s.value = '';
      document.getElementById('bb-filter-ready')?.classList.remove('is-active');
      document.getElementById('bb-filter-saved')?.classList.remove('is-active');
      if (minSlider) minSlider.value = '3500';
      if (maxSlider) maxSlider.value = '12000';
      syncSliders();
    });
  });
})();
