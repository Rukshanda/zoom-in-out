import { Fragment, useRef } from "react";
import Zoom from "./packages/Zoom";

function App() {
  const refZoom = useRef<Zoom | null>(null);

  const onIn = () => {
    if (!refZoom.current) return;
    refZoom.current.onZoomIn();
  };

  const onOut = () => {
    if (!refZoom.current) return;
    refZoom.current.onZoomOut();
  };

  return (
    <Fragment>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
        <button style={{ width: 120 }} onClick={onIn}>
          Zoom In
        </button>
        <button style={{ width: 120, marginLeft: 16 }} onClick={onOut}>
          Zoom Out
        </button>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Zoom ref={refZoom}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
            </div>
          </div>
        </Zoom>
      </div>
    </Fragment>
  );
}

export default App;
