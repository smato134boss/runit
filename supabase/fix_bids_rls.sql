-- Allow poster to accept/reject bids on their own tasks
CREATE POLICY "bids_update_poster" ON bids FOR UPDATE USING (
  auth.uid() = (SELECT poster_id FROM tasks WHERE id = task_id)
);
