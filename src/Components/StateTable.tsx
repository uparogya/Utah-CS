import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import GenderRatioChart from "./CellComponents/GenderRatioChart";
import { csv } from 'd3-fetch';
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
import RaceChart from "./CellComponents/RaceChart";
import PercentageChart from "./CellComponents/PercentageChart";
import Store from "../Interface/Store";
import { format } from "d3-format";
import { CategoryContext } from "../App";
// import stateData from "";

type Props = {

};

const StateTable: FC<Props> = ({ }: Props) => {
    const courseCategorization = useContext(CategoryContext);
    const store = useContext(Store);
    //data variables

    const [stateDemographic, setStateDemographic] = useState([]);
    const [stateCSDemographic, setStateCSDemographic] = useState([]);

    const findCSDemographicAttribute = (attributeName: string) => {
        //category is the CS course category we need

        // first we gather the course list for the category
        // courseCategorization

        const courseList = courseCategorization.filter(d => store.selectedCategory.includes(d['category'])).map(d => d['core_code']);

        //use a reducer to find the sum
        return stateCSDemographic.reduce((prev, current) => courseList.includes(current['core_code']) ? prev + parseInt(current[attributeName]) : prev, 0);
    };


    // const [selectedCSCategory, setSelectedCSCategory] = useState(store.selectedCSCategory);

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
        csv("/data/stateCSDemographic.csv").then((stateCSDemo) => {
            stateUpdateWrapperUseJSON(stateCSDemographic, stateCSDemo, setStateCSDemographic);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        setTotalStudentNum(findGeneralDemographicAttributeWithYear("2022", "Total HS"));
        setTotalCSStudentNum(findCSDemographicAttribute('Enrolled'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateDemographic, stateCSDemographic]);


    useEffect(() => {
        setTotalCSStudentNum(findCSDemographicAttribute('Enrolled'));
    }, [store.selectedCategory]);




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
                        <RaceChart keyIdentity="State Wise"
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
                            maleNum={findCSDemographicAttribute('Male')}
                            femaleNum={findCSDemographicAttribute('Female')} />
                    </TableCell>
                    <TableCell>
                        <RaceChart keyIdentity="CS"
                            whiteNum={findCSDemographicAttribute('White')}
                            blackNum={findCSDemographicAttribute('Black')}
                            hispaNum={findCSDemographicAttribute('Hispanic/Latino/Latina')}
                            nativeNum={findCSDemographicAttribute('Native American/Alaska Native')}
                            otherNum={findCSDemographicAttribute('Two or More Races') + findCSDemographicAttribute('Race/Ethnicity not reported')}
                            otherTooltip={`Multipl Race: ${findCSDemographicAttribute('Two or More Races')}, Not Reported: ${findCSDemographicAttribute('Race/Ethnicity not reported')}`}
                            asianNum={findCSDemographicAttribute('Asian') + findCSDemographicAttribute('Native Hawaiian/Other Pacific Islander')} />

                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={findCSDemographicAttribute('SPED') + findCSDemographicAttribute('Serv504')}
                            percentage={(findCSDemographicAttribute('SPED') + findCSDemographicAttribute('Serv504')) / totalCSStudentNum} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={findCSDemographicAttribute('Economically Disadvantaged')}
                            percentage={findCSDemographicAttribute('Economically Disadvantaged') / totalCSStudentNum} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart actualVal={findCSDemographicAttribute('EL')} percentage={findCSDemographicAttribute('EL') / totalCSStudentNum} />
                    </TableCell>
                </TableRow>



            </TableBody>
        </Table>
    </TableContainer>);
};

export default observer(StateTable);