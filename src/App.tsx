import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { AppBar, Grid, IconButton, SwipeableDrawer, Toolbar, Typography } from '@mui/material';
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



export const EnrollmentDataContext = createContext<{ [key: string]: string; }[]>([]);
function App() {


    const [enrollment, setEnrollmentData] = useState([]);

    const store = useContext(Store);



    const iOS =
        typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const [drawerOpen, setDrawer] = useState(false);


    return (

        <>
            <SwipeableDrawer onClose={() => setDrawer(false)}
                onOpen={() => setDrawer(true)} disableBackdropTransition={!iOS} disableDiscovery={iOS} open={drawerOpen} >
                <Toolbox />

            </SwipeableDrawer>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <AppBarButton children={<MenuIcon />} onClick={() => setDrawer(!drawerOpen)} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Utah CS, {store.schoolYearShowing} Academic Year
                        </Typography>
                        {/* <Button color="inherit">Login</Button> */}
                        <AppBarButton onClick={() => store.updateShowPercentage()}
                            children={store.showPercentage ? <NumbersIcon /> : <PercentIcon />} />
                    </Toolbar>
                </AppBar>
                <Grid container spacing={1}>
                    <Grid item id="state-view" style={{ minWidth: '100vw', paddingBottom: '20px' }} xs={12}>
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
        </>
    );
}

export default observer(App);

const BasicGrid = styled(Grid)`
max-height: 58vh;
overflow: hidden;
padding:0px!important;
`;

const AppBarButton = styled(IconButton)({
    color: LightGray
});


const TableTitle = styled(Typography)({
    textAlign: 'start',
    paddingLeft: '12px!important'
});
