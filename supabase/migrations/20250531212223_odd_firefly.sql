/*
  # User Profiles Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `travel_style` (text)
      - `interests` (text array)
      - `preferred_language` (text)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for:
      - Public read access
      - Users can insert their own profile
      - Users can update their own profile

  3. Triggers
    - Create function to handle new user registration
    - Create trigger to automatically create user profile on signup
*/

-- Create the user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  travel_style text CHECK (travel_style = ANY (ARRAY['adventure', 'relaxed', 'family', 'luxury', 'budget'])),
  interests text[],
  preferred_language text
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Set up Row Level Security policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    username,
    travel_style,
    interests,
    preferred_language
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'travel_style',
    array(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'interests')),
    NEW.raw_user_meta_data->>'preferred_language'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;