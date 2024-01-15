import { Component } from "react";
import { clsx } from "../utils";
import { CalendarProps } from "..";
import Day from "../Day";
import "../index.css";

class Calendar extends Component<CalendarProps> {
  render() {
    const { className } = this.props;
    return (
      <div className={clsx("calendar", className)}>
        <Day month={12} year={2024} day={1} />
      </div>
    );
  }
}

export default Calendar;
