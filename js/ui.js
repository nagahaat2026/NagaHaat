// ui.js - Global UI interactions and utilities

const NagaHaatUI = (function () {

    function formatCurrency(amount) {
        return `₹${parseFloat(amount).toFixed(2)}`;
    }

    function initAuthHeader() {
        const authContainer = document.getElementById('authContainer');
        if (!authContainer) return;

        const session = window.NagaAuth ? window.NagaAuth.getSession() : null;
        const isSubfolder = window.location.pathname.includes('/vendor/') || window.location.pathname.includes('/admin/');
        const rootPrefix = isSubfolder ? '../' : '';

        if (session) {
            authContainer.innerHTML = `
                <div class="flex items-center gap-sm">
                    <span style="font-size: 0.9rem; font-weight: 500;">Hi, ${session.full_name.split(' ')[0]}</span>
                    <button onclick="window.NagaAuth.logout()" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Logout</button>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <a href="${rootPrefix}login.html" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Log In</a>
                <a href="${rootPrefix}register.html" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Sign Up</a>
            `;
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
        confirm
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    NagaHaatUI.initAuthHeader();
    NagaHaatUI.initCartCounters();
});

// Ensure global exact reference
window.NagaHaatUI = NagaHaatUI;
// For legacy components using direct variable reference
window.formatCurrency = NagaHaatUI.formatCurrency;
