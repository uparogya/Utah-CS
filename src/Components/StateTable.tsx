import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import GenderRatioChart from "./CellComponents/GenderRatioChart";
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
import RaceChart from "./CellComponents/RaceChart";
import PercentageChart from "./CellComponents/PercentageChart";
import Store from "../Interface/Store";
import { format } from "d3-format";
import readXlsxFile from "read-excel-file";
import { CourseCategoryColor } from "../Preset/Colors";
import { findAttribute } from "../Interface/AttributeFinder";



const StateTable: FC = () => {
    const store = useContext(Store);

    //data variables

    const [stateData, setStateData] = useState<Array<number | string>[]>([]);

    // const findAttribute = (attributeName: string, dataSet: Array<number | string> [],titleEntry:string[]) => {
    //     const selectedRow = stateData.filter(row => row[0] === store.schoolYearShowing)[0];
    //     return stateData.length ? ((selectedRow[stateData[1].indexOf(attributeName)]) as number) : 0;
    // };

    useEffect(() => {
        fetch('/updated_data/all_data.xlsx',).then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'State-Level Data By Year' }))
            .then(data => stateUpdateWrapperUseJSON(stateData, data as Array<number | string>[], setStateData));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // const stateAttributeFinder = (attributeName: string) => findAttribute(attributeName, stateData[1], stateData.filter(row => row[0] === store.schoolYearShowing)[0]);

    const stateAttributeFinder = useCallback((attributeName: string) =>
        findAttribute(attributeName, stateData[1], stateData.filter(row => row[0] === store.schoolYearShowing)[0])
        , [store.schoolYearShowing, stateData]);




    const [totalStudentNum, setTotalStudentNum] = useState(0);

    const [totalCSStudentNum, setTotalCSStudentNum] = useState(0);

    useEffect(() => {

        setTotalStudentNum(stateAttributeFinder('TOTAL: Total'));
        setTotalCSStudentNum(stateAttributeFinder(`${store.currentShownCSType}: Total`));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateData, store.currentShownCSType, store.schoolYearShowing]);


    return (<TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Student Type</TableCell>
                    <TableCell ># of Students</TableCell>
                    <TableCell >Sex</TableCell>
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
                            maleNum={stateAttributeFinder('TOTAL: Male')}
                            femaleNum={stateAttributeFinder('TOTAL: Female')}
                        />
                    </TableCell>
                    <TableCell>
                        <RaceChart keyIdentity="State Total"
                            whiteNum={stateAttributeFinder('TOTAL: White')}
                            asianNum={stateAttributeFinder('TOTAL: Asian') + stateAttributeFinder('TOTAL: Native Hawaiian or Pacific Islander')}
                            hispaNum={stateAttributeFinder('TOTAL: Hispanic or Latino')}
                            nativeNum={stateAttributeFinder("TOTAL: American Indian or Alaska Native")}
                            blackNum={stateAttributeFinder('TOTAL: Black or African American')}
                            otherNum={stateAttributeFinder('TOTAL: Two or more races')} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder('TOTAL: Disability')}
                            percentage={stateAttributeFinder('TOTAL: Disability') / totalStudentNum} /> </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder('TOTAL: Eco. Dis.')}
                            percentage={stateAttributeFinder('TOTAL: Eco. Dis.') / totalStudentNum} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder('TOTAL: Eng. Learners')}
                            percentage={stateAttributeFinder('TOTAL: Eng. Learners') / totalStudentNum}
                        />
                    </TableCell>
                </TableRow>

                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th"
                        scope="row"
                        style={{
                            textDecorationLine: 'underline',
                            textDecorationColor: CourseCategoryColor[store.currentShownCSType]
                        }}>
                        Computer Science ({store.currentShownCSType})
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={totalCSStudentNum}
                            percentage={totalCSStudentNum / totalStudentNum}
                            tooltip={`${format(',.2%')(totalCSStudentNum / totalStudentNum)} out of all HS students`} /></TableCell>
                    <TableCell>
                        <GenderRatioChart
                            maleNum={stateAttributeFinder(`${store.currentShownCSType}: Male`)}
                            femaleNum={stateAttributeFinder(`${store.currentShownCSType}: Female`)} />
                    </TableCell>
                    <TableCell>
                        <RaceChart keyIdentity="CS"
                            whiteNum={stateAttributeFinder(`${store.currentShownCSType}: White`)}
                            asianNum={stateAttributeFinder(`${store.currentShownCSType}: Asian`) + stateAttributeFinder(`${store.currentShownCSType}: Native Hawaiian or Pacific Islander`)}
                            hispaNum={stateAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`)}
                            nativeNum={stateAttributeFinder(`${store.currentShownCSType}: American Indian or Alaska Native`)}
                            blackNum={stateAttributeFinder(`${store.currentShownCSType}: Black or African American`)}
                            otherNum={stateAttributeFinder(`${store.currentShownCSType}: Two or more races`)}
                        />

                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder(`${store.currentShownCSType}: Disability`)}
                            percentage={stateAttributeFinder(`${store.currentShownCSType}: Disability`) / totalCSStudentNum} /> </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)}
                            percentage={stateAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) / totalCSStudentNum} />
                    </TableCell>
                    <TableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)}
                            percentage={stateAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) / totalCSStudentNum}
                        />
                    </TableCell>
                </TableRow>



            </TableBody>
        </Table>
    </TableContainer>);
};

export default observer(StateTable);
