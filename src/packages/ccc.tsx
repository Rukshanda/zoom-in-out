import React, { Component, CSSProperties } from "react";
// import { TSavingsAmountChart } from '../../../../../../types/chart'

type TProps = {
  style?: CSSProperties;
  className?: string;
  data?: any;
  space?: number;
};

type TState = {};

const PADDING = 20;

class CanvasChart extends Component<TProps, TState> {
  private refCanvas?: HTMLCanvasElement | null;
  private min: number;
  private max: number;
  private spaceValue: number;
  private spaceValueX: number;
  private labelsX: number[];
  private data1Draw: number[];
  private data2Draw: number[];
  private yBeginDraw: number;
  private ctx?: CanvasRenderingContext2D | null;
  private widthMText: number;

  constructor(props: TProps) {
    super(props);
    this.min = 0;
    this.max = 0;
    this.spaceValue = 0;
    this.spaceValueX = 0;
    this.yBeginDraw = 0;
    this.widthMText = 0;
    this.labelsX = [];
    this.data1Draw = [];
    this.data2Draw = [];
  }

  shouldComponentUpdate(nProps: Readonly<TProps>): boolean {
    const { style, className } = this.props;
    return style !== nProps.style || className !== nProps.className;
  }

  componentDidMount() {
    this.remapData(this.props);
  }

  roundToFixed = (value: number) => {
    const multiplier = Math.pow(10, 0);
    const newValue = Math.ceil(Math.abs(value) * multiplier) / multiplier;
    if (value < 0) return -newValue;
    return newValue;
  };

  private roundToNearest = (value: number) => {
    if (!value) return 0;
    const absoluteValue = Math.abs(value);
    const log10Value = Math.floor(Math.log10(absoluteValue));
    const roundingFactor = Math.pow(10, log10Value);
    return this.roundToFixed(value / roundingFactor) * roundingFactor;
  };

  private remapData = (props = this.props) => {
    const { data: dProps } = props;
    if (!dProps) return;
    const { dataChart } = dProps;
    if (!dataChart) return;
    this.labelsX = [];
    this.data1Draw = [];
    this.data2Draw = [];
    for (const data of dataChart) {
      this.labelsX.push(data?.[0] || 0);
      this.data1Draw.push(data?.[1] || 0);
      this.data2Draw.push(data?.[2] || 0);
    }
    this.min = this.roundToNearest(
      Math.min(0, ...this.data1Draw, ...this.data2Draw)
    );
    this.max = this.roundToNearest(
      Math.max(0, ...this.data1Draw, ...this.data2Draw)
    );
    this.draw(props);
  };

  private draw = (props = this.props) => {
    if (!this.refCanvas) return;
    if (!this.ctx) this.ctx = this.refCanvas.getContext("2d");
    if (!this.ctx) return;
    const family = "Noto Sans JP";
    const { width, height } = this.refCanvas.getBoundingClientRect();
    this.refCanvas.width = width;
    this.refCanvas.height = height;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.font = `10px ${family}`;
    this.ctx.fillStyle = "#555";
    this.ctx.strokeStyle = "#555";
    this.ctx.lineWidth = 0.5;
    this.drawLabelX(props);
    this.drawLabelY(props);
  };

