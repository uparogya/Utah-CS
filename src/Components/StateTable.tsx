import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import GenderRatioChart from "./CellComponents/GenderRatioChart";
import { csv } from 'd3-fetch';
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
import RaceChart from "./CellComponents/RaceChart";
import PercentageChart from "./CellComponents/PercentageChart";
import Store from "../Interface/Store";
import { format } from "d3-format";
import { EnrollmentDataContext } from "../App";



const StateTable: FC = () => {
    const store = useContext(Store);
    const SCHOOL_YEAR = '2021-22';
    //data variables

    const [stateDemographic, setStateDemographic] = useState([]);
    const [stateCSDemographic, setStateCSDemographic] = useState([]);
    const [csFemaleTotal, setCSFemaleTotal] = useState(0);

    const findCSDemographicAttribute = (attributeName: string) => {
        let returning = 0;
        if (stateCSDemographic.length) {
            const currentSelectedCate = store.selectedCategory;
            const currentYearEntry = stateCSDemographic.filter(d => d['School Year'] === SCHOOL_YEAR)[0];
            returning = currentSelectedCate.reduce((currentSum, currCate) => currentSum + parseInt(currentYearEntry[`${currCate} ${attributeName}`]) || 0, 0);
        }
        return returning;

    };

    const schoolEnrollmentData = useContext(EnrollmentDataContext);



    const [totalStudentNum, setTotalStudentNum] = useState(0);

    const [totalCSStudentNum, setTotalCSStudentNum] = useState(0);

    const findGeneralDemographicAttributeWithYear = (yearNum: string, attributeName: string) => {
        if (stateDemographic.length > 0) {
            return parseInt(stateDemographic.filter(d => d["School Year"] === yearNum)[0][attributeName]);
        }
        return 0;
    };

    //import data
    useEffect(() => {

        // state general demographic
        csv("/data/StateDemographicData.csv").then((stateDemo) => {
            stateUpdateWrapperUseJSON(stateDemographic, stateDemo, setStateDemographic);

        });

        // state CS demographic
        csv("/data/cs-state-level.csv").then((stateCSDemo) => {
            stateUpdateWrapperUseJSON(stateCSDemographic, stateCSDemo, setStateCSDemographic);
        });

        console.log(stateCSDemographic);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        setTotalStudentNum(findGeneralDemographicAttributeWithYear("2022", "Total HS"));
        setTotalCSStudentNum(findCSDemographicAttribute('Total'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateDemographic, stateCSDemographic]);


    useEffect(() => {
        setTotalCSStudentNum(findCSDemographicAttribute('Total'));

        setCSFemaleTotal(
            schoolEnrollmentData.reduce((sum, curSchool) => {
                let total = 0;
                store.selectedCategory.forEach((cat) => {
                    total += (parseInt(curSchool[`${cat} Female`]) || 0);
                });
                return sum + total;
            }, 0));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.selectedCategory, schoolEnrollmentData]);

    return (<TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Student Type</TableCell>
                    <TableCell ># of Students</TableCell>
                    <TableCell >Gender</TableCell>
                    <TableCell >Race</TableCell>
                    <TableCell >Disability</TableCell>
                    <TableCell >Econ Disadvantaged</TableCell>
                    <TableCell>ESL</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>


                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Total Student Population
                    </TableCell>
                    <TableCell> <PercentageChart
                        actualVal={totalStudentNum}
                        percentage={1} /></TableCell>
                    <TableCell>
                        <GenderRatioChart
                            maleNum={findGeneralDemographicAttributeWithYear("2022", "Male")}
                            femaleNum={findGeneralDemographicAttributeWithYear("2022", "Female")}
                        />
                    </TableCell>
                    <TableCell>
                        <RaceChart keyIdentity="State Total"
                            whiteNum={findGeneralDemographicAttributeWithYear("2022", "White")}
                            asianNum={findGeneralDemographicAttributeWithYear("2022", "Asian") + findGeneralDemographicAttributeWithYear("2022", "Pacific Islander")}
                            hispaNum={findGeneralDemographicAttributeWithYear("2022", "Hispanic")}
                            nativeNum={findGeneralDemographicAttributeWithYear("2022", "American Indian")}
                            otherNum={findGeneralDemographicAttributeWithYear("2022", "Multiple Race")}
                            otherTooltip={`Multiple Race: ${findGeneralDemographicAttributeWithYear("2022", "Multiple Race")}`}
                            blackNum={findGeneralDemographicAttributeWithYear("2022", "AfAm/Black")} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={findGeneralDemographicAttributeWithYear("2022", "Disability")}
                            percentage={findGeneralDemographicAttributeWithYear("2022", "Disability") / totalStudentNum} /> </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={findGeneralDemographicAttributeWithYear("2022", "Economically Disadvantaged")}
                            percentage={findGeneralDemographicAttributeWithYear("2022", "Economically Disadvantaged") / totalStudentNum} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={findGeneralDemographicAttributeWithYear("2022", "ESL")}
                            percentage={findGeneralDemographicAttributeWithYear("2022", "ESL") / totalStudentNum}
                        />
                    </TableCell>
                </TableRow>

                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Computer Science
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={totalCSStudentNum}
                            percentage={totalCSStudentNum / totalStudentNum}
                            tooltip={`${format(',.2%')(totalCSStudentNum / totalStudentNum)} out of all HS students`} /></TableCell>
                    <TableCell>
                        <GenderRatioChart
                            maleNum={totalCSStudentNum - csFemaleTotal}
                            femaleNum={csFemaleTotal} />
                    </TableCell>
                    <TableCell>
                        <RaceChart keyIdentity="CS"
                            whiteNum={findCSDemographicAttribute('White')}
                            blackNum={findCSDemographicAttribute('Black')}
                            hispaNum={findCSDemographicAttribute('Hispanic or Latino')}
                            nativeNum={findCSDemographicAttribute('American Indian or Alaska Native')}
                            otherNum={findCSDemographicAttribute('Two or more races')}
                            otherTooltip={`Multipl Race: ${findCSDemographicAttribute('Two or More Races')}')}`}
                            asianNum={findCSDemographicAttribute('Asian') + findCSDemographicAttribute('Native Hawaiian or Pacific Islander')} />

                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={findCSDemographicAttribute('Disability')}
                            percentage={findCSDemographicAttribute('Disability') / totalCSStudentNum} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={findCSDemographicAttribute('Eco. Dis.')}
                            percentage={findCSDemographicAttribute('Eco. Dis.') / totalCSStudentNum} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart actualVal={findCSDemographicAttribute('Eng. Learners')} percentage={findCSDemographicAttribute('Eng. Learners') / totalCSStudentNum} />
                    </TableCell>
                </TableRow>



            </TableBody>
        </Table>
    </TableContainer>);
};

export default observer(StateTable);
