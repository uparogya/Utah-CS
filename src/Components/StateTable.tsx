import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
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
import { linkToData } from "../Preset/Constants";
import RaceDialog from "./CellComponents/RaceDialog";

type Prop = {
    csClickHandler: (event: React.MouseEvent<HTMLElement>) => void;
};


const StateTable: FC<Prop> = ({ csClickHandler }: Prop) => {
    const store = useContext(Store);

    //data variables

    const [stateData, setStateData] = useState<Array<number | string>[]>([]);


    useEffect(() => {
        fetch(linkToData,).then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'State-Level Data By Year' }))
            .then(data => stateUpdateWrapperUseJSON(stateData, data as Array<number | string>[], setStateData));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // const stateAttributeFinder = (attributeName: string) => findAttribute(attributeName, stateData[1], stateData.filter(row => row[0] === store.schoolYearShowing)[0]);

    const stateAttributeFinder = useCallback((attributeName: string) =>
        findAttribute(attributeName, stateData[1], stateData.filter(row => row[0] === store.schoolYearShowing)[0])
        , [store.schoolYearShowing, stateData]);

    const [openRaceDialog, setOpenRaceDialog] = useState(false);


    const [totalStudentNum, setTotalStudentNum] = useState(0);

    const [totalCSStudentNum, setTotalCSStudentNum] = useState(0);

    useEffect(() => {

        setTotalStudentNum(stateAttributeFinder('TOTAL: Total'));
        setTotalCSStudentNum(stateAttributeFinder(`${store.currentShownCSType}: Total`));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateData, store.currentShownCSType, store.schoolYearShowing]);


    return (<TableContainer  >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Student Type</TableCell>
                    <TableCell ># of Students</TableCell>
                    <TableCell >
                        {/* <GenderHeaderSVG > */}
                        <text>Gender</text>
                        {/* </GenderHeaderSVG> */}
                    </TableCell>
                    <TableCell >Race</TableCell>
                    <TableCell >Disability</TableCell>
                    <TableCell >Econ Disadvantaged</TableCell>
                    <TableCell>ESL</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                        Total 9-12 Student Population
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
                    <TableCell onClick={() => setOpenRaceDialog(true)}>
                        <RaceChart keyIdentity="State Total"
                            outputObj={{
                                white: stateAttributeFinder('TOTAL: White'),
                                hispanic: stateAttributeFinder('TOTAL: Hispanic or Latino'),
                                asian: stateAttributeFinder('TOTAL: Asian'),
                                black: stateAttributeFinder('TOTAL: Black or African American'),
                                native: stateAttributeFinder("TOTAL: American Indian or Alaska Native"),
                                other: stateAttributeFinder('TOTAL: Two or more races'),
                                pacific: stateAttributeFinder('TOTAL: Native Hawaiian or Pacific Islander')
                            }} />
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

                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th"
                        scope="row"
                        style={{
                            textDecorationLine: 'underline',
                            textDecorationColor: CourseCategoryColor[store.currentShownCSType]
                        }}>
                        <span onClick={csClickHandler} style={{ cursor: 'pointer' }}>
                            Computer Science ({store.currentShownCSType})
                        </span>
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
                    <TableCell onClick={() => setOpenRaceDialog(true)}>
                        <RaceChart keyIdentity="CS"
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
        <RaceDialog openDialog={openRaceDialog}
            setDialogVisibility={(bol: boolean) => setOpenRaceDialog(bol)}
            CSRaceOutput={{
                white: stateAttributeFinder(`${store.currentShownCSType}: White`),
                hispanic: stateAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`),
                asian: stateAttributeFinder(`${store.currentShownCSType}: Asian`),
                black: stateAttributeFinder(`${store.currentShownCSType}: Black or African American`),
                native: stateAttributeFinder(`${store.currentShownCSType}: American Indian or Alaska Native`),
                pacific: stateAttributeFinder(`${store.currentShownCSType}: Native Hawaiian or Pacific Islander`), other: stateAttributeFinder(`${store.currentShownCSType}: Two or more races`),
            }}
            stateRaceOutput={{
                white: stateAttributeFinder('TOTAL: White'),
                hispanic: stateAttributeFinder('TOTAL: Hispanic or Latino'),
                asian: stateAttributeFinder('TOTAL: Asian'),
                black: stateAttributeFinder('TOTAL: Black or African American'),
                native: stateAttributeFinder("TOTAL: American Indian or Alaska Native"),
                pacific: stateAttributeFinder('TOTAL: Native Hawaiian or Pacific Islander'),
                other: stateAttributeFinder('TOTAL: Two or more races')
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
