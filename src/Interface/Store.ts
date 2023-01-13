import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AppStore {
    // selectedCategory: string[];
    selectedDistricts: string[];
    showPercentage: boolean;
    currentShownCSType: string;
    schoolYearShowing: string;

    constructor() {
        // this.selectedCategory = ['CSB', 'CSA'];
        this.selectedDistricts = [];
        this.showPercentage = true;
        makeAutoObservable(this);
        this.currentShownCSType = 'CS';
        this.schoolYearShowing = '2021-22';
    }

    updateShowPercentage() {
        this.showPercentage = !this.showPercentage;
    }

    updateSelectedCategory(newSelection: string) {
        this.currentShownCSType = newSelection;
    }

    setSelectedDistricts(districtName: string) {
        console.log(districtName);
        if (this.selectedDistricts.includes(districtName)) {
            this.selectedDistricts = this.selectedDistricts.filter(d => d !== districtName);
        } else {
            this.selectedDistricts = this.selectedDistricts.concat([districtName]);
        }
    }

}

const Store = createContext(new AppStore());
export default Store;
