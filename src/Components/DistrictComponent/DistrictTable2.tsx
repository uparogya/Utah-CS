import { Table, TableHead, TableRow, TableBody, Checkbox } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useState, useEffect, useMemo } from "react";
import Store from "../../Interface/Store2";
import { DataContext } from "../../App2";
import { StickyTableContainer, TextCell, FunctionCell, SortableHeader, DataValue } from "../CellComponents/TableComponents2";

const DistrictTable: FC<{ categoryColor: string }> = observer(({ categoryColor }) => {
    const store = useContext(Store);
    const { leaPopData, schoolPopData, schoolCSData } = useContext(DataContext);
    const year = store.schoolYearShowing;
    const selectedCat = store.courseCategory;
    const selectedLevel = store.courseLevel;

    const [sortAttr, setSortAttr] = useState<'name' | 'total' | 'enroll'>('name');
    const [sortUp, setSortUp] = useState(true);

    const selectedIDs = [...store.selectedDistricts];

    const districts = useMemo(() => {
        const popRows = leaPopData[year] || [];
        const schPopRows = schoolPopData[year] || [];
        const csRows = schoolCSData[year] || [];

        return popRows
            .filter((row: any) => String(row[1] || '').toLowerCase().includes('district'))
            .map((row: any) => {
                const name = String(row[1]).trim();
                const ncesDistID = String(row[3]).trim(); 
                
                const totalStudents = schPopRows.reduce((acc: number, schRow: any) => {
                    const schDistNCES = String(schRow[8]).trim(); 
                    if (schDistNCES === ncesDistID) {
                        return acc + (Number(schRow[9]) || 0);
                    }
                    return acc;
                }, 0);

                const csStats = csRows.reduce((acc: any, csRow: any) => {
                    const rowDistNCES = String(csRow[6]).trim();
                    const rowCat = String(csRow[7]).trim();

                    let matches = false;
                    if (selectedCat === 'CS Total') {
                        matches = true;
                    } else if (selectedCat === 'CS Foundational') {
                        matches = (rowCat !== 'CS-Related');
                    } else if (selectedCat === 'Web/Software Development') {
                        matches = (rowCat === 'WebSoftDev');
                    } else {
                        matches = (rowCat.toLowerCase() === selectedCat.toLowerCase());
                    }

                    if (!matches || rowDistNCES !== ncesDistID) return acc;

                    if (selectedLevel !== 'Advanced') {
                        acc.total += Number(csRow[9]) || 0;
                        acc.girls += Number(csRow[10]) || 0;
                        acc.boys += Number(csRow[11]) || 0;
                    }
                    if (selectedLevel !== 'Basic') {
                        acc.total += Number(csRow[15]) || 0;
                        acc.girls += Number(csRow[16]) || 0;
                        acc.boys += Number(csRow[17]) || 0;
                    }
                    return acc;
                }, { total: 0, girls: 0, boys: 0 });

                return { 
                    name, 
                    id: ncesDistID, 
                    total: totalStudents, 
                    csEnrollment: csStats.total, 
                    csGirls: csStats.girls,
                    csBoys: csStats.boys,
                    pct: totalStudents > 0 ? csStats.total / totalStudents : 0 
                };
            });
    }, [leaPopData, schoolPopData, schoolCSData, year, selectedCat, selectedLevel]);

    useEffect(() => {
        if (districts.length > 0 && store.selectedDistricts.length === 0) {
            store.setSelectedDistricts(districts.map((d: any) => d.id));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    const sorted = [...districts].sort((a, b) => {
        let aV: any = a.name; let bV: any = b.name;
        if (sortAttr === 'total') { aV = a.total; bV = b.total; }
        else if (sortAttr === 'enroll') { aV = a.csEnrollment; bV = b.csEnrollment; }
        return sortUp ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1);
    });

    const handleSelectAll = () => {
        if (selectedIDs.length === districts.length) {
            store.setSelectedDistricts([]);
        } else {
            store.setSelectedDistricts(districts.map((d: any) => d.id));
        }
    };

    return (
        <StickyTableContainer>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <FunctionCell>
                            <Checkbox 
                                size="small"
                                color="primary"
                                indeterminate={selectedIDs.length > 0 && selectedIDs.length < districts.length}
                                checked={districts.length > 0 && selectedIDs.length === districts.length}
                                onChange={handleSelectAll}
                            />
                        </FunctionCell>
                        <SortableHeader 
                            headerName="District Name" 
                            isSorting={sortAttr === 'name'} 
                            isSortUp={sortUp} 
                            onClick={() => {setSortAttr('name'); setSortUp(!sortUp)}} 
                        />
                        <SortableHeader 
                            headerName="Total Students" 
                            isSorting={sortAttr === 'total'} 
                            isSortUp={sortUp} 
                            onClick={() => {setSortAttr('total'); setSortUp(!sortUp)}} 
                        />
                        <SortableHeader 
                            headerName={selectedCat === 'CS Total' ? 'Total CS' : selectedCat} 
                            isSorting={sortAttr === 'enroll'} 
                            isSortUp={sortUp} 
                            onClick={() => {setSortAttr('enroll'); setSortUp(!sortUp)}} 
                            additionalStyle={{ color: categoryColor }}
                        />
                        <TextCell style={{ fontWeight: 'bold', backgroundColor: '#f9f9f9', color: categoryColor }}>
                            CS Gender
                        </TextCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map(d => (
                        <TableRow key={d.id} hover>
                            <FunctionCell>
                                <Checkbox 
                                    size="small"
                                    color="primary"
                                    checked={selectedIDs.includes(d.id)} 
                                    onChange={() => store.updateSelectedDistrict(d.id)}
                                />
                            </FunctionCell>
                            <TextCell style={{ fontWeight: 500 }}>{d.name}</TextCell>
                            
                            <TextCell style={{ color: '#666' }}>
                                {d.total === 0 ? 'n<10' : d.total.toLocaleString()}
                            </TextCell>

                            <TextCell style={{ color: categoryColor, fontWeight: 'bold' }}>
                                <DataValue val={d.csEnrollment} pct={d.pct} showPercentage={store.showPercentage} />
                            </TextCell>
                            
                            <TextCell style={{ fontSize: '0.8rem', color: '#555', lineHeight: '1.4' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span><span style={{ fontWeight: 'bold' }}>Male:</span> <span style={{ color: '#1e88e5' }}>{d.csBoys === 0 ? 'n<10' : d.csBoys}</span></span>
                                    <span><span style={{ fontWeight: 'bold' }}>Female:</span> <span style={{ color: '#d81b60' }}>{d.csGirls === 0 ? 'n<10' : d.csGirls}</span></span>
                                </div>
                            </TextCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </StickyTableContainer>
    );
});

export default DistrictTable;