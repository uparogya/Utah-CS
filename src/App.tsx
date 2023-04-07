import { createContext, useContext, useState } from 'react';
import './App.css';
import { AppBar, Divider, IconButton, SwipeableDrawer, Toolbar, Typography } from '@mui/material';
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



    const iOS =
        typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const [drawerOpen, setDrawer] = useState(false);


    return (

        <>
            <SwipeableDrawer onClose={() => setDrawer(false)}
                onOpen={() => setDrawer(true)} disableBackdropTransition={!iOS} disableDiscovery={iOS} open={drawerOpen} >
                <Toolbox />

            </SwipeableDrawer>
            <div className="App" style={{ overflow: 'hidden' }}>
                <AppBar position="static">
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
                    <Grid id="state-view" style={{ minWidth: '100vw', paddingBottom: '20px' }} xs={12}>
                        <StateTable csClickHandler={handleClick} />
                    </Grid>



                    {/* <Grid item xs={2}>
                            <Toolbox />
                        </Grid> */}
                    <BasicGrid xs={6} >
                        <TableTitle color={'primary'} children='District Table' />

                        <DistrictTable />
                    </BasicGrid>
                    {/* <Divider orientation="vertical" flexItem variant="middle" /> */}
                    <BasicGrid xs={6} >
                        <TableTitle color={'primary'} children='School Table' />
                        <SchoolTable />
                    </BasicGrid>
                </Grid>
                <CSMenu anchorEl={CSMenuAnchorEl} handleClose={handleCSMenuClose} />
            </div>
        </>
    );
}

export default observer(App);

const BasicGrid = styled(Grid)`
max-height: 58vh;
overflow: hidden;
`;

const AppBarButton = styled(IconButton)({
    color: LightGray
});


const TableTitle = styled(Typography)({
    textAlign: 'start',
    paddingLeft: '12px!important'
});
