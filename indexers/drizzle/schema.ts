import { relations, sql } from 'drizzle-orm'
import { bigint, boolean, decimal, foreignKey, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const withdraw_queue_events = pgTable('withdraw_queue_events', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	tx_hash: text('tx_hash').notNull(),
	queue_contract: text('queue_contract').notNull(),
	amount: text('amount').notNull(),
	amount_lst: text('amount_lst').notNull(),
	request_id: bigint('request_id', { mode: 'bigint' }).notNull(),
	is_claimed: boolean('is_claimed').notNull(),
	claim_time: integer('claim_time').notNull(),
	receiver: text('receiver').notNull(),
	caller: text('caller').notNull(),
	cumulative_requested_amount_snapshot: text('cumulative_requested_amount_snapshot').notNull(),
	timestamp: integer('timestamp').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (withdraw_queue_events) => ({
	'withdraw_queue_events_block_number_tx_index_event_index_unique_idx': uniqueIndex('withdraw_queue_events_block_number_tx_index_event_index_key')
		.on(withdraw_queue_events.block_number, withdraw_queue_events.tx_index, withdraw_queue_events.event_index)
}));
