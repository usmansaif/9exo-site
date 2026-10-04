document.addEventListener('DOMContentLoaded', () => {
    const cartItems = window.app.cart;
    const checkoutItemsContainer = document.getElementById('checkout-items');

    if (!cartItems || cartItems.length === 0) {
        window.location.href = '/cart/';
        return;
    }

    let subtotal = 0;

    checkoutItemsContainer.innerHTML = cartItems.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const variant = [item.size ? `Size: ${item.size}` : '', item.color ? `Color: ${item.color}` : ''].filter(Boolean).join(' · ');
        return `
        <div class="summary-row" style="align-items:flex-start;">
            <div>
                <div style="font-weight: 500; font-size: 0.92rem;">${item.title}</div>
                <div style="color: var(--color-grey-600); font-size: 0.8rem;">${variant}${variant ? ' · ' : ''}Qty ${item.quantity}</div>
            </div>
            <div style="font-weight:500;">${window.formatPrice(itemTotal)}</div>
        </div>`;
    }).join('');

    const delivery = subtotal >= window.CONFIG.delivery.freeThreshold ? 0 : window.CONFIG.delivery.charges;
    const total = subtotal + delivery;

    document.getElementById('summary-subtotal').textContent = window.formatPrice(subtotal);
    document.getElementById('summary-delivery').textContent = delivery === 0 ? 'Free' : window.formatPrice(delivery);
    document.getElementById('summary-total').textContent = window.formatPrice(total);

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.placeOrder(form);
    });
});
