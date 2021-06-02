import * as discord from "discord.js"

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

export const roles = {
  apprentice: "412587462892716032",
  sanction: "416926896744300544",
  waiting: "444134229710864385",
  mentor: "415211884518703114",
  mute: "623255065716588546",
  mod: "444950686833311744",
}

export const channels = {
  presentation: "412557168529899541",
  beforeAfter: "568677435793604649",
  general: "412369732679893008",
  command: "415633143861739541",
  log: "419506197847343132",
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
