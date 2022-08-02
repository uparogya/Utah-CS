import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from "@mui/material";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
import Store from "../Interface/Store";
import { MediumGray } from "../Preset/Colors";
import GenderRatioChart from "./CellComponents/GenderRatioChart";
type Props = {

};

const DistrictTable: FC<Props> = ({ }: Props) => {

    const store = useContext(Store);
    const [districtDemographic, setDistrictDemographic] = useState([]);
    //import district data
    useEffect(() => {
        csv("/data/districtDemographic.csv").then((disDemo) => {

            stateUpdateWrapperUseJSON(districtDemographic, disDemo.filter(d => d["LEA TYPE"] === 'District'), setDistrictDemographic);
        });
    });

    return (<TableContainer component={Container}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Selected</TableCell>
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
                                <TableCell>
                                    <Checkbox checked={store.selectedDistricts.includes(districtEntry['LEA Name'])}
                                        onChange={() => store.setSelectedDistricts(districtEntry['LEA Name'])} />
                                </TableCell>
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
                                <TableCell></TableCell>
                                <TableCell style={{ color: MediumGray }}>{` -- CS`}</TableCell>
                                <TableCell> - </TableCell>
                                <TableCell> - </TableCell>
                            </TableRow>
                        </>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>);
};

export default observer(DistrictTable);