/*
  # Message Feedback System

  1. New Tables
    - `message_feedback`
      - `id` (uuid, primary key)
      - `message_id` (text, not null)
      - `user_id` (text, not null)
      - `feedback_type` (text, not null)
      - `rating` (integer, optional 1-5)
      - `comment` (text, optional)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `message_feedback` table
    - Add policies for:
      - Users can insert their own feedback
      - Users can read their own feedback
      - Admin users can read all feedback

  3. Indexes
    - Index on message_id for quick lookups
    - Index on user_id for user-specific queries
    - Index on feedback_type for analytics
*/

-- Create the message_feedback table
CREATE TABLE IF NOT EXISTS public.message_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text NOT NULL,
  user_id text NOT NULL,
  feedback_type text NOT NULL CHECK (feedback_type IN ('helpful', 'not_helpful', 'inappropriate', 'inaccurate')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_feedback_message_id ON public.message_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_message_feedback_user_id ON public.message_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_message_feedback_type ON public.message_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_message_feedback_created_at ON public.message_feedback(created_at);

-- RLS Policies
CREATE POLICY "Users can insert their own feedback"
  ON public.message_feedback
  FOR INSERT
  WITH CHECK (true); -- Allow anyone to submit feedback

CREATE POLICY "Users can read their own feedback"
  ON public.message_feedback
  FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy for admin access (optional - for analytics)
CREATE POLICY "Service role can read all feedback"
  ON public.message_feedback
  FOR SELECT
  USING (auth.role() = 'service_role');