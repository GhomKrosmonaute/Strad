import * as app from "../app"

const table = new app.Table<{
  id: string
  money: number
}>({
  name: "users",
  priority: 5,
  setup: (table) => {
    table.string("id").index().unique()
    table.integer("money").defaultTo(0)
  },
})

export default table
