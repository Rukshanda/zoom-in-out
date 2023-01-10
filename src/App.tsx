import { Fragment, useState } from "react";
import ScrollInverted from "./packages/ScrollInverted";

function App() {
  const [state1, setState1] = useState([
    {
      items: ["12", "13", "14", "12", "13", "14", "12", "13", "14", "12"],
      title: "20/09/2021",
    },
    {
      items: ["12", "13", "14", "12", "13", "14", "12", "13", "14", "12"],
      title: "21/09/2021",
    },
    {
      items: ["12", "13", "14", "12", "13", "14", "12", "13", "14", "12"],
      title: "22/09/2021",
    },
    {
      items: ["12", "13", "14", "12", "13", "14", "12", "13", "14", "12"],
      title: "23/09/2021",
    },
  ]);

  return (
    <Fragment>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <ScrollInverted
          renderItem={({ item }) => (
            <div>
              <div style={{ paddingTop: 100, color: "red" }}>{item.title}</div>
              {item.items.map((e, i) => (
                <div
                  style={{ paddingBottom: 40 }}
                  key={`${item.title}_${e}_${i}`}
                >
                  {e}
                </div>
              ))}
            </div>
          )}
          data={state1}
          onStartReached={() => {
            setState1([
              ...state1,
              {
                title: "24/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
            ]);
          }}
          keyExtractor={(item) => item.title}
          onEndReached={() => {
            setState1([
              {
                title: "30/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
              {
                title: "29/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
              {
                title: "28/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
              {
                title: "27/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
              {
                title: "26/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
              {
                title: "25/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
              {
                title: "24/09/2021",
                items: ["12", "13", "14", "12", "13", "14"],
              },
              ...state1,
            ]);
          }}
        />
      </div>
    </Fragment>
  );
}

export default App;
