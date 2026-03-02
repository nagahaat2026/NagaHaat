// admin.js - Admin specific logic using Supabase

document.addEventListener('DOMContentLoaded', () => {
    const session = window.NagaAuth.getSession();

    // Update Admin Name
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    if (adminNameDisplay) {
        adminNameDisplay.textContent = session.full_name;
    }

    // Load Overall Dashboard Stats
    if (document.getElementById('adminStatUsers')) {
        loadAdminDashboardStats();
    }

    // Load Vendors Tab
    if (document.getElementById('adminVendorList')) {
        loadVendorList();
    }

    // Load Products Tab
    if (document.getElementById('adminProductList')) {
        loadAllProducts();
    }
});

async function loadAdminDashboardStats() {
    const sb = window.supabaseClient;

    // Count all profiles
    const { data: users, error: usersErr } = await sb.from('profiles').select('id, role');
    if (usersErr) {
        console.error('Error loading stats:', usersErr);
        return;
    }

    const vendors = users.filter(u => u.role === 'vendor');

    document.getElementById('adminStatUsers').textContent = users.length;
    document.getElementById('adminStatVendors').textContent = vendors.length;

    const products = await window.NagaProducts.getAllProducts();
    document.getElementById('adminStatProducts').textContent = products.length;

    // Calculate Total Platform Volume
    const { data: orders, error: ordersErr } = await sb.from('orders').select('total_price');
    if (!ordersErr && orders) {
        const totalVolume = orders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
        const volumeEl = document.getElementById('adminStatVolume');
        if (volumeEl) {
            volumeEl.textContent = window.NagaHaatUI.formatCurrency(totalVolume);
        }
    }
}

async function loadVendorList() {
    const sb = window.supabaseClient;
    const tbody = document.getElementById('adminVendorList');

    const { data: vendors, error } = await sb
        .from('profiles')
        .select('*')
        .eq('role', 'vendor')
        .order('created_at', { ascending: false });

    if (error) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: red;">Failed to load vendors.</td></tr>';
        return;
    }

    if (vendors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No vendors found.</td></tr>';
        return;
    }

    tbody.innerHTML = vendors.map(v => `
        <tr>
            <td>
                <div style="font-weight: 500;">${v.full_name}</div>
                <div style="font-size: 0.85rem; color: #666;">${v.email}</div>
            </td>
            <td>
                <span class="badge ${v.approved ? 'badge-secondary' : 'badge-primary'}">
                    ${v.approved ? 'Approved' : 'Pending'}
                </span>
            </td>
            <td>
                <span style="color: ${v.status === 'active' ? 'green' : 'red'};">
                    ${v.status}
                </span>
            </td>
            <td>
                ${!v.approved ?
            `<button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem; color: green; border-color: green;" onclick="window.approveVendor('${v.id}')">Approve</button>` :
            ''
        }
                ${v.status === 'active' ?
            `<button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; color: red; border-color: red;" onclick="window.suspendVendor('${v.id}')">Suspend</button>` :
            `<button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; color: green; border-color: green;" onclick="window.activateVendor('${v.id}')">Activate</button>`
        }
            </td>
        </tr>
    `).join('');
}

async function loadAllProducts() {
    const tbody = document.getElementById('adminProductList');
    try {
        const products = await window.NagaProducts.getAllProducts();

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No products on platform.</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(p => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${p.image_url}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                        <span style="font-weight: 500;">${p.title}</span>
                    </div>
                </td>
                <td>${p.vendor_name}</td>
                <td>${p.category}</td>
                <td>${window.NagaHaatUI.formatCurrency(p.price)}</td>
                <td>
                    <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="window.adminDeleteProduct('${p.id}')">Remove</button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Failed to load products</td></tr>';
    }
}

// Global actions for onclick
window.approveVendor = async (id) => {
    window.NagaHaatUI.confirm(
        'Approve Vendor?',
        'This will allow the vendor to start selling on Naga Haat.',
        async (confirmed) => {
            if (confirmed) {
                const sb = window.supabaseClient;
                const { error } = await sb.from('profiles').update({ approved: true }).eq('id', id);
                if (error) { alert('Failed: ' + error.message); return; }
                loadVendorList();
            }
        },
        { okText: 'Approve', okColor: '#388e3c' }
    );
};

window.suspendVendor = async (id) => {
    window.NagaHaatUI.confirm(
        'Suspend Vendor?',
        'They will no longer be able to log in or manage their products.',
        async (confirmed) => {
            if (confirmed) {
                const sb = window.supabaseClient;
                const { error } = await sb.from('profiles').update({ status: 'suspended' }).eq('id', id);
                if (error) { alert('Failed: ' + error.message); return; }
                loadVendorList();
            }
        },
        { okText: 'Suspend', okColor: '#d32f2f' }
    );
};

window.activateVendor = async (id) => {
    window.NagaHaatUI.confirm(
        'Re-activate Vendor?',
        'This will restore their access to the platform.',
        async (confirmed) => {
            if (confirmed) {
                const sb = window.supabaseClient;
                const { error } = await sb.from('profiles').update({ status: 'active' }).eq('id', id);
                if (error) { alert('Failed: ' + error.message); return; }
                loadVendorList();
            }
        },
        { okText: 'Activate', okColor: '#388e3c' }
    );
};

window.adminDeleteProduct = async (id) => {
    window.NagaHaatUI.confirm(
        'Remove Product?',
        'Are you sure you want to remove this product from the platform? This action is permanent.',
        async (confirmed) => {
            if (confirmed) {
                try {
                    await window.NagaProducts.deleteProduct(id);
                    loadAllProducts();
                } catch (err) {
                    alert(err.message);
                }
            }
        },
        { okText: 'Remove', okColor: '#d32f2f' }
    );
};
