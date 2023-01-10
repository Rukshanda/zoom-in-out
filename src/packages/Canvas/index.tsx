import { Component, Fragment } from "react";
import {
  ComponentApp,
  ComponentBase,
  KEYBOARD_CODE,
  ModeResize,
  MouseType,
  WindowSize,
  Zoom,
} from "../types";
import { page } from "../components/page";
import {
  getConfig,
  configRef,
  getSize,
  isHovered,
  zoomedX_INV,
  zoomedY_INV,
  controlRef,
  zoomRef,
  canvasRef,
  defaultCanvasRef,
} from "./utlis";
import { framePixel } from "../components/framePixel";
import {
  BACKGROUND_COLOR,
  DESIGN_MODE,
  INIT_SCALE,
  MAX_ZOOM,
  MIN_ZOOM,
} from "../conts";
import EventListener from "../lib/EventListener";
import ElementListener from "../lib/ElementListener";
import DisabledBrowser from "../lib/DisabledBrowser";
import { withCanvasProvider } from "../context/withCanvasProvider";
import { CanvasContextValue, defaultValueContext } from "../context/canvas";
import {
  TCanvasControlContext,
  defaultCanvasControl,
} from "../context/CanvasControl";

import "./index.css";
import { pageName } from "../components/pageName";
import { guideLine } from "../components/guideLine";

type CanvasProps<T> = {
  windowSize: WindowSize;
  components?: T & ComponentBase[];
  maxZoom?: number;
  minZoom?: number;
  defaultScale?: number;
  backgroundColor?: string;
} & CanvasContextValue &
  TCanvasControlContext;

class Canvas<T> extends Component<CanvasProps<T>> {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private zoom: Zoom;
  private app: {
    moved: boolean;
    transformed: boolean;
    downing: boolean;
    pressSpace: boolean;
    mouseDown: boolean;
  };

  constructor(props: CanvasProps<T> & CanvasContextValue) {
    super(props);
    this.ctx = null;
    this.canvas = null;
    const { windowSize, defaultScale } = props;
    const { width, height } = getSize(windowSize);
    const origin = { x: width / 4, y: height / 4 };
    this.zoom = {
      scale: (defaultScale || INIT_SCALE ) / INIT_SCALE,
      worldOrigin: { x: 0, y: 0 },
      screenOrigin: { ...origin },
      mouse: { ...origin, rx: 0, ry: 0, button: 0, bounds: undefined },
    };
    this.zoom.mouse.rx = zoomedX_INV(origin.x, this.zoom);
    this.zoom.mouse.ry = zoomedY_INV(origin.y, this.zoom);
    this.app = {
      moved: false,
      transformed: false,
      downing: false,
      pressSpace: false,
      mouseDown: false,
    };
  }

  shouldComponentUpdate(nProps: CanvasProps<T>): boolean {
    const { components, windowSize } = this.props;
    if (components !== nProps.components || windowSize !== nProps.windowSize) {
      this.setSizeCanvas(nProps.windowSize);
      this.draw();
    }
    return false;
  }

  componentDidMount(): void {
    if (!this.canvas) return;
    this.setConfig();
    this.ctx = this.canvas.getContext("2d");
    const { windowSize } = this.props;
    this.setSizeCanvas(windowSize);
    this.draw();
  }

  componentWillUnmount(): void {
    this.removeConfig();
  }

  private setSizeCanvas = (windowSize: WindowSize) => {
    if (!this.canvas) return;
    const size = getSize(windowSize);
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    this.canvas.style.width = `${windowSize.width}px`;
    this.canvas.style.height = `${windowSize.height}px`;
  };

