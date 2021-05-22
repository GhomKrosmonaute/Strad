import * as command from "../app/command"

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
