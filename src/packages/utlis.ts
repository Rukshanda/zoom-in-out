import { CanvasContextValue } from "./context/canvas";
import { INIT_SCALE, base64Point } from "./conts";
import {
  // Bounds,
  ComponentApp,
  CursorType,
  KEYBOARD_CODE,
  // Point,
  // TypeSelection,
  WindowSize,
  Zoom,
} from "./types";

export const isHoved = (
  contain: { x: number; y: number },
  screen: ComponentApp
) => {
  const { x: x1, y: y1, width: w1, height: h1 } = screen;
  const { x: x2, y: y2 } = contain;
  return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1;
};

//Scale width và height với Zoom. Width height của element draw trong canvas
export const zoomed = (number: number, zoom: Zoom) => {
  const { scale } = zoom;
  return number * scale;
};

// converts from world coord to screen pixel coord
// biến đổi vị trí x ban đầu thành vị trí mới sau khi zoom
export const zoomedX = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  // scale & origin X
  return (number - worldOrigin.x) * scale + screenOrigin.x;
};

// converts from world coord to screen pixel coord
// biến đổi vị trí y ban đầu thành vị trí mới sau khi zoom
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
// tính toán lại vị trí chuột x so với thực tế sau khi bị translate và zoom xg
export const zoomedX_INV = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number - screenOrigin.x) / scale + worldOrigin.x;
};

// tính toán lại vị trí chuột y so với thực tế sau khi bị translate và zoom xg
export const zoomedY_INV = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number - screenOrigin.y) / scale + worldOrigin.y;
};

// converts from world coord to screen pixel coord
// tính toán lại component
export const makeScreen = (screen: ComponentApp) => {
  const { zoom } = screen;
  return {
    ...screen,
    x: zoomedX(screen.x, zoom),
    y: zoomedY(screen.y, zoom),
    width: zoomed(screen.width, zoom),
    height: zoomed(screen.height, zoom),
  };
};

const onKeydown = (event: KeyboardEvent) => {
  const key = event.key as KEYBOARD_CODE;
  if ([KEYBOARD_CODE.F12, KEYBOARD_CODE.F7].includes(key)) {
    event.preventDefault();
  }
};

export const DisableEventBrowser = () => {
  // eslint-disable-next-line no-new-func
  (document as any).oncontextmenu = new Function("return false");
  document.addEventListener("keydown", onKeydown);
};

export const EnableEventBrowser = () => {
  // eslint-disable-next-line no-new-func
  (document as any).oncontextmenu = undefined;
  document.removeEventListener("keydown", onKeydown);
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

// export const isContainsBox = (
//   boundsIn: Bounds,
//   boundsOut: Bounds & { xStart: number; yStart: number }
// ) => {
//   return (
//     (boundsOut.xStart <= boundsIn.x + boundsIn.width &&
//       boundsOut.yStart <= boundsIn.y + boundsIn.height &&
//       boundsOut.y >= boundsIn.y &&
//       boundsOut.x >= boundsIn.x) ||
//     (boundsOut.xStart <= boundsIn.x + boundsIn.width &&
//       boundsOut.yStart >= boundsIn.y &&
//       boundsOut.y <= boundsIn.y + boundsIn.height &&
//       boundsOut.x >= boundsIn.x) ||
//     (boundsOut.xStart >= boundsIn.x &&
//       boundsOut.yStart >= boundsIn.y &&
//       boundsOut.y <= boundsIn.y + boundsIn.height &&
//       boundsOut.x <= boundsIn.x + boundsIn.width) ||
//     (boundsOut.xStart >= boundsIn.x &&
//       boundsOut.yStart <= boundsIn.y &&
//       boundsOut.y >= boundsIn.y &&
//       boundsOut.x <= boundsIn.x + boundsIn.width)
//   );
// };

// export const isFocus = (
//   point: Point,
//   screen: { x: number; y: number; width: number; height: number },
//   margin = 0
// ) => {
//   const { x, y, width, height } = screen;
//   const [xPoint, yPoint] = point;
//   return (
//     xPoint >= x - margin &&
//     xPoint <= x + width + margin &&
//     yPoint >= y - margin &&
//     yPoint <= y + height + margin
//   );
// };

// export const checkFocusLoop = (
//   component: ComponentApp,
//   mouseX: number,
//   mouseY: number
// ): boolean => {
//   if (isFocus([mouseX, mouseY], component, 5)) {
//     return true;
//   }
//   const { children = [], x, y } = component;
//   if (!children.length) return false;
//   const bool = children.some((item) => {
//     const iFocus = isFocus([mouseX - x, mouseY - y], item, 5);
//     if (iFocus) return true;
//     return item.children?.some((itemChild) => {
//       return checkFocusLoop(
//         itemChild,
//         mouseX - x - item.x,
//         mouseY - y - item.y
//       );
//     });
//   });
//   return bool;
// };

// export const getChildFocus = (
//   child: TypeSelection,
//   mouseX: number,
//   mouseY: number,
//   refChild: {
//     child: TypeSelection | undefined;
//     parents: (string | number)[];
//   }
// ) => {
//   const screen = child.children?.find((sc) => {
//     return checkFocusLoop(sc, mouseX - child.x, mouseY - child.y);
//   });
//   if (!screen) return;
//   const newScreen = { ...screen, parents: [] };
//   refChild.child = newScreen;
//   const { children } = screen;
//   if (!children?.length) return;
//   const checkFocusElement = children.some((sc) =>
//     checkFocusLoop(sc, mouseX - child.x - screen.x, mouseY - child.y - screen.y)
//   );
//   if (!checkFocusElement) return;
//   refChild.parents.push(screen.id); // first parent is screen id
//   getChildFocus(newScreen, mouseX - child.x, mouseY - child.y, refChild);
// };

// const onMouseDown = (event: MouseEvent) => {
// if (!refElement.current?.contains(event.target as Node)) return; //todo
// const mouseX = (event.pageX - zoom.offset[0]) / zoom.scale;
// const mouseY = (event.pageY - zoom.offset[1]) / zoom.scale;
// const refChild: {
//   child: SelectionChild | undefined;
//   parents: (string | number)[];
// } = {
//   child: undefined,
//   parents: [],
// };
// const screen = screens.find((sc) => checkFocusLoop(sc, mouseX, mouseY));
// if (screen) {
//   getChildFocus(screen, mouseX, mouseY, refChild);
// }
// };

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
    initScale,
    backgroundColorMenu,
    sizeGridSquare,
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
    initScale,
    backgroundColorMenu,
    sizeGridSquare,
  };
};
