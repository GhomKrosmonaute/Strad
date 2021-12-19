import * as command from "../app/command.js"
import * as strad from "./strad.js"

export const modOnly: command.Middleware<"guild"> = (message, data) => {
  return {
    result:
      message.member.roles.cache.has(strad.roles.mod) ||
      "You must be a moderator!",
    data,
  }
}

export const mentorOnly: command.Middleware<"guild"> = (message, data) => {
  return {
    result:
      message.member.roles.cache.has(strad.roles.mentor) ||
      "You must be a mentor!",
    data,
  }
}
