import { Table, TableHead, TableRow, TableBody, Checkbox, FormControlLabel } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { findAttribute } from "../../Interface/AttributeFinder";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import Store from "../../Interface/Store";
import SortableHeader from "../CellComponents/SortableHeader";
import { FunctionCell, StickyTableContainer } from "../GeneralComponents";
import DistrictRow from "./DistrictRow";
import { DataContext } from "../../App";
import { CourseCategoryColor, LightGray } from "../../Preset/Colors";


const DistrictTable: FC = () => {



    const districtData = useContext(DataContext).district;

    const store = useContext(Store);

    const [sortAttribute, setSortAttribute] = useState('District Name');
    const [sortCSPercentage, setSortPercentage] = useState(true);
    const [sortUp, setSortUp] = useState(true);
    const [sortedData, setSortedData] = useState(districtData);

    const districtAttributeFinder = (attributeName: string, selectedRow: (string | number)[]) =>
        findAttribute(attributeName, districtData[0], selectedRow);

    useEffect(() => {
        let newSortedData = [...districtData.slice(1)];
        newSortedData.sort((a, b) => {
            if (sortAttribute === 'District Name') {
                return sortUp ? (a[0] as string).localeCompare((b[0] as string)) : (b[0] as string).localeCompare((a[0] as string));
            }

            let aTotal = (districtAttributeFinder(sortAttribute, a) as string | number === 'n<10' ? 0.00001 : +districtAttributeFinder(sortAttribute, a));
            let bTotal = (districtAttributeFinder(sortAttribute, b) as string | number === 'n<10' ? 0.00001 : +districtAttributeFinder(sortAttribute, b));
            if (sortCSPercentage) {
                let aPercentage, bPercentage;
                if (sortAttribute.includes('Female')) {
                    aPercentage = aTotal === 0.00001 ? aTotal : districtAttributeFinder(`${store.currentShownCSType}: Total`, a) ? aTotal / districtAttributeFinder(`${store.currentShownCSType}: Total`, a) : 0;
                    bPercentage = bTotal === 0.00001 ? bTotal : districtAttributeFinder(`${store.currentShownCSType}: Total`, b) ? bTotal / districtAttributeFinder(`${store.currentShownCSType}: Total`, b) : 0;
                    // return sortUp ? aPercentage - bPercentage : bPercentage - aPercentage;
                } else {
                    aPercentage = districtAttributeFinder('TOTAL: Total', a) ? aTotal / districtAttributeFinder('TOTAL: Total', a) : 0;
                    bPercentage = districtAttributeFinder('TOTAL: Total', a) ? bTotal / districtAttributeFinder('TOTAL: Total', b) : 0;
                }


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

    const onSelectAllClick = () => {
        if (store.selectedDistricts.length === sortedData.length) {
            store.setSelectedDistrict([]);
        } else {
            store.setSelectedDistrict(sortedData.map(d => d[0] as string));
        }
    };

    return (
        <StickyTableContainer>
            <Table style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <FunctionCell>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                    indeterminate={store.selectedDistricts.length > 0 && store.selectedDistricts.length < sortedData.length}
                                    checked={sortedData.length > 0 && store.selectedDistricts.length === sortedData.length}
                                    onChange={onSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all desserts',
                                    }}
                                />
                                }
                                label='All'
                                sx={{ marginLeft: '1px',
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '1em'
                                }}}/>
                        </FunctionCell>

                        <SortableHeader
                            onClick={() => toggleSort('District Name')}
                            headerName='District Name'
                            isSorting={sortAttribute === 'District Name'}
                            isSortUp={sortUp} />
                        <SortableHeader
                            onClick={() => toggleSort('TOTAL: Total')}
                            isSortUp={sortUp}
                            headerName='Total Students'
                            isSorting={sortAttribute === 'TOTAL: Total'} />

                        <SortableHeader
                            isSorting={sortAttribute === `${store.currentShownCSType}: Total`}
                            onClick={() => toggleSort(`${store.currentShownCSType}: Total`)}
                            isSortUp={sortUp}
                            headerName={`${store.currentShownCSType} Enrollment`}
                            isSortPercentage={sortCSPercentage}
                           
                             />
                        <SortableHeader
                            isSorting={sortAttribute === `${store.currentShownCSType}: Female`}
                            onClick={() => toggleSort(`${store.currentShownCSType}: Female`)}
                            isSortUp={sortUp}
                            isSortPercentage={sortCSPercentage}
                            headerName={`${store.currentShownCSType} Gender`} 
                            />

                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((districtEntry) => {
                        return (
                            <DistrictRow
                                titleEntry={districtData[0] as string[]}
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
