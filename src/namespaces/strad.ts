import * as discord from "discord.js"

import * as emojis from "./emojis"

import users, { User } from "../tables/users"

export const guild = "412369732679893004"

export const creationChannels = [
  "412622887317405707",
  "412622912043089920",
  "412622999267704834",
  "416227695429550100",
  "425739003623374848",
  "438794104621629441",
  "442374005177974825",
]

export const reactionRoleMessages = {
  creation: "570618282177069076",
  notification: "601739344163897344",
}

export const roles = {
  apprentice: "412587462892716032",
  sanction: "416926896744300544",
  waiting: "444134229710864385",
  mentor: "415211884518703114",
  mute: "623255065716588546",
  mod: "444950686833311744",

  // creator
  graphicDesigner: "412623510649831424",
  drawDesigner: "412623624248492052",
  videoDesigner: "412623697653006340",
  photographer: "425740031815319552",
  soundDesigner: "416940144285843466",
  developer: "442651392721813506",

  // notification
  news: "",
  events: "",
  streams: "",
}

export const channels = {
  presentation: "412557168529899541",
  beforeAfter: "568677435793604649",
  general: "412369732679893008",
  command: "415633143861739541",
  log: "419506197847343132",
}

export const reactionRoleReactions: {
  [key in keyof typeof reactionRoleMessages]: {
    [k: string]: keyof typeof roles
  }
} = {
  creation: {
    "📝": "graphicDesigner",
    "🎞": "videoDesigner",
    "🎨": "drawDesigner",
    "📸": "photographer",
    "💻": "developer",
    "🎹": "soundDesigner",
  },
  notification: {
    "🔔": "news",
    "🎉": "events",
    "📡": "streams",
  },
}

export const answers = {
  "strad ?": "Oui ?",
  "hé strad ?": "Cette blague ? Non arrête, c'est trop xD",
  "au revoir": "Bye !",
  salut: "Salut !",
  patates:
    "Oui, j'avoue apprécier ce légume fort patatoïdal que vous mélangez parfois avec de la viande...",
  "superdelphi est génial": "Oh... Et moi ? :cry:",
}

export const categories = {
  memberCount: "443782424653070346",
}

export function getReactionRole(
  reaction: discord.MessageReaction
): discord.Role | null {
  for (const type in reactionRoleMessages) {
    if (type === reaction.message.id) {
      const reactionRoleReaction =
        reactionRoleReactions[type as keyof typeof reactionRoleMessages]
      if (reactionRoleReaction.hasOwnProperty(reaction.emoji.name)) {
        const roleID =
          roles[reactionRoleReaction[reaction.emoji.name as string]]
        return reaction.message.guild?.roles.cache.get(roleID) ?? null
      }
    }
  }

  return null
}

export function getChannel(
  { client }: { client: discord.Client },
  label: keyof typeof channels
) {
  const channel = client.channels.cache.get(channels[label])
  if (channel instanceof discord.TextChannel) return channel
  throw new Error(label + " channel not longer exists!")
}

export function getCategory(
  { client }: { client: discord.Client },
  label: keyof typeof categories
) {
  const channel = client.channels.cache.get(categories[label])
  if (channel instanceof discord.CategoryChannel) return channel
  throw new Error(label + " category not longer exists!")
}

export function getRole(
  { guild }: { guild: discord.Guild },
  label: keyof typeof roles
) {
  const role = guild.roles.cache.get(roles[label])
  if (role) return role
  throw new Error(label + " role not longer exists!")
}

export async function ensureUser(member: discord.GuildMember) {
  const user = await users.query.select().where("id", member.id).first()

  if (!user) {
    const user: User = {
      id: member.id,
      money: 0,
      crea_amount: 0,
      tag: member.displayName,
      last_daily: "",
    }
    await users.query.insert(user)
    return user
  }

  return user
}

