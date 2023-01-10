import {canvasRef, controlRef, isHovered2, zoomRef} from "../Canvas/utlis";
import {ComponentApp, ModeResize} from "../types";

export const frameBoxResize = (
  ctx: CanvasRenderingContext2D,
  screen: {x: number; y: number; size: number; id: string; paths: string[]},
  mode: ModeResize
) => {
  const zoom = zoomRef.get();
  const control = controlRef.get();
  const {cursor, pressSpace} = canvasRef.get();

  const {x, y, size, id, paths} = screen;
  const width = size;
  const height = size;

  const sc = {x, y, width, height} as ComponentApp;
  const isHovered = zoom && isHovered2(zoom.mouse, sc);

  if (!pressSpace && !control.mouseResize) {
    if (isHovered) {
      control.setModeResize({[id]: {paths, mode}});
      cursor[mode]?.();
    } else if (control.modeResize?.[id]?.mode === mode) {
      cursor.default?.();
      control.removeModeResize(id);
    }
  }

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};
