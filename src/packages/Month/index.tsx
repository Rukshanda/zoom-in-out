import { Component } from "react";
import { clsx } from "../utils";
import "./index.css";

const img = require("./backg.png");

console.log("img", img);

type MonthProps = {
  month: number;
  year: number;
  className?: string;
  shortDate?: string[];
};

const defaultShortDate = ["S", "M", "T", "W", "T", "F", "S"];

class Month extends Component<MonthProps> {
  refContainer?: HTMLDivElement | null;
  constructor(props: MonthProps) {
    super(props);
    this.getDaysOfMonth();
  }

  componentDidMount(): void {
    this.initEffect();
  }

  initEffect = () => {
    if (!this.refContainer) {
      return;
    }

    function onMouseLeave(e: MouseEvent) {
      var tabl = e.currentTarget as HTMLDivElement;
      tabl.style.backgroundPosition = "-10000px -10000px";
    }
    function onMouseMove(e: MouseEvent) {
      var x = window.Event
        ? e.pageX
        : e.clientX +
          (document.documentElement.scrollLeft
            ? document.documentElement.scrollLeft
            : document.body.scrollLeft);
      var y = window.Event
        ? e.pageY
        : e.clientY +
          (document.documentElement.scrollTop
            ? document.documentElement.scrollTop
            : document.body.scrollTop);

      var tabl = e.currentTarget as HTMLDivElement;
      x = x - size / 2 - tabl.getBoundingClientRect().left;
      y = y - size / 2 - tabl.getBoundingClientRect().top;
      tabl.style.backgroundPosition = x + "px" + " " + y + "px";
    }

    var size = 256;
    this.refContainer.addEventListener("mouseleave", onMouseLeave);
    this.refContainer.addEventListener("mousemove", onMouseMove);
    this.refContainer.style.backgroundSize = size + "px";
    this.refContainer.style.backgroundPosition = "-10000px -10000px";
  };

  getDaysOfMonth = () => {
    const { month, year } = this.props;
    const date = new Date(year, month, 0);
    console.log("date", date.getDate());
  };

  render() {
    const { className, shortDate = defaultShortDate } = this.props;
    return (
      <div className={clsx("month", className)}>
        <table
          className="winstyle"
          ref={(ref) => (this.refContainer = ref)}
          style={{ backgroundImage: `url(${img})` }}
        >
          <tbody>
            <tr>
              {shortDate.map((e) => (
                <td>
                  <div>{e}</div>
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <div>6</div>
              </td>
              <td>
                <div>7</div>
              </td>
              <td>
                <div>8</div>
              </td>
              <td>
                <div>9</div>
              </td>
              <td>
                <div>10</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>11</div>
              </td>
              <td>
                <div>12</div>
              </td>
              <td>
                <div>13</div>
              </td>
              <td>
                <div>14</div>
              </td>
              <td>
                <div>15</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>16</div>
              </td>
              <td>
                <div>17</div>
              </td>
              <td>
                <div>18</div>
              </td>
              <td>
                <div>19</div>
              </td>
              <td>
                <div>20</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Month;
