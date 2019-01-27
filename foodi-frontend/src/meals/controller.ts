import * as restm from "typed-rest-client/RestClient";
import { deserialize } from "serializr";
import { AppState } from "./state";
import { Meal, NewMeal } from "./model";
import { action } from "mobx";

export class MealController {
  appState: AppState;
  baseUrl: String;

  constructor(appState: AppState) {
    if (process.env.NODE_ENV === "development") {
      this.baseUrl = "http://localhost:8000/v1";
    } else {
      this.baseUrl = window.location.origin + "/v1";
    }
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
          if (res.result && res.result instanceof Array) {
            res.result.forEach(item => {
              deserialize(Meal, item, (error, meal) => {
                if (error === null) {
                  this.appState.meals.push(meal);
                }
              });
            });
          }
        } catch (err) {
          alert(err);
          console.log(err);
        }
      },
      reason => {
        alert(reason);
        console.log(reason);
      }
    );

    response.catch(reason => {
      alert(reason);
      console.log(reason);
    });
  }

  @action
  addMeal(meal: NewMeal, callback: () => void) {
    const restc = new restm.RestClient("vsts-node-api");
    const response = restc.create(this.baseUrl + "/meals", meal);
    response.then(
      res => {
        try {
          if (res.result && res.result instanceof Object) {
            deserialize(Meal, res.result, (error, meal) => {
              if (error === null) {
                this.appState.meals.push(meal);
                callback();
              } else {
                alert(error);
                console.log(error);
              }
            });
          }
        } catch (err) {
          alert(err);
          console.log(err);
        }
      },
      reason => {
        console.log(reason);
      }
    );

    response.catch(reason => {
      alert(reason);
      console.log(reason);
    });
  }
}
