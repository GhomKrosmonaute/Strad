import * as app from "../app"
import canvas from "canvas"

const listener: app.Listener<"messageReactionAdd"> = {
  event: "messageReactionAdd",
  async run(reaction, user) {
    const message = reaction.message

    const CHECK_TRUE = app.emoji(message.client, "CHECK_TRUE")
    const REPORT = app.emoji(message.client, "REPORT")

    if (!app.isNormalMessage(message)) return
    if (!app.isGuildMessage(message)) return
    if (user.bot) return

    const member = await message.guild.members.fetch(user.id)

    const reactionRole = app.getReactionRole(reaction)

    if (reactionRole) return member.roles.add(reactionRole).catch()

    if (app.creationChannels.includes(message.channel.id))
      return app.feedback(reaction, member)

    if (
      reaction.message.channel.id === app.channels.presentation &&
      reaction.count === 1
    ) {
      // Rôles
      const memberRole = app.getRole(message, "member")
      const apprenticeRole = app.getRole(message, "apprentice")
      const waitingRole = app.getRole(message, "waiting")

      if (
        reaction.emoji.id === CHECK_TRUE.id &&
        message.member.roles.cache.has(waitingRole.id)
      ) {
        // Le membre est un apprenti/en attente : on lui ajoute le rôle membre
        await message.member.roles.add(memberRole)
        await message.member.roles.add(apprenticeRole)
        await message.member.roles.add(waitingRole)

        await message.member.send(
          "Hey, ta présentation vient d'être acceptée ! Va voir sur Stradivarius :wink:"
        )

        reaction.message.reactions.cache.clear()

        const general = app.getChannel(reaction, "general")

        canvas.registerFont("assets/welcome/welcome_font.ttf", {
          family: "Red Hat Display",
        })

        const cv = canvas.createCanvas(600, 270)
        const ctx = cv.getContext("2d")

        ctx.save()

        const avatar = await canvas.loadImage(member.user.displayAvatarURL())
        const asset1 = await canvas.loadImage("assets/welcome/asset1.png")
        const asset2 = await canvas.loadImage("assets/welcome/asset2.png")

        ctx.drawImage(asset1, 42, 47, 516, 215)
        app.roundRect(ctx, 232, 13, 136, 136, 10, "#ffffff", false)
        ctx.clip()
        ctx.drawImage(avatar, 232, 13, 136, 136)
        ctx.restore()
        ctx.font = "22px Red Hat Display"
        ctx.fillStyle = "#36393f"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("BIENVENUE SUR STRADIVARIUS", cv.width / 2, 182)
        ctx.font = "35px Red Hat Display"
        ctx.fillText(`${member.user.tag}`, cv.width / 2, 215)
        ctx.drawImage(asset2, 82, 125, 436, 145)

        return general.send(
          "",
          new app.MessageAttachment(cv.toBuffer(), "welcome.png")
        )
      }

      return
    }

    if (reaction.emoji.id === REPORT.id) {
      const reactedRecently = new Set<string>()

      if (message.member.user.bot) {
        await reaction.users.remove(member)

        return member.send(
          "Tu ne peux pas signaler mes messages. C'est vraiment l'hôpital qui se fout de la charité !"
        )
      }
      if (member.id === reaction.message.author.id) {
        await reaction.users.remove(member)

        return member.send("Tu ne peux pas signaler ton propre message.")
      }
      if (
        message.member.roles.cache.has(app.roles.mod) ||
        message.member.roles.cache.has(app.roles.mentor)
      ) {
        await reaction.users.remove(member)

        return member.send(
          "Tu ne peux pas signaler le message d'un membre du staff."
        )
      }
      if (
        [
          ...(reaction.message.reactions.cache.find(
            (reaction) => reaction.emoji.id === REPORT.id
          )?.users.cache ?? []),
        ].length > 1
      ) {
        return member.send(
          "Ce message a déjà été signalé, merci pour ta contribution !"
        )
      }
      if (reactedRecently.has(user.id)) {
        await reaction.users.remove(member)

        return member.send(
          "Tu ne peux signaler un message que toutes les 30 secondes !"
        )
      } else {
        // Adds the user to the set so that they can't talk for a minute
        reactedRecently.add(user.id)
        setTimeout(() => {
          // Removes the user from the set after a minute
          reactedRecently.delete(user.id)
        }, 30000)
      }

      const reportedMessage = reaction.message.cleanContent

      return app
        .getChannel(reaction, "log")
        .send(
          new app.MessageEmbed()
            .setTitle("Message signalé")
            .setDescription(`Un nouveau message a été signalé par ${user}.`)
            .setColor(app.WARNING)
            .addField("Contenu", reportedMessage, true)
            .addField("Localisation", reaction.message.channel, true)
            .addField("Lien direct", reaction.message.url, true)
        )
    }
  },
}

export default listener
