import { Component } from "react";

enum KEYBOARD_CODE {
  F12 = "F12",
  F7 = "F7",
}

const onKeydown = (event: KeyboardEvent) => {
  const key = event.key as KEYBOARD_CODE;
  if ([KEYBOARD_CODE.F12, KEYBOARD_CODE.F7].includes(key)) {
    event.preventDefault();
  }
};

export const DisableEventBrowser = () => {
  // eslint-disable-next-line no-new-func
  (document as any).oncontextmenu = new Function("return false");
  document.addEventListener("keydown", onKeydown);
};

export const EnableEventBrowser = () => {
  // eslint-disable-next-line no-new-func
  (document as any).oncontextmenu = undefined;
  document.removeEventListener("keydown", onKeydown);
};

class DisabledBrowser extends Component {
  componentDidMount(): void {
    DisableEventBrowser();
  }

  componentWillUnmount(): void {
    EnableEventBrowser();
  }

  render() {
    return null;
  }
}

export default DisabledBrowser;
