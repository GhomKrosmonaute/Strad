import * as app from "../app"

const listener: app.Listener<"messageReactionRemove"> = {
  event: "messageReactionRemove",
  async run(reaction, user) {
    const message = reaction.message

    if (!app.isNormalMessage(message)) return
    if (!app.isGuildMessage(message)) return
    if (user.bot) return

    const member = await message.guild.members.fetch(user.id)

    const reactionRole = app.getReactionRole(reaction)

    if (reactionRole) return member.roles.remove(reactionRole).catch()
  },
}

export default listener
