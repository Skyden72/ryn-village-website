-- Ryn Village Resident Portal
-- Database Schema Migration
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- RESIDENTS TABLE
-- Extends Supabase auth.users
-- ============================================
CREATE TABLE IF NOT EXISTS public.residents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

-- Residents can only see their own data
CREATE POLICY "Residents can view own profile" ON public.residents
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Residents can update own profile" ON public.residents
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- ADMINS TABLE
-- For staff with elevated permissions
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'staff' CHECK (role IN ('staff', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admins can see all admins
CREATE POLICY "Admins can view all admins" ON public.admins
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'urgent')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.admins(id),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read published announcements
CREATE POLICY "Anyone can view published announcements" ON public.announcements
  FOR SELECT USING (is_published = TRUE);

-- Admins can do anything with announcements
CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================
-- ANNOUNCEMENT READS (Track read status)
-- ============================================
CREATE TABLE IF NOT EXISTS public.announcement_reads (
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (resident_id, announcement_id)
);

-- Enable RLS
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

-- Residents can manage their own read status
CREATE POLICY "Residents can manage own reads" ON public.announcement_reads
  FOR ALL USING (auth.uid() = resident_id);

-- ============================================
-- BILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  pdf_url TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Residents can only see their own bills
CREATE POLICY "Residents can view own bills" ON public.bills
  FOR SELECT USING (auth.uid() = resident_id);

-- Admins can manage all bills
CREATE POLICY "Admins can manage all bills" ON public.bills
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================
-- MAINTENANCE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  assigned_to UUID REFERENCES public.admins(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Residents can view and create their own requests
CREATE POLICY "Residents can view own requests" ON public.maintenance_requests
  FOR SELECT USING (auth.uid() = resident_id);

CREATE POLICY "Residents can create requests" ON public.maintenance_requests
  FOR INSERT WITH CHECK (auth.uid() = resident_id);

-- Admins can manage all requests
CREATE POLICY "Admins can manage all requests" ON public.maintenance_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bills_resident ON public.bills(resident_id);
CREATE INDEX IF NOT EXISTS idx_bills_month ON public.bills(month DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(published_at DESC) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON public.maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_resident ON public.maintenance_requests(resident_id);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_residents_updated_at
  BEFORE UPDATE ON public.residents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_maintenance_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to add test data after creating an admin user

-- INSERT INTO public.announcements (title, content, priority) VALUES
-- ('Welcome to Ryn Village Portal', 'We are excited to launch the new resident portal. Here you can view your bills, read announcements, and submit maintenance requests.', 'normal'),
-- ('Water Maintenance Scheduled', 'Water will be shut off on Saturday from 8am to 12pm for essential maintenance.', 'urgent');
