import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import { sort, sum } from "d3-array";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { EnrollmentDataContext } from "../../App";
import { findAttribute } from "../../Interface/AttributeFinder";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import Store from "../../Interface/Store";
import { CourseCategoryColor } from "../../Preset/Colors";
import { DefaultEnrollment, PossibleCategories } from "../../Preset/Constants";
import SortableHeader from "../CellComponents/SortableHeader";
import { FunctionCell, StickyTableContainer } from "../GeneralComponents";
import DistrictRow from "./DistrictRow";



const DistrictTable: FC = () => {

    const store = useContext(Store);

    const [sortAttribute, setSortAttribute] = useState('District Name');
    const [sortCSPercentage, setSortPercentage] = useState(true);
    const [sortUp, setSortUp] = useState(true);
    const [titleEntry, setTitleEntry] = useState<string[]>([]);

    const districtAttributeFinder = (attributeName: string, selectedRow: (string | number)[]) =>
        findAttribute(attributeName, districtData, titleEntry, store.schoolYearShowing, selectedRow);


    const [districtData, setDistrictData] = useState<Array<number | string>[]>([]);
    const [sortedData, setSortedData] = useState(districtData);
    useEffect(() => {
        //read into LEA level
        fetch('/updated_data/all_data.xlsx',)
            .then(response => response.blob())
            .then(blob =>
                readXlsxFile(blob,
                    { sheet: `LEA-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
            .then((data) => {
                console.log(data.slice(2));
                setTitleEntry(data[1] as string[]);
                const charterRow = new Array(data[0].length).fill(0);
                charterRow[0] = 'Charter';
                const tempDistrictData: Array<number | string>[] = [];
                //organize the data and add a row for charter
                data.slice(2, -1).forEach((row) => {
                    if ((row[0] as string).includes('District')) {
                        tempDistrictData.push(row as Array<number | string>);
                    } else {
                        row.forEach((dataItem, i) => {
                            if (i > 2 && (typeof dataItem === 'number')) {
                                charterRow[i] += dataItem;
                            }
                        });
                    }
                });
                tempDistrictData.push(charterRow);
                stateUpdateWrapperUseJSON(districtData, tempDistrictData, setDistrictData);
                stateUpdateWrapperUseJSON(sortedData, tempDistrictData, setSortedData);
            });
    }, [store.schoolYearShowing]);

    useEffect(() => {
        let newSortedData = [...districtData];
        newSortedData.sort((a, b) => {
            if (sortAttribute === 'District Name') {
                return sortUp ? (a[0] as string).localeCompare((b[0] as string)) : (b[0] as string).localeCompare((a[0] as string));
            }

            let aTotal = +districtAttributeFinder(sortAttribute, a);
            let bTotal = +districtAttributeFinder(sortAttribute, b);
            console.log(aTotal, bTotal, sortAttribute);
            if (sortCSPercentage) {
                const aPercentage = aTotal / districtAttributeFinder('TOTAL: Total', a);
                const bPercentage = bTotal / districtAttributeFinder('TOTAL: Total', b);
                return sortUp ? aPercentage - bPercentage : bPercentage - aPercentage;
            }
            return sortUp ? aTotal - bTotal : bTotal - aTotal;
        });
        stateUpdateWrapperUseJSON(sortedData, newSortedData, setSortedData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtData, sortAttribute, sortUp]);

    const toggleSort = (inputName: string) => {
        // if the sort attribute is already the same
        if (sortAttribute === inputName) {
            // if sort attribute is enrollment
            if (sortAttribute === 'District Name' || sortAttribute === 'TOTAL: Total') {
                if (sortUp) setSortUp(false);
                else resetSort();

            } else {
                if (!sortCSPercentage && !sortUp) {
                    setSortPercentage(true);
                    setSortUp(true);
                } else if (!sortUp && sortCSPercentage) {
                    resetSort();
                } else {
                    setSortUp(false);
                }
            }
        } else {
            resetSort();
            setSortAttribute(inputName);
        }
    };

    const resetSort = () => {
        setSortUp(true);
        setSortPercentage(false);
        setSortAttribute('District Name');
    };

    return (
        <StickyTableContainer>
            <Table stickyHeader sx={{ minWidth: '50vw' }} aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <FunctionCell />
                        <SortableHeader
                            onClick={() => toggleSort('District Name')}
                            headerName='District Name'
                            isSorting={sortAttribute === 'District Name' && !sortUp}
                            isSortUp={sortUp} />
                        <SortableHeader
                            onClick={() => toggleSort('TOTAL: Total')}
                            isSortUp={sortUp}
                            headerName='Total Students'
                            isSorting={sortAttribute === 'TOTAL: Total'} />

                        <SortableHeader
                            additionalStyle={{
                                textDecorationLine: 'underline',
                                textDecorationColor: CourseCategoryColor[store.currentShownCSType]
                            }}
                            isSorting={sortAttribute === `${store.currentShownCSType}: Total`}
                            onClick={() => toggleSort(`${store.currentShownCSType}: Total`)}
                            isSortUp={sortUp}
                            headerName={`${store.currentShownCSType} Enrollment`}
                            isSortPercentage={sortCSPercentage} />
                        <SortableHeader
                            isSorting={sortAttribute === `${store.currentShownCSType}: Female`}
                            onClick={() => toggleSort(`${store.currentShownCSType}: Female`)}
                            isSortUp={sortUp}
                            isSortPercentage={sortCSPercentage}
                            headerName='Gender' />

                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((districtEntry) => {
                        return (
                            <DistrictRow
                                titleEntry={titleEntry}
                                districtEntry={districtEntry}
                                key={districtEntry[0]} />
                        );
                    })}
                </TableBody>
            </Table>
        </StickyTableContainer >
    );
};

export default observer(DistrictTable);
