import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from "@mui/material";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { EnrollmentDataContext } from "../../App";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import Store from "../../Interface/Store";
import SortableHeader from "../CellComponents/SortableHeader";
import { FunctionCell, StickyTableContainer, TextCell } from "../GeneralComponents";
import SchoolRow from "./SchoolRow";
type Props = {

};

const SchoolTable: FC<Props> = ({ }: Props) => {

    const [schoolDemographic, setSchoolDemographic] = useState<{ [key: string]: string | any[]; }[]>([]);
    const [schoolDataToShow, setSchoolDataToShow] = useState(schoolDemographic);
    const [sortAttribute, setSortAttribute] = useState('School Name');
    const [sortUp, setSortUp] = useState(true);
    const [sortCSPercentage, setSortPercentage] = useState(true);

    const enrollmentData = useContext(EnrollmentDataContext);
    const store = useContext(Store);
    useEffect(() => {
        // shool offering
        csv("/data/schoolOffer.csv")
            .then((schoolCSOfferInput) => {
                csv("/data/schoolDemo.csv").then((schoolDemo) => {
                    const schoolDemoCopy = schoolDemo.filter(d => d['LEA TYPE'] === 'District').map((schoolEntry) => {
                        const totalHS = parseInt(schoolEntry['Grade_9'] || '0') + parseInt(schoolEntry['Grade_10'] || '0') + parseInt(schoolEntry['Grade_11'] || '0') + parseInt(schoolEntry['Grade_12'] || '0');

                        const csCourseOfferings = schoolCSOfferInput.filter(d => d['School Name'] === schoolEntry['School Name']);
                        let csCourseEnrollment: {
                            [key: string]: string;
                        }[] = [];
                        if (csCourseOfferings.length > 0) {
                            const schoolID = csCourseOfferings[0]['School ID'];
                            let findEnrollment = enrollmentData.filter((d) => d['school_id'] === schoolID);
                            // console.log(findEnrollment);
                            csCourseEnrollment = csCourseOfferings.map((course) => {

                                // find enrollment data
                                const allsections = findEnrollment.filter((d) => d['core_code'] === course['Course ID']);

                                return { ...course, enrollment: `${allsections.reduce((a, b) => a + parseInt(b['Student enrollment']), 0)}` };
                            });
                        }

                        return {
                            ...schoolEntry,
                            'LEA Name': (schoolEntry['LEA Name'] || '').split(' ').slice(0, -1).join(' '),
                            Female: `${parseInt(schoolEntry['Female'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                            Male: `${parseInt(schoolEntry['Male'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                            'Total-HS': `${totalHS}`,
                            CSCourses: csCourseEnrollment
                        };

                    }).filter(d => parseInt(d['Total-HS']) > 0);
                    stateUpdateWrapperUseJSON(schoolDemographic, schoolDemoCopy, setSchoolDemographic);
                });
            });
    }, [enrollmentData]);

    useEffect(() => {
        let newSchoolData = [...schoolDemographic];
        newSchoolData.sort((a, b) => {
            //sorting by numbers
            if (sortAttribute !== 'School Name') {
                if (sortAttribute === 'enrollment') {
                    const aTotal = (a['CSCourses'] as any[]).reduce((sum, course) => sum + parseInt(course['enrollment']), 0);
                    const bTotal = (b['CSCourses'] as any[]).reduce((sum, course) => sum + parseInt(course['enrollment']), 0);
                    if (sortCSPercentage) {
                        const aPercentage = aTotal / parseInt(a['Total-HS'] as string);
                        const bPercentage = bTotal / parseInt(b['Total-HS'] as string);
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
                    <SortableHeader onClick={() => toggleSort('Total-HS')} headerName='Total Students' isSortUp={sortUp} isSorting={sortAttribute === 'Total-HS'} />
                    <SortableHeader onClick={() => toggleSort('enrollment')} headerName='CS Enrollment' isSortUp={sortUp} isSortPercentage={sortCSPercentage} isSorting={sortAttribute === 'enrollment'} />
                </TableRow>
            </TableHead>
            <TableBody>
                {schoolDataToShow.map((schoolEntry) => <SchoolRow key={(schoolEntry['School Name'] as string)} schoolEntry={schoolEntry} />)}
            </TableBody>
        </Table>
    </StickyTableContainer>;
};

export default observer(SchoolTable);