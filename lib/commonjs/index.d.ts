declare module "@react-zoom/react-zoom-in-out" {
  import { Component } from "react";
  type ZoomProps = {
    animationDuration?: number;
    minZoom?: number;
    maxZoom?: number;
    tabScale?: number;
    percentWheel?: number;
    allowSpaceDrag?: boolean;
    allowCtrWheel?: boolean;
    children?: JSX.Element;
  };
  export class Zoom extends Component<ZoomProps> {}
}
