// vendor.js - Vendor Dashboard specific logic using Supabase

document.addEventListener('DOMContentLoaded', () => {
    const session = window.NagaAuth.getSession();

    // Update Vendor Name in UI
    const vendorNameDisplay = document.getElementById('vendorNameDisplay');
    if (vendorNameDisplay) {
        vendorNameDisplay.textContent = session.full_name;
    }

    // Image Preview Logic
    const productImageInput = document.getElementById('productImage');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');

    if (productImageInput) {
        productImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.src = event.target.result;
                    imagePreviewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                imagePreviewContainer.style.display = 'none';
            }
        });
    }

    // Handle Add Product Form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = addProductForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Uploading Image...';

            const file = productImageInput.files[0];
            let imageUrl = 'https://via.placeholder.com/400';

            if (file) {
                try {
                    const sb = window.supabaseClient;
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `${session.user_id}/${fileName}`;

                    // Upload to Supabase Storage
                    const { error: uploadError } = await sb.storage
                        .from('product-images')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    // Get Public URL
                    const { data: { publicUrl } } = sb.storage
                        .from('product-images')
                        .getPublicUrl(filePath);

                    imageUrl = publicUrl;
                } catch (err) {
                    alert('Image upload failed: ' + err.message);
                    btn.disabled = false;
                    btn.textContent = 'Add Product to Shop';
                    return;
                }
            }

            btn.textContent = 'Adding Product...';

            const newProduct = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                price: parseFloat(document.getElementById('price').value),
                category: document.getElementById('category').value,
                stock: parseInt(document.getElementById('stock').value),
                image_url: imageUrl,
            };

            try {
                await window.NagaProducts.addProduct(session.user_id, session.full_name, newProduct);
                alert('Product added successfully!');
                window.location.href = 'dashboard.html';
            } catch (err) {
                alert('Failed to add product: ' + err.message);
                btn.disabled = false;
                btn.textContent = 'Add Product to Shop';
            }
        });
    }

    // Load Vendor Products for Dashboard
    const vendorProductList = document.getElementById('vendorProductList');
    if (vendorProductList) {
        loadVendorProducts(session.user_id);
    }

    // Load Vendor Orders (also used for stats on dashboard overview)
    const vendorOrderList = document.getElementById('vendorOrderList');
    const statTotalSales = document.getElementById('statTotalSales');
    if (vendorOrderList || statTotalSales) {
        loadVendorOrders(session.user_id);
    }

    // Handle Edit Product Page Logic
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            loadProductForEdit(productId);
            editProductForm.addEventListener('submit', (e) => handleEditProductSubmit(e, productId, session));
        } else {
            alert('No product ID found!');
            window.location.href = 'dashboard.html';
        }
    }
});

async function loadProductForEdit(id) {
    try {
        const p = await window.NagaProducts.getProductById(id);
        document.getElementById('productId').value = p.id;
        document.getElementById('title').value = p.title;
        document.getElementById('price').value = p.price;
        document.getElementById('stock').value = p.stock;
        document.getElementById('category').value = p.category;
        document.getElementById('description').value = p.description;

        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview && p.image_url) {
            imagePreview.src = p.image_url;
        }
    } catch (err) {
        alert('Failed to load product: ' + err.message);
        window.location.href = 'dashboard.html';
    }
}

