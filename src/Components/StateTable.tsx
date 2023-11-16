import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import GenderRatioChart from "./CellComponents/GenderRatioChart";
import AttributeChart from "./CellComponents/AttributeChart";
import PercentageChart from "./CellComponents/PercentageChart";
import Store from "../Interface/Store";
import { format } from "d3-format";
import { findAttribute } from "../Interface/AttributeFinder";
import AttributeDialog from "./CellComponents/AttributeDialog";
import styled from "@emotion/styled";
import { DataContext } from "../App";
import { PossibleCategories } from "../Preset/Constants";
import { CourseCategoryColor, LightGray } from "../Preset/Colors";



const StateTable: FC = () => {
    const store = useContext(Store);

    const stateData = useContext(DataContext).state;

    const stateAttributeFinder = useCallback((attributeName: string) =>
        findAttribute(attributeName, stateData[1], stateData.filter(row => row[0] === store.schoolYearShowing)[0])
        , [store.schoolYearShowing, stateData]);

    const [openRaceDialog, setOpenRaceDialog] = useState(false);

    const [openGenderDialog, setOpenGenderDialog] = useState(false);

    const [totalStudentNum, setTotalStudentNum] = useState(0);

    const [totalCSStudentNum, setTotalCSStudentNum] = useState(0);
    

    useEffect(() => {

        setTotalStudentNum(stateAttributeFinder('TOTAL: Total'));
        setTotalCSStudentNum(stateAttributeFinder(`${store.currentShownCSType}: Total`));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateData, store.currentShownCSType, store.schoolYearShowing]);


    return (<TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Student Type</TableCell>
                    <TableCell>{store.showPercentage ? "%" : "#"} of Students</TableCell>
                    <TableCell >
                        {/* <GenderHeaderSVG > */}
                        Gender
                        {/* </GenderHeaderSVG> */}
                    </TableCell>
                    <TableCell>Race</TableCell>
                    <TableCell>Econ Disadvantaged</TableCell>
                    <TableCell >Disability</TableCell>
                    <TableCell>ESL</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <StateTableCell component="th" scope="row">
                        Statewide Student Population
                    </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={totalStudentNum}
                            percentage={1} />
                    </StateTableCell>
                    <StateTableCell onClick={() => setOpenGenderDialog(true)}>
                        <AttributeChart option='gender' keyIdentity="State Total"
                            outputObj={{
                                female: stateAttributeFinder('TOTAL: Female'),
                                male: stateAttributeFinder('TOTAL: Male')
                            }} />
                    </StateTableCell>
                    <StateTableCell onClick={() => setOpenRaceDialog(true)}>
                        <AttributeChart option='race' keyIdentity="State Total"
                            outputObj={{
                                white: stateAttributeFinder('TOTAL: White'),
                                hispanic: stateAttributeFinder('TOTAL: Hispanic or Latino'),
                                asian: stateAttributeFinder('TOTAL: Asian'),
                                black: stateAttributeFinder('TOTAL: Black or African American'),
                                native: stateAttributeFinder("TOTAL: American Indian or Alaska Native"),
                                other: stateAttributeFinder('TOTAL: Two or more races'),
                                pacific: stateAttributeFinder('TOTAL: Native Hawaiian or Pacific Islander')
                            }} />
                    </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder('TOTAL: Eco. Dis.')}
                            percentage={stateAttributeFinder('TOTAL: Eco. Dis.') / totalStudentNum} /> </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder('TOTAL: Disability')}
                            percentage={stateAttributeFinder('TOTAL: Disability') / totalStudentNum} />
                    </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder('TOTAL: Eng. Learners')}
                            percentage={stateAttributeFinder('TOTAL: Eng. Learners') / totalStudentNum}
                        />
                    </StateTableCell>
                </TableRow>

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <StateTableCell component="th"
                        scope="row"
                        style={{ color: CourseCategoryColor[store.currentShownCSType] }}
                    >
                        Utah Students in {PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName} Courses
                    </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={totalCSStudentNum}
                            percentage={totalCSStudentNum / totalStudentNum}
                            tooltip={`${format(',.1%')(totalCSStudentNum / totalStudentNum)} out of all HS students`} /></StateTableCell>
                    <StateTableCell onClick={() => setOpenGenderDialog(true)}>
                        <AttributeChart option='gender' keyIdentity="CS"
                            outputObj={{
                                female: stateAttributeFinder(`${store.currentShownCSType}: Female`),
                                male: stateAttributeFinder(`${store.currentShownCSType}: Male`)
                            }} />
                    </StateTableCell>
                    <StateTableCell onClick={() => setOpenRaceDialog(true)}>
                        <AttributeChart option='race' keyIdentity="CS"
                            outputObj={{
                                white: stateAttributeFinder(`${store.currentShownCSType}: White`),
                                hispanic: stateAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`),
                                asian: stateAttributeFinder(`${store.currentShownCSType}: Asian`),
                                black: stateAttributeFinder(`${store.currentShownCSType}: Black or African American`),
                                native: stateAttributeFinder(`${store.currentShownCSType}: American Indian or Alaska Native`),
                                other: stateAttributeFinder(`${store.currentShownCSType}: Two or more races`),
                                pacific: stateAttributeFinder(`${store.currentShownCSType}: Native Hawaiian or Pacific Islander`),
                            }}
                        />
                    </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)}
                            percentage={stateAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) / totalCSStudentNum} /> </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder(`${store.currentShownCSType}: Disability`)}
                            percentage={stateAttributeFinder(`${store.currentShownCSType}: Disability`) / totalCSStudentNum} />
                    </StateTableCell>
                    <StateTableCell>
                        <PercentageChart
                            actualVal={stateAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)}
                            percentage={stateAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) / totalCSStudentNum}
                        />
                    </StateTableCell>
                </TableRow>
            </TableBody>
        </Table>
        <AttributeDialog option='Race' openDialog={openRaceDialog}
            setDialogVisibility={(bol: boolean) => setOpenRaceDialog(bol)}
            CSAttributeOutput={{
                white: stateAttributeFinder(`${store.currentShownCSType}: White`),
                hispanic: stateAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`),
                asian: stateAttributeFinder(`${store.currentShownCSType}: Asian`),
                black: stateAttributeFinder(`${store.currentShownCSType}: Black or African American`),
                native: stateAttributeFinder(`${store.currentShownCSType}: American Indian or Alaska Native`),
                pacific: stateAttributeFinder(`${store.currentShownCSType}: Native Hawaiian or Pacific Islander`), other: stateAttributeFinder(`${store.currentShownCSType}: Two or more races`),
            }}
            stateAttributeOutput={{
                white: stateAttributeFinder('TOTAL: White'),
                hispanic: stateAttributeFinder('TOTAL: Hispanic or Latino'),
                asian: stateAttributeFinder('TOTAL: Asian'),
                black: stateAttributeFinder('TOTAL: Black or African American'),
                native: stateAttributeFinder("TOTAL: American Indian or Alaska Native"),
                pacific: stateAttributeFinder('TOTAL: Native Hawaiian or Pacific Islander'),
                other: stateAttributeFinder('TOTAL: Two or more races')
            }} />
        <AttributeDialog option='Gender' openDialog={openGenderDialog}
            setDialogVisibility={(bol: boolean) => setOpenGenderDialog(bol)}
            CSAttributeOutput={{
                male: stateAttributeFinder(`${store.currentShownCSType}: Male`),
                female: stateAttributeFinder(`${store.currentShownCSType}: Female`)
            }}
            stateAttributeOutput={{
                male: stateAttributeFinder('TOTAL: Male'),
                female: stateAttributeFinder('TOTAL: Female')
            }} />
    </TableContainer>);
};

// const GenderHeaderSVG = styled.svg`
// width:0;
//     min-width:100%;
//     min-height:100%;
//     display: block;
// `;

export default observer(StateTable);

//export const BoldHeaderCell = styled(TableCell)({
//    fontWeight: 'bold'
//});

const StateTableCell = styled(TableCell)({
    paddingTop: '5px',
    paddingBottom: '5px'
});

