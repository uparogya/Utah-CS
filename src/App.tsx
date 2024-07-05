import { ChangeEvent, createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import StateTable from './Components/StateTable';
import DistrictTable from './Components/DistrictComponent/DistrictTable';
import SchoolTable from './Components/SchoolComponent/SchoolTable';
import styled from '@emotion/styled';
import Store from './Interface/Store';
import { observer } from 'mobx-react-lite';
import readXlsxFile from 'read-excel-file';
import { stateUpdateWrapperUseJSON } from './Interface/StateChecker';
import { linkToData, PossibleCategories } from './Preset/Constants';
import CourseTable from './Components/CourseComponent/CourseTable';
import OverviewTab from './Components/OverviewTab';
import TrendContainer from './Components/TrendComponent/TrendContainer';
import SettingBar from './Components/SettingBar';
import DataLoadingModal from './Components/DataLoadingModal';
import CourseDefinitionTab from './Components/CourseDefinitionTab';
import { CourseCategoryColor, LightGray } from "./Preset/Colors";
import TabsComponent from './Components/TabsComponent/Tabs';
import Footer from './Components/Footer';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const SectionTitle = styled(Typography)({
    color: '#2f1600',
    fontWeight: 600,
    marginLeft: '20px',
    marginTop: '20px',
});

// Tabs styling source and inspiration: https://mui-treasury.com/styles/tabs/#Chrome (Chrome tabs)
const FolderTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: '#f5f3f3',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        zIndex: -1
    }
});

const FolderTab = styled(Tab)({
    textTransform: 'none',
    fontSize: '1rem',
   
    '&.selectedTab': {
        fontWeight: 'bold',
        color: 'black',
    },
    '&.unselectedTab': {
        fontWeight: 'bold',
        color: 'gray',
    },
});




function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            style={{ backgroundColor: '#f5f3f3' }}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

export const DataContext = createContext<{ [key: string]: Array<number | string>[]; }>({
    state: [],
    district: [],
    course: [],
    school: [],
    courseList: []
});

