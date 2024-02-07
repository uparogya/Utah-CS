import { Container, Grid, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, ReactNode, useRef, useEffect, useState } from "react";
import { DataContext, SectionTitle } from "../App";
import { findAttribute } from "../Interface/AttributeFinder";
import Store from "../Interface/Store";
import OverviewCard from "./CellComponents/OverviewCard";
import { PossibleCategories, linkToGeoJson } from "../Preset/Constants";
import { CourseCategoryColor, LightGray } from "../Preset/Colors";
import styled from "@emotion/styled";
import { generateCourseList } from "./TrendComponent/TrendContainer";
import { computeTextOutcome } from "./CellComponents/PercentageChart";
import { pointer, select } from "d3-selection";
import { GeoPath, GeoPermissibleObjects, geoAlbers, geoAlbersUsa, geoMercator, geoPath } from "d3-geo";
import { json } from "d3-fetch";
import { interpolateBlues } from 'd3-scale-chromatic';
import { format } from "d3-format";
import CourseInfoModal from "./CourseDescriptionComponent/CourseInfoModal";

const OverviewTab: FC = () => {

    const allData = useContext(DataContext);
    const store = useContext(Store);
    // const leaData = useContext()

    const mapRef = useRef(null);
    const tooltipRef = useRef(null);

    const currentCSTypeShortName = PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName;

    useEffect(() => {

        async function drawMap() {
            // map scaling code sources:
            // https://www.geeksforgeeks.org/best-way-to-make-a-d3-js-visualization-layout-responsive/
            // https://stackoverflow.com/questions/55972289/how-can-i-scale-my-map-to-fit-my-svg-size-with-d3-and-geojson-path-data
            // https://observablehq.com/@d3/new-jersey-state-plane
            const svgSelection = select(mapRef.current);
            const svgNode: any = svgSelection.node();
            const svgWidth = svgNode.parentNode.clientWidth;
            const svgHeight = svgNode.parentNode.clientHeight;

            svgSelection.attr('width', svgWidth)
                .attr('height', svgHeight)
                .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
                .attr('style', 'max-width: 100%; height: auto;');

            const tooltip = select(tooltipRef.current);

            const file = await json(linkToGeoJson);
            const projection = geoMercator()
                .center([-111.950684, 39.419220])
                .translate([svgWidth / 2, svgHeight / 2])
                // .scale(100);
                .fitExtent([[0, 0], [svgWidth, svgHeight]], (file as any));

            const highestDistrictPercent = allData.district.filter((row) => {
                    const totalStudents = findAttribute('TOTAL: Total', allData.district[0], row);
                    const totalCS = findAttribute(`${store.currentShownCSType}: Total`, allData.district[0], row);
                    return typeof totalStudents === "number" && typeof totalCS === "number";
                })
                .reduce((highPercentage, currentRow) => {
                    const totalStudents = findAttribute('TOTAL: Total', allData.district[0], currentRow);
                    const totalCS = findAttribute(`${store.currentShownCSType}: Total`, allData.district[0], currentRow);
                    const currentPercentage = totalCS / totalStudents;
                    return Math.max(currentPercentage, highPercentage);
                }, 0);

            const path = geoPath().projection(projection);
            // console.log(file);
            svgSelection.select('#map').selectAll('path').data((file as any).features)
                .join('path')
                .attr('d', path as any)
                .attr('fill', (d: any) => {
                    // find row
                    const leaRow = allData.district.filter(row => row[0] === d.properties.NAME)[0];
                    const totalStudents = findAttribute('TOTAL: Total', allData.district[0], leaRow);
                    const totalCS = findAttribute(`${store.currentShownCSType}: Total`, allData.district[0], leaRow);
                    return interpolateBlues((totalCS / totalStudents / highestDistrictPercent) || 0);
                }) //change fill to district cs percentage
                .attr('stroke-width', 1)
                .attr('stroke', '#222')
                .on('mouseover', (e, data) => {
                    const leaRow = allData.district.filter(row => row[0] === (data as any).properties.NAME)[0];
                    const totalStudents = findAttribute('TOTAL: Total', allData.district[0], leaRow);
                    const totalCS = findAttribute(`${store.currentShownCSType}: Total`, allData.district[0], leaRow);
                    tooltip
                        .html(`${(data as any).properties.NAME}, ${isNaN(totalCS) || isNaN(totalStudents) ? 'n<10' : format(',.0%')(totalCS / totalStudents)}`)
                        .style('display', 'block')
                        .style("left", `${e.pageX + 5}px`)
                        .style("top", `${e.pageY + 5}px`);
                }).on('mousemove', (e) => {
                    tooltip.style("left", `${e.pageX + 5}px`)
                        .style("top", `${e.pageY + 5}px`);
                })

                .on('mouseout', () => {
                    // tooltip.style('opacity', 0);
                    tooltip.style('display', 'none');
                });

            // draw legend
            svgSelection.select('#legend')
                .select('rect')
                .attr('x', '75%')
                .attr('y', 0)
                .attr('width', 80)
                .attr('height', 30)
                .attr('fill', 'url(#legend-gradient)');

            svgSelection.select('#legend')
                .selectAll('text')
                .data([0, highestDistrictPercent])
                .join('text')
                .attr('x', (_, i) => 0.75*svgWidth + i * 80)
                .attr('y', 40)
                .text(d => format(',.0%')(d))
                .attr('alignment-baseline', 'hanging')
                .attr('font-size', 'smaller')
                .attr('text-anchor', d => d ? 'end' : 'start');

        };

        if (mapRef.current && tooltipRef.current) {
            drawMap();
        }


    }, [allData.district, mapRef, store.currentShownCSType]);

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
        CSC: (
            <>
                <Typography variant="h6" gutterBottom style={{ color: CourseCategoryColor[store.currentShownCSType], fontWeight: 'bold' }}>
                    Core CS Courses
                </Typography>
                <Typography>
                    Core CS Courses directly teach fundamental computer science or programming skills. They are divided into two categories: Basic and Advanced. Refer to Course Categories for more information.
                </Typography>
            </>
        ),
        CSB: (
            <>
                <Typography variant="h6" gutterBottom style={{ color: CourseCategoryColor[store.currentShownCSType], fontWeight: 'bold' }}>
                    Basic CS Courses
                </Typography>
                <Typography>
                    Basic CS Courses are a subcategory of Core CS Courses. These are introductory CS Courses for students with no prior experience in the area. Refer to Course Categories for more information.
                </Typography>
            </>
        ),
        CSA: (
            <>
                <Typography variant="h6" gutterBottom style={{ color: CourseCategoryColor[store.currentShownCSType], fontWeight: 'bold' }}>
                    Advanced CS Courses
                </Typography>
                <Typography>
                    Advanced CS Courses are a subcategory of Core CS Courses intended for students with prior programming experience. Refer to Course Categories for more information.
                </Typography>
            </>
        ),
        CSR: (
            <>
                <Typography variant="h6" gutterBottom style={{ color: CourseCategoryColor[store.currentShownCSType], fontWeight: 'bold' }}>
                    Related CS Courses
                </Typography>
                <Typography>
                    Related CS Courses emphasize the application, rather than the skills of computer science in a variety of settings. Refer to Course Categories for more information.
                </Typography>
            </>
        ),
        CS: (
            <>
                <Typography variant="h6" gutterBottom style={{ color: CourseCategoryColor[store.currentShownCSType], fontWeight: 'bold' }}>
                    All CS Courses
                </Typography>
                <Typography>
                    All CS courses include Basic CS, Advanced CS, and Related CS Courses. Refer to Course Categories for more information.
                </Typography>
            </>
        ),
    };

    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    const openModal = (courseType: string) => {
        setSelectedCourse(courseType);
    };
    
    const closeModal = () => {
        setSelectedCourse(null);
    };
    
    



    return <Container style={{ paddingTop: '20px' }}>
        <Grid container>
            <Grid container item xs={12} md={6}>
            <OverviewGridItem item xs={12} >
                    <OverviewCard subText={CourseExplainText[store.currentShownCSType]} mainText={''} />
            </OverviewGridItem>
            <OverviewGridItem item xs={6}>
            <OverviewCard
                mainText={
                    <span>Public Schools With 9-12 Graders</span>
                }
                subText={
                    <span style={{ color: CourseCategoryColor[store.currentShownCSType] }}>
                        {allData.school.slice(2).length}
                    </span>
                }
            />
        </OverviewGridItem>
        <OverviewGridItem item xs={6} onClick={() => openModal(store.currentShownCSType)} style={{'cursor':'pointer'}}>
            <OverviewCard 
                mainText={
                    <span>{currentCSTypeShortName} Courses</span>
                }
                subText={
                    <span style={{ color: CourseCategoryColor[store.currentShownCSType] }}>
                        {generateCourseList(store.currentShownCSType, allData.courseList).length}
                    </span>
                }
            />
        </OverviewGridItem>
        <OverviewGridItem item xs={6}>
            <OverviewCard
                mainText={
                    <span>Schools <b>Offering</b> {currentCSTypeShortName} Courses</span>
                }
                subText={
                    <span style={{ color: CourseCategoryColor[store.currentShownCSType] }}>
                        <span onClick={() => store.updateShowPercentage()} style={{ cursor: 'pointer' }}>
                            {findCSCOfferings()}
                        </span>
                    </span>
                }
            />
        </OverviewGridItem>
        <OverviewGridItem item xs={6}>
            <OverviewCard
                mainText={
                    <span>Students <b>Participating</b> in {currentCSTypeShortName} Courses</span>
                }
                subText={
                    <span style={{ color: CourseCategoryColor[store.currentShownCSType] }}>
                        <span onClick={() => store.updateShowPercentage()} style={{ cursor: 'pointer' }}>
                            {findCSStudents()}
                        </span>
                    </span>
                }
            />
        </OverviewGridItem>

            </Grid>
            <Grid container item xs={12} md={6} minHeight={{ xs: 500, md: 0 }}>
                <Grid item xs={12}>
                    <SectionTitle align='center'style={{ color: CourseCategoryColor[store.currentShownCSType],  marginBottom: '20px' }}>Percentage of Students in {currentCSTypeShortName} by District for {store.schoolYearShowing}</SectionTitle>
                </Grid>
                <Grid item xs={12}>
                    <svg ref={mapRef}>
                        <linearGradient id='legend-gradient' x1="0" x2="1" y1="0" y2="0" colorInterpolation="CIE-LCHab">
                            <stop offset="0%" stopColor={interpolateBlues(0)} />
                            <stop offset="50%" stopColor={interpolateBlues(0.5)} />
                            <stop offset="100%" stopColor={interpolateBlues(1)} />
                        </linearGradient>
                        <g id='map' />
                        <g id='legend'>
                            <rect />
                        </g>

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
        </Grid>
        {selectedCourse && (
            <CourseInfoModal courseType={selectedCourse} onClose={closeModal} />
        )}
    </Container>;
};

export default observer(OverviewTab);


const OverviewGridItem = styled(Grid)({
    padding: '10px'
});
