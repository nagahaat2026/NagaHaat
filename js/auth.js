// auth.js - Authentication using Supabase Auth

(function () {
    const sb = window.supabaseClient;

    const NagaAuth = {
        async login(email, password) {
            const { data, error } = await sb.auth.signInWithPassword({ email, password });

            if (error) throw new Error(error.message);

            // Fetch profile for role info
            const { data: profile, error: profileErr } = await sb
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileErr) throw new Error('Failed to load user profile.');

            if (profile.status === 'suspended') {
                await sb.auth.signOut();
                throw new Error('Your account has been suspended.');
            }

            // Store session info for quick access by UI components
            const session = {
                user_id: data.user.id,
                email: data.user.email,
                full_name: profile.full_name,
                role: profile.role,
                approved: profile.approved || false
            };
            localStorage.setItem('naga_session', JSON.stringify(session));

            this.redirectBasedOnRole(profile.role);
            return session;
        },

        async register(email, password, metadata) {
            const { data, error } = await sb.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: metadata.full_name,
                        role: metadata.role || 'buyer'
                    }
                }
            });

            if (error) throw new Error(error.message);

            // Auto-login after registration
            return this.login(email, password);
        },

        async logout() {
            await sb.auth.signOut();
            localStorage.removeItem('naga_session');
            const isSubfolder = window.location.pathname.includes('/vendor/') || window.location.pathname.includes('/admin/');
            window.location.href = isSubfolder ? '../login.html' : 'login.html';
        },

        getSession() {
            const sessionStr = localStorage.getItem('naga_session');
            if (!sessionStr) return null;
            return JSON.parse(sessionStr);
        },

        // Check if the Supabase auth session is still valid
        async validateSession() {
            const { data: { session } } = await sb.auth.getSession();
            if (!session) {
                localStorage.removeItem('naga_session');
                return null;
            }
            return this.getSession();
        },

        redirectBasedOnRole(role) {
            if (role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else if (role === 'vendor') {
                window.location.href = 'vendor/dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    };

    window.NagaAuth = NagaAuth;

})();
