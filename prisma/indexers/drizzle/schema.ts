import { relations, sql } from 'drizzle-orm'
import { bigint, boolean, decimal, foreignKey, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const UserPointsType = pgEnum('UserPointsType', ['Early', 'Priority', 'Bonus', 'Referrer'])

export const deposits = pgTable('deposits', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	sender: text('sender').notNull(),
	owner: text('owner').notNull(),
	assets: text('assets').notNull(),
	shares: text('shares').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (deposits) => ({
	'deposits_block_number_tx_index_event_index_unique_idx': uniqueIndex('deposits_block_number_tx_index_event_index_key')
		.on(deposits.block_number, deposits.tx_index, deposits.event_index)
}));

export const deposits_with_referral = pgTable('deposits_with_referral', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	referrer: text('referrer').notNull(),
	referee: text('referee').notNull(),
	assets: text('assets').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (deposits_with_referral) => ({
	'deposits_with_referral_block_number_tx_index_event_index_unique_idx': uniqueIndex('deposits_with_referral_block_number_tx_index_event_index_key')
		.on(deposits_with_referral.block_number, deposits_with_referral.tx_index, deposits_with_referral.event_index)
}));

export const transfer = pgTable('transfer', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	txHash: text('txHash').notNull(),
	from: text('from').notNull(),
	to: text('to').notNull(),
	value: decimal('value', { precision: 65, scale: 30 }).notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (transfer) => ({
	'transfer_block_number_tx_index_event_index_unique_idx': uniqueIndex('transfer_block_number_tx_index_event_index_key')
		.on(transfer.block_number, transfer.tx_index, transfer.event_index)
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

export const received_funds = pgTable('received_funds', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	amount: text('amount').notNull(),
	sender: text('sender').notNull(),
	unprocessed: text('unprocessed').notNull(),
	intransit: text('intransit').notNull(),
	timestamp: integer('timestamp').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (received_funds) => ({
	'received_funds_block_number_tx_index_event_index_unique_idx': uniqueIndex('received_funds_block_number_tx_index_event_index_key')
		.on(received_funds.block_number, received_funds.tx_index, received_funds.event_index)
}));

export const dispatch_to_stake = pgTable('dispatch_to_stake', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	delegator: text('delegator').notNull(),
	amount: text('amount').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' }),
	timestamp: text('timestamp').notNull()
}, (dispatch_to_stake) => ({
	'dispatch_to_stake_block_number_tx_index_event_index_unique_idx': uniqueIndex('dispatch_to_stake_block_number_tx_index_event_index_key')
		.on(dispatch_to_stake.block_number, dispatch_to_stake.tx_index, dispatch_to_stake.event_index)
}));

export const dispatch_to_withdraw_queue = pgTable('dispatch_to_withdraw_queue', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	amount: text('amount').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (dispatch_to_withdraw_queue) => ({
	'dispatch_to_withdraw_queue_block_number_tx_index_event_index_unique_idx': uniqueIndex('dispatch_to_withdraw_queue_block_number_tx_index_event_index_key')
		.on(dispatch_to_withdraw_queue.block_number, dispatch_to_withdraw_queue.tx_index, dispatch_to_withdraw_queue.event_index)
}));

export const unstake_action = pgTable('unstake_action', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	amount: text('amount').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (unstake_action) => ({
	'unstake_action_block_number_tx_index_event_index_unique_idx': uniqueIndex('unstake_action_block_number_tx_index_event_index_key')
		.on(unstake_action.block_number, unstake_action.tx_index, unstake_action.event_index)
}));

export const unstake_intent_started = pgTable('unstake_intent_started', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	amount: text('amount').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (unstake_intent_started) => ({
	'unstake_intent_started_block_number_tx_index_event_index_unique_idx': uniqueIndex('unstake_intent_started_block_number_tx_index_event_index_key')
		.on(unstake_intent_started.block_number, unstake_intent_started.tx_index, unstake_intent_started.event_index)
}));

export const users = pgTable('users', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	tx_hash: text('tx_hash').notNull(),
	user_address: text('user_address').notNull().unique(),
	email: text('email'),
	timestamp: integer('timestamp').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
});

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

export const blocks = pgTable('blocks', {
	block_number: integer('block_number').notNull().unique(),
	timestamp: integer('timestamp').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
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

export const ekubo_positions = pgTable('ekubo_positions', {
	pool_fee: text('pool_fee').notNull(),
	pool_tick_spacing: text('pool_tick_spacing').notNull(),
	extension: text('extension').notNull(),
	position_id: text('position_id').notNull(),
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	txHash: text('txHash').notNull(),
	lower_bound: integer('lower_bound').notNull(),
	upper_bound: integer('upper_bound').notNull(),
	liquidity_delta: text('liquidity_delta').notNull(),
	amount0_delta: text('amount0_delta').notNull(),
	amount1_delta: text('amount1_delta').notNull(),
	created_at: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { precision: 3 }).notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (ekubo_positions) => ({
	'ekubo_positions_block_number_tx_index_event_index_unique_idx': uniqueIndex('ekubo_positions_block_number_tx_index_event_index_key')
		.on(ekubo_positions.block_number, ekubo_positions.tx_index, ekubo_positions.event_index)
}));

export const ekubo_nfts = pgTable('ekubo_nfts', {
	block_number: integer('block_number').notNull(),
	tx_index: integer('tx_index').notNull(),
	event_index: integer('event_index').notNull(),
	timestamp: integer('timestamp').notNull(),
	txHash: text('txHash').notNull(),
	from_address: text('from_address').notNull(),
	to_address: text('to_address').notNull(),
	nft_id: text('nft_id').notNull(),
	cursor: bigint('_cursor', { mode: 'bigint' })
}, (ekubo_nfts) => ({
	'ekubo_nfts_block_number_tx_index_event_index_unique_idx': uniqueIndex('ekubo_nfts_block_number_tx_index_event_index_key')
		.on(ekubo_nfts.block_number, ekubo_nfts.tx_index, ekubo_nfts.event_index)
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