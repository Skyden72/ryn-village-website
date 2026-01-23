-- Create 'invoices' bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS logic for invoices bucket

-- Allow Admins to manage everything in the invoices bucket
CREATE POLICY "Admins can manage invoices bucket" ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'invoices' AND
  (SELECT role FROM public.admins WHERE id = auth.uid()) IS NOT NULL
)
WITH CHECK (
  bucket_id = 'invoices' AND
  (SELECT role FROM public.admins WHERE id = auth.uid()) IS NOT NULL
);
