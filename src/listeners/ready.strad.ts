import * as app from "../app"

const listener: app.Listener<"ready"> = {
  event: "ready",
  once: true,
  async run() {
    this.user
      ?.setActivity(`Strad help`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/delphistudio",
      })
      .catch()
  },
}

export default listener
