import React from 'react';
import './App.css';
import { Container, Divider, Grid } from '@mui/material';
import StateTable from './Components/StateTable';
import DistrictTable from './Components/DistrictTable';
import SchoolTable from './Components/SchoolTable';

function App() {
    return (
        <div className="App">
            <Container id="state-view" style={{ maxWidth: '100vw', paddingTop: "24px", paddingBottom: "24px" }}>
                <StateTable />
            </Container>
            <Divider />
            <Container style={{ maxWidth: '100vw', paddingTop: "24px", paddingBottom: "24px" }}>
                <Grid container>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={6}>
                        <DistrictTable />
                    </Grid>
                    <Grid item xs={4}>
                        <SchoolTable />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default App;
