import { observable, IObservableArray } from "mobx";
import { Meal } from "./model";

export class AppState {
  constructor() {
    this.meals = observable([]);
  }

  @observable public meals: IObservableArray<Meal>;
}
