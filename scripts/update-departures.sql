-- ============================================================
-- K2K ADVENTUREZ — UPDATE ALL TRIP DEPARTURES
-- Run this in Supabase SQL Editor
-- This deletes existing departures and inserts new ones for all 7 trips
-- ============================================================

-- 1. 6 Days Leh to Leh (trip: 6-days-leh-to-leh) — 26 departures
DELETE FROM trip_departures WHERE trip_id = (SELECT id FROM trips WHERE slug = '6-days-leh-to-leh');
INSERT INTO trip_departures (trip_id, start_date, end_date, available_seats, booked_seats, status)
SELECT id, start_date::date, end_date::date, 20, 0, 'available'
FROM trips, (VALUES
  ('2026-04-20','2026-04-25'),('2026-04-25','2026-04-30'),
  ('2026-05-04','2026-05-09'),('2026-05-09','2026-05-14'),
  ('2026-05-18','2026-05-23'),('2026-05-23','2026-05-28'),
  ('2026-06-01','2026-06-06'),('2026-06-06','2026-06-11'),
  ('2026-06-15','2026-06-20'),('2026-06-20','2026-06-25'),
  ('2026-06-29','2026-07-04'),('2026-07-04','2026-07-09'),
  ('2026-07-13','2026-07-18'),('2026-07-18','2026-07-23'),
  ('2026-07-27','2026-08-01'),('2026-08-01','2026-08-06'),
  ('2026-08-10','2026-08-15'),('2026-08-15','2026-08-20'),
  ('2026-08-24','2026-08-29'),('2026-08-29','2026-09-03'),
  ('2026-09-07','2026-09-12'),('2026-09-12','2026-09-17'),
  ('2026-09-21','2026-09-26'),('2026-09-26','2026-10-01'),
  ('2026-10-05','2026-10-10'),('2026-10-10','2026-10-15')
) AS d(start_date, end_date)
WHERE trips.slug = '6-days-leh-to-leh';

-- 2. 8 Days Leh to Manali (trip: 8-days-leh-ladakh-manali) — 7 departures
DELETE FROM trip_departures WHERE trip_id = (SELECT id FROM trips WHERE slug = '8-days-leh-ladakh-manali');
INSERT INTO trip_departures (trip_id, start_date, end_date, available_seats, booked_seats, status)
SELECT id, start_date::date, end_date::date, 20, 0, 'available'
FROM trips, (VALUES
  ('2026-06-01','2026-06-08'),('2026-06-15','2026-06-22'),
  ('2026-06-29','2026-07-06'),('2026-07-13','2026-07-20'),
  ('2026-08-10','2026-08-17'),('2026-09-07','2026-09-14'),
  ('2026-09-21','2026-09-28')
) AS d(start_date, end_date)
WHERE trips.slug = '8-days-leh-ladakh-manali';

-- 3. 8 Days Leh to Srinagar (trip: 8-days-leh-ladakh-srinagar) — 12 departures
DELETE FROM trip_departures WHERE trip_id = (SELECT id FROM trips WHERE slug = '8-days-leh-ladakh-srinagar');
INSERT INTO trip_departures (trip_id, start_date, end_date, available_seats, booked_seats, status)
SELECT id, start_date::date, end_date::date, 20, 0, 'available'
FROM trips, (VALUES
  ('2026-04-25','2026-05-02'),('2026-05-09','2026-05-16'),
  ('2026-05-23','2026-05-30'),('2026-06-06','2026-06-13'),
  ('2026-06-20','2026-06-27'),('2026-07-04','2026-07-11'),
  ('2026-07-18','2026-07-25'),('2026-08-01','2026-08-08'),
  ('2026-08-15','2026-08-22'),('2026-08-29','2026-09-05'),
  ('2026-09-12','2026-09-19'),('2026-09-26','2026-10-03')
) AS d(start_date, end_date)
WHERE trips.slug = '8-days-leh-ladakh-srinagar';

