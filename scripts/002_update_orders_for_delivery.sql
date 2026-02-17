-- Update orders table for pickup/delivery workflow
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_type TEXT NOT NULL DEFAULT 'pickup'
    CHECK (order_type IN ('pickup', 'delivery')),
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS scheduled_time TIMESTAMPTZ;

-- Update status constraint to new lifecycle
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (
    status IN (
      'pending',
      'confirmed',
      'cooking',
      'delivering',
      'completed',
      'cancelled'
    )
  );

-- Migrate legacy statuses to the new set
UPDATE public.orders
SET status = 'completed'
WHERE status = 'done';

-- Helpful index for scheduled orders
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_time
  ON public.orders (scheduled_time);
