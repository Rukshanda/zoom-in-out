import { Component } from "react";

type Props = {
  onWheel?: (event: WheelEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseOut?: (event: MouseEvent) => void;
  onMouseOver?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  options?: {
    passive?: boolean;
  };
};

class EventListener extends Component<Props> {
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
      onKeyDown,
      onKeyUp,
      onTouchMove,
      onTouchEnd,
      onTouchStart,
      options = { passive: false },
    } = this.props;
    if (onMouseUp) {
      window.addEventListener("mouseup", onMouseUp, options);
      this.remove.mouseup = () => {
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
    if (onMouseDown) {
      window.addEventListener("mousedown", onMouseDown, options);
      this.remove.mousedown = () => {
        window.removeEventListener("mousedown", onMouseDown);
      };
    }
    if (onTouchEnd) {
      window.addEventListener("touchend", onTouchEnd, options);
      this.remove.mouseup = () => {
        window.removeEventListener("touchend", onTouchEnd);
      };
    }
    if (onTouchStart) {
      window.addEventListener("touchstart", onTouchStart, options);
      this.remove.mousedown = () => {
        window.removeEventListener("touchstart", onTouchStart);
      };
    }
    if (onMouseLeave) {
      window.addEventListener("mouseleave", onMouseLeave, options);
      this.remove.mouseleave = () => {
        window.removeEventListener("mouseleave", onMouseLeave);
      };
    }
    if (onMouseMove) {
      window.addEventListener("mousemove", onMouseMove, options);
      this.remove.mousemove = () => {
        window.removeEventListener("mousemove", onMouseMove);
      };
    }
    if (onTouchMove) {
      window.addEventListener("touchmove", onTouchMove, options);
      this.remove.touchmove = () => {
        window.removeEventListener("touchmove", onTouchMove);
      };
    }
    if (onMouseOut) {
      window.addEventListener("mouseout", onMouseOut, options);
      this.remove.mousemove = () => {
        window.removeEventListener("mouseout", onMouseOut);
      };
    }
    if (onMouseOver) {
      window.addEventListener("mouseover", onMouseOver, options);
      this.remove.mouseover = () => {
        window.removeEventListener("mouseover", onMouseOver);
      };
    }
    if (onWheel) {
      window.addEventListener("wheel", onWheel, options);
      this.remove.wheel = () => {
        window.removeEventListener("wheel", onWheel);
      };
    }
    if (onKeyDown) {
      window.addEventListener("keydown", onKeyDown, options);
      this.remove.keydown = () => {
        window.removeEventListener("keydown", onKeyDown);
      };
    }
    if (onKeyUp) {
      window.addEventListener("keyup", onKeyUp, options);
      this.remove.keyup = () => {
        window.removeEventListener("keyup", onKeyUp);
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

export default EventListener;
