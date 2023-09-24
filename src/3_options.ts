/**
 * Option at a Glance
 * 
 * Let's start with a common pattern that arises from the need to validate if a piece of data exists. Here we define a function that checks if a user is low on funds.
 */
declare const getUserById: (userId: string) => object | null;
declare const getPrimaryAccount: (user: object) => object | null;
declare const getBalance: (account: object) => number | null;
declare const lowBalanceCheck: (balance: number) => boolean | null;

const checkPrimaryAccountLowBalance1 = (userId: string) => {
  const user = getUserById(userId)
  if (user) {
    const account = getPrimaryAccount(user)

    if (account) {
      const balance = getBalance(account)

      if (balance) {
        const hasLowFunds = lowBalanceCheck(balance)

        return hasLowFunds
      }
    }
  }

  return null
}

// We can attempt to get rid of the pyramid by using other patterns but the check is still there and it is almost begging to be abstracted away.
const checkPrimaryAccountLowBalance2 = (userId: string) => {
  const user = getUserById(userId)
  if (!user) {
    return null
  }

  const account = getPrimaryAccount(user)
  if (!account) {
    return null
  }

  const balance = getBalance(account)
  if (!balance) {
    return null
  }

  const hasLowFunds = lowBalanceCheck(balance)

  return hasLowFunds
}

/**
 * Options and chains/flatMap will enable us to abstract away the if checks an will get us here
 */
declare const getUserByIdFp: (userId: string) => O.Option<object>;
declare const getPrimaryAccountFp: (user: object) => O.Option<object>;
declare const getBalanceFp: (account: object) => O.Option<number>;
declare const lowBalanceCheckFp: (balance: number) => O.Option<boolean>;

const checkPrimaryAccountLowBalanceFp = flow(
  getUserByIdFp,
  O.flatMap(getPrimaryAccountFp),
  O.flatMap(getBalanceFp),
  O.flatMap(lowBalanceCheckFp),
)

/**
 * For some inputs, some functions may map to nothing or null. We can use nothing to express that an input maps to no value. We may also use this as basic error prevention.
 */

type TCombineTwoNumbers = (a: number) => (b: number) => number

const unsafeDivision: TCombineTwoNumbers = a => b => b / a
unsafeDivision(0)(1) // evaluates to `Infinity` in JS, in other languages this throws an exception, which we will pretend is the case

// In fp the use of null is discouraged, instead the use of Option types are encouraged as they are more explicit.
type TCombineTwoNumbersOption = (a: number) => (b: number) => O.Option<number>

// const a: number = null // This is detected as an error by typescript only in strict mode

// On strict mode this could be used as an alternative to Option
type TCombineTwoNumbersNullable = (a: number) => (b: number) => number | null

/**
 * Options can be used to wrap values, an Option may contain a value or nothing. Options enable us to map inputs to values or nothing.
 * 
 * Note: Option which is inspired by Scala, is also known as Maybe in Haskell or Result in Rust.
 */

// In the effect-ts fp-ts libraries Option is either some value or none.
import O from 'effect/Option'

/**
 * Here below we use Option to make a safe division function, we have prevented the error and out type signature expresses the possibility that an input may map to to nothing.
 */
const safeDivision: TCombineTwoNumbersOption = a => b => {
  if (b === 0) {
    return O.none()
  }
  return O.some(a / b)
}

safeDivision(1)(0) // None { _tag: 'None' }
safeDivision(2)(0) // None { _tag: 'None' }
safeDivision(4)(2) // Some { _tag: 'Some', value: 2 }
safeDivision(8)(2) // Some { _tag: 'Some', value: 4 }

/**
 * Since our outputs are now wrapped by Option this will potentially affect our ability to compose.
 */
type HalfIfEven = (a: number) => O.Option<number>
const halfIfEven: HalfIfEven = a => {
  if (a % 2 == 0) {
    return O.some(a / 2)
  } else {
    return O.none()
  }
}

halfIfEven(10) // Some { _tag: 'Some', value: 5 }
halfIfEven(3)  // None { _tag: 'None' }

// Say we wanted to run an input twice through the same function, we will have type check errors and worse runtime errors.
const five = halfIfEven(10) // Some { _tag: 'Some', value: 5 }
// halfIfEven(five) // This won't match the signature halfIfEven only understand inputs of type number!
// halfIfEven(five.value) // This will throw type errors as we don't know with certainty if five contains a value or not

// This also means that piping the function is now broken
import { pipe } from 'effect/Function'

// pipe(
//   10,
//   halfIfEven,
//   halfIfEven,
// )

// We would have to check for the presence of the value, but than can become tedious quickly.
const forty = halfIfEven(80)
if (O.isSome(forty)) {
  const twenty = halfIfEven(forty.value)
  if (O.isSome(twenty)) {
    const ten = halfIfEven(twenty.value)
    if (O.isSome(ten)) {
      const five = halfIfEven(ten.value)
    }
  }
}

// Gladly Options have a flatMap function called chain in this library! This allows us to feed Options to functions that don't take Options.
O.flatMap(halfIfEven)(five) // None { _tag: 'None' }

// optionHalfIfEven takes an Option which it then flattens/unwraps it back to a value and feeds it to halfIfEven.
const optionHalfIfEven = O.flatMap(halfIfEven)

optionHalfIfEven(five) // None { _tag: 'None' }
optionHalfIfEven(O.some(4)) // Some { _tag: 'Some', value: 2 }
optionHalfIfEven(O.none()) // None { _tag: 'None' }
// optionHalfIfEven(5)

// Now we can compose pipelines in cleaner ways as the `if` checks have been abstracted away.

// The ugly way.
const halfIfEvenThreeTimes = (v: number) =>
  O.flatMap(halfIfEven)(O.flatMap(halfIfEven)(halfIfEven(v)))

// Nice way.
const halfIfEvenThreeTimesPipe = (v: number) =>
  pipe(
    halfIfEven(v),
    O.flatMap(halfIfEven),
    O.flatMap(halfIfEven),
  )

import { flow } from 'effect/Function'
import { number } from 'effect/Equivalence';

// Cool way.
const halfIfEvenThreeTimesFlow = flow(
  halfIfEven,
  O.flatMap(halfIfEven),
  O.flatMap(halfIfEven),
)

halfIfEvenThreeTimesFlow(40) // Some { _tag: 'Some', value: 5 }
halfIfEvenThreeTimesFlow(10) // None { _tag: 'None' }
halfIfEvenThreeTimesFlow(5)  // None { _tag: 'None' }
halfIfEvenThreeTimesFlow(0)  // Some { _tag: 'Some', value: 0 }

/**
 * In the next section we will be doing some nice error handling with a the Either type.
 */

/**
 * Note: To fully understand some of these patterns is to dive into category theory. Here is a good source to start doing that examples in this section were also inspired by it. https://www.adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
 * 
 * "Category theory is to programming what chemistry is to cooking. Whether you know what a monoid is or not you are still using them."
 */

