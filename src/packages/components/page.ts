import { ComponentApp } from "../types";
import { makeScreen } from "../Canvas/utlis";

export const page = (ctx: CanvasRenderingContext2D, screen: ComponentApp) => {
  const sBuild = makeScreen(screen);
  const { x, y, width, height, windowSize } = sBuild;

  if (
    x + width < 0 ||
    y + height < 0 ||
    x > windowSize.width ||
    y > windowSize.height
  ) {
    return;
  }

  /*------- Frame page -------*/
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = sBuild.backgroundColor || "#ffffff";
  ctx.fillRect(x, y, width, height);
  ctx.clip();
  ctx.closePath();
  ctx.restore();
  /*------- Frame page -------*/

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation

  // ctx.clip(); overflow hidden

  // ctx.globalCompositeOperation='source-over';  Default Displays the source over the destination
  // ctx.globalCompositeOperation='source-atop'; Displays the source on top of the destination. The part of the source image that is outside the destination is not shown
  // ctx.globalCompositeOperation='source-in'; Displays the source in the destination. Only the part of the source that is INSIDE the destination is shown, and the destination is transparent
  // ctx.globalCompositeOperation='source-out'; Displays the source out of the destination. Only the part of the source that is OUTSIDE the destination is shown, and the destination is transparent
  // ctx.globalCompositeOperation='destination-over'; Displays the destination over the source
  // ctx.globalCompositeOperation='destination-atop'; Displays the destination on top of the source. The part of the destination that is outside the source is not shown
  // ctx.globalCompositeOperation='destination-in'; Displays the destination in the source. Only the part of the destination that is INSIDE the source is shown, and the source is transparent
  // ctx.globalCompositeOperation='destination-out'; Displays the destination out of the source. Only the part of the destination that is OUTSIDE the source is shown, and the source is transparent
  // ctx.globalCompositeOperation='lighter'; Displays the source + the destination
  // ctx.globalCompositeOperation='copy'; Displays the source. The destination is ignored
  // ctx.globalCompositeOperation='xor'; The source is combined by using an exclusive OR with the destination
};
