-- ============================================================
-- K2K ADVENTUREZ — HOMEPAGE DATABASE SCHEMA
-- Run this SQL in the Supabase SQL Editor
-- ============================================================

-- Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overline TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Stats / Counters
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value INT NOT NULL,
  suffix TEXT NOT NULL,
  label TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- How It Works steps
CREATE TABLE IF NOT EXISTS how_it_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'ClipboardList',
  "order" INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trip TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  location TEXT NOT NULL,
  review TEXT NOT NULL,
  avatar TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trip Categories
CREATE TABLE IF NOT EXISTS trip_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  region TEXT,
  cover_image TEXT,
  "order" INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES trip_categories(id),
  title TEXT NOT NULL,
  display_title TEXT,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  duration_days INT NOT NULL DEFAULT 1,
  duration_nights INT NOT NULL DEFAULT 0,
  max_altitude_ft INT,
  difficulty TEXT NOT NULL DEFAULT 'moderate',
  season TEXT,
  region TEXT,
  route TEXT,
  start_location TEXT,
  end_location TEXT,
  total_distance TEXT,
  terrain TEXT,
  best_for TEXT,
  rating NUMERIC(2,1) DEFAULT 4.5,
  review_count INT DEFAULT 0,
  highlights TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  cover_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trip Pricing Options
CREATE TABLE IF NOT EXISTS trip_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price INT NOT NULL,
  "order" INT NOT NULL DEFAULT 0
);

-- Trip Itinerary Days
CREATE TABLE IF NOT EXISTS trip_itinerary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  overnight TEXT,
  distance TEXT,
  altitude TEXT
);

-- Trip Departures
CREATE TABLE IF NOT EXISTS trip_departures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  available_seats INT NOT NULL DEFAULT 20,
  booked_seats INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available'
);

-- Contact Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interested_trip TEXT,
  group_size TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AUTH & BOOKINGS TABLES
-- ============================================================

-- User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id),
  departure_id UUID NOT NULL REFERENCES trip_departures(id),
  total_amount INT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_id TEXT, -- e.g. Razorpay order ID
  status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Booking Riders
CREATE TABLE IF NOT EXISTS booking_riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  is_lead_rider BOOLEAN NOT NULL DEFAULT false,
  full_name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT,
  bike_option TEXT NOT NULL, -- "Own Bike", "RE Himalayan (+₹15000)", etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row-Level Security (public read access)
-- ============================================================
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE how_it_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_departures ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_riders ENABLE ROW LEVEL SECURITY;

-- Public read policies for active content
DROP POLICY IF EXISTS "Public read hero_slides" ON hero_slides;
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read stats" ON stats;
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read how_it_works" ON how_it_works;
CREATE POLICY "Public read how_it_works" ON how_it_works FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read trip_categories" ON trip_categories;
CREATE POLICY "Public read trip_categories" ON trip_categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read trips" ON trips;
CREATE POLICY "Public read trips" ON trips FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read trip_pricing" ON trip_pricing;
CREATE POLICY "Public read trip_pricing" ON trip_pricing FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read trip_itinerary" ON trip_itinerary;
CREATE POLICY "Public read trip_itinerary" ON trip_itinerary FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read trip_departures" ON trip_departures;
CREATE POLICY "Public read trip_departures" ON trip_departures FOR SELECT USING (true);

-- User policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own booking riders" ON booking_riders;
CREATE POLICY "Users can read own booking riders" ON booking_riders FOR SELECT USING (
  booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())
);

-- Allow public to insert enquiries
DROP POLICY IF EXISTS "Public insert enquiries" ON enquiries;
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- ============================================================
-- BLOG & GALLERY TABLES
-- ============================================================

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT NOT NULL DEFAULT 'K2K Adventurez',
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery Images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  alt TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  caption TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read blog_posts" ON blog_posts;
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public read gallery_images" ON gallery_images;
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (is_active = true);

