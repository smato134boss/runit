-- Run this in Supabase SQL Editor

-- profiles table (already exists from auth setup, adding if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  full_name text,
  email text,
  role text DEFAULT 'poster' CHECK (role IN ('poster', 'runner')),
  city text,
  phone text,
  avatar_url text,
  rating numeric(3,2) DEFAULT 0,
  reviews_count int DEFAULT 0
);

-- tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  poster_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  from_city text NOT NULL,
  to_city text,
  budget numeric(10,2) NOT NULL,
  deadline timestamptz,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  runner_id uuid REFERENCES profiles(id)
);

-- bids table
CREATE TABLE IF NOT EXISTS bids (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  runner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  UNIQUE (task_id, runner_id)
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- profiles: anyone can read, only owner can update
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- tasks: anyone can read open tasks, only poster can insert/update their own
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (auth.uid() = poster_id);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (auth.uid() = poster_id);

-- bids: runners see their own bids, posters see bids on their tasks
CREATE POLICY "bids_select_runner" ON bids FOR SELECT USING (auth.uid() = runner_id);
CREATE POLICY "bids_select_poster" ON bids FOR SELECT USING (
  auth.uid() = (SELECT poster_id FROM tasks WHERE id = task_id)
);
CREATE POLICY "bids_insert" ON bids FOR INSERT WITH CHECK (auth.uid() = runner_id);
CREATE POLICY "bids_update_runner" ON bids FOR UPDATE USING (auth.uid() = runner_id);
