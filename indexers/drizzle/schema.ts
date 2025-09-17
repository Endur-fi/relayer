import { relations, sql } from 'drizzle-orm'
import { bigint, boolean, decimal, foreignKey, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const UserPointsType = pgEnum('UserPointsType', ['Early', 'Priority', 'Bonus', 'Referrer'])

export const deposits_with_referral_events = pgTable('deposits_with_referral_events', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	referrer: text('referrer').notNull(),
	referee: text('referee').notNull(),
	assets: text('assets').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (deposits_with_referral_events) => ({
	'deposits_with_referral_events_block_number_tx_index_event_index_unique_idx': uniqueIndex('deposits_with_referral_events_block_number_tx_index_event_index_key')
		.on(deposits_with_referral_events.block_number, deposits_with_referral_events.tx_index, deposits_with_referral_events.event_index)
}));

export const transfer_events = pgTable('transfer_events', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	txHash: text('txHash').notNull(),
	contract_address: text('contract_address').notNull(),
	from: text('from').notNull(),
	to: text('to').notNull(),
	value: decimal('value', { precision: 65, scale: 30 }).notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (transfer_events) => ({
	'transfer_events_block_number_tx_index_event_index_unique_idx': uniqueIndex('transfer_events_block_number_tx_index_event_index_key')
		.on(transfer_events.block_number, transfer_events.tx_index, transfer_events.event_index)
}));

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

export const ekubo_positions_events = pgTable('ekubo_positions_events', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	tx_hash: text('tx_hash').notNull(),
	timestamp: integer('timestamp').notNull(),
	contract_address: text('contract_address').notNull(),
	token0: text('token0').notNull(),
	token1: text('token1').notNull(),
	pool_fee: text('pool_fee').notNull(),
	pool_tick_spacing: text('pool_tick_spacing').notNull(),
	extension: text('extension').notNull(),
	position_id: text('position_id').notNull(),
	lower_bound: integer('lower_bound').notNull(),
	upper_bound: integer('upper_bound').notNull(),
	liquidity_delta: text('liquidity_delta').notNull(),
	amount0_delta: text('amount0_delta').notNull(),
	amount1_delta: text('amount1_delta').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (ekubo_positions_events) => ({
	'ekubo_positions_events_block_number_tx_index_event_index_unique_idx': uniqueIndex('ekubo_positions_events_block_number_tx_index_event_index_key')
		.on(ekubo_positions_events.block_number, ekubo_positions_events.tx_index, ekubo_positions_events.event_index)
}));

export const ekubo_nfts_events = pgTable('ekubo_nfts_events', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	tx_hash: text('tx_hash').notNull(),
	timestamp: integer('timestamp').notNull(),
	from_address: text('from_address').notNull(),
	to_address: text('to_address').notNull(),
	nft_id: text('nft_id').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (ekubo_nfts_events) => ({
	'ekubo_nfts_events_block_number_tx_index_event_index_unique_idx': uniqueIndex('ekubo_nfts_events_block_number_tx_index_event_index_key')
		.on(ekubo_nfts_events.block_number, ekubo_nfts_events.tx_index, ekubo_nfts_events.event_index)
}));

export const blocks = pgTable('blocks', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull().unique(),
	timestamp: integer('timestamp').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
});
