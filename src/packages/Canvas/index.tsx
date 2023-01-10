import { Component } from "react";
import {
  ComponentApp,
  ComponentProps,
  KEYBOARD_CODE,
  MouseType,
  WindowSize,
  Zoom,
} from "../types";
import { page } from "../components/page";
import {
  getConfig,
  getSize,
  isHoved,
  zoomedX_INV,
  zoomedY_INV,
} from "../utlis";
import { framePixel } from "../components/framePixel";
import { BACKGROUND_COLOR, DESIGN_MODE, MAX_ZOOM, MIN_ZOOM } from "../conts";
import EventListener from "../lib/EventListener";
import ElementListener from "../lib/ElementListener";
import DisabledBrowser from "../lib/DisabledBrowser";
import { withCanvasProvider } from "../context/withCanvasProvider";
import { CanvasContextValue } from "../context/canvas";

import "./index.css";

type CanvasProps<T> = {
  windowSize: WindowSize;
  components: T & ComponentProps[];
  maxZoom?: number;
  minZoom?: number;
  defaultScale?: number;
  backgroundColor?: string;
} & CanvasContextValue;

class Canvas<T> extends Component<CanvasProps<T>> {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private zoom: Zoom;
  private app: {
    moved: boolean;
    transformed: boolean;
    downing: boolean;
    pressSpace: boolean;
  };

  constructor(props: CanvasProps<T> & CanvasContextValue) {
    super(props);
    this.ctx = null;
    this.canvas = null;
    const { windowSize, defaultScale = 1 } = props;
    const { width, height } = getSize(windowSize);
    const origin = { x: width / 4, y: height / 4 };
    this.zoom = {
      scale: defaultScale,
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
    this.ctx = this.canvas.getContext("2d");
    const { windowSize } = this.props;
    this.setSizeCanvas(windowSize);
    this.draw();
  }

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
      const size = getSize({ width: e.deltaX, height: e.deltaY });
      this.zoom.worldOrigin.y += size.height / 5 / this.zoom.scale;
      this.zoom.worldOrigin.x += size.width / 5 / this.zoom.scale;
    }
    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    this.draw();
  };

  private draw = (props = this.props) => {
    if (!this.ctx || !this.canvas) return;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.imageSmoothingEnabled = true;

    this.ctx.save();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.rect(0, 0, width, height);
    this.ctx.fill();
    this.ctx.restore();

    const { components, windowSize } = props;
    const { moved } = this.app;
    const config = getConfig(this.props);
    components.forEach((component) => {
      if (!this.ctx) return;
      const newComponent: ComponentApp = {
        ...component,
        zoom: this.zoom,
        windowSize: { width, height },
        cursor: {
          inScreen: () => moved && isHoved(this.zoom.mouse, newComponent),
        },
        config,
      } as unknown as ComponentApp;
      page(this.ctx, newComponent);
    });
    framePixel(this.ctx, { windowSize, zoom: this.zoom, config });
  };

  private setSizeCanvas = (windowSize: WindowSize) => {
    if (!this.canvas) return;
    const size = getSize(windowSize);
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    this.canvas.style.width = `${windowSize.width}px`;
    this.canvas.style.height = `${windowSize.height}px`;
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE && !this.app.pressSpace) {
      this.app.pressSpace = true;
      this.canvasGrab();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE) {
      this.app.pressSpace = false;
      this.canvasCursor();
    }
  };

  private onMouseDown = (event: MouseEvent) => {
    this.onMouseEvent(event);
    if (DESIGN_MODE && this.app.pressSpace) {
      this.canvasGrabbing();
    }
  };

  private onMouseUp = (event: MouseEvent) => {
    this.onMouseEvent(event);
    if (this.app.pressSpace) {
      this.canvasGrab();
    } else this.canvasCursor();
  };

  private canvasGrab = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--grab";
  };

  private canvasGrabbing = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--grabbing";
  };

  private canvasCursor = () => {
    if (this.canvas) this.canvas.className = "canvas";
  };

  render() {
    const { windowSize: size, backgroundColor = BACKGROUND_COLOR } = this.props;
    const style = { backgroundColor, ...size };
    return (
      <>
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
          onMouseMove={this.onMouseEvent}
          onMouseOut={this.onMouseEvent}
        />
        <EventListener
          options={{ passive: false }}
          onMouseUp={this.onMouseUp}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
        <DisabledBrowser />
      </>
    );
  }
}

export default withCanvasProvider(Canvas);
