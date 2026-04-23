import { ChangeEvent, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ColorPalette, linkToData, PossibleSchoolYears } from "./Preset/Constants2";
import readXlsxFile from "read-excel-file";
import { observer } from 'mobx-react-lite';
import Store from './Interface/Store2';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import styled from '@emotion/styled';
import StateTable from "./Components/StateTable2";
import SettingBar from "./Components/SettingBar2";
import DataLoadingModal from './Components/DataLoadingModal';
import TabsComponent from "./Components/TabsComponent/Tabs2";
import OverviewTab from "./Components/OverviewTab2";
import SchoolTable from "./Components/SchoolComponent/SchoolTable2";
import DistrictTable from "./Components/DistrictComponent/DistrictTable2";

export const SectionTitle = styled(Typography)({
    color: '#2f1600',
    fontWeight: 600,
    marginLeft: '15px',
    marginTop: '20px',
    marginBottom: '20px',
});

const placeholderStyle = {
    p: 4,
    bgcolor: '#f5f3f3',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px dashed #ccc',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.secondary'
};

type CourseDetails = [string, string, string, string]; // [Name, Type, Category, Level]

interface CourseDataStore {
    byCode: Record<string, CourseDetails>;      // Main Dictionary: "350..." -> ["Name", "Type", "Cat", "Lvl"]
    byType: Record<string, string[]>;           // Reverse: "CS" -> ["350...", "360..."]
    byCategory: Record<string, string[]>;       // Reverse: "Core CS" -> ["350...", "380..."]
    byLevel: Record<string, string[]>;          // Reverse: "Basic" -> ["350...", "390..."]
}

type StatePopStore = Record<string, any[]>;
type StateCSStore = Record<string, any[]>;
type TotalStateCSStore = Record<string, any[]>;
type SchoolPopStore = Record<string, any[]>;
type SchoolCSStore = Record<string, any[]>;
type TotalSchoolCSStore = Record<string, any[]>;
type LeaPopStore = Record<string, any[]>;
type TotalLeaCSStore = Record<string, any[]>;

interface DataContextType {
    courseData: CourseDataStore | null;
    statePopData: StatePopStore;
    stateCSData: StateCSStore;
    totalStateCSData: TotalStateCSStore;
    schoolPopData: SchoolPopStore;
    schoolCSData: SchoolCSStore;
    totalSchoolCSData: TotalSchoolCSStore;
    leaPopData: LeaPopStore;
    totalLeaCSData: TotalLeaCSStore;
}

export const DataContext = createContext<DataContextType>({
    courseData: null,
    statePopData: {},
    stateCSData: {},
    totalStateCSData: {},
    schoolPopData: {},
    schoolCSData: {},
    totalSchoolCSData: {},
    leaPopData: {},
    totalLeaCSData: {}
});

