import { controlRef } from "../Canvas/utlis";
import { INIT_SCALE } from "../conts";
import { ComponentApp, ModeResize } from "../types";
import { frameBoxResize } from "./frameBoxResize";

export const frameSquareBorder = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp,
  allowResize?: boolean
) => {
  const { x, y, width, height, config, id, pressSpace } = screen;
  const {
    lineWidth,
    colorBorderHoverGroup,
    widthRectResize: wBSize,
    colorFillRectResize,
    colorStrokeRectResize,
    sizeGridSquare,
  } = config;

  const control = controlRef.get();
  const div = allowResize ? 1.3 : 1;

  const sub = allowResize ? 0 : lineWidth / 2;

  const xRect = x - sub;
  const yRect = y - sub;
  const wRect = width + sub * 2;
  const hRect = height + sub * 2;

  /*------- BORDER RECT PAGE FOCUS HOVER -------*/
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = (sizeGridSquare * INIT_SCALE) / div;
  ctx.strokeStyle = colorBorderHoverGroup;
  ctx.strokeRect(xRect, yRect, wRect, hRect);
  ctx.closePath();
  ctx.restore();
  /*------- BORDER RECT PAGE FOCUS HOVER -------*/

  /*------- BORDER RECT RESIZE -------*/
  if (
    allowResize &&
    !(control.mouseDrag && control.isMouseMove) &&
    !pressSpace
  ) {
    ctx.save();
    ctx.fillStyle = colorFillRectResize;
    ctx.strokeStyle = colorStrokeRectResize;
    ctx.lineWidth = (lineWidth * INIT_SCALE) / 3;

    const wBox = wBSize / 2;
    const wRectSub = width - wBox;
    const hRectSub = height - wBox;

    /*------- TOP LEFT -------*/
    const scTL = { x: x - wBox, y: y - wBox, size: wBSize, id, paths: [] };
    frameBoxResize(ctx, scTL, ModeResize.TOP_LEFT);
    /*------- TOP LEFT -------*/

    /*------- TOP RIGHT -------*/
    const scTR = { x: x + wRectSub, y: y - wBox, size: wBSize, id, paths: [] };
    frameBoxResize(ctx, scTR, ModeResize.TOP_RIGHT);
    /*------- TOP RIGHT -------*/

    /*------- BOTTOM RIGHT -------*/
    const scBR = {
      x: x + wRectSub,
      y: y + hRectSub,
      size: wBSize,
      id,
      paths: [],
    };
    frameBoxResize(ctx, scBR, ModeResize.BOTTOM_RIGHT);
    /*------- BOTTOM RIGHT -------*/

    /*------- BOTTOM LEFT -------*/
    const scBL = { x: x - wBox, y: y + hRectSub, size: wBSize, id, paths: [] };
    frameBoxResize(ctx, scBL, ModeResize.BOTTOM_LEFT);
    ctx.restore();
  }
  /*------- BORDER RECT RESIZE -------*/
};
