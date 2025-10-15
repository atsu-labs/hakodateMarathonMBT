-- Create items table for demonstration
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO items (name) VALUES ('Sample Item 1');
INSERT INTO items (name) VALUES ('Sample Item 2');
INSERT INTO items (name) VALUES ('Sample Item 3');
