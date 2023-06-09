/**
 * Arity is the number of parameters taken by a function. In most languages we can have arity 0 to N.
 */
const nullaryPrint = () => console.log('Hello, World!') // arity 0
const unaryDouble = (a: number) => a * 2 // arity 1
const binarySum = (a: number, b: number) => a + b // arity 2 
const binaryConcat = (a: string, b: string) => a + b // arity 2
const trinaryMultiply = (a: number, b: number, c: number) => a + b + c // arity 3
const naryPrint = (...args: string[]) => console.log(...args) // arity N, where N is a finite number

/**
 * In FP functions either have arity of 1/unary or 0/nullary, meaning they either have one or no inputs.
 * 
 * Having only one input how could we possibly make a function that adds two numbers together?
 *
 * Because functions can be treated as data we have ways to emulate functions of any arity.
 * 
 * Here we have a type definitions for a function of arity 1 that return a function of arity 1 that return a type.
 */
type TCombineTwoNumbers = (a: number) => (b: number) => number
type TCombineTwoStrings = (a: string) => (b: string) => string

/**
 * Here we have an implementation of these types and some example usage.
 */
const sum: TCombineTwoNumbers = a => b => a + b
sum(1)(-1) // 0
sum(2)(3)  // 5

const concat: TCombineTwoStrings = a => b => a + b
concat('Hello, ')('World') // 'Hello, World'
concat('Hola, ')('Mundo')  // 'Hola, Mundo'

/**
 * A function that returns another function is also known as a Higher Order Function (HOF). HOFs allow for Partial Application. In this example addOne and greet is an example of a Partial Application.
 */
const addOne = sum(1)
addOne(2) // 3
addOne(5) // 6

const greet = concat('Hello, ')
greet('Friend')  // 'Hello, Friend'
greet('Haskell') // 'Hello, Haskell'

// From our previous section addToArray4 had arity 2 and so did map. This makes function composition harder.
import {
  map, // arity 2
} from 'lodash'
// arity 2
const addToArray4 = (list: number[], a: number) => map(list, (element: number) => element + a)

// Gladly lodash offer an fp version of map which has arity of 1.
import { map as fpMap } from 'lodash/fp'

// Applying what we've learned we can now have a new version of the function. This new version is pure, more declarative and fully functional.
const fpAddToArray = (a: number) => fpMap((element: number) => element + a)

fpAddToArray(4)([1, 2, 3, 4]) // [ 5, 6, 7, 8 ]

// Additionally this way the function is more composable because the arity is kept to one, which gives us the ability to partially apply the function.
const addOneToArray = fpAddToArray(1)
const addThreeToArray = fpAddToArray(3)

addOneToArray([1, 2, 3, 4]) // [2, 3, 4, 5]
addThreeToArray([1, 2, 3, 4]) // [4, 5, 6, 7]

// Lodash gives us an easy way to compose functions from left to right with the flow and pipe functions.
// import { flow } from '@effect-ts/core/Function'
import { flow } from 'lodash/fp'

const addFourToArray = flow(
  addOneToArray,
  addThreeToArray,
)

addFourToArray([1, 2, 3, 4]) // [5, 6, 7, 8]

// Note: While in the functional style, this version is impure because of the call to console.info which is IO aka a side effect.
const addFourToArrayAndPrint = flow(
  addOneToArray,
  addThreeToArray,
  console.info,
)

addFourToArrayAndPrint([1, 2, 3, 4]) // $ [5, 6, 7, 8]

// Note: Lodash offers an alternative way to pipe functions however it may be trickier to compose existing functions with this.
import { chain } from 'lodash'

chain([1, 2, 3, 4])
  .map((element: number) => element + 1)
  .map((element: number) => element + 3)

/**
 * Next we will explore how to handle the absence of value or nothingness.
 */

/**
 * Let's start with a common pattern.
 */
declare const getUserById: (id: string) => object
declare const readFile: (path: string) => string
declare const calculateTotalAfterTax: (item: object) => number

declare const regularMap: <A, B>(list: A[], mapper: (element: A) => B) => B[]

const getUsersById = (list: string[]) => regularMap(list, getUserById)
const getFiles = (list: string[]) => regularMap(list, readFile)
const calculateItemsTotalAfterTax = (list: object[]) => regularMap(list, calculateTotalAfterTax)

type Mapper<A,B> = (element: A) => B

declare const functionalMap: <A,B>(mapper: Mapper<A,B>) => (list: A[]) => B[]

/**
 * arity 1 enables partial application which increases our ability to easily compose other functions
 */
const getUsersById_fp = functionalMap(getUserById)
const getFiles_fp = functionalMap(readFile)
const calculateItemsTotalAfterTax_fp = functionalMap(calculateTotalAfterTax)

