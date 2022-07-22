import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class Store {

  constructor() {

    makeAutoObservable(this);
  }


}

const store = createContext(new Store());
export default store;