import * as canvas from "canvas"

export function roundRect(
  context: canvas.NodeCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: any,
  fill: number | string,
  stroke: number | false
) {
  if (typeof radius === "number") {
    radius = {
      "top-left": radius,
      "top-right": radius,
      "bottom-left": radius,
      "bottom-right": radius,
    }
  } else {
    const defaultRadius = {
      "top-left": 0,
      "top-right": 0,
      "bottom-left": 0,
      "bottom-right": 0,
    }
    for (const side in defaultRadius)
      radius[side] =
        radius[side] ||
        (defaultRadius[side as keyof typeof defaultRadius] as any)
  }
  context.beginPath()
  context.moveTo(x + radius["top-left"], y)
  context.lineTo(x + width - radius["top-right"], y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius["top-right"])
  context.lineTo(x + width, y + height - radius["bottom-right"])
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius["bottom-right"],
    y + height
  )
  context.lineTo(x + radius["bottom-left"], y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius["bottom-left"])
  context.lineTo(x, y + radius["top-left"])
  context.quadraticCurveTo(x, y, x + radius["top-left"], y)
  context.closePath()
  if (fill) {
    context.fillStyle = "rgba(54, 57, 63, 0)"
    context.fill()
  }
  if (stroke) context.stroke()
}
