/**
 * Functional Programming is a programming paradigm where programs are constructed by APPLYING and COMPOSING functions. It is a declarative programming paradigm in which function definitions are trees of expressions that map values to other values, rather than a sequence of imperative statements which update the running state of the program.
 * 
 * Pure Functions are functions that do not have any side effects, their inputs always map to the same output, therefore they are deterministic. For practical purposes this property makes them very easy to test.
 * 
 * Side Effects are of great importance as they allow operations such as: data base connections, random number generation, printing to console, http requests, get/set a variable/state from outside the scope of the function, disk reads and writes, all of these fall into the category of Input/Output shortened to IO.
 * 
 * Impure Functions are functions that have side effects, their inputs can map to more than one output, in the scope of a program they considered non-deterministic. For practical purposes this property makes them harder to test.
 */

// Impure, it has a side effect because the input array is being mutated
const addToArray1 = (arr: number[], x: number) => {
  for (let index = 0; index < arr.length; index++) {
    arr[index] = arr[index] + x
  }
}

// In JS objects are passed by reference, everything else is passed by value. Therefore it is possible for a function to mutate their inputs if they are objects.
const mutated: number[] = [1, 2, 3]
mutated // [1,2,3]
addToArray1(mutated, 4)
mutated // [5,6,7]

// Pure, no data from outside the scope is being mutated. However the approach is more on the imperative side.
const addToArray2 = (a: number[], b: number) => {
  const result: number[] = []
  for (let index = 0; index < a.length; index++) {
    // this operation is still mutation
    result.push(a[index] + b)
  }

  return result
}

import { concat } from 'lodash'

// Pure, the approach is more functional as we no longer use the array's push() method to mutate itself.
const addToArray3 = (a: number[], b: number) => {
  let result: number[] = []
  for (let index = 0; index < a.length; index++) {
    result = concat(result, a[index] + b)
  }

  return result
}

import { map } from 'lodash'

// Pure and now fully declarative the common iterative pattern has been abstracted away as the "map" function, however we will see why this version of map is still not entirely in functional style. We will see how to get there later in the next section.
const addToArray4 = (list: number[], a: number) => map(list, (element: number) => element + a)

addToArray4([1, 2, 3, 4], 4) // [5,6,7,8]

/**
 * Purity at Glance
 */
let mutableVar = 'initial'
let mutableShouldSkip = true

// Impure functions are unpredictable because of side effects, this also makes them harder to unit test as you will need to mock the environment it runs on. However most of the useful things we do are side effects, FP has ways of nicely dealing with the unpredictability of impure functions.
const impureFunction = () => {
  if(mutableShouldSkip) { // side effect: reading outside of scope, we have no guarantees about the value of this function.
    return null
  }

  mutableVar = 'different' // side effect: writing outside of scope.

  return mutableVar
}

// Pure functions are deterministic and therefore predictable, easy to unit test too.
const pureFunction = (shouldSkip: boolean) => {
  if(shouldSkip) {
    return null
  }

  const immutableVar = 'different' // objects may be exceptions

  return immutableVar
}
