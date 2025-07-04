-- FUNCTION: On insert into ekubo_nfts, update user_address in ekubo_positions
CREATE OR REPLACE FUNCTION update_user_address_from_nfts()
RETURNS TRIGGER AS $$
BEGIN

  -- Debug: Log the NEW record fields
  RAISE NOTICE 'NFT Transfer';
  RAISE NOTICE 'NFT Transfer - From: %, To: %, NFT ID: %', NEW["from"], NEW.to, NEW.nft_id;

  -- Try to update existing row
  UPDATE ekubo_positions
  SET user_address = NEW.to,
      updated_at = now()
  WHERE position_id = NEW.nft_id;

  -- If no row was updated, insert a dummy row
  IF NOT FOUND THEN
    INSERT INTO ekubo_positions (
      pool_fee,
      pool_tick_spacing,
      extension,
      position_id,
      user_address,
      block_number,
      tx_index,
      event_index,
      timestamp,
      "txHash",
      created_at,
      updated_at
    ) VALUES (
      'dummy_fee',
      'dummy_spacing',
      'dummy_ext',
      NEW.nft_id,
      NEW.to,
      NEW.block_number,
      NEW.tx_index,
      NEW.event_index,
      NEW.timestamp,
      NEW."txHash",
      now(),
      now()
    );
  END IF;

  -- Cancel insert into ekubo_nfts
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: After insert on ekubo_nfts
CREATE TRIGGER trg_update_user_address
BEFORE INSERT ON ekubo_nfts
FOR EACH ROW
EXECUTE FUNCTION update_user_address_from_nfts();

-- TRIGGER: After insert on ekubo_nfts
CREATE OR REPLACE VIEW ekubo_positions_view AS
SELECT * FROM ekubo_positions;

CREATE OR REPLACE FUNCTION upsert_ekubo_positions_view()
RETURNS TRIGGER AS $$
BEGIN
  RAISE NOTICE 'Inserting/upserting position: %, %, %, %',
  NEW.pool_fee, NEW.pool_tick_spacing, NEW.extension, NEW.position_id;
  
  INSERT INTO ekubo_positions (
    pool_fee, pool_tick_spacing, extension, position_id, user_address,
    block_number, tx_index, event_index, timestamp, "txHash", _cursor, created_at, updated_at
  )
  VALUES (
    NEW.pool_fee, NEW.pool_tick_spacing, NEW.extension, NEW.position_id, NEW.user_address,
    NEW.block_number, NEW.tx_index, NEW.event_index, NEW.timestamp, NEW."txHash", NEW._cursor, now(), now()
  )
  ON CONFLICT (pool_fee, pool_tick_spacing, extension, position_id)
  DO UPDATE SET
    user_address = EXCLUDED.user_address,
    block_number = EXCLUDED.block_number,
    tx_index = EXCLUDED.tx_index,
    event_index = EXCLUDED.event_index,
    timestamp = EXCLUDED.timestamp,
    "txHash" = EXCLUDED."txHash",
    updated_at = now(),
    _cursor = EXCLUDED._cursor;

  RETURN NULL;  -- Prevent insert into the view (which is virtual)
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_upsert_ekubo_positions_view
INSTEAD OF INSERT ON ekubo_positions_view
FOR EACH ROW
EXECUTE FUNCTION upsert_ekubo_positions_view();
