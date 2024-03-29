import { Either, left, right, mapLeft } from 'effect/Either'
import { pipe } from 'effect/Function'
// import { NonEmptyArray } from 'effect/Data'

type FuncCheck = (s: string) => Either<string, string>

const minLength: FuncCheck = s => s.length >= 6 ? right(s) : left('at least 6 characters')

const oneCapital: FuncCheck = s => /[A-Z]/g.test(s) ? right(s) : left('at least one capital letter')

const oneNumber: FuncCheck = s => /[0-9]/g.test(s) ? right(s) : left('at least one number')

const lift = <E, A>(check: (a: A) => Either<E, A>): (a: A) => Either<E[], A> =>
  a => pipe(
    check(a),
    mapLeft(a => [a])
  )

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)

// const applicativeValidation = getValidationApplicative(getSemigroup<string>())

// const semi = getSemigroup<string>()

// semi.concat([''], [''])


// const validatePassword = (s: string): Either<NonEmptyArray<string>, string> =>
//   pipe(
//     sequenceT(applicativeValidation)(
//       minLengthV(s),
//       oneCapitalV(s),
//       oneNumberV(s)
//     ),
//     map(() => s),
//   )
