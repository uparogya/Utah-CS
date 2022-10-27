import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import { sum } from "d3-array";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { CategoryContext, EnrollmentDataContext } from "../../App";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import { Enrollment } from "../../Interface/Types";
import { DefaultEnrollment, PossibleCategories } from "../../Preset/Constants";
import SortableHeader from "../CellComponents/SortableHeader";
import { FunctionCell, StickyTableContainer } from "../GeneralComponents";
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
                    // console.log(districtEntry);
                    const schoolEnrollments = enrollmentData.filter(d => d['District Name'] === districtEntry['LEA Name']);


                    const newDistrictEnrollment: Enrollment = JSON.parse(JSON.stringify(DefaultEnrollment));

                    schoolEnrollments.forEach((school) => {
                        PossibleCategories.forEach(({ key }) => {
                            (newDistrictEnrollment[key].Total as number) += (parseInt(school[`${key} Total`]) || 0);
                            (newDistrictEnrollment[key].Female as number) += (parseInt(school[`${key} Female`]) || 0);
                        });
                    });
                    return {
                        ...districtEntry,
                        expandable: (schoolEnrollments.length > 0).toString(),
                        enrollment: newDistrictEnrollment,
                        'LEA Name': districtEntry['LEA Name']
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
                if (['enrollment', 'Female'].includes(sortAttribute)) {
                    let aTotal, bTotal;
                    if (typeof a[sortAttribute] === 'string') {
                        aTotal = parseInt(a[sortAttribute]);
                        bTotal = parseInt(b[sortAttribute]);
                    } else {
                        aTotal = sum(Object.values(a[sortAttribute]));
                        bTotal = sum(Object.values(b[sortAttribute]));
                    }
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
            if (sortAttribute === 'enrollment' || 'Female') {
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

                        <SortableHeader isSorting={sortAttribute === 'enrollment'} onClick={() => toggleSort('enrollment')} isSortUp={sortUp} headerName='CS Enrollment' isSortPercentage={sortCSPercentage} />
                        <SortableHeader isSorting={sortAttribute === 'Female'} onClick={() => toggleSort('Female')} isSortUp={sortUp} isSortPercentage={sortCSPercentage} headerName='Gender' />

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

export default observer(DistrictTable);
