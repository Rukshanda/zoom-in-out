import Calendar from "./packages/Calendar";

function App() {
  return (
    <Calendar
      events={[
        {
          title: "Hahaha",
          start: {
            year: 2024,
            month: 1,
            day: 1,
            hour: 1,
            minus: 0,
            typeHour: "AM",
          },
          end: {
            year: 2024,
            month: 1,
            day: 1,
            hour: 2,
            minus: 0,
            typeHour: "PM",
          },
        },
        {
          title: "Hehehe",
          start: {
            year: 2024,
            month: 1,
            day: 1,
            hour: 1,
            minus: 0,
            typeHour: "AM",
          },
          end: {
            year: 2024,
            month: 1,
            day: 1,
            hour: 3,
            minus: 0,
            typeHour: "PM",
          },
        },
      ]}
    />
  );
}

export default App;
