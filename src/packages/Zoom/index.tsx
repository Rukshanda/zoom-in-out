import {
  Component,
  MouseEvent,
  TouchEvent as TouchEventReact,
  WheelEvent as WheelEventReact,
} from "react";

declare type ZoomProps = {
  children?: (JSX.Element | null) | (JSX.Element | null)[];
  animationDuration?: number;
  minZoom?: number;
  maxZoom?: number;
  tabScale?: number;
  percentWheel?: number;
  allowSpaceDrag?: boolean;
  allowCtrWheel?: boolean;
};

class Zoom extends Component<ZoomProps> {
  private refWrapper?: HTMLDivElement | null;
  private refZoom?: HTMLDivElement | null;
  private timeoutClick?: NodeJS.Timeout;
  private zoom: { transX: number; transY: number; scale: number };
  private isHover: boolean;
  private pageMove?: { x: number; y: number };
  private touchMove?: { x: number; y: number };
  private accessDrag?: boolean;
  private pointZoom?: { pageX: number; pageY: number };

  constructor(props: ZoomProps) {
    super(props);
    this.zoom = { transX: 0, transY: 0, scale: 1 };
    this.isHover = false;
  }

  componentDidMount(): void {
    this.listener();
  }

  shouldComponentUpdate(nextProps: ZoomProps): boolean {
    const { children } = this.props;
    return children !== nextProps.children;
  }

  componentWillUnmount(): void {
    this.unlistener();
  }

  private listener = () => {
    window.addEventListener("wheel", this.stopEvent, { passive: false });
    window.addEventListener("touchmove", this.stopTouch, { passive: false });
    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    window.addEventListener("keyup", this.onKeyUp, { passive: false });
  };

  private unlistener = () => {
    window.removeEventListener("wheel", this.stopEvent);
    window.removeEventListener("touchmove", this.stopTouch);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  };

  private stopEvent = (event: WheelEvent) => {
    const { allowCtrWheel = true } = this.props;
    if ((event.ctrlKey || !allowCtrWheel) && this.isHover) {
      event.preventDefault();
    }
  };

  private stopTouch = (event: any) => {
    if (this.isHover) event.preventDefault();
  };

  private doubleClick = (event: MouseEvent<HTMLDivElement>, scale?: number) => {
    if (!this.refZoom) return;
    const { minZoom = 0.5, maxZoom = 10, tabScale = 1 } = this.props;
    if (!scale) scale = tabScale;
    let nScale = this.zoom.scale + scale;
    if (
      (this.zoom.scale === minZoom && scale < 0) ||
      (this.zoom.scale === maxZoom && scale > 0)
    ) {
      return;
    }
    if (nScale < minZoom || nScale > maxZoom) {
      scale = nScale - this.zoom.scale;
      nScale = nScale < minZoom ? minZoom : maxZoom;
    }
    const { pageX, pageY } = event;
    this.pointZoom = { pageX, pageY };
    const { clientHeight, clientWidth } = this.refZoom;
    const { left, top, width, height } = this.refZoom.getBoundingClientRect();
    const halfW = clientWidth / 2;
    const haflH = clientHeight / 2;
    const wUp = halfW * (nScale - this.zoom.scale);
    const hUp = haflH * (nScale - this.zoom.scale);
    const ratioW = (pageX - left) / (width / 2);
    const ratioH = (pageY - top) / (height / 2);
    const nTransX = this.zoom.transX + (1 - ratioW) * wUp;
    const nTransY = this.zoom.transY + (1 - ratioH) * hUp;
    this.zoom = { transX: nTransX, scale: nScale, transY: nTransY };
    this.refZoom.style.transform = `translate(${nTransX}px, ${nTransY}px) scale(${nScale})`;
  };

