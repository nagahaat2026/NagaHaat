// cart.js - Shopping Cart State Management

const NagaCart = (function () {
    const STORAGE_KEY = 'naga_cart';

    function getCart() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error parsing cart data', e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        updateCartCounters();
    }

    function addToCart(product, quantity = 1) {
        const cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }

        saveCart(cart);

        // Optional: Dispatch a custom event
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    }

    function removeFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    }

    function updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        const cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCart(cart);
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
        }
    }

    function clearCart() {
        localStorage.removeItem(STORAGE_KEY);
        updateCartCounters();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
    }

    function getCartTotal() {
        const cart = getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function getCartItemCount() {
        const cart = getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    }

    function updateCartCounters() {
        const counters = document.querySelectorAll('.cart-counter');
        const count = getCartItemCount();

        counters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    }

    async function createOrderInSupabase(paymentId) {
        const session = window.NagaAuth.getSession();
        if (!session) return { error: 'Not authenticated' };

        const cart = getCart();
        const subtotal = getCartTotal();
        const shipping = subtotal > 0 ? 150 : 0;
        const total = subtotal + shipping;

        try {
            // 1. Create order record
            const { data: order, error: orderError } = await window.supabase
                .from('orders')
                .insert({
                    buyer_id: session.id,
                    total_price: total,
                    status: 'confirmed'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await window.supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Clear cart
            clearCart();

            return { success: true, orderId: order.id };
        } catch (error) {
            console.error('Order creation failed:', error);
            return { error: error.message };
        }
    }

    // Expose API
    return {
        getCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        updateCartCounters,
        createOrderInSupabase
    };
})();

window.NagaCart = NagaCart;
