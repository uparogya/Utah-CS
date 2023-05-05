import { Container, Grid, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, ReactNode, useRef, useEffect, useState } from "react";
import { DataContext } from "../App";
import { findAttribute } from "../Interface/AttributeFinder";
import Store from "../Interface/Store";
import OverviewCard from "./CellComponents/OverviewCard";
import { PossibleCategories, linkToGeoJson } from "../Preset/Constants";
import styled from "@emotion/styled";
import { generateCourseList } from "./TrendComponent/TrendContainer";
import { computeTextOutcome } from "./CellComponents/PercentageChart";
import { pointer, select } from "d3-selection";
import { GeoPath, GeoPermissibleObjects, geoAlbers, geoAlbersUsa, geoMercator, geoPath } from "d3-geo";
import { json } from "d3-fetch";


const OverviewTab: FC = () => {

    const allData = useContext(DataContext);
    const store = useContext(Store);
    // const leaData = useContext()

    const mapRef = useRef(null);
    const tooltipRef = useRef(null);


    useEffect(() => {

        async function drawMap() {

            const svgSelection = select(mapRef.current);
            const svgWidth = (svgSelection.node() as any).clientWidth;
            const svgHeight = (svgSelection.node() as any).clientHeight;

            const tooltip = select(tooltipRef.current);

            const file = await json(linkToGeoJson);
            const projection = geoMercator()
                .center([-111.950684, 39.419220])
                .translate([svgWidth / 2, svgHeight / 2])
                // .scale(100);
                .scale(3000);




            const path = geoPath().projection(projection);


            // console.log(file);
            svgSelection.select('#map').selectAll('path').data((file as any).features)
                .join('path')
                .attr('d', path as any)
                .attr('fill', (d: any) => {
                    // console.log(allData);
                    // find row
                    const leaRow = allData.district.filter(row => row[0] === d.properties.NAME)[0];


                    return 'none';
                }) //change fill to district cs percentage
                .attr('stroke-width', 1)
                .attr('stroke', '#222')
                .attr('pointer-event', 'all')
                .on('mouseover', (e, data) => {
                    tooltip
                        .html((data as any).properties.NAME)
                        .style('display', 'block')
                        .style("left", `${e.pageX + 5}px`)
                        .style("top", `${e.pageY + 5}px`);

                    console.log(data);
                }).on('mousemove', (e) => {
                    tooltip.style("left", `${e.pageX + 5}px`)
                        .style("top", `${e.pageY + 5}px`);
                })

                .on('mouseout', () => {
                    // tooltip.style('opacity', 0);
                    tooltip.style('display', 'none');
                });

        };

        if (mapRef.current && tooltipRef.current) {
            drawMap();
        }


    }, [mapRef]);

    // find schools that offer cs core classes
    const findCSCOfferings = () => {
        const cscOfferingResult = allData.school.slice(2).filter((schoolEntry) => findAttribute(`${store.currentShownCSType}: Number of Courses Offered`, allData.school[1], schoolEntry));
        return computeTextOutcome(cscOfferingResult.length, (cscOfferingResult.length / allData.school.slice(2).length), store.showPercentage, true);

    };

    const findCSStudents = () => {
        //Total students
        const totalStudent = findAttribute('TOTAL: Total', allData.state[1], allData.state.filter(row => row[0] === store.schoolYearShowing)[0]);
        // Total CS Students
        const totalCSStudent = findAttribute(`${store.currentShownCSType}: Total`, allData.state[1], allData.state.filter(row => row[0] === store.schoolYearShowing)[0]);
        return computeTextOutcome(totalCSStudent, (totalCSStudent / totalStudent), store.showPercentage, true);
    };

    const CourseExplainText: { [key: string]: ReactNode; } = {
        CSC: <span>
            <b>Core CS Courses</b> directly teach <b>fundamental</b> computer science or programming skills. They are divided into two categories: Basic and Advanced.
        </span>,
        CSB: <span>
            <b>Basic CS Courses</b> are a subcategory of Core CS Courses. These are <b>introductory</b> CS Courses for students with no prior experience in the area.
        </span>,
        CSA: <span>
            <b>Advanced CS Courses</b> are a subcategory of Core CS Courses intended for students with prior programming experience.</span>,
        CSR: <span>
            <b>Related CS Courses</b> emphasize the <b>application</b>, rather than the skills of computer science in a variety of settings.</span>,
        CS: <span>
            <b>All CS courses</b>, includes Basic CS, Advanced CS, and Related CS Courses.
        </span>,

    };



    return <Container style={{ paddingTop: '20px' }}>
        <Grid container spacing={1}>
            <Grid container spacing={2} xs={6} >
                <OverviewGridItem xs={12} item >
                    <OverviewCard subText={CourseExplainText[store.currentShownCSType]} mainText={''} />
                </OverviewGridItem>
                <OverviewGridItem xs={6} item >
                    <OverviewCard
                        mainText={allData.school.slice(2).length}

                        subText={<>
                            <span>Public Utah High Schools</span>
                        </>} />
                </OverviewGridItem>
                <OverviewGridItem xs={6} item >
                    <OverviewCard
                        mainText={generateCourseList(store.currentShownCSType, allData.courseList).length}
                        subText={`${PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].name} Courses`} />
                </OverviewGridItem>

                <OverviewGridItem xs={6} item >
                    <OverviewCard

                        mainText={
                            <span onClick={() => store.updateShowPercentage()} style={{ cursor: 'pointer' }}>
                                {findCSCOfferings()}
                            </span>
                        }
                        subText={<span>Schools <b>Offering</b> {PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].name} Courses
                        </span>} />
                </OverviewGridItem>
                <OverviewGridItem xs={6} item>
                    <OverviewCard
                        mainText={
                            <span onClick={() => store.updateShowPercentage()} style={{ cursor: 'pointer' }}>
                                {findCSStudents()}
                            </span>
                        }
                        subText={
                            <span>Student <b>Participating</b> in {PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].name} Courses
                            </span>} />
                </OverviewGridItem>

            </Grid>
            <Grid item xs={6}>
                {/* <Typography style={{ textAlign: 'left' }} color='#3d3d3d'>
                    <ul>
                        <li>
                            <b>Core CS Courses</b> - these courses directly teach fundamental computer science or programming skills. They are divided into two categories:
                            <ul>
                                <li>
                                    <b>Basic CS Courses</b> - introductory CS Courses for those with no prior experience in the area
                                </li>
                                <li>
                                    <b>Advanced CS Courses</b> - CS Courses intended for those with prior experience
                                </li>
                            </ul>
                        </li>
                        <li>
                            <b>Related CS Courses</b> - the emphasis of these courses is on the application, rather than the skills, of computer science in a variety of settings.

                        </li>
                    </ul>
                </Typography> */}
                <svg ref={mapRef} width='100%' height='55vh'>
                    <g id='map' />
                </svg>
                <div
                    id="tooltip"
                    ref={tooltipRef}
                    style={{
                        position: 'absolute',
                        background: '#f4f1d6',
                        borderRadius: '8px',
                        pointerEvents: 'none',
                        padding: '5px',
                        textAlign: 'center',
                    }} />
            </Grid>
        </Grid>
    </Container>;
};

export default observer(OverviewTab);


const OverviewGridItem = styled(Grid)({
    padding: '10px'
});
