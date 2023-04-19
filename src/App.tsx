import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { AppBar, Divider, IconButton, SwipeableDrawer, Tab, Tabs, Toolbar, Typography } from '@mui/material';
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

export const DataContext = createContext<{ [key: string]: Array<number | string>[]; }>({ state: [], district: [], course: [], school: [] });

export const EnrollmentDataContext = createContext<{ [key: string]: string; }[]>([]);
function App() {

    const [CSMenuAnchorEl, setCSMenuAnchorEl] = useState<null | HTMLElement>(null);
    const handleCSMenuClose = () => {
        setCSMenuAnchorEl(null);
    };
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setCSMenuAnchorEl(event.currentTarget);
    };

    const store = useContext(Store);

    const [tabVal, setTabVal] = useState(0);

    const tabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabVal(newValue);
    };


    const [stateData, setStateData] = useState<Array<number | string>[]>([]);


    useEffect(() => {
        // fetch state data
        fetch(linkToData,).then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'State-Level Data By Year' }))
            .then(data => stateUpdateWrapperUseJSON(stateData, data as Array<number | string>[], setStateData));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch school and district data

    const [schoolData, setSchoolData] = useState<Array<number | string>[]>([]);

    useEffect(() => {
        fetch(linkToData,)
            .then(response => response.blob())
            .then(blob =>
                readXlsxFile(blob,
                    { sheet: `School-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
            .then((data) => {
                stateUpdateWrapperUseJSON(schoolData, data, setSchoolData);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.schoolYearShowing]);


    const iOS =
        typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const [drawerOpen, setDrawer] = useState(false);


    return (
        <DataContext.Provider value={{ state: stateData, school: schoolData }}>
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
                            Utah CS, {store.schoolYearShowing} Academic Year
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
                        <StateTable csClickHandler={handleClick} />
                    </Grid>
                    <Tabs value={tabVal} onChange={tabChange} style={{ minWidth: '100vw' }}>
                        <Tab label='Overview' />
                        <Tab label='District & School Table' />
                        <Tab label='Course Table' />
                        <Tab label='Trends' />
                    </Tabs>

                    <TabPanel value={tabVal} index={0}>
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


                </Grid>
                <CSMenu anchorEl={CSMenuAnchorEl} handleClose={handleCSMenuClose} />
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