-- 4. 8 Days Srinagar to Leh (trip: 8-days-srinagar-leh-ladakh) — 13 departures
DELETE FROM trip_departures WHERE trip_id = (SELECT id FROM trips WHERE slug = '8-days-srinagar-leh-ladakh');
INSERT INTO trip_departures (trip_id, start_date, end_date, available_seats, booked_seats, status)
SELECT id, start_date::date, end_date::date, 20, 0, 'available'
FROM trips, (VALUES
  ('2026-04-18','2026-04-25'),('2026-05-02','2026-05-09'),
  ('2026-05-16','2026-05-23'),('2026-05-30','2026-06-06'),
  ('2026-06-13','2026-06-20'),('2026-06-27','2026-07-04'),
  ('2026-07-11','2026-07-18'),('2026-07-25','2026-08-01'),
  ('2026-08-08','2026-08-15'),('2026-08-22','2026-08-29'),
  ('2026-09-05','2026-09-12'),('2026-09-19','2026-09-26'),
  ('2026-10-03','2026-10-10')
) AS d(start_date, end_date)
WHERE trips.slug = '8-days-srinagar-leh-ladakh';

-- 5. 9 Days Leh to Leh via Hanle (trip: 9-days-ex-leh-hanle-umlingla-tso-moriri) — 13 departures
DELETE FROM trip_departures WHERE trip_id = (SELECT id FROM trips WHERE slug = '9-days-ex-leh-hanle-umlingla-tso-moriri');
INSERT INTO trip_departures (trip_id, start_date, end_date, available_seats, booked_seats, status)
SELECT id, start_date::date, end_date::date, 20, 0, 'available'
FROM trips, (VALUES
  ('2026-05-23','2026-05-31'),('2026-06-01','2026-06-09'),
  ('2026-06-06','2026-06-14'),('2026-06-15','2026-06-23'),
  ('2026-06-20','2026-06-28'),('2026-07-04','2026-07-12'),
  ('2026-07-18','2026-07-26'),('2026-08-01','2026-08-09'),
  ('2026-08-15','2026-08-23'),('2026-09-07','2026-09-15'),
  ('2026-09-12','2026-09-20'),('2026-09-26','2026-10-04'),
  ('2026-10-05','2026-10-13')
) AS d(start_date, end_date)
WHERE trips.slug = '9-days-ex-leh-hanle-umlingla-tso-moriri';

-- 6. 10 Days Manali-Leh-Srinagar (trip: 10-days-manali-leh-ladakh-srinagar) — 7 departures
DELETE FROM trip_departures WHERE trip_id = (SELECT id FROM trips WHERE slug = '10-days-manali-leh-ladakh-srinagar');
INSERT INTO trip_departures (trip_id, start_date, end_date, available_seats, booked_seats, status)
SELECT id, start_date::date, end_date::date, 20, 0, 'available'
FROM trips, (VALUES
  ('2026-05-21','2026-05-30'),('2026-06-04','2026-06-13'),
  ('2026-06-18','2026-06-27'),('2026-07-02','2026-07-11'),
  ('2026-08-13','2026-08-22'),('2026-09-10','2026-09-19'),
  ('2026-09-24','2026-10-03')
) AS d(start_date, end_date)
WHERE trips.slug = '10-days-manali-leh-ladakh-srinagar';

-- 7. 10 Days Srinagar-Leh-Manali (trip: 10-days-srinagar-leh-ladakh-manali) — 7 departures
DELETE FROM trip_departures WHERE trip_id = (SELECT id FROM trips WHERE slug = '10-days-srinagar-leh-ladakh-manali');
INSERT INTO trip_departures (trip_id, start_date, end_date, available_seats, booked_seats, status)
SELECT id, start_date::date, end_date::date, 20, 0, 'available'
FROM trips, (VALUES
  ('2026-05-30','2026-06-08'),('2026-06-13','2026-06-22'),
  ('2026-06-27','2026-07-06'),('2026-07-11','2026-07-20'),
  ('2026-08-08','2026-08-17'),('2026-09-05','2026-09-14'),
  ('2026-09-19','2026-09-28')
) AS d(start_date, end_date)
WHERE trips.slug = '10-days-srinagar-leh-ladakh-manali';
