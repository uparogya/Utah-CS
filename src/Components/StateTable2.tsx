import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import Store from "../Interface/Store2";
import { DataContext } from "../App2"; 
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { format } from "d3-format";
import AttributeChart from "../Components/CellComponents/AttributeChart2";

const StateTableCell = styled(TableCell)({
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    verticalAlign: 'middle',
});

type DetailedStat = { total: number; male: number; female: number };
type StatGroup = Record<string, DetailedStat>;

const initStat = (): DetailedStat => ({ total: 0, male: 0, female: 0 });
const initGroup = (keys: string[]): StatGroup => {
    const obj: StatGroup = {};
    keys.forEach(k => obj[k] = initStat());
    return obj;
};

const raceKeys = ['white', 'hispanic', 'asian', 'black', 'native', 'pacific', 'twoOrMore'];
const specKeys = ['ecoDis', 'disability', 'engLearner'];

interface StateTableProps {
    categoryColor: string;
}

const StateTable: FC<StateTableProps> = ({ categoryColor }) => {
    const store = useContext(Store);
    const { statePopData, stateCSData } = useContext(DataContext);

    const [popStats, setPopStats] = useState({
        total: 0,
        gender: { male: 0, female: 0 },
        race: initGroup(raceKeys),
        special: initGroup(specKeys)
    });

    const [csStats, setCsStats] = useState({
        total: 0,
        gender: { male: 0, female: 0 },
        race: initGroup(raceKeys),
        special: initGroup(specKeys)
    });

    const formatSimple = (val: number, total: number) => {
        if (store.showPercentage) return format(".2%")(total > 0 ? val / total : 0);
        return format(",")(val);
    };

    useEffect(() => {
        const currentYearRows = statePopData[store.schoolYearShowing] || [];
        let total = 0, mTotal = 0, fTotal = 0;
        const race = initGroup(raceKeys);
        const special = initGroup(specKeys);

        currentYearRows.forEach((row: any) => {
            const label = String(row[1] || '').trim();
            const val = Number(row[2]) || 0;
            total += val;
            const isFem = label === 'Girls';
            const isMale = label === 'Boys';
            if (isFem) fTotal += val;
            if (isMale) mTotal += val;

            const addStat = (key: string, value: number) => {
                race[key].total += value;
                if (isFem) race[key].female += value;
                if (isMale) race[key].male += value;
            };
            const addSpec = (key: string, value: number) => {
                special[key].total += value;
                if (isFem) special[key].female += value;
                if (isMale) special[key].male += value;
            };

            addStat('native', Number(row[3]) || 0);
            addStat('asian', Number(row[4]) || 0);
            addStat('black', Number(row[5]) || 0);
            addStat('hispanic', Number(row[6]) || 0);
            addStat('pacific', Number(row[7]) || 0);
            addStat('twoOrMore', Number(row[8]) || 0);
            addStat('white', Number(row[9]) || 0);
            addSpec('disability', Number(row[11]) || 0);
            addSpec('ecoDis', Number(row[12]) || 0);
            addSpec('engLearner', Number(row[13]) || 0);
        });

        setPopStats({ total, gender: { male: mTotal, female: fTotal }, race, special });
    }, [statePopData, store.schoolYearShowing]);

    useEffect(() => {
        const currentYearRows = stateCSData[store.schoolYearShowing] || [];

        let total = 0, mTotal = 0, fTotal = 0;
        const race = initGroup(raceKeys);
        const special = initGroup(specKeys);

        currentYearRows.forEach((row: any) => {
            const categoryFromRow = String(row[2] || '').trim();
            const genderLabel = String(row[3] || '').trim();

            let shouldInclude = false;

            if (store.courseCategory === 'CS Total' || store.courseCategory === 'All') {
                shouldInclude = true;
            } else if (store.courseCategory === 'CS Foundational') {
                shouldInclude = categoryFromRow !== 'CS-Related';
            } else {
                shouldInclude = categoryFromRow === store.courseCategory;
            }

            if (!shouldInclude) return; 

            const processBlock = (startIndex: number) => {
                const val = Number(row[startIndex]) || 0;
                if (val === 0) return;
                total += val;
                
                const isFem = genderLabel === 'Girls';
                const isMale = genderLabel === 'Boys';
                if (isFem) fTotal += val;
                if (isMale) mTotal += val;

                const addStat = (key: string, offset: number) => {
                    const v = Number(row[startIndex + offset]) || 0;
                    race[key].total += v;
                    if (isFem) race[key].female += v;
                    if (isMale) race[key].male += v;
                };
                const addSpec = (key: string, offset: number) => {
                    const v = Number(row[startIndex + offset]) || 0;
                    special[key].total += v;
                    if (isFem) special[key].female += v;
                    if (isMale) special[key].male += v;
                };

                addStat('native', 1); addStat('asian', 2); addStat('black', 3);
                addStat('hispanic', 4); addStat('pacific', 5); addStat('twoOrMore', 6);
                addStat('white', 7); 
                addSpec('disability', 8); 
                addSpec('ecoDis', 10);
                addSpec('engLearner', 11);
            };

            if (store.courseLevel === 'Basic' || store.courseLevel === 'All') processBlock(4);
            if (store.courseLevel === 'Advanced' || store.courseLevel === 'All') processBlock(16);
        });

        setCsStats({ total, gender: { male: mTotal, female: fTotal }, race, special });
    }, [stateCSData, store.courseCategory, store.courseLevel, store.schoolYearShowing]);

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <StateTableCell style={{ fontWeight: 'bold' }}>Student Type</StateTableCell>
                        <StateTableCell style={{ fontWeight: 'bold' }}>Total Students</StateTableCell>
                        <StateTableCell style={{ fontWeight: 'bold' }}>Gender</StateTableCell>
                        <StateTableCell style={{ fontWeight: 'bold' }}>Race</StateTableCell>
                        <StateTableCell style={{ fontWeight: 'bold' }}>Econ Disadvantaged</StateTableCell>
                        <StateTableCell style={{ fontWeight: 'bold' }}>Disability</StateTableCell>
                        <StateTableCell style={{ fontWeight: 'bold' }}>English Learner</StateTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <StateTableCell component="th" scope="row">
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Total 9-12 Student Population
                            </Typography>
                        </StateTableCell>
                        <StateTableCell>
                            {format(",")(popStats.total)}
                        </StateTableCell>
                        <StateTableCell>
                            <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                                <div><strong>Female:</strong> {formatSimple(popStats.gender.female, popStats.total)}</div>
                                <div><strong>Male:</strong> {formatSimple(popStats.gender.male, popStats.total)}</div>
                            </div>
                        </StateTableCell>
                        <StateTableCell>
                            <AttributeChart title="Total Students" data={popStats.race} totalStudentNum={popStats.total} />
                        </StateTableCell>
                        <StateTableCell>{formatSimple(popStats.special.ecoDis.total, popStats.total)}</StateTableCell>
                        <StateTableCell>{formatSimple(popStats.special.disability.total, popStats.total)}</StateTableCell>
                        <StateTableCell>{formatSimple(popStats.special.engLearner.total, popStats.total)}</StateTableCell>
                    </TableRow>

                    <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                        <StateTableCell component="th" scope="row">
                            <div style={{ 
                                fontWeight: 'bold', 
                                color: categoryColor,
                                borderBottom: `2px solid ${categoryColor}`,
                                display: 'inline-block'
                            }}>
                                {store.courseCategory === 'All' ? 'CS Total' : store.courseCategory}
                            </div>
                            <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 0.5 }}>
                                ({store.courseLevel === 'All' ? 'All Levels' : store.courseLevel})
                            </Typography>
                        </StateTableCell>
                        <StateTableCell>
                            <div style={{ fontWeight: 'bold' }}>{format(",")(csStats.total)}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                ({format(".2%")(popStats.total > 0 ? csStats.total / popStats.total : 0)} of HS)
                            </div>
                        </StateTableCell>
                        <StateTableCell>
                             <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                                <div><strong>Female:</strong> {formatSimple(csStats.gender.female, csStats.total)}</div>
                                <div><strong>Male:</strong> {formatSimple(csStats.gender.male, csStats.total)}</div>
                            </div>
                        </StateTableCell>
                        <StateTableCell>
                            <AttributeChart 
                                title={`${store.courseCategory} Enrollment`} 
                                data={csStats.race} 
                                totalStudentNum={csStats.total}
                                comparisonData={popStats.race}
                                comparisonTotal={popStats.total}
                            />
                        </StateTableCell>
                        <StateTableCell>{formatSimple(csStats.special.ecoDis.total, csStats.total)}</StateTableCell>
                        <StateTableCell>{formatSimple(csStats.special.disability.total, csStats.total)}</StateTableCell>
                        <StateTableCell>{formatSimple(csStats.special.engLearner.total, csStats.total)}</StateTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default observer(StateTable);