import { createContext, useContext } from "react";
import {
  FONT_SIZE,
  SIZE_LINE_FRAME,
  LINE_WIDTH,
  MAX_ZOOM,
  MIN_ZOOM,
  COLOR_BORDER_HOVER_GROUP,
  COLOR_BORDER_HOVER_ELEMENT,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR_MENU,
  FRAME_PIXEL_COLOR,
  SCALE_VISIBLE_FRAME,
  DESIGN_MODE,
  INIT_SCALE,
  SIZE_GRID_SQUARE,
} from "../conts";

export type CanvasContextValue = {
  lineWidth: number;
  fontSize: number;
  minZoom: number;
  maxZoom: number;
  sizeLineFrame: number;
  colorBorderHoverElement: string;
  colorBorderHoverGroup: string;
  backgroundColor: string;
  backgroundColorMenu: string;
  framePixelColor: string;
  scaleVisibleFrame: number;
  designMode: boolean;
  initScale: number;
  sizeGridSquare: number;
};

export const defaultValueContext: CanvasContextValue = {
  lineWidth: LINE_WIDTH,
  fontSize: FONT_SIZE,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  sizeLineFrame: SIZE_LINE_FRAME,
  colorBorderHoverGroup: COLOR_BORDER_HOVER_GROUP,
  colorBorderHoverElement: COLOR_BORDER_HOVER_ELEMENT,
  backgroundColor: BACKGROUND_COLOR,
  backgroundColorMenu: BACKGROUND_COLOR_MENU,
  framePixelColor: FRAME_PIXEL_COLOR,
  scaleVisibleFrame: SCALE_VISIBLE_FRAME,
  designMode: DESIGN_MODE,
  initScale: INIT_SCALE,
  sizeGridSquare: SIZE_GRID_SQUARE,
};

export const CanvasContext =
  createContext<CanvasContextValue>(defaultValueContext);

export const useCanvasContext = () => useContext(CanvasContext);
