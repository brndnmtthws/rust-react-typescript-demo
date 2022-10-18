import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./tachyons.css";

function renderApp() {
  const App = require("./app").default;
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
}

renderApp();
