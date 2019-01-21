import * as React from "react";
import * as ReactDOM from "react-dom";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { AppState } from "./state";
import { MealController } from "./controller";

@observer
export class MealView extends React.Component<{ appState: AppState }, {}> {
  mealController: MealController;
  constructor(props: any) {
    super(props);
    this.mealController = new MealController(this.props.appState);
  }
  render() {
    return <div />;
  }
}
