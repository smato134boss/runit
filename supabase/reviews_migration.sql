-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS reviews (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id     uuid        REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id uuid        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating      int         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text        CHECK (char_length(comment) <= 500),
  created_at  timestamptz DEFAULT now(),
  UNIQUE (task_id, reviewer_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
DROP POLICY IF EXISTS "reviews_select" ON reviews;
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);

-- Only authenticated users can insert their own reviews
DROP POLICY IF EXISTS "reviews_insert" ON reviews;
CREATE POLICY "reviews_insert" ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Function: update profile rating after review insert
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    reviews_count = (
      SELECT COUNT(*) FROM reviews WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_profile_rating();
