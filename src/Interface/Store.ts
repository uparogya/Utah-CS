import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AppStore {
    selectedCategory: string[];
    selectedDistricts: string[];

    constructor() {
        this.selectedCategory = ['CS-basic', 'CS-advanced'];
        this.selectedDistricts = [];
        makeAutoObservable(this);
    }

    setCategory(input: string[]) {
        this.selectedCategory = input;
    }

    setSelectedDistricts(districtName: string) {
        if (this.selectedDistricts.includes(districtName)) {
            this.selectedDistricts = this.selectedDistricts.filter(d => d !== districtName);
        } else {
            this.selectedDistricts.push(districtName);
        }
    }

}

const Store = createContext(new AppStore());
export default Store;