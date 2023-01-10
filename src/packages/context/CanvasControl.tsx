import { createContext } from "react";
import { TypeSelection } from "../types";

export type TCanvasControl = {
  selection: TypeSelection[];
  pageTitleHover?: string;
  setSelection: (selection: TypeSelection[]) => void;
  setPageTitleHover: (id: string) => void;
};

export type TCanvasControlContext = {
  getControl: () => TCanvasControl;
};

export const CanvasControlContext = createContext<TCanvasControlContext>({
  getControl: () => ({
    selection: [],
    pageTitleHover: undefined,
    setSelection: () => undefined,
    setPageTitleHover: () => undefined,
  }),
});

export const CanvasControlProvider = CanvasControlContext.Provider;
