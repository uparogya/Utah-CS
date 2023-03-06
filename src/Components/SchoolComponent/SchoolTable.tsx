import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { findAttribute } from "../../Interface/AttributeFinder";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import Store from "../../Interface/Store";
import { CourseCategoryColor } from "../../Preset/Colors";
import { linkToData } from "../../Preset/Constants";
import SortableHeader from "../CellComponents/SortableHeader";
import { StickyTableContainer } from "../GeneralComponents";
import SchoolRow from "./SchoolRow";


const SchoolTable: FC = () => {

    const [schoolData, setSchoolData] = useState<Array<number | string>[]>([]);
    const [schoolDataToShow, setSchoolDataToShow] = useState(schoolData);
    const [sortAttribute, setSortAttribute] = useState('School Name');
    const [sortUp, setSortUp] = useState(true);
    const [sortCSPercentage, setSortPercentage] = useState(true);
    const [titleEntry, setTitleEntry] = useState<string[]>([]);


    const store = useContext(Store);

    useEffect(() => {
        fetch(linkToData,)
            .then(response => response.blob())
            .then(blob =>
                readXlsxFile(blob,
                    { sheet: `School-Level Data SY ${store.schoolYearShowing.slice(0, 5)}20${store.schoolYearShowing.slice(5)}` }))
            .then((data) => {
                setTitleEntry(data[1] as string[]);
                stateUpdateWrapperUseJSON(schoolData, data.slice(2), setSchoolData);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.schoolYearShowing]);

    const schoolAttributeFinder = (attributeName: string, entry: (number | string)[]) => findAttribute(attributeName, titleEntry, entry);

    useEffect(() => {
        let newSortedSchool = [...schoolData];
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

        stateUpdateWrapperUseJSON(schoolData, newSortedSchool, setSchoolData);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortUp, sortAttribute, sortCSPercentage]);

    useEffect(() => {
        if (store.selectedDistricts.length > 0) {
            let filteredDistrict = schoolData
                .filter(d => store.selectedDistricts.includes(d[6] as string));
            if (store.selectedDistricts.includes('Charter')) {
                filteredDistrict = filteredDistrict.concat(schoolData.filter(d => !((d[6] as string).includes('District'))));
            }
            stateUpdateWrapperUseJSON(schoolDataToShow, filteredDistrict, setSchoolDataToShow);
        } else {
            stateUpdateWrapperUseJSON(schoolDataToShow, schoolData, setSchoolDataToShow);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.selectedDistricts, schoolData]);

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
        <Table stickyHeader sx={{ minWidth: '50vw' }} aria-label="sticky table">
            <TableHead>
                <TableRow>

                    <SortableHeader
                        headerName="School Name"
                        isSorting={sortAttribute === 'School Name' && !sortUp}
                        isSortUp={sortUp}
                        onClick={() => toggleSort('School Name')} />
                    <SortableHeader
                        onClick={() => toggleSort('TOTAL: Total')}
                        headerName='Total Students'
                        isSortUp={sortUp}
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
                </TableRow>
            </TableHead>
            <TableBody>
                {schoolDataToShow.map((schoolEntry) => <SchoolRow key={`${schoolEntry[3]} `} titleEntry={titleEntry} schoolEntry={schoolEntry} />)}
            </TableBody>
        </Table>
    </StickyTableContainer>;
};

export default observer(SchoolTable);


