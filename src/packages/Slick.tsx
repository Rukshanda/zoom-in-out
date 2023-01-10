import { CSSProperties, Component } from "react";

type Props<T> = {
  images: T[];
  onClick?: (image: T) => void;
  urlExtractor: (image: T) => string;
  keyExtractor?: (image: T) => string;
  styleImg?: CSSProperties;
  aspectRatio?: string;
  durationAnimation?: number;
  durationAutoPlay?: number;
  dotStyle?: CSSProperties;
  loop?: boolean;
  dotColorActive?: string;
  dotColorInActive?: string;
};

class Slick<T> extends Component<Props<T>> {
  i: number;
  ref?: HTMLDivElement | null;
  refsImg: (HTMLDivElement | null)[];
  refsDot: (HTMLDivElement | null)[];
  mouse: { x?: number; x2?: number };
  allowMove?: boolean;
  listener: (() => void) | undefined;
  interval?: NodeJS.Timeout;

  constructor(props: Props<T>) {
    super(props);
    this.i = 1;
    this.mouse = {};
    this.refsImg = [];
    this.refsDot = [];
    this.allowMove = true;
  }

  componentDidMount(): void {
    this.listener = appendCss();
    this.beginActive();
    this.addLoop();
    window.addEventListener("resize", this.resize);
  }

  shouldComponentUpdate(nextProps: Readonly<Props<T>>): boolean {
    if (nextProps.images.length !== this.props.images.length) {
      this.i = 1;
      this.mouse = {};
      this.refsImg = this.refsImg.filter((_, i) => i < nextProps.images.length);
      setTimeout(this.translate, 0);
    }
    return true;
  }

  componentWillUnmount(): void {
    this.listener?.();
    clearInterval(this.interval);
    window.removeEventListener("resize", this.resize);
  }

  private addLoop = () => {
    clearInterval(this.interval);
    const {
      durationAutoPlay = 4000,
      durationAnimation = 300,
      images = [],
      loop = true,
    } = this.props;
    if (!loop) return;
    this.interval = setInterval(() => {
      this.allowMove = false;
      this.mouse.x = 0;
      this.mouse.x2 = -getSizeWidth(this.ref);
      this.translate(true);
      setTimeout(() => {
        this.i = this.i + 1;
        if (this.i === images.length + 1) {
          this.i = 1;
        } else if (this.i === 0) {
          this.i = images.length;
        }
        this.allowMove = true;
        this.mouse = {};
        this.translate();
      }, durationAnimation);
    }, durationAutoPlay);
  };

  private resize = () => {
    const width = getSizeWidth(this.ref);
    this.appendSize(width);
    this.translate();
  };

  private beginActive = () => {
    if (this.ref) this.ref.style.opacity = "1";
    const width = getSizeWidth(this.ref);
    this.appendSize(width);
    this.translate();
  };

  private translate = (animation?: boolean) => {
    const width = getSizeWidth(this.ref);
    for (let i = 0; i < this.refsImg.length; i++) {
      const ref = this.refsImg[i];
      if (!ref) continue;
      this.enableTransition(ref, animation);
      const size = -width * this.i;
      const xAdd = this.getTranslateXMove(i);
      if ((i === this.i - 1 && xAdd < 0) || (xAdd > 0 && i === this.i)) {
        this.enableBackdrop(ref);
      } else this.removeBackdrop(ref);
      if (i < this.i) {
        const tran = size / 2 + (-width / 2) * i - xAdd;
        ref.style.transform = `translateX(${tran}px)`;
      } else {
        ref.style.transform = `translateX(${size - xAdd}px)`;
      }
    }
    this.viewDot();
  };

  private getTranslateXMove = (i: number) => {
    const xTrans = (this.mouse.x || 0) - (this.mouse.x2 || 0);
    let xAdd = xTrans;
    if (i < this.i) {
      xAdd = xTrans / 2;
    } else if (i === this.i) {
      xAdd = xTrans > 0 ? xTrans / 2 : xTrans;
    }
    return xAdd;
  };

  private appendSize = (width: number) => {
    this.refsImg?.forEach((ref) => {
      if (ref) ref.style.width = `${width}px`;
    });
  };

  private onMouseDown = ({ pageX }: { pageX: number }) => {
    if (!this.allowMove) return;
    this.mouse.x = pageX;
    clearInterval(this.interval);
  };

  private onMouseMove = ({ pageX }: { pageX: number }) => {
    if (this.mouse.x === undefined || !this.allowMove) return;
    this.mouse.x2 = pageX;
    this.translate();
    this.checkPercent();
  };

  private checkPercent = () => {
    if (this.mouse.x === undefined || !this.allowMove) return;
    const { durationAnimation = 300, images } = this.props;
    const percent = this.getPercent();
    if (Math.abs(percent) > 0.3) {
      this.allowMove = false;
      const width = getSizeWidth(this.ref);
      if (percent < 0) {
        this.mouse.x2 = width + this.mouse.x;
      } else this.mouse.x2 = this.mouse.x - width;
      this.translate(true);
      setTimeout(() => {
        this.i = percent < 0 ? this.i - 1 : this.i + 1;
        if (this.i === images.length + 1) {
          this.i = 1;
        } else if (this.i === 0) {
          this.i = images.length;
        }
        this.mouse = {};
        this.translate();
        this.allowMove = true;
        this.addLoop();
      }, durationAnimation);
    }
  };

