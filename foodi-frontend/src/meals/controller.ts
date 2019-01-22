import * as restm from "typed-rest-client/RestClient";
import { deserialize } from "serializr";
import { AppState } from "./state";
import { Meal } from "./model";
import { action } from "mobx";

export class MealController {
  appState: AppState;
  baseUrl: String = "http://localhost:8000/v1";

  constructor(appState: AppState) {
    this.appState = appState;
    this.loadAllMeals();
  }

  public getMeals() {
    return this.appState.meals;
  }

  @action
  loadAllMeals() {
    this.appState.meals.clear();
    const restc = new restm.RestClient("vsts-node-api");
    const response = restc.get(this.baseUrl + "/meals");
    response.then(
      res => {
        try {
          const mealResult = deserialize(Meal, res.result);
          mealResult.forEach(meal => {
            this.appState.meals.push(meal);
          });
        } catch (err) {
          console.log(err);
        }
      },
      reason => {
        console.log(reason);
      }
    );

    response.catch(reason => {
      console.log(reason);
    });
  }
}
