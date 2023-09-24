// Inject of all the things
// big mac approach

import { map, partition } from "lodash"

type PriceData = {
  isRefundable: boolean
  dollars: number
  paymentType: number
}

type Choice = {
  id: string
  price: number
}

type Item = {
  id: string
  price: number
  choices: Choice[]
}

const priceDataTable = new Map<string, PriceData>()
type TablePriceData = typeof priceDataTable

declare const getItemIsRefundable: (priceMap: TablePriceData) => (item: Item) => boolean

declare const getItemPriceDollars: (priceMap: TablePriceData) => (item: Item) => number

declare const extractChoices: (items: Item) => Choice[]

declare const choiceToItem: (choice: Choice) => Item

const extractItemChoices = (priceDataTable: TablePriceData) => (items: Item[]) => {
  const getItemIsRefundableFromPriceTable = getItemIsRefundable(priceDataTable)
  const getItemPriceDollarsFromPriceTable = getItemPriceDollars(priceDataTable)

  const extractedItemChoices = map<Item, Item>(items, item => {
    const isRefundable: boolean = getItemIsRefundableFromPriceTable(item)
    const price: number = getItemPriceDollarsFromPriceTable(item)

    

    return {
      ...item,
    }
  })

  return extractedItemChoices
}
