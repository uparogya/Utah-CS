import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import { AppBar, Button, Container, Divider, Grid, IconButton, SwipeableDrawer, Toolbar, Typography } from '@mui/material';
import StateTable from './Components/StateTable';
import DistrictTable from './Components/DistrictComponent/DistrictTable';
import SchoolTable from './Components/SchoolComponent/SchoolTable';
import Toolbox from './Components/Toolbox';
import { csv } from 'd3-fetch';
import { stateUpdateWrapperUseJSON } from './Interface/StateChecker';
import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';


export const CategoryContext = createContext<{ [key: string]: string; }[]>([]);

function App() {
    const [courseCategorization, setCourseCategorization] = useState([]);

    const [enrollment, setEnrollmentData] = useState([]);

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
        <CategoryContext.Provider value={courseCategorization}>
            <SwipeableDrawer onClose={() => setDrawer(false)}
                onOpen={() => setDrawer(true)} disableBackdropTransition={!iOS} disableDiscovery={iOS} open={drawerOpen} >
                <Toolbox />

            </SwipeableDrawer>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={() => setDrawer(!drawerOpen)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Utah CS
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid item id="state-view" style={{ maxWidth: '100vw', paddingBottom: "24px" }} xs={12}>
                        <StateTable />
                    </Grid>
                    <Divider />


                    {/* <Grid item xs={2}>
                            <Toolbox />
                        </Grid> */}
                    <BasicGrid item xs={6}>
                        <DistrictTable />
                    </BasicGrid>
                    <BasicGrid item xs={6}>
                        <SchoolTable />
                    </BasicGrid>
                </Grid>
            </div>

        </CategoryContext.Provider >
    );
}

export default App;

const BasicGrid = styled(Grid)`
max-height: 50vh;
overflow: auto;
`;