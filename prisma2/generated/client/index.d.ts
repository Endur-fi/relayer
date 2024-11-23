
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model deposits
 * 
 */
export type deposits = $Result.DefaultSelection<Prisma.$depositsPayload>
/**
 * Model withdraw_queue
 * 
 */
export type withdraw_queue = $Result.DefaultSelection<Prisma.$withdraw_queuePayload>
/**
 * Model received_funds
 * 
 */
export type received_funds = $Result.DefaultSelection<Prisma.$received_fundsPayload>
/**
 * Model dispatch_to_stake
 * 
 */
export type dispatch_to_stake = $Result.DefaultSelection<Prisma.$dispatch_to_stakePayload>
/**
 * Model dispatch_to_withdraw_queue
 * 
 */
export type dispatch_to_withdraw_queue = $Result.DefaultSelection<Prisma.$dispatch_to_withdraw_queuePayload>
/**
 * Model unstake_action
 * 
 */
export type unstake_action = $Result.DefaultSelection<Prisma.$unstake_actionPayload>
/**
 * Model unstake_intent_started
 * 
 */
export type unstake_intent_started = $Result.DefaultSelection<Prisma.$unstake_intent_startedPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Deposits
 * const deposits = await prisma.deposits.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Deposits
   * const deposits = await prisma.deposits.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.deposits`: Exposes CRUD operations for the **deposits** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Deposits
    * const deposits = await prisma.deposits.findMany()
    * ```
    */
  get deposits(): Prisma.depositsDelegate<ExtArgs>;

  /**
   * `prisma.withdraw_queue`: Exposes CRUD operations for the **withdraw_queue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Withdraw_queues
    * const withdraw_queues = await prisma.withdraw_queue.findMany()
    * ```
    */
  get withdraw_queue(): Prisma.withdraw_queueDelegate<ExtArgs>;

  /**
   * `prisma.received_funds`: Exposes CRUD operations for the **received_funds** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Received_funds
    * const received_funds = await prisma.received_funds.findMany()
    * ```
    */
  get received_funds(): Prisma.received_fundsDelegate<ExtArgs>;

  /**
   * `prisma.dispatch_to_stake`: Exposes CRUD operations for the **dispatch_to_stake** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dispatch_to_stakes
    * const dispatch_to_stakes = await prisma.dispatch_to_stake.findMany()
    * ```
    */
  get dispatch_to_stake(): Prisma.dispatch_to_stakeDelegate<ExtArgs>;

  /**
   * `prisma.dispatch_to_withdraw_queue`: Exposes CRUD operations for the **dispatch_to_withdraw_queue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dispatch_to_withdraw_queues
    * const dispatch_to_withdraw_queues = await prisma.dispatch_to_withdraw_queue.findMany()
    * ```
    */
  get dispatch_to_withdraw_queue(): Prisma.dispatch_to_withdraw_queueDelegate<ExtArgs>;

  /**
   * `prisma.unstake_action`: Exposes CRUD operations for the **unstake_action** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Unstake_actions
    * const unstake_actions = await prisma.unstake_action.findMany()
    * ```
    */
  get unstake_action(): Prisma.unstake_actionDelegate<ExtArgs>;

  /**
   * `prisma.unstake_intent_started`: Exposes CRUD operations for the **unstake_intent_started** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Unstake_intent_starteds
    * const unstake_intent_starteds = await prisma.unstake_intent_started.findMany()
    * ```
    */
  get unstake_intent_started(): Prisma.unstake_intent_startedDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    deposits: 'deposits',
    withdraw_queue: 'withdraw_queue',
    received_funds: 'received_funds',
    dispatch_to_stake: 'dispatch_to_stake',
    dispatch_to_withdraw_queue: 'dispatch_to_withdraw_queue',
    unstake_action: 'unstake_action',
    unstake_intent_started: 'unstake_intent_started'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "deposits" | "withdraw_queue" | "received_funds" | "dispatch_to_stake" | "dispatch_to_withdraw_queue" | "unstake_action" | "unstake_intent_started"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      deposits: {
        payload: Prisma.$depositsPayload<ExtArgs>
        fields: Prisma.depositsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.depositsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.depositsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>
          }
          findFirst: {
            args: Prisma.depositsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.depositsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>
          }
          findMany: {
            args: Prisma.depositsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>[]
          }
          create: {
            args: Prisma.depositsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>
          }
          createMany: {
            args: Prisma.depositsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.depositsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>[]
          }
          delete: {
            args: Prisma.depositsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>
          }
          update: {
            args: Prisma.depositsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>
          }
          deleteMany: {
            args: Prisma.depositsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.depositsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.depositsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$depositsPayload>
          }
          aggregate: {
            args: Prisma.DepositsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeposits>
          }
          groupBy: {
            args: Prisma.depositsGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepositsGroupByOutputType>[]
          }
          count: {
            args: Prisma.depositsCountArgs<ExtArgs>
            result: $Utils.Optional<DepositsCountAggregateOutputType> | number
          }
        }
      }
      withdraw_queue: {
        payload: Prisma.$withdraw_queuePayload<ExtArgs>
        fields: Prisma.withdraw_queueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.withdraw_queueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.withdraw_queueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>
          }
          findFirst: {
            args: Prisma.withdraw_queueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.withdraw_queueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>
          }
          findMany: {
            args: Prisma.withdraw_queueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>[]
          }
          create: {
            args: Prisma.withdraw_queueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>
          }
          createMany: {
            args: Prisma.withdraw_queueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.withdraw_queueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>[]
          }
          delete: {
            args: Prisma.withdraw_queueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>
          }
          update: {
            args: Prisma.withdraw_queueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>
          }
          deleteMany: {
            args: Prisma.withdraw_queueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.withdraw_queueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.withdraw_queueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$withdraw_queuePayload>
          }
          aggregate: {
            args: Prisma.Withdraw_queueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWithdraw_queue>
          }
          groupBy: {
            args: Prisma.withdraw_queueGroupByArgs<ExtArgs>
            result: $Utils.Optional<Withdraw_queueGroupByOutputType>[]
          }
          count: {
            args: Prisma.withdraw_queueCountArgs<ExtArgs>
            result: $Utils.Optional<Withdraw_queueCountAggregateOutputType> | number
          }
        }
      }
      received_funds: {
        payload: Prisma.$received_fundsPayload<ExtArgs>
        fields: Prisma.received_fundsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.received_fundsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.received_fundsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>
          }
          findFirst: {
            args: Prisma.received_fundsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.received_fundsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>
          }
          findMany: {
            args: Prisma.received_fundsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>[]
          }
          create: {
            args: Prisma.received_fundsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>
          }
          createMany: {
            args: Prisma.received_fundsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.received_fundsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>[]
          }
          delete: {
            args: Prisma.received_fundsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>
          }
          update: {
            args: Prisma.received_fundsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>
          }
          deleteMany: {
            args: Prisma.received_fundsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.received_fundsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.received_fundsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$received_fundsPayload>
          }
          aggregate: {
            args: Prisma.Received_fundsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReceived_funds>
          }
          groupBy: {
            args: Prisma.received_fundsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Received_fundsGroupByOutputType>[]
          }
          count: {
            args: Prisma.received_fundsCountArgs<ExtArgs>
            result: $Utils.Optional<Received_fundsCountAggregateOutputType> | number
          }
        }
      }
      dispatch_to_stake: {
        payload: Prisma.$dispatch_to_stakePayload<ExtArgs>
        fields: Prisma.dispatch_to_stakeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.dispatch_to_stakeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.dispatch_to_stakeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>
          }
          findFirst: {
            args: Prisma.dispatch_to_stakeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.dispatch_to_stakeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>
          }
          findMany: {
            args: Prisma.dispatch_to_stakeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>[]
          }
          create: {
            args: Prisma.dispatch_to_stakeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>
          }
          createMany: {
            args: Prisma.dispatch_to_stakeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.dispatch_to_stakeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>[]
          }
          delete: {
            args: Prisma.dispatch_to_stakeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>
          }
          update: {
            args: Prisma.dispatch_to_stakeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>
          }
          deleteMany: {
            args: Prisma.dispatch_to_stakeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.dispatch_to_stakeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.dispatch_to_stakeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_stakePayload>
          }
          aggregate: {
            args: Prisma.Dispatch_to_stakeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDispatch_to_stake>
          }
          groupBy: {
            args: Prisma.dispatch_to_stakeGroupByArgs<ExtArgs>
            result: $Utils.Optional<Dispatch_to_stakeGroupByOutputType>[]
          }
          count: {
            args: Prisma.dispatch_to_stakeCountArgs<ExtArgs>
            result: $Utils.Optional<Dispatch_to_stakeCountAggregateOutputType> | number
          }
        }
      }
      dispatch_to_withdraw_queue: {
        payload: Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>
        fields: Prisma.dispatch_to_withdraw_queueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.dispatch_to_withdraw_queueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.dispatch_to_withdraw_queueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>
          }
          findFirst: {
            args: Prisma.dispatch_to_withdraw_queueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.dispatch_to_withdraw_queueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>
          }
          findMany: {
            args: Prisma.dispatch_to_withdraw_queueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>[]
          }
          create: {
            args: Prisma.dispatch_to_withdraw_queueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>
          }
          createMany: {
            args: Prisma.dispatch_to_withdraw_queueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.dispatch_to_withdraw_queueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>[]
          }
          delete: {
            args: Prisma.dispatch_to_withdraw_queueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>
          }
          update: {
            args: Prisma.dispatch_to_withdraw_queueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>
          }
          deleteMany: {
            args: Prisma.dispatch_to_withdraw_queueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.dispatch_to_withdraw_queueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.dispatch_to_withdraw_queueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dispatch_to_withdraw_queuePayload>
          }
          aggregate: {
            args: Prisma.Dispatch_to_withdraw_queueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDispatch_to_withdraw_queue>
          }
          groupBy: {
            args: Prisma.dispatch_to_withdraw_queueGroupByArgs<ExtArgs>
            result: $Utils.Optional<Dispatch_to_withdraw_queueGroupByOutputType>[]
          }
          count: {
            args: Prisma.dispatch_to_withdraw_queueCountArgs<ExtArgs>
            result: $Utils.Optional<Dispatch_to_withdraw_queueCountAggregateOutputType> | number
          }
        }
      }
      unstake_action: {
        payload: Prisma.$unstake_actionPayload<ExtArgs>
        fields: Prisma.unstake_actionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.unstake_actionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.unstake_actionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>
          }
          findFirst: {
            args: Prisma.unstake_actionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.unstake_actionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>
          }
          findMany: {
            args: Prisma.unstake_actionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>[]
          }
          create: {
            args: Prisma.unstake_actionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>
          }
          createMany: {
            args: Prisma.unstake_actionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.unstake_actionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>[]
          }
          delete: {
            args: Prisma.unstake_actionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>
          }
          update: {
            args: Prisma.unstake_actionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>
          }
          deleteMany: {
            args: Prisma.unstake_actionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.unstake_actionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.unstake_actionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_actionPayload>
          }
          aggregate: {
            args: Prisma.Unstake_actionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnstake_action>
          }
          groupBy: {
            args: Prisma.unstake_actionGroupByArgs<ExtArgs>
            result: $Utils.Optional<Unstake_actionGroupByOutputType>[]
          }
          count: {
            args: Prisma.unstake_actionCountArgs<ExtArgs>
            result: $Utils.Optional<Unstake_actionCountAggregateOutputType> | number
          }
        }
      }
      unstake_intent_started: {
        payload: Prisma.$unstake_intent_startedPayload<ExtArgs>
        fields: Prisma.unstake_intent_startedFieldRefs
        operations: {
          findUnique: {
            args: Prisma.unstake_intent_startedFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.unstake_intent_startedFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>
          }
          findFirst: {
            args: Prisma.unstake_intent_startedFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.unstake_intent_startedFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>
          }
          findMany: {
            args: Prisma.unstake_intent_startedFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>[]
          }
          create: {
            args: Prisma.unstake_intent_startedCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>
          }
          createMany: {
            args: Prisma.unstake_intent_startedCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.unstake_intent_startedCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>[]
          }
          delete: {
            args: Prisma.unstake_intent_startedDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>
          }
          update: {
            args: Prisma.unstake_intent_startedUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>
          }
          deleteMany: {
            args: Prisma.unstake_intent_startedDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.unstake_intent_startedUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.unstake_intent_startedUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unstake_intent_startedPayload>
          }
          aggregate: {
            args: Prisma.Unstake_intent_startedAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnstake_intent_started>
          }
          groupBy: {
            args: Prisma.unstake_intent_startedGroupByArgs<ExtArgs>
            result: $Utils.Optional<Unstake_intent_startedGroupByOutputType>[]
          }
          count: {
            args: Prisma.unstake_intent_startedCountArgs<ExtArgs>
            result: $Utils.Optional<Unstake_intent_startedCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model deposits
   */

  export type AggregateDeposits = {
    _count: DepositsCountAggregateOutputType | null
    _avg: DepositsAvgAggregateOutputType | null
    _sum: DepositsSumAggregateOutputType | null
    _min: DepositsMinAggregateOutputType | null
    _max: DepositsMaxAggregateOutputType | null
  }

  export type DepositsAvgAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    timestamp: number | null
    cursor: number | null
  }

  export type DepositsSumAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    timestamp: number | null
    cursor: bigint | null
  }

  export type DepositsMinAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    timestamp: number | null
    sender: string | null
    owner: string | null
    assets: string | null
    shares: string | null
    cursor: bigint | null
  }

  export type DepositsMaxAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    timestamp: number | null
    sender: string | null
    owner: string | null
    assets: string | null
    shares: string | null
    cursor: bigint | null
  }

  export type DepositsCountAggregateOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    timestamp: number
    sender: number
    owner: number
    assets: number
    shares: number
    cursor: number
    _all: number
  }


  export type DepositsAvgAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    timestamp?: true
    cursor?: true
  }

  export type DepositsSumAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    timestamp?: true
    cursor?: true
  }

  export type DepositsMinAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    timestamp?: true
    sender?: true
    owner?: true
    assets?: true
    shares?: true
    cursor?: true
  }

  export type DepositsMaxAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    timestamp?: true
    sender?: true
    owner?: true
    assets?: true
    shares?: true
    cursor?: true
  }

  export type DepositsCountAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    timestamp?: true
    sender?: true
    owner?: true
    assets?: true
    shares?: true
    cursor?: true
    _all?: true
  }

  export type DepositsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which deposits to aggregate.
     */
    where?: depositsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of deposits to fetch.
     */
    orderBy?: depositsOrderByWithRelationInput | depositsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: depositsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` deposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned deposits
    **/
    _count?: true | DepositsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepositsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepositsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepositsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepositsMaxAggregateInputType
  }

  export type GetDepositsAggregateType<T extends DepositsAggregateArgs> = {
        [P in keyof T & keyof AggregateDeposits]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeposits[P]>
      : GetScalarType<T[P], AggregateDeposits[P]>
  }




  export type depositsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: depositsWhereInput
    orderBy?: depositsOrderByWithAggregationInput | depositsOrderByWithAggregationInput[]
    by: DepositsScalarFieldEnum[] | DepositsScalarFieldEnum
    having?: depositsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepositsCountAggregateInputType | true
    _avg?: DepositsAvgAggregateInputType
    _sum?: DepositsSumAggregateInputType
    _min?: DepositsMinAggregateInputType
    _max?: DepositsMaxAggregateInputType
  }

  export type DepositsGroupByOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    timestamp: number
    sender: string
    owner: string
    assets: string
    shares: string
    cursor: bigint | null
    _count: DepositsCountAggregateOutputType | null
    _avg: DepositsAvgAggregateOutputType | null
    _sum: DepositsSumAggregateOutputType | null
    _min: DepositsMinAggregateOutputType | null
    _max: DepositsMaxAggregateOutputType | null
  }

  type GetDepositsGroupByPayload<T extends depositsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepositsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepositsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepositsGroupByOutputType[P]>
            : GetScalarType<T[P], DepositsGroupByOutputType[P]>
        }
      >
    >


  export type depositsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    timestamp?: boolean
    sender?: boolean
    owner?: boolean
    assets?: boolean
    shares?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["deposits"]>

  export type depositsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    timestamp?: boolean
    sender?: boolean
    owner?: boolean
    assets?: boolean
    shares?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["deposits"]>

  export type depositsSelectScalar = {
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    timestamp?: boolean
    sender?: boolean
    owner?: boolean
    assets?: boolean
    shares?: boolean
    cursor?: boolean
  }


  export type $depositsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "deposits"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      block_number: number
      tx_index: number
      event_index: number
      timestamp: number
      sender: string
      owner: string
      assets: string
      shares: string
      cursor: bigint | null
    }, ExtArgs["result"]["deposits"]>
    composites: {}
  }

  type depositsGetPayload<S extends boolean | null | undefined | depositsDefaultArgs> = $Result.GetResult<Prisma.$depositsPayload, S>

  type depositsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<depositsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DepositsCountAggregateInputType | true
    }

  export interface depositsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['deposits'], meta: { name: 'deposits' } }
    /**
     * Find zero or one Deposits that matches the filter.
     * @param {depositsFindUniqueArgs} args - Arguments to find a Deposits
     * @example
     * // Get one Deposits
     * const deposits = await prisma.deposits.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends depositsFindUniqueArgs>(args: SelectSubset<T, depositsFindUniqueArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Deposits that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {depositsFindUniqueOrThrowArgs} args - Arguments to find a Deposits
     * @example
     * // Get one Deposits
     * const deposits = await prisma.deposits.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends depositsFindUniqueOrThrowArgs>(args: SelectSubset<T, depositsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Deposits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {depositsFindFirstArgs} args - Arguments to find a Deposits
     * @example
     * // Get one Deposits
     * const deposits = await prisma.deposits.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends depositsFindFirstArgs>(args?: SelectSubset<T, depositsFindFirstArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Deposits that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {depositsFindFirstOrThrowArgs} args - Arguments to find a Deposits
     * @example
     * // Get one Deposits
     * const deposits = await prisma.deposits.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends depositsFindFirstOrThrowArgs>(args?: SelectSubset<T, depositsFindFirstOrThrowArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Deposits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {depositsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Deposits
     * const deposits = await prisma.deposits.findMany()
     * 
     * // Get first 10 Deposits
     * const deposits = await prisma.deposits.findMany({ take: 10 })
     * 
     * // Only select the `block_number`
     * const depositsWithBlock_numberOnly = await prisma.deposits.findMany({ select: { block_number: true } })
     * 
     */
    findMany<T extends depositsFindManyArgs>(args?: SelectSubset<T, depositsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Deposits.
     * @param {depositsCreateArgs} args - Arguments to create a Deposits.
     * @example
     * // Create one Deposits
     * const Deposits = await prisma.deposits.create({
     *   data: {
     *     // ... data to create a Deposits
     *   }
     * })
     * 
     */
    create<T extends depositsCreateArgs>(args: SelectSubset<T, depositsCreateArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Deposits.
     * @param {depositsCreateManyArgs} args - Arguments to create many Deposits.
     * @example
     * // Create many Deposits
     * const deposits = await prisma.deposits.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends depositsCreateManyArgs>(args?: SelectSubset<T, depositsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Deposits and returns the data saved in the database.
     * @param {depositsCreateManyAndReturnArgs} args - Arguments to create many Deposits.
     * @example
     * // Create many Deposits
     * const deposits = await prisma.deposits.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Deposits and only return the `block_number`
     * const depositsWithBlock_numberOnly = await prisma.deposits.createManyAndReturn({ 
     *   select: { block_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends depositsCreateManyAndReturnArgs>(args?: SelectSubset<T, depositsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Deposits.
     * @param {depositsDeleteArgs} args - Arguments to delete one Deposits.
     * @example
     * // Delete one Deposits
     * const Deposits = await prisma.deposits.delete({
     *   where: {
     *     // ... filter to delete one Deposits
     *   }
     * })
     * 
     */
    delete<T extends depositsDeleteArgs>(args: SelectSubset<T, depositsDeleteArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Deposits.
     * @param {depositsUpdateArgs} args - Arguments to update one Deposits.
     * @example
     * // Update one Deposits
     * const deposits = await prisma.deposits.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends depositsUpdateArgs>(args: SelectSubset<T, depositsUpdateArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Deposits.
     * @param {depositsDeleteManyArgs} args - Arguments to filter Deposits to delete.
     * @example
     * // Delete a few Deposits
     * const { count } = await prisma.deposits.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends depositsDeleteManyArgs>(args?: SelectSubset<T, depositsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {depositsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Deposits
     * const deposits = await prisma.deposits.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends depositsUpdateManyArgs>(args: SelectSubset<T, depositsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Deposits.
     * @param {depositsUpsertArgs} args - Arguments to update or create a Deposits.
     * @example
     * // Update or create a Deposits
     * const deposits = await prisma.deposits.upsert({
     *   create: {
     *     // ... data to create a Deposits
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deposits we want to update
     *   }
     * })
     */
    upsert<T extends depositsUpsertArgs>(args: SelectSubset<T, depositsUpsertArgs<ExtArgs>>): Prisma__depositsClient<$Result.GetResult<Prisma.$depositsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Deposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {depositsCountArgs} args - Arguments to filter Deposits to count.
     * @example
     * // Count the number of Deposits
     * const count = await prisma.deposits.count({
     *   where: {
     *     // ... the filter for the Deposits we want to count
     *   }
     * })
    **/
    count<T extends depositsCountArgs>(
      args?: Subset<T, depositsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepositsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Deposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepositsAggregateArgs>(args: Subset<T, DepositsAggregateArgs>): Prisma.PrismaPromise<GetDepositsAggregateType<T>>

    /**
     * Group by Deposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {depositsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends depositsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: depositsGroupByArgs['orderBy'] }
        : { orderBy?: depositsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, depositsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepositsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the deposits model
   */
  readonly fields: depositsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for deposits.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__depositsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the deposits model
   */ 
  interface depositsFieldRefs {
    readonly block_number: FieldRef<"deposits", 'Int'>
    readonly tx_index: FieldRef<"deposits", 'Int'>
    readonly event_index: FieldRef<"deposits", 'Int'>
    readonly timestamp: FieldRef<"deposits", 'Int'>
    readonly sender: FieldRef<"deposits", 'String'>
    readonly owner: FieldRef<"deposits", 'String'>
    readonly assets: FieldRef<"deposits", 'String'>
    readonly shares: FieldRef<"deposits", 'String'>
    readonly cursor: FieldRef<"deposits", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * deposits findUnique
   */
  export type depositsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * Filter, which deposits to fetch.
     */
    where: depositsWhereUniqueInput
  }

  /**
   * deposits findUniqueOrThrow
   */
  export type depositsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * Filter, which deposits to fetch.
     */
    where: depositsWhereUniqueInput
  }

  /**
   * deposits findFirst
   */
  export type depositsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * Filter, which deposits to fetch.
     */
    where?: depositsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of deposits to fetch.
     */
    orderBy?: depositsOrderByWithRelationInput | depositsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for deposits.
     */
    cursor?: depositsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` deposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of deposits.
     */
    distinct?: DepositsScalarFieldEnum | DepositsScalarFieldEnum[]
  }

  /**
   * deposits findFirstOrThrow
   */
  export type depositsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * Filter, which deposits to fetch.
     */
    where?: depositsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of deposits to fetch.
     */
    orderBy?: depositsOrderByWithRelationInput | depositsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for deposits.
     */
    cursor?: depositsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` deposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of deposits.
     */
    distinct?: DepositsScalarFieldEnum | DepositsScalarFieldEnum[]
  }

  /**
   * deposits findMany
   */
  export type depositsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * Filter, which deposits to fetch.
     */
    where?: depositsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of deposits to fetch.
     */
    orderBy?: depositsOrderByWithRelationInput | depositsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing deposits.
     */
    cursor?: depositsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` deposits.
     */
    skip?: number
    distinct?: DepositsScalarFieldEnum | DepositsScalarFieldEnum[]
  }

  /**
   * deposits create
   */
  export type depositsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * The data needed to create a deposits.
     */
    data: XOR<depositsCreateInput, depositsUncheckedCreateInput>
  }

  /**
   * deposits createMany
   */
  export type depositsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many deposits.
     */
    data: depositsCreateManyInput | depositsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * deposits createManyAndReturn
   */
  export type depositsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many deposits.
     */
    data: depositsCreateManyInput | depositsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * deposits update
   */
  export type depositsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * The data needed to update a deposits.
     */
    data: XOR<depositsUpdateInput, depositsUncheckedUpdateInput>
    /**
     * Choose, which deposits to update.
     */
    where: depositsWhereUniqueInput
  }

  /**
   * deposits updateMany
   */
  export type depositsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update deposits.
     */
    data: XOR<depositsUpdateManyMutationInput, depositsUncheckedUpdateManyInput>
    /**
     * Filter which deposits to update
     */
    where?: depositsWhereInput
  }

  /**
   * deposits upsert
   */
  export type depositsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * The filter to search for the deposits to update in case it exists.
     */
    where: depositsWhereUniqueInput
    /**
     * In case the deposits found by the `where` argument doesn't exist, create a new deposits with this data.
     */
    create: XOR<depositsCreateInput, depositsUncheckedCreateInput>
    /**
     * In case the deposits was found with the provided `where` argument, update it with this data.
     */
    update: XOR<depositsUpdateInput, depositsUncheckedUpdateInput>
  }

  /**
   * deposits delete
   */
  export type depositsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
    /**
     * Filter which deposits to delete.
     */
    where: depositsWhereUniqueInput
  }

  /**
   * deposits deleteMany
   */
  export type depositsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which deposits to delete
     */
    where?: depositsWhereInput
  }

  /**
   * deposits without action
   */
  export type depositsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the deposits
     */
    select?: depositsSelect<ExtArgs> | null
  }


  /**
   * Model withdraw_queue
   */

  export type AggregateWithdraw_queue = {
    _count: Withdraw_queueCountAggregateOutputType | null
    _avg: Withdraw_queueAvgAggregateOutputType | null
    _sum: Withdraw_queueSumAggregateOutputType | null
    _min: Withdraw_queueMinAggregateOutputType | null
    _max: Withdraw_queueMaxAggregateOutputType | null
  }

  export type Withdraw_queueAvgAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    request_id: number | null
    claim_time: number | null
    timestamp: number | null
    cursor: number | null
  }

  export type Withdraw_queueSumAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    request_id: bigint | null
    claim_time: number | null
    timestamp: number | null
    cursor: bigint | null
  }

  export type Withdraw_queueMinAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    tx_hash: string | null
    caller: string | null
    amount_strk: string | null
    amount_kstrk: string | null
    request_id: bigint | null
    is_claimed: boolean | null
    claim_time: number | null
    receiver: string | null
    is_rejected: boolean | null
    timestamp: number | null
    cursor: bigint | null
  }

  export type Withdraw_queueMaxAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    tx_hash: string | null
    caller: string | null
    amount_strk: string | null
    amount_kstrk: string | null
    request_id: bigint | null
    is_claimed: boolean | null
    claim_time: number | null
    receiver: string | null
    is_rejected: boolean | null
    timestamp: number | null
    cursor: bigint | null
  }

  export type Withdraw_queueCountAggregateOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    tx_hash: number
    caller: number
    amount_strk: number
    amount_kstrk: number
    request_id: number
    is_claimed: number
    claim_time: number
    receiver: number
    is_rejected: number
    timestamp: number
    cursor: number
    _all: number
  }


  export type Withdraw_queueAvgAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    request_id?: true
    claim_time?: true
    timestamp?: true
    cursor?: true
  }

  export type Withdraw_queueSumAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    request_id?: true
    claim_time?: true
    timestamp?: true
    cursor?: true
  }

  export type Withdraw_queueMinAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    tx_hash?: true
    caller?: true
    amount_strk?: true
    amount_kstrk?: true
    request_id?: true
    is_claimed?: true
    claim_time?: true
    receiver?: true
    is_rejected?: true
    timestamp?: true
    cursor?: true
  }

  export type Withdraw_queueMaxAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    tx_hash?: true
    caller?: true
    amount_strk?: true
    amount_kstrk?: true
    request_id?: true
    is_claimed?: true
    claim_time?: true
    receiver?: true
    is_rejected?: true
    timestamp?: true
    cursor?: true
  }

  export type Withdraw_queueCountAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    tx_hash?: true
    caller?: true
    amount_strk?: true
    amount_kstrk?: true
    request_id?: true
    is_claimed?: true
    claim_time?: true
    receiver?: true
    is_rejected?: true
    timestamp?: true
    cursor?: true
    _all?: true
  }

  export type Withdraw_queueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which withdraw_queue to aggregate.
     */
    where?: withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of withdraw_queues to fetch.
     */
    orderBy?: withdraw_queueOrderByWithRelationInput | withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` withdraw_queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned withdraw_queues
    **/
    _count?: true | Withdraw_queueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Withdraw_queueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Withdraw_queueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Withdraw_queueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Withdraw_queueMaxAggregateInputType
  }

  export type GetWithdraw_queueAggregateType<T extends Withdraw_queueAggregateArgs> = {
        [P in keyof T & keyof AggregateWithdraw_queue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWithdraw_queue[P]>
      : GetScalarType<T[P], AggregateWithdraw_queue[P]>
  }




  export type withdraw_queueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: withdraw_queueWhereInput
    orderBy?: withdraw_queueOrderByWithAggregationInput | withdraw_queueOrderByWithAggregationInput[]
    by: Withdraw_queueScalarFieldEnum[] | Withdraw_queueScalarFieldEnum
    having?: withdraw_queueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Withdraw_queueCountAggregateInputType | true
    _avg?: Withdraw_queueAvgAggregateInputType
    _sum?: Withdraw_queueSumAggregateInputType
    _min?: Withdraw_queueMinAggregateInputType
    _max?: Withdraw_queueMaxAggregateInputType
  }

  export type Withdraw_queueGroupByOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    tx_hash: string
    caller: string
    amount_strk: string
    amount_kstrk: string
    request_id: bigint
    is_claimed: boolean
    claim_time: number
    receiver: string
    is_rejected: boolean
    timestamp: number
    cursor: bigint | null
    _count: Withdraw_queueCountAggregateOutputType | null
    _avg: Withdraw_queueAvgAggregateOutputType | null
    _sum: Withdraw_queueSumAggregateOutputType | null
    _min: Withdraw_queueMinAggregateOutputType | null
    _max: Withdraw_queueMaxAggregateOutputType | null
  }

  type GetWithdraw_queueGroupByPayload<T extends withdraw_queueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Withdraw_queueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Withdraw_queueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Withdraw_queueGroupByOutputType[P]>
            : GetScalarType<T[P], Withdraw_queueGroupByOutputType[P]>
        }
      >
    >


  export type withdraw_queueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    tx_hash?: boolean
    caller?: boolean
    amount_strk?: boolean
    amount_kstrk?: boolean
    request_id?: boolean
    is_claimed?: boolean
    claim_time?: boolean
    receiver?: boolean
    is_rejected?: boolean
    timestamp?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["withdraw_queue"]>

  export type withdraw_queueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    tx_hash?: boolean
    caller?: boolean
    amount_strk?: boolean
    amount_kstrk?: boolean
    request_id?: boolean
    is_claimed?: boolean
    claim_time?: boolean
    receiver?: boolean
    is_rejected?: boolean
    timestamp?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["withdraw_queue"]>

  export type withdraw_queueSelectScalar = {
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    tx_hash?: boolean
    caller?: boolean
    amount_strk?: boolean
    amount_kstrk?: boolean
    request_id?: boolean
    is_claimed?: boolean
    claim_time?: boolean
    receiver?: boolean
    is_rejected?: boolean
    timestamp?: boolean
    cursor?: boolean
  }


  export type $withdraw_queuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "withdraw_queue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      block_number: number
      tx_index: number
      event_index: number
      tx_hash: string
      caller: string
      amount_strk: string
      amount_kstrk: string
      request_id: bigint
      is_claimed: boolean
      claim_time: number
      receiver: string
      is_rejected: boolean
      timestamp: number
      cursor: bigint | null
    }, ExtArgs["result"]["withdraw_queue"]>
    composites: {}
  }

  type withdraw_queueGetPayload<S extends boolean | null | undefined | withdraw_queueDefaultArgs> = $Result.GetResult<Prisma.$withdraw_queuePayload, S>

  type withdraw_queueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<withdraw_queueFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Withdraw_queueCountAggregateInputType | true
    }

  export interface withdraw_queueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['withdraw_queue'], meta: { name: 'withdraw_queue' } }
    /**
     * Find zero or one Withdraw_queue that matches the filter.
     * @param {withdraw_queueFindUniqueArgs} args - Arguments to find a Withdraw_queue
     * @example
     * // Get one Withdraw_queue
     * const withdraw_queue = await prisma.withdraw_queue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends withdraw_queueFindUniqueArgs>(args: SelectSubset<T, withdraw_queueFindUniqueArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Withdraw_queue that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {withdraw_queueFindUniqueOrThrowArgs} args - Arguments to find a Withdraw_queue
     * @example
     * // Get one Withdraw_queue
     * const withdraw_queue = await prisma.withdraw_queue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends withdraw_queueFindUniqueOrThrowArgs>(args: SelectSubset<T, withdraw_queueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Withdraw_queue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {withdraw_queueFindFirstArgs} args - Arguments to find a Withdraw_queue
     * @example
     * // Get one Withdraw_queue
     * const withdraw_queue = await prisma.withdraw_queue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends withdraw_queueFindFirstArgs>(args?: SelectSubset<T, withdraw_queueFindFirstArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Withdraw_queue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {withdraw_queueFindFirstOrThrowArgs} args - Arguments to find a Withdraw_queue
     * @example
     * // Get one Withdraw_queue
     * const withdraw_queue = await prisma.withdraw_queue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends withdraw_queueFindFirstOrThrowArgs>(args?: SelectSubset<T, withdraw_queueFindFirstOrThrowArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Withdraw_queues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {withdraw_queueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Withdraw_queues
     * const withdraw_queues = await prisma.withdraw_queue.findMany()
     * 
     * // Get first 10 Withdraw_queues
     * const withdraw_queues = await prisma.withdraw_queue.findMany({ take: 10 })
     * 
     * // Only select the `block_number`
     * const withdraw_queueWithBlock_numberOnly = await prisma.withdraw_queue.findMany({ select: { block_number: true } })
     * 
     */
    findMany<T extends withdraw_queueFindManyArgs>(args?: SelectSubset<T, withdraw_queueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Withdraw_queue.
     * @param {withdraw_queueCreateArgs} args - Arguments to create a Withdraw_queue.
     * @example
     * // Create one Withdraw_queue
     * const Withdraw_queue = await prisma.withdraw_queue.create({
     *   data: {
     *     // ... data to create a Withdraw_queue
     *   }
     * })
     * 
     */
    create<T extends withdraw_queueCreateArgs>(args: SelectSubset<T, withdraw_queueCreateArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Withdraw_queues.
     * @param {withdraw_queueCreateManyArgs} args - Arguments to create many Withdraw_queues.
     * @example
     * // Create many Withdraw_queues
     * const withdraw_queue = await prisma.withdraw_queue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends withdraw_queueCreateManyArgs>(args?: SelectSubset<T, withdraw_queueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Withdraw_queues and returns the data saved in the database.
     * @param {withdraw_queueCreateManyAndReturnArgs} args - Arguments to create many Withdraw_queues.
     * @example
     * // Create many Withdraw_queues
     * const withdraw_queue = await prisma.withdraw_queue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Withdraw_queues and only return the `block_number`
     * const withdraw_queueWithBlock_numberOnly = await prisma.withdraw_queue.createManyAndReturn({ 
     *   select: { block_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends withdraw_queueCreateManyAndReturnArgs>(args?: SelectSubset<T, withdraw_queueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Withdraw_queue.
     * @param {withdraw_queueDeleteArgs} args - Arguments to delete one Withdraw_queue.
     * @example
     * // Delete one Withdraw_queue
     * const Withdraw_queue = await prisma.withdraw_queue.delete({
     *   where: {
     *     // ... filter to delete one Withdraw_queue
     *   }
     * })
     * 
     */
    delete<T extends withdraw_queueDeleteArgs>(args: SelectSubset<T, withdraw_queueDeleteArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Withdraw_queue.
     * @param {withdraw_queueUpdateArgs} args - Arguments to update one Withdraw_queue.
     * @example
     * // Update one Withdraw_queue
     * const withdraw_queue = await prisma.withdraw_queue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends withdraw_queueUpdateArgs>(args: SelectSubset<T, withdraw_queueUpdateArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Withdraw_queues.
     * @param {withdraw_queueDeleteManyArgs} args - Arguments to filter Withdraw_queues to delete.
     * @example
     * // Delete a few Withdraw_queues
     * const { count } = await prisma.withdraw_queue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends withdraw_queueDeleteManyArgs>(args?: SelectSubset<T, withdraw_queueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Withdraw_queues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {withdraw_queueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Withdraw_queues
     * const withdraw_queue = await prisma.withdraw_queue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends withdraw_queueUpdateManyArgs>(args: SelectSubset<T, withdraw_queueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Withdraw_queue.
     * @param {withdraw_queueUpsertArgs} args - Arguments to update or create a Withdraw_queue.
     * @example
     * // Update or create a Withdraw_queue
     * const withdraw_queue = await prisma.withdraw_queue.upsert({
     *   create: {
     *     // ... data to create a Withdraw_queue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Withdraw_queue we want to update
     *   }
     * })
     */
    upsert<T extends withdraw_queueUpsertArgs>(args: SelectSubset<T, withdraw_queueUpsertArgs<ExtArgs>>): Prisma__withdraw_queueClient<$Result.GetResult<Prisma.$withdraw_queuePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Withdraw_queues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {withdraw_queueCountArgs} args - Arguments to filter Withdraw_queues to count.
     * @example
     * // Count the number of Withdraw_queues
     * const count = await prisma.withdraw_queue.count({
     *   where: {
     *     // ... the filter for the Withdraw_queues we want to count
     *   }
     * })
    **/
    count<T extends withdraw_queueCountArgs>(
      args?: Subset<T, withdraw_queueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Withdraw_queueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Withdraw_queue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Withdraw_queueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Withdraw_queueAggregateArgs>(args: Subset<T, Withdraw_queueAggregateArgs>): Prisma.PrismaPromise<GetWithdraw_queueAggregateType<T>>

    /**
     * Group by Withdraw_queue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {withdraw_queueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends withdraw_queueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: withdraw_queueGroupByArgs['orderBy'] }
        : { orderBy?: withdraw_queueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, withdraw_queueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWithdraw_queueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the withdraw_queue model
   */
  readonly fields: withdraw_queueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for withdraw_queue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__withdraw_queueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the withdraw_queue model
   */ 
  interface withdraw_queueFieldRefs {
    readonly block_number: FieldRef<"withdraw_queue", 'Int'>
    readonly tx_index: FieldRef<"withdraw_queue", 'Int'>
    readonly event_index: FieldRef<"withdraw_queue", 'Int'>
    readonly tx_hash: FieldRef<"withdraw_queue", 'String'>
    readonly caller: FieldRef<"withdraw_queue", 'String'>
    readonly amount_strk: FieldRef<"withdraw_queue", 'String'>
    readonly amount_kstrk: FieldRef<"withdraw_queue", 'String'>
    readonly request_id: FieldRef<"withdraw_queue", 'BigInt'>
    readonly is_claimed: FieldRef<"withdraw_queue", 'Boolean'>
    readonly claim_time: FieldRef<"withdraw_queue", 'Int'>
    readonly receiver: FieldRef<"withdraw_queue", 'String'>
    readonly is_rejected: FieldRef<"withdraw_queue", 'Boolean'>
    readonly timestamp: FieldRef<"withdraw_queue", 'Int'>
    readonly cursor: FieldRef<"withdraw_queue", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * withdraw_queue findUnique
   */
  export type withdraw_queueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which withdraw_queue to fetch.
     */
    where: withdraw_queueWhereUniqueInput
  }

  /**
   * withdraw_queue findUniqueOrThrow
   */
  export type withdraw_queueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which withdraw_queue to fetch.
     */
    where: withdraw_queueWhereUniqueInput
  }

  /**
   * withdraw_queue findFirst
   */
  export type withdraw_queueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which withdraw_queue to fetch.
     */
    where?: withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of withdraw_queues to fetch.
     */
    orderBy?: withdraw_queueOrderByWithRelationInput | withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for withdraw_queues.
     */
    cursor?: withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` withdraw_queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of withdraw_queues.
     */
    distinct?: Withdraw_queueScalarFieldEnum | Withdraw_queueScalarFieldEnum[]
  }

  /**
   * withdraw_queue findFirstOrThrow
   */
  export type withdraw_queueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which withdraw_queue to fetch.
     */
    where?: withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of withdraw_queues to fetch.
     */
    orderBy?: withdraw_queueOrderByWithRelationInput | withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for withdraw_queues.
     */
    cursor?: withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` withdraw_queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of withdraw_queues.
     */
    distinct?: Withdraw_queueScalarFieldEnum | Withdraw_queueScalarFieldEnum[]
  }

  /**
   * withdraw_queue findMany
   */
  export type withdraw_queueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which withdraw_queues to fetch.
     */
    where?: withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of withdraw_queues to fetch.
     */
    orderBy?: withdraw_queueOrderByWithRelationInput | withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing withdraw_queues.
     */
    cursor?: withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` withdraw_queues.
     */
    skip?: number
    distinct?: Withdraw_queueScalarFieldEnum | Withdraw_queueScalarFieldEnum[]
  }

  /**
   * withdraw_queue create
   */
  export type withdraw_queueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * The data needed to create a withdraw_queue.
     */
    data: XOR<withdraw_queueCreateInput, withdraw_queueUncheckedCreateInput>
  }

  /**
   * withdraw_queue createMany
   */
  export type withdraw_queueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many withdraw_queues.
     */
    data: withdraw_queueCreateManyInput | withdraw_queueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * withdraw_queue createManyAndReturn
   */
  export type withdraw_queueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many withdraw_queues.
     */
    data: withdraw_queueCreateManyInput | withdraw_queueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * withdraw_queue update
   */
  export type withdraw_queueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * The data needed to update a withdraw_queue.
     */
    data: XOR<withdraw_queueUpdateInput, withdraw_queueUncheckedUpdateInput>
    /**
     * Choose, which withdraw_queue to update.
     */
    where: withdraw_queueWhereUniqueInput
  }

  /**
   * withdraw_queue updateMany
   */
  export type withdraw_queueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update withdraw_queues.
     */
    data: XOR<withdraw_queueUpdateManyMutationInput, withdraw_queueUncheckedUpdateManyInput>
    /**
     * Filter which withdraw_queues to update
     */
    where?: withdraw_queueWhereInput
  }

  /**
   * withdraw_queue upsert
   */
  export type withdraw_queueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * The filter to search for the withdraw_queue to update in case it exists.
     */
    where: withdraw_queueWhereUniqueInput
    /**
     * In case the withdraw_queue found by the `where` argument doesn't exist, create a new withdraw_queue with this data.
     */
    create: XOR<withdraw_queueCreateInput, withdraw_queueUncheckedCreateInput>
    /**
     * In case the withdraw_queue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<withdraw_queueUpdateInput, withdraw_queueUncheckedUpdateInput>
  }

  /**
   * withdraw_queue delete
   */
  export type withdraw_queueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter which withdraw_queue to delete.
     */
    where: withdraw_queueWhereUniqueInput
  }

  /**
   * withdraw_queue deleteMany
   */
  export type withdraw_queueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which withdraw_queues to delete
     */
    where?: withdraw_queueWhereInput
  }

  /**
   * withdraw_queue without action
   */
  export type withdraw_queueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the withdraw_queue
     */
    select?: withdraw_queueSelect<ExtArgs> | null
  }


  /**
   * Model received_funds
   */

  export type AggregateReceived_funds = {
    _count: Received_fundsCountAggregateOutputType | null
    _avg: Received_fundsAvgAggregateOutputType | null
    _sum: Received_fundsSumAggregateOutputType | null
    _min: Received_fundsMinAggregateOutputType | null
    _max: Received_fundsMaxAggregateOutputType | null
  }

  export type Received_fundsAvgAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    timestamp: number | null
    cursor: number | null
  }

  export type Received_fundsSumAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    timestamp: number | null
    cursor: bigint | null
  }

  export type Received_fundsMinAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    sender: string | null
    unprocessed: string | null
    intransit: string | null
    timestamp: number | null
    cursor: bigint | null
  }

  export type Received_fundsMaxAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    sender: string | null
    unprocessed: string | null
    intransit: string | null
    timestamp: number | null
    cursor: bigint | null
  }

  export type Received_fundsCountAggregateOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: number
    sender: number
    unprocessed: number
    intransit: number
    timestamp: number
    cursor: number
    _all: number
  }


  export type Received_fundsAvgAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    timestamp?: true
    cursor?: true
  }

  export type Received_fundsSumAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    timestamp?: true
    cursor?: true
  }

  export type Received_fundsMinAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    sender?: true
    unprocessed?: true
    intransit?: true
    timestamp?: true
    cursor?: true
  }

  export type Received_fundsMaxAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    sender?: true
    unprocessed?: true
    intransit?: true
    timestamp?: true
    cursor?: true
  }

  export type Received_fundsCountAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    sender?: true
    unprocessed?: true
    intransit?: true
    timestamp?: true
    cursor?: true
    _all?: true
  }

  export type Received_fundsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which received_funds to aggregate.
     */
    where?: received_fundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of received_funds to fetch.
     */
    orderBy?: received_fundsOrderByWithRelationInput | received_fundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: received_fundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` received_funds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` received_funds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned received_funds
    **/
    _count?: true | Received_fundsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Received_fundsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Received_fundsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Received_fundsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Received_fundsMaxAggregateInputType
  }

  export type GetReceived_fundsAggregateType<T extends Received_fundsAggregateArgs> = {
        [P in keyof T & keyof AggregateReceived_funds]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReceived_funds[P]>
      : GetScalarType<T[P], AggregateReceived_funds[P]>
  }




  export type received_fundsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: received_fundsWhereInput
    orderBy?: received_fundsOrderByWithAggregationInput | received_fundsOrderByWithAggregationInput[]
    by: Received_fundsScalarFieldEnum[] | Received_fundsScalarFieldEnum
    having?: received_fundsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Received_fundsCountAggregateInputType | true
    _avg?: Received_fundsAvgAggregateInputType
    _sum?: Received_fundsSumAggregateInputType
    _min?: Received_fundsMinAggregateInputType
    _max?: Received_fundsMaxAggregateInputType
  }

  export type Received_fundsGroupByOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: string
    sender: string
    unprocessed: string
    intransit: string
    timestamp: number
    cursor: bigint | null
    _count: Received_fundsCountAggregateOutputType | null
    _avg: Received_fundsAvgAggregateOutputType | null
    _sum: Received_fundsSumAggregateOutputType | null
    _min: Received_fundsMinAggregateOutputType | null
    _max: Received_fundsMaxAggregateOutputType | null
  }

  type GetReceived_fundsGroupByPayload<T extends received_fundsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Received_fundsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Received_fundsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Received_fundsGroupByOutputType[P]>
            : GetScalarType<T[P], Received_fundsGroupByOutputType[P]>
        }
      >
    >


  export type received_fundsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    sender?: boolean
    unprocessed?: boolean
    intransit?: boolean
    timestamp?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["received_funds"]>

  export type received_fundsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    sender?: boolean
    unprocessed?: boolean
    intransit?: boolean
    timestamp?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["received_funds"]>

  export type received_fundsSelectScalar = {
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    sender?: boolean
    unprocessed?: boolean
    intransit?: boolean
    timestamp?: boolean
    cursor?: boolean
  }


  export type $received_fundsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "received_funds"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      block_number: number
      tx_index: number
      event_index: number
      amount: string
      sender: string
      unprocessed: string
      intransit: string
      timestamp: number
      cursor: bigint | null
    }, ExtArgs["result"]["received_funds"]>
    composites: {}
  }

  type received_fundsGetPayload<S extends boolean | null | undefined | received_fundsDefaultArgs> = $Result.GetResult<Prisma.$received_fundsPayload, S>

  type received_fundsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<received_fundsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Received_fundsCountAggregateInputType | true
    }

  export interface received_fundsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['received_funds'], meta: { name: 'received_funds' } }
    /**
     * Find zero or one Received_funds that matches the filter.
     * @param {received_fundsFindUniqueArgs} args - Arguments to find a Received_funds
     * @example
     * // Get one Received_funds
     * const received_funds = await prisma.received_funds.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends received_fundsFindUniqueArgs>(args: SelectSubset<T, received_fundsFindUniqueArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Received_funds that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {received_fundsFindUniqueOrThrowArgs} args - Arguments to find a Received_funds
     * @example
     * // Get one Received_funds
     * const received_funds = await prisma.received_funds.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends received_fundsFindUniqueOrThrowArgs>(args: SelectSubset<T, received_fundsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Received_funds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {received_fundsFindFirstArgs} args - Arguments to find a Received_funds
     * @example
     * // Get one Received_funds
     * const received_funds = await prisma.received_funds.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends received_fundsFindFirstArgs>(args?: SelectSubset<T, received_fundsFindFirstArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Received_funds that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {received_fundsFindFirstOrThrowArgs} args - Arguments to find a Received_funds
     * @example
     * // Get one Received_funds
     * const received_funds = await prisma.received_funds.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends received_fundsFindFirstOrThrowArgs>(args?: SelectSubset<T, received_fundsFindFirstOrThrowArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Received_funds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {received_fundsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Received_funds
     * const received_funds = await prisma.received_funds.findMany()
     * 
     * // Get first 10 Received_funds
     * const received_funds = await prisma.received_funds.findMany({ take: 10 })
     * 
     * // Only select the `block_number`
     * const received_fundsWithBlock_numberOnly = await prisma.received_funds.findMany({ select: { block_number: true } })
     * 
     */
    findMany<T extends received_fundsFindManyArgs>(args?: SelectSubset<T, received_fundsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Received_funds.
     * @param {received_fundsCreateArgs} args - Arguments to create a Received_funds.
     * @example
     * // Create one Received_funds
     * const Received_funds = await prisma.received_funds.create({
     *   data: {
     *     // ... data to create a Received_funds
     *   }
     * })
     * 
     */
    create<T extends received_fundsCreateArgs>(args: SelectSubset<T, received_fundsCreateArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Received_funds.
     * @param {received_fundsCreateManyArgs} args - Arguments to create many Received_funds.
     * @example
     * // Create many Received_funds
     * const received_funds = await prisma.received_funds.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends received_fundsCreateManyArgs>(args?: SelectSubset<T, received_fundsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Received_funds and returns the data saved in the database.
     * @param {received_fundsCreateManyAndReturnArgs} args - Arguments to create many Received_funds.
     * @example
     * // Create many Received_funds
     * const received_funds = await prisma.received_funds.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Received_funds and only return the `block_number`
     * const received_fundsWithBlock_numberOnly = await prisma.received_funds.createManyAndReturn({ 
     *   select: { block_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends received_fundsCreateManyAndReturnArgs>(args?: SelectSubset<T, received_fundsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Received_funds.
     * @param {received_fundsDeleteArgs} args - Arguments to delete one Received_funds.
     * @example
     * // Delete one Received_funds
     * const Received_funds = await prisma.received_funds.delete({
     *   where: {
     *     // ... filter to delete one Received_funds
     *   }
     * })
     * 
     */
    delete<T extends received_fundsDeleteArgs>(args: SelectSubset<T, received_fundsDeleteArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Received_funds.
     * @param {received_fundsUpdateArgs} args - Arguments to update one Received_funds.
     * @example
     * // Update one Received_funds
     * const received_funds = await prisma.received_funds.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends received_fundsUpdateArgs>(args: SelectSubset<T, received_fundsUpdateArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Received_funds.
     * @param {received_fundsDeleteManyArgs} args - Arguments to filter Received_funds to delete.
     * @example
     * // Delete a few Received_funds
     * const { count } = await prisma.received_funds.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends received_fundsDeleteManyArgs>(args?: SelectSubset<T, received_fundsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Received_funds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {received_fundsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Received_funds
     * const received_funds = await prisma.received_funds.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends received_fundsUpdateManyArgs>(args: SelectSubset<T, received_fundsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Received_funds.
     * @param {received_fundsUpsertArgs} args - Arguments to update or create a Received_funds.
     * @example
     * // Update or create a Received_funds
     * const received_funds = await prisma.received_funds.upsert({
     *   create: {
     *     // ... data to create a Received_funds
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Received_funds we want to update
     *   }
     * })
     */
    upsert<T extends received_fundsUpsertArgs>(args: SelectSubset<T, received_fundsUpsertArgs<ExtArgs>>): Prisma__received_fundsClient<$Result.GetResult<Prisma.$received_fundsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Received_funds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {received_fundsCountArgs} args - Arguments to filter Received_funds to count.
     * @example
     * // Count the number of Received_funds
     * const count = await prisma.received_funds.count({
     *   where: {
     *     // ... the filter for the Received_funds we want to count
     *   }
     * })
    **/
    count<T extends received_fundsCountArgs>(
      args?: Subset<T, received_fundsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Received_fundsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Received_funds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Received_fundsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Received_fundsAggregateArgs>(args: Subset<T, Received_fundsAggregateArgs>): Prisma.PrismaPromise<GetReceived_fundsAggregateType<T>>

    /**
     * Group by Received_funds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {received_fundsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends received_fundsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: received_fundsGroupByArgs['orderBy'] }
        : { orderBy?: received_fundsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, received_fundsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceived_fundsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the received_funds model
   */
  readonly fields: received_fundsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for received_funds.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__received_fundsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the received_funds model
   */ 
  interface received_fundsFieldRefs {
    readonly block_number: FieldRef<"received_funds", 'Int'>
    readonly tx_index: FieldRef<"received_funds", 'Int'>
    readonly event_index: FieldRef<"received_funds", 'Int'>
    readonly amount: FieldRef<"received_funds", 'String'>
    readonly sender: FieldRef<"received_funds", 'String'>
    readonly unprocessed: FieldRef<"received_funds", 'String'>
    readonly intransit: FieldRef<"received_funds", 'String'>
    readonly timestamp: FieldRef<"received_funds", 'Int'>
    readonly cursor: FieldRef<"received_funds", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * received_funds findUnique
   */
  export type received_fundsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * Filter, which received_funds to fetch.
     */
    where: received_fundsWhereUniqueInput
  }

  /**
   * received_funds findUniqueOrThrow
   */
  export type received_fundsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * Filter, which received_funds to fetch.
     */
    where: received_fundsWhereUniqueInput
  }

  /**
   * received_funds findFirst
   */
  export type received_fundsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * Filter, which received_funds to fetch.
     */
    where?: received_fundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of received_funds to fetch.
     */
    orderBy?: received_fundsOrderByWithRelationInput | received_fundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for received_funds.
     */
    cursor?: received_fundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` received_funds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` received_funds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of received_funds.
     */
    distinct?: Received_fundsScalarFieldEnum | Received_fundsScalarFieldEnum[]
  }

  /**
   * received_funds findFirstOrThrow
   */
  export type received_fundsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * Filter, which received_funds to fetch.
     */
    where?: received_fundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of received_funds to fetch.
     */
    orderBy?: received_fundsOrderByWithRelationInput | received_fundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for received_funds.
     */
    cursor?: received_fundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` received_funds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` received_funds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of received_funds.
     */
    distinct?: Received_fundsScalarFieldEnum | Received_fundsScalarFieldEnum[]
  }

  /**
   * received_funds findMany
   */
  export type received_fundsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * Filter, which received_funds to fetch.
     */
    where?: received_fundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of received_funds to fetch.
     */
    orderBy?: received_fundsOrderByWithRelationInput | received_fundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing received_funds.
     */
    cursor?: received_fundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` received_funds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` received_funds.
     */
    skip?: number
    distinct?: Received_fundsScalarFieldEnum | Received_fundsScalarFieldEnum[]
  }

  /**
   * received_funds create
   */
  export type received_fundsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * The data needed to create a received_funds.
     */
    data: XOR<received_fundsCreateInput, received_fundsUncheckedCreateInput>
  }

  /**
   * received_funds createMany
   */
  export type received_fundsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many received_funds.
     */
    data: received_fundsCreateManyInput | received_fundsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * received_funds createManyAndReturn
   */
  export type received_fundsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many received_funds.
     */
    data: received_fundsCreateManyInput | received_fundsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * received_funds update
   */
  export type received_fundsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * The data needed to update a received_funds.
     */
    data: XOR<received_fundsUpdateInput, received_fundsUncheckedUpdateInput>
    /**
     * Choose, which received_funds to update.
     */
    where: received_fundsWhereUniqueInput
  }

  /**
   * received_funds updateMany
   */
  export type received_fundsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update received_funds.
     */
    data: XOR<received_fundsUpdateManyMutationInput, received_fundsUncheckedUpdateManyInput>
    /**
     * Filter which received_funds to update
     */
    where?: received_fundsWhereInput
  }

  /**
   * received_funds upsert
   */
  export type received_fundsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * The filter to search for the received_funds to update in case it exists.
     */
    where: received_fundsWhereUniqueInput
    /**
     * In case the received_funds found by the `where` argument doesn't exist, create a new received_funds with this data.
     */
    create: XOR<received_fundsCreateInput, received_fundsUncheckedCreateInput>
    /**
     * In case the received_funds was found with the provided `where` argument, update it with this data.
     */
    update: XOR<received_fundsUpdateInput, received_fundsUncheckedUpdateInput>
  }

  /**
   * received_funds delete
   */
  export type received_fundsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
    /**
     * Filter which received_funds to delete.
     */
    where: received_fundsWhereUniqueInput
  }

  /**
   * received_funds deleteMany
   */
  export type received_fundsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which received_funds to delete
     */
    where?: received_fundsWhereInput
  }

  /**
   * received_funds without action
   */
  export type received_fundsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the received_funds
     */
    select?: received_fundsSelect<ExtArgs> | null
  }


  /**
   * Model dispatch_to_stake
   */

  export type AggregateDispatch_to_stake = {
    _count: Dispatch_to_stakeCountAggregateOutputType | null
    _avg: Dispatch_to_stakeAvgAggregateOutputType | null
    _sum: Dispatch_to_stakeSumAggregateOutputType | null
    _min: Dispatch_to_stakeMinAggregateOutputType | null
    _max: Dispatch_to_stakeMaxAggregateOutputType | null
  }

  export type Dispatch_to_stakeAvgAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: number | null
  }

  export type Dispatch_to_stakeSumAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: bigint | null
  }

  export type Dispatch_to_stakeMinAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    delegator: string | null
    amount: string | null
    cursor: bigint | null
    timestamp: string | null
  }

  export type Dispatch_to_stakeMaxAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    delegator: string | null
    amount: string | null
    cursor: bigint | null
    timestamp: string | null
  }

  export type Dispatch_to_stakeCountAggregateOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    delegator: number
    amount: number
    cursor: number
    timestamp: number
    _all: number
  }


  export type Dispatch_to_stakeAvgAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Dispatch_to_stakeSumAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Dispatch_to_stakeMinAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    delegator?: true
    amount?: true
    cursor?: true
    timestamp?: true
  }

  export type Dispatch_to_stakeMaxAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    delegator?: true
    amount?: true
    cursor?: true
    timestamp?: true
  }

  export type Dispatch_to_stakeCountAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    delegator?: true
    amount?: true
    cursor?: true
    timestamp?: true
    _all?: true
  }

  export type Dispatch_to_stakeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dispatch_to_stake to aggregate.
     */
    where?: dispatch_to_stakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_stakes to fetch.
     */
    orderBy?: dispatch_to_stakeOrderByWithRelationInput | dispatch_to_stakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: dispatch_to_stakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_stakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_stakes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned dispatch_to_stakes
    **/
    _count?: true | Dispatch_to_stakeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Dispatch_to_stakeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Dispatch_to_stakeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Dispatch_to_stakeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Dispatch_to_stakeMaxAggregateInputType
  }

  export type GetDispatch_to_stakeAggregateType<T extends Dispatch_to_stakeAggregateArgs> = {
        [P in keyof T & keyof AggregateDispatch_to_stake]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDispatch_to_stake[P]>
      : GetScalarType<T[P], AggregateDispatch_to_stake[P]>
  }




  export type dispatch_to_stakeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dispatch_to_stakeWhereInput
    orderBy?: dispatch_to_stakeOrderByWithAggregationInput | dispatch_to_stakeOrderByWithAggregationInput[]
    by: Dispatch_to_stakeScalarFieldEnum[] | Dispatch_to_stakeScalarFieldEnum
    having?: dispatch_to_stakeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Dispatch_to_stakeCountAggregateInputType | true
    _avg?: Dispatch_to_stakeAvgAggregateInputType
    _sum?: Dispatch_to_stakeSumAggregateInputType
    _min?: Dispatch_to_stakeMinAggregateInputType
    _max?: Dispatch_to_stakeMaxAggregateInputType
  }

  export type Dispatch_to_stakeGroupByOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    delegator: string
    amount: string
    cursor: bigint | null
    timestamp: string
    _count: Dispatch_to_stakeCountAggregateOutputType | null
    _avg: Dispatch_to_stakeAvgAggregateOutputType | null
    _sum: Dispatch_to_stakeSumAggregateOutputType | null
    _min: Dispatch_to_stakeMinAggregateOutputType | null
    _max: Dispatch_to_stakeMaxAggregateOutputType | null
  }

  type GetDispatch_to_stakeGroupByPayload<T extends dispatch_to_stakeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Dispatch_to_stakeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Dispatch_to_stakeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Dispatch_to_stakeGroupByOutputType[P]>
            : GetScalarType<T[P], Dispatch_to_stakeGroupByOutputType[P]>
        }
      >
    >


  export type dispatch_to_stakeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    delegator?: boolean
    amount?: boolean
    cursor?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["dispatch_to_stake"]>

  export type dispatch_to_stakeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    delegator?: boolean
    amount?: boolean
    cursor?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["dispatch_to_stake"]>

  export type dispatch_to_stakeSelectScalar = {
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    delegator?: boolean
    amount?: boolean
    cursor?: boolean
    timestamp?: boolean
  }


  export type $dispatch_to_stakePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "dispatch_to_stake"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      block_number: number
      tx_index: number
      event_index: number
      delegator: string
      amount: string
      cursor: bigint | null
      timestamp: string
    }, ExtArgs["result"]["dispatch_to_stake"]>
    composites: {}
  }

  type dispatch_to_stakeGetPayload<S extends boolean | null | undefined | dispatch_to_stakeDefaultArgs> = $Result.GetResult<Prisma.$dispatch_to_stakePayload, S>

  type dispatch_to_stakeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<dispatch_to_stakeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Dispatch_to_stakeCountAggregateInputType | true
    }

  export interface dispatch_to_stakeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['dispatch_to_stake'], meta: { name: 'dispatch_to_stake' } }
    /**
     * Find zero or one Dispatch_to_stake that matches the filter.
     * @param {dispatch_to_stakeFindUniqueArgs} args - Arguments to find a Dispatch_to_stake
     * @example
     * // Get one Dispatch_to_stake
     * const dispatch_to_stake = await prisma.dispatch_to_stake.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends dispatch_to_stakeFindUniqueArgs>(args: SelectSubset<T, dispatch_to_stakeFindUniqueArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Dispatch_to_stake that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {dispatch_to_stakeFindUniqueOrThrowArgs} args - Arguments to find a Dispatch_to_stake
     * @example
     * // Get one Dispatch_to_stake
     * const dispatch_to_stake = await prisma.dispatch_to_stake.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends dispatch_to_stakeFindUniqueOrThrowArgs>(args: SelectSubset<T, dispatch_to_stakeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Dispatch_to_stake that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_stakeFindFirstArgs} args - Arguments to find a Dispatch_to_stake
     * @example
     * // Get one Dispatch_to_stake
     * const dispatch_to_stake = await prisma.dispatch_to_stake.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends dispatch_to_stakeFindFirstArgs>(args?: SelectSubset<T, dispatch_to_stakeFindFirstArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Dispatch_to_stake that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_stakeFindFirstOrThrowArgs} args - Arguments to find a Dispatch_to_stake
     * @example
     * // Get one Dispatch_to_stake
     * const dispatch_to_stake = await prisma.dispatch_to_stake.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends dispatch_to_stakeFindFirstOrThrowArgs>(args?: SelectSubset<T, dispatch_to_stakeFindFirstOrThrowArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Dispatch_to_stakes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_stakeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dispatch_to_stakes
     * const dispatch_to_stakes = await prisma.dispatch_to_stake.findMany()
     * 
     * // Get first 10 Dispatch_to_stakes
     * const dispatch_to_stakes = await prisma.dispatch_to_stake.findMany({ take: 10 })
     * 
     * // Only select the `block_number`
     * const dispatch_to_stakeWithBlock_numberOnly = await prisma.dispatch_to_stake.findMany({ select: { block_number: true } })
     * 
     */
    findMany<T extends dispatch_to_stakeFindManyArgs>(args?: SelectSubset<T, dispatch_to_stakeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Dispatch_to_stake.
     * @param {dispatch_to_stakeCreateArgs} args - Arguments to create a Dispatch_to_stake.
     * @example
     * // Create one Dispatch_to_stake
     * const Dispatch_to_stake = await prisma.dispatch_to_stake.create({
     *   data: {
     *     // ... data to create a Dispatch_to_stake
     *   }
     * })
     * 
     */
    create<T extends dispatch_to_stakeCreateArgs>(args: SelectSubset<T, dispatch_to_stakeCreateArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Dispatch_to_stakes.
     * @param {dispatch_to_stakeCreateManyArgs} args - Arguments to create many Dispatch_to_stakes.
     * @example
     * // Create many Dispatch_to_stakes
     * const dispatch_to_stake = await prisma.dispatch_to_stake.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends dispatch_to_stakeCreateManyArgs>(args?: SelectSubset<T, dispatch_to_stakeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dispatch_to_stakes and returns the data saved in the database.
     * @param {dispatch_to_stakeCreateManyAndReturnArgs} args - Arguments to create many Dispatch_to_stakes.
     * @example
     * // Create many Dispatch_to_stakes
     * const dispatch_to_stake = await prisma.dispatch_to_stake.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dispatch_to_stakes and only return the `block_number`
     * const dispatch_to_stakeWithBlock_numberOnly = await prisma.dispatch_to_stake.createManyAndReturn({ 
     *   select: { block_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends dispatch_to_stakeCreateManyAndReturnArgs>(args?: SelectSubset<T, dispatch_to_stakeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Dispatch_to_stake.
     * @param {dispatch_to_stakeDeleteArgs} args - Arguments to delete one Dispatch_to_stake.
     * @example
     * // Delete one Dispatch_to_stake
     * const Dispatch_to_stake = await prisma.dispatch_to_stake.delete({
     *   where: {
     *     // ... filter to delete one Dispatch_to_stake
     *   }
     * })
     * 
     */
    delete<T extends dispatch_to_stakeDeleteArgs>(args: SelectSubset<T, dispatch_to_stakeDeleteArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Dispatch_to_stake.
     * @param {dispatch_to_stakeUpdateArgs} args - Arguments to update one Dispatch_to_stake.
     * @example
     * // Update one Dispatch_to_stake
     * const dispatch_to_stake = await prisma.dispatch_to_stake.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends dispatch_to_stakeUpdateArgs>(args: SelectSubset<T, dispatch_to_stakeUpdateArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Dispatch_to_stakes.
     * @param {dispatch_to_stakeDeleteManyArgs} args - Arguments to filter Dispatch_to_stakes to delete.
     * @example
     * // Delete a few Dispatch_to_stakes
     * const { count } = await prisma.dispatch_to_stake.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends dispatch_to_stakeDeleteManyArgs>(args?: SelectSubset<T, dispatch_to_stakeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dispatch_to_stakes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_stakeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dispatch_to_stakes
     * const dispatch_to_stake = await prisma.dispatch_to_stake.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends dispatch_to_stakeUpdateManyArgs>(args: SelectSubset<T, dispatch_to_stakeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dispatch_to_stake.
     * @param {dispatch_to_stakeUpsertArgs} args - Arguments to update or create a Dispatch_to_stake.
     * @example
     * // Update or create a Dispatch_to_stake
     * const dispatch_to_stake = await prisma.dispatch_to_stake.upsert({
     *   create: {
     *     // ... data to create a Dispatch_to_stake
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dispatch_to_stake we want to update
     *   }
     * })
     */
    upsert<T extends dispatch_to_stakeUpsertArgs>(args: SelectSubset<T, dispatch_to_stakeUpsertArgs<ExtArgs>>): Prisma__dispatch_to_stakeClient<$Result.GetResult<Prisma.$dispatch_to_stakePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Dispatch_to_stakes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_stakeCountArgs} args - Arguments to filter Dispatch_to_stakes to count.
     * @example
     * // Count the number of Dispatch_to_stakes
     * const count = await prisma.dispatch_to_stake.count({
     *   where: {
     *     // ... the filter for the Dispatch_to_stakes we want to count
     *   }
     * })
    **/
    count<T extends dispatch_to_stakeCountArgs>(
      args?: Subset<T, dispatch_to_stakeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Dispatch_to_stakeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dispatch_to_stake.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Dispatch_to_stakeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Dispatch_to_stakeAggregateArgs>(args: Subset<T, Dispatch_to_stakeAggregateArgs>): Prisma.PrismaPromise<GetDispatch_to_stakeAggregateType<T>>

    /**
     * Group by Dispatch_to_stake.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_stakeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends dispatch_to_stakeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: dispatch_to_stakeGroupByArgs['orderBy'] }
        : { orderBy?: dispatch_to_stakeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, dispatch_to_stakeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDispatch_to_stakeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the dispatch_to_stake model
   */
  readonly fields: dispatch_to_stakeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for dispatch_to_stake.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__dispatch_to_stakeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the dispatch_to_stake model
   */ 
  interface dispatch_to_stakeFieldRefs {
    readonly block_number: FieldRef<"dispatch_to_stake", 'Int'>
    readonly tx_index: FieldRef<"dispatch_to_stake", 'Int'>
    readonly event_index: FieldRef<"dispatch_to_stake", 'Int'>
    readonly delegator: FieldRef<"dispatch_to_stake", 'String'>
    readonly amount: FieldRef<"dispatch_to_stake", 'String'>
    readonly cursor: FieldRef<"dispatch_to_stake", 'BigInt'>
    readonly timestamp: FieldRef<"dispatch_to_stake", 'String'>
  }
    

  // Custom InputTypes
  /**
   * dispatch_to_stake findUnique
   */
  export type dispatch_to_stakeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_stake to fetch.
     */
    where: dispatch_to_stakeWhereUniqueInput
  }

  /**
   * dispatch_to_stake findUniqueOrThrow
   */
  export type dispatch_to_stakeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_stake to fetch.
     */
    where: dispatch_to_stakeWhereUniqueInput
  }

  /**
   * dispatch_to_stake findFirst
   */
  export type dispatch_to_stakeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_stake to fetch.
     */
    where?: dispatch_to_stakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_stakes to fetch.
     */
    orderBy?: dispatch_to_stakeOrderByWithRelationInput | dispatch_to_stakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dispatch_to_stakes.
     */
    cursor?: dispatch_to_stakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_stakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_stakes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dispatch_to_stakes.
     */
    distinct?: Dispatch_to_stakeScalarFieldEnum | Dispatch_to_stakeScalarFieldEnum[]
  }

  /**
   * dispatch_to_stake findFirstOrThrow
   */
  export type dispatch_to_stakeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_stake to fetch.
     */
    where?: dispatch_to_stakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_stakes to fetch.
     */
    orderBy?: dispatch_to_stakeOrderByWithRelationInput | dispatch_to_stakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dispatch_to_stakes.
     */
    cursor?: dispatch_to_stakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_stakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_stakes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dispatch_to_stakes.
     */
    distinct?: Dispatch_to_stakeScalarFieldEnum | Dispatch_to_stakeScalarFieldEnum[]
  }

  /**
   * dispatch_to_stake findMany
   */
  export type dispatch_to_stakeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_stakes to fetch.
     */
    where?: dispatch_to_stakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_stakes to fetch.
     */
    orderBy?: dispatch_to_stakeOrderByWithRelationInput | dispatch_to_stakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing dispatch_to_stakes.
     */
    cursor?: dispatch_to_stakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_stakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_stakes.
     */
    skip?: number
    distinct?: Dispatch_to_stakeScalarFieldEnum | Dispatch_to_stakeScalarFieldEnum[]
  }

  /**
   * dispatch_to_stake create
   */
  export type dispatch_to_stakeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * The data needed to create a dispatch_to_stake.
     */
    data: XOR<dispatch_to_stakeCreateInput, dispatch_to_stakeUncheckedCreateInput>
  }

  /**
   * dispatch_to_stake createMany
   */
  export type dispatch_to_stakeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many dispatch_to_stakes.
     */
    data: dispatch_to_stakeCreateManyInput | dispatch_to_stakeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dispatch_to_stake createManyAndReturn
   */
  export type dispatch_to_stakeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many dispatch_to_stakes.
     */
    data: dispatch_to_stakeCreateManyInput | dispatch_to_stakeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dispatch_to_stake update
   */
  export type dispatch_to_stakeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * The data needed to update a dispatch_to_stake.
     */
    data: XOR<dispatch_to_stakeUpdateInput, dispatch_to_stakeUncheckedUpdateInput>
    /**
     * Choose, which dispatch_to_stake to update.
     */
    where: dispatch_to_stakeWhereUniqueInput
  }

  /**
   * dispatch_to_stake updateMany
   */
  export type dispatch_to_stakeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update dispatch_to_stakes.
     */
    data: XOR<dispatch_to_stakeUpdateManyMutationInput, dispatch_to_stakeUncheckedUpdateManyInput>
    /**
     * Filter which dispatch_to_stakes to update
     */
    where?: dispatch_to_stakeWhereInput
  }

  /**
   * dispatch_to_stake upsert
   */
  export type dispatch_to_stakeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * The filter to search for the dispatch_to_stake to update in case it exists.
     */
    where: dispatch_to_stakeWhereUniqueInput
    /**
     * In case the dispatch_to_stake found by the `where` argument doesn't exist, create a new dispatch_to_stake with this data.
     */
    create: XOR<dispatch_to_stakeCreateInput, dispatch_to_stakeUncheckedCreateInput>
    /**
     * In case the dispatch_to_stake was found with the provided `where` argument, update it with this data.
     */
    update: XOR<dispatch_to_stakeUpdateInput, dispatch_to_stakeUncheckedUpdateInput>
  }

  /**
   * dispatch_to_stake delete
   */
  export type dispatch_to_stakeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
    /**
     * Filter which dispatch_to_stake to delete.
     */
    where: dispatch_to_stakeWhereUniqueInput
  }

  /**
   * dispatch_to_stake deleteMany
   */
  export type dispatch_to_stakeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dispatch_to_stakes to delete
     */
    where?: dispatch_to_stakeWhereInput
  }

  /**
   * dispatch_to_stake without action
   */
  export type dispatch_to_stakeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_stake
     */
    select?: dispatch_to_stakeSelect<ExtArgs> | null
  }


  /**
   * Model dispatch_to_withdraw_queue
   */

  export type AggregateDispatch_to_withdraw_queue = {
    _count: Dispatch_to_withdraw_queueCountAggregateOutputType | null
    _avg: Dispatch_to_withdraw_queueAvgAggregateOutputType | null
    _sum: Dispatch_to_withdraw_queueSumAggregateOutputType | null
    _min: Dispatch_to_withdraw_queueMinAggregateOutputType | null
    _max: Dispatch_to_withdraw_queueMaxAggregateOutputType | null
  }

  export type Dispatch_to_withdraw_queueAvgAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: number | null
  }

  export type Dispatch_to_withdraw_queueSumAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: bigint | null
  }

  export type Dispatch_to_withdraw_queueMinAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    cursor: bigint | null
  }

  export type Dispatch_to_withdraw_queueMaxAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    cursor: bigint | null
  }

  export type Dispatch_to_withdraw_queueCountAggregateOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: number
    cursor: number
    _all: number
  }


  export type Dispatch_to_withdraw_queueAvgAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Dispatch_to_withdraw_queueSumAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Dispatch_to_withdraw_queueMinAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
  }

  export type Dispatch_to_withdraw_queueMaxAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
  }

  export type Dispatch_to_withdraw_queueCountAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
    _all?: true
  }

  export type Dispatch_to_withdraw_queueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dispatch_to_withdraw_queue to aggregate.
     */
    where?: dispatch_to_withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_withdraw_queues to fetch.
     */
    orderBy?: dispatch_to_withdraw_queueOrderByWithRelationInput | dispatch_to_withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: dispatch_to_withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_withdraw_queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned dispatch_to_withdraw_queues
    **/
    _count?: true | Dispatch_to_withdraw_queueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Dispatch_to_withdraw_queueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Dispatch_to_withdraw_queueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Dispatch_to_withdraw_queueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Dispatch_to_withdraw_queueMaxAggregateInputType
  }

  export type GetDispatch_to_withdraw_queueAggregateType<T extends Dispatch_to_withdraw_queueAggregateArgs> = {
        [P in keyof T & keyof AggregateDispatch_to_withdraw_queue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDispatch_to_withdraw_queue[P]>
      : GetScalarType<T[P], AggregateDispatch_to_withdraw_queue[P]>
  }




  export type dispatch_to_withdraw_queueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dispatch_to_withdraw_queueWhereInput
    orderBy?: dispatch_to_withdraw_queueOrderByWithAggregationInput | dispatch_to_withdraw_queueOrderByWithAggregationInput[]
    by: Dispatch_to_withdraw_queueScalarFieldEnum[] | Dispatch_to_withdraw_queueScalarFieldEnum
    having?: dispatch_to_withdraw_queueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Dispatch_to_withdraw_queueCountAggregateInputType | true
    _avg?: Dispatch_to_withdraw_queueAvgAggregateInputType
    _sum?: Dispatch_to_withdraw_queueSumAggregateInputType
    _min?: Dispatch_to_withdraw_queueMinAggregateInputType
    _max?: Dispatch_to_withdraw_queueMaxAggregateInputType
  }

  export type Dispatch_to_withdraw_queueGroupByOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: string
    cursor: bigint | null
    _count: Dispatch_to_withdraw_queueCountAggregateOutputType | null
    _avg: Dispatch_to_withdraw_queueAvgAggregateOutputType | null
    _sum: Dispatch_to_withdraw_queueSumAggregateOutputType | null
    _min: Dispatch_to_withdraw_queueMinAggregateOutputType | null
    _max: Dispatch_to_withdraw_queueMaxAggregateOutputType | null
  }

  type GetDispatch_to_withdraw_queueGroupByPayload<T extends dispatch_to_withdraw_queueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Dispatch_to_withdraw_queueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Dispatch_to_withdraw_queueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Dispatch_to_withdraw_queueGroupByOutputType[P]>
            : GetScalarType<T[P], Dispatch_to_withdraw_queueGroupByOutputType[P]>
        }
      >
    >


  export type dispatch_to_withdraw_queueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["dispatch_to_withdraw_queue"]>

  export type dispatch_to_withdraw_queueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["dispatch_to_withdraw_queue"]>

  export type dispatch_to_withdraw_queueSelectScalar = {
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }


  export type $dispatch_to_withdraw_queuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "dispatch_to_withdraw_queue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      block_number: number
      tx_index: number
      event_index: number
      amount: string
      cursor: bigint | null
    }, ExtArgs["result"]["dispatch_to_withdraw_queue"]>
    composites: {}
  }

  type dispatch_to_withdraw_queueGetPayload<S extends boolean | null | undefined | dispatch_to_withdraw_queueDefaultArgs> = $Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload, S>

  type dispatch_to_withdraw_queueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<dispatch_to_withdraw_queueFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Dispatch_to_withdraw_queueCountAggregateInputType | true
    }

  export interface dispatch_to_withdraw_queueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['dispatch_to_withdraw_queue'], meta: { name: 'dispatch_to_withdraw_queue' } }
    /**
     * Find zero or one Dispatch_to_withdraw_queue that matches the filter.
     * @param {dispatch_to_withdraw_queueFindUniqueArgs} args - Arguments to find a Dispatch_to_withdraw_queue
     * @example
     * // Get one Dispatch_to_withdraw_queue
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends dispatch_to_withdraw_queueFindUniqueArgs>(args: SelectSubset<T, dispatch_to_withdraw_queueFindUniqueArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Dispatch_to_withdraw_queue that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {dispatch_to_withdraw_queueFindUniqueOrThrowArgs} args - Arguments to find a Dispatch_to_withdraw_queue
     * @example
     * // Get one Dispatch_to_withdraw_queue
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends dispatch_to_withdraw_queueFindUniqueOrThrowArgs>(args: SelectSubset<T, dispatch_to_withdraw_queueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Dispatch_to_withdraw_queue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_withdraw_queueFindFirstArgs} args - Arguments to find a Dispatch_to_withdraw_queue
     * @example
     * // Get one Dispatch_to_withdraw_queue
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends dispatch_to_withdraw_queueFindFirstArgs>(args?: SelectSubset<T, dispatch_to_withdraw_queueFindFirstArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Dispatch_to_withdraw_queue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_withdraw_queueFindFirstOrThrowArgs} args - Arguments to find a Dispatch_to_withdraw_queue
     * @example
     * // Get one Dispatch_to_withdraw_queue
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends dispatch_to_withdraw_queueFindFirstOrThrowArgs>(args?: SelectSubset<T, dispatch_to_withdraw_queueFindFirstOrThrowArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Dispatch_to_withdraw_queues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_withdraw_queueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dispatch_to_withdraw_queues
     * const dispatch_to_withdraw_queues = await prisma.dispatch_to_withdraw_queue.findMany()
     * 
     * // Get first 10 Dispatch_to_withdraw_queues
     * const dispatch_to_withdraw_queues = await prisma.dispatch_to_withdraw_queue.findMany({ take: 10 })
     * 
     * // Only select the `block_number`
     * const dispatch_to_withdraw_queueWithBlock_numberOnly = await prisma.dispatch_to_withdraw_queue.findMany({ select: { block_number: true } })
     * 
     */
    findMany<T extends dispatch_to_withdraw_queueFindManyArgs>(args?: SelectSubset<T, dispatch_to_withdraw_queueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Dispatch_to_withdraw_queue.
     * @param {dispatch_to_withdraw_queueCreateArgs} args - Arguments to create a Dispatch_to_withdraw_queue.
     * @example
     * // Create one Dispatch_to_withdraw_queue
     * const Dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.create({
     *   data: {
     *     // ... data to create a Dispatch_to_withdraw_queue
     *   }
     * })
     * 
     */
    create<T extends dispatch_to_withdraw_queueCreateArgs>(args: SelectSubset<T, dispatch_to_withdraw_queueCreateArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Dispatch_to_withdraw_queues.
     * @param {dispatch_to_withdraw_queueCreateManyArgs} args - Arguments to create many Dispatch_to_withdraw_queues.
     * @example
     * // Create many Dispatch_to_withdraw_queues
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends dispatch_to_withdraw_queueCreateManyArgs>(args?: SelectSubset<T, dispatch_to_withdraw_queueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dispatch_to_withdraw_queues and returns the data saved in the database.
     * @param {dispatch_to_withdraw_queueCreateManyAndReturnArgs} args - Arguments to create many Dispatch_to_withdraw_queues.
     * @example
     * // Create many Dispatch_to_withdraw_queues
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dispatch_to_withdraw_queues and only return the `block_number`
     * const dispatch_to_withdraw_queueWithBlock_numberOnly = await prisma.dispatch_to_withdraw_queue.createManyAndReturn({ 
     *   select: { block_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends dispatch_to_withdraw_queueCreateManyAndReturnArgs>(args?: SelectSubset<T, dispatch_to_withdraw_queueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Dispatch_to_withdraw_queue.
     * @param {dispatch_to_withdraw_queueDeleteArgs} args - Arguments to delete one Dispatch_to_withdraw_queue.
     * @example
     * // Delete one Dispatch_to_withdraw_queue
     * const Dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.delete({
     *   where: {
     *     // ... filter to delete one Dispatch_to_withdraw_queue
     *   }
     * })
     * 
     */
    delete<T extends dispatch_to_withdraw_queueDeleteArgs>(args: SelectSubset<T, dispatch_to_withdraw_queueDeleteArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Dispatch_to_withdraw_queue.
     * @param {dispatch_to_withdraw_queueUpdateArgs} args - Arguments to update one Dispatch_to_withdraw_queue.
     * @example
     * // Update one Dispatch_to_withdraw_queue
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends dispatch_to_withdraw_queueUpdateArgs>(args: SelectSubset<T, dispatch_to_withdraw_queueUpdateArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Dispatch_to_withdraw_queues.
     * @param {dispatch_to_withdraw_queueDeleteManyArgs} args - Arguments to filter Dispatch_to_withdraw_queues to delete.
     * @example
     * // Delete a few Dispatch_to_withdraw_queues
     * const { count } = await prisma.dispatch_to_withdraw_queue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends dispatch_to_withdraw_queueDeleteManyArgs>(args?: SelectSubset<T, dispatch_to_withdraw_queueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dispatch_to_withdraw_queues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_withdraw_queueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dispatch_to_withdraw_queues
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends dispatch_to_withdraw_queueUpdateManyArgs>(args: SelectSubset<T, dispatch_to_withdraw_queueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dispatch_to_withdraw_queue.
     * @param {dispatch_to_withdraw_queueUpsertArgs} args - Arguments to update or create a Dispatch_to_withdraw_queue.
     * @example
     * // Update or create a Dispatch_to_withdraw_queue
     * const dispatch_to_withdraw_queue = await prisma.dispatch_to_withdraw_queue.upsert({
     *   create: {
     *     // ... data to create a Dispatch_to_withdraw_queue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dispatch_to_withdraw_queue we want to update
     *   }
     * })
     */
    upsert<T extends dispatch_to_withdraw_queueUpsertArgs>(args: SelectSubset<T, dispatch_to_withdraw_queueUpsertArgs<ExtArgs>>): Prisma__dispatch_to_withdraw_queueClient<$Result.GetResult<Prisma.$dispatch_to_withdraw_queuePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Dispatch_to_withdraw_queues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_withdraw_queueCountArgs} args - Arguments to filter Dispatch_to_withdraw_queues to count.
     * @example
     * // Count the number of Dispatch_to_withdraw_queues
     * const count = await prisma.dispatch_to_withdraw_queue.count({
     *   where: {
     *     // ... the filter for the Dispatch_to_withdraw_queues we want to count
     *   }
     * })
    **/
    count<T extends dispatch_to_withdraw_queueCountArgs>(
      args?: Subset<T, dispatch_to_withdraw_queueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Dispatch_to_withdraw_queueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dispatch_to_withdraw_queue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Dispatch_to_withdraw_queueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Dispatch_to_withdraw_queueAggregateArgs>(args: Subset<T, Dispatch_to_withdraw_queueAggregateArgs>): Prisma.PrismaPromise<GetDispatch_to_withdraw_queueAggregateType<T>>

    /**
     * Group by Dispatch_to_withdraw_queue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dispatch_to_withdraw_queueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends dispatch_to_withdraw_queueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: dispatch_to_withdraw_queueGroupByArgs['orderBy'] }
        : { orderBy?: dispatch_to_withdraw_queueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, dispatch_to_withdraw_queueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDispatch_to_withdraw_queueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the dispatch_to_withdraw_queue model
   */
  readonly fields: dispatch_to_withdraw_queueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for dispatch_to_withdraw_queue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__dispatch_to_withdraw_queueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the dispatch_to_withdraw_queue model
   */ 
  interface dispatch_to_withdraw_queueFieldRefs {
    readonly block_number: FieldRef<"dispatch_to_withdraw_queue", 'Int'>
    readonly tx_index: FieldRef<"dispatch_to_withdraw_queue", 'Int'>
    readonly event_index: FieldRef<"dispatch_to_withdraw_queue", 'Int'>
    readonly amount: FieldRef<"dispatch_to_withdraw_queue", 'String'>
    readonly cursor: FieldRef<"dispatch_to_withdraw_queue", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * dispatch_to_withdraw_queue findUnique
   */
  export type dispatch_to_withdraw_queueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_withdraw_queue to fetch.
     */
    where: dispatch_to_withdraw_queueWhereUniqueInput
  }

  /**
   * dispatch_to_withdraw_queue findUniqueOrThrow
   */
  export type dispatch_to_withdraw_queueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_withdraw_queue to fetch.
     */
    where: dispatch_to_withdraw_queueWhereUniqueInput
  }

  /**
   * dispatch_to_withdraw_queue findFirst
   */
  export type dispatch_to_withdraw_queueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_withdraw_queue to fetch.
     */
    where?: dispatch_to_withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_withdraw_queues to fetch.
     */
    orderBy?: dispatch_to_withdraw_queueOrderByWithRelationInput | dispatch_to_withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dispatch_to_withdraw_queues.
     */
    cursor?: dispatch_to_withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_withdraw_queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dispatch_to_withdraw_queues.
     */
    distinct?: Dispatch_to_withdraw_queueScalarFieldEnum | Dispatch_to_withdraw_queueScalarFieldEnum[]
  }

  /**
   * dispatch_to_withdraw_queue findFirstOrThrow
   */
  export type dispatch_to_withdraw_queueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_withdraw_queue to fetch.
     */
    where?: dispatch_to_withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_withdraw_queues to fetch.
     */
    orderBy?: dispatch_to_withdraw_queueOrderByWithRelationInput | dispatch_to_withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dispatch_to_withdraw_queues.
     */
    cursor?: dispatch_to_withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_withdraw_queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dispatch_to_withdraw_queues.
     */
    distinct?: Dispatch_to_withdraw_queueScalarFieldEnum | Dispatch_to_withdraw_queueScalarFieldEnum[]
  }

  /**
   * dispatch_to_withdraw_queue findMany
   */
  export type dispatch_to_withdraw_queueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter, which dispatch_to_withdraw_queues to fetch.
     */
    where?: dispatch_to_withdraw_queueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dispatch_to_withdraw_queues to fetch.
     */
    orderBy?: dispatch_to_withdraw_queueOrderByWithRelationInput | dispatch_to_withdraw_queueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing dispatch_to_withdraw_queues.
     */
    cursor?: dispatch_to_withdraw_queueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dispatch_to_withdraw_queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dispatch_to_withdraw_queues.
     */
    skip?: number
    distinct?: Dispatch_to_withdraw_queueScalarFieldEnum | Dispatch_to_withdraw_queueScalarFieldEnum[]
  }

  /**
   * dispatch_to_withdraw_queue create
   */
  export type dispatch_to_withdraw_queueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * The data needed to create a dispatch_to_withdraw_queue.
     */
    data: XOR<dispatch_to_withdraw_queueCreateInput, dispatch_to_withdraw_queueUncheckedCreateInput>
  }

  /**
   * dispatch_to_withdraw_queue createMany
   */
  export type dispatch_to_withdraw_queueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many dispatch_to_withdraw_queues.
     */
    data: dispatch_to_withdraw_queueCreateManyInput | dispatch_to_withdraw_queueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dispatch_to_withdraw_queue createManyAndReturn
   */
  export type dispatch_to_withdraw_queueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many dispatch_to_withdraw_queues.
     */
    data: dispatch_to_withdraw_queueCreateManyInput | dispatch_to_withdraw_queueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dispatch_to_withdraw_queue update
   */
  export type dispatch_to_withdraw_queueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * The data needed to update a dispatch_to_withdraw_queue.
     */
    data: XOR<dispatch_to_withdraw_queueUpdateInput, dispatch_to_withdraw_queueUncheckedUpdateInput>
    /**
     * Choose, which dispatch_to_withdraw_queue to update.
     */
    where: dispatch_to_withdraw_queueWhereUniqueInput
  }

  /**
   * dispatch_to_withdraw_queue updateMany
   */
  export type dispatch_to_withdraw_queueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update dispatch_to_withdraw_queues.
     */
    data: XOR<dispatch_to_withdraw_queueUpdateManyMutationInput, dispatch_to_withdraw_queueUncheckedUpdateManyInput>
    /**
     * Filter which dispatch_to_withdraw_queues to update
     */
    where?: dispatch_to_withdraw_queueWhereInput
  }

  /**
   * dispatch_to_withdraw_queue upsert
   */
  export type dispatch_to_withdraw_queueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * The filter to search for the dispatch_to_withdraw_queue to update in case it exists.
     */
    where: dispatch_to_withdraw_queueWhereUniqueInput
    /**
     * In case the dispatch_to_withdraw_queue found by the `where` argument doesn't exist, create a new dispatch_to_withdraw_queue with this data.
     */
    create: XOR<dispatch_to_withdraw_queueCreateInput, dispatch_to_withdraw_queueUncheckedCreateInput>
    /**
     * In case the dispatch_to_withdraw_queue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<dispatch_to_withdraw_queueUpdateInput, dispatch_to_withdraw_queueUncheckedUpdateInput>
  }

  /**
   * dispatch_to_withdraw_queue delete
   */
  export type dispatch_to_withdraw_queueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
    /**
     * Filter which dispatch_to_withdraw_queue to delete.
     */
    where: dispatch_to_withdraw_queueWhereUniqueInput
  }

  /**
   * dispatch_to_withdraw_queue deleteMany
   */
  export type dispatch_to_withdraw_queueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dispatch_to_withdraw_queues to delete
     */
    where?: dispatch_to_withdraw_queueWhereInput
  }

  /**
   * dispatch_to_withdraw_queue without action
   */
  export type dispatch_to_withdraw_queueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dispatch_to_withdraw_queue
     */
    select?: dispatch_to_withdraw_queueSelect<ExtArgs> | null
  }


  /**
   * Model unstake_action
   */

  export type AggregateUnstake_action = {
    _count: Unstake_actionCountAggregateOutputType | null
    _avg: Unstake_actionAvgAggregateOutputType | null
    _sum: Unstake_actionSumAggregateOutputType | null
    _min: Unstake_actionMinAggregateOutputType | null
    _max: Unstake_actionMaxAggregateOutputType | null
  }

  export type Unstake_actionAvgAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: number | null
  }

  export type Unstake_actionSumAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: bigint | null
  }

  export type Unstake_actionMinAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    cursor: bigint | null
  }

  export type Unstake_actionMaxAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    cursor: bigint | null
  }

  export type Unstake_actionCountAggregateOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: number
    cursor: number
    _all: number
  }


  export type Unstake_actionAvgAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Unstake_actionSumAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Unstake_actionMinAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
  }

  export type Unstake_actionMaxAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
  }

  export type Unstake_actionCountAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
    _all?: true
  }

  export type Unstake_actionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which unstake_action to aggregate.
     */
    where?: unstake_actionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_actions to fetch.
     */
    orderBy?: unstake_actionOrderByWithRelationInput | unstake_actionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: unstake_actionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_actions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned unstake_actions
    **/
    _count?: true | Unstake_actionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Unstake_actionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Unstake_actionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Unstake_actionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Unstake_actionMaxAggregateInputType
  }

  export type GetUnstake_actionAggregateType<T extends Unstake_actionAggregateArgs> = {
        [P in keyof T & keyof AggregateUnstake_action]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnstake_action[P]>
      : GetScalarType<T[P], AggregateUnstake_action[P]>
  }




  export type unstake_actionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: unstake_actionWhereInput
    orderBy?: unstake_actionOrderByWithAggregationInput | unstake_actionOrderByWithAggregationInput[]
    by: Unstake_actionScalarFieldEnum[] | Unstake_actionScalarFieldEnum
    having?: unstake_actionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Unstake_actionCountAggregateInputType | true
    _avg?: Unstake_actionAvgAggregateInputType
    _sum?: Unstake_actionSumAggregateInputType
    _min?: Unstake_actionMinAggregateInputType
    _max?: Unstake_actionMaxAggregateInputType
  }

  export type Unstake_actionGroupByOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: string
    cursor: bigint | null
    _count: Unstake_actionCountAggregateOutputType | null
    _avg: Unstake_actionAvgAggregateOutputType | null
    _sum: Unstake_actionSumAggregateOutputType | null
    _min: Unstake_actionMinAggregateOutputType | null
    _max: Unstake_actionMaxAggregateOutputType | null
  }

  type GetUnstake_actionGroupByPayload<T extends unstake_actionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Unstake_actionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Unstake_actionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Unstake_actionGroupByOutputType[P]>
            : GetScalarType<T[P], Unstake_actionGroupByOutputType[P]>
        }
      >
    >


  export type unstake_actionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["unstake_action"]>

  export type unstake_actionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["unstake_action"]>

  export type unstake_actionSelectScalar = {
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }


  export type $unstake_actionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "unstake_action"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      block_number: number
      tx_index: number
      event_index: number
      amount: string
      cursor: bigint | null
    }, ExtArgs["result"]["unstake_action"]>
    composites: {}
  }

  type unstake_actionGetPayload<S extends boolean | null | undefined | unstake_actionDefaultArgs> = $Result.GetResult<Prisma.$unstake_actionPayload, S>

  type unstake_actionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<unstake_actionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Unstake_actionCountAggregateInputType | true
    }

  export interface unstake_actionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['unstake_action'], meta: { name: 'unstake_action' } }
    /**
     * Find zero or one Unstake_action that matches the filter.
     * @param {unstake_actionFindUniqueArgs} args - Arguments to find a Unstake_action
     * @example
     * // Get one Unstake_action
     * const unstake_action = await prisma.unstake_action.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends unstake_actionFindUniqueArgs>(args: SelectSubset<T, unstake_actionFindUniqueArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Unstake_action that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {unstake_actionFindUniqueOrThrowArgs} args - Arguments to find a Unstake_action
     * @example
     * // Get one Unstake_action
     * const unstake_action = await prisma.unstake_action.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends unstake_actionFindUniqueOrThrowArgs>(args: SelectSubset<T, unstake_actionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Unstake_action that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_actionFindFirstArgs} args - Arguments to find a Unstake_action
     * @example
     * // Get one Unstake_action
     * const unstake_action = await prisma.unstake_action.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends unstake_actionFindFirstArgs>(args?: SelectSubset<T, unstake_actionFindFirstArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Unstake_action that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_actionFindFirstOrThrowArgs} args - Arguments to find a Unstake_action
     * @example
     * // Get one Unstake_action
     * const unstake_action = await prisma.unstake_action.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends unstake_actionFindFirstOrThrowArgs>(args?: SelectSubset<T, unstake_actionFindFirstOrThrowArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Unstake_actions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_actionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Unstake_actions
     * const unstake_actions = await prisma.unstake_action.findMany()
     * 
     * // Get first 10 Unstake_actions
     * const unstake_actions = await prisma.unstake_action.findMany({ take: 10 })
     * 
     * // Only select the `block_number`
     * const unstake_actionWithBlock_numberOnly = await prisma.unstake_action.findMany({ select: { block_number: true } })
     * 
     */
    findMany<T extends unstake_actionFindManyArgs>(args?: SelectSubset<T, unstake_actionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Unstake_action.
     * @param {unstake_actionCreateArgs} args - Arguments to create a Unstake_action.
     * @example
     * // Create one Unstake_action
     * const Unstake_action = await prisma.unstake_action.create({
     *   data: {
     *     // ... data to create a Unstake_action
     *   }
     * })
     * 
     */
    create<T extends unstake_actionCreateArgs>(args: SelectSubset<T, unstake_actionCreateArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Unstake_actions.
     * @param {unstake_actionCreateManyArgs} args - Arguments to create many Unstake_actions.
     * @example
     * // Create many Unstake_actions
     * const unstake_action = await prisma.unstake_action.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends unstake_actionCreateManyArgs>(args?: SelectSubset<T, unstake_actionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Unstake_actions and returns the data saved in the database.
     * @param {unstake_actionCreateManyAndReturnArgs} args - Arguments to create many Unstake_actions.
     * @example
     * // Create many Unstake_actions
     * const unstake_action = await prisma.unstake_action.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Unstake_actions and only return the `block_number`
     * const unstake_actionWithBlock_numberOnly = await prisma.unstake_action.createManyAndReturn({ 
     *   select: { block_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends unstake_actionCreateManyAndReturnArgs>(args?: SelectSubset<T, unstake_actionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Unstake_action.
     * @param {unstake_actionDeleteArgs} args - Arguments to delete one Unstake_action.
     * @example
     * // Delete one Unstake_action
     * const Unstake_action = await prisma.unstake_action.delete({
     *   where: {
     *     // ... filter to delete one Unstake_action
     *   }
     * })
     * 
     */
    delete<T extends unstake_actionDeleteArgs>(args: SelectSubset<T, unstake_actionDeleteArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Unstake_action.
     * @param {unstake_actionUpdateArgs} args - Arguments to update one Unstake_action.
     * @example
     * // Update one Unstake_action
     * const unstake_action = await prisma.unstake_action.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends unstake_actionUpdateArgs>(args: SelectSubset<T, unstake_actionUpdateArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Unstake_actions.
     * @param {unstake_actionDeleteManyArgs} args - Arguments to filter Unstake_actions to delete.
     * @example
     * // Delete a few Unstake_actions
     * const { count } = await prisma.unstake_action.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends unstake_actionDeleteManyArgs>(args?: SelectSubset<T, unstake_actionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Unstake_actions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_actionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Unstake_actions
     * const unstake_action = await prisma.unstake_action.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends unstake_actionUpdateManyArgs>(args: SelectSubset<T, unstake_actionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Unstake_action.
     * @param {unstake_actionUpsertArgs} args - Arguments to update or create a Unstake_action.
     * @example
     * // Update or create a Unstake_action
     * const unstake_action = await prisma.unstake_action.upsert({
     *   create: {
     *     // ... data to create a Unstake_action
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Unstake_action we want to update
     *   }
     * })
     */
    upsert<T extends unstake_actionUpsertArgs>(args: SelectSubset<T, unstake_actionUpsertArgs<ExtArgs>>): Prisma__unstake_actionClient<$Result.GetResult<Prisma.$unstake_actionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Unstake_actions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_actionCountArgs} args - Arguments to filter Unstake_actions to count.
     * @example
     * // Count the number of Unstake_actions
     * const count = await prisma.unstake_action.count({
     *   where: {
     *     // ... the filter for the Unstake_actions we want to count
     *   }
     * })
    **/
    count<T extends unstake_actionCountArgs>(
      args?: Subset<T, unstake_actionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Unstake_actionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Unstake_action.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Unstake_actionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Unstake_actionAggregateArgs>(args: Subset<T, Unstake_actionAggregateArgs>): Prisma.PrismaPromise<GetUnstake_actionAggregateType<T>>

    /**
     * Group by Unstake_action.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_actionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends unstake_actionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: unstake_actionGroupByArgs['orderBy'] }
        : { orderBy?: unstake_actionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, unstake_actionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnstake_actionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the unstake_action model
   */
  readonly fields: unstake_actionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for unstake_action.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__unstake_actionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the unstake_action model
   */ 
  interface unstake_actionFieldRefs {
    readonly block_number: FieldRef<"unstake_action", 'Int'>
    readonly tx_index: FieldRef<"unstake_action", 'Int'>
    readonly event_index: FieldRef<"unstake_action", 'Int'>
    readonly amount: FieldRef<"unstake_action", 'String'>
    readonly cursor: FieldRef<"unstake_action", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * unstake_action findUnique
   */
  export type unstake_actionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * Filter, which unstake_action to fetch.
     */
    where: unstake_actionWhereUniqueInput
  }

  /**
   * unstake_action findUniqueOrThrow
   */
  export type unstake_actionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * Filter, which unstake_action to fetch.
     */
    where: unstake_actionWhereUniqueInput
  }

  /**
   * unstake_action findFirst
   */
  export type unstake_actionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * Filter, which unstake_action to fetch.
     */
    where?: unstake_actionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_actions to fetch.
     */
    orderBy?: unstake_actionOrderByWithRelationInput | unstake_actionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for unstake_actions.
     */
    cursor?: unstake_actionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_actions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of unstake_actions.
     */
    distinct?: Unstake_actionScalarFieldEnum | Unstake_actionScalarFieldEnum[]
  }

  /**
   * unstake_action findFirstOrThrow
   */
  export type unstake_actionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * Filter, which unstake_action to fetch.
     */
    where?: unstake_actionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_actions to fetch.
     */
    orderBy?: unstake_actionOrderByWithRelationInput | unstake_actionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for unstake_actions.
     */
    cursor?: unstake_actionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_actions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of unstake_actions.
     */
    distinct?: Unstake_actionScalarFieldEnum | Unstake_actionScalarFieldEnum[]
  }

  /**
   * unstake_action findMany
   */
  export type unstake_actionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * Filter, which unstake_actions to fetch.
     */
    where?: unstake_actionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_actions to fetch.
     */
    orderBy?: unstake_actionOrderByWithRelationInput | unstake_actionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing unstake_actions.
     */
    cursor?: unstake_actionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_actions.
     */
    skip?: number
    distinct?: Unstake_actionScalarFieldEnum | Unstake_actionScalarFieldEnum[]
  }

  /**
   * unstake_action create
   */
  export type unstake_actionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * The data needed to create a unstake_action.
     */
    data: XOR<unstake_actionCreateInput, unstake_actionUncheckedCreateInput>
  }

  /**
   * unstake_action createMany
   */
  export type unstake_actionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many unstake_actions.
     */
    data: unstake_actionCreateManyInput | unstake_actionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * unstake_action createManyAndReturn
   */
  export type unstake_actionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many unstake_actions.
     */
    data: unstake_actionCreateManyInput | unstake_actionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * unstake_action update
   */
  export type unstake_actionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * The data needed to update a unstake_action.
     */
    data: XOR<unstake_actionUpdateInput, unstake_actionUncheckedUpdateInput>
    /**
     * Choose, which unstake_action to update.
     */
    where: unstake_actionWhereUniqueInput
  }

  /**
   * unstake_action updateMany
   */
  export type unstake_actionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update unstake_actions.
     */
    data: XOR<unstake_actionUpdateManyMutationInput, unstake_actionUncheckedUpdateManyInput>
    /**
     * Filter which unstake_actions to update
     */
    where?: unstake_actionWhereInput
  }

  /**
   * unstake_action upsert
   */
  export type unstake_actionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * The filter to search for the unstake_action to update in case it exists.
     */
    where: unstake_actionWhereUniqueInput
    /**
     * In case the unstake_action found by the `where` argument doesn't exist, create a new unstake_action with this data.
     */
    create: XOR<unstake_actionCreateInput, unstake_actionUncheckedCreateInput>
    /**
     * In case the unstake_action was found with the provided `where` argument, update it with this data.
     */
    update: XOR<unstake_actionUpdateInput, unstake_actionUncheckedUpdateInput>
  }

  /**
   * unstake_action delete
   */
  export type unstake_actionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
    /**
     * Filter which unstake_action to delete.
     */
    where: unstake_actionWhereUniqueInput
  }

  /**
   * unstake_action deleteMany
   */
  export type unstake_actionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which unstake_actions to delete
     */
    where?: unstake_actionWhereInput
  }

  /**
   * unstake_action without action
   */
  export type unstake_actionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_action
     */
    select?: unstake_actionSelect<ExtArgs> | null
  }


  /**
   * Model unstake_intent_started
   */

  export type AggregateUnstake_intent_started = {
    _count: Unstake_intent_startedCountAggregateOutputType | null
    _avg: Unstake_intent_startedAvgAggregateOutputType | null
    _sum: Unstake_intent_startedSumAggregateOutputType | null
    _min: Unstake_intent_startedMinAggregateOutputType | null
    _max: Unstake_intent_startedMaxAggregateOutputType | null
  }

  export type Unstake_intent_startedAvgAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: number | null
  }

  export type Unstake_intent_startedSumAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    cursor: bigint | null
  }

  export type Unstake_intent_startedMinAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    cursor: bigint | null
  }

  export type Unstake_intent_startedMaxAggregateOutputType = {
    block_number: number | null
    tx_index: number | null
    event_index: number | null
    amount: string | null
    cursor: bigint | null
  }

  export type Unstake_intent_startedCountAggregateOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: number
    cursor: number
    _all: number
  }


  export type Unstake_intent_startedAvgAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Unstake_intent_startedSumAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    cursor?: true
  }

  export type Unstake_intent_startedMinAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
  }

  export type Unstake_intent_startedMaxAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
  }

  export type Unstake_intent_startedCountAggregateInputType = {
    block_number?: true
    tx_index?: true
    event_index?: true
    amount?: true
    cursor?: true
    _all?: true
  }

  export type Unstake_intent_startedAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which unstake_intent_started to aggregate.
     */
    where?: unstake_intent_startedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_intent_starteds to fetch.
     */
    orderBy?: unstake_intent_startedOrderByWithRelationInput | unstake_intent_startedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: unstake_intent_startedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_intent_starteds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_intent_starteds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned unstake_intent_starteds
    **/
    _count?: true | Unstake_intent_startedCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Unstake_intent_startedAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Unstake_intent_startedSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Unstake_intent_startedMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Unstake_intent_startedMaxAggregateInputType
  }

  export type GetUnstake_intent_startedAggregateType<T extends Unstake_intent_startedAggregateArgs> = {
        [P in keyof T & keyof AggregateUnstake_intent_started]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnstake_intent_started[P]>
      : GetScalarType<T[P], AggregateUnstake_intent_started[P]>
  }




  export type unstake_intent_startedGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: unstake_intent_startedWhereInput
    orderBy?: unstake_intent_startedOrderByWithAggregationInput | unstake_intent_startedOrderByWithAggregationInput[]
    by: Unstake_intent_startedScalarFieldEnum[] | Unstake_intent_startedScalarFieldEnum
    having?: unstake_intent_startedScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Unstake_intent_startedCountAggregateInputType | true
    _avg?: Unstake_intent_startedAvgAggregateInputType
    _sum?: Unstake_intent_startedSumAggregateInputType
    _min?: Unstake_intent_startedMinAggregateInputType
    _max?: Unstake_intent_startedMaxAggregateInputType
  }

  export type Unstake_intent_startedGroupByOutputType = {
    block_number: number
    tx_index: number
    event_index: number
    amount: string
    cursor: bigint | null
    _count: Unstake_intent_startedCountAggregateOutputType | null
    _avg: Unstake_intent_startedAvgAggregateOutputType | null
    _sum: Unstake_intent_startedSumAggregateOutputType | null
    _min: Unstake_intent_startedMinAggregateOutputType | null
    _max: Unstake_intent_startedMaxAggregateOutputType | null
  }

  type GetUnstake_intent_startedGroupByPayload<T extends unstake_intent_startedGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Unstake_intent_startedGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Unstake_intent_startedGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Unstake_intent_startedGroupByOutputType[P]>
            : GetScalarType<T[P], Unstake_intent_startedGroupByOutputType[P]>
        }
      >
    >


  export type unstake_intent_startedSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["unstake_intent_started"]>

  export type unstake_intent_startedSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }, ExtArgs["result"]["unstake_intent_started"]>

  export type unstake_intent_startedSelectScalar = {
    block_number?: boolean
    tx_index?: boolean
    event_index?: boolean
    amount?: boolean
    cursor?: boolean
  }


  export type $unstake_intent_startedPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "unstake_intent_started"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      block_number: number
      tx_index: number
      event_index: number
      amount: string
      cursor: bigint | null
    }, ExtArgs["result"]["unstake_intent_started"]>
    composites: {}
  }

  type unstake_intent_startedGetPayload<S extends boolean | null | undefined | unstake_intent_startedDefaultArgs> = $Result.GetResult<Prisma.$unstake_intent_startedPayload, S>

  type unstake_intent_startedCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<unstake_intent_startedFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Unstake_intent_startedCountAggregateInputType | true
    }

  export interface unstake_intent_startedDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['unstake_intent_started'], meta: { name: 'unstake_intent_started' } }
    /**
     * Find zero or one Unstake_intent_started that matches the filter.
     * @param {unstake_intent_startedFindUniqueArgs} args - Arguments to find a Unstake_intent_started
     * @example
     * // Get one Unstake_intent_started
     * const unstake_intent_started = await prisma.unstake_intent_started.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends unstake_intent_startedFindUniqueArgs>(args: SelectSubset<T, unstake_intent_startedFindUniqueArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Unstake_intent_started that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {unstake_intent_startedFindUniqueOrThrowArgs} args - Arguments to find a Unstake_intent_started
     * @example
     * // Get one Unstake_intent_started
     * const unstake_intent_started = await prisma.unstake_intent_started.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends unstake_intent_startedFindUniqueOrThrowArgs>(args: SelectSubset<T, unstake_intent_startedFindUniqueOrThrowArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Unstake_intent_started that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_intent_startedFindFirstArgs} args - Arguments to find a Unstake_intent_started
     * @example
     * // Get one Unstake_intent_started
     * const unstake_intent_started = await prisma.unstake_intent_started.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends unstake_intent_startedFindFirstArgs>(args?: SelectSubset<T, unstake_intent_startedFindFirstArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Unstake_intent_started that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_intent_startedFindFirstOrThrowArgs} args - Arguments to find a Unstake_intent_started
     * @example
     * // Get one Unstake_intent_started
     * const unstake_intent_started = await prisma.unstake_intent_started.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends unstake_intent_startedFindFirstOrThrowArgs>(args?: SelectSubset<T, unstake_intent_startedFindFirstOrThrowArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Unstake_intent_starteds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_intent_startedFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Unstake_intent_starteds
     * const unstake_intent_starteds = await prisma.unstake_intent_started.findMany()
     * 
     * // Get first 10 Unstake_intent_starteds
     * const unstake_intent_starteds = await prisma.unstake_intent_started.findMany({ take: 10 })
     * 
     * // Only select the `block_number`
     * const unstake_intent_startedWithBlock_numberOnly = await prisma.unstake_intent_started.findMany({ select: { block_number: true } })
     * 
     */
    findMany<T extends unstake_intent_startedFindManyArgs>(args?: SelectSubset<T, unstake_intent_startedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Unstake_intent_started.
     * @param {unstake_intent_startedCreateArgs} args - Arguments to create a Unstake_intent_started.
     * @example
     * // Create one Unstake_intent_started
     * const Unstake_intent_started = await prisma.unstake_intent_started.create({
     *   data: {
     *     // ... data to create a Unstake_intent_started
     *   }
     * })
     * 
     */
    create<T extends unstake_intent_startedCreateArgs>(args: SelectSubset<T, unstake_intent_startedCreateArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Unstake_intent_starteds.
     * @param {unstake_intent_startedCreateManyArgs} args - Arguments to create many Unstake_intent_starteds.
     * @example
     * // Create many Unstake_intent_starteds
     * const unstake_intent_started = await prisma.unstake_intent_started.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends unstake_intent_startedCreateManyArgs>(args?: SelectSubset<T, unstake_intent_startedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Unstake_intent_starteds and returns the data saved in the database.
     * @param {unstake_intent_startedCreateManyAndReturnArgs} args - Arguments to create many Unstake_intent_starteds.
     * @example
     * // Create many Unstake_intent_starteds
     * const unstake_intent_started = await prisma.unstake_intent_started.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Unstake_intent_starteds and only return the `block_number`
     * const unstake_intent_startedWithBlock_numberOnly = await prisma.unstake_intent_started.createManyAndReturn({ 
     *   select: { block_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends unstake_intent_startedCreateManyAndReturnArgs>(args?: SelectSubset<T, unstake_intent_startedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Unstake_intent_started.
     * @param {unstake_intent_startedDeleteArgs} args - Arguments to delete one Unstake_intent_started.
     * @example
     * // Delete one Unstake_intent_started
     * const Unstake_intent_started = await prisma.unstake_intent_started.delete({
     *   where: {
     *     // ... filter to delete one Unstake_intent_started
     *   }
     * })
     * 
     */
    delete<T extends unstake_intent_startedDeleteArgs>(args: SelectSubset<T, unstake_intent_startedDeleteArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Unstake_intent_started.
     * @param {unstake_intent_startedUpdateArgs} args - Arguments to update one Unstake_intent_started.
     * @example
     * // Update one Unstake_intent_started
     * const unstake_intent_started = await prisma.unstake_intent_started.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends unstake_intent_startedUpdateArgs>(args: SelectSubset<T, unstake_intent_startedUpdateArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Unstake_intent_starteds.
     * @param {unstake_intent_startedDeleteManyArgs} args - Arguments to filter Unstake_intent_starteds to delete.
     * @example
     * // Delete a few Unstake_intent_starteds
     * const { count } = await prisma.unstake_intent_started.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends unstake_intent_startedDeleteManyArgs>(args?: SelectSubset<T, unstake_intent_startedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Unstake_intent_starteds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_intent_startedUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Unstake_intent_starteds
     * const unstake_intent_started = await prisma.unstake_intent_started.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends unstake_intent_startedUpdateManyArgs>(args: SelectSubset<T, unstake_intent_startedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Unstake_intent_started.
     * @param {unstake_intent_startedUpsertArgs} args - Arguments to update or create a Unstake_intent_started.
     * @example
     * // Update or create a Unstake_intent_started
     * const unstake_intent_started = await prisma.unstake_intent_started.upsert({
     *   create: {
     *     // ... data to create a Unstake_intent_started
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Unstake_intent_started we want to update
     *   }
     * })
     */
    upsert<T extends unstake_intent_startedUpsertArgs>(args: SelectSubset<T, unstake_intent_startedUpsertArgs<ExtArgs>>): Prisma__unstake_intent_startedClient<$Result.GetResult<Prisma.$unstake_intent_startedPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Unstake_intent_starteds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_intent_startedCountArgs} args - Arguments to filter Unstake_intent_starteds to count.
     * @example
     * // Count the number of Unstake_intent_starteds
     * const count = await prisma.unstake_intent_started.count({
     *   where: {
     *     // ... the filter for the Unstake_intent_starteds we want to count
     *   }
     * })
    **/
    count<T extends unstake_intent_startedCountArgs>(
      args?: Subset<T, unstake_intent_startedCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Unstake_intent_startedCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Unstake_intent_started.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Unstake_intent_startedAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Unstake_intent_startedAggregateArgs>(args: Subset<T, Unstake_intent_startedAggregateArgs>): Prisma.PrismaPromise<GetUnstake_intent_startedAggregateType<T>>

    /**
     * Group by Unstake_intent_started.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unstake_intent_startedGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends unstake_intent_startedGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: unstake_intent_startedGroupByArgs['orderBy'] }
        : { orderBy?: unstake_intent_startedGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, unstake_intent_startedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnstake_intent_startedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the unstake_intent_started model
   */
  readonly fields: unstake_intent_startedFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for unstake_intent_started.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__unstake_intent_startedClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the unstake_intent_started model
   */ 
  interface unstake_intent_startedFieldRefs {
    readonly block_number: FieldRef<"unstake_intent_started", 'Int'>
    readonly tx_index: FieldRef<"unstake_intent_started", 'Int'>
    readonly event_index: FieldRef<"unstake_intent_started", 'Int'>
    readonly amount: FieldRef<"unstake_intent_started", 'String'>
    readonly cursor: FieldRef<"unstake_intent_started", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * unstake_intent_started findUnique
   */
  export type unstake_intent_startedFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * Filter, which unstake_intent_started to fetch.
     */
    where: unstake_intent_startedWhereUniqueInput
  }

  /**
   * unstake_intent_started findUniqueOrThrow
   */
  export type unstake_intent_startedFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * Filter, which unstake_intent_started to fetch.
     */
    where: unstake_intent_startedWhereUniqueInput
  }

  /**
   * unstake_intent_started findFirst
   */
  export type unstake_intent_startedFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * Filter, which unstake_intent_started to fetch.
     */
    where?: unstake_intent_startedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_intent_starteds to fetch.
     */
    orderBy?: unstake_intent_startedOrderByWithRelationInput | unstake_intent_startedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for unstake_intent_starteds.
     */
    cursor?: unstake_intent_startedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_intent_starteds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_intent_starteds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of unstake_intent_starteds.
     */
    distinct?: Unstake_intent_startedScalarFieldEnum | Unstake_intent_startedScalarFieldEnum[]
  }

  /**
   * unstake_intent_started findFirstOrThrow
   */
  export type unstake_intent_startedFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * Filter, which unstake_intent_started to fetch.
     */
    where?: unstake_intent_startedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_intent_starteds to fetch.
     */
    orderBy?: unstake_intent_startedOrderByWithRelationInput | unstake_intent_startedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for unstake_intent_starteds.
     */
    cursor?: unstake_intent_startedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_intent_starteds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_intent_starteds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of unstake_intent_starteds.
     */
    distinct?: Unstake_intent_startedScalarFieldEnum | Unstake_intent_startedScalarFieldEnum[]
  }

  /**
   * unstake_intent_started findMany
   */
  export type unstake_intent_startedFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * Filter, which unstake_intent_starteds to fetch.
     */
    where?: unstake_intent_startedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unstake_intent_starteds to fetch.
     */
    orderBy?: unstake_intent_startedOrderByWithRelationInput | unstake_intent_startedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing unstake_intent_starteds.
     */
    cursor?: unstake_intent_startedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unstake_intent_starteds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unstake_intent_starteds.
     */
    skip?: number
    distinct?: Unstake_intent_startedScalarFieldEnum | Unstake_intent_startedScalarFieldEnum[]
  }

  /**
   * unstake_intent_started create
   */
  export type unstake_intent_startedCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * The data needed to create a unstake_intent_started.
     */
    data: XOR<unstake_intent_startedCreateInput, unstake_intent_startedUncheckedCreateInput>
  }

  /**
   * unstake_intent_started createMany
   */
  export type unstake_intent_startedCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many unstake_intent_starteds.
     */
    data: unstake_intent_startedCreateManyInput | unstake_intent_startedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * unstake_intent_started createManyAndReturn
   */
  export type unstake_intent_startedCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many unstake_intent_starteds.
     */
    data: unstake_intent_startedCreateManyInput | unstake_intent_startedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * unstake_intent_started update
   */
  export type unstake_intent_startedUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * The data needed to update a unstake_intent_started.
     */
    data: XOR<unstake_intent_startedUpdateInput, unstake_intent_startedUncheckedUpdateInput>
    /**
     * Choose, which unstake_intent_started to update.
     */
    where: unstake_intent_startedWhereUniqueInput
  }

  /**
   * unstake_intent_started updateMany
   */
  export type unstake_intent_startedUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update unstake_intent_starteds.
     */
    data: XOR<unstake_intent_startedUpdateManyMutationInput, unstake_intent_startedUncheckedUpdateManyInput>
    /**
     * Filter which unstake_intent_starteds to update
     */
    where?: unstake_intent_startedWhereInput
  }

  /**
   * unstake_intent_started upsert
   */
  export type unstake_intent_startedUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * The filter to search for the unstake_intent_started to update in case it exists.
     */
    where: unstake_intent_startedWhereUniqueInput
    /**
     * In case the unstake_intent_started found by the `where` argument doesn't exist, create a new unstake_intent_started with this data.
     */
    create: XOR<unstake_intent_startedCreateInput, unstake_intent_startedUncheckedCreateInput>
    /**
     * In case the unstake_intent_started was found with the provided `where` argument, update it with this data.
     */
    update: XOR<unstake_intent_startedUpdateInput, unstake_intent_startedUncheckedUpdateInput>
  }

  /**
   * unstake_intent_started delete
   */
  export type unstake_intent_startedDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
    /**
     * Filter which unstake_intent_started to delete.
     */
    where: unstake_intent_startedWhereUniqueInput
  }

  /**
   * unstake_intent_started deleteMany
   */
  export type unstake_intent_startedDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which unstake_intent_starteds to delete
     */
    where?: unstake_intent_startedWhereInput
  }

  /**
   * unstake_intent_started without action
   */
  export type unstake_intent_startedDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unstake_intent_started
     */
    select?: unstake_intent_startedSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DepositsScalarFieldEnum: {
    block_number: 'block_number',
    tx_index: 'tx_index',
    event_index: 'event_index',
    timestamp: 'timestamp',
    sender: 'sender',
    owner: 'owner',
    assets: 'assets',
    shares: 'shares',
    cursor: 'cursor'
  };

  export type DepositsScalarFieldEnum = (typeof DepositsScalarFieldEnum)[keyof typeof DepositsScalarFieldEnum]


  export const Withdraw_queueScalarFieldEnum: {
    block_number: 'block_number',
    tx_index: 'tx_index',
    event_index: 'event_index',
    tx_hash: 'tx_hash',
    caller: 'caller',
    amount_strk: 'amount_strk',
    amount_kstrk: 'amount_kstrk',
    request_id: 'request_id',
    is_claimed: 'is_claimed',
    claim_time: 'claim_time',
    receiver: 'receiver',
    is_rejected: 'is_rejected',
    timestamp: 'timestamp',
    cursor: 'cursor'
  };

  export type Withdraw_queueScalarFieldEnum = (typeof Withdraw_queueScalarFieldEnum)[keyof typeof Withdraw_queueScalarFieldEnum]


  export const Received_fundsScalarFieldEnum: {
    block_number: 'block_number',
    tx_index: 'tx_index',
    event_index: 'event_index',
    amount: 'amount',
    sender: 'sender',
    unprocessed: 'unprocessed',
    intransit: 'intransit',
    timestamp: 'timestamp',
    cursor: 'cursor'
  };

  export type Received_fundsScalarFieldEnum = (typeof Received_fundsScalarFieldEnum)[keyof typeof Received_fundsScalarFieldEnum]


  export const Dispatch_to_stakeScalarFieldEnum: {
    block_number: 'block_number',
    tx_index: 'tx_index',
    event_index: 'event_index',
    delegator: 'delegator',
    amount: 'amount',
    cursor: 'cursor',
    timestamp: 'timestamp'
  };

  export type Dispatch_to_stakeScalarFieldEnum = (typeof Dispatch_to_stakeScalarFieldEnum)[keyof typeof Dispatch_to_stakeScalarFieldEnum]


  export const Dispatch_to_withdraw_queueScalarFieldEnum: {
    block_number: 'block_number',
    tx_index: 'tx_index',
    event_index: 'event_index',
    amount: 'amount',
    cursor: 'cursor'
  };

  export type Dispatch_to_withdraw_queueScalarFieldEnum = (typeof Dispatch_to_withdraw_queueScalarFieldEnum)[keyof typeof Dispatch_to_withdraw_queueScalarFieldEnum]


  export const Unstake_actionScalarFieldEnum: {
    block_number: 'block_number',
    tx_index: 'tx_index',
    event_index: 'event_index',
    amount: 'amount',
    cursor: 'cursor'
  };

  export type Unstake_actionScalarFieldEnum = (typeof Unstake_actionScalarFieldEnum)[keyof typeof Unstake_actionScalarFieldEnum]


  export const Unstake_intent_startedScalarFieldEnum: {
    block_number: 'block_number',
    tx_index: 'tx_index',
    event_index: 'event_index',
    amount: 'amount',
    cursor: 'cursor'
  };

  export type Unstake_intent_startedScalarFieldEnum = (typeof Unstake_intent_startedScalarFieldEnum)[keyof typeof Unstake_intent_startedScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type depositsWhereInput = {
    AND?: depositsWhereInput | depositsWhereInput[]
    OR?: depositsWhereInput[]
    NOT?: depositsWhereInput | depositsWhereInput[]
    block_number?: IntFilter<"deposits"> | number
    tx_index?: IntFilter<"deposits"> | number
    event_index?: IntFilter<"deposits"> | number
    timestamp?: IntFilter<"deposits"> | number
    sender?: StringFilter<"deposits"> | string
    owner?: StringFilter<"deposits"> | string
    assets?: StringFilter<"deposits"> | string
    shares?: StringFilter<"deposits"> | string
    cursor?: BigIntNullableFilter<"deposits"> | bigint | number | null
  }

  export type depositsOrderByWithRelationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    sender?: SortOrder
    owner?: SortOrder
    assets?: SortOrder
    shares?: SortOrder
    cursor?: SortOrderInput | SortOrder
  }

  export type depositsWhereUniqueInput = Prisma.AtLeast<{
    block_number_tx_index_event_index?: depositsBlock_numberTx_indexEvent_indexCompoundUniqueInput
    AND?: depositsWhereInput | depositsWhereInput[]
    OR?: depositsWhereInput[]
    NOT?: depositsWhereInput | depositsWhereInput[]
    block_number?: IntFilter<"deposits"> | number
    tx_index?: IntFilter<"deposits"> | number
    event_index?: IntFilter<"deposits"> | number
    timestamp?: IntFilter<"deposits"> | number
    sender?: StringFilter<"deposits"> | string
    owner?: StringFilter<"deposits"> | string
    assets?: StringFilter<"deposits"> | string
    shares?: StringFilter<"deposits"> | string
    cursor?: BigIntNullableFilter<"deposits"> | bigint | number | null
  }, "block_number_tx_index_event_index">

  export type depositsOrderByWithAggregationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    sender?: SortOrder
    owner?: SortOrder
    assets?: SortOrder
    shares?: SortOrder
    cursor?: SortOrderInput | SortOrder
    _count?: depositsCountOrderByAggregateInput
    _avg?: depositsAvgOrderByAggregateInput
    _max?: depositsMaxOrderByAggregateInput
    _min?: depositsMinOrderByAggregateInput
    _sum?: depositsSumOrderByAggregateInput
  }

  export type depositsScalarWhereWithAggregatesInput = {
    AND?: depositsScalarWhereWithAggregatesInput | depositsScalarWhereWithAggregatesInput[]
    OR?: depositsScalarWhereWithAggregatesInput[]
    NOT?: depositsScalarWhereWithAggregatesInput | depositsScalarWhereWithAggregatesInput[]
    block_number?: IntWithAggregatesFilter<"deposits"> | number
    tx_index?: IntWithAggregatesFilter<"deposits"> | number
    event_index?: IntWithAggregatesFilter<"deposits"> | number
    timestamp?: IntWithAggregatesFilter<"deposits"> | number
    sender?: StringWithAggregatesFilter<"deposits"> | string
    owner?: StringWithAggregatesFilter<"deposits"> | string
    assets?: StringWithAggregatesFilter<"deposits"> | string
    shares?: StringWithAggregatesFilter<"deposits"> | string
    cursor?: BigIntNullableWithAggregatesFilter<"deposits"> | bigint | number | null
  }

  export type withdraw_queueWhereInput = {
    AND?: withdraw_queueWhereInput | withdraw_queueWhereInput[]
    OR?: withdraw_queueWhereInput[]
    NOT?: withdraw_queueWhereInput | withdraw_queueWhereInput[]
    block_number?: IntFilter<"withdraw_queue"> | number
    tx_index?: IntFilter<"withdraw_queue"> | number
    event_index?: IntFilter<"withdraw_queue"> | number
    tx_hash?: StringFilter<"withdraw_queue"> | string
    caller?: StringFilter<"withdraw_queue"> | string
    amount_strk?: StringFilter<"withdraw_queue"> | string
    amount_kstrk?: StringFilter<"withdraw_queue"> | string
    request_id?: BigIntFilter<"withdraw_queue"> | bigint | number
    is_claimed?: BoolFilter<"withdraw_queue"> | boolean
    claim_time?: IntFilter<"withdraw_queue"> | number
    receiver?: StringFilter<"withdraw_queue"> | string
    is_rejected?: BoolFilter<"withdraw_queue"> | boolean
    timestamp?: IntFilter<"withdraw_queue"> | number
    cursor?: BigIntNullableFilter<"withdraw_queue"> | bigint | number | null
  }

  export type withdraw_queueOrderByWithRelationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    tx_hash?: SortOrder
    caller?: SortOrder
    amount_strk?: SortOrder
    amount_kstrk?: SortOrder
    request_id?: SortOrder
    is_claimed?: SortOrder
    claim_time?: SortOrder
    receiver?: SortOrder
    is_rejected?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrderInput | SortOrder
  }

  export type withdraw_queueWhereUniqueInput = Prisma.AtLeast<{
    block_number_tx_index_event_index?: withdraw_queueBlock_numberTx_indexEvent_indexCompoundUniqueInput
    AND?: withdraw_queueWhereInput | withdraw_queueWhereInput[]
    OR?: withdraw_queueWhereInput[]
    NOT?: withdraw_queueWhereInput | withdraw_queueWhereInput[]
    block_number?: IntFilter<"withdraw_queue"> | number
    tx_index?: IntFilter<"withdraw_queue"> | number
    event_index?: IntFilter<"withdraw_queue"> | number
    tx_hash?: StringFilter<"withdraw_queue"> | string
    caller?: StringFilter<"withdraw_queue"> | string
    amount_strk?: StringFilter<"withdraw_queue"> | string
    amount_kstrk?: StringFilter<"withdraw_queue"> | string
    request_id?: BigIntFilter<"withdraw_queue"> | bigint | number
    is_claimed?: BoolFilter<"withdraw_queue"> | boolean
    claim_time?: IntFilter<"withdraw_queue"> | number
    receiver?: StringFilter<"withdraw_queue"> | string
    is_rejected?: BoolFilter<"withdraw_queue"> | boolean
    timestamp?: IntFilter<"withdraw_queue"> | number
    cursor?: BigIntNullableFilter<"withdraw_queue"> | bigint | number | null
  }, "block_number_tx_index_event_index">

  export type withdraw_queueOrderByWithAggregationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    tx_hash?: SortOrder
    caller?: SortOrder
    amount_strk?: SortOrder
    amount_kstrk?: SortOrder
    request_id?: SortOrder
    is_claimed?: SortOrder
    claim_time?: SortOrder
    receiver?: SortOrder
    is_rejected?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrderInput | SortOrder
    _count?: withdraw_queueCountOrderByAggregateInput
    _avg?: withdraw_queueAvgOrderByAggregateInput
    _max?: withdraw_queueMaxOrderByAggregateInput
    _min?: withdraw_queueMinOrderByAggregateInput
    _sum?: withdraw_queueSumOrderByAggregateInput
  }

  export type withdraw_queueScalarWhereWithAggregatesInput = {
    AND?: withdraw_queueScalarWhereWithAggregatesInput | withdraw_queueScalarWhereWithAggregatesInput[]
    OR?: withdraw_queueScalarWhereWithAggregatesInput[]
    NOT?: withdraw_queueScalarWhereWithAggregatesInput | withdraw_queueScalarWhereWithAggregatesInput[]
    block_number?: IntWithAggregatesFilter<"withdraw_queue"> | number
    tx_index?: IntWithAggregatesFilter<"withdraw_queue"> | number
    event_index?: IntWithAggregatesFilter<"withdraw_queue"> | number
    tx_hash?: StringWithAggregatesFilter<"withdraw_queue"> | string
    caller?: StringWithAggregatesFilter<"withdraw_queue"> | string
    amount_strk?: StringWithAggregatesFilter<"withdraw_queue"> | string
    amount_kstrk?: StringWithAggregatesFilter<"withdraw_queue"> | string
    request_id?: BigIntWithAggregatesFilter<"withdraw_queue"> | bigint | number
    is_claimed?: BoolWithAggregatesFilter<"withdraw_queue"> | boolean
    claim_time?: IntWithAggregatesFilter<"withdraw_queue"> | number
    receiver?: StringWithAggregatesFilter<"withdraw_queue"> | string
    is_rejected?: BoolWithAggregatesFilter<"withdraw_queue"> | boolean
    timestamp?: IntWithAggregatesFilter<"withdraw_queue"> | number
    cursor?: BigIntNullableWithAggregatesFilter<"withdraw_queue"> | bigint | number | null
  }

  export type received_fundsWhereInput = {
    AND?: received_fundsWhereInput | received_fundsWhereInput[]
    OR?: received_fundsWhereInput[]
    NOT?: received_fundsWhereInput | received_fundsWhereInput[]
    block_number?: IntFilter<"received_funds"> | number
    tx_index?: IntFilter<"received_funds"> | number
    event_index?: IntFilter<"received_funds"> | number
    amount?: StringFilter<"received_funds"> | string
    sender?: StringFilter<"received_funds"> | string
    unprocessed?: StringFilter<"received_funds"> | string
    intransit?: StringFilter<"received_funds"> | string
    timestamp?: IntFilter<"received_funds"> | number
    cursor?: BigIntNullableFilter<"received_funds"> | bigint | number | null
  }

  export type received_fundsOrderByWithRelationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    sender?: SortOrder
    unprocessed?: SortOrder
    intransit?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrderInput | SortOrder
  }

  export type received_fundsWhereUniqueInput = Prisma.AtLeast<{
    block_number_tx_index_event_index?: received_fundsBlock_numberTx_indexEvent_indexCompoundUniqueInput
    AND?: received_fundsWhereInput | received_fundsWhereInput[]
    OR?: received_fundsWhereInput[]
    NOT?: received_fundsWhereInput | received_fundsWhereInput[]
    block_number?: IntFilter<"received_funds"> | number
    tx_index?: IntFilter<"received_funds"> | number
    event_index?: IntFilter<"received_funds"> | number
    amount?: StringFilter<"received_funds"> | string
    sender?: StringFilter<"received_funds"> | string
    unprocessed?: StringFilter<"received_funds"> | string
    intransit?: StringFilter<"received_funds"> | string
    timestamp?: IntFilter<"received_funds"> | number
    cursor?: BigIntNullableFilter<"received_funds"> | bigint | number | null
  }, "block_number_tx_index_event_index">

  export type received_fundsOrderByWithAggregationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    sender?: SortOrder
    unprocessed?: SortOrder
    intransit?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrderInput | SortOrder
    _count?: received_fundsCountOrderByAggregateInput
    _avg?: received_fundsAvgOrderByAggregateInput
    _max?: received_fundsMaxOrderByAggregateInput
    _min?: received_fundsMinOrderByAggregateInput
    _sum?: received_fundsSumOrderByAggregateInput
  }

  export type received_fundsScalarWhereWithAggregatesInput = {
    AND?: received_fundsScalarWhereWithAggregatesInput | received_fundsScalarWhereWithAggregatesInput[]
    OR?: received_fundsScalarWhereWithAggregatesInput[]
    NOT?: received_fundsScalarWhereWithAggregatesInput | received_fundsScalarWhereWithAggregatesInput[]
    block_number?: IntWithAggregatesFilter<"received_funds"> | number
    tx_index?: IntWithAggregatesFilter<"received_funds"> | number
    event_index?: IntWithAggregatesFilter<"received_funds"> | number
    amount?: StringWithAggregatesFilter<"received_funds"> | string
    sender?: StringWithAggregatesFilter<"received_funds"> | string
    unprocessed?: StringWithAggregatesFilter<"received_funds"> | string
    intransit?: StringWithAggregatesFilter<"received_funds"> | string
    timestamp?: IntWithAggregatesFilter<"received_funds"> | number
    cursor?: BigIntNullableWithAggregatesFilter<"received_funds"> | bigint | number | null
  }

  export type dispatch_to_stakeWhereInput = {
    AND?: dispatch_to_stakeWhereInput | dispatch_to_stakeWhereInput[]
    OR?: dispatch_to_stakeWhereInput[]
    NOT?: dispatch_to_stakeWhereInput | dispatch_to_stakeWhereInput[]
    block_number?: IntFilter<"dispatch_to_stake"> | number
    tx_index?: IntFilter<"dispatch_to_stake"> | number
    event_index?: IntFilter<"dispatch_to_stake"> | number
    delegator?: StringFilter<"dispatch_to_stake"> | string
    amount?: StringFilter<"dispatch_to_stake"> | string
    cursor?: BigIntNullableFilter<"dispatch_to_stake"> | bigint | number | null
    timestamp?: StringFilter<"dispatch_to_stake"> | string
  }

  export type dispatch_to_stakeOrderByWithRelationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    delegator?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
    timestamp?: SortOrder
  }

  export type dispatch_to_stakeWhereUniqueInput = Prisma.AtLeast<{
    block_number_tx_index_event_index?: dispatch_to_stakeBlock_numberTx_indexEvent_indexCompoundUniqueInput
    AND?: dispatch_to_stakeWhereInput | dispatch_to_stakeWhereInput[]
    OR?: dispatch_to_stakeWhereInput[]
    NOT?: dispatch_to_stakeWhereInput | dispatch_to_stakeWhereInput[]
    block_number?: IntFilter<"dispatch_to_stake"> | number
    tx_index?: IntFilter<"dispatch_to_stake"> | number
    event_index?: IntFilter<"dispatch_to_stake"> | number
    delegator?: StringFilter<"dispatch_to_stake"> | string
    amount?: StringFilter<"dispatch_to_stake"> | string
    cursor?: BigIntNullableFilter<"dispatch_to_stake"> | bigint | number | null
    timestamp?: StringFilter<"dispatch_to_stake"> | string
  }, "block_number_tx_index_event_index">

  export type dispatch_to_stakeOrderByWithAggregationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    delegator?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: dispatch_to_stakeCountOrderByAggregateInput
    _avg?: dispatch_to_stakeAvgOrderByAggregateInput
    _max?: dispatch_to_stakeMaxOrderByAggregateInput
    _min?: dispatch_to_stakeMinOrderByAggregateInput
    _sum?: dispatch_to_stakeSumOrderByAggregateInput
  }

  export type dispatch_to_stakeScalarWhereWithAggregatesInput = {
    AND?: dispatch_to_stakeScalarWhereWithAggregatesInput | dispatch_to_stakeScalarWhereWithAggregatesInput[]
    OR?: dispatch_to_stakeScalarWhereWithAggregatesInput[]
    NOT?: dispatch_to_stakeScalarWhereWithAggregatesInput | dispatch_to_stakeScalarWhereWithAggregatesInput[]
    block_number?: IntWithAggregatesFilter<"dispatch_to_stake"> | number
    tx_index?: IntWithAggregatesFilter<"dispatch_to_stake"> | number
    event_index?: IntWithAggregatesFilter<"dispatch_to_stake"> | number
    delegator?: StringWithAggregatesFilter<"dispatch_to_stake"> | string
    amount?: StringWithAggregatesFilter<"dispatch_to_stake"> | string
    cursor?: BigIntNullableWithAggregatesFilter<"dispatch_to_stake"> | bigint | number | null
    timestamp?: StringWithAggregatesFilter<"dispatch_to_stake"> | string
  }

  export type dispatch_to_withdraw_queueWhereInput = {
    AND?: dispatch_to_withdraw_queueWhereInput | dispatch_to_withdraw_queueWhereInput[]
    OR?: dispatch_to_withdraw_queueWhereInput[]
    NOT?: dispatch_to_withdraw_queueWhereInput | dispatch_to_withdraw_queueWhereInput[]
    block_number?: IntFilter<"dispatch_to_withdraw_queue"> | number
    tx_index?: IntFilter<"dispatch_to_withdraw_queue"> | number
    event_index?: IntFilter<"dispatch_to_withdraw_queue"> | number
    amount?: StringFilter<"dispatch_to_withdraw_queue"> | string
    cursor?: BigIntNullableFilter<"dispatch_to_withdraw_queue"> | bigint | number | null
  }

  export type dispatch_to_withdraw_queueOrderByWithRelationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
  }

  export type dispatch_to_withdraw_queueWhereUniqueInput = Prisma.AtLeast<{
    block_number_tx_index_event_index?: dispatch_to_withdraw_queueBlock_numberTx_indexEvent_indexCompoundUniqueInput
    AND?: dispatch_to_withdraw_queueWhereInput | dispatch_to_withdraw_queueWhereInput[]
    OR?: dispatch_to_withdraw_queueWhereInput[]
    NOT?: dispatch_to_withdraw_queueWhereInput | dispatch_to_withdraw_queueWhereInput[]
    block_number?: IntFilter<"dispatch_to_withdraw_queue"> | number
    tx_index?: IntFilter<"dispatch_to_withdraw_queue"> | number
    event_index?: IntFilter<"dispatch_to_withdraw_queue"> | number
    amount?: StringFilter<"dispatch_to_withdraw_queue"> | string
    cursor?: BigIntNullableFilter<"dispatch_to_withdraw_queue"> | bigint | number | null
  }, "block_number_tx_index_event_index">

  export type dispatch_to_withdraw_queueOrderByWithAggregationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
    _count?: dispatch_to_withdraw_queueCountOrderByAggregateInput
    _avg?: dispatch_to_withdraw_queueAvgOrderByAggregateInput
    _max?: dispatch_to_withdraw_queueMaxOrderByAggregateInput
    _min?: dispatch_to_withdraw_queueMinOrderByAggregateInput
    _sum?: dispatch_to_withdraw_queueSumOrderByAggregateInput
  }

  export type dispatch_to_withdraw_queueScalarWhereWithAggregatesInput = {
    AND?: dispatch_to_withdraw_queueScalarWhereWithAggregatesInput | dispatch_to_withdraw_queueScalarWhereWithAggregatesInput[]
    OR?: dispatch_to_withdraw_queueScalarWhereWithAggregatesInput[]
    NOT?: dispatch_to_withdraw_queueScalarWhereWithAggregatesInput | dispatch_to_withdraw_queueScalarWhereWithAggregatesInput[]
    block_number?: IntWithAggregatesFilter<"dispatch_to_withdraw_queue"> | number
    tx_index?: IntWithAggregatesFilter<"dispatch_to_withdraw_queue"> | number
    event_index?: IntWithAggregatesFilter<"dispatch_to_withdraw_queue"> | number
    amount?: StringWithAggregatesFilter<"dispatch_to_withdraw_queue"> | string
    cursor?: BigIntNullableWithAggregatesFilter<"dispatch_to_withdraw_queue"> | bigint | number | null
  }

  export type unstake_actionWhereInput = {
    AND?: unstake_actionWhereInput | unstake_actionWhereInput[]
    OR?: unstake_actionWhereInput[]
    NOT?: unstake_actionWhereInput | unstake_actionWhereInput[]
    block_number?: IntFilter<"unstake_action"> | number
    tx_index?: IntFilter<"unstake_action"> | number
    event_index?: IntFilter<"unstake_action"> | number
    amount?: StringFilter<"unstake_action"> | string
    cursor?: BigIntNullableFilter<"unstake_action"> | bigint | number | null
  }

  export type unstake_actionOrderByWithRelationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
  }

  export type unstake_actionWhereUniqueInput = Prisma.AtLeast<{
    block_number_tx_index_event_index?: unstake_actionBlock_numberTx_indexEvent_indexCompoundUniqueInput
    AND?: unstake_actionWhereInput | unstake_actionWhereInput[]
    OR?: unstake_actionWhereInput[]
    NOT?: unstake_actionWhereInput | unstake_actionWhereInput[]
    block_number?: IntFilter<"unstake_action"> | number
    tx_index?: IntFilter<"unstake_action"> | number
    event_index?: IntFilter<"unstake_action"> | number
    amount?: StringFilter<"unstake_action"> | string
    cursor?: BigIntNullableFilter<"unstake_action"> | bigint | number | null
  }, "block_number_tx_index_event_index">

  export type unstake_actionOrderByWithAggregationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
    _count?: unstake_actionCountOrderByAggregateInput
    _avg?: unstake_actionAvgOrderByAggregateInput
    _max?: unstake_actionMaxOrderByAggregateInput
    _min?: unstake_actionMinOrderByAggregateInput
    _sum?: unstake_actionSumOrderByAggregateInput
  }

  export type unstake_actionScalarWhereWithAggregatesInput = {
    AND?: unstake_actionScalarWhereWithAggregatesInput | unstake_actionScalarWhereWithAggregatesInput[]
    OR?: unstake_actionScalarWhereWithAggregatesInput[]
    NOT?: unstake_actionScalarWhereWithAggregatesInput | unstake_actionScalarWhereWithAggregatesInput[]
    block_number?: IntWithAggregatesFilter<"unstake_action"> | number
    tx_index?: IntWithAggregatesFilter<"unstake_action"> | number
    event_index?: IntWithAggregatesFilter<"unstake_action"> | number
    amount?: StringWithAggregatesFilter<"unstake_action"> | string
    cursor?: BigIntNullableWithAggregatesFilter<"unstake_action"> | bigint | number | null
  }

  export type unstake_intent_startedWhereInput = {
    AND?: unstake_intent_startedWhereInput | unstake_intent_startedWhereInput[]
    OR?: unstake_intent_startedWhereInput[]
    NOT?: unstake_intent_startedWhereInput | unstake_intent_startedWhereInput[]
    block_number?: IntFilter<"unstake_intent_started"> | number
    tx_index?: IntFilter<"unstake_intent_started"> | number
    event_index?: IntFilter<"unstake_intent_started"> | number
    amount?: StringFilter<"unstake_intent_started"> | string
    cursor?: BigIntNullableFilter<"unstake_intent_started"> | bigint | number | null
  }

  export type unstake_intent_startedOrderByWithRelationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
  }

  export type unstake_intent_startedWhereUniqueInput = Prisma.AtLeast<{
    block_number_tx_index_event_index?: unstake_intent_startedBlock_numberTx_indexEvent_indexCompoundUniqueInput
    AND?: unstake_intent_startedWhereInput | unstake_intent_startedWhereInput[]
    OR?: unstake_intent_startedWhereInput[]
    NOT?: unstake_intent_startedWhereInput | unstake_intent_startedWhereInput[]
    block_number?: IntFilter<"unstake_intent_started"> | number
    tx_index?: IntFilter<"unstake_intent_started"> | number
    event_index?: IntFilter<"unstake_intent_started"> | number
    amount?: StringFilter<"unstake_intent_started"> | string
    cursor?: BigIntNullableFilter<"unstake_intent_started"> | bigint | number | null
  }, "block_number_tx_index_event_index">

  export type unstake_intent_startedOrderByWithAggregationInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrderInput | SortOrder
    _count?: unstake_intent_startedCountOrderByAggregateInput
    _avg?: unstake_intent_startedAvgOrderByAggregateInput
    _max?: unstake_intent_startedMaxOrderByAggregateInput
    _min?: unstake_intent_startedMinOrderByAggregateInput
    _sum?: unstake_intent_startedSumOrderByAggregateInput
  }

  export type unstake_intent_startedScalarWhereWithAggregatesInput = {
    AND?: unstake_intent_startedScalarWhereWithAggregatesInput | unstake_intent_startedScalarWhereWithAggregatesInput[]
    OR?: unstake_intent_startedScalarWhereWithAggregatesInput[]
    NOT?: unstake_intent_startedScalarWhereWithAggregatesInput | unstake_intent_startedScalarWhereWithAggregatesInput[]
    block_number?: IntWithAggregatesFilter<"unstake_intent_started"> | number
    tx_index?: IntWithAggregatesFilter<"unstake_intent_started"> | number
    event_index?: IntWithAggregatesFilter<"unstake_intent_started"> | number
    amount?: StringWithAggregatesFilter<"unstake_intent_started"> | string
    cursor?: BigIntNullableWithAggregatesFilter<"unstake_intent_started"> | bigint | number | null
  }

  export type depositsCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    timestamp: number
    sender: string
    owner: string
    assets: string
    shares: string
    cursor?: bigint | number | null
  }

  export type depositsUncheckedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    timestamp: number
    sender: string
    owner: string
    assets: string
    shares: string
    cursor?: bigint | number | null
  }

  export type depositsUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    timestamp?: IntFieldUpdateOperationsInput | number
    sender?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    assets?: StringFieldUpdateOperationsInput | string
    shares?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type depositsUncheckedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    timestamp?: IntFieldUpdateOperationsInput | number
    sender?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    assets?: StringFieldUpdateOperationsInput | string
    shares?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type depositsCreateManyInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    timestamp: number
    sender: string
    owner: string
    assets: string
    shares: string
    cursor?: bigint | number | null
  }

  export type depositsUpdateManyMutationInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    timestamp?: IntFieldUpdateOperationsInput | number
    sender?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    assets?: StringFieldUpdateOperationsInput | string
    shares?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type depositsUncheckedUpdateManyInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    timestamp?: IntFieldUpdateOperationsInput | number
    sender?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    assets?: StringFieldUpdateOperationsInput | string
    shares?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type withdraw_queueCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    tx_hash: string
    caller: string
    amount_strk: string
    amount_kstrk: string
    request_id: bigint | number
    is_claimed: boolean
    claim_time: number
    receiver: string
    is_rejected?: boolean
    timestamp: number
    cursor?: bigint | number | null
  }

  export type withdraw_queueUncheckedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    tx_hash: string
    caller: string
    amount_strk: string
    amount_kstrk: string
    request_id: bigint | number
    is_claimed: boolean
    claim_time: number
    receiver: string
    is_rejected?: boolean
    timestamp: number
    cursor?: bigint | number | null
  }

  export type withdraw_queueUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    caller?: StringFieldUpdateOperationsInput | string
    amount_strk?: StringFieldUpdateOperationsInput | string
    amount_kstrk?: StringFieldUpdateOperationsInput | string
    request_id?: BigIntFieldUpdateOperationsInput | bigint | number
    is_claimed?: BoolFieldUpdateOperationsInput | boolean
    claim_time?: IntFieldUpdateOperationsInput | number
    receiver?: StringFieldUpdateOperationsInput | string
    is_rejected?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type withdraw_queueUncheckedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    caller?: StringFieldUpdateOperationsInput | string
    amount_strk?: StringFieldUpdateOperationsInput | string
    amount_kstrk?: StringFieldUpdateOperationsInput | string
    request_id?: BigIntFieldUpdateOperationsInput | bigint | number
    is_claimed?: BoolFieldUpdateOperationsInput | boolean
    claim_time?: IntFieldUpdateOperationsInput | number
    receiver?: StringFieldUpdateOperationsInput | string
    is_rejected?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type withdraw_queueCreateManyInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    tx_hash: string
    caller: string
    amount_strk: string
    amount_kstrk: string
    request_id: bigint | number
    is_claimed: boolean
    claim_time: number
    receiver: string
    is_rejected?: boolean
    timestamp: number
    cursor?: bigint | number | null
  }

  export type withdraw_queueUpdateManyMutationInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    caller?: StringFieldUpdateOperationsInput | string
    amount_strk?: StringFieldUpdateOperationsInput | string
    amount_kstrk?: StringFieldUpdateOperationsInput | string
    request_id?: BigIntFieldUpdateOperationsInput | bigint | number
    is_claimed?: BoolFieldUpdateOperationsInput | boolean
    claim_time?: IntFieldUpdateOperationsInput | number
    receiver?: StringFieldUpdateOperationsInput | string
    is_rejected?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type withdraw_queueUncheckedUpdateManyInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    tx_hash?: StringFieldUpdateOperationsInput | string
    caller?: StringFieldUpdateOperationsInput | string
    amount_strk?: StringFieldUpdateOperationsInput | string
    amount_kstrk?: StringFieldUpdateOperationsInput | string
    request_id?: BigIntFieldUpdateOperationsInput | bigint | number
    is_claimed?: BoolFieldUpdateOperationsInput | boolean
    claim_time?: IntFieldUpdateOperationsInput | number
    receiver?: StringFieldUpdateOperationsInput | string
    is_rejected?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type received_fundsCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    sender: string
    unprocessed: string
    intransit: string
    timestamp: number
    cursor?: bigint | number | null
  }

  export type received_fundsUncheckedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    sender: string
    unprocessed: string
    intransit: string
    timestamp: number
    cursor?: bigint | number | null
  }

  export type received_fundsUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    unprocessed?: StringFieldUpdateOperationsInput | string
    intransit?: StringFieldUpdateOperationsInput | string
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type received_fundsUncheckedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    unprocessed?: StringFieldUpdateOperationsInput | string
    intransit?: StringFieldUpdateOperationsInput | string
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type received_fundsCreateManyInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    sender: string
    unprocessed: string
    intransit: string
    timestamp: number
    cursor?: bigint | number | null
  }

  export type received_fundsUpdateManyMutationInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    unprocessed?: StringFieldUpdateOperationsInput | string
    intransit?: StringFieldUpdateOperationsInput | string
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type received_fundsUncheckedUpdateManyInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    unprocessed?: StringFieldUpdateOperationsInput | string
    intransit?: StringFieldUpdateOperationsInput | string
    timestamp?: IntFieldUpdateOperationsInput | number
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dispatch_to_stakeCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    delegator: string
    amount: string
    cursor?: bigint | number | null
    timestamp: string
  }

  export type dispatch_to_stakeUncheckedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    delegator: string
    amount: string
    cursor?: bigint | number | null
    timestamp: string
  }

  export type dispatch_to_stakeUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    delegator?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    timestamp?: StringFieldUpdateOperationsInput | string
  }

  export type dispatch_to_stakeUncheckedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    delegator?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    timestamp?: StringFieldUpdateOperationsInput | string
  }

  export type dispatch_to_stakeCreateManyInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    delegator: string
    amount: string
    cursor?: bigint | number | null
    timestamp: string
  }

  export type dispatch_to_stakeUpdateManyMutationInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    delegator?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    timestamp?: StringFieldUpdateOperationsInput | string
  }

  export type dispatch_to_stakeUncheckedUpdateManyInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    delegator?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    timestamp?: StringFieldUpdateOperationsInput | string
  }

  export type dispatch_to_withdraw_queueCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type dispatch_to_withdraw_queueUncheckedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type dispatch_to_withdraw_queueUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dispatch_to_withdraw_queueUncheckedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dispatch_to_withdraw_queueCreateManyInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type dispatch_to_withdraw_queueUpdateManyMutationInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dispatch_to_withdraw_queueUncheckedUpdateManyInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_actionCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type unstake_actionUncheckedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type unstake_actionUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_actionUncheckedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_actionCreateManyInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type unstake_actionUpdateManyMutationInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_actionUncheckedUpdateManyInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_intent_startedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type unstake_intent_startedUncheckedCreateInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type unstake_intent_startedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_intent_startedUncheckedUpdateInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_intent_startedCreateManyInput = {
    block_number: number
    tx_index?: number
    event_index?: number
    amount: string
    cursor?: bigint | number | null
  }

  export type unstake_intent_startedUpdateManyMutationInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type unstake_intent_startedUncheckedUpdateManyInput = {
    block_number?: IntFieldUpdateOperationsInput | number
    tx_index?: IntFieldUpdateOperationsInput | number
    event_index?: IntFieldUpdateOperationsInput | number
    amount?: StringFieldUpdateOperationsInput | string
    cursor?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type depositsBlock_numberTx_indexEvent_indexCompoundUniqueInput = {
    block_number: number
    tx_index: number
    event_index: number
  }

  export type depositsCountOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    sender?: SortOrder
    owner?: SortOrder
    assets?: SortOrder
    shares?: SortOrder
    cursor?: SortOrder
  }

  export type depositsAvgOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type depositsMaxOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    sender?: SortOrder
    owner?: SortOrder
    assets?: SortOrder
    shares?: SortOrder
    cursor?: SortOrder
  }

  export type depositsMinOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    sender?: SortOrder
    owner?: SortOrder
    assets?: SortOrder
    shares?: SortOrder
    cursor?: SortOrder
  }

  export type depositsSumOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type withdraw_queueBlock_numberTx_indexEvent_indexCompoundUniqueInput = {
    block_number: number
    tx_index: number
    event_index: number
  }

  export type withdraw_queueCountOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    tx_hash?: SortOrder
    caller?: SortOrder
    amount_strk?: SortOrder
    amount_kstrk?: SortOrder
    request_id?: SortOrder
    is_claimed?: SortOrder
    claim_time?: SortOrder
    receiver?: SortOrder
    is_rejected?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type withdraw_queueAvgOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    request_id?: SortOrder
    claim_time?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type withdraw_queueMaxOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    tx_hash?: SortOrder
    caller?: SortOrder
    amount_strk?: SortOrder
    amount_kstrk?: SortOrder
    request_id?: SortOrder
    is_claimed?: SortOrder
    claim_time?: SortOrder
    receiver?: SortOrder
    is_rejected?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type withdraw_queueMinOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    tx_hash?: SortOrder
    caller?: SortOrder
    amount_strk?: SortOrder
    amount_kstrk?: SortOrder
    request_id?: SortOrder
    is_claimed?: SortOrder
    claim_time?: SortOrder
    receiver?: SortOrder
    is_rejected?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type withdraw_queueSumOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    request_id?: SortOrder
    claim_time?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type received_fundsBlock_numberTx_indexEvent_indexCompoundUniqueInput = {
    block_number: number
    tx_index: number
    event_index: number
  }

  export type received_fundsCountOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    sender?: SortOrder
    unprocessed?: SortOrder
    intransit?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type received_fundsAvgOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type received_fundsMaxOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    sender?: SortOrder
    unprocessed?: SortOrder
    intransit?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type received_fundsMinOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    sender?: SortOrder
    unprocessed?: SortOrder
    intransit?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type received_fundsSumOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    timestamp?: SortOrder
    cursor?: SortOrder
  }

  export type dispatch_to_stakeBlock_numberTx_indexEvent_indexCompoundUniqueInput = {
    block_number: number
    tx_index: number
    event_index: number
  }

  export type dispatch_to_stakeCountOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    delegator?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
    timestamp?: SortOrder
  }

  export type dispatch_to_stakeAvgOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type dispatch_to_stakeMaxOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    delegator?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
    timestamp?: SortOrder
  }

  export type dispatch_to_stakeMinOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    delegator?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
    timestamp?: SortOrder
  }

  export type dispatch_to_stakeSumOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type dispatch_to_withdraw_queueBlock_numberTx_indexEvent_indexCompoundUniqueInput = {
    block_number: number
    tx_index: number
    event_index: number
  }

  export type dispatch_to_withdraw_queueCountOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type dispatch_to_withdraw_queueAvgOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type dispatch_to_withdraw_queueMaxOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type dispatch_to_withdraw_queueMinOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type dispatch_to_withdraw_queueSumOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_actionBlock_numberTx_indexEvent_indexCompoundUniqueInput = {
    block_number: number
    tx_index: number
    event_index: number
  }

  export type unstake_actionCountOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_actionAvgOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_actionMaxOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_actionMinOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_actionSumOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_intent_startedBlock_numberTx_indexEvent_indexCompoundUniqueInput = {
    block_number: number
    tx_index: number
    event_index: number
  }

  export type unstake_intent_startedCountOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_intent_startedAvgOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_intent_startedMaxOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_intent_startedMinOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    amount?: SortOrder
    cursor?: SortOrder
  }

  export type unstake_intent_startedSumOrderByAggregateInput = {
    block_number?: SortOrder
    tx_index?: SortOrder
    event_index?: SortOrder
    cursor?: SortOrder
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use depositsDefaultArgs instead
     */
    export type depositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = depositsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use withdraw_queueDefaultArgs instead
     */
    export type withdraw_queueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = withdraw_queueDefaultArgs<ExtArgs>
    /**
     * @deprecated Use received_fundsDefaultArgs instead
     */
    export type received_fundsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = received_fundsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use dispatch_to_stakeDefaultArgs instead
     */
    export type dispatch_to_stakeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = dispatch_to_stakeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use dispatch_to_withdraw_queueDefaultArgs instead
     */
    export type dispatch_to_withdraw_queueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = dispatch_to_withdraw_queueDefaultArgs<ExtArgs>
    /**
     * @deprecated Use unstake_actionDefaultArgs instead
     */
    export type unstake_actionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = unstake_actionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use unstake_intent_startedDefaultArgs instead
     */
    export type unstake_intent_startedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = unstake_intent_startedDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}