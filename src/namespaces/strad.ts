import * as discord from "discord.js"
import * as emojis from "./emojis.js"
import * as colors from "./colors.js"
import * as command from "../app/command.js"
import * as core from "../app/core.js"

import users, { User } from "../tables/users.js"
import rewards, { Reward } from "../tables/rewards.js"

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
  assistant: "",
  sanction: "416926896744300544",
  waiting: "444134229710864385",
  member: "443748696170168321",
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
  reaction: discord.MessageReaction | discord.PartialMessageReaction
): discord.Role | null {
  for (const type in reactionRoleMessages) {
    if (type === reaction.message.id) {
      const reactionRoleReaction =
        reactionRoleReactions[type as keyof typeof reactionRoleMessages]
      if (
        reactionRoleReaction.hasOwnProperty(
          reaction.emoji.name ?? reaction.emoji.id ?? reaction.emoji.toString()
        )
      ) {
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

export async function feedback(
  reaction: discord.MessageReaction | discord.PartialMessageReaction,
  member: discord.GuildMember
) {
  if (!command.isNormalMessage(reaction.message))
    throw new Error("Fail occurred during feedback process")

  const BLOCK = emojis.emoji(reaction.client, "BLOCK")
  const UPVOTE = emojis.emoji(reaction.client, "UPVOTE")
  const DOWNVOTE = emojis.emoji(reaction.client, "DOWNVOTE")
  const DOWNLOAD = emojis.emoji(reaction.client, "DOWNLOAD")
  const ENABLE_VOTES = "✨"

  const attachment = reaction.message.attachments.first()

  const isFeedbackAble =
    reaction.message.reactions.cache.filter(
      (react) =>
        react.emoji.id === UPVOTE.id &&
        react.users.cache.some((user) => user.id === react.client.user?.id)
    ).size > 0

  if (reaction.emoji.id === DOWNLOAD.id && isFeedbackAble && attachment) {
    if (
      reaction.message.author.id === member.id ||
      !reaction.message.attachments
    ) {
      return reaction.users.remove(member)
    }

    const rewardData = await rewards.query
      .select()
      .where("rewarder_id", member.id)
      .and.where("message_id", reaction.message.id)
      .and.where("type", "DL")
      .first()

    let reward: Reward = rewardData ?? {
      message_id: reaction.message.id,
      rewarded_id: reaction.message.author.id,
      rewarder_id: member.id,
      type: "DL",
      submit_date: core.dayjs().format("DD/MM/YY"),
    }

    if (!rewardData) await rewards.query.insert(reward)

    return member.send({
      embeds: [
        new discord.MessageEmbed()
          .setTitle(`Téléchargement de ${attachment.name}`)
          .setDescription(
            `En téléchargeant la création de ${reaction.message.member?.displayName}, tu as ajouté **2** ${BLOCK} sur sa prochaine récompense !`
          )
          .setColor(colors.DOWNLOAD)
          .addField(`Lien de téléchargement`, attachment.proxyURL),
      ],
    })
  } else if (!isFeedbackAble && reaction.emoji.name === ENABLE_VOTES) {
    return reaction.users.remove(member)
  } else if (
    reaction.emoji.id === UPVOTE.id ||
    reaction.emoji.id === DOWNVOTE.id
  ) {
    if (reaction.message.author?.id === member.id || !isFeedbackAble) {
      return reaction.users.remove(member)
    }

    const voteType = reaction.emoji.id === UPVOTE.id ? "UV" : "DV"

    const rewardData = await rewards.query
      .select()
      .where("rewarder_id", member.id)
      .and.where("message_id", reaction.message.id)
      .and.whereIn("type", ["UV", "DV"])
      .first()

    let reward: Reward = rewardData ?? {
      message_id: reaction.message.id,
      rewarded_id: reaction.message.author.id,
      rewarder_id: member.id,
      type: voteType,
      submit_date: core.dayjs().format("DD/MM/YY"),
    }

    if (!rewardData) await rewards.query.insert(reward)
  } else if (reaction.emoji.name === ENABLE_VOTES) {
    if (member.id === reaction.message.author.id && !isFeedbackAble) {
      await reaction.users.remove()
      await reaction.message.react(UPVOTE)
      await reaction.message.react(DOWNVOTE)
      if (reaction.message.attachments.size > 0)
        await reaction.message.react(DOWNLOAD)
    }

    return reaction.users.remove(member)
  }
}
