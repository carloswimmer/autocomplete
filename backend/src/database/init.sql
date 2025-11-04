-- Create the search_items table
CREATE TABLE IF NOT EXISTS search_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year INTEGER,
  type VARCHAR(50) NOT NULL CHECK (type IN ('film', 'television', 'video_game')),
  role TEXT,
  search_vector tsvector,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_search_title ON search_items USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_search_role ON search_items USING gin(to_tsvector('english', COALESCE(role, '')));
CREATE INDEX IF NOT EXISTS idx_search_vector ON search_items USING gin(search_vector);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_year ON search_items(year);
CREATE INDEX IF NOT EXISTS idx_type ON search_items(type);

-- Create a trigger function to automatically update search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.role, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search_vector on insert or update
DROP TRIGGER IF EXISTS search_vector_update ON search_items;
CREATE TRIGGER search_vector_update
BEFORE INSERT OR UPDATE ON search_items
FOR EACH ROW
EXECUTE FUNCTION update_search_vector();