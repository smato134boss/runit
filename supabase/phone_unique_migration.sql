-- Run this in Supabase Dashboard → SQL Editor
-- Ensures one account per phone number (ignores NULL and empty)

CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique
  ON profiles (phone)
  WHERE phone IS NOT NULL AND phone != '';
