import { decorate, observable } from "mobx";
import { serializable } from "serializr";

export class Meal {
  @serializable id: Number = 0;
  @serializable name: String = "";
  @serializable time: Date = new Date();
}
decorate(Meal, {
  name: observable,
  time: observable
});

export class NewMeal {
  @serializable name: String = "";
  @serializable time: Date = new Date();
}
