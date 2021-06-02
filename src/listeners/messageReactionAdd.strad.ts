import * as app from "../app"

const listener: app.Listener<"messageReactionAdd"> = {
  event: "messageReactionAdd",
  async run(reaction, user) {
    const message = reaction.message

    if (!app.isCommandMessage(message)) return
    if (!app.isGuildMessage(message)) return
    if (user.bot) return

    const member = await message.guild.members.fetch(user.id)

    const reactionRole = app.getReactionRole(reaction)

    if (reactionRole) return member.roles.add(reactionRole)

    if (app.creationChannels.includes(message.channel.id))
      return app.feedback(reaction, member)

    if (
      reaction.message.channel.id === app.channels.presentation &&
      reaction.count === 1
    )
      acceptPresentation(reaction)

    // Si la réaction correspond à la réaction de report, ce bloc s'exécute.
    if (reaction.emoji.id === client.assets.emojiIds.REPORT)
      report(reaction, user)
  },
}

module.exports = listener