async function handleEditProductSubmit(e, productId, session) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Updating...';

    const productImageInput = document.getElementById('productImage');
    const file = productImageInput.files[0];
    let imageUrl = document.getElementById('imagePreview').src;

    try {
        if (file) {
            btn.textContent = 'Uploading New Image...';
            const sb = window.supabaseClient;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${session.user_id}/${fileName}`;

            const { error: uploadError } = await sb.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = sb.storage
                .from('product-images')
                .getPublicUrl(filePath);

            imageUrl = publicUrl;
        }

        const updatedProduct = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            category: document.getElementById('category').value,
            stock: parseInt(document.getElementById('stock').value),
            image_url: imageUrl,
        };

        await window.NagaProducts.updateProduct(productId, updatedProduct);
        alert('Product updated successfully!');
        window.location.href = 'dashboard.html';
    } catch (err) {
        alert('Failed to update product: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Save Changes';
    }
}

async function loadVendorProducts(vendorId) {
    const tbody = document.getElementById('vendorProductList');
    const totalProductsEl = document.getElementById('statTotalProducts');

    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading products...</td></tr>';

    try {
        const products = await window.NagaProducts.getProductsByVendor(vendorId);

        if (totalProductsEl) totalProductsEl.textContent = products.length;

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">You haven\'t added any products yet.</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(p => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${p.image_url}" alt="${p.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                        <span style="font-weight: 500;">${p.title}</span>
                    </div>
                </td>
                <td>${p.category}</td>
                <td>${window.NagaHaatUI.formatCurrency(p.price)}</td>
                <td>
                    <span style="color: ${p.stock > 0 ? 'green' : 'red'}; font-weight: 500;">
                        ${p.stock} in stock
                    </span>
                </td>
                <td>
                    <a href="edit-product.html?id=${p.id}" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; text-decoration: none;">Edit</a>
                    <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-left: 0.5rem;" onclick="deleteVendorProduct('${p.id}')">Delete</button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load products.</td></tr>';
    }
}

async function loadVendorOrders(vendorId) {
    const tbody = document.getElementById('vendorOrderList');

    try {
        const { data: orderItems, error } = await window.supabaseClient
            .from('order_items')
            .select(`
                *,
                orders!inner (*),
                products!inner (*)
            `)
            .eq('products.vendor_id', vendorId);

        if (error) throw error;

        const ordersMap = {};
        let totalSales = 0;
        let pendingCount = 0;

        orderItems.forEach(item => {
            if (!item.orders) return;

            totalSales += (item.price * item.quantity);

            if (!ordersMap[item.order_id]) {
                ordersMap[item.order_id] = {
                    ...item.orders,
                    items: []
                };
                if (item.orders.status === 'confirmed') {
                    pendingCount++;
                }
            }
            ordersMap[item.order_id].items.push(item);
        });

        const salesEl = document.getElementById('statTotalSales');
        const pendingEl = document.getElementById('statPendingOrders');
        if (salesEl) salesEl.textContent = window.NagaHaatUI.formatCurrency(totalSales);
        if (pendingEl) pendingEl.textContent = pendingCount;

        const orders = Object.values(ordersMap).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (tbody) {
            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No orders found yet.</td></tr>';
                return;
            }

            tbody.innerHTML = orders.map(order => {
                const date = new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                });

                const itemsText = order.items.map(i => `${i.quantity}x ${i.products.title}`).join(', ');

                return `
                <tr>
                    <td>#${order.id.slice(0, 8)}</td>
                    <td>${date}</td>
                    <td style="max-width: 250px;">${itemsText}</td>
                    <td>${window.NagaHaatUI.formatCurrency(order.total_price)}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td>
                        <div style="font-size: 0.85rem; line-height: 1.3;">
                            <div style="font-weight: 500;">${order.building}</div>
                            <div>${order.ward ? order.ward + ', ' : ''}${order.town}</div>
                            <div>${order.district}, ${order.state}</div>
                            ${order.landmark ? `<div style="font-style: italic; font-size: 0.75rem; color: #777;">Landmark: ${order.landmark}</div>` : ''}
                            ${order.latitude ? `<div style="margin-top: 0.3rem;"><a href="https://www.google.com/maps?q=${order.latitude},${order.longitude}" target="_blank" style="color: var(--color-primary); font-weight: 500;">📍 View Location Map</a></div>` : ''}
                        </div>
                    </td>
                    <td>
                        <select class="form-control" style="padding: 4px; font-size: 0.9rem;" onchange="alert('Status updates coming in Phase 7')">
                            <option ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </td>
                </tr>
            `;
            }).join('');
        }
    } catch (err) {
        console.error(err);
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Failed to load orders.</td></tr>';
    }
}

// Global expose for inline onclick
window.deleteVendorProduct = (id) => {
    window.NagaHaatUI.confirm(
        'Delete Product?',
        'Are you sure you want to delete this treasure? This action cannot be undone.',
        async (confirmed) => {
            if (confirmed) {
                try {
                    await window.NagaProducts.deleteProduct(id);
                    const session = window.NagaAuth.getSession();
                    loadVendorProducts(session.user_id);
                } catch (err) {
                    alert('Failed to delete: ' + err.message);
                }
            }
        }
    );
};
