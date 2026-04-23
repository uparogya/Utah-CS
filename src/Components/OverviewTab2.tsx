import { Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo, ReactNode } from "react";
import { DataContext } from "../App2";
import Store from "../Interface/Store2";
import styled from "@emotion/styled";
import { format } from "d3-format";

const OverviewGridItem = styled(Grid)({
    padding: '10px',
    display: 'flex',
    flexDirection: 'column'
});

const OverviewCard: FC<{ mainText: ReactNode, subText: ReactNode }> = ({ mainText, subText }) => (
    <div style={{
        backgroundColor: 'white', border: '1px solid #ddd', padding: '22px',
        height: '100%', boxSizing: 'border-box', borderRadius: '4px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
    }}>
        <div style={{ fontSize: '0.95rem', color: '#444', marginBottom: '12px', lineHeight: 1.4 }}>{mainText}</div>
        {subText !== null && <div style={{ fontSize: '2.8rem', fontWeight: 800 }}>{subText}</div>}
    </div>
);

interface Props {
    categoryColor: string;
}

const OverviewTab: FC<Props> = ({ categoryColor }) => {
    const store = useContext(Store);
    const {
        statePopData,
        stateCSData,
        schoolCSData,
        schoolPopData,
        courseData
    } = useContext(DataContext);

    const year = store.schoolYearShowing;

    const totalStudentsCount = useMemo(() => {
        const rows = statePopData[year] || [];
        return rows.reduce((acc: number, row: any) => acc + (Number(row[2]) || 0), 0);
    }, [statePopData, year]);

    const participatingCount = useMemo(() => {
        const rows = stateCSData[year] || [];
        const selectedCat = store.courseCategory; 
    
        return rows.reduce((acc: number, row: any) => {
            const rowCat = String(row[2] || '').trim();
    
            let include = false;
            if (selectedCat === 'CS Total') {
                include = true;
            } else if (selectedCat === 'CS Foundational') {
                include = (rowCat !== 'CS-Related');
            } else {
                include = (rowCat === selectedCat);
            }
    
            if (!include) return acc;
    
            let val = 0;
            if (store.courseLevel === 'Basic' || store.courseLevel === 'All') {
                val += Number(row[4]) || 0;
            }
            if (store.courseLevel === 'Advanced' || store.courseLevel === 'All') {
                val += Number(row[16]) || 0;
            }
            return acc + val;
        }, 0);
    }, [stateCSData, year, store.courseCategory, store.courseLevel]);

    const schoolsOfferingCount = useMemo(() => {
        const rows = schoolCSData[year] || [];
        const uniqueOfferingSchools = new Set<string>();

        rows.forEach((row: any) => {
            const schoolName = String(row[1] || '').trim();
            const rowCat = String(row[7] || '').trim();

            let include = false;
            if (store.courseCategory === 'CS Total') {
                include = true;
            } else if (store.courseCategory === 'CS Foundational') {
                include = (rowCat !== 'CS-Related');
            } else {
                include = (rowCat.toLowerCase() === store.courseCategory.toLowerCase());
            }

            if (!include) return;

            let enrollment = 0;
            if (store.courseLevel === 'Basic' || store.courseLevel === 'All') enrollment += Number(row[8]) || 0;
            if (store.courseLevel === 'Advanced' || store.courseLevel === 'All') enrollment += Number(row[14]) || 0;

            if (enrollment > 0) {
                uniqueOfferingSchools.add(schoolName);
            }
        });

        return uniqueOfferingSchools.size;
    }, [schoolCSData, year, store.courseCategory, store.courseLevel]);

    const uniqueCourseCount = useMemo(() => {
        if (!courseData?.byCode) return 0;
        const all = Object.values(courseData.byCode);

        if (store.courseCategory === 'CS Total') return all.length;
        if (store.courseCategory === 'CS Foundational') {
            return all.filter((c: any) => c[1] === 'CS').length;
        }
        return all.filter((c: any) => c[2] === store.courseCategory).length;
    }, [courseData, store.courseCategory]);

    const renderDescription = (): JSX.Element => {
        const cat = store.courseCategory;
        let body = `This view displays data specifically for ${cat} courses.`;
        if (cat === "CS Total") body = "CS Total includes all Foundational and CS-Related courses.";
        else if (cat === "CS Foundational") body = "CS Foundational courses directly teach fundamental computer science skills, excluding CS-Related courses.";

        return (
            <>
                <div style={{ color: categoryColor, fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '8px' }}>{cat}</div>
                <div style={{ fontSize: '1.05rem' }}>{body}</div>
            </>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={0} alignItems="stretch">
                <Grid xs={12} md={6}>
                    <Grid container>
                        <OverviewGridItem xs={12}>
                            <OverviewCard mainText={renderDescription()} subText={null} />
                        </OverviewGridItem>

                        <OverviewGridItem xs={6}>
                            <OverviewCard
                                mainText={<span>Public Schools With 9-12 Graders</span>}
                                subText={<span style={{ color: categoryColor }}>{(schoolPopData[year] || []).length}</span>}
                            />
                        </OverviewGridItem>

                        <OverviewGridItem xs={6}>
                            <OverviewCard
                                mainText={<span>{store.courseCategory} Courses</span>}
                                subText={<span style={{ color: categoryColor }}>{uniqueCourseCount}</span>}
                            />
                        </OverviewGridItem>

                        <OverviewGridItem xs={6}>
                            <OverviewCard
                                mainText={<span>Schools <b>Offering</b> {store.courseCategory} Courses</span>}
                                subText={<span style={{ color: categoryColor }}>{schoolsOfferingCount}</span>}
                            />
                        </OverviewGridItem>

                        <OverviewGridItem xs={6}>
                            <OverviewCard
                                mainText={<span>Students <b>Participating</b> in {store.courseCategory} Courses</span>}
                                subText={
                                    <span style={{ color: categoryColor, fontSize: store.showPercentage ? '3.2rem' : '2.8rem' }}>
                                        {store.showPercentage
                                            ? format(".1%")(totalStudentsCount > 0 ? participatingCount / totalStudentsCount : 0)
                                            : format(",")(participatingCount)}
                                    </span>
                                }
                            />
                        </OverviewGridItem>
                    </Grid>
                </Grid>

                <Grid xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ textAlign: 'center', color: categoryColor, fontWeight: 'bold', marginBottom: '15px', fontSize: '1.15rem' }}>
                            Percentage of Students in {store.courseCategory} by District for {year}
                        </div>
                        <div style={{
                            flex: 1,
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Typography color="textSecondary">Map Data Placeholder</Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default observer(OverviewTab);