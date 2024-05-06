import { CSSProperties, Component, MouseEvent } from "react";

export type Data = {
  assetBalanceAge65: number;
  assetBalanceAge85: number;
  differenceSpouseAge: number;
  differenceChildAge: number[];
  dataChart: number[][];
  labelsFamilyTotal: string[];
};

type PointData = {
  x: number;
  y: number;
  width: number;
  height: number;
  data: number;
};

type Props = {
  className?: string;
  style?: CSSProperties;
  data?: Data;
  gap?: number;
  colors?: string[];
  colorHover?: string;
  tooltip?: (d: number[]) => JSX.Element;
};

type State = {
  showTooltip: boolean;
  reUpdate: boolean;
};

const FAMILY = "Noto Sans JP";
const SCALE = Math.max(window.devicePixelRatio, 2);
const FONT_SIZE = 10 * SCALE;
const LINE_WIDTH = 1 * SCALE;
const COLOR = "#555";
const GAP_Y_LABEL = 6 * SCALE;
const GAP = 20 * SCALE;
const PADDING = 10 * SCALE;
const DURATION = 1500;

class Chart extends Component<Props, State> {
  private min: number;
  private max: number;
  private maxWidthLabelX: number;
  private labelsX: number[];
  private labelsY: number[];
  private data1: number[];
  private data2: number[];
  private refCanvas?: HTMLCanvasElement | null;
  private refWrapCanvas?: HTMLDivElement | null;
  private ctx?: CanvasRenderingContext2D | null;
  private points: PointData[] = [];
  private pointsSelected: PointData[] = [];

  private spaceX: number;
  private spaceY: number;
  private sizeBottom: number;
  private interval: number;
  private process: number;
  private spaceLabelY: number;

