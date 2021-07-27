import * as app from "../app"

export default new app.Table<{
  id: number
  name: string
  emoji: string
  price: number
  discount: number
  quantity: number
  buy_amount: number
  is_buyable: boolean
  is_saleable: boolean
  description: string
}>({
  name: "items",
  priority: 5,
  setup: (table) => {
    table.increments("id").primary()
    table.string("name")
    table.string("emoji")
    table.integer("price")
    table.integer("quantity")
    table.integer("discount")
    table.integer("buy_amount")
    table.boolean("is_buyable").defaultTo(true)
    table.boolean("is_saleable").defaultTo(true)
    table.string("description")
  },
})
