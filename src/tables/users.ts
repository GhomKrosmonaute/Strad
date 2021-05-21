import * as app from "../app"

const table = new app.Table<{
  id: string
  money: number
  user_tag: string
  last_daily: string
  crea_amount: number
}>({
  name: "users",
  priority: 5,
  setup: (table) => {
    table.string("id").index().unique()
    table.integer("money").defaultTo(0)
    table.string("last_daily")
    table.integer("crea_amount").defaultTo(0)
  },
})

export default table
