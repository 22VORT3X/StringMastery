/*
  # Create string instrument books library

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text) - Full book title
      - `author` (text) - Composer or author name
      - `instrument` (text) - violin, viola, cello, or bass
      - `book_type` (text) - scales, etudes, or both
      - `difficulty` (text) - beginner, intermediate, advanced, or all
      - `skills` (text[]) - Array of skill tags
      - `description` (text) - Brief description
      - `publisher` (text) - Publishing company
      - `volume` (text) - Volume/part number if applicable
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `books` table
    - Add public read policy (library data is public)
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  instrument text NOT NULL CHECK (instrument = ANY (ARRAY['violin','viola','cello','bass'])),
  book_type text NOT NULL CHECK (book_type = ANY (ARRAY['scales','etudes','both'])),
  difficulty text NOT NULL DEFAULT 'intermediate' CHECK (difficulty = ANY (ARRAY['beginner','intermediate','advanced','all'])),
  skills text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  publisher text NOT NULL DEFAULT '',
  volume text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  USING (true);
