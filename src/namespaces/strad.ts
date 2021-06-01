import * as command from "../app/command"
import * as app from "./sendMessage"

import users from "../tables/users"

export const commandChannel = "415633143861739541"
export const mentorRole = "415211884518703114"
export const logChannel = "419506197847343132"
export const muteRole = "623255065716588546"
export const modRole = "444950686833311744"
export const guild = "412369732679893004"

export function getCommandChannel(message: command.GuildMessage) {
  const channel = message.client.channels.cache.get(commandChannel)

  if (!channel?.isText()) throw new Error("Command channel not longer exists!")

  return channel
}

export function getLogChannel(message: command.GuildMessage) {
  const channel = message.client.channels.cache.get(logChannel)

  if (!channel?.isText()) throw new Error("Log channel not longer exists!")

  return channel
}

export function getMuteRole(message: command.GuildMessage) {
  const role = message.guild.roles.cache.get(muteRole)

  if (!role) throw new Error("Mute role not longer exists!")

  return role
}

export async function ensureUser(id: string) {
  const user = await users.query.select().where("id", id).first()

  if (!user) {
    const user = {
      id,
      money: 0,
      crea_amount: 0,
      user_tag: `<@${id}>`,
    }
    await users.query.insert(user)
    return user
  }

  return user
}
