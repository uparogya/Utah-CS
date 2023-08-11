import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import { Table, TableBody, TableCell, TableHead } from "@mui/material";
import AllInfoRow from "./AllInfoRow";
import { StickyTableContainer, TextCell } from "../GeneralComponents";
import SortableHeader from "../CellComponents/SortableHeader";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import { findAttribute } from "../../Interface/AttributeFinder";


const CourseTable: FC = () => {

    const courseData = useContext(DataContext).course;

    const [sortUp, setSortUp] = useState(true);
    const [sortAttribute, setSortAttribute] = useState('Course Name');
    const [sortedData, setSortedData] = useState(courseData);
    const [sortPercentage, setSortPercentage] = useState(true);

    const courseAttributeFinder = (attributeName: string, selectedRow: (string | number)[]) =>
        findAttribute(attributeName, courseData[1], selectedRow);


    useEffect(() => {
        let newSortedData = [...courseData.slice(2, -1)];
        newSortedData.sort((a, b) => {
            if (sortAttribute === 'Course Name') {
                return sortUp ? (a[3] as string).localeCompare((b[3] as string)) : (b[3] as string).localeCompare((a[3] as string));
            }
            let aTotal = (courseAttributeFinder(sortAttribute, a) as string | number === 'n<10' ? 0.00001 : +courseAttributeFinder(sortAttribute, a));
            let bTotal = (courseAttributeFinder(sortAttribute, b) as string | number === 'n<10' ? 0.00001 : +courseAttributeFinder(sortAttribute, b));
            if (sortPercentage) {
                // let aPercentage, bPercentage;
                aTotal = aTotal / courseAttributeFinder('Total', a);
                bTotal = bTotal / courseAttributeFinder('Total', b);
            }

            return sortUp ? aTotal - bTotal : bTotal - aTotal;
        });
        stateUpdateWrapperUseJSON(sortedData, newSortedData, setSortedData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseData, sortAttribute, sortUp]);

    const toggleSort = (inputName: string) => {
        // if the sort attribute is already the same
        if (sortAttribute === inputName) {
            // if sort attribute is enrollment
            if (sortAttribute === 'Course Name' || sortAttribute === 'Total') {
                if (sortUp) setSortUp(false);
                else resetSort();

            } else {
                if (!sortPercentage && !sortUp) {
                    setSortPercentage(true);
                    setSortUp(true);
                } else if (!sortUp && sortPercentage) {
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
        setSortAttribute('Course Name');
    };

    return <StickyTableContainer>
        <Table stickyHeader aria-label="sticky table" style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
            <TableHead>
                <SortableHeader
                    headerName='Course Name'
                    onClick={() => toggleSort('Course Name')}
                    isSorting={sortAttribute === 'Course Name'}
                    isSortUp={sortUp} />
                <SortableHeader
                    headerName='Utah Students'
                    onClick={() => toggleSort('Total')}
                    isSorting={sortAttribute === 'Total'}
                    isSortUp={sortUp} />
                <SortableHeader
                    headerName='Gender'
                    isSortPercentage={sortPercentage}
                    onClick={() => toggleSort('Female')}
                    isSorting={sortAttribute === 'Female'}
                    isSortUp={sortUp} />
                <TextCell>
                    Race
                </TextCell>
                <SortableHeader
                    headerName='Disability'
                    onClick={() => toggleSort('Disability')}
                    isSorting={sortAttribute === 'Disability'}
                    isSortPercentage={sortPercentage}
                    isSortUp={sortUp} />
                <SortableHeader
                    headerName='Econ Disadvantaged'
                    onClick={() => toggleSort('Eco. Dis.')}
                    isSortPercentage={sortPercentage}
                    isSorting={sortAttribute === 'Eco. Dis.'}
                    isSortUp={sortUp} />
                <SortableHeader
                    headerName='ESL'
                    onClick={() => toggleSort('Eng. Learners')}
                    isSortPercentage={sortPercentage}
                    isSorting={sortAttribute === 'Eng. Learners'}
                    isSortUp={sortUp} />
            </TableHead>
            <TableBody>
                {sortedData.map((courseEntry) => {
                    return <AllInfoRow courseEntry={courseEntry} titleEntry={courseData[1] as string[]} />;
                })}

            </TableBody>

        </Table>


    </StickyTableContainer>;
};
export default observer(CourseTable);