  private isAnimation: boolean;
  private spaceAdd: number;
  private timeout?: NodeJS.Timeout;
  private contentTooltip?: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.min = 0;
    this.max = 0;
    this.data1 = [];
    this.data2 = [];
    this.labelsX = [];
    this.labelsY = [];
    this.spaceX = 0;
    this.spaceY = 0;
    this.spaceLabelY = 0;
    this.sizeBottom = 0;
    this.spaceAdd = 0;
    this.process = 0;
    this.maxWidthLabelX = 0;
    this.interval = 0;
    this.isAnimation = true;
    this.state = { showTooltip: false, reUpdate: false };
  }

  componentDidMount(): void {
    this.mapData();
    this.config();
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.resize);
  }

  resize = () => {
    this.interval = 0;
    this.isAnimation = false;
    this.config();
  };

  shouldComponentUpdate(
    nProps: Readonly<Props>,
    nState: Readonly<State>
  ): boolean {
    const { style, className, data } = this.props;
    const { showTooltip, reUpdate } = this.state;
    const bool = style !== nProps.style || className !== nProps.className;
    this.isAnimation = true;
    if (data !== nProps.data) {
      this.mapData(nProps);
      this.config(nProps);
    } else if (bool) this.config(nProps);
    return (
      bool || showTooltip !== nState.showTooltip || reUpdate !== nState.reUpdate
    );
  }

  private mapData = (props = this.props) => {
    const { data } = props;
    if (!data) return;
    const { dataChart = [] } = data;
    this.data1 = [];
    this.data2 = [];
    this.labelsX = [];
    for (const data of dataChart) {
      this.data1.push(data?.[1] || 0);
      this.data2.push(data?.[2] || 0);
      this.labelsX.push(data?.[0] || 0);
    }
    const list = [...this.data1, ...this.data2];
    this.min = this.roundToNearest(Math.min(0, ...list));
    const maxx = Math.max(Math.abs(this.min), Math.abs(this.max));
    this.spaceAdd = Math.round(maxx / 10);
  };

  private config = (props = this.props) => {
    const { data, gap = GAP } = props;
    if (!data || !this.refCanvas) return;
    const { width, height } = this.getSize();
    this.refCanvas.width = width;
    this.refCanvas.height = height;
    this.ctx = this.refCanvas.getContext("2d");
    if (!this.ctx) return;
    //---------config ctx---------//
    this.ctx.font = `${FONT_SIZE}px ${FAMILY}`;
    this.ctx.fillStyle = COLOR;
    this.ctx.strokeStyle = COLOR;
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
    //---------config ctx---------//
    this.max = this.roundToNearest(Math.max(0, ...this.data1, ...this.data2));
    const { labelsFamilyTotal = [] } = data;
    const maxWL = Math.max(
      this.ctx.measureText(String(this.min)).width,
      this.ctx.measureText(String(this.max)).width,
      ...labelsFamilyTotal.map((e) => this.ctx?.measureText(e).width || 0)
    );
    this.maxWidthLabelX = maxWL;
    const lengthX = this.labelsX.length;
    // lengthX -= 1
    this.spaceX = (width - PADDING * 2 - maxWL - gap) / lengthX;
    this.spaceX -= this.spaceX / lengthX;
    let valueDraw = this.min;
    this.labelsY = [];
    while (valueDraw < 0) {
      this.labelsY.push(valueDraw);
      valueDraw += this.spaceAdd;
    }
    valueDraw = 0;
    const maxData = Math.max(...this.data1, ...this.data2);
    while (valueDraw <= this.max || valueDraw - this.spaceAdd < maxData) {
      this.labelsY.push(valueDraw);
      valueDraw += this.spaceAdd;
    }
    if (this.max > 0) this.max = valueDraw - this.spaceAdd;
    this.animateValue(props, DURATION);
  };

  private draw = (props = this.props) => {
    const { width, height } = this.getSize();
    this.ctx?.clearRect(0, 0, width, height);
    this.drawX(props);
    this.drawY(props);
    const p = height - this.sizeBottom - PADDING;
    this.spaceY = p / (Math.abs(this.min) + Math.abs(this.max));
    this.drawData(props);
  };

  private drawX = (props = this.props) => {
    const { data } = props;
    if (!this.ctx || !this.refCanvas || !data) return;
    const { height } = this.getSize();
    const { labelsFamilyTotal = [] } = data;
    this.ctx.save();
    this.ctx.textAlign = "center";
    let y = PADDING;
    for (let i = labelsFamilyTotal.length - 1; i >= 0; i--) {
      let x = PADDING + this.maxWidthLabelX;
      const text = labelsFamilyTotal[i];
      this.drawLableFamily(text, x, height - y);
      this.drawLabelX(props, i, x + GAP, y);
      y += FONT_SIZE + GAP_Y_LABEL;
    }
    this.ctx.restore();
  };

  private drawY = (props = this.props) => {
    if (!this.ctx || !this.refCanvas) return;
    const { gap = GAP } = props;
    const { height, width } = this.getSize();
    this.spaceLabelY =
      (height - this.sizeBottom - PADDING) / (this.labelsY.length - 1);
    const maxWlbX = this.maxWidthLabelX;
    let y = PADDING + FONT_SIZE;
    this.ctx.save();
    this.ctx.textAlign = "right";
    this.ctx.lineDashOffset = 6;
    this.ctx.setLineDash([2, 2]);
    for (let i = this.labelsY.length - 1; i >= 0; i--) {
      this.ctx.fillText(
        String(this.labelsY[i]),
        PADDING + maxWlbX,
        y - FONT_SIZE / 2
      );
      this.ctx.beginPath();
      if (!i || !this.labelsY[i]) {
        this.ctx.save();
        this.ctx.setLineDash([0, 0]);
      }
      this.ctx.moveTo(PADDING + maxWlbX + gap, y - FONT_SIZE);
      this.ctx.lineTo(width - PADDING, y - FONT_SIZE);
      this.ctx.stroke();
      if (!i || !this.labelsY[i]) this.ctx.restore();
      y += this.spaceLabelY;
    }
    this.ctx.closePath();
    this.ctx.restore();
  };

  private drawData = (props = this.props) => {
    if (!this.ctx || !this.refCanvas) return;
    const { gap = GAP, colors = ["blue", "red"], colorHover } = props;
    const { showTooltip } = this.state;
    const minY = PADDING;
    let index0 = this.labelsY.findIndex((e) => !e);
    index0 = this.labelsY.length - 1 - index0;
    const yBegin = Math.max(this.spaceLabelY * index0 + FONT_SIZE, minY);
    const maxWlbX = this.maxWidthLabelX;
    const length = Math.max(this.data1.length, this.data2.length);
    this.ctx.save();
    let x = PADDING + maxWlbX + gap + this.spaceX / 2;
    const GAP_COLUMN = 0.1 * this.spaceX * 2;
    const size = this.spaceX - GAP_COLUMN * 2;
    this.points = [];
    for (let i = 0; i < length; i++) {
      const d1 = this.data1[i];
      const d2 = this.data2[i];
      if (d1) {
        this.ctx.fillStyle = d1 >= 0 ? colors[0] : colors[1];
        if (
          colorHover &&
          this.pointsSelected.find((e) => e.data === d1) &&
          showTooltip
        ) {
          this.ctx.fillStyle = colorHover;
        }
        const height = Math.abs(d1) * this.process * this.spaceY;
        const heightY =
          d1 > 0 ? d1 * this.process * this.spaceY + FONT_SIZE / 2 : 0;
        this.ctx.fillRect(
          x + GAP_COLUMN,
          yBegin - heightY,
          size,
          height + FONT_SIZE / 2
        );
        if (this.process === 1) {
          this.points.push({
            x: x + GAP_COLUMN,
            y: yBegin - heightY,
            height: height + FONT_SIZE / 2,
            width: size,
            data: d1,
          });
        }
      }
      if (d2) {
        this.ctx.fillStyle = d2 >= 0 ? colors[0] : colors[1];
        if (
          colorHover &&
          this.pointsSelected.find((e) => e.data === d1) &&
          showTooltip
        ) {
          this.ctx.fillStyle = colorHover;
        }
        const height = Math.abs(d2) * this.process * this.spaceY;
        const heightY =
          d2 > 0 ? d2 * this.process * this.spaceY + FONT_SIZE / 2 : 0;
        this.ctx.fillRect(
          x + GAP_COLUMN,
          yBegin - heightY,
          size,
          height + FONT_SIZE / 2
        );
        if (this.process === 1) {
          this.points.push({
            x: x + GAP_COLUMN,
            y: yBegin - heightY,
            height: height + FONT_SIZE / 2,
            width: size,
            data: d2,
          });
        }
      }
      x += this.spaceX;
    }
    this.ctx.restore();
  };

  private drawLableFamily = (text: string, x: number, y: number) => {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.textAlign = "right";
    this.ctx.fillText(text, x, y);
    this.ctx.closePath();
    this.ctx.restore();
  };

  private drawLabelX = (
    props = this.props,
    index: number,
    x: number,
    y: number
  ) => {
    const { data } = props;
    if (!this.ctx || !data) return;
    const { height } = this.getSize();
    const { differenceChildAge = [], differenceSpouseAge = 0 } = data;
    this.ctx.save();
    this.ctx.textAlign = "center";
    let w = 0;
    const diff = differenceChildAge[index - 2] || differenceSpouseAge;
    const labels = [
      this.labelsX[0] - 1,
      ...this.labelsX,
      this.labelsX[this.labelsX.length - 1] + 1,
    ];
    // const labels = this.labelsX
    for (let i = 0; i < labels.length; i++) {
      const sub = !index ? 0 : diff;
      const label = String(labels[i] + sub);
      const widthLabel = this.ctx.measureText(label).width;
      if (
        (this.interval && i % this.interval === 0) ||
        (widthLabel + PADDING < w && !this.interval)
      ) {
        if (!this.interval) this.interval = i;
        w = widthLabel;
        this.ctx.fillText(label, x, height - y);
      } else w += this.spaceX;
      if (!index) {
        const size = FONT_SIZE + (FONT_SIZE / 2) * 2;
        if (!this.sizeBottom) {
          this.sizeBottom = height - (height - y - size);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x + LINE_WIDTH / 2, height - y - size);
        this.ctx.lineTo(x + LINE_WIDTH / 2, height - y - size + 8 * SCALE);
        this.ctx.stroke();
      }
      x += this.spaceX;
    }
    this.ctx.closePath();
    this.ctx.restore();
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!this.refCanvas) return;
    const { x, y } = this.refCanvas.getBoundingClientRect();
    const xMouse = (event.pageX - x) * SCALE;
    const yMouse = (event.pageY - y) * SCALE;
    const selecteds = this.points.filter((d) => {
      return (
        xMouse >= d.x &&
        xMouse <= d.x + d.width &&
        yMouse >= d.y &&
        yMouse <= d.y + d.height
      );
    });

    if (selecteds.length) this.pointsSelected = selecteds;
    const { showTooltip, reUpdate } = this.state;
    let newShow = !!selecteds.length;
    clearTimeout(this.timeout);
    if (showTooltip && !selecteds.length) {
      this.timeout = setTimeout(() => {
        this.setState({ showTooltip: false }, this.drawData);
      }, 200);
    } else {
      this.setState(
        { showTooltip: newShow, reUpdate: !reUpdate },
        this.drawData
      );
    }
  };

  private getSize = () => {
    if (!this.refCanvas) return { width: 0, height: 0 };
    const { width: w, height: h } = this.refCanvas.getBoundingClientRect();
    return { width: w * SCALE, height: h * SCALE };
  };

  private roundToNearest = (value: number) => {
    if (!value) return 0;
    const absoluteValue = Math.abs(value);
    const log10Value = Math.floor(Math.log10(absoluteValue));
    const roundingFactor = Math.pow(10, log10Value);
    return this.roundToFixed(value / roundingFactor) * roundingFactor;
  };

  private roundToFixed = (value: number) => {
    const multiplier = Math.pow(10, 0);
    const newValue = Math.ceil(Math.abs(value) * multiplier) / multiplier;
    if (value < 0) return -newValue;
    return newValue;
  };

  private easeOutQuint = (t: number) => {
    return 1 + --t * t * t * t * t;
  };

  private animateValue = (props = this.props, duration: number) => {
    let startTime: number;
    const update = (time: number) => {
      if (!startTime) startTime = time;
      let progress = Math.min(1, (time - startTime) / duration);
      if (!this.isAnimation) progress = 1;
      this.process = this.easeOutQuint(progress);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
      this.draw(props);
    };
    requestAnimationFrame(update);
  };

  private getPositionTooltip = (d: PointData) => {
    if (!this.refCanvas || !d || !this.contentTooltip) {
      return { left: undefined, top: undefined };
    }
    const { x, y, width } = this.refCanvas.getBoundingClientRect();
    const { width: w } = this.contentTooltip.getBoundingClientRect();
    let left: number | undefined = d.x / SCALE + x;
    if (d.x / SCALE > width / 2) {
      left = left - w;
    }
    return { left, top: (d.y + d.height / 4) / SCALE + y };
  };

  render() {
    const { className, style, tooltip } = this.props;
    const { showTooltip } = this.state;

    return (
      <div
        ref={(ref) => (this.refWrapCanvas = ref)}
        style={{ ...style, position: "relative" }}
        onMouseMove={this.onMouseMove}
        onMouseLeave={() => this.setState({ showTooltip: false })}
      >
        <canvas
          className={className}
          style={style}
          ref={(ref) => (this.refCanvas = ref)}
        />
        <div
          style={{
            position: "absolute",
            ...this.getPositionTooltip(this.pointsSelected[0]),
            opacity: Number(showTooltip),
            transition: "all 0.3s",
          }}
          ref={(ref) => (this.contentTooltip = ref)}
        >
          {tooltip?.(this.pointsSelected.map((e) => e.data))}
        </div>
      </div>
    );
  }
}

export default Chart;