  private onMouseUp = () => {
    if (!this.allowMove) return;
    this.addLoop();
    const { durationAnimation = 300, onClick, images } = this.props;
    if (this.mouse.x === undefined || this.mouse.x2 === undefined) {
      this.mouse = {};
      return onClick?.(images[this.i - 1]);
    }
    this.mouse.x2 = this.mouse.x;
    this.allowMove = false;
    this.translate(true);
    setTimeout(() => {
      this.allowMove = true;
      this.mouse = {};
    }, durationAnimation);
  };

  private enableTransition = (
    element?: HTMLDivElement | null,
    animation?: boolean
  ) => {
    if (!element) return;
    const { durationAnimation = 300 } = this.props;
    element.style.transitionDuration = `${animation ? durationAnimation : 0}ms`;
  };

  private getPercent = () => {
    const xTrans = (this.mouse.x || 0) - (this.mouse.x2 || 0);
    const width = getSizeWidth(this.ref);
    const percent = xTrans / width;
    return percent;
  };

  private enableBackdrop = (element: HTMLDivElement) => {
    const backdrop = element.querySelector("div.slider-slick__img__backdrop");
    const percent = this.getPercent();
    if (backdrop) {
      backdrop.setAttribute(
        "style",
        `opacity: ${percent < 0 ? 1 - Math.abs(percent) : Math.abs(percent)}`
      );
    }
  };

  private removeBackdrop = (element: HTMLDivElement) => {
    const backdrop = element.querySelector("div.slider-slick__img__backdrop");
    if (backdrop) {
      backdrop.setAttribute("style", "opacity: 0");
    }
  };

  private viewDot = () => {
    const { dotColorActive, dotColorInActive } = this.props;
    for (let i = 0; i < this.refsDot.length; i++) {
      const dot = this.refsDot[i];
      if (!dot) continue;
      if (i + 1 === this.i) {
        if (dotColorActive) {
          dot.style.backgroundColor = dotColorActive;
        } else dot.style.opacity = "1";
      } else {
        if (dotColorInActive) {
          dot.style.backgroundColor = dotColorInActive;
        } else dot.style.opacity = "0.5";
      }
    }
  };

  render() {
    const {
      images = [],
      urlExtractor,
      keyExtractor,
      aspectRatio,
      styleImg,
      dotStyle,
      dotColorInActive,
    } = this.props;

    if (!images?.length) return null;

    const imageEnd = images[images.length - 1];
    const imageStart = images[0];

    return (
      <div
        className="slider-slick"
        ref={(ref) => (this.ref = ref)}
        onMouseDown={this.onMouseDown}
        onTouchStart={(e) => {
          this.onMouseDown({ pageX: e.changedTouches[0].pageX });
        }}
        onMouseMove={this.onMouseMove}
        onTouchMove={(e) => {
          this.onMouseMove({ pageX: e.changedTouches[0].pageX });
        }}
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
      >
        {[imageEnd, ...images, imageStart].map((e, i) => (
          <div
            className="slider-slick__img"
            key={`${keyExtractor?.(e)}_${i}`}
            ref={(ref) => (this.refsImg[i] = ref)}
          >
            <img
              draggable={false}
              src={urlExtractor(e)}
              alt=""
              style={sxStyle(styleImg, { aspectRatio })}
            />
            <div className="slider-slick__img__backdrop" />
          </div>
        ))}
        <div className="slider-slick__dot">
          {images.map((_, i) => (
            <div
              ref={(ref) => (this.refsDot[i] = ref)}
              style={sxStyle(dotStyle, { backgroundColor: dotColorInActive })}
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Slick;

const sxStyle = (...args: (CSSProperties | undefined | null)[]) => {
  let style = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] && typeof args[i] === "object") {
      style = { ...style, ...args[i] };
    }
  }
  return style;
};

const css = `
  .slider-slick {
    width: 100%;
    height: max-content;
    display: flex;
    align-items: center;
    overflow: hidden;
    user-select: none;
    opacity: 0;
    position: relative;
  }

  .slider-slick__img {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    min-width: 100%;
    flex: 1;
  }

  .slider-slick__img > img {
    width: 100%;
    min-width: 100%;
  }

  .slider-slick__img__backdrop {
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .slider-slick__dot {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .slider-slick__dot > div {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: white;
    opacity: 1
  }
`;

const appendCss = () => {
  const head = document.querySelector("head");
  if (!head) return;
  const styleExist = document.querySelector(
    'style[id-style="slick-slider-import-css"]'
  );
  if (styleExist) return;
  const style = document.createElement("style");
  style.setAttribute("id-style", "slick-slider-import-css");
  style.innerHTML = css;
  head.appendChild(style);
  return () => {
    head.removeChild(style);
  };
};

const getSizeWidth = (element?: HTMLElement | null) => {
  if (!element) return 0;
  return element.getBoundingClientRect().width;
};
