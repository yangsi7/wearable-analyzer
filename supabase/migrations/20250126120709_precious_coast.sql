/*
  # Create Daily Metrics and Symptom Log Tables

  1. New Tables
    - `daily_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `heart_rate_avg` (integer)
      - `heart_rate_min` (integer)
      - `heart_rate_max` (integer)
      - `afib_burden` (numeric)
      - `afib_max_duration` (integer)
      - `afib_max_hr` (integer)
      - `av_blocks_types` (text[])
      - `pauses_count` (integer)
      - `pauses_longest` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `symptom_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `name` (text)
      - `severity` (text)
      - `time` (time)
      - `pathology` (text[])
      - `correlated_events` (text[])
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
    - Add policies for authenticated users to insert/update their own data
*/

-- Create daily_metrics table
CREATE TABLE IF NOT EXISTS daily_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  heart_rate_avg integer NOT NULL,
  heart_rate_min integer NOT NULL,
  heart_rate_max integer NOT NULL,
  afib_burden numeric NOT NULL DEFAULT 0,
  afib_max_duration integer NOT NULL DEFAULT 0,
  afib_max_hr integer NOT NULL DEFAULT 0,
  av_blocks_types text[] NOT NULL DEFAULT '{}',
  pauses_count integer NOT NULL DEFAULT 0,
  pauses_longest numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create symptom_log table
CREATE TABLE IF NOT EXISTS symptom_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  name text NOT NULL,
  severity text NOT NULL,
  time time NOT NULL,
  pathology text[] NOT NULL DEFAULT '{}',
  correlated_events text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_log ENABLE ROW LEVEL SECURITY;

-- Policies for daily_metrics
CREATE POLICY "Users can read own daily metrics"
  ON daily_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily metrics"
  ON daily_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily metrics"
  ON daily_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for symptom_log
CREATE POLICY "Users can read own symptoms"
  ON symptom_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptoms"
  ON symptom_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptoms"
  ON symptom_log
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_daily_metrics_updated_at
  BEFORE UPDATE ON daily_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_symptom_log_updated_at
  BEFORE UPDATE ON symptom_log
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();