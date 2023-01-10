import { Component } from "react";
import { DisableEventBrowser, EnableEventBrowser } from "../../utlis";

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