export const App = () => {

    const store = useContext(Store);
    // console.log(store)

    const [courseData, setCourseData] = useState<CourseDataStore | null>(null);

    const categoryColor = useMemo(() => {
        if (store.courseCategory === "CS Total") return ColorPalette[0];
        if (store.courseCategory === "CS Foundational") return ColorPalette[9];

        if (!courseData?.byCategory) return '#003789';
        const categories = Object.keys(courseData.byCategory).sort();
        const index = categories.indexOf(store.courseCategory);

        return index >= 0
            ? ColorPalette[(index + 2) % ColorPalette.length]
            : '#003789';
    }, [courseData, store.courseCategory]);

    const initStore = () => {
        const initial: Record<string, any[]> = {};
        PossibleSchoolYears.forEach(year => initial[year] = []);
        return initial;
    };

    const [schoolPopData, setSchoolPopData] = useState<SchoolPopStore>(initStore);
    const [schoolCSData, setSchoolCSData] = useState<SchoolCSStore>(initStore);
    const [totalSchoolCSData, setTotalSchoolCSData] = useState<TotalSchoolCSStore>(initStore);
    const [statePopData, setStatePopData] = useState<StatePopStore>(initStore);
    const [stateCSData, setStateCSData] = useState<StateCSStore>(initStore);
    const [totalStateCSData, setTotalStateCSData] = useState<TotalStateCSStore>(initStore);
    const [leaPopData, setLeaPopData] = useState<LeaPopStore>(initStore());
    const [totalLeaCSData, setTotalLeaCSData] = useState<TotalLeaCSStore>(initStore());

    useEffect(() => {

        // course data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'Course List' }))
            .then((rows: any[]) => {

                const store: CourseDataStore = {
                    byCode: {},
                    byType: {},
                    byCategory: {},
                    byLevel: {}
                };

                const addToGroup = (dict: Record<string, string[]>, key: string, code: string) => {
                    const safeKey = key ? key.trim() : 'Unknown';
                    if (!dict[safeKey]) dict[safeKey] = [];
                    dict[safeKey].push(code);
                };

                rows.forEach((row) => {
                    const rawCode = row[5];

                    if (!rawCode || String(rawCode).trim() === 'Course Code') return;

                    const code = String(rawCode).trim();
                    const name = String(row[1] || '').trim();
                    const type = String(row[2] || '').trim();
                    const category = String(row[3] || '').trim();
                    const level = String(row[4] || '').trim();

                    store.byCode[code] = [name, type, category, level];

                    addToGroup(store.byType, type, code);
                    addToGroup(store.byCategory, category, code);
                    addToGroup(store.byLevel, level, code);
                });

                setCourseData(store);
            })
            .catch(err => console.error("Error loading Excel:", err));

        // school pop data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'School Pop. Data' }))
            .then((rows: any[]) => {

                const dataByYear: SchoolPopStore = {};
                PossibleSchoolYears.forEach(year => dataByYear[year] = []);

                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;

                    if (dataByYear[year]) {
                        dataByYear[year].push(row);
                    }
                });

                setSchoolPopData(dataByYear);
            })
            .catch(err => console.error("Error loading School Pop:", err));

        // state pop data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'State Pop. Data' }))
            .then((rows: any[]) => {
                const dataByYear: StatePopStore = {};
                PossibleSchoolYears.forEach(year => dataByYear[year] = []);

                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;

                    if (dataByYear[year]) {
                        dataByYear[year].push(row);
                    }
                });
                setStatePopData(dataByYear);
            })
            .catch(err => console.error("Error loading State Pop:", err));

        // state cs data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'State CS Data' }))
            .then((rows: any[]) => {
                const dataByYear = initStore();
                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;

                    if (dataByYear[year]) {
                        dataByYear[year].push(row);
                    }
                });
                setStateCSData(dataByYear);
            })
            .catch(err => console.error("Error loading State CS Data:", err));

        // school cs data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'School CS Data' }))
            .then((rows: any[]) => {
                const dataByYear = initStore();
                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;

                    if (dataByYear[year]) {
                        dataByYear[year].push(row);
                    }
                });
                setSchoolCSData(dataByYear);
            })
            .catch(err => console.error("Error loading School CS Data:", err));

        // total school cs data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'Total School CS Data' }))
            .then((rows: any[]) => {
                const dataByYear = initStore();
                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;
                    if (dataByYear[year]) dataByYear[year].push(row);
                });
                setTotalSchoolCSData(dataByYear);
            })
            .catch(err => console.error("Error loading Total School CS Data:", err));

        // total state cs data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'Total State CS Data' }))
            .then((rows: any[]) => {
                const dataByYear = initStore();
                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;
                    if (dataByYear[year]) dataByYear[year].push(row);
                });
                setTotalStateCSData(dataByYear);
            })
            .catch(err => console.error("Error loading Total State CS Data:", err));

        // lea pop data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'LEA Pop. Data' }))
            .then((rows: any[]) => {
                const dataByYear = initStore();
                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;
                    if (dataByYear[year]) dataByYear[year].push(row);
                });
                setLeaPopData(dataByYear);
            })
            .catch(err => console.error("Error loading LEA Pop Data:", err));

        // total lea cs data
        fetch(linkToData)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'Total LEA CS Data' }))
            .then((rows: any[]) => {
                const dataByYear = initStore();
                rows.forEach((row) => {
                    const year = String(row[0]);
                    if (year === 'School Year') return;
                    if (dataByYear[year]) dataByYear[year].push(row);
                });
                setTotalLeaCSData(dataByYear);
            })
            .catch(err => console.error("Error loading Total LEA CS Data:", err));

    }, []);

    const [tabVal, setTabVal] = useState(0);

    const tabChange = (event: ChangeEvent<{}>, newValue: number) => {
        setTabVal(newValue);
    };

    console.log(statePopData)

    if (!courseData) return <DataLoadingModal />;

    return (
        <DataContext.Provider
            value={{
                courseData: courseData,
                schoolPopData: schoolPopData,
                schoolCSData: schoolCSData,
                totalSchoolCSData: totalSchoolCSData,
                statePopData: statePopData,
                stateCSData: stateCSData,
                totalStateCSData: totalStateCSData,
                leaPopData: leaPopData,
                totalLeaCSData: totalLeaCSData
            }}
        >
            <div className="App" style={{ overflow: 'hidden', minHeight: '100vh', backgroundColor: '#fafafa' }}>
                <Box
                    sx={{
                        padding: 3,
                        marginBottom: 3,
                        backgroundColor: '#003789',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ textAlign: 'center', color: '#ffffff', fontWeight: 700, letterSpacing: '0.02em' }}
                    >
                        Utah Computer Science Dashboard for Grades 9-12
                        <Box
                            component="span"
                            sx={{
                                backgroundColor: '#0c9400',
                                color: '#ffffff',
                                fontSize: '0.8rem',
                                fontWeight: 900,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                marginLeft: '20px'
                            }}
                        >
                            ⚠️ Dev Mode
                        </Box>
                    </Typography>
                </Box>

                <Box sx={{ maxWidth: '1400px', margin: '0 auto', px: 2 }}>

                    <Box
                        sx={{
                            margin: '0 0 24px 0',
                            padding: 3,
                            backgroundColor: '#e7f0ff',
                            borderRadius: '8px'
                        }}
                    >
                        <SectionTitle sx={{ mt: 0, ml: 0, mb: 2 }}>Dashboard Settings</SectionTitle>
                        <SettingBar />
                    </Box>

                    <Box
                        sx={{
                            margin: '0 0 24px 0',
                            padding: 3,
                            backgroundColor: '#f5f3f3',
                            borderRadius: '8px'
                        }}
                    >
                        <SectionTitle sx={{ mt: 0, ml: 0, mb: 2 }}>Student Population</SectionTitle>
                        <Grid container>
                            <Grid id="state-view" xs={12}>
                                <StateTable categoryColor={categoryColor} />
                            </Grid>
                        </Grid>
                    </Box>

                </Box>

                <Box sx={{ padding: 2 }}>
                    <TabsComponent
                        tabVal={tabVal}
                        tabChange={tabChange}
                        categoryColor={categoryColor}
                    />

                    <Box sx={{ mt: 3 }}>
                        {tabVal === 0 && <OverviewTab categoryColor={categoryColor} />}
                        {tabVal === 1 && (
                            <Grid container spacing={2} sx={{ p: 2 }}>
                                <Grid xs={12} md={6}>
                                    <div style={{
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        color: categoryColor,
                                        marginBottom: '10px',
                                        paddingLeft: '10px'
                                    }}>
                                        District List
                                    </div>
                                    <DistrictTable categoryColor={categoryColor} />
                                </Grid>

                                <Grid xs={12} md={6}>
                                    <div style={{
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        color: categoryColor,
                                        marginBottom: '10px',
                                        paddingLeft: '10px'
                                    }}>
                                        {store.hoveredDistrict
                                            ? `Schools in ${store.hoveredDistrict}`
                                            : "Schools in Selected District"}
                                    </div>
                                    <SchoolTable categoryColor={categoryColor} />
                                </Grid>
                            </Grid>
                        )}
                        {tabVal === 2 && <Box sx={placeholderStyle}>Trends Placeholder</Box>}
                    </Box>
                </Box>

            </div>
        </DataContext.Provider>
    );

    // return (
    //     <div style={{ padding: 20, fontFamily: 'monospace' }}>
    //         <h1>Data Dump</h1>

    //         <div style={{ marginBottom: 30, borderBottom: '2px solid black' }}>
    //             <h2>1. Grouped by TYPE</h2>
    //             {Object.entries(courseData.byType).map(([type, codes]) => (
    //                 <div key={type} style={{ marginBottom: 10 }}>
    //                     <h3 style={{ color: 'blue' }}>Type: {type} ({codes.length})</h3>
    //                     <div style={{ paddingLeft: 20 }}>
    //                         {codes.map(code => (
    //                             <div key={code}>
    //                                 {code} : {courseData.byCode[code][0]}
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>

    //         <div style={{ marginBottom: 30, borderBottom: '2px solid black' }}>
    //             <h2>2. Grouped by CATEGORY</h2>
    //             {Object.entries(courseData.byCategory).map(([cat, codes]) => (
    //                 <div key={cat} style={{ marginBottom: 10 }}>
    //                     <h3 style={{ color: 'green' }}>Category: {cat} ({codes.length})</h3>
    //                     <div style={{ paddingLeft: 20 }}>
    //                         {codes.map(code => (
    //                             <div key={code}>
    //                                 {code} : {courseData.byCode[code][0]}
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>

    //         <div style={{ marginBottom: 30, borderBottom: '2px solid black' }}>
    //             <h2>3. Grouped by LEVEL</h2>
    //             {Object.entries(courseData.byLevel).map(([lvl, codes]) => (
    //                 <div key={lvl} style={{ marginBottom: 10 }}>
    //                     <h3 style={{ color: 'red' }}>Level: {lvl} ({codes.length})</h3>
    //                     <div style={{ paddingLeft: 20 }}>
    //                         {codes.map(code => (
    //                             <div key={code}>
    //                                 {code} : {courseData.byCode[code][0]}
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>

    //         <div>
    //             <h2>4. Main Dictionary (Code : Data)</h2>
    //             <ul>
    //                 {Object.entries(courseData.byCode).map(([code, details]) => (
    //                     <li key={code}>
    //                         <strong>{code}</strong>: {JSON.stringify(details)}
    //                     </li>
    //                 ))}
    //             </ul>
    //         </div>
    //     </div>
    // );
}

export default observer(App);