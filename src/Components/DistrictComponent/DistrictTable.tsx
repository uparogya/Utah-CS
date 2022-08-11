import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from "@mui/material";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import Store from "../../Interface/Store";
import { MediumGray } from "../../Preset/Colors";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import DistrictRow from "./DistrictRow";


const DistrictTable: FC = () => {

    const [districtDemographic, setDistrictDemographic] = useState([]);
    //import district data
    useEffect(() => {
        csv("/data/districtDemographic.csv").then((disDemo) => {
            const cleanedDistrictTable = disDemo.filter(d => d["LEA TYPE"] === 'District')
                .map((d) => ({ ...d, 'LEA Name': (d['LEA Name'] || '').split(' ').slice(0, -1).join(' ') }));
            stateUpdateWrapperUseJSON(districtDemographic, cleanedDistrictTable, setDistrictDemographic);
        });
    });

    return (<TableContainer component={Container}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Disctrict Name</TableCell>
                    <TableCell>Total Students</TableCell>
                    <TableCell>CS Enrollment</TableCell>
                    <TableCell>Gender</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {districtDemographic.map((districtEntry) => {
                    return (
                        <DistrictRow districtEntry={districtEntry} key={districtEntry['LEA Name']} />
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>);
};

export default (DistrictTable);