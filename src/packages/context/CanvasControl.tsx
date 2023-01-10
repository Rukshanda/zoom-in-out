import {
  createContext,
  useContext,
  MouseEvent as MouseEventReact,
} from "react";
import { ComponentBase, TypeHover, TypeResize } from "../types";

export type TCanvasControl = {
  hover?: TypeHover;
  hoverTitle?: TypeHover;
  selections: TypeHover;
  mouseResize?: {
    pre: { x: number; y: number };
    lastUsed: { x: number; y: number };
  };
  mouseDrag?: {
    pre: { x: number; y: number };
    lastUsed: { x: number; y: number };
  };
  guideLine?: { x?: number; y?: number };
  setHover: (id: string, paths: { id: string; paths: string[] }[]) => void;
  setHoverTitle: (id: string, paths: { id: string; paths: string[] }[]) => void;
  removeHover: (id: string) => void;
  removeHoverTitle: (id: string) => void;
  setSelections: (
    selections: TypeHover | ((selections: TypeHover) => TypeHover)
  ) => void;
  onMouseDown: (
    event: MouseEventReact | MouseEvent
  ) => boolean | undefined | void;
  onMouseMove: (
    event: MouseEventReact | MouseEvent
  ) => boolean | undefined | void;
  onMouseMoveAuto: (
    value: {pageX: number, pageY: number}
  ) => boolean | undefined | void;
  onMouseUp: (
    event: MouseEventReact | MouseEvent
  ) => boolean | undefined | void;
  modeResize?: TypeResize;
  setModeResize: (resize: TypeResize) => void;
  removeModeResize: (id: string) => void;
  isMouseMove: boolean
};

export type TCanvasControlContext = {
  getControl: () => TCanvasControl;
  components: ComponentBase[];
};

export const defaultCanvasControl: TCanvasControl = {
  modeResize: undefined,
  mouseResize: undefined,
  guideLine: undefined,
  hover: undefined,
  hoverTitle: undefined,
  isMouseMove: false,
  selections: {},
  setHover: () => undefined,
  setHoverTitle: () => undefined,
  removeHover: () => undefined,
  setSelections: () => undefined,
  removeHoverTitle: () => undefined,
  onMouseDown: () => undefined,
  onMouseMove: () => undefined,
  onMouseMoveAuto: () => undefined,
  onMouseUp: () => undefined,
  setModeResize: () => undefined,
  removeModeResize: () => undefined,
};

export const CanvasControlContext = createContext<TCanvasControlContext>({
  getControl: () => defaultCanvasControl,
  components: [],
});

export const CanvasControlProvider = CanvasControlContext.Provider;

export const useCanvasControl = () => useContext(CanvasControlContext);
