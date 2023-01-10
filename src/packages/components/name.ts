import { ComponentApp } from "../types";
import { isHovered2, makeScreen } from "../Canvas/utlis";
import { INIT_SCALE, LETTER_SPACING } from "../conts";

export const name = (
  ctx: CanvasRenderingContext2D & { letterSpacing?: string },
  component: ComponentApp,
  isSelect?: boolean
) => {
  const { width, x, y, name, title, config, zoom, getControl, id } =
    makeScreen(component);
  const { fontSize, colorNameFocus, colorName, colorNameHover } =
    config;
  let text = title || name;
  if (!text) return;

  const height = fontSize * INIT_SCALE;

  ctx.save();
  ctx.beginPath();
  ctx.letterSpacing = `${LETTER_SPACING}px`;
  ctx.font = `400 ${fontSize * INIT_SCALE}px Inter, sans-serif`;
  let textWidth = ctx.measureText(text).width;
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
  textWidth = ctx.measureText(text).width;
  const yText = y - 5.5 * INIT_SCALE;
  const componentText = {
    width: textWidth,
    height: height + 5.5 * INIT_SCALE,
    x,
    y: yText - height,
  };
  const {
    setHoverTitle,
    removeHoverTitle,
    mouseDrag,
    selections,
    hoverTitle,
    mouseResize,
  } = getControl();

  const selectionsID = Object.keys(selections || {});
  const selectionId = selectionsID[selectionsID.length - 1];
  const isHover = isHovered2(zoom.mouse, componentText);
  const isSelected = selectionId === id;

  let color = colorName;
  if ((!mouseDrag && !mouseResize) || isSelected) {
    if (isHover) {
      color = colorNameHover;
    } else if (isSelect) {
      color = colorNameFocus;
    }
  }
  ctx.fillStyle = color;
  /*-------- Check hover ---------*/

  if (!isHover) {
    removeHoverTitle(component.id);
  } else if (!mouseDrag && !hoverTitle?.[selectionId]) {
    setHoverTitle(component.id, []);
  }

  /*-------- Check hover ---------*/

  ctx.textAlign = "left";
  ctx.fillText(text, x, yText);
  ctx.closePath();
  ctx.restore();
};
