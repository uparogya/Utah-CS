import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AppStore {
    // selectedCategory: string[];
    selectedDistricts: string[];
    showPercentage: boolean;
    currentShownCSType: string;
    schoolYearShowing: string;
    dataLoading: boolean;

    constructor() {
        this.selectedDistricts = [];
        this.showPercentage = true;
        makeAutoObservable(this);
        this.currentShownCSType = 'CSC';
        this.schoolYearShowing = '2021-22';
        this.dataLoading = true;
    }

    updateShowPercentage() {
        this.showPercentage = !this.showPercentage;
    }

    updateDataLoading(newStatus: boolean) {
        this.dataLoading = newStatus;
    }

    updateSelectedCategory(newSelection: string) {
        this.currentShownCSType = newSelection;
    }

    updateSchoolYEar(newYearEntry: string) {
        this.schoolYearShowing = newYearEntry;
        this.dataLoading = true;
    }

    setSelectedDistrict(districtArray: string[]) {
        this.selectedDistricts = districtArray;
    }


    updateSelectedDistrict(districtName: string) {
        if (this.selectedDistricts.includes(districtName)) {
            this.selectedDistricts = this.selectedDistricts.filter(d => d !== districtName);
        } else {
            this.selectedDistricts = this.selectedDistricts.concat([districtName]);
        }
    }

}

const Store = createContext(new AppStore());
export default Store;
