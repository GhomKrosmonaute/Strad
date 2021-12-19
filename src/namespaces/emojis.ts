import * as app from "../app.js"

export const emojiList = {
  BLOCK: "708605242148651009",
  CREA: "547482886824001539",
  UPVOTE: "622719358078156800",
  DOWNVOTE: "622719341707788296",
  REPORT: "418441210475053056",
  CHECK_TRUE: "413685423202893826",
  CHECK_FALSE: "413686965796339722",
  KEY_VALID: "607877884413214720",
  KEY_USED: "607877912955322406",
  DISCOUNT: "603356048107241483",
  DOWNLOAD: "622738318680915968",
}

export type EmojiName = keyof typeof emojiList

export function emoji(
  client: app.Client,
  emojiName: EmojiName
): app.GuildEmoji {
  const emoji = client.emojis.cache.get(emojiList[emojiName])
  if (!emoji) throw new Error(`The ${emojiName} emoji not longer exists.`)
  return emoji
}
