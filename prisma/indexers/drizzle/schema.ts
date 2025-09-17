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
	'block_tx_event_idx': uniqueIndex('block_tx_event_idx')
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
	'ekubo_nfts_events_ekubo_positions_events_fkey': foreignKey({
		name: 'ekubo_nfts_events_ekubo_positions_events_fkey',
		columns: [ekubo_nfts_events.block_number, ekubo_nfts_events.tx_index, ekubo_nfts_events.event_index],
		foreignColumns: [ekubo_positions_events.block_number, ekubo_positions_events.tx_index, ekubo_positions_events.event_index]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ekubo_nfts_events_block_number_tx_index_event_index_unique_idx': uniqueIndex('ekubo_nfts_events_block_number_tx_index_event_index_key')
		.on(ekubo_nfts_events.block_number, ekubo_nfts_events.tx_index, ekubo_nfts_events.event_index)
}));

export const blocks = pgTable('blocks', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull().unique(),
	timestamp: integer('timestamp').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
});

export const withdraw_queue = pgTable('withdraw_queue', {
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
	is_rejected: boolean('is_rejected').notNull(),
	is_notified: boolean('is_notified').notNull(),
	timestamp: integer('timestamp').notNull()
}, (withdraw_queue) => ({
	'withdraw_queue_receiver_queue_contract_request_id_unique_idx': uniqueIndex('withdraw_queue_receiver_queue_contract_request_id_key')
		.on(withdraw_queue.receiver, withdraw_queue.queue_contract, withdraw_queue.request_id)
}));

export const users = pgTable('users', {
	id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	tx_hash: text('tx_hash').notNull(),
	contract_address: text('contract_address').notNull(),
	user_address: text('user_address').notNull(),
	email: text('email'),
	timestamp: integer('timestamp').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (users) => ({
	'users_user_address_contract_address_unique_idx': uniqueIndex('users_user_address_contract_address_key')
		.on(users.user_address, users.contract_address)
}));

export const user_balances = pgTable('user_balances', {
	block_number: integer('block_number').notNull(),
	user_address: text('user_address').notNull(),
	vesuAmount: text('vesuAmount').notNull(),
	ekuboAmount: text('ekuboAmount').notNull(),
	nostraLendingAmount: text('nostraLendingAmount').notNull(),
	nostraDexAmount: text('nostraDexAmount').notNull(),
	walletAmount: text('walletAmount').notNull(),
	strkfarmAmount: text('strkfarmAmount').notNull(),
	opusAmount: text('opusAmount').notNull().default("0"),
	total_amount: text('total_amount').notNull(),
	date: text('date').notNull(),
	timestamp: integer('timestamp').notNull()
}, (user_balances) => ({
	'user_balances_block_number_user_address_unique_idx': uniqueIndex('user_balances_block_number_user_address_key')
		.on(user_balances.block_number, user_balances.user_address)
}));

export const user_points = pgTable('user_points', {
	block_number: integer('block_number').notNull(),
	user_address: text('user_address').notNull(),
	points: decimal('points', { precision: 65, scale: 30 }).notNull(),
	type: UserPointsType('type').notNull(),
	remarks: text('remarks')
}, (user_points) => ({
	'id': uniqueIndex('id')
		.on(user_points.block_number, user_points.user_address, user_points.type)
}));

export const points_aggregated = pgTable('points_aggregated', {
	user_address: text('user_address').notNull().unique(),
	total_points: bigint('total_points', { mode: 'bigint' }).notNull(),
	block_number: integer('block_number').notNull(),
	timestamp: integer('timestamp').notNull(),
	created_on: timestamp('created_on', { precision: 3 }).notNull().defaultNow(),
	updated_on: timestamp('updated_on', { precision: 3 }).notNull()
}, (points_aggregated) => ({
	'points_aggregated_user_allocation_fkey': foreignKey({
		name: 'points_aggregated_user_allocation_fkey',
		columns: [points_aggregated.user_address],
		foreignColumns: [user_allocation.user_address]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const user_allocation = pgTable('user_allocation', {
	user_address: text('user_address').notNull().unique(),
	allocation: text('allocation').notNull(),
	proof: text('proof'),
	created_at: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { precision: 3 }).notNull()
});

export const price_info = pgTable('price_info', {
	block_number: integer('block_number').notNull().unique(),
	dex_price: decimal('dex_price', { precision: 65, scale: 30 }).notNull(),
	true_price: decimal('true_price', { precision: 65, scale: 30 }).notNull(),
	timestamp: integer('timestamp').notNull(),
	created_at: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { precision: 3 }).notNull()
});

export const dex_positions = pgTable('dex_positions', {
	pool_key: text('pool_key').notNull(),
	user_address: text('user_address').notNull(),
	strk_amount: text('strk_amount').notNull(),
	score: decimal('score', { precision: 65, scale: 30 }).notNull(),
	is_points_settled: boolean('is_points_settled').notNull(),
	additional_info: text('additional_info').notNull().default("{}"),
	block_number: integer('block_number').notNull(),
	timestamp: integer('timestamp').notNull()
}, (dex_positions) => ({
	'id': uniqueIndex('id')
		.on(dex_positions.user_address, dex_positions.pool_key, dex_positions.timestamp)
}));

export const ekubo_position_timeseries = pgTable('ekubo_position_timeseries', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	position_id: text('position_id').notNull(),
	pool_fee: text('pool_fee'),
	pool_tick_spacing: text('pool_tick_spacing'),
	extension: text('extension'),
	lower_bound: integer('lower_bound'),
	upper_bound: integer('upper_bound'),
	liquidity: text('liquidity'),
	amount0: text('amount0'),
	amount1: text('amount1'),
	owner_address: text('owner_address').notNull(),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	txHash: text('txHash').notNull(),
	record_type: text('record_type').notNull(),
	created_at: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { precision: 3 }).notNull()
});

export const ekubo_positions_eventsRelations = relations(ekubo_positions_events, ({ many }) => ({
	ekubo_nfts_events: many(ekubo_nfts_events, {
		relationName: 'ekubo_nfts_eventsToekubo_positions_events'
	})
}));

export const ekubo_nfts_eventsRelations = relations(ekubo_nfts_events, ({ one }) => ({
	ekubo_positions_events: one(ekubo_positions_events, {
		relationName: 'ekubo_nfts_eventsToekubo_positions_events',
		fields: [ekubo_nfts_events.block_number, ekubo_nfts_events.tx_index, ekubo_nfts_events.event_index],
		references: [ekubo_positions_events.block_number, ekubo_positions_events.tx_index, ekubo_positions_events.event_index]
	})
}));

export const points_aggregatedRelations = relations(points_aggregated, ({ one }) => ({
	user_allocation: one(user_allocation, {
		relationName: 'points_aggregatedTouser_allocation',
		fields: [points_aggregated.user_address],
		references: [user_allocation.user_address]
	})
}));

export const user_allocationRelations = relations(user_allocation, ({ many }) => ({
	points_aggregated: many(points_aggregated, {
		relationName: 'points_aggregatedTouser_allocation'
	})
}));