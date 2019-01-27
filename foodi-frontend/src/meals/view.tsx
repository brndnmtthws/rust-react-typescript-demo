import * as React from "react";
import { observer } from "mobx-react";
import { computed, action, observable } from "mobx";
import { AppState } from "./state";
import { MealController } from "./controller";
import "tachyons";
import "./meals.css";
import { Meal, NewMeal } from "./model";

class TableRow extends React.Component<{}, {}> {
  render() {
    return <tr className="striped--near-white">{this.props.children}</tr>;
  }
}

class TableHeader extends React.Component<{}, {}> {
  render() {
    return <th className="pv2 ph3 tl f6 fw6 ttu">{this.props.children}</th>;
  }
}

class TableData extends React.Component<{}, {}> {
  render() {
    return <td className="pv2 ph3">{this.props.children}</td>;
  }
}

@observer
export class MealView extends React.Component<{ appState: AppState }, {}> {
  mealController: MealController;
  @observable showNewMealForm: boolean = false;
  mealForm: NewMeal = new NewMeal();

  constructor(props: any) {
    super(props);
    this.mealController = new MealController(this.props.appState);
  }

  @action
  addNewMeal(event: React.MouseEvent) {
    console.log("Add new meal button clicked");
    this.showNewMealForm = true;
  }

  @computed
  get time() {
    let coeff = 1000 * 60;
    let now = new Date();
    return new Date(Math.floor(now.getTime() / coeff) * coeff).toISOString();
  }

  @action
  hideForm() {
    console.log("hiding form");
    this.showNewMealForm = false;
  }

  formSubmit(event: React.MouseEvent) {
    console.log("form submitted");
    console.log(event);
    console.log(this.mealForm);
    this.mealController.addMeal(this.mealForm, () => this.hideForm());
  }

  render() {
    const meals = this.props.appState.meals;
    let idList = meals.map(meal => (
      <TableRow key={String(meal.id)}>
        <TableData>{meal.id}</TableData>
        <TableData>{meal.name}</TableData>
        <TableData>{meal.time}</TableData>
      </TableRow>
    ));
    let mealForm = (
      <div className="contain fl pa2 w-100">
        <form className="pa4 black-80 shadow-1">
          <div className="measure pv1">
            <label htmlFor="name" className="f6 b db mb2">
              Name of meal
            </label>
            <input
              id="name"
              className="input-reset ba b--black-20 pa2 mb2 db w-100"
              type="text"
              aria-describedby="name-desc"
              onChange={event => (this.mealForm.name = event.target.value)}
            />
            <small id="name-desc" className="f6 black-60 db mb2">
              What did you eat?
            </small>
          </div>
          <div className="measure">
            <label htmlFor="time" className="f6 b db mb2">
              Time of meal
            </label>
            <input
              id="time"
              className="input-reset ba b--black-20 pa2 mb2 db w-100"
              type="text"
              aria-describedby="name-desc"
              defaultValue={this.time}
              onChange={event =>
                (this.mealForm.time = new Date(event.target.value))
              }
            />
            <small id="name-desc" className="f6 black-60 db mb2">
              When did you eat?
            </small>
          </div>
          <div className="pv1">
            <a
              className="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib white bg-hot-pink"
              href="#0"
              onClick={event => this.formSubmit(event)}
            >
              + Save!
            </a>
          </div>
        </form>
      </div>
    );
    return (
      <div className="sans-serif fl w-50 pa2 pv2">
        <div className="pa3">
          <table className="collapse pv2 ph3 mt4 fl pa2 w-100">
            <tbody>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Time</TableHeader>
              </TableRow>
              {idList}
            </tbody>
          </table>
          <div>
            <a
              className="f6 grow no-underline br-pill ba bw1 ph3 pv2 ma3 dib hot-pink"
              href="#0"
              onClick={event => this.addNewMeal(event)}
            >
              Add new meal
            </a>
          </div>
        </div>
        {this.showNewMealForm ? mealForm : ""}
      </div>
    );
  }
}
