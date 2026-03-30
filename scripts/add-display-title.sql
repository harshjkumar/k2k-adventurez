-- ============================================================
-- K2K ADVENTUREZ — ADD display_title COLUMN AND UPDATE TITLES
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Add display_title column if it doesn't exist
ALTER TABLE trips ADD COLUMN IF NOT EXISTS display_title TEXT;

-- Step 2: Update display_title for all trips
UPDATE trips SET display_title = '10 Days Trip- Srinagar–Leh Ladakh–Manali' WHERE slug = '10-days-srinagar-leh-ladakh-manali';
UPDATE trips SET display_title = '10 Days Trip- Manali–Leh Ladakh–Srinagar' WHERE slug = '10-days-manali-leh-ladakh-srinagar';
UPDATE trips SET display_title = '9 Days Trip- Ex Leh via Hanle, UmlingLa & Tso Moriri' WHERE slug = '9-days-ex-leh-hanle-umlingla-tso-moriri';
UPDATE trips SET display_title = '8 Days Trip- Srinagar – Leh Ladakh' WHERE slug = '8-days-srinagar-leh-ladakh';
UPDATE trips SET display_title = '8 Days Trip- Manali–Leh Ladakh' WHERE slug = '8-days-manali-leh-ladakh';
UPDATE trips SET display_title = '8 Days Trip- Leh Ladakh–Srinagar' WHERE slug = '8-days-leh-ladakh-srinagar';
UPDATE trips SET display_title = '8 Days Trip- Leh Ladakh–Manali' WHERE slug = '8-days-leh-ladakh-manali';
UPDATE trips SET display_title = '6 Days Trip- Ex Leh Ladakh' WHERE slug = '6-days-leh-to-leh';
