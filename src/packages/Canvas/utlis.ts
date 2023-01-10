import { defaultCanvasControl } from "../context/CanvasControl";
import { CanvasContextValue, defaultValueContext } from "../context/canvas";
import { AUTO_SCROLL, INIT_SCALE, base64Point } from "../conts";
import {
  ComponentApp,
  ComponentBase,
  CursorType,
  ModeResize,
  Size,
  WindowSize,
  Zoom,
} from "../types";

export const isHovered = (
  contain: { x: number; y: number },
  screen: ComponentApp
) => {
  const { x: x1, y: y1, width: w1, height: h1 } = makeScreen(screen);
  const { x: x2, y: y2 } = contain;
  return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1;
};

export const isHovered2 = (
  contain: { x: number; y: number },
  screen: { x: number; height: number; width: number; y: number }
) => {
  const { x: x1, y: y1, width: w1, height: h1 } = screen;
  const { x: x2, y: y2 } = contain;
  return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1;
};

export const zoomed = (number: number, zoom: Zoom) => {
  const { scale } = zoom;
  // just scale
  return number * scale;
};
// converts from world coord to screen pixel coord
export const zoomedX = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  // scale & origin X
  return (number - worldOrigin.x) * scale + screenOrigin.x;
};
// converts from world coord to screen pixel coord
export const zoomedY = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  // scale & origin Y
  return (number - worldOrigin.y) * scale + screenOrigin.y;
};

// Inverse does the reverse of a calculation. Like (3 - 1) * 5 = 10   the inverse is 10 * (1/5) + 1 = 3
// multiply become 1 over ie *5 becomes * 1/5  (or just /5)
// Adds become subtracts and subtract become add.
// and what is first become last and the other way round.

// inverse function converts from screen pixel coord to world coord
export const zoomedX_INV = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number - screenOrigin.x) / scale + worldOrigin.x;
};

export const zoomedY_INV = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number - screenOrigin.y) / scale + worldOrigin.y;
};

export const checkAutoScroll = (event: MouseEvent, size: WindowSize) => {
  let xChange = 0;
  if (event.pageX - AUTO_SCROLL <= 0) xChange = -2;
  if (event.pageX + AUTO_SCROLL >= size.width) xChange = 2;

  let yChange = 0;
  if (event.pageY - AUTO_SCROLL <= 0) yChange = -2;
  if (event.pageY + AUTO_SCROLL >= size.height) yChange = 2;
  return { xScrollAuto: xChange, yScrollAuto: yChange };
};

// converts from world coord to screen pixel coord
export const makeScreen = (screen: ComponentApp): ComponentApp => {
  const { zoom } = screen;
  return {
    ...screen,
    x: zoomedX(screen.x, zoom),
    y: zoomedY(screen.y, zoom),
    width: zoomed(screen.width, zoom),
    height: zoomed(screen.height, zoom),
  };
};

export const getCursor = (type: CursorType) => {
  if (type === CursorType.DEFAULT) {
    return `url("${base64Point}") 4 4, auto !important`;
  }
  return type;
};

export const getSize = (size: WindowSize) => {
  return { width: size.width * INIT_SCALE, height: size.height * INIT_SCALE };
};

export const configRef = {
  get: () => defaultValueContext,
};

export const controlRef = {
  get: () => defaultCanvasControl,
};

export const zoomRef = {
  get: (): Zoom | undefined => undefined,
};

type CanvasRef = {
  ctx: CanvasRenderingContext2D | null;
  pressSpace: boolean;
  windowSize: WindowSize;
  cursor: {
    [key in ModeResize]: () => void;
  } & { default: () => void };
};

export const defaultCanvasRef = {
  ctx: null,
  pressSpace: false,
  windowSize: {
    width: window?.innerWidth || 0,
    height: window?.innerHeight || 0,
  },
  cursor: {
    [ModeResize.TOP_LEFT]: () => undefined,
    [ModeResize.TOP_RIGHT]: () => undefined,
    [ModeResize.TOP]: () => undefined,
    [ModeResize.BOTTOM]: () => undefined,
    [ModeResize.BOTTOM_LEFT]: () => undefined,
    [ModeResize.BOTTOM_RIGHT]: () => undefined,
    [ModeResize.LEFT]: () => undefined,
    [ModeResize.RIGHT]: () => undefined,
    default: () => undefined,
  },
};

export const canvasRef = {
  get: (): CanvasRef => defaultCanvasRef,
};

export const getConfig = (props: CanvasContextValue): CanvasContextValue => {
  const {
    lineWidth,
    fontSize,
    minZoom,
    maxZoom,
    sizeLineFrame,
    colorBorderHoverElement,
    colorBorderHoverGroup,
    backgroundColor,
    framePixelColor,
    scaleVisibleFrame,
    designMode,
    backgroundColorMenu,
    sizeGridSquare,
    colorBorderFocusElement,
    colorBorderFocusGroup,
    colorName,
    colorNameFocus,
    colorNameHover,
    widthRectResize,
    colorFillRectResize,
    colorStrokeRectResize,
    spaceGuideLine,
    colorGuideLine,
  } = props;

  return {
    lineWidth,
    fontSize,
    minZoom,
    maxZoom,
    sizeLineFrame,
    colorBorderHoverElement,
    colorBorderHoverGroup,
    backgroundColor,
    framePixelColor,
    scaleVisibleFrame,
    designMode,
    backgroundColorMenu,
    sizeGridSquare,
    colorBorderFocusElement,
    colorBorderFocusGroup,
    colorName,
    colorNameFocus,
    colorNameHover,
    widthRectResize,
    colorFillRectResize,
    colorStrokeRectResize,
    spaceGuideLine,
    colorGuideLine,
  };
};

