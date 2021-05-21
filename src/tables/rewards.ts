import * as app from "../app"

const table = new app.Table<{
  type: "UV" | "DV" | "DL"
  rewarded_id: string
  daily_date: string | null
}>({
  name: "rewards",
  setup: (table) => {
    table.string("type", 2)
    table
      .string("rewarded_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table.string("daily_date").nullable()
  },
})

export default table
