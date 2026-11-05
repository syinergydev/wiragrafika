(() => {
  'use strict';
  const PRODUCTS = Array.isArray(window.WIRA_PRODUCTS) ? window.WIRA_PRODUCTS : [];
  const WHATSAPP = '6282230589294';
  const CART_KEY = 'wiraGrafikaCartV1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const productGrid = $('#productGrid');
  const categoryFilters = $('#categoryFilters');
  const productSearch = $('#productSearch');
  const cartDrawer = $('#cartDrawer');
  const overlay = $('#overlay');
  const cartItems = $('#cartItems');
  const cartForm = $('#cartForm');
  const productModal = $('#productModal');
  const toast = $('#toast');
  let activeFilter = 'all';
  let selectedProduct = null;
  let toastTimer = null;
  let cart = loadCart();

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter(item => PRODUCTS.some(p => p.id === item.productId) && Number(item.qty) > 0) : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (error) { /* storage may be disabled */ }
    renderCart();
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function renderProducts() {
    const query = (productSearch.value || '').trim().toLocaleLowerCase('id-ID');
    const filtered = PRODUCTS.filter(product => {
      const matchesCategory = activeFilter === 'all' || product.category === activeFilter;
      const matchesQuery = !query || `${product.name} ${product.description} ${product.categoryLabel}`.toLocaleLowerCase('id-ID').includes(query);
      return matchesCategory && matchesQuery;
    });
    productGrid.innerHTML = filtered.length ? filtered.map(product => `
      <article class="product-card">
        <div class="product-image"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy"><span class="product-tag">${escapeHTML(product.tag)}</span></div>
        <div class="product-body">
          <div class="product-meta">${escapeHTML(product.categoryLabel)}</div>
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.description)}</p>
          <div class="product-footer"><span class="product-price">Tanya harga</span><div class="product-actions"><button class="detail-btn" data-detail="${escapeHTML(product.id)}">Detail</button><button class="add-btn" data-add="${escapeHTML(product.id)}" aria-label="Pilih ${escapeHTML(product.name)}" title="Pilih produk">＋</button></div></div>
        </div>
      </article>`).join('') : '<div class="no-results">Produk tidak ditemukan. Coba kata kunci atau kategori lain.</div>';
  }

  function productById(id) { return PRODUCTS.find(product => product.id === id); }
  function makeCartKey(productId, spec, note) { return `${productId}::${(spec || '').trim().toLowerCase()}::${(note || '').trim().toLowerCase()}`; }

  function openProductModal(product) {
    selectedProduct = product;
    $('#modalImage').src = product.image;
    $('#modalImage').alt = product.name;
    $('#modalCategory').textContent = product.categoryLabel;
    $('#modalTitle').textContent = product.name;
    $('#modalDescription').textContent = product.description;
    $('#modalQty').value = '1';
    $('#modalSpec').value = '';
    $('#modalNote').value = '';
    productModal.classList.add('show');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => $('#modalQty').focus(), 100);
  }

  function closeProductModal() {
    productModal.classList.remove('show');
    productModal.setAttribute('aria-hidden', 'true');
    if (!cartDrawer.classList.contains('open')) document.body.classList.remove('no-scroll');
  }

  function addToCart(product, qty, spec, note) {
    const count = Math.max(1, Math.min(999, Number.parseInt(qty, 10) || 1));
    const cleanSpec = (spec || '').trim();
    const cleanNote = (note || '').trim();
    const key = makeCartKey(product.id, cleanSpec, cleanNote);
    const existing = cart.find(item => item.key === key);
    if (existing) existing.qty = Math.min(999, existing.qty + count);
    else cart.push({ key, productId: product.id, qty: count, spec: cleanSpec, note: cleanNote });
    saveCart();
    notify(`${product.name} ditambahkan ke keranjang`);
  }

  function renderCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    $('#cartCount').textContent = String(totalQty);
    $('#drawerItemCount').textContent = `(${totalQty})`;
    if (!cart.length) {
      cartItems.innerHTML = '<div class="empty-cart"><span>▣</span><strong>Keranjang masih kosong</strong><p>Pilih produk dari katalog untuk mulai menyusun pesanan.</p><button class="btn btn-primary" id="browseCatalog">Jelajahi Katalog</button></div>';
      cartForm.hidden = true;
      return;
    }
    cartForm.hidden = false;
    cartItems.innerHTML = cart.map(item => {
      const product = productById(item.productId);
      if (!product) return '';
      const details = [item.spec ? `Spesifikasi: ${escapeHTML(item.spec)}` : '', item.note ? `Catatan: ${escapeHTML(item.note)}` : ''].filter(Boolean).join('<br>');
      return `<div class="cart-row"><img src="${escapeHTML(product.image)}" alt=""><div><h3>${escapeHTML(product.name)}</h3><small>${details || 'Spesifikasi belum ditentukan'}</small><div class="cart-row-actions"><div class="qty-control"><button data-qty="${escapeHTML(item.key)}" data-delta="-1" aria-label="Kurangi jumlah">−</button><span>${item.qty}</span><button data-qty="${escapeHTML(item.key)}" data-delta="1" aria-label="Tambah jumlah">＋</button></div><button class="remove-item" data-remove="${escapeHTML(item.key)}">Hapus</button></div></div><span class="product-price">Tanya harga</span></div>`;
    }).join('');
  }

  function openCart() {
    closeProductModal();
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
    if (!productModal.classList.contains('show')) document.body.classList.remove('no-scroll');
  }

  function updateQty(key, delta) {
    const item = cart.find(entry => entry.key === key);
    if (!item) return;
    item.qty = Math.max(0, Math.min(999, item.qty + delta));
    if (!item.qty) cart = cart.filter(entry => entry.key !== key);
    saveCart();
  }

  function checkout() {
    if (!cart.length) { notify('Keranjang masih kosong'); return; }
    const name = ($('#customerName').value || '').trim();
    const note = ($('#orderNote').value || '').trim();
    const lines = ['Halo Wira Grafika, saya ingin konsultasi dan memesan produk berikut:', ''];
    if (name) lines.push(`Nama pemesan: ${name}`, '');
    cart.forEach((item, index) => {
      const product = productById(item.productId);
      if (!product) return;
      lines.push(`${index + 1}. ${product.name}`, `   Jumlah: ${item.qty}`);
      if (item.spec) lines.push(`   Spesifikasi: ${item.spec}`);
      if (item.note) lines.push(`   Catatan produk: ${item.note}`);
      lines.push('');
    });
    if (note) lines.push(`Catatan umum: ${note}`, '');
    lines.push('Mohon informasi harga, ketersediaan, dan estimasi pengerjaan sesuai detail pesanan di atas.', '', 'Terima kasih.');
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  categoryFilters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    $$('.filter-chip', categoryFilters).forEach(chip => chip.classList.toggle('active', chip === button));
    renderProducts();
  });
  productSearch.addEventListener('input', renderProducts);
  productGrid.addEventListener('click', event => {
    const detailButton = event.target.closest('[data-detail]');
    const addButton = event.target.closest('[data-add]');
    if (detailButton) openProductModal(productById(detailButton.dataset.detail));
    if (addButton) openProductModal(productById(addButton.dataset.add));
  });

  $('#modalAdd').addEventListener('click', () => {
    if (!selectedProduct) return;
    const qty = Number.parseInt($('#modalQty').value, 10);
    if (!Number.isFinite(qty) || qty < 1 || qty > 999) { notify('Masukkan jumlah antara 1 sampai 999'); return; }
    addToCart(selectedProduct, qty, $('#modalSpec').value, $('#modalNote').value);
    closeProductModal();
  });
  $$('[data-close-modal]').forEach(button => button.addEventListener('click', closeProductModal));
  $('#openCart').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#checkoutButton').addEventListener('click', checkout);
  cartItems.addEventListener('click', event => {
    const qtyButton = event.target.closest('[data-qty]');
    const removeButton = event.target.closest('[data-remove]');
    const browseButton = event.target.closest('#browseCatalog');
    if (qtyButton) updateQty(qtyButton.dataset.qty, Number(qtyButton.dataset.delta));
    if (removeButton) { cart = cart.filter(item => item.key !== removeButton.dataset.remove); saveCart(); }
    if (browseButton) { closeCart(); document.querySelector('#katalog').scrollIntoView({ behavior: 'smooth' }); }
  });

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Gallery lightbox
  const lightbox = $('#lightbox');
  $$('#galleryGrid [data-full]').forEach(button => button.addEventListener('click', () => {
    $('#lightboxImage').src = button.dataset.full;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }));
  function closeLightbox() {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    if (!cartDrawer.classList.contains('open') && !productModal.classList.contains('show')) document.body.classList.remove('no-scroll');
  }
  $('#lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });

  $('#floatingWa').addEventListener('click', () => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Halo Wira Grafika, saya ingin konsultasi kebutuhan cetak.')}`, '_blank', 'noopener,noreferrer'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeProductModal(); closeCart(); closeLightbox(); mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }
  });

  // Reveal-on-scroll effect; content stays visible when IntersectionObserver is unavailable.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  renderProducts();
  renderCart();
})();
