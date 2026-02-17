-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL,
  order_type TEXT NOT NULL DEFAULT 'pickup' CHECK (order_type IN ('pickup', 'delivery')),
  delivery_address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  scheduled_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cooking', 'delivering', 'completed', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert orders (customer menu)
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to read orders (KDS display)
CREATE POLICY "Anyone can read orders" ON public.orders
  FOR SELECT USING (true);

-- Allow anonymous users to update order status (KDS actions)
CREATE POLICY "Anyone can update orders" ON public.orders
  FOR UPDATE USING (true);

-- Enable realtime for the orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_time ON public.orders (scheduled_time);
