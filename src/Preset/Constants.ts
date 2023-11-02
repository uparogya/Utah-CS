import { CourseCategoryColor, LightGray } from "../Preset/Colors";

export const CellSVGHeight = 40;
export const CellSVGWidth = 100;


export const PossibleCategories = [
    { name: 'Basic CS', key: 'BCS', shortName: 'Basic CS', color: CourseCategoryColor.BCS },
    { name: 'Advanced CS', key: 'ACS', shortName: 'Advanced CS', color: CourseCategoryColor.ACS },
    { name: 'Related CS', key: 'CSR', shortName: 'Related CS', color: CourseCategoryColor.CSR },
    { name: 'Core CS (Basic + Advanced)', key: 'CSC', shortName: 'Core CS', color: CourseCategoryColor.CSC },
    { name: 'All CS (Core + Related)', key: 'CS', shortName: 'All CS', color: CourseCategoryColor.CS }
];

// Add a cut off for smallest student category to be shown

export const RaceDictionary: { [key: string]: string; } = {
    white: 'White',
    black: 'Black',
    hispanic: 'Hispanic',
    native: 'Native American',
    other: 'Other/Multiple',
    asian: 'Asian',
    pacific: 'Pacific Islander'
};

export const GenderDictionary: { [key: string]: string; } = {
    male: 'Male',
    female: 'Female'
};

export const DefaultEnrollment = {
    BCS: { Total: 0, Female: 0 },
    ACS: { Total: 0, Female: 0 },
    CSR: { Total: 0, Female: 0 }
};

// Add new school year here, need to mat
export const PossibleSchoolYears = [
    '2019-20', '2020-21', '2021-22'
];

// The link to the data, probably need to change once the project is updated to the new domain name
export const linkToData = 'https://chxhana.github.io/Utah-CS/updated_data/all_data.xlsx';

export const linkToGeoJson = 'https://chxhana.github.io/Utah-CS/updated_data/Utah_School_District_Boundaries.geojson'

