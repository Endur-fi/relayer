-- Create function to handle blocks INSERT
CREATE OR REPLACE FUNCTION handle_blocks_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into blocks table if block doesn't exist
    -- Use ON CONFLICT to ignore if block already exists
    INSERT INTO blocks (
        block_number,
        timestamp,
        cursor
    ) VALUES (
        NEW.block_number,
        NEW.timestamp,
        NEW.cursor
    )
    ON CONFLICT (block_number) DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        cursor = EXCLUDED.cursor;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT on blocks
CREATE TRIGGER blocks_insert_trigger
    AFTER INSERT ON blocks
    FOR EACH ROW
    EXECUTE FUNCTION handle_blocks_insert();