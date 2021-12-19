import blocks_keys from "../tables/blocks_keys.js"

export async function createKey(): Promise<string> {
  const key = [...Array(4)]
    .map(() => [...Array(4)].map(() => randomChar()))
    .join("-")
  return (await keyExists(key)) ? createKey() : key
}

export async function createFingerPrint(): Promise<string> {
  const fingerPrint = [...Array(2)]
    .map(() => [...Array(4)].map(() => randomChar()))
    .join("-")
  return (await printExists(fingerPrint)) ? createFingerPrint() : fingerPrint
}

export async function printExists(key_print: string): Promise<boolean> {
  const key = await blocks_keys.query
    .select()
    .where("key_print", key_print)
    .first()
  return !!key
}

export async function keyExists(key_face: string): Promise<boolean> {
  const key = await blocks_keys.query
    .select()
    .where("key_face", key_face)
    .first()
  return !!key
}

export function randomChar() {
  const possibleChars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"
  const randomNumber = Math.floor(Math.random() * possibleChars.length)
  return possibleChars[randomNumber]
}
