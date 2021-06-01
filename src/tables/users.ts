import * as app from "../app"

export interface User {
  id: string
  tag: string
  rank: string
  money: number
  last_daily: string
  crea_amount: number
}

const table = new app.Table<User>({
  name: "users",
  priority: 5,
  setup: (table) => {
    table.string("id").index().unique()
    table.string("tag")
    table.string("rank")
    table.integer("money").defaultTo(0)
    table.string("last_daily")
    table.integer("crea_amount").defaultTo(0)
  },
})

export default table
