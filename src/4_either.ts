/**
 * Let's start with some simple functions that we will use to make a password validator. We will start with a common approach to structure the data flow.
 */
type FuncCheck = (s: string) => string

const minLength: FuncCheck = s => {
  if (s.length >= 6) { 
    return s
  } 
  throw new Error('at least 6 characters')
}
const oneCapital: FuncCheck = s => {
  if (/[A-Z]/g.test(s)) { 
    return s
  } 
  throw new Error('at least one capital letter')
}
const oneNumber: FuncCheck = s => {
  if (/[0-9]/g.test(s)) { 
    return s
  } 
  throw new Error('at least one number')
}

const passwordValidate = (s: string) => {
  try {
    minLength(s)
    oneCapital(s)
    oneNumber(s)
    
    return s
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Now we will move on to abstract away some of the pain points of the previous code in a functional way.
 */

import * as T from '@effect-ts/core/Effect'
import * as E from '@effect-ts/core/Either'
import { flow } from '@effect-ts/core/Function'

/**
 * So we have done some error prevention using the option types, however we now have to look into doing error handling. In most languages function signatures aren't forced to be explicit about the possibility of failure. In FP we have to be explicit about it, for this purpose we have the Either wrapper.
 */
const acceptPositiveOdds = (a: number): E.Either<string, number> => {
  if (a % 2 == 0) {
    return E.left('Received Even Value')
  } else if (a < 0) {
    return E.left('Received Negative Value')
  } else {
    return E.right(a)
  }
}

acceptPositiveOdds(2)  // Left { left: 'Received Even Value', _tag: 'Left' }
acceptPositiveOdds(-1) // Left { left: 'Received Negative Value', _tag: 'Left' }
acceptPositiveOdds(5)  // Right { right: 5, _tag: 'Right' }

/**
 * Here is a more practical example in which we define validation steps for a password validator.
 */
type FuncCheckFp = (s: string) => E.Either<string, string>

const minLengthFp: FuncCheckFp = s => s.length >= 6 ? E.right(s) : E.left('at least 6 characters')
const oneCapitalFp: FuncCheckFp = s => /[A-Z]/g.test(s) ? E.right(s) : E.left('at least one capital letter')
const oneNumberFp: FuncCheckFp = s => /[0-9]/g.test(s) ? E.right(s) : E.left('at least one number')

/**
 * Either also has a chain function which applies the input function to Rights and ignores Lefts.
 */
const passwordValidateFp = flow(
  minLengthFp,
  E.chain(oneCapitalFp),
  E.chain(oneNumberFp),
)

passwordValidateFp('pass')     // Left { left: 'at least 6 characters', _tag: 'Left' }
passwordValidateFp('password') // Left { left: 'at least one capital letter', _tag: 'Left' }
passwordValidateFp('Password') // Left { left: 'at least one number', _tag: 'Left' }
passwordValidateFp('Passw0rd') // Right { right: 'Passw0rd', _tag: 'Right' }

/**
 * For the example above it would be nice if we could get all of the parse errors accumulated, that way we could display all of them to the users. There is a way to do this which we will explore in the next section.
 */

/**
 * Either types are nice but what do we do with existing libraries that don't use them?
 * 
 * To handle code from existing libraries we have some useful wrappers in effect-ts/fp-ts to make them align with the FP style.
 * 
 * Some libraries export their custom errors which we can use to add to our function signatures.
 */
type ParsePositiveEvens = (a: number) => number

class OddValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OddValueError';
  }
}

class NegativeValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NegativeValueError';
  }
}

const acceptPositiveEvens: ParsePositiveEvens = a => {
  if (a % 2 == 0) {
    return a
  } else if (a < 0) {
    throw new NegativeValueError('Received Negative Value')
  } else {
    throw new OddValueError('Received Odd Value')
  }
}

const wrappedErrorIfOdd = T.tryCatch(
  () => acceptPositiveEvens,
  E.toError,
)

const wrappedErrorIfOdd2 = E.tryCatch(
  () => acceptPositiveEvens,
  error => {
    if (error instanceof OddValueError) {
      return error
    }

    if (error instanceof NegativeValueError) {
      return error
    }

    return 'Unknown Error'
  },
)
