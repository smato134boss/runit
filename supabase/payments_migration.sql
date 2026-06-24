-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS payments (
  id                 uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id            uuid        REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  bid_id             uuid        REFERENCES bids(id) ON DELETE SET NULL,
  stripe_session_id  text        UNIQUE,
  amount             numeric(10,2) NOT NULL,
  fee                numeric(10,2) NOT NULL DEFAULT 0,
  runner_payout      numeric(10,2) NOT NULL DEFAULT 0,
  status             text        DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'released')),
  created_at         timestamptz DEFAULT now(),
  UNIQUE (task_id)
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Poster and runner can see their own task payments
CREATE POLICY "payments_select_poster" ON payments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_id AND t.poster_id = auth.uid())
  );

CREATE POLICY "payments_select_runner" ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bids b WHERE b.id = bid_id AND b.runner_id = auth.uid()
    )
  );
