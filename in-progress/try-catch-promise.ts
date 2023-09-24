import * as T from 'effect/Effect'
import * as E from 'effect/Either';
import { flow } from 'effect/Function'
import Cause from 'effect/Cause'

const addNumbers = async <T extends number>(a: T) => a + 10;

const addNumbersWrapper = flow(
  addNumbers,
  add => T.tryPromise({
    try: () => add,
    catch: (unknown) => new Error(`something went wrong ${unknown}`),
  })
)

const addThreeNumbers = flow(
  addNumbersWrapper,
  T.flatMap(addNumbersWrapper),
  T.flatMap(addNumbersWrapper),
  T.tryMap({
    try: r => console.log('Result: ', r),
    catch: console.error,
  })
)

T.runPromise(addThreeNumbers(1))

export {
  addThreeNumbers
}