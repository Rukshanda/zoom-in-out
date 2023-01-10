import { ComponentType, forwardRef } from "react";
import { CanvasContextValue, useCanvasContext } from "./canvas";

export function withCanvasProvider<T, Type>(
  Component: ComponentType<T & CanvasContextValue>
) {
  return forwardRef<Type, T>((props: T, ref) => {
    const value = useCanvasContext();
    return <Component ref={ref} {...value} {...props} />;
  });
}
