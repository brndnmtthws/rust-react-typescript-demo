import { observable } from "mobx";

export class AppState {
  @observable meals = [];

  constructor() {}
}
