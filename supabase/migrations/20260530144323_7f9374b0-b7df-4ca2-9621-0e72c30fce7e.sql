
-- App roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Daily menu items
CREATE TABLE public.daily_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.daily_menu_items TO anon, authenticated;
GRANT ALL ON public.daily_menu_items TO authenticated;
GRANT ALL ON public.daily_menu_items TO service_role;

ALTER TABLE public.daily_menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu items"
  ON public.daily_menu_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert menu items"
  ON public.daily_menu_items FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update menu items"
  ON public.daily_menu_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete menu items"
  ON public.daily_menu_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for menu
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_menu_items;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER daily_menu_items_updated_at
  BEFORE UPDATE ON public.daily_menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed sample menu
INSERT INTO public.daily_menu_items (name, description, price, sort_order) VALUES
  ('Tagliatelle al ragù', 'Pasta fresca con ragù di manzo cotto lentamente', 9.50, 1),
  ('Scaloppine al limone', 'Vitello tenero con salsa al limone e patate arrosto', 11.00, 2),
  ('Insalatona dell''orto', 'Misticanza, pomodorini, mozzarella, olive e crostini', 8.50, 3),
  ('Zuppa del giorno', 'Vellutata di stagione con pane casereccio', 7.00, 4);
