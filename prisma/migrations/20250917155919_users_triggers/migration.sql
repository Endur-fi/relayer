-- Create function to handle transfer_events INSERT
CREATE OR REPLACE FUNCTION handle_transfer_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table if user doesn't exist
    -- Use ON CONFLICT to ignore if user already exists
    INSERT INTO users (
        block_number,
        tx_index,
        event_index,
        tx_hash,
        contract_address,
        user_address,
        timestamp,
        cursor
    ) VALUES (
        NEW.block_number,
        NEW.tx_index,
        NEW.event_index,
        NEW.txHash,
        NEW.contract_address,
        NEW.to,
        NEW.timestamp,
        NEW.cursor
    )
    ON CONFLICT (user_address, contract_address) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle transfer_events DELETE
CREATE OR REPLACE FUNCTION handle_transfer_delete()
RETURNS TRIGGER AS $$
DECLARE
    last_transfer_exists BOOLEAN;
BEGIN
    -- Check if there's another transfer event with the same to address and contract address
    SELECT EXISTS(
        SELECT 1 
        FROM transfer_events 
        WHERE "to" = OLD.to 
        AND contract_address = OLD.contract_address
        AND (block_number < OLD.block_number 
             OR (block_number = OLD.block_number AND tx_index < OLD.tx_index)
             OR (block_number = OLD.block_number AND tx_index = OLD.tx_index AND event_index < OLD.event_index))
    ) INTO last_transfer_exists;
    
    -- If no other transfer exists for this user+contract combination, delete the user record
    IF NOT last_transfer_exists THEN
        DELETE FROM users 
        WHERE user_address = OLD.to 
        AND contract_address = OLD.contract_address;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT on transfer_events
CREATE TRIGGER transfer_insert_trigger
    AFTER INSERT ON transfer_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_transfer_insert();

-- Create trigger for DELETE on transfer_events
CREATE TRIGGER transfer_delete_trigger
    AFTER DELETE ON transfer_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_transfer_delete();