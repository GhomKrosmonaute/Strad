import * as app from "../app"

const table = new app.Table<{
  key_face: string
  key_value: number
  key_print: string
  creator_id: string
  redeem_date: string
  creation_date: string
  recipient_id: string | null
}>({
  name: "blocks_keys",
  setup: (table) => {
    table.integer("key_value")
    table.string("key_face")
    table.string("key_print").unique()
    table.string("creator_id")
    table.string("redeem_date")
    table.string("creation_date")
    table.string("recipient_id").nullable()
  },
})

export default table
