import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
import { MediumGray } from "../Preset/Colors";
import GenderRatioChart from "./CellComponents/GenderRatioChart";
type Props = {

};

const DistrictTable: FC<Props> = ({ }: Props) => {

    const [districtDemographic, setDistrictDemographic] = useState([]);
    //import district data
    useEffect(() => {
        csv("/data/districtDemographic.csv").then((disDemo) => {

            stateUpdateWrapperUseJSON(districtDemographic, disDemo.filter(d => d["LEA TYPE"] === 'District'), setDistrictDemographic);
            console.log(districtDemographic);
        });
    });

    return (<TableContainer component={Container}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Disctrict Name</TableCell>
                    <TableCell>Total Students</TableCell>
                    <TableCell>Gender</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {districtDemographic.map((districtEntry) => {
                    return (
                        <>
                            <TableRow>
                                <TableCell>{districtEntry['LEA Name']}</TableCell>
                                <TableCell>{districtEntry['Total HS']}</TableCell>
                                <TableCell>
                                    <GenderRatioChart
                                        femaleNum={parseInt(districtEntry['Female'])}
                                        maleNum={parseInt(districtEntry['Male'])}
                                        otherNum={0} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ color: MediumGray }}>{` -- CS`}</TableCell>
                            </TableRow>
                        </>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>);
};

export default observer(DistrictTable);