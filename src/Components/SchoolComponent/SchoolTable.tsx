import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { findAttribute } from "../../Interface/AttributeFinder";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import Store from "../../Interface/Store";
import SortableHeader from "../CellComponents/SortableHeader";
import { StickyTableContainer } from "../GeneralComponents";
import SchoolRow from "./SchoolRow";
import { DataContext } from "../../App";


const SchoolTable: FC = () => {

    const store = useContext(Store);
    const schoolData = useContext(DataContext).school;


    const [sortAttribute, setSortAttribute] = useState('School Name');
    const [sortUp, setSortUp] = useState(true);
    const [sortCSPercentage, setSortPercentage] = useState(true);

    const [schoolDataToShow, setSchoolDataToShow] = useState(schoolData);

    const schoolAttributeFinder = (attributeName: string, entry: (number | string)[]) => findAttribute(attributeName, schoolData[1], entry);

    useEffect(() => {
        let newSortedSchool = [...schoolData.slice(2)];
        newSortedSchool.sort((a, b) => {
            if (sortAttribute === 'School Name') {
                return sortUp ? (a[1] as string).localeCompare((b[1] as string)) : (b[1] as string).localeCompare((a[1] as string));
            }

            let aTotal = (schoolAttributeFinder(sortAttribute, a) as string | number === 'n<10' ? 0.1 : +schoolAttributeFinder(sortAttribute, a));
            let bTotal = (schoolAttributeFinder(sortAttribute, b) as string | number === 'n<10' ? 0.1 : +schoolAttributeFinder(sortAttribute, b));
            if (sortCSPercentage) {
                const aPercentage = aTotal / +schoolAttributeFinder('TOTAL: Total', a);
                const bPercentage = bTotal / +schoolAttributeFinder('TOTAL: Total', b);
                return sortUp ? aPercentage - bPercentage : bPercentage - aPercentage;
            }
            return sortUp ? aTotal - bTotal : bTotal - aTotal;
        });

        let filteredDistrict = newSortedSchool
            .filter(d => store.selectedDistricts.includes(d[6] as string));
        if (store.selectedDistricts.includes('Charter')) {
            filteredDistrict = filteredDistrict.concat(newSortedSchool.filter(d => !((d[6] as string).includes('District') || (d[6] as string).includes('Utah Schools for Deaf & Blind'))));
        }

        stateUpdateWrapperUseJSON(schoolDataToShow, filteredDistrict, setSchoolDataToShow);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortUp, sortAttribute, sortCSPercentage, store.selectedDistricts, schoolData]);


    const toggleSort = (inputName: string) => {
        // if the sort attribute is already the same
        if (sortAttribute === inputName) {
            // if sort attribute is enrollment
            if (sortAttribute === 'School Name' || sortAttribute === 'TOTAL: Total') {
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
        setSortAttribute('School Name');
    };


    return <StickyTableContainer>
        <Table stickyHeader aria-label="sticky table" style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
            <TableHead>
                <TableRow>

                    <SortableHeader
                        headerName="School Name"
                        isSorting={sortAttribute === 'School Name'}
                        isSortUp={sortUp}
                        onClick={() => toggleSort('School Name')} />
                    <SortableHeader
                        onClick={() => toggleSort('TOTAL: Total')}
                        headerName='Total Students'
                        isSortUp={sortUp}
                        isSorting={sortAttribute === 'TOTAL: Total'} />
                    <SortableHeader
                        isSorting={sortAttribute === `${store.currentShownCSType}: Total`}
                        onClick={() => toggleSort(`${store.currentShownCSType}: Total`)}
                        isSortUp={sortUp}
                        headerName={`${store.currentShownCSType} Enrollment`}
                        isSortPercentage={sortCSPercentage} />
                </TableRow>
            </TableHead>
            <TableBody>
                {schoolDataToShow.map((schoolEntry) => <SchoolRow key={`${schoolEntry[3]} `} titleEntry={schoolData[1] as string[]} schoolEntry={schoolEntry} />)}
            </TableBody>
        </Table>
    </StickyTableContainer>;
};

export default observer(SchoolTable);


