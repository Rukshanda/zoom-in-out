import { CSSProperties, Component } from "react";

export type Data = {
  assetBalanceAge65: number;
  assetBalanceAge85: number;
  differenceSpouseAge: number;
  differenceChildAge: number[];
  dataChart: number[][];
  labelsFamilyTotal: string[];
};

type Props = {
  className?: string;
  style?: CSSProperties;
  data?: Data;
  gap?: number;
};

const FAMILY = "Noto Sans JP";
const SCALE = Math.max(window.devicePixelRatio, 2);
const FONT_SIZE = 10 * SCALE;
const LINE_WIDTH = 1 * SCALE;
const COLOR = "#555";
const GAP_Y_LABEL = 6 * SCALE;
const GAP = 20 * SCALE;
const PADDING = 10 * SCALE;
const DURATION = 2000;

class Chart extends Component<Props> {
  private min: number;
  private max: number;
  private maxWidthLabelX: number;
  private labelsX: number[];
  private labelsY: number[];
  private data1: number[];
  private data2: number[];
  private refCanvas?: HTMLCanvasElement | null;
  private ctx?: CanvasRenderingContext2D | null;

  private spaceX: number;
  private spaceY: number;
  private sizeBottom: number;
  private interval?: number;
  private process: number;
  private spaceLabelY: number;

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
    this.process = 0;
    this.maxWidthLabelX = 0;
  }

  componentDidMount(): void {
    this.config();
  }

  shouldComponentUpdate(nProps: Readonly<Props>): boolean {
    const { style, className } = this.props;
    return style !== nProps.style || className !== nProps.className;
  }

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

    const { dataChart = [], labelsFamilyTotal = [] } = data;
    this.data1 = [];
    this.data2 = [];
    this.labelsX = [];
    this.labelsY = [];
    for (const data of dataChart) {
      this.data1.push(data?.[1] || 0);
      this.data2.push(data?.[2] || 0);
      this.labelsX.push(data?.[0] || 0);
    }
    const list = [...this.data1, ...this.data2];
    this.min = this.roundToNearest(Math.min(0, ...list));
    this.max = this.roundToNearest(Math.max(0, ...list));

    const totalSize = Math.abs(this.min) + Math.abs(this.max);
    const space = totalSize / 10;
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
    while (valueDraw < 0) {
      this.labelsY.push(valueDraw);
      valueDraw += space;
    }
    valueDraw = 0;
    const check = this.max > 0 ? this.max + space : this.max;
    while (valueDraw <= check) {
      this.labelsY.push(valueDraw);
      valueDraw += space;
    }
    if (this.max > 0) this.max = valueDraw - space;
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
    const { gap = GAP } = props;
    const minY = PADDING;
    let index0 = this.labelsY.findIndex((e) => !e);
    index0 = this.labelsY.length - 1 - index0;
    const yBegin = Math.max(this.spaceLabelY * index0 + FONT_SIZE, minY);
    const maxWlbX = this.maxWidthLabelX;
    const length = Math.max(this.data1.length, this.data2.length);
    this.ctx.save();
    let x = PADDING + maxWlbX + gap + this.spaceX / 2;
    const GAP_COLUMN = 0.1 * this.spaceX * SCALE;
    const size = this.spaceX - GAP_COLUMN * 2;
    for (let i = 0; i < length; i++) {
      const d1 = this.data1[i];
      const d2 = this.data2[i];
      if (d1) {
        this.ctx.fillStyle = d1 >= 0 ? "blue" : "red";
        const height = Math.abs(d1) * this.process * this.spaceY;
        const heightY = d1 > 0 ? Math.abs(d1) * this.process * this.spaceY : 0;
        this.ctx.fillRect(
          x + GAP_COLUMN,
          yBegin - heightY,
          size,
          height + FONT_SIZE / 2
        );
      }
      if (d2) {
        this.ctx.fillStyle = d2 >= 0 ? "blue" : "red";
        const height = Math.abs(d2) * this.process * this.spaceY;
        this.ctx.fillRect(x + GAP_COLUMN, yBegin, size, height + FONT_SIZE / 2);
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
        !w ||
        widthLabel * 2 < w
      ) {
        if (!this.interval) this.interval = i;
        this.ctx.fillText(label, x, height - y);
        w = this.spaceX;
      } else w += widthLabel;
      if (!index) {
        if (!this.sizeBottom) {
          this.sizeBottom = height - (height - y - FONT_SIZE * SCALE);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x + LINE_WIDTH / 2, height - y - FONT_SIZE * SCALE);
        this.ctx.lineTo(x + LINE_WIDTH / 2, height - y - FONT_SIZE - 4 * SCALE);
        this.ctx.stroke();
      }
      x += this.spaceX;
    }
    this.ctx.closePath();
    this.ctx.restore();
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
      const progress = Math.min(1, (time - startTime) / duration);
      this.process = this.easeOutQuint(progress);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
      this.draw(props);
    };
    requestAnimationFrame(update);
  };

  render() {
    const { className, style } = this.props;
    return (
      <canvas
        className={className}
        style={style}
        ref={(ref) => (this.refCanvas = ref)}
      />
    );
  }
}

export default Chart;
