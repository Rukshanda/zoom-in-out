import { ComponentApp } from "../types";

export const name = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp
) => {
  const { width, x, y, name, title, config } = component;
  const { fontSize, initScale } = config;
  let text = title || name; 
  if (!text) return;
  ctx.save();
  ctx.beginPath();
  ctx.font = `400 ${fontSize * initScale}px Inter, sans-serif`;
  ctx.fillStyle = "#979797";
  const textWidth = ctx.measureText(text).width;
  const rectWidth = width - 10;

  if (textWidth > rectWidth) {
    const ellipsis = "...";
    let truncatedText = text.slice(0, -1);
    while (
      truncatedText.length > 1 &&
      ctx.measureText(truncatedText + ellipsis).width > rectWidth
    ) {
      truncatedText = truncatedText.slice(0, -1);
    }
    text = truncatedText + ellipsis;
  }
  ctx.textAlign = "left";
  ctx.fillText(text, x, y - 5.5 * initScale);
  ctx.closePath();
  ctx.restore();
};
