import { observable } from "mobx";
import { Meal } from "./model";

export class AppState {
  constructor() {
    this.meals = [];
  }
  @observable public meals: Array<Meal>;
}
