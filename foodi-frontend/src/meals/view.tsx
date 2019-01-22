import * as React from "react";
import { observer } from "mobx-react";
import { AppState } from "./state";
import { MealController } from "./controller";
import "./meals.css";

@observer
export class MealView extends React.Component<{ appState: AppState }, {}> {
  mealController: MealController;
  constructor(props: any) {
    super(props);
    this.mealController = new MealController(this.props.appState);
  }
  render() {
    const meals = this.props.appState.meals;
    let idList = meals.map(meal => (
      <tr key={String(meal.id)}>
        <td>{meal.id}</td>
        <td>{meal.name}</td>
        <td>{meal.time}</td>
      </tr>
    ));
    return (
      <table>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Time</th>
        </thead>
        <tbody>{idList}</tbody>
      </table>
    );
  }
}
