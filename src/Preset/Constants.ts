export const CellSVGHeight = 40;
export const CellSVGWidth = 100;



export const PossibleCategories = [
    { name: 'CS-basic', key: 'CSB' },
    { name: 'CS-advanced', key: 'CSA' },
    { name: 'CS-related', key: 'CSR' }
];

// Add a cut off for smallest student category to be shown

export const RaceDictionary: { [key: string]: string; } = {
    white: 'White',
    black: 'Black',
    hispanic: 'Hispanic',
    native: 'Native American',
    other: 'Other/Multiple Races',
    asian: 'Asian',
};

export type CSCategory = 'CS-related' | 'CS-advanced' | 'CS-basic';
