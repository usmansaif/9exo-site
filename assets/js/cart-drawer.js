/**
 * Right-side cart drawer (cart items + checkout form) and the shared
 * WhatsApp order flow used by both the drawer and the /checkout/ page.
 * Runs after config.js, icons.js, partials.js and main.js.
 */
(function () {
    const CFG = window.CONFIG;
    const I = window.ICONS;
    const PAYMENT = 'Cash on Delivery';

    function orderTotals(cart) {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const delivery = subtotal >= CFG.delivery.freeThreshold ? 0 : CFG.delivery.charges;
        return { subtotal, delivery, total: subtotal + delivery };
    }

    function money(amount) {
        return amount === 0 ? 'Free' : window.formatPrice(amount);
    }

    window.placeOrder = function (form) {
        const cart = window.app.cart;
        if (!cart.length) return;

        const d = Object.fromEntries(new FormData(form));
        const { subtotal, delivery, total } = orderTotals(cart);
        const orderId = 'EXO' + Date.now().toString().slice(-8);

        let message = `New Order #${orderId}\n\n`;
        message += `Customer Details\n------------------------\n`;
        message += `Name: ${d.fullName}\n`;
        message += `Phone: ${d.phone}\n`;
        message += `WhatsApp: ${d.whatsapp}\n`;
        message += `Email: ${d.email || 'N/A'}\n\n`;

        message += `Delivery Address\n------------------------\n`;
        message += `City: ${d.city}\n`;
        message += `Area: ${d.area}\n`;
        message += `Address: ${d.address}\n`;
        message += `Postal Code: ${d.postal || 'N/A'}\n\n`;

        message += `Products\n------------------------\n\n`;
        cart.forEach((item, index) => {
            message += `${index + 1}.\n`;
            message += `Product: ${item.title}\n`;
            message += `Size: ${item.size || 'N/A'}\n`;
            message += `Colour: ${item.color || 'N/A'}\n`;
            message += `Quantity: ${item.quantity}\n`;
            message += `Price: ${window.formatPrice(item.price * item.quantity)}\n\n`;
        });

        message += `Subtotal: ${window.formatPrice(subtotal)}\n`;
        message += `Delivery: ${money(delivery)}\n`;
        message += `Grand Total: ${window.formatPrice(total)}\n\n`;
        message += `Payment Method: ${PAYMENT}\n\n`;
        message += `Order Notes: ${d.notes || 'None'}\n\n`;
        message += `Thank you for shopping with ${CFG.brandName}.`;

        const url = `https://wa.me/${CFG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

        sessionStorage.setItem('9exo_last_order', orderId);
        window.app.clearCart();
        window.open(url, '_blank');
        window.location.href = '/order-confirmation/';
    };

    const drawerHTML = `
    <div class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cd-title">
        <div class="cart-drawer-overlay" data-cd-close></div>
        <aside class="cart-drawer-panel">
            <header class="cd-head">
                <h2 id="cd-title">Cart <span id="cd-count"></span></h2>
                <button type="button" class="btn-icon" data-cd-close aria-label="Close cart">${I.close}</button>
            </header>

            <div class="cd-body">
                <div class="cd-view" data-cd-view="cart">
                    <div id="cd-items"></div>
                    <p class="cd-empty" id="cd-empty" hidden>Your cart is empty.</p>
                </div>

                <form class="cd-view cd-form" data-cd-view="checkout" id="cd-form" hidden>
                    <div class="cd-grid">
                        <div class="form-group full"><label for="cd-fullName">Full name *</label><input type="text" id="cd-fullName" name="fullName" autocomplete="name" required></div>
                        <div class="form-group"><label for="cd-phone">Phone *</label><input type="tel" id="cd-phone" name="phone" autocomplete="tel" required></div>
                        <div class="form-group"><label for="cd-whatsapp">WhatsApp *</label><input type="tel" id="cd-whatsapp" name="whatsapp" required></div>
                        <div class="form-group full"><label for="cd-email">Email (optional)</label><input type="email" id="cd-email" name="email" autocomplete="email"></div>
                        <div class="form-group full"><label for="cd-address">Complete address *</label><input type="text" id="cd-address" name="address" autocomplete="street-address" required></div>
                        <div class="form-group"><label for="cd-city">City *</label><input type="text" id="cd-city" name="city" autocomplete="address-level2" required></div>
                        <div class="form-group"><label for="cd-area">Area *</label><input type="text" id="cd-area" name="area" required></div>
                        <div class="form-group"><label for="cd-postal">Postal code</label><input type="text" id="cd-postal" name="postal" autocomplete="postal-code"></div>
                        <div class="form-group"><label>Payment</label><div class="cd-payment">Cash on Delivery</div></div>
                        <div class="form-group full"><label for="cd-notes">Order notes (optional)</label><textarea id="cd-notes" name="notes" rows="2"></textarea></div>
                    </div>
                </form>
            </div>

            <footer class="cd-foot">
                <div class="cd-row"><span>Subtotal</span><span id="cd-subtotal">Rs. 0</span></div>
                <div class="cd-row"><span>Delivery</span><span id="cd-delivery">Rs. 0</span></div>
                <div class="cd-row cd-total"><span>Total</span><span id="cd-total">Rs. 0</span></div>
                <div class="cd-actions" data-cd-view="cart">
                    <a href="/products/" class="btn btn-outline" data-cd-close>Shop more</a>
                    <button type="button" class="btn btn-primary" id="cd-to-checkout">Checkout</button>
                </div>
                <div class="cd-actions" data-cd-view="checkout" hidden>
                    <button type="button" class="btn btn-outline" id="cd-back">Back</button>
                    <button type="submit" class="btn btn-whatsapp" form="cd-form">Order on WhatsApp</button>
                </div>
            </footer>
        </aside>
    </div>`;

    let drawer, view = 'cart';

    function setView(name) {
        view = name;
        drawer.querySelectorAll('[data-cd-view]').forEach(el => {
            el.hidden = el.dataset.cdView !== name;
        });
    }

    function renderCart() {
        const cart = window.app.cart;
        const itemsEl = document.getElementById('cd-items');
        const empty = document.getElementById('cd-empty');
        const checkoutBtn = document.getElementById('cd-to-checkout');
        const totals = orderTotals(cart);
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);

        document.getElementById('cd-count').textContent = count ? `(${count})` : '';
        empty.hidden = cart.length > 0;
        checkoutBtn.disabled = cart.length === 0;
        document.getElementById('cd-subtotal').textContent = window.formatPrice(totals.subtotal);
        document.getElementById('cd-delivery').textContent = money(totals.delivery);
        document.getElementById('cd-total').textContent = window.formatPrice(totals.total);

        itemsEl.innerHTML = cart.map((item, i) => {
            const variant = [item.size ? `Size ${item.size}` : '', item.color || ''].filter(Boolean).join(' · ');
            return `
            <div class="cd-item">
                <img src="${item.image || '/assets/images/product-placeholder.jpg'}" alt="">
                <div>
                    <div class="cd-item-title">${item.title}</div>
                    ${variant ? `<div class="cd-item-variant">${variant}</div>` : ''}
                    <div class="cd-item-controls">
                        <div class="cd-qty">
                            <button type="button" data-cd-qty="${i}" data-delta="-1" aria-label="Decrease quantity">${I.minus}</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-cd-qty="${i}" data-delta="1" aria-label="Increase quantity">${I.plus}</button>
                        </div>
                        <button type="button" class="cd-remove" data-cd-remove="${i}">Remove</button>
                    </div>
                </div>
                <div class="cd-item-price">${window.formatPrice(item.price * item.quantity)}</div>
            </div>`;
        }).join('');
    }

    function open() {
        renderCart();
        if (view === 'checkout' && !window.app.cart.length) setView('cart');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    function bind() {
        document.addEventListener('click', (e) => {
            const opener = e.target.closest('#cart-open');
            if (opener) { e.preventDefault(); open(); return; }
        });

        drawer.addEventListener('click', (e) => {
            if (e.target.closest('[data-cd-close]')) { close(); return; }

            const qty = e.target.closest('[data-cd-qty]');
            if (qty) {
                const i = Number(qty.dataset.cdQty);
                window.app.updateQuantity(i, window.app.cart[i].quantity + Number(qty.dataset.delta));
                return;
            }
            const remove = e.target.closest('[data-cd-remove]');
            if (remove) {
                window.app.removeFromCart(Number(remove.dataset.cdRemove));
                return;
            }
            if (e.target.closest('#cd-to-checkout')) { setView('checkout'); return; }
            if (e.target.closest('#cd-back')) { setView('cart'); return; }
        });

        document.getElementById('cd-form').addEventListener('submit', (e) => {
            e.preventDefault();
            window.placeOrder(e.currentTarget);
        });

        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
        window.addEventListener('cartUpdated', () => {
            if (drawer.classList.contains('open')) renderCart();
        });
    }

    function init() {
        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        drawer = document.getElementById('cart-drawer');
        bind();
        window.openCartDrawer = open;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
