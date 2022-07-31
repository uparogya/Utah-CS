import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { CSStateStats, OverallStateStats } from "../Preset/StateNumber";
import GenderRatioChart from "./CellComponents/GenderRatioChart";
import { csv } from 'd3-fetch';
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
// import stateData from "";

type Props = {

};

const StateTable: FC<Props> = ({ }: Props) => {

    //data variables
    const [courseCategorization, setCourseCategorization] = useState([]);
    const [stateDemographic, setStateDemographic] = useState([]);

    //import data
    useEffect(() => {
        //category
        csv("/data/category.csv").then((categorization) => {
            stateUpdateWrapperUseJSON(courseCategorization, categorization, setCourseCategorization);
        });

        // state general demographic
        csv("/data/StateDemographicData.csv").then((stateDemo) => {
            stateUpdateWrapperUseJSON(stateDemographic, stateDemo, setStateDemographic);
        });

        // state CS demographic
        csv("/data/stateCSDemographic.csv").then((stateCSDemo) => {

        });

        //
    }, []);

    return (<TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Student Type</TableCell>
                    <TableCell ># of Students</TableCell>
                    <TableCell >Gender</TableCell>
                    <TableCell >Race</TableCell>
                    <TableCell >Disability</TableCell>
                    <TableCell >Economic</TableCell>
                    <TableCell>ESL</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>


                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        State Wise
                    </TableCell>
                    <TableCell>{OverallStateStats.totalStudent}</TableCell>
                    <TableCell>
                        <GenderRatioChart
                            maleNum={OverallStateStats.maleStudent}
                            femaleNum={OverallStateStats.femaleStudent} />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>

                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Computer Science
                    </TableCell>
                    <TableCell>{CSStateStats.totalStudent}</TableCell>
                    <TableCell>    <GenderRatioChart
                        maleNum={CSStateStats.maleStudent}
                        femaleNum={CSStateStats.femaleStudent} /></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>



            </TableBody>
        </Table>
    </TableContainer>);
};

export default observer(StateTable);