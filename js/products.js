// js/products.js - Products Module backed by Supabase

(function () {
    const sb = window.supabaseClient;

    const NagaProducts = {
        async getAllProducts() {
            const { data, error } = await sb
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching products:', error);
                return [];
            }
            return data;
        },

        async getProductById(id) {
            const { data, error } = await sb
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error('Product not found');
            return data;
        },

        async getProductsByCategory(category, filters = {}) {
            let query = sb.from('products').select('*');

            if (category && category !== 'all' && category !== 'All') {
                query = query.eq('category', category);
            }

            if (filters.minPrice) {
                query = query.gte('price', filters.minPrice);
            }
            if (filters.maxPrice && filters.maxPrice !== Infinity) {
                query = query.lte('price', filters.maxPrice);
            }
            if (filters.minRating) {
                query = query.gte('rating', filters.minRating);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching by category:', error);
                return [];
            }
            return data;
        },

        async searchProducts(query, category = 'all') {
            let dbQuery = sb.from('products').select('*');

            if (category && category !== 'all' && category !== 'All') {
                dbQuery = dbQuery.eq('category', category);
            }

            if (query) {
                dbQuery = dbQuery.ilike('title', `%${query}%`);
            }

            const { data, error } = await dbQuery.order('created_at', { ascending: false });

            if (error) {
                console.error('Error searching:', error);
                return [];
            }
            return data;
        },

        async getFeaturedProducts(count = 4) {
            const { data, error } = await sb
                .from('products')
                .select('*')
                .order('rating', { ascending: false })
                .limit(count);

            if (error) {
                console.error('Error fetching featured:', error);
                return [];
            }
            return data;
        },

        // Categories remain a static list
        getCategories() {
            return [
                'Handloom & Textiles',
                'Handicrafts & Art',
                'Organic Produce',
                'Bamboo Crafts',
                'Local Foods'
            ];
        },

        async addProduct(vendorId, vendorName, productData) {
            const { data, error } = await sb
                .from('products')
                .insert({
                    vendor_id: vendorId,
                    vendor_name: vendorName,
                    title: productData.title,
                    description: productData.description,
                    price: productData.price,
                    original_price: productData.original_price,
                    category: productData.category,
                    stock: productData.stock,
                    image_url: productData.image_url,
                    rating: 0,
                    review_count: 0
                })
                .select()
                .single();

            if (error) throw new Error('Failed to add product: ' + error.message);
            return data;
        },

        async getProductsByVendor(vendorId) {
            const { data, error } = await sb
                .from('products')
                .select('*')
                .eq('vendor_id', vendorId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching vendor products:', error);
                return [];
            }
            return data;
        },

        async deleteProduct(id) {
            const { error } = await sb
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw new Error('Failed to delete product: ' + error.message);
            return true;
        },

        async updateProduct(id, productData) {
            const { data, error } = await sb
                .from('products')
                .update({
                    title: productData.title,
                    description: productData.description,
                    price: productData.price,
                    original_price: productData.original_price,
                    category: productData.category,
                    stock: productData.stock,
                    image_url: productData.image_url
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error('Failed to update product: ' + error.message);
            return data;
        }
    };

    window.NagaProducts = NagaProducts;
})();