export function feedback(
  reaction: discord.MessageReaction,
  member: discord.GuildMember
) {
  const BLOCK = emojis.emoji(reaction.client, "BLOCK")
  const UPVOTE = emojis.emoji(reaction.client, "UPVOTE")
  const DOWNVOTE = emojis.emoji(reaction.client, "DOWNVOTE")
  const DOWNLOAD = emojis.emoji(reaction.client, "DOWNLOAD")
  const ENABLE_VOTES = "✨"

  if (
    reaction.emoji.id === DOWNLOAD.id &&
    (reaction.message.reactions.cache.filter(
      (reaction) =>
        reaction.emoji.id === UPVOTE.id &&
        reaction.users.cache.some(
          (user) => user.id === reaction.client.user?.id
        )
    ).size > 0
      ? true
      : false)
  ) {
    if (
      reaction.message.author.id === member.id ||
      !reaction.message.attachments
    ) {
      return reaction.users.remove(member)
    }

    const attachment = reaction.message.attachments.first()
    const imageInformations = await probe(attachment.url).catch(console.error)
    const dimensions = imageInformations
      ? `${imageInformations.width}${imageInformations.hUnits} x ${imageInformations.height}${imageInformations.hUnits}`
      : "Dimension inconnue"
    const description = `En téléchargeant la création de ${reaction.message.member.displayName}, tu as ajouté **2** ${blockEmoji} sur sa prochaine récompense !`
    const fileExtension = imageInformations
      ? imageInformations.type
      : "Extension inconnue"

    const response = await connection.query(
      `SELECT * FROM rewards WHERE rewarder_id = "${user.id}" AND message_id = "${reaction.message.id}" AND type = "DL"`
    )
    if (!response[0]) {
      await connection.query(
        `INSERT INTO rewards (message_id, rewarded_id, rewarder_id, type, submit_date) VALUES ("${
          reaction.message.id
        }", "${reaction.message.author.id}", "${
          user.id
        }", "DL", "${moment().format("DD/MM/YY")}")`
      )
    }

    const downloadEmbed = new Discord.RichEmbed()
      .setTitle(`Téléchargement de ${attachment.filename}`)
      .setDescription(
        `${description}
      Dimensions : ${dimensions} / Type : ${fileExtension}`
      )
      .setColor(colors.DOWNLOAD)
      .addField(`Lien de téléchargement`, attachment.proxyURL)
    user.send(downloadEmbed)
  } else if (
    !checkFeedbackable(reaction.message) &&
    reaction.emoji.name === enableVotesEmoji
  ) {
    reaction.remove(user)
    return
  } else if (
    reaction.emoji.id === upVoteEmoji ||
    reaction.emoji.id === downVoteEmoji
  ) {
    if (
      reaction.message.author.id === user.id ||
      !checkFeedbackActivation(reaction.message)
    ) {
      reaction.remove(user)
      return
    }

    const voteType = reaction.emoji.id === upVoteEmoji ? "UV" : "DV"

    const response = await connection.query(
      `SELECT * FROM rewards WHERE rewarder_id = "${user.id}" AND message_id = "${reaction.message.id}" AND type IN ("UV", "DV")`
    )
    if (response[0]) return

    await connection.query(
      `INSERT INTO rewards (message_id, rewarded_id, rewarder_id, type, submit_date) VALUES ("${
        reaction.message.id
      }", "${reaction.message.author.id}", "${
        user.id
      }", "${voteType}", "${moment().format("DD/MM/YY")}")`
    )

    connection.end()
  } else if (reaction.emoji.name === enableVotesEmoji) {
    if (
      user.id === reaction.message.author.id &&
      !checkFeedbackActivation(reaction.message)
    ) {
      await reaction.remove(client.user)
      await reaction.message.react(
        client.emojis.get(client.assets.emojiIds.UPVOTE)
      )
      await reaction.message.react(
        client.emojis.get(client.assets.emojiIds.DOWNVOTE)
      )
      if (reaction.message.attachments)
        await reaction.message.react(
          client.emojis.get(client.assets.emojiIds.DOWNLOAD)
        )
    }
    reaction.remove(user)
  }
}
