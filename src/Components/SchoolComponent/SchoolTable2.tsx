import { Table, TableHead, TableRow, TableBody, Typography, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useState } from "react";
import Store from "../../Interface/Store2";
import { DataContext } from "../../App2";
import { StickyTableContainer, TextCell, SortableHeader, DataValue } from "../CellComponents/TableComponents2";

const SchoolTable: FC<{ categoryColor: string }> = observer(({ categoryColor }) => {
    const store = useContext(Store);
    const { schoolPopData, schoolCSData } = useContext(DataContext);
    const year = store.schoolYearShowing;
    const selectedCat = store.courseCategory;
    const selectedLevel = store.courseLevel;

    const [sortAttr, setSortAttr] = useState<'name' | 'total' | 'enroll'>('name');
    const [sortUp, setSortUp] = useState(true);

    const selectedIDs = [...store.selectedDistricts];
    const popRows = schoolPopData[year] || [];
    const csRows = schoolCSData[year] || [];

    const filteredSchools = selectedIDs.length === 0 ? [] : popRows
        .filter((row: any) => selectedIDs.includes(String(row[8]).trim())) 
        .map((row: any) => {
            const name = String(row[1]).trim(); 
            const ncesID = String(row[3]).trim(); 
            const totalStudents = Number(row[9]) || 0; 

            const csStats = csRows.reduce((acc: any, csRow: any) => {
                const rowSchNCES = String(csRow[3]).trim(); 
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

                if (!matches || rowSchNCES !== ncesID) return acc;

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
                ncesID,
                total: totalStudents,
                csEnrollment: csStats.total, 
                csGirls: csStats.girls,
                csBoys: csStats.boys,
                pct: totalStudents > 0 ? csStats.total / totalStudents : 0 
            };
        });

    const sortedSchools = [...filteredSchools].sort((a, b) => {
        let aV: any = a.name; let bV: any = b.name;
        if (sortAttr === 'total') { aV = a.total; bV = b.total; }
        else if (sortAttr === 'enroll') { aV = a.csEnrollment; bV = b.csEnrollment; }
        return sortUp ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1);
    });

    if (selectedIDs.length === 0) {
        return (
            <Box sx={{ p: 10, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
                <Typography color="textSecondary">
                    Check one or more districts on the left to view the list of schools.
                </Typography>
            </Box>
        );
    }

    return (
        <StickyTableContainer>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <SortableHeader 
                            headerName={`School Name (${sortedSchools.length})`} 
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
                    {sortedSchools.map((s) => (
                        <TableRow key={s.ncesID} hover>
                            <TextCell>{s.name}</TextCell>
                            
                            <TextCell style={{ color: '#666' }}>
                                {s.total === 0 ? 'n<10' : s.total.toLocaleString()}
                            </TextCell>

                            <TextCell style={{ fontWeight: 'bold', color: categoryColor }}>
                                <DataValue val={s.csEnrollment} pct={s.pct} showPercentage={store.showPercentage} />
                            </TextCell>
                            
                            <TextCell style={{ fontSize: '0.8rem', color: '#555', lineHeight: '1.4' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span><span style={{ fontWeight: 'bold' }}>Male:</span> <span style={{ color: '#1e88e5' }}>{s.csBoys === 0 ? 'n<10' : s.csBoys}</span></span>
                                    <span><span style={{ fontWeight: 'bold' }}>Female:</span> <span style={{ color: '#d81b60' }}>{s.csGirls === 0 ? 'n<10' : s.csGirls}</span></span>
                                </div>
                            </TextCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </StickyTableContainer>
    );
});

export default SchoolTable;