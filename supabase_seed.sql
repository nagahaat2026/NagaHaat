-- ============================================
-- Naga Haat Seed Data
-- Run this AFTER the schema has been created
-- and AFTER you have registered a vendor user
-- ============================================

-- First, we need a vendor profile to assign products to.
-- Get the vendor's UUID from the profiles table after they register.
-- Replace 'VENDOR_UUID_HERE' below with the actual UUID.

-- To find a vendor UUID, run:
-- SELECT id, email, role FROM profiles WHERE role = 'vendor';

-- If you don't have a vendor yet, create one first via the Register page
-- with role = vendor, then come back and run this.

-- TEMPORARY: Insert products without foreign key constraint
-- by using a placeholder vendor. You'll want to update this
-- after real vendors register.

-- For now, let's insert products with the vendor_id set to a dummy UUID
-- We'll create a service-level insert that bypasses RLS

-- Option: Run this from the Supabase SQL Editor (which has service role access)

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Local Artisan',
    'Authentic Naga Spear (Miniature)',
    'A beautifully handcrafted miniature Naga spear, perfect for cultural decor. Made with traditional bamboo and dyed goat hair representing the warrior heritage.',
    1200.00,
    'Handicrafts & Art',
    15,
    4.8,
    24,
    'https://res.cloudinary.com/ddue0acyn/image/upload/IMG_20260301_132217_ud1kwz.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Local Artisan',
    'Chakhesang Shawl',
    'Premium handwoven Chakhesang Naga shawl. Features intricate traditional motifs signifying bravery and honor. Woven on a traditional backstrap loom by expert female weavers.',
    3500.00,
    'Handloom & Textiles',
    8,
    4.9,
    42,
    'https://res.cloudinary.com/ddue0acyn/image/upload/v1772352329/IMG_20260301_133431_o81hrz.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Organic Roots Nagaland',
    'Smoked King Chilli (Bhut Jolokia)',
    'Intensely spicy and highly aromatic smoked King Chilli, sourced directly from the farms of Peren district. Use sparingly to flavor stews and chutneys.',
    450.00,
    'Organic Produce',
    50,
    4.7,
    156,
    'https://res.cloudinary.com/ddue0acyn/image/upload/product-jpeg-500x500_wdmcaw.png',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Bamboo Creations',
    'Woven Bamboo Storage Basket',
    'Durable and eco-friendly storage basket handwoven from cured cane and bamboo. Features a tight weave and a sturdy base.',
    850.00,
    'Bamboo Crafts',
    20,
    4.5,
    18,
    'https://res.cloudinary.com/ddue0acyn/image/upload/81W0qYCzX6L._AC_UF894_1000_QL80_FMwebp__yqofrw.webp',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Organic Roots Nagaland',
    'Wild Honey (Fresh Forest Source)',
    'Pure, raw, and unfiltered wild honey collected from the deep forests of Nagaland. Known for its rich medicinal properties and unique floral notes.',
    600.00,
    'Local Foods',
    30,
    4.9,
    89,
    'https://res.cloudinary.com/ddue0acyn/image/upload/jungleehoney5_jxnmiy.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Local Artisan',
    'Ao Naga Neckpiece',
    'Traditional multi-layered bead necklace worn during festivals. A stunning statement piece of cultural jewelry.',
    2200.00,
    'Handicrafts & Art',
    5,
    5.0,
    12,
    'https://res.cloudinary.com/ddue0acyn/image/upload/IMG_20260301_141220_s8xdck.png',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Bamboo Creations',
    'Bamboo Lamp Shade',
    'Modern minimalist lamp shade crafted from treated bamboo strips. Creates a warm, patterned light effect in any room.',
    1500.00,
    'Bamboo Crafts',
    12,
    4.6,
    31,
    'https://res.cloudinary.com/ddue0acyn/image/upload/IMG_20260301_145016_ozwifp.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Local Artisan',
    'Angami Traditional Skirt',
    'Handwoven traditional wrap-around skirt (Mechala) with Angami motifs. Authentic black, red, and white color scheme.',
    2800.00,
    'Handloom & Textiles',
    6,
    4.8,
    15,
    'https://res.cloudinary.com/ddue0acyn/image/upload/IMG_20260301_141125_ct19pj.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Organic Roots Nagaland',
    'Axone (Fermented Soybean)',
    'Traditional fermented soybean cake. Key ingredient for authentic Naga pork curries and chutneys.',
    300.00,
    'Local Foods',
    100,
    4.4,
    210,
    'https://res.cloudinary.com/ddue0acyn/image/upload/IMG_20260301_141508_waqh7m.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Bamboo Creations',
    'Hand-Carved Wooden Spoon Set',
    'Set of 3 cooking spoons carved from seasoned wood. Heat resistant and chemical-free.',
    550.00,
    'Handicrafts & Art',
    25,
    4.5,
    19,
    'https://res.cloudinary.com/ddue0acyn/image/upload/611WytPU2HL._AC_UF894_1000_QL80_FMwebp__isvnhu.webp',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Local Artisan',
    'Naga Warrior Wall Plate',
    'Hand-painted wooden wall plate featuring a traditional Naga warrior insignia. Diameter: 12 inches.',
    1800.00,
    'Handicrafts & Art',
    7,
    4.9,
    8,
    'https://res.cloudinary.com/ddue0acyn/image/upload/panel1_gzqask.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Organic Roots Nagaland',
    'Peren Ginger Powder',
    '100% organic sun-dried ginger powder from the hills of Peren. Superior aroma and heat.',
    250.00,
    'Organic Produce',
    80,
    4.7,
    52,
    'https://res.cloudinary.com/ddue0acyn/image/upload/dehydrated-ginger-powder-supplier-500x500_x1se5z.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Bamboo Creations',
    'Traditional Bamboo Mug',
    'Authentic bamboo drinking mug, cured and polished. Perfect for traditional rice beer or as a desktop pencil holder.',
    400.00,
    'Bamboo Crafts',
    40,
    4.6,
    65,
    'https://res.cloudinary.com/ddue0acyn/image/upload/bamboo-cup-designer_xffhjs.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Local Artisan',
    'Sumi Naga Shawl',
    'Distinctive black and white Sumi shawl with traditional red bands. Heavy-duty weave.',
    3200.00,
    'Handloom & Textiles',
    5,
    4.8,
    22,
    'https://res.cloudinary.com/ddue0acyn/image/upload/IMG_20260301_142347_o4rpoq.jpg',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;

INSERT INTO products (vendor_name, title, description, price, category, stock, rating, review_count, image_url, vendor_id)
SELECT 
    'Organic Roots Nagaland',
    'Bamboo Shoot Pickle (Fermented)',
    'Spicy and tangy fermented bamboo shoot pickle. A staple condiment for any Naga meal.',
    350.00,
    'Local Foods',
    60,
    4.5,
    134,
    'https://res.cloudinary.com/ddue0acyn/image/upload/IMG_20260301_142525_svsnfk.png',
    id
FROM profiles WHERE role = 'vendor' LIMIT 1;
