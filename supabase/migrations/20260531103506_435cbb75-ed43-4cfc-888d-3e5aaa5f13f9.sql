-- Catering requests table
CREATE TABLE public.catering_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  event_date date NOT NULL,
  guests integer,
  requests text,
  status text NOT NULL DEFAULT 'new',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '3 months'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT catering_requests_status_check CHECK (status IN ('new','read','archived'))
);

GRANT INSERT ON public.catering_requests TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.catering_requests TO authenticated;
GRANT ALL ON public.catering_requests TO service_role;

ALTER TABLE public.catering_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit catering requests"
ON public.catering_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view catering requests"
ON public.catering_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update catering requests"
ON public.catering_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete catering requests"
ON public.catering_requests FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_catering_requests_updated_at
BEFORE UPDATE ON public.catering_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_catering_requests_created_at ON public.catering_requests (created_at DESC);
CREATE INDEX idx_catering_requests_expires_at ON public.catering_requests (expires_at);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.catering_requests;

-- Auto-cleanup of expired requests
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup-expired-catering-requests',
  '0 3 * * *',
  $$DELETE FROM public.catering_requests WHERE expires_at < now();$$
);
