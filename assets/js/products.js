/**
 * Shared product card rendering + the shop listing page controller
 * (filtering, sorting, search). renderProductCard/renderSkeletonCards
 * are used by both index.html and products.html.
 */

window.renderProductCard = function (p) {
    const wishlisted = window.app && window.app.isWishlisted(p.id);
    const badges = [];
    if (p.discount > 0) badges.push(`<span class="badge badge-sale">-${p.discount}%</span>`);
    if (p.new) badges.push('<span class="badge badge-new">New</span>');
    if (p.stock === 0) badges.push('<span class="badge badge-out">Sold Out</span>');

    return `
    <div class="product-card" data-id="${p.id}">
        <a href="/product.html?id=${p.id}" class="product-media">
            <img src="${p.images[0]}" alt="${p.title}" loading="lazy" width="600" height="750">
            <div class="product-badges">${badges.join('')}</div>
        </a>
        <button class="product-wishlist-btn${wishlisted ? ' active' : ''}" data-wishlist-id="${p.id}" data-wishlist-title="${p.title}" aria-label="Toggle wishlist">
            ${window.ICONS.heart}
        </button>
        <div class="product-quick-add">
            <button class="btn btn-primary btn-block btn-sm" data-quick-add="${p.id}">Add to Cart</button>
        </div>
        <div class="product-category">${p.category}</div>
        <a href="/product.html?id=${p.id}" class="product-title">${p.title}</a>
        <div class="product-price">${window.priceHTML(p)}</div>
    </div>`;
};

