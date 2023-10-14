import _ from 'lodash'
import {} from 'lodash/fp'

type Choice = { price?: number, quantity: number }
type Item = { choices: Choice[], quantity: number }
type Order = { id: number, items: Item[] }

declare const isItemRefundable: (item: Choice) => boolean
declare const multiplyOrderItemsByQuantity: (order: Order) => Order
declare const augmentWithRefundabilityData: (choice: Choice) => Item & { isRefundable: boolean }


const lodashVersion = (order: Order): Order => {
  const items = _.get(order, 'items')

  const updatedItems = _.flatMap(items, item => {
    const choices = _.get(item, 'choices')

    const [refundableChoices, nonRefundableChoices] = _.partition(choices, isItemRefundable)
    const refundableItems = _.map(refundableChoices, augmentWithRefundabilityData)

    return [
      {
        ...item,
        choies: nonRefundableChoices,
      },
      ...refundableItems,
    ]    
  })  

  return {
    ...order,
    items: updatedItems,
  }
}

const processOrder = _.flow(multiplyOrderItemsByQuantity, lodashVersion, multiplyOrderItemsByQuantity)

declare const testOrder: Order

const result = processOrder(testOrder)

