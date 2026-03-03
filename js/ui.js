// ui.js - Global UI interactions and utilities

const NagaHaatUI = (function () {

    function formatCurrency(amount) {
        const val = parseFloat(amount);
        if (val % 1 === 0) return `₹${val.toLocaleString('en-IN')}`;
        return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function initAuthHeader() {
        const authContainer = document.getElementById('authContainer');
        if (!authContainer) return;

        const session = window.NagaAuth ? window.NagaAuth.getSession() : null;
        const isSubfolder = window.location.pathname.includes('/vendor/') || window.location.pathname.includes('/admin/');
        const rootPrefix = isSubfolder ? '../' : '';

        if (session) {
            const firstName = session.full_name.split(' ')[0];

            // Standard Desktop Header
            authContainer.innerHTML = `
                <div class="flex items-center gap-sm">
                    <span class="hide-mobile" style="font-size: 0.9rem; font-weight: 500;">Hi, ${firstName}</span>
                    
                    <!-- Mobile Exclusive Items -->
                    <span class="mobile-user-name" style="display: none;">${firstName}</span>
                    <div class="profile-trigger-mobile" style="display: none;" onclick="window.NagaHaatUI.toggleUserDrawer()">
                        👤
                    </div>

                    <!-- Desktop Actions -->
                    <div class="flex items-center gap-sm hide-mobile">
                        <a href="${rootPrefix}my-orders.html" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">My Orders</a>
                        <button onclick="window.NagaAuth.logout()" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Logout</button>
                    </div>
                </div>
            `;

            // Populate User Drawer (Mobile)
            const drawerLinks = document.getElementById('userDrawerLinks');
            if (drawerLinks) {
                drawerLinks.innerHTML = `
                    <a href="${rootPrefix}my-orders.html" class="drawer-link">📦 My Orders</a>
                    <button onclick="window.NagaAuth.logout()" class="drawer-link" style="width: 100%; border: none; background: none; cursor: pointer; font-family: inherit;">🚪 Logout</button>
                `;
            }
        } else {
            authContainer.innerHTML = `
                <a href="${rootPrefix}login.html" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Log In</a>
                <a href="${rootPrefix}register.html" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Sign Up</a>
                
                <!-- Mobile Only Profile (when logged out) -->
                <div class="profile-trigger-mobile" style="display: none;" onclick="window.location.href='${rootPrefix}login.html'">
                    👤
                </div>
            `;
        }
    }

    function toggleUserDrawer() {
        const drawer = document.getElementById('userDrawer');
        const overlay = document.getElementById('sidebarOverlay');
        if (!drawer || !overlay) return;

        const isActive = drawer.classList.contains('active');
        if (isActive) {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            drawer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Close filter sidebar if open
            const filterSidebar = document.getElementById('sidebarFilters');
            if (filterSidebar) filterSidebar.classList.remove('active');
        }
    }

    function initDrawerLogic() {
        const closeBtn = document.getElementById('closeUserDrawer');
        const overlay = document.getElementById('sidebarOverlay');

        if (closeBtn) closeBtn.onclick = toggleUserDrawer;
        if (overlay) {
            // Only add if not already handled for filters or handle both
            const currentClick = overlay.onclick;
            overlay.onclick = () => {
                if (currentClick) currentClick();
                const drawer = document.getElementById('userDrawer');
                if (drawer && drawer.classList.contains('active')) toggleUserDrawer();
            };
        }
    }

    function initCartCounters() {
        if (window.NagaCart) {
            window.NagaCart.updateCartCounters();
            window.addEventListener('cartUpdated', () => {
                window.NagaCart.updateCartCounters();
            });
        }
    }

    function confirm(title, message, callback, options = {}) {
        const {
            okText = 'Confirm',
            cancelText = 'Cancel',
            okColor = '#388e3c'
        } = options;

        let modal = document.getElementById('naga-confirm-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'naga-confirm-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-container">
                    <h3 class="modal-title" id="naga-confirm-title"></h3>
                    <p class="modal-message" id="naga-confirm-message"></p>
                    <div class="modal-actions">
                        <button class="btn btn-outline" id="naga-confirm-cancel"></button>
                        <button class="btn btn-primary" id="naga-confirm-ok"></button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const titleEl = document.getElementById('naga-confirm-title');
        const messageEl = document.getElementById('naga-confirm-message');
        const okBtn = document.getElementById('naga-confirm-ok');
        const cancelBtn = document.getElementById('naga-confirm-cancel');

        titleEl.textContent = title;
        messageEl.textContent = message;
        okBtn.textContent = okText;
        okBtn.style.backgroundColor = okColor;
        cancelBtn.textContent = cancelText;

        const cleanup = () => {
            modal.classList.remove('active');
            okBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        okBtn.onclick = () => {
            cleanup();
            callback(true);
        };

        cancelBtn.onclick = () => {
            cleanup();
            callback(false);
        };

        setTimeout(() => modal.classList.add('active'), 10);
    }

    return {
        formatCurrency,
        initAuthHeader,
        initCartCounters,
        confirm,
        toggleUserDrawer,
        initDrawerLogic
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    NagaHaatUI.initAuthHeader();
    NagaHaatUI.initCartCounters();
    NagaHaatUI.initDrawerLogic();
});

// Ensure global exact reference
window.NagaHaatUI = NagaHaatUI;
// For legacy components using direct variable reference
window.formatCurrency = NagaHaatUI.formatCurrency;
