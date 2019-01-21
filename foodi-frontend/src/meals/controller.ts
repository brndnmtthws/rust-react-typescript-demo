import * as restm from "typed-rest-client/RestClient";
import { deserialize } from "serializr";
import { AppState } from "./state";
import { Meal } from "./model";

export class MealController {
  appState: AppState;
  baseUrl: String = "http://localhost:8000/v1";

  constructor(appState: AppState) {
    this.appState = appState;
    this.loadAllMeals();
  }

  loadAllMeals() {
    const client = "rest";
    const restc = new restm.RestClient("vsts-node-api");
    const response = restc.get(this.baseUrl + "/meals");
    response.then(
      res => {
        try {
          const meal = deserialize(Meal, res.result);
          console.log(meal);
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
