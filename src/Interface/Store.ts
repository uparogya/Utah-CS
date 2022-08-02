import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AppStore {
    selectedCategory: string[];
    constructor() {
        this.selectedCategory = ['CS-basic', 'CS-advanced'];
        makeAutoObservable(this);
    }

    setCategory(input: string[]) {
        this.selectedCategory = input;
    }

}

const Store = createContext(new AppStore());
export default Store;