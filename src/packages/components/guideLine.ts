import { configRef, getSize, zoomRef, zoomedX, zoomedY } from "../Canvas/utlis";
import { COLOR_GUIDE_LINE, INIT_SCALE } from "../conts";
import { WindowSize } from "../types";

export const guideLine = (
  ctx: CanvasRenderingContext2D,
  windowSize: WindowSize,
  guideLine?: { x?: number; y?: number }
) => {
  const zoom = zoomRef.get();
  const config = configRef.get();

  if (!guideLine || !zoom) return;
  const { x, y } = guideLine;
  if (x !== undefined || y !== undefined) {
    const { width, height } = getSize(windowSize);

    ctx.save();
    ctx.strokeStyle = config.colorGuideLine || COLOR_GUIDE_LINE;
    ctx.lineWidth = 1 * INIT_SCALE;
    ctx.beginPath();
    if (x !== undefined) {
      const newX = zoomedX(x, zoom);
      ctx.moveTo(newX, 0);
      ctx.lineTo(newX, height);
    }
    if (y !== undefined) {
      const newY = zoomedY(y, zoom);
      ctx.moveTo(0, newY);
      ctx.lineTo(width, newY);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
};
