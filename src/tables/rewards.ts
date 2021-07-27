import * as app from "../app"

export interface Reward {
  type: "UV" | "DV" | "DL"
  message_id: string
  rewarder_id: string
  rewarded_id: string
  submit_date: string | null
}

export default new app.Table<Reward>({
  name: "rewards",
  setup: (table) => {
    table.string("type", 2)
    table.string("message_id")
    table
      .string("rewarder_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .string("rewarded_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table.string("submit_date").nullable()
  },
})
