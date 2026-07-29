/**
 * Renders the shared header, footer, mobile drawer and search overlay
 * into their placeholder elements, then wires up the interactive bits.
 * Runs before main.js's App init so header markup exists when the cart
 * badge is first updated.
 */
(function () {
    const CFG = window.CONFIG;
    const I = window.ICONS;
    const path = window.location.pathname.replace(/\/index\.html$/, '/');

    function isActive(href) {
        if (href === '/') return path === '/' || path === '/index.html';
        return path.startsWith(href);
    }

    const NAV_LINKS = [
        { href: '/', label: 'Home' },
        { href: '/products.html', label: 'Shop' },
        { href: '/about.html', label: 'About Us' },
        { href: '/contact.html', label: 'Contact Us' }
    ];

    function navLinksHTML(cls) {
        return NAV_LINKS.map(l => `<a href="${l.href}" class="${isActive(l.href) ? 'active' : ''}">${l.label}</a>`).join('');
    }

    function headerHTML() {
        return `
        <div class="announcement-bar">Free delivery on orders over ${CFG.currency} ${CFG.delivery.freeThreshold}</div>
        <header class="site-header">
            <div class="container nav-wrapper">
                <div class="nav-left">
                    <button class="btn-icon mobile-menu-toggle" id="mobile-menu-open" aria-label="Open menu">${I.menu}</button>
                    <nav class="nav-links">${navLinksHTML()}</nav>
                </div>

                <a href="/" class="logo"><img src="/assets/images/black-logo-trim.png" alt="9EXO"></a>

                <div class="nav-icons">
                    <button class="btn-icon" id="search-open" aria-label="Search">${I.search}</button>
                    <a href="/cart.html" class="btn-icon nav-icon-wrap" aria-label="Cart">
                        ${I.bag}
                        <span class="cart-badge" style="display:none;">0</span>
                    </a>
                </div>
            </div>
        </header>

        <div class="mobile-drawer" id="mobile-drawer">
            <div class="mobile-drawer-overlay" id="mobile-drawer-overlay"></div>
            <div class="mobile-drawer-panel">
                <div class="mobile-drawer-header">
                    <a href="/" class="logo"><img src="/assets/images/black-logo-trim.png" alt="9EXO" style="height:32px;"></a>
                    <button class="btn-icon" id="mobile-menu-close" aria-label="Close menu">${I.close}</button>
                </div>
                <nav class="mobile-drawer-links">${navLinksHTML()}</nav>
                <div style="margin-top:auto; padding-top: var(--space-md); font-size: 0.85rem; color: var(--color-grey-600);">
                    <p>${CFG.contact.phone}</p>
                    <p>${CFG.contact.email}</p>
                </div>
            </div>
        </div>

        <div class="search-overlay" id="search-overlay">
            <div class="search-panel">
                <form class="search-form" id="search-form">
                    ${I.search}
                    <input type="text" id="search-input" placeholder="Search products..." autocomplete="off">
                    <button type="button" class="btn-icon" id="search-close" aria-label="Close search">${I.close}</button>
                </form>
                <div class="search-results" id="search-results"></div>
            </div>
        </div>`;
    }

    function footerHTML() {
        const c = CFG.contact;
        return `
        <footer class="site-footer">
            <div class="container footer-grid">
                <div class="footer-brand">
                    <a href="/" class="logo"><img src="/assets/images/black-logo-trim.png" alt="9EXO" class="footer-logo-img" style="height:36px;"></a>
                    <p>Premium men's streetwear and modern essentials, designed for comfort, built for movement.</p>
                    <div class="footer-social">
                        <a href="${CFG.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.instagram}</a>
                        <a href="${CFG.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.facebook}</a>
                        <a href="${CFG.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a>
                    </div>
                </div>
                <div>
                    <h4 class="footer-heading">Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="/products.html">Shop All</a></li>
                        <li><a href="/about.html">About Us</a></li>
                        <li><a href="/contact.html">Contact</a></li>
                        <li><a href="/faq.html">FAQ</a></li>
                        <li><a href="/track-order.html">Track Order</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-heading">Policies</h4>
                    <ul class="footer-links">
                        <li><a href="/delivery-terms.html">Delivery Terms</a></li>
                        <li><a href="/refund-exchange.html">Refund &amp; Exchange</a></li>
                        <li><a href="/size-chart.html">Size Chart</a></li>
                        <li><a href="/care-instructions.html">Care Instructions</a></li>
                        <li><a href="/privacy-policy.html">Privacy Policy</a></li>
                        <li><a href="/terms-and-conditions.html">Terms &amp; Conditions</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-heading">Contact</h4>
                    <ul class="footer-contact">
                        <li>${I.phone}<span>${c.phone}</span></li>
                        <li>${I.mail}<span>${c.email}</span></li>
                        <li>${I.mapPin}<span>${c.address}</span></li>
                        <li>${I.clock}<span>${c.businessHours}</span></li>
                    </ul>
                </div>
            </div>
            <div class="container footer-bottom">
                <p>&copy; ${new Date().getFullYear()} 9exo. All rights reserved.</p>
                <div class="payment-badges">
                    <span>Cash on Delivery</span>
                    <span>Bank Transfer</span>
                    <span>EasyPaisa</span>
                    <span>JazzCash</span>
                </div>
            </div>
        </footer>
        <a class="whatsapp-float" href="https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${I.whatsapp}</a>
        <div class="toast-stack" id="toast-stack"></div>`;
    }

    function renderProductResult(p) {
        const price = `${CFG.currency} ${p.price}`;
        return `<a class="search-result-item" href="/product.html?id=${p.id}">
            <img src="${p.images[0]}" alt="${p.title}">
            <div>
                <div style="font-weight:500;">${p.title}</div>
                <div style="font-size:0.8rem; color:var(--color-grey-600);">${price}</div>
            </div>
        </a>`;
    }

    function initSearch() {
        const overlay = document.getElementById('search-overlay');
        const openBtn = document.getElementById('search-open');
        const closeBtn = document.getElementById('search-close');
        const input = document.getElementById('search-input');
        const results = document.getElementById('search-results');
        let productsCache = null;

        function open() {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => input.focus(), 50);
            if (!productsCache) {
                fetch('/assets/data/products.json').then(r => r.json()).then(data => { productsCache = data; });
            }
        }
        function close() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        openBtn.addEventListener('click', open);
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            if (!productsCache || q.length < 2) { results.innerHTML = ''; return; }
            const matches = productsCache.filter(p =>
                p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
            ).slice(0, 6);
            results.innerHTML = matches.length
                ? matches.map(renderProductResult).join('')
                : `<p style="color:var(--color-grey-600); padding: var(--space-sm) 0;">No products found for "${input.value}".</p>`;
        });

        document.getElementById('search-form').addEventListener('submit', (e) => e.preventDefault());
    }

    function initMobileDrawer() {
        const drawer = document.getElementById('mobile-drawer');
        document.getElementById('mobile-menu-open').addEventListener('click', () => {
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        function close() {
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        }
        document.getElementById('mobile-menu-close').addEventListener('click', close);
        document.getElementById('mobile-drawer-overlay').addEventListener('click', close);
    }

    function mount() {
        const headerEl = document.getElementById('site-header');
        const footerEl = document.getElementById('site-footer');
        if (headerEl) {
            headerEl.outerHTML = headerHTML();
            initMobileDrawer();
            initSearch();
        }
        if (footerEl) {
            footerEl.outerHTML = footerHTML();
        }
        document.dispatchEvent(new Event('partialsReady'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
