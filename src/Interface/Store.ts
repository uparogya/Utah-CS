import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AppStore {
    selectedCategory: string[];
    selectedDistricts: string[];
    showPercentage: boolean;

    constructor() {
        this.selectedCategory = ['CS-basic', 'CS-advanced'];
        this.selectedDistricts = [];
        this.showPercentage = true;
        makeAutoObservable(this);
    }

    setCategory(input: string[]) {
        this.selectedCategory = input;
    }

    updateShowPercentage() {
        this.showPercentage = !this.showPercentage;
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