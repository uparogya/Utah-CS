import styled from "@emotion/styled";
import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from "@mui/material";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import { FunctionCell, StickyTableContainer, TextCell } from "../GeneralComponents";
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

    return (
        <StickyTableContainer>
            <Table stickyHeader sx={{ minWidth: '50vw' }} aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <FunctionCell />
                        <FunctionCell />
                        <TextCell>Disctrict Name</TextCell>
                        <TextCell>Total Students</TextCell>
                        <TextCell>CS Enrollment</TextCell>
                        <TextCell>Gender</TextCell>
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
        </StickyTableContainer >
    );
};

export default (DistrictTable);
