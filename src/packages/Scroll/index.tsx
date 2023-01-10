import {
  Component,
  CSSProperties,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from "react";
import { appendCss, clsx, styleSx } from "../utils";

type ScrollProps = {
  style?: CSSProperties[] | CSSProperties;
  className?: string[] | string;
  children?: ReactNode;
};

const duration = 1000;
const minVelocity = 2;

class Scroll extends Component<ScrollProps> {
  private eventAddCss?: () => void;
  private divScroll?: HTMLDivElement | null;
  private startY: number;
  private endY: number;
  private currentTime: number;
  isScrolling: boolean;
  initialTouchY: number;
  lastTouchY: number;
  lastTouchTime: number;
  velocityY: number;

  constructor(props: ScrollProps) {
    super(props);
    this.startY = 0;
    this.endY = 0;
    this.currentTime = 0;
    this.isScrolling = false;
    this.initialTouchY = 0;
    this.lastTouchTime = 0;
    this.lastTouchY = 0;
    this.velocityY = 0;
  }

  componentDidMount(): void {
    appendCss();
  }

  componentWillUnmount(): void {
    this.eventAddCss?.();
  }

  private onWheel = (e: WheelEvent) => {
    this.startY = this.endY;
    this.endY -= e.deltaY;
    this.currentTime = 0;
    requestAnimationFrame(this.smoothScroll);
  };

  private smoothScroll = () => {
    if (!this.divScroll) return;
    this.currentTime += 20;
    let progress = this.currentTime / duration;
    progress = Math.min(progress, 1);

    let val = this.easeOutCubic(progress);

    let currentY = this.startY + (this.endY - this.startY) * val;
    this.divScroll.style.transform = `translateY(${currentY}px)`;
    if (progress < 1) {
      requestAnimationFrame(this.smoothScroll);
    }
  };

  private easeOutCubic = (t: number) => {
    return t * (2 - t);
  };

  private onTouchStart = (e: TouchEvent) => {
    this.removeTransition();
    this.isScrolling = true;
    this.initialTouchY = e.touches[0].clientY;
    this.lastTouchY = this.initialTouchY;
    this.lastTouchTime = Date.now();
    this.startY = this.endY;
    this.velocityY = 0;
  };

  private onTouchMove = (e: TouchEvent) => {
    if (!this.isScrolling) return;
    let touchY = e.touches[0].clientY;
    let newTime = Date.now();
    let deltaTime = newTime - this.lastTouchTime;
    let deltaY = (touchY - this.lastTouchY) * 0.7;

    if (deltaTime > 0) {
      this.velocityY = (deltaY / deltaTime) * 30; // Tốc độ pixel trên frame
      this.lastTouchTime = newTime;
      this.lastTouchY = touchY;
    }
    this.endY += deltaY;
    this.applyScroll();
  };

  private onTouchEnd = () => {
    this.isScrolling = false;
    if (this.endY > 0) {
      this.deceleration();
    } else if (Math.abs(this.velocityY) > minVelocity) {
      this.startInertiaScroll();
    }
  };

  private deceleration = () => {
    this.enableTransition();
    this.endY = 0;
    this.applyScroll();
  };

  private startInertiaScroll = () => {
    if (Math.abs(this.velocityY) < 0.1) {
      if (this.endY > 0) this.deceleration();
      return;
    }
    this.endY += this.velocityY;
    this.velocityY *= 0.85;
    this.applyScroll();
    if (this.endY > 100 || (Math.abs(this.velocityY) < 2 && this.endY > 0)) {
      this.deceleration();
      this.velocityY = 0;
    }
    requestAnimationFrame(this.startInertiaScroll);
  };

  private applyScroll = () => {
    if (!this.divScroll) return;
    this.divScroll.style.transform = `translateY(${this.endY}px)`;
  };

  private enableTransition = () => {
    if (!this.divScroll) return;
    this.divScroll.style.transition = "transform 0.2s";
  };

  private removeTransition = () => {
    if (!this.divScroll) return;
    this.divScroll.style.transition = "";
  };

  render() {
    const { style, className, children } = this.props;
    return (
      <div
        style={styleSx(style)}
        className={clsx("scroll--animation", className)}
        onWheel={this.onWheel}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={this.onTouchMove}
      >
        <div
          className="scroll--animation--translate"
          ref={(ref) => (this.divScroll = ref)}
        >
          <div className="scroll--animation--content">{children}</div>
        </div>
      </div>
    );
  }
}

export default Scroll;