  /* ------ PUBLIC CONFIG GOLBAL APP ------ */
  private setConfig = () => {
    const { getControl } = this.props;
    configRef.get = () => getConfig(this.props);
    controlRef.get = getControl;
    zoomRef.get = () => this.zoom;
    canvasRef.get = () => ({
      ctx: this.ctx,
      pressSpace: this.app.pressSpace,
      windowSize: this.props.windowSize,
      cursor: {
        default: this.canvasCursor,
        [ModeResize.TOP_LEFT]: this.canvasResizeTopLeft,
        [ModeResize.TOP_RIGHT]: this.canvasResizeBottomRight,
        [ModeResize.TOP]: this.canvasResizeTop,
        [ModeResize.BOTTOM]: this.canvasResizeTop,
        [ModeResize.BOTTOM_LEFT]: this.canvasResizeBottomRight,
        [ModeResize.BOTTOM_RIGHT]: this.canvasResizeTopLeft,
        [ModeResize.LEFT]: this.canvasResizeLeft,
        [ModeResize.RIGHT]: this.canvasResizeLeft,
      },
    });
  };

  private removeConfig = () => {
    configRef.get = () => defaultValueContext;
    controlRef.get = () => defaultCanvasControl;
    zoomRef.get = () => undefined;
    canvasRef.get = () => defaultCanvasRef;
  };
  /* ------ PUBLIC CONFIG GOLBAL APP ------ */

  /* ------ DRAW CANVAS ------ */
  private draw = (props = this.props) => {
    if (!this.ctx || !this.canvas) return;
    this.setMouseCursor();
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.imageSmoothingEnabled = true;

    this.ctx.save();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.rect(0, 0, width, height);
    this.ctx.fill();
    this.ctx.restore();

    const { components = [], windowSize, getControl } = props;
    const { moved } = this.app;
    const config = getConfig(this.props);
    let comBuild = [];
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      if (!this.ctx) break;
      const newComponent = {
        ...component,
        zoom: this.zoom,
        windowSize: { width, height },
        pressSpace: this.app.pressSpace,
        cursor: {
          inScreen: () => moved && isHovered(this.zoom.mouse, newComponent),
        },
        getControl,
        config,
      } as unknown as ComponentApp;
      comBuild.push(newComponent);
      page(this.ctx, newComponent);
    }

    /* --------- Draw Name and Frame focus, hover --------- */
    for (let i = 0; i < comBuild.length; i++) {
      const component = comBuild[i];
      if (!this.ctx) break;
      pageName(this.ctx, component);
    }
    /* --------- Draw Name and Frame focus, hover --------- */

    /* --------- Draw Guide Line --------- */
    const control = getControl()
    if(control.mouseDrag) {
      guideLine(this.ctx, windowSize, control.guideLine)
    }
    /* --------- Draw Guide Line --------- */

