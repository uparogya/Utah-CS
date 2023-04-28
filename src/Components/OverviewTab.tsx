import { Container, Grid, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, ReactNode } from "react";
import { DataContext } from "../App";
import { findAttribute } from "../Interface/AttributeFinder";
import { format } from "d3-format";
import Store from "../Interface/Store";
import OverviewCard from "./CellComponents/OverviewCard";
import { generateCourseList } from "./Toolbox";
import { PossibleCategories } from "../Preset/Constants";
import styled from "@emotion/styled";


const OverviewTab: FC = () => {

    const allData = useContext(DataContext);
    const store = useContext(Store);


    // find schools that offer cs core classes
    const findCSCOfferings = () => {
        const cscOfferingResult = allData.school[store.schoolYearShowing].slice(2).filter((schoolEntry) => findAttribute(`${store.currentShownCSType}: Number of Courses Offered`, allData.school[store.schoolYearShowing][1], schoolEntry));
        return cscOfferingResult.length / allData.school[store.schoolYearShowing].slice(2).length;
    };

    const findCSStudents = () => {
        //Total students
        const totalStudent = findAttribute('TOTAL: Total', allData.state[store.schoolYearShowing][1], allData.state[store.schoolYearShowing].filter(row => row[0] === store.schoolYearShowing)[0]);
        // Total CS Students
        const totalCSStudent = findAttribute(`${store.currentShownCSType}: Total`, allData.state[store.schoolYearShowing][1], allData.state[store.schoolYearShowing].filter(row => row[0] === store.schoolYearShowing)[0]);
        return totalCSStudent / totalStudent;
    };

    const CourseExplainText: { [key: string]: ReactNode; } = {
        CSC: <span>
            <b>Core CS Classes</b> directly teach <b>fundamental</b> computer science or programming skills.These courses may or may not include applications of computer science. They are divided into two categories: Basic and Advanced.
        </span>,
        CSB: <span>
            <b>Basic CS Classes</b> are a subcategory of Core CS classes. These are <b>introductory</b> CS classes for students with no prior experience in the area.
        </span>,
        CSA: <span>
            <b>Advanced CS Classes</b> are a subcategory of Core CS classes intended for students with prior programming experience.</span>,
        CSR: <span>
            <b>Related CS Classes</b> emphasize the <b>application</b>, rather than the skills of computer science in a variety of settings.</span>,
        CS: <span>
            <b>All CS courses</b>, includes Basic CS, Advanced CS, and Related CS classes.
        </span>,

    };



    return <Container style={{ paddingTop: '20px' }}>
        <Grid container spacing={1}>
            <Grid container spacing={2} xs={6} >
                <OverviewGridItem xs={12} item >
                    <OverviewCard subText={CourseExplainText[store.currentShownCSType]} mainText={<></>} />
                </OverviewGridItem>
                <OverviewGridItem xs={6} item >
                    <OverviewCard
                        mainText={allData.school[store.schoolYearShowing].slice(2).length.toString()}

                        subText='Public Utah High Schools' />
                </OverviewGridItem>
                <OverviewGridItem xs={6} item >
                    <OverviewCard

                        mainText={generateCourseList(store.currentShownCSType, allData.courseList[store.schoolYearShowing]).length.toString()}
                        subText={`${PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].name} Courses`} />
                </OverviewGridItem>

                <OverviewGridItem xs={6} item >
                    <OverviewCard

                        mainText={format(',.0%')(findCSCOfferings())}
                        subText={`Schools Offering ${PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].name} Classes`} />
                </OverviewGridItem>
                <OverviewGridItem xs={6} item>
                    <OverviewCard

                        mainText={format(',.0%')(findCSStudents())}
                        subText={`Schools Offering ${PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].name} Classes`} />
                </OverviewGridItem>

            </Grid>
            <Grid item xs={6}>
                <Typography style={{ textAlign: 'left' }} color='#3d3d3d'>
                    <ul>
                        <li>
                            <b>Core CS Classes</b> - these classes directly teach fundamental computer science or programming skills. These courses may or may not include applications of computer science. They are divided into two categories:
                            <ul>
                                <li>
                                    <b>Basic CS Classes</b> - introductory CS classes for those with no prior experience in the area
                                </li>
                                <li>
                                    <b>Advanced CS Classes</b> - CS classes intended for those with prior experience
                                </li>
                            </ul>
                        </li>
                        <li>
                            <b>Related CS Classes</b> - the emphasis of these classes is on the application, rather than the skills, of computer science in a variety of settings.

                        </li>
                    </ul>
                </Typography>

            </Grid>
        </Grid>
    </Container>;
};

export default observer(OverviewTab);


const OverviewGridItem = styled(Grid)({
    padding: '10px'
});
