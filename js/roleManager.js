// roleManager.js - Handles route protection based on role

document.addEventListener('DOMContentLoaded', () => {
    // Determine the required role based on the current URL path
    const path = window.location.pathname;
    const session = window.NagaAuth ? window.NagaAuth.getSession() : null;

    // Check if the page is a public page that should redirect if logged in (like login/register)
    const isAuthPage = path.endsWith('/login.html') || path.endsWith('/register.html');

    if (isAuthPage && session) {
        // Logged-in users shouldn't see login/register pages
        window.NagaAuth.redirectBasedOnRole(session.role);
        return;
    }

    // Protect My Orders (Buyer)
    if (path.includes('/my-orders.html') && !session) {
        window.location.href = 'login.html';
        return;
    }

    // Protect Vendor Routes
    if (path.includes('/vendor/')) {
        if (!session) {
            window.location.href = '../login.html';
            return;
        }
        if (session.role !== 'vendor' && session.role !== 'admin') {
            window.location.href = '../index.html';
            return;
        }
        if (session.role === 'vendor' && !session.approved) {
            // Show a pending approval message
            document.body.innerHTML = `
                <div style="text-align: center; padding: 5rem; font-family: sans-serif;">
                    <h2>Account Pending Approval</h2>
                    <p>Your vendor account is currently being reviewed by an administrator. Please check back later.</p>
                    <button onclick="window.NagaAuth.logout()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">Logout</button>
                    <button onclick="window.location.href='../index.html'" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">Go Home</button>
                </div>
            `;
            return;
        }
    }

    // Protect Admin Routes
    if (path.includes('/admin/')) {
        if (!session) {
            window.location.href = '../login.html';
            return;
        }
        if (session.role !== 'admin') {
            // Un-authorized user trying to access admin panel
            window.location.href = '../index.html';
            return;
        }
    }
});
