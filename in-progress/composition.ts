import { Cause, Effect, Either } from 'effect';
import { flow } from 'effect/Function'

declare const getUser: (id: string) => Promise<{ email: string }>;
declare const getOrders: (email: string) => Promise<{ itemIds: string[] }>;
declare const getRefunds: (email: string) => Promise<{ refundId: string }>;

const pGetUser = (id: string) => Effect.promise(() => getUser(id))
const pGetOrders = (email: string) => Effect.promise(() => getOrders(email))
const pGetRefunds = (email: string) => Effect.promise(() => getRefunds(email))

const tryGetUser = (id: string) => Effect.tryPromise({
  try: () => getUser(id),
  catch: () => new Error('YUP'),
})

const process = flow(
  pGetUser,
  Effect.map(user => user.email),
  // Effect.tryMapPromise({ try: email => getOrders(email), catch: () => new Error('YUP') })
  Effect.flatMap(pGetOrders),
  Effect.map(orders => orders.itemIds)
)

const now = Effect.sync(() => new Date().getTime())

const process2 = flow(
  getUser,
)
