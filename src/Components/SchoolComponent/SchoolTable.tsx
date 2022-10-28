import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from "@mui/material";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { EnrollmentDataContext } from "../../App";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import Store from "../../Interface/Store";
import { CSDemographic, Enrollment } from "../../Interface/Types";
import { DefaultEnrollment, PossibleCategories } from "../../Preset/Constants";
import SortableHeader from "../CellComponents/SortableHeader";
import { FunctionCell, StickyTableContainer, TextCell } from "../GeneralComponents";
import SchoolRow from "./SchoolRow";
type Props = {

};

const SchoolTable: FC<Props> = ({ }: Props) => {

    const [schoolDemographic, setSchoolDemographic] = useState<{ [key: string]: string | Enrollment; }[]>([]);
    const [schoolDataToShow, setSchoolDataToShow] = useState(schoolDemographic);
    const [sortAttribute, setSortAttribute] = useState('School Name');
    const [sortUp, setSortUp] = useState(true);
    const [sortCSPercentage, setSortPercentage] = useState(true);

    const enrollmentData = useContext(EnrollmentDataContext);
    const store = useContext(Store);
    useEffect(() => {
        // shool offering

        csv("/data/schoolDemo.csv").then((schoolDemo) => {
            const schoolDemoCopy = schoolDemo.map((schoolEntry) => {
                const totalHS = parseInt(schoolEntry['Grade_9'] || '0') + parseInt(schoolEntry['Grade_10'] || '0') + parseInt(schoolEntry['Grade_11'] || '0') + parseInt(schoolEntry['Grade_12'] || '0');
                const enrollmentEntry = enrollmentData.filter(d => d['School Name'] === schoolEntry['School Name']);
                if (schoolEntry['School Name'] === 'Renaissance Academy') console.log(schoolEntry);
                if (enrollmentEntry.length && (parseInt(enrollmentEntry[0]['Total HS']) || enrollmentEntry[0]['Total HS'] === 'n<10')) {

                    return {
                        ...schoolEntry,
                        'LEA Name': (schoolEntry['LEA Name'] || ''),
                        Female: `${parseInt(schoolEntry['Female'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                        Male: `${parseInt(schoolEntry['Male'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                        'Total Students': `${totalHS}`,
                        CSCourses: {
                            CSB: { Total: convertEntry(enrollmentEntry[0]['CSB Total']), Female: convertEntry(enrollmentEntry[0]['CSB Female']) },
                            CSA: { Total: convertEntry(enrollmentEntry[0]['CSA Total']), Female: convertEntry(enrollmentEntry[0]['CSA Female']) },
                            CSR: { Total: convertEntry(enrollmentEntry[0]['CSR Total']), Female: convertEntry(enrollmentEntry[0]['CSR Female']) }
                        } as Enrollment

                    };
                } else {
                    return {
                        ...schoolEntry,
                        'LEA Name': (schoolEntry['LEA Name'] || ''),
                        Female: `${parseInt(schoolEntry['Female'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                        Male: `${parseInt(schoolEntry['Male'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                        'Total Students': `${totalHS}`,
                        CSCourses: DefaultEnrollment
                    };
                }
            }).filter(d => parseInt(d['Total Students']) > 0);
            console.log(schoolDemoCopy);
            stateUpdateWrapperUseJSON(schoolDemographic, schoolDemoCopy, setSchoolDemographic);
        });
    }, [enrollmentData]);

    useEffect(() => {
        let newSchoolData = [...schoolDemographic];
        newSchoolData.sort((a, b) => {
            //sorting by numbers
            if (sortAttribute !== 'School Name') {
                if (sortAttribute === 'enrollment') {
                    const aTotal = PossibleCategories.reduce((sum, category) => sum + (parseInt(`${(a['CSCourses'] as Enrollment)[category.key].Total}`) || 0), 0);
                    const bTotal = PossibleCategories.reduce((sum, category) => sum + (parseInt(`${(b['CSCourses'] as Enrollment)[category.key].Total}`) || 0), 0);
                    if (sortCSPercentage) {
                        const aPercentage = aTotal / parseInt(a['Total Students'] as string);
                        const bPercentage = bTotal / parseInt(b['Total Students'] as string);
                        return sortUp ? aPercentage - bPercentage : bPercentage - aPercentage;
                    } return sortUp ? aTotal - bTotal : bTotal - aTotal;
                }
                else {
                    return sortUp ? parseInt(a[sortAttribute] as string) - parseInt(b[sortAttribute] as string) : parseInt(b[sortAttribute] as string) - parseInt(a[sortAttribute] as string);
                }
            }
            return sortUp ? (a[sortAttribute] as string).localeCompare((b[sortAttribute] as string)) : (b[sortAttribute] as string).localeCompare((a[sortAttribute] as string));
        });

        stateUpdateWrapperUseJSON(schoolDataToShow, newSchoolData, setSchoolDataToShow);

    }, [sortUp, sortAttribute, sortCSPercentage, schoolDemographic]);

    useEffect(() => {
        if (store.selectedDistricts.length > 0) {
            stateUpdateWrapperUseJSON(
                schoolDataToShow,
                schoolDemographic
                    .filter(d => store.selectedDistricts.includes((d['LEA Name'] as string))),
                setSchoolDataToShow
            );
        } else {
            stateUpdateWrapperUseJSON(schoolDataToShow, schoolDemographic, setSchoolDataToShow);
        }
    }, [store.selectedDistricts, schoolDemographic]);

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
        setSortAttribute('School Name');
    };


    return <StickyTableContainer>
        <Table stickyHeader sx={{ minWidth: '50vw' }} aria-label="sticky table">
            <TableHead>
                <TableRow>
                    <FunctionCell />
                    <SortableHeader headerName="School Name" isSorting={sortAttribute === 'School Name' && !sortUp} isSortUp={sortUp} onClick={() => toggleSort('School Name')} />
                    <SortableHeader onClick={() => toggleSort('Total Students')} headerName='Total Students' isSortUp={sortUp} isSorting={sortAttribute === 'Total Students'} />
                    <SortableHeader onClick={() => toggleSort('enrollment')} headerName='CS Enrollment' isSortUp={sortUp} isSortPercentage={sortCSPercentage} isSorting={sortAttribute === 'enrollment'} />
                </TableRow>
            </TableHead>
            <TableBody>
                {schoolDataToShow.map((schoolEntry) => <SchoolRow key={`${schoolEntry['School Name']} - ${schoolEntry['LEA Name']}`} schoolEntry={schoolEntry} />)}
            </TableBody>
        </Table>
    </StickyTableContainer>;
};

export default observer(SchoolTable);

const convertEntry = (input: string) => {
    if (input === 'n<10') {
        return 'n<10';
    }
    return parseInt(input) || 0;
};
