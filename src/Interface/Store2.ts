import { createContext } from "react";
import { makeAutoObservable } from "mobx";

export class AppStore {
    schoolYearShowing: string;
    showPercentage: boolean;
    courseCategory: string;
    courseLevel: string;

    constructor() {
        this.schoolYearShowing = '2024-25';
        this.showPercentage = false;
        this.courseCategory = 'Core CS';
        this.courseLevel = 'All';
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
}

const Store = createContext(new AppStore());
export default Store;