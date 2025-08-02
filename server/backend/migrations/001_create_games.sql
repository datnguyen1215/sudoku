-- Create games table
CREATE TABLE IF NOT EXISTS games (
    session_id VARCHAR(50) PRIMARY KEY,
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    puzzle_grid JSONB NOT NULL,
    current_grid JSONB NOT NULL,
    solution_grid JSONB NOT NULL,
    time_elapsed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at BEFORE UPDATE
    ON games FOR EACH ROW EXECUTE PROCEDURE 
    update_updated_at_column();