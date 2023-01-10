import React, { useCallback, useEffect, useState } from "react";
import Canvas from "./packages/Canvas";
import { ComponentAppType, ComponentBase, WindowSize } from "./packages/types";
import Layout from "./Layout";

const screens: ComponentBase[] = [
  {
    id: "7df2236d89c2",
    name: "Home v15",
    top: 0,
    left: 0,
    width: 375,
    height: 667,
    x: 0,
    y: 0,
    children: [],
    type: ComponentAppType.SCREEN,
  },
  {
    id: "6e12c422cbcf",
    name: "Page 1",
    top: 0,
    left: 475,
    width: 375,
    height: 667,
    x: 475,
    y: 0,
    children: [],
    type: ComponentAppType.SCREEN,
  },
];

const Editor: React.FC = () => {
  const [windowSize, setWindowSize] = useState<WindowSize | undefined>();

  useEffect(() => {
    getWindowSize();
    window.addEventListener("resize", getWindowSize);
    return () => {
      window.removeEventListener("resize", getWindowSize);
    };
    //eslint-disable-next-line
  }, []);

  const getWindowSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return windowSize ? (
    <Layout>
      <Canvas components={screens} windowSize={windowSize} />
    </Layout>
  ) : null;
};

export default Editor;
