import * as app from "../app"

const table = new app.Table<{
  id: number
  name: string
  price: number
  discount: number
  quantity: number
  buy_amount: number
  is_buyable: boolean
}>({
  name: "items",
  priority: 5,
  setup: (table) => {
    table.increments("id").primary()
    table.string("name")
    table.integer("price")
    table.integer("quantity")
    table.integer("discount")
    table.integer("buy_amount")
    table.boolean("is_buyable").defaultTo(true)
  },
})

export default table
