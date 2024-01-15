import { Component } from "react";
import "./calendar.css";
import { clsx } from "../utils";
import Month from "../Month";

type CalendarProps = {
  className?: string;
};

class Calendar extends Component<CalendarProps> {
  render() {
    const { className } = this.props;
    return (
      <div className={clsx("calendar", className)}>
        <Month month={1} year={2024} />
      </div>
    );
  }
}

export default Calendar;
