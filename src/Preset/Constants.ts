export const CellSVGHeight = 40;
export const CellSVGWidth = 100;


export const PossibleCategories = [
    { name: 'Basic CS', key: 'CSB', shortName: 'Basic CS' },
    { name: 'Advanced CS', key: 'CSA', shortName: 'Advanced CS' },
    { name: 'Related CS', key: 'CSR', shortName: 'Related CS' },
    { name: 'Core CS (Basic + Advanced)', key: 'CSC', shortName: 'Core CS' },
    { name: 'All CS (Core + Related)', key: 'CS', shortName: 'All CS' }
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
    CSB: { Total: 0, Female: 0 },
    CSA: { Total: 0, Female: 0 },
    CSR: { Total: 0, Female: 0 }
};

// Add new school year here, need to mat
export const PossibleSchoolYears = [
    '2019-20', '2020-21', '2021-22', '2022-23', '2023-24'
];

// The link to the data, probably need to change once the project is updated to the new domain name
// export const linkToData = 'https://chxhana.github.io/Utah-CS/updated_data/all_data.xlsx';
// export const linkToData = '/updated_data/all_data.xlsx';
// export const linkToData = '/updated_data/all_data_test.xlsx';
export const linkToData = '/updated_data/2024_02.xlsx';

// export const linkToGeoJson = 'https://chxhana.github.io/Utah-CS/updated_data/Utah_School_District_Boundaries.geojson'
export const linkToGeoJson = '/updated_data/Utah_School_District_Boundaries.geojson'

export const listOfCoursesWithDescriptionPDFs = [
    35020000037,37010000025,35020000042,35020000043,39010000001,35020000030,35020000032,35020000040,
    35020000008,35020000035,35010000040,35010000041,35020000003,35010000038,35020000021,32020000170,
    35020000009,35020000220,35020000007,35020000045,35020000046,35020000080,35020000090,35020000005,
    40060000001,35010000025,35020000048,35010000030,35010000036,35020000004,35020000006,38010000031,
    38030000040,35020000012,35020000060,35020000065,35020000067,35020000055
];