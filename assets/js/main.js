/**
 * 9exo core application logic: cart, wishlist, toasts.
 * Runs after config.js, icons.js and partials.js.
 */

class App {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('9exo_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('9exo_wishlist')) || [];

        this.init();
    }

    init() {
        this.updateCartBadge();

        document.addEventListener('partialsReady', () => this.updateCartBadge());

        window.addEventListener('storage', (e) => {
            if (e.key === '9exo_cart') {
                this.cart = JSON.parse(e.newValue) || [];
                this.updateCartBadge();
                window.dispatchEvent(new Event('cartUpdated'));
            }
            if (e.key === '9exo_wishlist') {
                this.wishlist = JSON.parse(e.newValue) || [];
                window.dispatchEvent(new Event('wishlistUpdated'));
            }
        });
    }

    // ---- Cart ----

    addToCart(product, quantity = 1, size = null, color = null) {
        const existingItem = this.cart.find(
            item => item.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images && product.images[0],
                quantity, size, color
            });
        }

        this.saveCart();
        this.showToast(`${product.title} added to cart`);
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
    }

    updateQuantity(index, quantity) {
        if (quantity < 1) return;
        this.cart[index].quantity = quantity;
        this.saveCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('9exo_cart', JSON.stringify(this.cart));
        this.updateCartBadge();
        window.dispatchEvent(new Event('cartUpdated'));
    }

    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // ---- Wishlist ----

    isWishlisted(id) {
        return this.wishlist.includes(id);
    }

    toggleWishlist(id, title) {
        const idx = this.wishlist.indexOf(id);
        if (idx > -1) {
            this.wishlist.splice(idx, 1);
            this.showToast(`${title} removed from wishlist`);
        } else {
            this.wishlist.push(id);
            this.showToast(`${title} added to wishlist`);
        }
        localStorage.setItem('9exo_wishlist', JSON.stringify(this.wishlist));
        window.dispatchEvent(new Event('wishlistUpdated'));
        return this.isWishlisted(id);
    }

    // ---- UI helpers ----

    showToast(message, type = 'success') {
        let stack = document.getElementById('toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.id = 'toast-stack';
            stack.className = 'toast-stack';
            document.body.appendChild(stack);
        }
        const toast = document.createElement('div');
        toast.className = 'toast' + (type === 'error' ? ' toast-error' : '');
        toast.innerHTML = (window.ICONS ? window.ICONS.checkCircle : '') + `<span>${message}</span>`;
        stack.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.25s ease';
            setTimeout(() => toast.remove(), 250);
        }, 2600);
    }
}

window.app = new App();

/**
 * Shared formatting + accordion helpers used across pages.
 */
window.formatPrice = function (amount) {
    return `${window.CONFIG.currency} ${Number(amount).toLocaleString('en-PK')}`;
};

window.priceHTML = function (product) {
    if (product.old_price) {
        return `<span class="old-price">${window.formatPrice(product.old_price)}</span><span class="current-price on-sale">${window.formatPrice(product.price)}</span>`;
    }
    return `<span class="current-price">${window.formatPrice(product.price)}</span>`;
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    });
}

window.initAccordions = function (root = document) {
    root.querySelectorAll('.accordion-item').forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        if (!trigger || trigger.dataset.bound) return;
        trigger.dataset.bound = '1';
        trigger.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
};
