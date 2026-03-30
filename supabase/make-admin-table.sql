-- Admins Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow reading the admins table for everyone (needed for middleware to check if session user is admin)
DROP POLICY IF EXISTS "Anyone can read admin_users" ON public.admin_users;
CREATE POLICY "Anyone can read admin_users" ON public.admin_users FOR SELECT USING (true);