export const EnrollmentDataContext = createContext<{ [key: string]: string; }[]>([]);
function App() {

    const store = useContext(Store);

    const [tabVal, setTabVal] = useState(0);

    const tabChange = (event: ChangeEvent<{}>, newValue: number) => {
        setTabVal(newValue);
      };


    const [stateData, setStateData] = useState<Array<number | string>[]>([]);
    const [courseCategorization, setCourseCategorization] = useState([]);

    const currentCSTypeShortName = PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName;

    useEffect(() => {
        // fetch state data

        fetch(linkToData,).then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'State-Level Data By Year' }))
            .then(data => stateUpdateWrapperUseJSON(stateData, data as Array<number | string>[], setStateData));


        fetch(linkToData,).then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'CS Courses' }))
            .then(data => {
                const cateList: any = { 'CS - Basic': 'CSB', 'CS - Advanced': 'CSA', 'CS - Related': 'CSR' };
                data = (data as Array<number | string>[]).map(d => Object.keys(cateList).includes(d[3] as any) ? ([d[0], d[2], cateList[d[3] as any]]) : ([]));
                data = data.filter(d => d.length > 0);
                // console.log(data);
                stateUpdateWrapperUseJSON(courseCategorization, data, setCourseCategorization);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch school and district data

    const [schoolData, setSchoolData] = useState<Array<number | string>[]>([]);
    const [districtData, setDistrictData] = useState<Array<number | string>[]>([]);
    const [courseData, setCourseData] = useState<Array<number | string>[]>([]);


    useEffect(() => {
        // school level
        fetch(linkToData,)
            .then(response => response.blob())
            .then(blob =>
                readXlsxFile(blob,
                    { sheet: `School-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
            .then((data) => {
                stateUpdateWrapperUseJSON(schoolData, data, setSchoolData);
            });

        // LEA level

        fetch(linkToData,)
            .then(response => response.blob())
            .then(blob =>
                readXlsxFile(blob,
                    { sheet: `LEA-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
            .then((data) => {
                const districtTitleEntry = [data[1]];
                const charterRow = new Array(data[0].length).fill(0);
                charterRow[0] = 'Charter';
                const tempDistrictData: Array<number | string>[] = [];
                //organize the data and add a row for charter
                data.slice(2, -1).forEach((row) => {
                    if ((row[0] as string).includes('District') || ((row[0] as string).includes('Utah Schools for Deaf & Blind'))) {
                        tempDistrictData.push(row as Array<number | string>);
                    } else {
                        row.forEach((dataItem, i) => {
                            if (i > 2 && (typeof dataItem === 'number')) {
                                charterRow[i] += dataItem;
                            }
                        });
                    }
                });
                // console.log(tempDistrictData);
                tempDistrictData.push(charterRow);
                // store.setSelectedDistrict(tempDistrictData.map(d => d[0] as string));
                // console.log(store.selectedDistricts);
                if(store.selectedDistricts.length == 0){
                    store.setSelectedDistrict(tempDistrictData.map(d => d[0] as string));
                }else{
                    store.setSelectedDistrict(store.selectedDistricts);
                }
                stateUpdateWrapperUseJSON(districtData, districtTitleEntry.concat(tempDistrictData), setDistrictData);
            });

        // course level

        fetch(linkToData,)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: `Course-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
            .then((data) => {
                stateUpdateWrapperUseJSON(courseData, data, setCourseData);
                store.updateDataLoading(false);
            });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.schoolYearShowing]);



    return (
        <DataContext.Provider
            value={{
                state: stateData,
                school: schoolData,
                district: districtData,
                course: courseData,
                courseList: courseCategorization
            }}>
            {/* <SwipeableDrawer onClose={() => setDrawer(false)}
                onOpen={() => setDrawer(true)} disableBackdropTransition={!iOS} disableDiscovery={iOS} open={drawerOpen} >
                <Toolbox />
            </SwipeableDrawer> */}
            <div className="App" style={{ overflow: 'hidden' }}>
                <Box sx={{ padding: 2, marginBottom: 2, alignContent: 'center', backgroundColor: '#003789' }}>
                    <Typography variant="h5" component="div" sx={{ textAlign: 'center', color: '#ffffff', fontWeight: 700 }} >
                        Utah Computer Science Dashboard for Grades 9-12
                    </Typography>

                    {/* add dropdown to change academic year and course list  */}
                    {/* <Toolbar>
                        <AppBarButton children={<>
                            <SettingsIcon />
                            <span style={{ fontSize: '20px' }}>Settings</span>
                        </>} onClick={() => setDrawer(!drawerOpen)} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                            <span onClick={handleCSTypeClick} style={{ cursor: 'pointer' }}>
                                <u>Utah {store.currentShownCSType}</u>
                                <ArrowDropDownIcon fontSize='small' style={{ verticalAlign: 'text-bottom' }} />
                            </span>

                            <span onClick={handleYearTypeClick} style={{ cursor: 'pointer' }}>
                                <u>{store.schoolYearShowing}</u>
                                <ArrowDropDownIcon fontSize='small' style={{ verticalAlign: 'text-bottom' }} />
                            </span>
                            Academic Year

                        </Typography>
                        <AppBarButton onClick={() => store.updateShowPercentage()}
                            children={store.showPercentage ? <NumbersIcon /> : <PercentIcon />} />
                    </Toolbar> */}
                </Box>
                <Box sx={{ margin: 2, padding: 2, backgroundColor: '#e7f0ff' }}>
                    <SectionTitle>Dashboard Settings</SectionTitle>
                    <SettingBar />
                </Box>
                <Box sx={{ margin: 2, padding: 2, backgroundColor: '#f5f3f3' }}>
                    <SectionTitle>Student Population</SectionTitle>
                    <Grid container>
                        <Grid id="state-view" xs={12} style={{ padding: '2' }}>
                            <StateTable />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ padding: 2 }}>
                <TabsComponent tabVal={tabVal} tabChange={tabChange} />

                    <TabPanel value={tabVal} index={0}>
                        <OverviewTab />
                    </TabPanel>

                    <TabPanel value={tabVal} index={1}>
                        <Grid container>
                            <BasicGrid xs={6} >
                                <SectionTitle style={{ fontSize: '1.3rem', color: CourseCategoryColor[store.currentShownCSType] }}>District List</SectionTitle>
                                <DistrictTable />
                            </BasicGrid>
                            <BasicGrid xs={6} >
                                <SectionTitle style={{ fontSize: '1.3rem', color: CourseCategoryColor[store.currentShownCSType] }}>Schools in Selected Districts</SectionTitle>
                                <SchoolTable />
                            </BasicGrid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabVal} index={2}>
                        < Grid container>
                            <BasicGrid xs={12}>
                                <SectionTitle style={{ fontSize: '1.3rem', color: CourseCategoryColor[store.currentShownCSType] }} >{PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName} Statewide Enrollment Trends</SectionTitle>
                                <TrendContainer />
                            </BasicGrid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabVal} index={3}>
                        < Grid container>
                            <BasicGrid xs={12}>
                                <SectionTitle style={{ fontSize: '1.3rem', color: CourseCategoryColor[store.currentShownCSType] }} >Table of {PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName} Courses</SectionTitle>
                                <CourseTable />
                            </BasicGrid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabVal} index={4}>
                        < Grid container>
                            <CourseDefinitionTab />
                        </Grid>
                    </TabPanel>
                </Box>
                <Footer></Footer>
            </div>
            <DataLoadingModal />
        </DataContext.Provider>
    );
}

export default observer(App);
// max-height: 55vh;
const BasicGrid = styled(Grid)`

overflow: hidden;
`;



export const TableTitle = styled(Typography)({
    textAlign: 'start',
    paddingLeft: '12px!important'
});