    framePixel(this.ctx, { windowSize, zoom: this.zoom, config });
  };
  /* ------ DRAW CANVAS ------ */

  /* ------ GANERAL MOUSE HANDLE ------ */
  private onMouseEvent = (event: MouseEvent, isWheel?: boolean) => {
    if (!this.canvas) return;
    const { mouse } = this.zoom;
    const { moved, transformed, downing } = this.app;
    const type = event.type as MouseType;
    if (event.type === MouseType.DOWN) {
      mouse.button = Number(moved);
      this.app.downing = true;
    } else if ([MouseType.UP, MouseType.OUT].includes(type)) {
      mouse.button = 0;
      this.app.downing = false;
    }
    if (event.type === MouseType.MOVE || isWheel) {
      if (!transformed && !mouse.button && moved && downing) {
        mouse.button = 1;
        this.app.transformed = true;
      }
      this.app.moved = true;
    }
    const size = getSize({ width: event.clientX, height: event.clientY });
    mouse.bounds = this.canvas.getBoundingClientRect();
    mouse.x = size.width - mouse.bounds.left;
    mouse.y = size.height - mouse.bounds.top;
    const xx = mouse.rx;
    const yy = mouse.ry;

    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    if (mouse.button === 1) {
      if (DESIGN_MODE && !this.app.pressSpace) return;
      this.zoom.worldOrigin.x -= mouse.rx - xx;
      this.zoom.worldOrigin.y -= mouse.ry - yy;
      mouse.rx = zoomedX_INV(mouse.x, this.zoom);
      mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    }
    this.draw();
    if (isWheel && this.app.moved) {
      this.onWheel(event as WheelEvent);
    }
  };
  /* ------ GANERAL MOUSE HANDLE ------ */

  /* ------ WHEEL EVENT HANDLE ------ */
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const { minZoom = MIN_ZOOM, maxZoom = MAX_ZOOM } = this.props;
    const { mouse } = this.zoom;
    if (e.ctrlKey || e.metaKey) {
      if (!this.app.moved) {
        return this.onMouseEvent(e, true);
      }
      let scale = Math.min(maxZoom, this.zoom.scale * 1.1);
      if (e.deltaY >= 0) {
        scale = Math.max(minZoom, this.zoom.scale * (1 / 1.1));
      }
      this.zoom.scale = scale;
      this.zoom.worldOrigin.x = mouse.rx;
      this.zoom.worldOrigin.y = mouse.ry;
      this.zoom.screenOrigin.x = mouse.x;
      this.zoom.screenOrigin.y = mouse.y;
    } else {
      const size = getSize({
        width: e.deltaX * INIT_SCALE,
        height: e.deltaY * INIT_SCALE,
      });
      this.zoom.worldOrigin.y += size.height / 5 / this.zoom.scale;
      this.zoom.worldOrigin.x += size.width / 5 / this.zoom.scale;
    }
    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    this.draw();
  };
  /* ------ WHEEL EVENT HANDLE ------ */

  private setMouseCursor = () => {
    const { getControl } = this.props;
    const { modeResize } = getControl();
    if (modeResize && !this.app.pressSpace) return;
    if (this.app.pressSpace) {
      if (this.app.mouseDown) {
        this.canvasGrabbing();
      } else this.canvasGrab();
    } else this.canvasCursor();
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE && !this.app.pressSpace) {
      this.app.pressSpace = true;
      this.draw();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE) {
      this.app.pressSpace = false;
      this.draw();
    }
  };

  /* ------ MOUSE EVENT ------ */
  private onMouseDown = (event: MouseEvent) => {
    this.onMouseEvent(event);
    const { getControl } = this.props;
    this.app.mouseDown = true;
    const control = getControl();
    if (!DESIGN_MODE || !this.app.pressSpace) {
      control.onMouseDown(event);
    }
    this.draw();
  };

  private onMouseMove = (event: MouseEvent) => {
    this.onMouseEvent(event);
    const { getControl } = this.props;
    const control = getControl();
    control.onMouseMove(event);
    this.draw();
  };

  private onMouseUp = (event: MouseEvent) => {
    this.onMouseEvent(event);
    const { getControl } = this.props;
    const control = getControl();
    this.app.mouseDown = false;
    control.onMouseUp(event);
    this.draw();
  };
  /* ------ MOUSE EVENT ------ */

  /* ------ CONFIG CURSOR TYPE ------ */
  private canvasGrab = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--grab";
  };

  private canvasGrabbing = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--grabbing";
  };

  private canvasCursor = () => {
    if (this.canvas) this.canvas.className = "canvas";
  };

  private canvasResizeTopLeft = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--resize-top-left";
  };

  private canvasResizeBottomRight = () => {
    if (this.canvas)
      this.canvas.className = "canvas canvas--resize-bottom-right";
  };

  private canvasResizeLeft = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--resize-left";
  };

  private canvasResizeTop = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--resize-top";
  };
  /* ------ CONFIG CURSOR TYPE ------ */

  render() {
    const { windowSize: size, backgroundColor = BACKGROUND_COLOR } = this.props;
    const style = { backgroundColor, ...size };
    return (
      <Fragment>
        <canvas
          {...size}
          ref={(ref) => (this.canvas = ref)}
          style={style}
          className="canvas"
        />
        <ElementListener
          options={{ passive: false }}
          getDom={() => this.canvas}
          onWheel={this.onWheel}
          onMouseDown={this.onMouseDown}
        />
        <EventListener
          options={{ passive: false }}
          onMouseUp={this.onMouseUp}
          onKeyDown={this.onKeyDown}
          onMouseMove={this.onMouseMove}
          onKeyUp={this.onKeyUp}
        />
        <DisabledBrowser />
      </Fragment>
    );
  }
}

export default withCanvasProvider(Canvas);