window.renderSkeletonCards = function (count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
        <div class="product-card skeleton-card">
            <div class="product-media skeleton"></div>
            <div class="skeleton skeleton-text" style="width:40%;"></div>
            <div class="skeleton skeleton-text" style="width:80%;"></div>
            <div class="skeleton skeleton-text" style="width:35%;"></div>
        </div>`;
    }
    return html;
};

window.bindProductGridEvents = function (root) {
    root.querySelectorAll('[data-wishlist-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.wishlistId;
            const title = btn.dataset.wishlistTitle;
            const active = window.app.toggleWishlist(id, title);
            btn.classList.toggle('active', active);
        });
    });
    root.querySelectorAll('[data-quick-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.quickAdd;
            fetch('/assets/data/products.json')
                .then(r => r.json())
                .then(products => {
                    const product = products.find(p => p.id === id);
                    if (product) window.app.addToCart(product, 1, product.sizes ? product.sizes[0] : null, product.colors ? product.colors[0] : null);
                });
        });
    });
};

/* ---- Shop listing page controller ---- */
(function () {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const quickFilter = params.get('filter');
    const state = {
        categories: params.getAll('category'),
        sizes: [],
        priceBucket: null,
        onlyNew: quickFilter === 'new',
        onlySale: quickFilter === 'sale',
        sort: quickFilter === 'new' ? 'newest' : 'featured',
        q: params.get('q') || ''
    };

    let allProducts = [];

    const filtersEl = document.getElementById('filters');
    const countEl = document.getElementById('result-count');
    const sortEl = document.getElementById('sort-select');
    const activeFiltersEl = document.getElementById('active-filters');

    function priceBucketMatch(price, bucket) {
        if (bucket === 'under-2000') return price < 2000;
        if (bucket === '2000-4000') return price >= 2000 && price <= 4000;
        if (bucket === '4000-6000') return price > 4000 && price <= 6000;
        if (bucket === 'above-6000') return price > 6000;
        return true;
    }

    function applyFilters() {
        let result = allProducts.slice();

        if (state.categories.length) {
            result = result.filter(p => state.categories.includes(p.category_slug));
        }
        if (state.sizes.length) {
            result = result.filter(p => p.sizes && p.sizes.some(s => state.sizes.includes(s)));
        }
        if (state.priceBucket) {
            result = result.filter(p => priceBucketMatch(p.price, state.priceBucket));
        }
        if (state.onlyNew) {
            result = result.filter(p => p.new);
        }
        if (state.onlySale) {
            result = result.filter(p => p.discount > 0);
        }
        if (state.q) {
            const q = state.q.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        }

        switch (state.sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'newest': result.sort((a, b) => (b.new === true) - (a.new === true)); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            default: result.sort((a, b) => (b.featured === true) - (a.featured === true));
        }

        return result;
    }

    function renderChips() {
        const chips = [];
        state.categories.forEach(c => {
            const label = (allProducts.find(p => p.category_slug === c) || {}).category || c;
            chips.push({ key: 'category', value: c, label });
        });
        state.sizes.forEach(s => chips.push({ key: 'size', value: s, label: `Size ${s}` }));
        if (state.priceBucket) chips.push({ key: 'priceBucket', value: state.priceBucket, label: state.priceBucket.replace('-', ' - ').replace(/(^|\s)\S/g, c => c.toUpperCase()) });
        if (state.onlyNew) chips.push({ key: 'onlyNew', value: '1', label: 'New Arrivals' });
        if (state.onlySale) chips.push({ key: 'onlySale', value: '1', label: 'On Sale' });
        if (state.q) chips.push({ key: 'q', value: state.q, label: `"${state.q}"` });

        activeFiltersEl.innerHTML = chips.map(c =>
            `<span class="filter-chip" data-chip-key="${c.key}" data-chip-value="${c.value}">${c.label} ${window.ICONS.close}</span>`
        ).join('');

        activeFiltersEl.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const key = chip.dataset.chipKey;
                const value = chip.dataset.chipValue;
                if (key === 'category') state.categories = state.categories.filter(v => v !== value);
                if (key === 'size') state.sizes = state.sizes.filter(v => v !== value);
                if (key === 'priceBucket') state.priceBucket = null;
                if (key === 'onlyNew') state.onlyNew = false;
                if (key === 'onlySale') state.onlySale = false;
                if (key === 'q') { state.q = ''; document.getElementById('shop-search-input').value = ''; }
                syncFormInputs();
                render();
            });
        });
    }

    function render() {
        const result = applyFilters();
        countEl.textContent = `${result.length} ${result.length === 1 ? 'product' : 'products'}`;
        renderChips();

        if (!result.length) {
            grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">
                ${window.ICONS.search}
                <h3>No products found</h3>
                <p>Try removing a filter or searching a different term.</p>
            </div>`;
            return;
        }

        grid.innerHTML = result.map(window.renderProductCard).join('');
        window.bindProductGridEvents(grid);
    }

    function syncFormInputs() {
        filtersEl.querySelectorAll('[data-filter-category]').forEach(el => {
            el.checked = state.categories.includes(el.value);
        });
        filtersEl.querySelectorAll('[data-filter-size]').forEach(el => {
            el.checked = state.sizes.includes(el.value);
        });
        filtersEl.querySelectorAll('[data-filter-price]').forEach(el => {
            el.checked = state.priceBucket === el.value;
        });
    }

    function buildFilterUI() {
        const categories = [...new Map(allProducts.map(p => [p.category_slug, p.category])).entries()];
        const sizes = [...new Set(allProducts.flatMap(p => p.sizes || []))];

        filtersEl.innerHTML = `
            <div class="filter-group">
                <h3 class="filter-title">Category</h3>
                ${categories.map(([slug, label]) => `
                    <label class="filter-option">
                        <input type="checkbox" data-filter-category value="${slug}">
                        ${label}
                    </label>`).join('')}
            </div>
            <div class="filter-group">
                <h3 class="filter-title">Price</h3>
                ${[
                    ['under-2000', 'Under Rs. 2,000'],
                    ['2000-4000', 'Rs. 2,000 - 4,000'],
                    ['4000-6000', 'Rs. 4,000 - 6,000'],
                    ['above-6000', 'Above Rs. 6,000']
                ].map(([value, label]) => `
                    <label class="filter-option">
                        <input type="radio" name="price-bucket" data-filter-price value="${value}">
                        ${label}
                    </label>`).join('')}
            </div>
            <div class="filter-group">
                <h3 class="filter-title">Size</h3>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                    ${sizes.map(s => `
                        <label class="filter-option" style="border:1px solid var(--color-line-strong); border-radius: var(--radius-sm); padding: 6px 12px; gap:0;">
                            <input type="checkbox" data-filter-size value="${s}" class="visually-hidden">
                            ${s}
                        </label>`).join('')}
                </div>
            </div>
            <button class="btn btn-outline btn-sm btn-block" id="clear-filters">Clear All</button>
        `;

        filtersEl.querySelectorAll('[data-filter-category]').forEach(el => {
            el.addEventListener('change', () => {
                state.categories = [...filtersEl.querySelectorAll('[data-filter-category]:checked')].map(e => e.value);
                render();
            });
        });
        filtersEl.querySelectorAll('[data-filter-size]').forEach(el => {
            el.addEventListener('change', () => {
                state.sizes = [...filtersEl.querySelectorAll('[data-filter-size]:checked')].map(e => e.value);
                el.closest('.filter-option').style.borderColor = el.checked ? 'var(--color-ink)' : 'var(--color-line-strong)';
                el.closest('.filter-option').style.background = el.checked ? 'var(--color-ink)' : 'transparent';
                el.closest('.filter-option').style.color = el.checked ? 'var(--color-white)' : 'var(--color-ink)';
                render();
            });
        });
        filtersEl.querySelectorAll('[data-filter-price]').forEach(el => {
            el.addEventListener('change', () => {
                state.priceBucket = el.value;
                render();
            });
        });
        document.getElementById('clear-filters').addEventListener('click', () => {
            state.categories = [];
            state.sizes = [];
            state.priceBucket = null;
            state.onlyNew = false;
            state.onlySale = false;
            state.q = '';
            const searchInput = document.getElementById('shop-search-input');
            if (searchInput) searchInput.value = '';
            filtersEl.querySelectorAll('input').forEach(el => { el.checked = false; });
            filtersEl.querySelectorAll('.filter-option').forEach(el => {
                el.style.borderColor = 'var(--color-line-strong)';
                el.style.background = 'transparent';
                el.style.color = 'var(--color-ink)';
            });
            render();
        });

        syncFormInputs();
    }

    grid.innerHTML = window.renderSkeletonCards(8);

    fetch('/assets/data/products.json')
        .then(r => r.json())
        .then(products => {
            allProducts = products;
            buildFilterUI();
            if (sortEl) sortEl.value = state.sort;
            render();
        });

    if (sortEl) {
        sortEl.addEventListener('change', () => {
            state.sort = sortEl.value;
            render();
        });
    }

    const shopSearchInput = document.getElementById('shop-search-input');
    if (shopSearchInput) {
        shopSearchInput.value = state.q;
        shopSearchInput.addEventListener('input', () => {
            state.q = shopSearchInput.value.trim();
            render();
        });
    }

    document.addEventListener('wishlistUpdated', () => render());

    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    if (mobileFilterToggle) {
        mobileFilterToggle.addEventListener('click', () => filtersEl.classList.add('open'));
    }
    const mobileFilterClose = document.getElementById('mobile-filter-close');
    if (mobileFilterClose) {
        mobileFilterClose.addEventListener('click', () => filtersEl.classList.remove('open'));
    }
})();
