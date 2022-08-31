import styled from "@emotion/styled";
import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from "@mui/material";
import { sum } from "d3-array";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { CategoryContext, EnrollmentDataContext } from "../../App";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import SortableHeader from "../CellComponents/SortableHeader";
import { FunctionCell, StickyTableContainer, TextCell } from "../GeneralComponents";
import DistrictRow from "./DistrictRow";


const DistrictTable: FC = () => {

    const [sortAttribute, setSortAttribute] = useState('LEA Name');
    const [sortCSPercentage, setSortPercentage] = useState(true);
    const [sortUp, setSortUp] = useState(true);
    const enrollmentData = useContext(EnrollmentDataContext);

    const courseCategory = useContext(CategoryContext);



    const [districtDemographic, setDistrictDemographic] = useState([]);
    const [sortedData, setSortedData] = useState(districtDemographic);

    //import district data
    useEffect(() => {
        csv("/data/districtDemographic.csv").then((disDemo) => {
            const cleanedDistrictTable = disDemo.filter(d => d["LEA TYPE"] === 'District')
                .map((districtEntry) => {
                    const trimLEAName = (districtEntry['LEA Name'] || '').split(' ').slice(0, -1).join(' ');
                    const courseEnrollment = enrollmentData.filter(d => d['LEA'] === trimLEAName);
                    const newDistrictEnrollment: { [key: string]: number; } = { "CS-related": 0, "CS-advanced": 0, "CS-basic": 0 };
                    courseEnrollment.forEach((course) => {
                        const filterResult = courseCategory.filter(c => c['core_code'] === course['core_code']);
                        const categoryResult = (filterResult.length > 0 ? filterResult[0][`category`] : 'CS-related');
                        newDistrictEnrollment[categoryResult] += parseInt(course['Student enrollment']);
                    });
                    return {
                        ...districtEntry,
                        expandable: (courseEnrollment.length > 0).toString(),
                        enrollment: newDistrictEnrollment,
                        'LEA Name': trimLEAName
                    };
                }
                );
            stateUpdateWrapperUseJSON(districtDemographic, cleanedDistrictTable, setDistrictDemographic);
        });

    }, [courseCategory, enrollmentData]);

    useEffect(() => {
        let newSortedData = [...districtDemographic];
        newSortedData.sort((a, b) => {
            if (sortAttribute !== 'LEA Name') {
                if (sortAttribute === 'enrollment') {
                    const aTotal = sum(Object.values(a['enrollment']));
                    const bTotal = sum(Object.values(b['enrollment']));
                    if (sortCSPercentage) {
                        const aPercentage = aTotal / parseInt(a['Total HS'] as string);
                        const bPercentage = bTotal / parseInt(b['Total HS'] as string);
                        return sortUp ? aPercentage - bPercentage : bPercentage - aPercentage;
                    }
                    return sortUp ? aTotal - bTotal : bTotal - aTotal;
                } else {
                    return sortUp ? parseInt(a[sortAttribute] as string) - parseInt(b[sortAttribute] as string) : parseInt(b[sortAttribute] as string) - parseInt(a[sortAttribute] as string);
                }
            }
            return sortUp ? (a[sortAttribute] as string).localeCompare((b[sortAttribute] as string)) : (b[sortAttribute] as string).localeCompare((a[sortAttribute] as string));
        });
        stateUpdateWrapperUseJSON(sortedData, newSortedData, setSortedData);
    }, [districtDemographic, sortAttribute, sortUp]);

    const toggleSort = (inputName: string) => {
        // if the sort attribute is already the same
        if (sortAttribute === inputName) {
            // if sort attribute is enrollment
            if (sortAttribute === 'enrollment') {
                if (sortCSPercentage && !sortUp) {
                    setSortPercentage(false);
                    setSortUp(true);
                } else if (!sortUp && !sortCSPercentage) {
                    resetSort();
                } else {
                    setSortUp(false);
                }
            } else {
                if (sortUp) setSortUp(false);
                else resetSort();
            }
        } else {
            setSortUp(true);
            setSortPercentage(true);
            setSortAttribute(inputName);
        }
    };

    const resetSort = () => {
        setSortUp(true);
        setSortPercentage(true);
        setSortAttribute('LEA Name');
    };

    return (
        <StickyTableContainer>
            <Table stickyHeader sx={{ minWidth: '50vw' }} aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <FunctionCell />
                        <FunctionCell />
                        <SortableHeader onClick={() => toggleSort('LEA Name')} headerName='Disctrict Name' isSorting={sortAttribute === 'LEA Name' && !sortUp} isSortUp={sortUp} />
                        <SortableHeader onClick={() => toggleSort('Total HS')} isSortUp={sortUp} headerName='Total Students' isSorting={sortAttribute === 'Total HS'} />
                        {/* <SortableHeader onClick={() => toggleSort('Total Students')} isSortUp={sortUp} isSortPercentage={sortCSPercentage} /> */}
                        <SortableHeader isSorting={sortAttribute === 'enrollment'} onClick={() => toggleSort('enrollment')} isSortUp={sortUp} headerName='CS Enrollment' isSortPercentage={sortCSPercentage} />
                        {/* <TextCell>CS Enrollment</TextCell> */}
                        <TextCell>Gender</TextCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((districtEntry) => {
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
//  <SortableHeader headerName="School Name" isSorting={sortAttribute === 'School Name' && !sortUp} isSortUp={sortUp} onClick={() => toggleSort('School Name')} />