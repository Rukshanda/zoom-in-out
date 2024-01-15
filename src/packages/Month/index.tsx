import { Component } from "react";
import { chunkArray, clsx, diffArray } from "../utils";
import { MonthProps } from "..";

const dSun = ["S", "M", "T", "W", "T", "F", "S"];
const dMon = ["M", "T", "W", "T", "F", "S", "S"];
const dMonthsLabel = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

class Month extends Component<MonthProps> {
  refContainer?: HTMLDivElement | null;
  dates: { day: number; year: number; month: number }[][];
  dSDate: string[];
  now: number[];
  constructor(props: MonthProps) {
    super(props);
    this.dSDate = props.isMondayStart ? dMon : dSun;
    this.dates = this.getDaysOfMonth();
    const now = new Date();
    this.now = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  }

  shouldComponentUpdate(nProps: Readonly<MonthProps>): boolean {
    const {
      year,
      month,
      className,
      shortLabelDate,
      labelMonths,
      isMondayStart,
    } = this.props;
    if (year !== nProps.year || month !== nProps.month) {
      this.dates = this.getDaysOfMonth(nProps);
    }
    const shouldUpdate =
      year !== nProps.year ||
      month !== nProps.month ||
      className !== nProps.className ||
      isMondayStart !== nProps.isMondayStart ||
      diffArray(shortLabelDate, nProps.shortLabelDate) ||
      diffArray(labelMonths, nProps.labelMonths);
    return shouldUpdate;
  }

  private getDaysOfMonth = (props = this.props) => {
    const { month, year, isMondayStart } = props;
    const date = new Date(year, month, 0).getDate();

    const nowAfter = new Date(year, month - 1, 1);
    let appendAfter = nowAfter.getDay();

    const nowBefore = new Date(year, month - 1, date);
    let appendBefore = nowBefore.getDay();
    let dates = [];
    if (isMondayStart) {
      appendBefore -= 1;
      appendAfter -= 1;
    }
    if (appendAfter) {
      const dateAfter = new Date(year, month - 1, 0).getDate();
      for (let i = appendAfter - 1; i >= 0; i--) {
        dates.push({
          day: dateAfter - i,
          year: nowAfter.getFullYear(),
          month: nowAfter.getMonth() + 1,
        });
      }
    }
    for (let i = 1; i <= date; i++) {
      dates.push({ day: i, year, month });
    }
    let divRemove = 6;
    if (dates.length <= 34) {
      divRemove = 13;
    }
    for (let i = 1; i <= divRemove - appendBefore; i++) {
      dates.push({
        day: i,
        year: nowAfter.getFullYear(),
        month: nowAfter.getMonth() + 1,
      });
    }
    return chunkArray(dates, this.dSDate.length);
  };

  private getShortLabelDate = () => {
    const { shortLabelDate } = this.props;
    if (!Array.isArray(shortLabelDate) || !shortLabelDate?.length) {
      return this.dSDate;
    }
    return shortLabelDate;
  };

  private getLabelMonths = () => {
    const { labelMonths } = this.props;
    if (!Array.isArray(labelMonths) || !labelMonths?.length) {
      return dMonthsLabel;
    }
    return labelMonths;
  };

  render() {
    const { className, month } = this.props;
    return (
      <div className={clsx("calendar__month", className)}>
        <div className="calendar__month__label">
          {this.getLabelMonths()[month - 1]}
        </div>
        <div className="calendar__month__header">
          {this.getShortLabelDate().map((d, i) => (
            <div key={`${d}_${i}`}>{d}</div>
          ))}
        </div>

        {this.dates.map((d, i) => (
          <div key={`day_list_${i}`} className="calendar__month__days">
            {d.map((dd, index) => (
              <div key={`${dd.day}_${index}`}>
                <div
                  className={clsx(
                    "calendar__month__day",
                    this.now[0] === dd.year &&
                      this.now[1] === dd.month &&
                      this.now[2] === dd.day &&
                      "calendar__month__day--today"
                  )}
                >
                  {dd.day}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Month;
