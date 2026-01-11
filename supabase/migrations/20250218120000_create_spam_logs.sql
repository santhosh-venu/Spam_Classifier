/*
  # Create Spam Logs Table

  ## Query Description:
  Creates a table to store spam classification logs.
  1. Creates table `spam_logs`
  2. Enables RLS
  3. Adds policies for public access (demo purposes)

  ## Metadata:
  - Schema-Category: "Safe"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - id: UUID (PK)
  - message_text: TEXT
  - label: VARCHAR
  - confidence: FLOAT
  - created_at: TIMESTAMP
*/

CREATE TABLE IF NOT EXISTS public.spam_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_text TEXT NOT NULL,
    label VARCHAR(50) NOT NULL,
    confidence FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.spam_logs ENABLE ROW LEVEL SECURITY;

-- Create Policy to allow anyone to insert logs (for the demo app)
CREATE POLICY "Allow public insert access" ON public.spam_logs
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create Policy to allow anyone to read logs (for history display)
CREATE POLICY "Allow public read access" ON public.spam_logs
    FOR SELECT TO anon
    USING (true);
