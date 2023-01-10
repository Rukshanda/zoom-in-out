import { Component } from "react";

type Props = {
  getDom: () => HTMLElement | null;
  onWheel?: (event: WheelEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onMouseOut?: (event: MouseEvent) => void;
  onMouseOver?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  options?: {
    passive?: boolean;
  };
};

class ElementListener extends Component<Props> {
  remove: { [key: string]: () => void };

  constructor(props: Props) {
    super(props);
    this.remove = {};
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  componentDidMount(): void {
    const {
      onMouseDown,
      onMouseLeave,
      onMouseMove,
      onMouseOut,
      onMouseOver,
      onMouseUp,
      onWheel,
      getDom,
      onTouchEnd,
      onTouchStart,
      options = { passive: false },
    } = this.props;
    const dom = getDom();
    if (!dom) return;
    if (onMouseUp) {
      dom.addEventListener("mouseup", onMouseUp, options);
      this.remove.mouseup = () => {
        dom.removeEventListener("mouseup", onMouseUp);
      };
    }
    if (onMouseDown) {
      dom.addEventListener("mousedown", onMouseDown, options);
      this.remove.mousedown = () => {
        dom.removeEventListener("mousedown", onMouseDown);
      };
    }
    if (onTouchEnd) {
      dom.addEventListener("touchend", onTouchEnd, options);
      this.remove.mouseup = () => {
        dom.removeEventListener("touchend", onTouchEnd);
      };
    }
    if (onTouchStart) {
      dom.addEventListener("touchstart", onTouchStart, options);
      this.remove.mousedown = () => {
        dom.removeEventListener("touchstart", onTouchStart);
      };
    }
    if (onMouseLeave) {
      dom.addEventListener("mouseleave", onMouseLeave, options);
      this.remove.mouseleave = () => {
        dom.removeEventListener("mouseleave", onMouseLeave);
      };
    }
    if (onMouseMove) {
      dom.addEventListener("mousemove", onMouseMove, options);
      this.remove.mousemove = () => {
        dom.removeEventListener("mousemove", onMouseMove);
      };
    }
    if (onMouseOut) {
      dom.addEventListener("mouseout", onMouseOut, options);
      this.remove.mousemove = () => {
        dom.removeEventListener("mouseout", onMouseOut);
      };
    }
    if (onMouseOver) {
      dom.addEventListener("mouseover", onMouseOver, options);
      this.remove.mouseover = () => {
        dom.removeEventListener("mouseover", onMouseOver);
      };
    }
    if (onWheel) {
      dom.addEventListener("wheel", onWheel, options);
      this.remove.wheel = () => {
        dom.removeEventListener("wheel", onWheel);
      };
    }
  }

  componentWillUnmount(): void {
    Object.keys(this.remove).forEach((key) => {
      this.remove.key?.();
    });
  }

  render() {
    return null;
  }
}

export default ElementListener;
