import * as T from '@effect-ts/core/Effect'
import * as E from '@effect-ts/core/Either';
import { flow } from '@effect-ts/core/Function'

const addNumbers = async <T extends number>(a: T) => a + 10;

const addNumbersWrapper = flow(
  addNumbers,
  add => T.tryCatchPromise(
    () => add,
    E.toError,
  )
)

const addThreeNumbers = flow(
  addNumbersWrapper,
  T.chain(addNumbersWrapper),
  T.chain(addNumbersWrapper),
  T.mapTryCatch(
    r => console.log('Result: ', r),
    console.error,
  )
)

T.runPromise(addThreeNumbers(1))

export {
  addThreeNumbers
}