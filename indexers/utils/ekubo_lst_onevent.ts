import { useDrizzleStorage } from "@apibara/plugin-drizzle";
import { OnEvent } from "./config";
import { Block, Event } from "@apibara/starknet";
import { getNetwork, standariseAddress } from "../../src/common/utils";
import { num } from "starknet";
import { eventKey } from "./common_transform";
import { ContractAddr } from "@strkfarm/sdk";
import { getAddresses } from "../../src/common/constants";
import * as schema from "../drizzle/schema";

export const EKUBO_POSITIONS_NFT_CONTRACT = ContractAddr.from('0x07b696af58c967c1b14c9dde0ace001720635a660a8e90c565ea459345318b30');

export const onEventEkuboLPLst: OnEvent = async (event: Event, processedRecord: Record<string, any>, allEvents: readonly Event[], block: Block): Promise<Record<string, any> | null> => {
  const { db } = useDrizzleStorage();
  if (!allEvents.length) {
      throw new Error("Expected allEvents for ekubo_vault");
  }

  const token0 = ContractAddr.from(processedRecord['token0']);
  const token1 = ContractAddr.from(processedRecord['token1']);
  const isSupportedPool = getAddresses(getNetwork()).LSTs.some(lst => {
    const possibility1 = lst.LST.eq(token0) && lst.Asset.eq(token1);
    const possibility2 = lst.LST.eq(token1) && lst.Asset.eq(token0);
    return possibility1 || possibility2;
  });

  if (!isSupportedPool) {
    console.log("Skipping event for unsupported pool", processedRecord);
    return null;
  }

  // Select events before the current event
  // and sort them by eventIndexInTransaction in descending order
  const filteredEvents = allEvents
      .filter((e) => e.eventIndexInTransaction < event.eventIndexInTransaction)
      .sort((a, b) => b.eventIndexInTransaction - a.eventIndexInTransaction);

  // console.log("filteredEvents", filteredEvents);
  // First PositionUpdated event
  const positionUpdateEvent = filteredEvents.find((e) => {
    const matchEvent = standariseAddress(e.keys[0]) == standariseAddress(num.getDecimalString(eventKey("Transfer")));
    const matchContract = EKUBO_POSITIONS_NFT_CONTRACT.eqString(e.address);
    return matchEvent && matchContract;
  });

  if (positionUpdateEvent) {
    console.log(`Found NFT mint event for position ${processedRecord['position_id']}, tx: ${processedRecord['tx_hash']}, event_index: ${processedRecord['event_index']}`);
    // insert the position update event to the database
    // else foriegn key constraint will fail
    await db.insert(schema.ekubo_positions_events).values(processedRecord as any).execute();

    // save the event to the database
    const nftRecord = {
      // block, tx and event index are the same as the position update event
      block_number: processedRecord['block_number'],
      tx_index: processedRecord['tx_index'],
      event_index: processedRecord['event_index'],
      tx_hash: positionUpdateEvent.transactionHash,
      timestamp: processedRecord['timestamp'],
      from_address: standariseAddress(positionUpdateEvent.data[0]),
      to_address: standariseAddress(positionUpdateEvent.data[1]),
      nft_id: Number(positionUpdateEvent.data[2]),
      cursor: processedRecord['cursor'],
    }
    // console.log("nftRecord", nftRecord, positionUpdateEvent);
    await db.insert(schema.ekubo_nfts_events).values(nftRecord as any).execute();

    return null; // to avoid re-insert
  }
  
  return processedRecord;
}