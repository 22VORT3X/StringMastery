/*
  # Add preview_url column to books table

  ## Summary
  Adds an optional `preview_url` column to the `books` table to store links to
  legal publisher previews, Google Books previews, or IMSLP pages where users
  can view sample pages of each book.

  ## Changes
  - `books` table: new nullable `preview_url text` column (defaults to NULL)

  ## Notes
  - No RLS changes needed — the column inherits the existing policies
  - NULL means no preview is available; the UI will hide the button in that case
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'preview_url'
  ) THEN
    ALTER TABLE books ADD COLUMN preview_url text DEFAULT NULL;
  END IF;
END $$;
