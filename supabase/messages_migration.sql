-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS messages (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id    uuid        REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  sender_id  uuid        REFERENCES auth.users(id) NOT NULL,
  content    text        NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Task poster can read
CREATE POLICY "messages_poster_select" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = messages.task_id AND t.poster_id = auth.uid()
    )
  );

-- Accepted runner can read
CREATE POLICY "messages_runner_select" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bids b
      WHERE b.task_id = messages.task_id AND b.runner_id = auth.uid() AND b.status = 'accepted'
    )
  );

-- Only participants can insert their own messages
CREATE POLICY "messages_poster_insert" ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = task_id AND t.poster_id = auth.uid()
    )
  );

CREATE POLICY "messages_runner_insert" ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM bids b
      WHERE b.task_id = task_id AND b.runner_id = auth.uid() AND b.status = 'accepted'
    )
  );

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
