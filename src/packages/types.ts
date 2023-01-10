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

export type TypeSelection = { paths: string[]; id: string };

export type ComponentBase = {
  x: number;
  y: number;
  top?: number;
  left?: number;
  width: number;
  height: number;
  name: string;
  title?: string;
  id: string;
  children: ComponentApp[];
  text?: string;
  type: ComponentAppType;
} & CSSPropertiesProps;

export type ComponentProps = {} & WindowSize & Pointer;

export type ComponentApp = {
  zoom: Zoom;
  cursor: { inScreen: () => boolean };
  children?: ComponentApp[];
  type: ComponentAppType;
} & ComponentProps &
  ComponentBase & { config: CanvasContextValue };

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
