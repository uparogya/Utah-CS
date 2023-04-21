import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { AppBar, Container, IconButton, SwipeableDrawer, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import StateTable from './Components/StateTable';
import DistrictTable from './Components/DistrictComponent/DistrictTable';
import SchoolTable from './Components/SchoolComponent/SchoolTable';
import Toolbox from './Components/Toolbox';
import styled from '@emotion/styled';
import SettingsIcon from '@mui/icons-material/Settings';
import PercentIcon from '@mui/icons-material/Percent';
import Store from './Interface/Store';
import NumbersIcon from '@mui/icons-material/Numbers';
import { observer } from 'mobx-react-lite';
import { LightGray } from './Preset/Colors';
import CSMenu from './Components/CSMenu';
import readXlsxFile from 'read-excel-file';
import { stateUpdateWrapperUseJSON } from './Interface/StateChecker';
import { linkToData } from './Preset/Constants';
import CourseTable from './Components/CourseComponent/CourseTable';
import OverviewTab from './Components/OverviewTab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AcademicYearMenu from './Components/AcademicYearMenu';

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

export const DataContext = createContext<{ [key: string]: Array<number | string>[]; }>({
    state: [],
    district: [],
    course: [],
    school: [],
    courseList: []
});

export const EnrollmentDataContext = createContext<{ [key: string]: string; }[]>([]);
function App() {

    const [CSMenuAnchorEl, setCSMenuAnchorEl] = useState<null | HTMLElement>(null);
    const handleCSMenuClose = () => {
        setCSMenuAnchorEl(null);
    };
    const handleCSTypeClick = (event: React.MouseEvent<HTMLElement>) => {
        setCSMenuAnchorEl(event.currentTarget);
    };

    const [yearMenuAnchorEl, setYearMenuAnchorEl] = useState<null | HTMLElement>(null);
    const handleYearMenuClose = () => {
        setYearMenuAnchorEl(null);
    };
    const handleYearTypeClick = (event: React.MouseEvent<HTMLElement>) => {
        setYearMenuAnchorEl(event.currentTarget);
    };

    const store = useContext(Store);

    const [tabVal, setTabVal] = useState(0);

    const tabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabVal(newValue);
    };


    const [stateData, setStateData] = useState<Array<number | string>[]>([]);
    const [courseCategorization, setCourseCategorization] = useState([]);

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
                stateUpdateWrapperUseJSON(districtData, districtTitleEntry.concat(tempDistrictData), setDistrictData);
            });

        // course level

        fetch(linkToData,)
            .then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: `Course-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
            .then((data) => {
                stateUpdateWrapperUseJSON(courseData, data, setCourseData);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.schoolYearShowing]);


    const iOS =
        typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const [drawerOpen, setDrawer] = useState(false);


    return (
        <DataContext.Provider
            value={{
                state: stateData,
                school: schoolData,
                district: districtData,
                course: courseData,
                courseList: courseCategorization
            }}>
            <SwipeableDrawer onClose={() => setDrawer(false)}
                onOpen={() => setDrawer(true)} disableBackdropTransition={!iOS} disableDiscovery={iOS} open={drawerOpen} >
                <Toolbox />
            </SwipeableDrawer>
            <div className="App" style={{ overflow: 'hidden' }}>
                <AppBar position="static">
                    {/* add dropdown to change academic year and course list  */}
                    <Toolbar>

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
                        {/* <Button color="inherit">Login</Button> */}
                        <AppBarButton onClick={() => store.updateShowPercentage()}
                            children={store.showPercentage ? <NumbersIcon /> : <PercentIcon />} />
                    </Toolbar>
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
                    <Grid id="state-view" style={{ minWidth: '100vw', paddingBottom: '5px' }} xs={12}>
                        <StateTable csClickHandler={handleCSTypeClick} />
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


                </Grid>
                <CSMenu anchorEl={CSMenuAnchorEl} handleClose={handleCSMenuClose} />
                <AcademicYearMenu anchorEl={yearMenuAnchorEl} handleClose={handleYearMenuClose} />
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

