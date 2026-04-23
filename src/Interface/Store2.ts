import { createContext } from "react";
import { makeAutoObservable } from "mobx";

export class AppStore {
    schoolYearShowing: string;
    showPercentage: boolean;
    courseCategory: string;
    courseLevel: string;

    selectedDistricts: string[];
    hoveredDistrict: string | null;

    constructor() {
        this.schoolYearShowing = '2024-25';
        this.showPercentage = false;
        this.courseCategory = 'CS Total';
        this.courseLevel = 'All';

        this.selectedDistricts = [];
        this.hoveredDistrict = null;

        makeAutoObservable(this);
    }

    updateSchoolYear(newYearEntry: string) {
        this.schoolYearShowing = newYearEntry;
    }

    updateShowPercentage() {
        this.showPercentage = !this.showPercentage;
    }

    updateCourseCategory(newCat: string) {
        this.courseCategory = newCat;
    }

    updateCourseLevel(newLevel: string) {
        this.courseLevel = newLevel;
    }

    setHoveredDistrict(districtName: string | null) {
        this.hoveredDistrict = districtName;
    }

    setSelectedDistricts(districts: string[]) {
        this.selectedDistricts = districts;
    }

    updateSelectedDistrict(districtName: string) {
        if (this.selectedDistricts.includes(districtName)) {
            this.selectedDistricts = this.selectedDistricts.filter(d => d !== districtName);
        } else {
            this.selectedDistricts.push(districtName);
        }
    }
}

const Store = createContext(new AppStore());
export default Store;