export const clsx = (...args: (string | boolean | undefined | null)[]) => {
  let className = "";
  args?.forEach((arg) => {
    if (arg && typeof arg === "string") className += ` ${arg}`;
  });
  return className.trim();
};

export const checkModeResize = (
  zoom: Zoom,
  size: { x: number; y: number; width: number; height: number }
): ModeResize | undefined => {
  const { x, y, width: w, height: h } = size;

  const sc = { x, y, width: w, height: h } as ComponentApp;
  const { mouse } = zoom;

  let isHover: ModeResize | undefined;
  const hoverTop = isHovered2(mouse, { ...sc, y: y - 4, height: 8 });
  if (hoverTop) {
    isHover = ModeResize.TOP;
  } else if (!isHover && isHovered2(mouse, { ...sc, x: x - 4, width: 8 })) {
    isHover = ModeResize.LEFT;
  } else if (!isHover && isHovered2(mouse, { ...sc, x: x + w - 4, width: 8 })) {
    isHover = ModeResize.RIGHT;
  } else if (
    !isHover &&
    isHovered2(mouse, { ...sc, y: y + h - 4, height: 8 })
  ) {
    isHover = ModeResize.BOTTOM;
  }
  return isHover;
};

export const rePositionMode = (
  size: Size,
  change: { x: number; y: number },
  mode?: ModeResize
) => {
  let newSize = size;
  switch (mode) {
    case ModeResize.TOP_LEFT:
      newSize.x -= change.x;
      newSize.width += change.x;
      newSize.y -= change.y;
      newSize.height += change.y;
      break;
    case ModeResize.TOP_RIGHT:
      newSize.width -= change.x;
      newSize.y -= change.y;
      newSize.height += change.y;
      break;
    case ModeResize.LEFT:
      newSize.x -= change.x;
      newSize.width += change.x;
      break;
    case ModeResize.RIGHT:
      newSize.width -= change.x;
      break;
    case ModeResize.TOP:
      newSize.y -= change.y;
      newSize.height += change.y;
      break;
    case ModeResize.BOTTOM:
      newSize.height -= change.y;
      break;
    case ModeResize.BOTTOM_LEFT:
      newSize.x -= change.x;
      newSize.width += change.x;
      newSize.height -= change.y;
      break;
    case ModeResize.BOTTOM_RIGHT:
      newSize.width -= change.x;
      newSize.height -= change.y;
      break;
    default:
      newSize.x -= change.x;
      newSize.y -= change.y;
  }
  return newSize;
};

export const getGuideLinePage = (
  screens: ComponentBase[],
  screen: ComponentBase,
  windowSize: WindowSize,
  mode?: ModeResize
) => {
  let guideLineX: number | undefined;
  let guideLineY: number | undefined;

  const { spaceGuideLine } = configRef.get();
  const zoom = zoomRef.get();
  const space = spaceGuideLine / (zoom?.scale || 1);
  const { x, y, width, height } = screen;

  for (let i = 0; i < screens.length; i++) {
    const sc = screens[i];
    if (sc.id === screen.id) continue;
    if (!mode) {
      if (x > sc.x - space && x < sc.x + space) {
        screen.x = sc.x;
        guideLineX = screen.x;
      }
      if (y > sc.y - space && y < sc.y + space) {
        screen.y = sc.y;
        guideLineY = screen.y;
      }
      if (!guideLineX && x + width > sc.x - space && x + width < sc.x + space) {
        screen.x = sc.x - width;
        guideLineX = sc.x;
      }
      if (
        !guideLineX &&
        x > sc.x + sc.width - space &&
        x < sc.x + sc.width + space
      ) {
        screen.x = sc.x + sc.width;
        guideLineX = sc.x + sc.width;
      }
      if (
        !guideLineY &&
        y > sc.y + sc.height - space &&
        y < sc.y + sc.height + space
      ) {
        screen.y = sc.y + sc.height;
        guideLineY = sc.y + sc.height;
      }
      if (
        !guideLineY &&
        y + height > sc.y - space &&
        y + height < sc.y + space
      ) {
        screen.y = sc.y - height;
        guideLineY = sc.y;
      }
    }
    if (guideLineX && guideLineY) break;
  }
  return { screen, line: { x: guideLineX, y: guideLineY } };
};

const timeout: {
  [key: string]: {
    timeout?: NodeJS.Timeout;
    count: number;
  };
} = {};

export const isDoubleClick = (key: string) => {
  if (timeout[key]) {
    clearTimeout(timeout[key].timeout);
    timeout[key].count++;
  }
  if (!timeout[key]) timeout[key] = { count: 1 };
  timeout[key].timeout = setTimeout(() => {
    delete timeout[key];
  }, 300);
  return timeout[key].count;
};