  private drawLabelX = (props = this.props) => {
    const { data, space = 20 } = props;
    if (!this.ctx || !this.refCanvas || !data) return;
    const { differenceSpouseAge = 0, differenceChildAge = [] } = data;
    const { labelsFamilyTotal } = data;
    if (!labelsFamilyTotal) return;
    this.ctx.save();
    this.ctx.textAlign = "center";
    this.widthMText = Math.max(
      this.ctx.measureText(String(this.max)).width,
      this.ctx.measureText(String(this.min)).width,
      ...labelsFamilyTotal.map((e: any) => this.ctx?.measureText(e || "").width)
    );
    this.spaceValueX =
      (this.refCanvas.width - PADDING * 2 - this.widthMText - space) /
      this.labelsX.length;
    let y = PADDING;
    let jCheckPrint = 0;
    let xSubLast = 0;
    for (let i = labelsFamilyTotal.length - 1; i >= 0; i--) {
      let x = PADDING;
      this.ctx.save();
      this.ctx.textAlign = "right";
      this.ctx?.fillText(
        labelsFamilyTotal[i] || "",
        x + this.widthMText,
        this.refCanvas.height - y,
        this.widthMText
      );
      this.ctx.restore();
      x += this.widthMText + space;
      this.ctx.save();
      this.ctx.textAlign = "center";
      let widthCheck = 0;
      const diff = differenceChildAge[i - 2] || differenceSpouseAge;
      for (let j = 0; j <= this.labelsX.length; j++) {
        const sub = !i ? 0 : diff;
        if (j < this.labelsX.length) {
          const widthLabel = this.ctx.measureText(this.labelsX[j] + sub).width;
          if (
            (jCheckPrint && j % jCheckPrint === 0) ||
            !widthCheck ||
            widthLabel * 4 < widthCheck
          ) {
            if (!jCheckPrint) jCheckPrint = j;
            this.ctx.fillText(
              String(this.labelsX[j] + sub),
              x,
              this.refCanvas.height - y,
              this.spaceValueX
            );
            widthCheck = this.spaceValueX;
          } else widthCheck += widthLabel;
          if (!i && j === this.labelsX.length - 1) {
            xSubLast = Math.floor(widthLabel / 2);
          }
        }
        if (!i) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, this.refCanvas.height - y - 26);
          this.ctx.lineTo(x, this.refCanvas.height - y - 18);
          this.ctx.stroke();
          this.ctx.closePath();
        }
        x += this.spaceValueX;
      }
      this.ctx.restore();
      y += 16;
    }
    this.ctx.beginPath();
    this.yBeginDraw = y + 10;
    this.ctx.moveTo(
      this.widthMText + space + PADDING,
      this.refCanvas.height - this.yBeginDraw
    );
    this.ctx.lineTo(
      this.refCanvas.width - PADDING,
      this.refCanvas.height - this.yBeginDraw
    );
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  };

  private drawLabelY = (props = this.props) => {
    if (!this.ctx || !this.refCanvas) return;
    const { space: spaceProps = 20 } = this.props;
    const space = (Math.abs(this.min) + Math.abs(this.max)) / 10;
    this.spaceValue =
      (Math.abs(this.min) + Math.abs(this.max)) /
      (this.refCanvas.height - this.yBeginDraw);
    this.ctx.save();
    this.ctx.textAlign = "right";
    let valueDraw = this.min;
    const labelsY: string[] = [];
    while (valueDraw < 0) {
      labelsY.push(String(valueDraw));
      valueDraw += space;
    }
    valueDraw = 0;
    while (valueDraw <= this.max) {
      labelsY.push(String(valueDraw));
      valueDraw += space;
    }
    this.spaceValue =
      (this.refCanvas.height - this.yBeginDraw) / labelsY.length;
    let y = PADDING;
    this.ctx.lineDashOffset = 6;
    this.ctx.setLineDash([2, 2]);
    for (let i = labelsY.length - 1; i >= 0; i--) {
      this.ctx.fillText(
        labelsY[i],
        PADDING + this.widthMText,
        y + 8,
        this.widthMText
      );
      if (i > 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(PADDING + this.widthMText + spaceProps, y + 1);
        this.ctx.lineTo(this.refCanvas.width - PADDING, y + 1);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      y += this.spaceValue;
    }
    this.ctx.restore();
  };

  render() {
    const { style, className } = this.props;
    return (
      <canvas
        style={style}
        ref={(ref) => (this.refCanvas = ref)}
        className={className}
      />
    );
  }
}

export default CanvasChart;
