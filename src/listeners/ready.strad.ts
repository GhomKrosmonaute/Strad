import * as app from "../app.js"

const listener: app.Listener<"ready"> = {
  event: "ready",
  description: "Set rich presence",
  once: true,
  async run() {
    this.user.setActivity(`Strad help`, {
      type: "STREAMING",
      url: "https://www.twitch.tv/delphistudio",
    })
  },
}

export default listener
