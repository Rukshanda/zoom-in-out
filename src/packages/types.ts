import { TCanvasControl } from "./context/CanvasControl";
import { CanvasContextValue } from "./context/canvas";

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const enum ComponentAppType {
  SCREEN = "Screen",
}

export type WindowSize = {
  width: number;
  height: number;
};

export type CSSPropertiesProps = {
  backgroundColor?: string;
};

export type Pointer = { x: number; y: number };

export type TypeHover = {
  [id: string]: { id: string; paths: string[] }[];
};

export type Size = { x: number; y: number; width: number; height: number };

export type TypeResize = {
  [id: string]: { paths: string[]; mode: ModeResize };
};

export type ComponentBase = {
  name: string;
  title?: string;
  id: string;
  children: ComponentBase[];
  text?: string;
  type: ComponentAppType;
} & CSSPropertiesProps &
  Size;

export type ComponentProps = {} & WindowSize & Pointer;

export type ComponentApp = {
  zoom: Zoom;
  cursor: { inScreen: () => boolean };
  windowSize: WindowSize;
  pressSpace: boolean;
  children?: ComponentApp[];
  type: ComponentAppType;
} & ComponentProps &
  ComponentBase & {
    config: CanvasContextValue;
    getControl: () => TCanvasControl;
  };

export type Zoom = {
  scale: number;
  worldOrigin: Pointer;
  screenOrigin: Pointer;
  mouse: Pointer & {
    rx: number;
    ry: number;
    button: number;
    bounds?: DOMRect;
  };
};

export enum CursorType {
  DEFAULT = "default",
  GRAB = "grab",
  GRABBING = "grabbing",
}

export enum KEYBOARD_CODE {
  F12 = "F12",
  F7 = "F7",
  SPACE = "Space",
}

export enum MouseType {
  DOWN = "mousedown",
  UP = "mouseup",
  OUT = "mouseout",
  MOVE = "mousemove",
}

export type Point = [number, number];

export enum ModeResize {
  LEFT = "left",
  TOP_LEFT = "topLeft",
  BOTTOM_LEFT = "bottomLeft",
  RIGHT = "right",
  TOP_RIGHT = "topRight",
  BOTTOM_RIGHT = "bottomRight",
  TOP = "top",
  BOTTOM = "bottom",
}
