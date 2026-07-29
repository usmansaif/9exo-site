document.addEventListener('DOMContentLoaded', () => {
    const cartItems = window.app.cart;
    const checkoutItemsContainer = document.getElementById('checkout-items');

    if (!cartItems || cartItems.length === 0) {
        window.location.href = '/cart.html';
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

    // Payment option selected styling
    document.querySelectorAll('.payment-option').forEach(label => {
        label.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
        });
    });

    const form = document.getElementById('checkout-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const orderId = 'EXO' + Date.now().toString().slice(-8);

        const name = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const email = document.getElementById('email').value || 'N/A';
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const area = document.getElementById('area').value;
        const postal = document.getElementById('postal').value || 'N/A';
        const payment = document.querySelector('input[name="payment"]:checked').value;
        const notes = document.getElementById('notes').value || 'None';

        let message = `New Order #${orderId}\n\n`;
        message += `Customer Details\n------------------------\n`;
        message += `Name: ${name}\n`;
        message += `Phone: ${phone}\n`;
        message += `WhatsApp: ${whatsapp}\n`;
        message += `Email: ${email}\n\n`;

        message += `Delivery Address\n------------------------\n`;
        message += `City: ${city}\n`;
        message += `Area: ${area}\n`;
        message += `Address: ${address}\n`;
        message += `Postal Code: ${postal}\n\n`;

        message += `Products\n------------------------\n\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}.\n`;
            message += `Product: ${item.title}\n`;
            message += `Size: ${item.size || 'N/A'}\n`;
            message += `Colour: ${item.color || 'N/A'}\n`;
            message += `Quantity: ${item.quantity}\n`;
            message += `Price: ${window.formatPrice(item.price * item.quantity)}\n\n`;
        });

        message += `Subtotal: ${window.formatPrice(subtotal)}\n`;
        message += `Delivery: ${delivery === 0 ? 'Free' : window.formatPrice(delivery)}\n`;
        message += `Grand Total: ${window.formatPrice(total)}\n\n`;
        message += `Payment Method: ${payment}\n\n`;
        message += `Order Notes: ${notes}\n\n`;
        message += `Thank you for shopping with ${window.CONFIG.brandName}.`;

        const encodedMessage = encodeURIComponent(message);
        const targetWhatsapp = window.CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${encodedMessage}`;

        sessionStorage.setItem('9exo_last_order', orderId);
        window.app.clearCart();
        window.open(whatsappUrl, '_blank');
        window.location.href = '/order-confirmation.html';
    });
});
