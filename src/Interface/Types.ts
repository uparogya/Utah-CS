export type CSDemographic = { Total: number | 'n<10', Female: number | 'n<10'; };

export type CSCategory = 'CS-related' | 'CS-advanced' | 'CS-basic';

export type Enrollment = {
    CSB: CSDemographic,
    CSA: CSDemographic,
    CSR: CSDemographic,
    [key: string]: CSDemographic,
};
