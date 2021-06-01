import * as command from "../app/command"
import * as strad from "./strad"

export const modOnly: command.Middleware<"guild"> = (message) => {
  return (
    message.member.roles.cache.has(strad.roles.mod) ||
    "You must be a moderator!"
  )
}

export const mentorOnly: command.Middleware<"guild"> = (message) => {
  return (
    message.member.roles.cache.has(strad.roles.mentor) ||
    "You must be a mentor!"
  )
}
