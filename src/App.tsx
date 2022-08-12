import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { AppBar, Divider, Grid, IconButton, SwipeableDrawer, Toolbar, Typography, useTheme } from '@mui/material';
import StateTable from './Components/StateTable';
import DistrictTable from './Components/DistrictComponent/DistrictTable';
import SchoolTable from './Components/SchoolComponent/SchoolTable';
import Toolbox from './Components/Toolbox';
import { csv } from 'd3-fetch';
import { stateUpdateWrapperUseJSON } from './Interface/StateChecker';
import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import PercentIcon from '@mui/icons-material/Percent';
import Store from './Interface/Store';
import NumbersIcon from '@mui/icons-material/Numbers';
import { observer } from 'mobx-react-lite';
import { LightGray } from './Preset/Colors';


export const CategoryContext = createContext<{ [key: string]: string; }[]>([]);

export const EnrollmentDataContext = createContext<{ [key: string]: string; }[]>([]);
function App() {
    const [courseCategorization, setCourseCategorization] = useState([]);

    const [enrollment, setEnrollmentData] = useState([]);

    const store = useContext(Store);

    useEffect(() => {
        //category
        csv("/data/category.csv").then((categorization) => {
            stateUpdateWrapperUseJSON(courseCategorization, categorization, setCourseCategorization);
        });

    }, []);

    useEffect(() => {

        // enrollment
        csv("/data/enrollment.csv").then((enrollmentData) => {
            const allCourseCode: string[] = courseCategorization.map((d) => d['core_code']);
            stateUpdateWrapperUseJSON(enrollment, enrollmentData.filter((d) => d.school_year === '2018' && allCourseCode.includes(d['core_code'] || '')), setEnrollmentData);

        });
    }, [courseCategorization]);

    const iOS =
        typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const [drawerOpen, setDrawer] = useState(false);


    return (
        <EnrollmentDataContext.Provider value={enrollment}>
            <CategoryContext.Provider value={courseCategorization}>
                <SwipeableDrawer onClose={() => setDrawer(false)}
                    onOpen={() => setDrawer(true)} disableBackdropTransition={!iOS} disableDiscovery={iOS} open={drawerOpen} >
                    <Toolbox />

                </SwipeableDrawer>
                <div className="App">
                    <AppBar position="static">
                        <Toolbar>
                            <AppBarButton children={<MenuIcon />} onClick={() => setDrawer(!drawerOpen)} />
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Utah CS
                            </Typography>
                            {/* <Button color="inherit">Login</Button> */}
                            <AppBarButton onClick={() => store.updateShowPercentage()}
                                children={store.showPercentage ? <NumbersIcon /> : <PercentIcon />} />
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={1}>
                        <Grid item id="state-view" style={{ maxWidth: '100vw', paddingBottom: "24px" }} xs={12}>
                            <StateTable />
                        </Grid>



                        {/* <Grid item xs={2}>
                            <Toolbox />
                        </Grid> */}
                        <BasicGrid item xs={6} >
                            <TableTitle color={'primary'} children='District Table' />

                            <DistrictTable />
                        </BasicGrid>
                        <BasicGrid item xs={6} >
                            <TableTitle color={'primary'} children='School Table' />
                            <SchoolTable />
                        </BasicGrid>
                    </Grid>
                </div>

            </CategoryContext.Provider >
        </EnrollmentDataContext.Provider>
    );
}

export default observer(App);

const BasicGrid = styled(Grid)`
max-height: 55vh;
overflow: hidden;
`;

const AppBarButton = styled(IconButton)({
    color: LightGray
});


const TableTitle = styled(Typography)({
    textAlign: 'start',
    paddingLeft: '5px'
});