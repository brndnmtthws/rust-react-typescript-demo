import * as React from "react";
import { render } from "react-dom";
import { setConfig } from "react-hot-loader";
setConfig({ logLevel: "debug" });

function renderApp() {
  const App = require("./App").default;
  render(<App />, document.getElementById("root"));
}

renderApp();
