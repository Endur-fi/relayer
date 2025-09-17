-- Create trigger function for withdraw_queue_events
CREATE OR REPLACE FUNCTION update_withdraw_queue_from_events()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT and UPDATE operations
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO withdraw_queue (
            tx_hash,
            queue_contract,
            amount,
            amount_lst,
            request_id,
            is_claimed,
            claim_time,
            receiver,
            caller,
            cumulative_requested_amount_snapshot,
            is_rejected,
            is_notified,
            timestamp
        ) VALUES (
            NEW.tx_hash,
            NEW.queue_contract,
            NEW.amount,
            NEW.amount_lst,
            NEW.request_id,
            NEW.is_claimed,
            NEW.claim_time,
            NEW.receiver,
            NEW.caller,
            NEW.cumulative_requested_amount_snapshot,
            false, -- is_rejected defaults to false on insert
            false, -- is_notified defaults to false on insert
            NEW.timestamp
        )
        ON CONFLICT (receiver, queue_contract, request_id) 
        DO UPDATE SET
            tx_hash = EXCLUDED.tx_hash,
            amount = EXCLUDED.amount,
            amount_lst = EXCLUDED.amount_lst,
            is_claimed = EXCLUDED.is_claimed,
            claim_time = EXCLUDED.claim_time,
            caller = EXCLUDED.caller,
            cumulative_requested_amount_snapshot = EXCLUDED.cumulative_requested_amount_snapshot,
            timestamp = EXCLUDED.timestamp;
            -- Note: is_rejected and is_notified are not updated to preserve external state
        
        RETURN NEW;
    END IF;
    
    -- Handle DELETE operations
    IF TG_OP = 'DELETE' THEN
        -- Find the most recent non-deleted event for the same receiver, queue_contract, request_id
        -- and update the withdraw_queue record with that data
        UPDATE withdraw_queue 
        SET 
            tx_hash = latest_event.tx_hash,
            amount = latest_event.amount,
            amount_lst = latest_event.amount_lst,
            is_claimed = latest_event.is_claimed,
            claim_time = latest_event.claim_time,
            caller = latest_event.caller,
            cumulative_requested_amount_snapshot = latest_event.cumulative_requested_amount_snapshot,
            timestamp = latest_event.timestamp
        FROM (
            SELECT 
                tx_hash,
                amount,
                amount_lst,
                is_claimed,
                claim_time,
                caller,
                cumulative_requested_amount_snapshot,
                timestamp
            FROM withdraw_queue_events 
            WHERE receiver = OLD.receiver 
                AND queue_contract = OLD.queue_contract 
                AND request_id = OLD.request_id
            ORDER BY timestamp DESC, block_number DESC, tx_index DESC, event_index DESC
            LIMIT 1
        ) AS latest_event
        WHERE withdraw_queue.receiver = OLD.receiver 
            AND withdraw_queue.queue_contract = OLD.queue_contract 
            AND withdraw_queue.request_id = OLD.request_id;
        
        -- If no more events exist for this combination, delete the withdraw_queue record
        DELETE FROM withdraw_queue 
        WHERE receiver = OLD.receiver 
            AND queue_contract = OLD.queue_contract 
            AND request_id = OLD.request_id
            AND NOT EXISTS (
                SELECT 1 FROM withdraw_queue_events 
                WHERE receiver = OLD.receiver 
                    AND queue_contract = OLD.queue_contract 
                    AND request_id = OLD.request_id
            );
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on withdraw_queue_events table
CREATE TRIGGER withdraw_queue_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON withdraw_queue_events
    FOR EACH ROW
    EXECUTE FUNCTION update_withdraw_queue_from_events();
