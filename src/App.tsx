import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { AppBar, Container, IconButton, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import StateTable from './Components/StateTable';
import DistrictTable from './Components/DistrictComponent/DistrictTable';
import SchoolTable from './Components/SchoolComponent/SchoolTable';
import styled from '@emotion/styled';
import Store from './Interface/Store';
import { observer } from 'mobx-react-lite';
import { LightGray } from './Preset/Colors';
import readXlsxFile from 'read-excel-file';
import { stateUpdateWrapperUseJSON } from './Interface/StateChecker';
import { PossibleSchoolYears, linkToData } from './Preset/Constants';
import CourseTable from './Components/CourseComponent/CourseTable';
import OverviewTab from './Components/OverviewTab';
import TrendContainer from './Components/TrendComponent/TrendContainer';
import SettingBar from './Components/SettingBar';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            style={{ minWidth: '100vw' }}
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

type DataObjByYear = { [key: string]: Array<number | string>[]; };


const makeDefaultObj = (sameArray?: Array<number | string>[]) => {
    const outputObj: DataObjByYear = {};
    PossibleSchoolYears.forEach((year) => {
        outputObj[year] = sameArray ? sameArray : [];
    });
    return outputObj;
};

// const defaultDataObj = PossibleSchoolYears.


export const DataContext = createContext<{ [key: string]: DataObjByYear; }>({
    state: makeDefaultObj(),
    district: makeDefaultObj(),
    course: makeDefaultObj(),
    school: makeDefaultObj(),
    courseList: makeDefaultObj()
});

function App() {



    const store = useContext(Store);

    const [tabVal, setTabVal] = useState(0);

    const tabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabVal(newValue);
    };


    const [stateData, setStateData] = useState<DataObjByYear>({});
    const [courseCategorization, setCourseCategorization] = useState<DataObjByYear>({});

    useEffect(() => {
        // fetch state data
        const stateOutput: DataObjByYear = {};
        PossibleSchoolYears.forEach((year) => {
            fetch(linkToData,).then(response => response.blob())
                .then(blob => readXlsxFile(blob, { sheet: 'State-Level Data By Year' }))
                .then(data => stateOutput[year] = data as Array<number | string>[]);
        });
        stateUpdateWrapperUseJSON(stateData, stateOutput, setStateData);

        fetch(linkToData,).then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'CS Courses' }))
            .then(data => {
                const cateList: any = { 'CS - Basic': 'CSB', 'CS - Advanced': 'CSA', 'CS - Related': 'CSR' };
                data = (data as Array<number | string>[]).map(d => Object.keys(cateList).includes(d[3] as any) ? ([d[0], d[2], cateList[d[3] as any]]) : ([]));
                data = data.filter(d => d.length > 0);
                // console.log(data);
                stateUpdateWrapperUseJSON(courseCategorization, makeDefaultObj(data as Array<number | string>[]), setCourseCategorization);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch school and district data

    const [schoolData, setSchoolData] = useState<DataObjByYear>({});
    const [districtData, setDistrictData] = useState<DataObjByYear>({});
    const [courseData, setCourseData] = useState<DataObjByYear>({});

    useEffect(() => {
        // school level
        const schoolOutput: DataObjByYear = {};
        const courseOutput: DataObjByYear = {};
        const leaOutput: DataObjByYear = {};

        PossibleSchoolYears.forEach((year) => {
            fetch(linkToData,)
                .then(response => response.blob())
                .then(blob =>
                    readXlsxFile(blob,
                        { sheet: `School-Level Data SY ${year.slice(0, 5)}20${year.slice(5)}` }))
                .then((data) => {
                    schoolOutput[year] = data as Array<number | string>[];
                });

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
                        if ((row[0] as string).includes('District')) {
                            tempDistrictData.push(row as Array<number | string>);
                        } else {
                            row.forEach((dataItem, i) => {
                                if (i > 2 && (typeof dataItem === 'number')) {
                                    charterRow[i] += dataItem;
                                }
                            });
                        }
                    });
                    tempDistrictData.push(charterRow);
                    store.setSelectedDistrict(tempDistrictData.map(d => d[0] as string));

                    leaOutput[year] = (districtTitleEntry.concat(tempDistrictData)) as Array<number | string>[];

                });

            // course level

            fetch(linkToData,)
                .then(response => response.blob())
                .then(blob => readXlsxFile(blob, { sheet: `Course-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
                .then((data) => {
                    courseOutput[year] = data as Array<number | string>[];

                });
        });
        stateUpdateWrapperUseJSON(schoolData, schoolOutput, setSchoolData);
        stateUpdateWrapperUseJSON(districtData, leaOutput, setDistrictData);
        stateUpdateWrapperUseJSON(courseData, courseOutput, setCourseData);
        // LEA level




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.schoolYearShowing]);


    // const iOS =
    //     typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    // const [drawerOpen, setDrawer] = useState(false);


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
                <AppBar position="static" style={{ maxHeight: '40px', minHeight: '40px', justifyContent: 'center' }}>
                    <Typography variant="h6" component="div" >
                        Utah High School Computer Science (CS) Dashboard
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
                </AppBar>
                <Grid container spacing={1} sx={{
                    '--Grid-borderWidth': '1px',
                    borderTop: 'var(--Grid-borderWidth) solid',
                    borderLeft: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                    '& > div': {
                        borderRight: 'var(--Grid-borderWidth) solid',
                        borderBottom: 'var(--Grid-borderWidth) solid',
                        borderColor: 'divider',
                    },
                }}>
                    <SettingBar />
                    <Grid id="state-view" style={{ minWidth: '100vw', paddingBottom: '5px' }} xs={12}>
                        <StateTable />
                    </Grid>
                    <Tabs value={tabVal} onChange={tabChange} style={{ minWidth: '100vw' }}>
                        <Tab label='Overview' />
                        <Tab label='District & School Table' />
                        <Tab label='Course Table' />
                        <Tab label='Trends' />
                    </Tabs>
                    <TabPanel value={tabVal} index={0}>
                        <OverviewTab />
                    </TabPanel>

                    <TabPanel value={tabVal} index={1}>
                        <Grid container>
                            <BasicGrid xs={6} >
                                <TableTitle color={'primary'} children='District List' />
                                <DistrictTable />
                            </BasicGrid>
                            <BasicGrid xs={6} >
                                <TableTitle color={'primary'} children='Schools in Selected Districts' />
                                <SchoolTable />
                            </BasicGrid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabVal} index={2}>
                        <Container>
                            {/* <TableTitle color={'primary'} children='Course List' /> */}
                            <CourseTable />
                        </Container>
                    </TabPanel>

                    <TabPanel value={tabVal} index={3}>
                        <TrendContainer />
                    </TabPanel>


                </Grid>

            </div>
        </DataContext.Provider>
    );
}

export default observer(App);
// max-height: 55vh;
const BasicGrid = styled(Grid)`

overflow: hidden;
`;

const AppBarButton = styled(IconButton)({
    color: LightGray
});


const TableTitle = styled(Typography)({
    textAlign: 'start',
    paddingLeft: '12px!important'
});

