import { hot } from "react-hot-loader";
import * as React from "react";
import { MealView } from "./meals/view";
import { AppState } from "./meals/state";

type State = AppState;

class App extends React.Component<object, State> {
  state: State = new AppState();
  render() {
    return <MealView appState={this.state} />;
  }
}

export default hot(module)(App);
