import {createContext, useContext} from "react";
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
  SIZE_GRID_SQUARE,
  COLOR_NAME,
  COLOR_NAME_FOCUS,
  COLOR_NAME_HOVER,
  WIDTH_RECT_RESIZE,
  COLOR_FILL_RECT_RESIZE,
  COLOR_STROKE_RECT_RESIZE,
  SPACE_SUPPORT_GUIDE_LINE,
  COLOR_GUIDE_LINE,
} from "../conts";

export type CanvasContextValue = {
  lineWidth: number;
  fontSize: number;
  minZoom: number;
  maxZoom: number;
  sizeLineFrame: number;
  colorBorderHoverElement: string;
  colorBorderHoverGroup: string;
  colorBorderFocusElement: string;
  colorBorderFocusGroup: string;
  colorName: string;
  colorNameFocus: string;
  colorGuideLine: string;
  backgroundColor: string;
  backgroundColorMenu: string;
  framePixelColor: string;
  colorNameHover: string;
  scaleVisibleFrame: number;
  designMode: boolean;
  sizeGridSquare: number;
  widthRectResize: number;
  colorFillRectResize: string;
  colorStrokeRectResize: string;
  spaceGuideLine: number;
};

export const defaultValueContext: CanvasContextValue = {
  lineWidth: LINE_WIDTH,
  fontSize: FONT_SIZE,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  sizeLineFrame: SIZE_LINE_FRAME,
  colorName: COLOR_NAME,
  colorNameFocus: COLOR_NAME_FOCUS,
  colorNameHover: COLOR_NAME_HOVER,
  colorGuideLine: COLOR_GUIDE_LINE,
  colorBorderHoverGroup: COLOR_BORDER_HOVER_GROUP,
  colorBorderFocusGroup: COLOR_BORDER_HOVER_GROUP,
  colorBorderHoverElement: COLOR_BORDER_HOVER_ELEMENT,
  colorBorderFocusElement: COLOR_BORDER_HOVER_ELEMENT,
  backgroundColor: BACKGROUND_COLOR,
  backgroundColorMenu: BACKGROUND_COLOR_MENU,
  framePixelColor: FRAME_PIXEL_COLOR,
  scaleVisibleFrame: SCALE_VISIBLE_FRAME,
  designMode: DESIGN_MODE,
  sizeGridSquare: SIZE_GRID_SQUARE,
  widthRectResize: WIDTH_RECT_RESIZE,
  colorFillRectResize: COLOR_FILL_RECT_RESIZE,
  colorStrokeRectResize: COLOR_STROKE_RECT_RESIZE,
  spaceGuideLine: SPACE_SUPPORT_GUIDE_LINE,
};

export const CanvasContext =
  createContext<CanvasContextValue>(defaultValueContext);

export const useCanvasContext = () => useContext(CanvasContext);
