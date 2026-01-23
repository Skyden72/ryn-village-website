-- Migration: Add invoice_number to bills table
-- This allows tracking distinct invoice IDs and prevents duplicates

ALTER TABLE public.bills
ADD COLUMN IF NOT EXISTS invoice_number TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_bills_invoice_number ON public.bills(invoice_number);
