import {name} from "./name";
import {ComponentApp} from "../types";
import {canvasRef, checkModeResize, makeScreen} from "../Canvas/utlis";
import {frameSquareBorder} from "./frameSquareBorder";

export const pageName = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp
) => {
  const sBuild = makeScreen(screen);
  const {x, y, width, height, getControl, id, zoom, windowSize} = sBuild;

  if (
    x + width < 0 ||
    y + height < 0 ||
    x > windowSize.width ||
    y > windowSize.height
  ) {
    return;
  }

  const control = getControl();
  const {selections, hoverTitle, modeResize, mouseDrag} = control;
  const isHover = hoverTitle?.[id];
  const isSelect = !!selections?.[id];

  /*------- Check Mode Resize -------*/
  const {cursor: controlCursor, pressSpace} = canvasRef.get();
  if (isSelect && !pressSpace && !control.mouseResize && !mouseDrag) {
    const mode = checkModeResize(zoom, {x, y, width, height});
    if (mode) {
      controlCursor[mode]?.();
      control.setModeResize({[id]: {paths: [], mode: mode}});
    } else if (modeResize?.[id]?.mode) {
      controlCursor.default();
      control.removeModeResize(id);
    }
  }
  /*------- Check Mode Resize -------*/

  /*------- > Frame page > Focus -------*/
  if (isHover || isSelect) {
    frameSquareBorder(ctx, sBuild, isSelect);
  }

  /*------- Name page -------*/
  name(ctx, screen, isSelect);
  /*------- Name page -------*/

  /*------- > Frame page > Focus -------*/
};
