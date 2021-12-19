import * as app from "../app.js"

export interface User {
  id: string
  tag: string
  rank?: string
  money: number
  last_daily: string
  crea_amount: number
}

export default new app.Table<User>({
  name: "users",
  priority: 5,
  description: "Represent users",
  setup: (table) => {
    table.string("id").index().unique()
    table.string("tag")
    table.string("rank").nullable()
    table.integer("money").defaultTo(0)
    table.string("last_daily")
    table.integer("crea_amount").defaultTo(0)
  },
})
