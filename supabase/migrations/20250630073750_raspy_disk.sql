/*
  # User Profiles Schema Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique, not null)
      - `travel_style` (text, constrained values)
      - `interests` (text array)
      - `preferred_language` (text)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for public viewing, user insert/update
    - Create trigger function for automatic profile creation

  3. Functions & Triggers
    - `handle_new_user()` function for auto-creating profiles
    - Trigger on auth.users insert to create profile
*/

-- Create the user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  travel_style text CHECK (travel_style = ANY (ARRAY['adventure', 'relaxed', 'family', 'luxury', 'budget'])),
  interests text[],
  preferred_language text
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
  DROP POLICY IF EXISTS "Users can read their own profile" ON public.user_profiles;
EXCEPTION
  WHEN undefined_object THEN
    -- Policies don't exist, continue
    NULL;
END $$;

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

CREATE POLICY "Users can read their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create or replace function to handle new user registration
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
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, skip creation
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION
  WHEN undefined_object THEN
    -- Trigger doesn't exist, continue
    NULL;
END $$;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();