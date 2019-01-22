import * as React from "react";
import * as ReactDOM from "react-dom";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { AppState } from "./state";
import { MealController } from "./controller";
import { Meal } from "./model";

@observer
export class MealView extends React.Component<{ appState: AppState }, {}> {
  mealController: MealController;
  constructor(props: any) {
    super(props);
    this.mealController = new MealController(this.props.appState);
  }
  render() {
    const meals = this.props.appState.meals;
    let idList = meals.map(meal => <li key={String(meal.id)}>{meal.id}</li>);
    console.log(idList);
    return <ul>{idList}</ul>;
  }
}
