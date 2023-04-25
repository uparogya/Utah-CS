export const CellSVGHeight = 40;
export const CellSVGWidth = 100;


export const PossibleCategories = [
    { name: 'CS Basic', key: 'CSB' },
    { name: 'CS Advanced', key: 'CSA' },
    { name: 'CS Related', key: 'CSR' },
    { name: 'CS Core (CSB+CSA)', key: 'CSC' },
    { name: 'All CS', key: 'CS' }
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

export const DefaultEnrollment = {
    CSB: { Total: 0, Female: 0 },
    CSA: { Total: 0, Female: 0 },
    CSR: { Total: 0, Female: 0 }
};

// Add new school year here, need to mat
export const PossibleSchoolYears = [
    '2019-20', '2020-21', '2021-22',
];


export const linkToData = 'https://haihan-lin.github.io/Utah-CS/updated_data/all_data.xlsx';


