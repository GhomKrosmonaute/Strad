import * as app from "../app.js"

export default new app.Table<{
  user_id: string
  item_id: number
  amount: number
}>({
  name: "has_item",
  description: "Represent a link item-user",
  setup: (table) => {
    table
      .string("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .integer("item_id")
      .references("id")
      .inTable("items")
      .onDelete("CASCADE")
    table.integer("amount").defaultTo(0)
  },
})