  private onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (this.timeoutClick) {
      this.timeoutClick = undefined;
      clearTimeout(this.timeoutClick);
      return this.doubleClick(event);
    }
    this.timeoutClick = setTimeout(() => {
      this.timeoutClick = undefined;
    }, 300);
  };

  private onWhell = (event: WheelEventReact<HTMLDivElement>) => {
    const { allowCtrWheel = true } = this.props;
    const { ctrlKey, nativeEvent, metaKey } = event;
    if (!ctrlKey && !metaKey && allowCtrWheel) return;
    const { percentWheel = 0.01 } = this.props;
    this.doubleClick(event, -nativeEvent.deltaY * percentWheel);
  };

  private onMouseOver = () => {
    this.isHover = true;
  };

  private onMouseLeave = () => {
    this.isHover = false;
    this.onMouseUp();
  };

  private onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const { allowSpaceDrag = true } = this.props;
    if (!this.refWrapper || (!this.accessDrag && allowSpaceDrag)) return;
    this.pageMove = { x: event.pageX, y: event.pageY };
    this.refWrapper.style.cursor = "grabbing";
  };

  private onMouseUp = () => {
    const { allowSpaceDrag = true } = this.props;
    this.pageMove = undefined;
    this.touchMove = undefined;
    if (!this.refZoom || !this.refWrapper) return;
    const { animationDuration = 300 } = this.props;
    const cursor = this.accessDrag && allowSpaceDrag ? "grab" : "default";
    this.refWrapper.style.cursor = cursor;
    this.refZoom.style.transition = `transform ${animationDuration}ms`;
  };

  private onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { allowSpaceDrag = true } = this.props;
    if (
      !this.pageMove ||
      !this.refZoom ||
      (!this.accessDrag && allowSpaceDrag)
    ) {
      return;
    }
    this.zoom.transX += event.pageX - this.pageMove.x;
    this.zoom.transY += event.pageY - this.pageMove.y;
    const { transX, transY, scale } = this.zoom;
    this.refZoom.style.transition = "none";
    this.refZoom.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
    this.pageMove = { x: event.pageX, y: event.pageY };
  };

  private onTouchStart = (event: TouchEventReact<HTMLDivElement>) => {
    const { nativeEvent: nE } = event;
    const { touches } = nE;
    this.isHover = true;
    try {
      this.pageMove = { x: touches[0].pageX, y: touches[0].pageY };
    } catch {}
  };

  private onTouchMove = (event: TouchEventReact<HTMLDivElement>) => {
    const { nativeEvent: nE } = event;
    if (!this.refZoom) return;
    if (nE.touches.length < 2) {
      this.onMouseMove(event.touches[0] as any);
      return;
    }
    const t1 = nE.touches[0];
    const t2 = nE.touches[1];
    const spaceX = Math.abs(t1.pageX - t2.pageX);
    const spaceY = Math.abs(t1.pageY - t2.pageY);
    if (!this.touchMove) this.touchMove = { x: spaceX, y: spaceY };
    const { percentWheel = 0.01 } = this.props;
    const destanceX = spaceX - this.touchMove.x;
    const destanceY = spaceY - this.touchMove.y;
    this.refZoom.style.transition = "none";
    let scale = destanceY * percentWheel;
    if (Math.abs(destanceX) > Math.abs(destanceY)) {
      scale = destanceX * percentWheel;
    }
    this.doubleClick(
      {
        pageX: t2.pageX + Math.abs(destanceX) / 2,
        pageY: t1.pageY + Math.abs(destanceY) / 2,
      } as any,
      scale
    );
    this.touchMove = { x: spaceX, y: spaceY };
  };

  private onKeyDown = (event: KeyboardEvent) => {
    const { allowSpaceDrag = true } = this.props;
    if (!this.refWrapper || this.accessDrag || !allowSpaceDrag) return;
    if (event.code === "Space") {
      this.refWrapper.style.cursor = "grab";
      this.accessDrag = true;
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    const { allowSpaceDrag = true } = this.props;
    if (!this.refWrapper || !this.accessDrag || !allowSpaceDrag) return;
    if (event.code === "Space") {
      this.refWrapper.style.cursor = "default";
      this.accessDrag = false;
    }
  };

  private getPoint = (isCenter: boolean) => {
    if (!this.refWrapper) return;
    let point = this.pointZoom;
    if (!point || isCenter) {
      const { left, top, width, height } =
        this.refWrapper.getBoundingClientRect();
      point = { pageX: width / 2 + left, pageY: height / 2 + top };
    }
    return point;
  };

  onZoomIn = (isCenter: boolean = true) => {
    const point = this.getPoint(isCenter);
    if (!point) return;
    const { tabScale = 1 } = this.props;
    this.doubleClick(point as any, tabScale);
  };

  onZoomOut = (isCenter: boolean = true) => {
    const point = this.getPoint(isCenter);
    if (!point) return;
    const { tabScale = 1 } = this.props;
    this.doubleClick(point as any, -tabScale);
  };

  reset = () => {
    if (!this.refZoom) return;
    this.zoom = { transX: 0, transY: 0, scale: 1 };
    this.pageMove = undefined;
    this.touchMove = undefined;
    this.pointZoom = undefined;
    this.refZoom.style.transform = `translate(0px, 0px) scale(1)`;
  };

  render() {
    const { children, animationDuration = 300 } = this.props;
    return (
      <div
        ref={(ref) => (this.refWrapper = ref)}
        style={{
          userSelect: "none",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          touchAction: "manipulation",
        }}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onMouseLeave}
        onTouchMove={this.onTouchMove}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onWheel={this.onWhell}
        onClick={this.onClick}
      >
        <div
          ref={(ref) => (this.refZoom = ref)}
          style={{
            transition: `transform ${animationDuration}ms`,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Zoom;
