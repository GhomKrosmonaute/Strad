import * as app from "../app"

const listener: app.Listener<"ready"> = {
  event: "ready",
  async run() {
    this.on("raw", async (packet: any) => {
      const { d: data, t: type } = packet
      if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(type))
        return
      const channel = this.channels.cache.get(data.channel_id)
      if (!channel || !channel.isText()) return
      if (channel.messages.cache.has(data.message_id)) return
      const message = await channel.messages.fetch(data.message_id)
      const emoji = data.emoji.id
        ? `${data.emoji.name}:${data.emoji.id}`
        : data.emoji.name
      const reaction = message.reactions.cache.get(emoji)
      if (reaction) {
        const user = this.users.cache.get(data.user_id)
        if (user) reaction.users.cache.set(data.user_id, user)
      }
      const packets = {
        MESSAGE_REACTION_ADD: "messageReactionAdd",
        MESSAGE_REACTION_REMOVE: "messageReactionRemove",
      }
      // @ts-ignore
      this.emit(packets[type], reaction, this.users.cache.get(data.user_id))
    })
  },
}

module.exports = listener
