import { Component } from "react";
import { DayProps } from "..";
import { getTimeZone } from "../utils";

const dLabelDays = ["Mon", "Tue", "Web", "Thu", "Fri", "Sat", "Sun"];
const dLabelHours = [
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 AM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
  "",
];

class Day extends Component<DayProps> {
  private refDayTimeLine?: HTMLDivElement | null;

  private getLabelDay = () => {
    const { labelDays = dLabelDays } = this.props;
    const day = new Date().getDay();
    return labelDays?.[day] || dLabelDays[day];
  };

  private getLabelHours = () => {
    const { labelHours } = this.props;
    if (!Array.isArray(labelHours) || !labelHours?.length) {
      return dLabelHours;
    }
    return labelHours;
  };

  render() {
    const { day } = this.props;

    return (
      <div className="calendar__day">
        <div style={{ position: "relative" }}>
          <div className="calendar__day__line">
            <div className="calendar__day__line__gtm calendar__day__label calendar__day__left">
              <div style={{ paddingRight: 5 }}>GTM {getTimeZone()}</div>
            </div>
            <div className="calendar__day__border-horizontal" />
            <div className="calendar__day__timeline">
              <div style={{ width: 46 }}>
                <div className="calendar__day__label-day">
                  {this.getLabelDay()}
                </div>
                <div className="calendar__day-day">{day}</div>
              </div>
              <div
                ref={(ref) => (this.refDayTimeLine = ref)}
                className="calendar__day__timeline"
              ></div>
            </div>
          </div>
          {this.getLabelHours().map((hour) => {
            return (
              <div className="calendar__day__line" key={`hour_${hour}`}>
                <div className="calendar__day__label calendar__day__left calendar__day__label__hour">
                  <div style={{ paddingRight: 5 }}>{hour}</div>
                </div>
                <div className="calendar__day__border-horizontal" />
                <div className="calendar__day__timeline"></div>
              </div>
            );
          })}
          <div className="calendar__day__border-horizontal--color" />
        </div>
      </div>
    );
  }
}

export default Day;
