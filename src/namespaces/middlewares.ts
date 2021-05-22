import * as command from "../app/command"
import * as strad from "./strad"

export const modOnly: command.Middleware<command.GuildMessage> = (message) => {
  return (
    message.member.roles.cache.has(strad.moderatorRole) ||
    "You must be a moderator!"
  )
}

export const mentorOnly: command.Middleware<command.GuildMessage> = (
  message
) => {
  return (
    message.member.roles.cache.has(strad.mentorRole) || "You must be a mentor!"
  )
}
