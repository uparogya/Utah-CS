import { createContext, useContext, useEffect, useState } from "react";
import { linkToData, PossibleSchoolYears } from "./Preset/Constants2";
import readXlsxFile from "read-excel-file";
import { observer } from 'mobx-react-lite';
import Store from './Interface/Store2';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import styled from '@emotion/styled';
import StateTable from "./Components/StateTable2";
import SettingBar from "./Components/SettingBar2";
// import TabsComponent from "./Components/TabsComponent/Tabs";
import DataLoadingModal from './Components/DataLoadingModal';

export const SectionTitle = styled(Typography)({
    color: '#2f1600',
    fontWeight: 600,
    marginLeft: '15px',
    marginTop: '20px',
    marginBottom: '20px',
});

type CourseDetails = [string, string, string, string]; // [Name, Type, Category, Level]

interface CourseDataStore {
    byCode: Record<string, CourseDetails>;      // Main Dictionary: "350..." -> ["Name", "Type", "Cat", "Lvl"]
    byType: Record<string, string[]>;           // Reverse: "CS" -> ["350...", "360..."]
    byCategory: Record<string, string[]>;       // Reverse: "Core CS" -> ["350...", "380..."]
    byLevel: Record<string, string[]>;          // Reverse: "Basic" -> ["350...", "390..."]
}

type SchoolPopStore = Record<string, any[]>;
type StatePopStore = Record<string, any[]>;
type StateCSStore = Record<string, any[]>;

interface DataContextType {
    courseData: CourseDataStore | null;
    schoolPopData: SchoolPopStore;
    statePopData: StatePopStore;
    stateCSData: StateCSStore;
}

export const DataContext = createContext<DataContextType>({
    courseData: null,
    schoolPopData: {},
    statePopData: {},
    stateCSData: {}
});

export const App = () => {

    const store = useContext(Store);
    console.log(store)

    const [courseData, setCourseData] = useState<CourseDataStore | null>(null);

    const initStore = () => {
        const initial: Record<string, any[]> = {};
        PossibleSchoolYears.forEach(year => initial[year] = []);
        return initial;
    };

    const [schoolPopData, setSchoolPopData] = useState<SchoolPopStore>(initStore);
    const [statePopData, setStatePopData] = useState<StatePopStore>(initStore);
    const [stateCSData, setStateCSData] = useState<StateCSStore>(initStore);

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

    }, []);

    // const [tabVal, setTabVal] = useState(1);

    // const tabChange = (event: ChangeEvent<{}>, newValue: number) => {
    //     setTabVal(newValue);
    // };

    console.log(statePopData)

    if (!courseData) return <DataLoadingModal/>;

    return (
        <DataContext.Provider
            value={{
                courseData: courseData,
                schoolPopData: schoolPopData,
                statePopData: statePopData,
                stateCSData
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
                                <StateTable />
                            </Grid>
                        </Grid>
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