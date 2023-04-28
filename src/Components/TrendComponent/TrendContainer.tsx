import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { select } from 'd3-selection';
import { DataContext, TableTitle } from "../../App";
import { scaleLinear, scalePoint } from "d3-scale";
import { PossibleCategories, PossibleSchoolYears } from "../../Preset/Constants";
import { findAttribute } from "../../Interface/AttributeFinder";
import { max } from "d3-array";
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from "d3-shape";
import { CourseCategoryColor } from "../../Preset/Colors";
import { FormControl, Grid, InputLabel, List, ListItem, MenuItem, Select, Typography } from "@mui/material";

export const generateCourseList = (openCategoryDialog: string, courseCategorization: (string | number)[][]) => {
    // if (openCategoryDialog === '')
    let includedCateList = [openCategoryDialog];
    if (openCategoryDialog === 'CS') {
        includedCateList = ['CSA', 'CSR', 'CSB'];
    } else if (openCategoryDialog === 'CSC') {
        includedCateList = ['CSA', 'CSB'];
    }
    return courseCategorization.filter(courseInfo =>
        includedCateList.includes(courseInfo[2] as string));

};

const TrendContainer: FC = () => {

    const svgRef = useRef(null);
    const stateData = useContext(DataContext).state;
    const MARGIN = 50;
    const courseCateData = useContext(DataContext).courseList;


    const stateAttributeFinder = useCallback((attributeName: string, year: string) =>
        findAttribute(attributeName, stateData[1], stateData.filter(row => row[0] === year)[0])
        , [stateData]);

    const [trendCat, setTrendCat] = useState(PossibleCategories[0].key);

    const generateList = () => {
        return generateCourseList(trendCat, courseCateData).map(courseInfo => <ListItem key={courseInfo[0]}>{courseInfo[1]}</ListItem>);
    };

    useEffect(() => {
        if (svgRef.current) {
            const svgSelection = select(svgRef.current);
            const svgWidth = (svgSelection.node() as any).clientWidth;
            const svgHeight = (svgSelection.node() as any).clientHeight;

            //Construct the data to visualize

            // TODO redo this part.
            const dataToVisualize: { [key: string]: string | number; }[] = PossibleSchoolYears.map((y) => ({
                year: y,
                CSA: stateAttributeFinder('CSA: Total', y),
                CSB: stateAttributeFinder('CSB: Total', y),
                CSR: stateAttributeFinder('CSR: Total', y),
            }));

            // console.log(dataToVisualize);

            const convertData: {
                [key: string]: {
                    year: string;
                    student: number;
                }[];
            } = {};

            dataToVisualize.forEach((item) => {
                Object.keys(item).forEach((key) => {
                    if (key !== "year") {
                        if (!convertData[key]) {
                            convertData[key] = [];
                        }
                        convertData[key].push({
                            year: item.year as string,
                            student: item[key] as number,
                        });
                    }
                });
            });

            // PossibleSchoolYears.map((y) = stateData.filter(row => row[0] === store.schoolYearShowing)[0])
            const studentEnrollmentAxis = scaleLinear()
                .domain([0, max(dataToVisualize.map((entry) => ([entry.CSA, entry.CSB, entry.CSR])).flat() as number[]) || 0])
                .range([svgHeight - MARGIN, MARGIN])
                .nice();

            const yearScale = scalePoint()
                .domain(PossibleSchoolYears)
                .range([MARGIN, svgWidth - MARGIN])
                .padding(0.3);

            // draw year axis
            svgSelection.select('#yearAxis')
                .call(axisBottom(yearScale) as any)
                .attr('transform', `translate(0,${svgHeight - MARGIN})`);

            // draw student axis
            svgSelection.select('#studentAxis')
                .call(axisLeft(studentEnrollmentAxis) as any)
                .attr('transform', `translate(${MARGIN},0)`);

            // three lines

            svgSelection.select('#lines')
                .selectAll('path')
                .data(['CSA', 'CSB', 'CSR'])
                .join('path')
                .attr('stroke', d => CourseCategoryColor[d])
                .datum(d => convertData[d])
                .attr('d', line()
                    .x((d: any) => (yearScale(d.year) || 0))
                    .y((d: any) => (studentEnrollmentAxis(d.student) || 0)) as any
                )
                .attr("stroke-width", 2)
                .attr("fill", "none");

            // draw a legend

            // Add a colored square for each item in the legend

            const legend = svgSelection.select('#legend').attr('transform', `translate(${svgWidth - 200},0)`);
            legend.selectAll('rect')
                .data(['CSA', 'CSB', 'CSR'])
                .join('rect')
                .attr('x', 10)
                .attr('y', (d, i) => i * 20 + 10)
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', d => CourseCategoryColor[d]);

            // Add the text label for each item in the legend
            legend.selectAll('text')
                .data(['CSA', 'CSB', 'CSR'])
                .join('text')
                .attr('x', 25)
                .attr('y', (d, i) => i * 20 + 20)
                .text(d => d);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [svgRef, trendCat]);


    return <Grid container>
        <Grid xs={3}>

            <TableTitle color={'primary'} children='Select Course to Show' />
            <FormControl variant="standard" style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <InputLabel>Course Category</InputLabel> */}
                <Select value={trendCat} onChange={(e) => setTrendCat(e.target.value)} label='Course Category' style={{ paddingLeft: '5px' }}>
                    {PossibleCategories.map((category) => (
                        <MenuItem key={`${category.name}-mi-trend`} value={category.key}>{category.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <List style={{ maxHeight: '45vh', overflow: 'auto' }}>
                {generateList()}
            </List>
        </Grid>
        <Grid xs={9}>
            <svg width='100%' height='55vh' ref={svgRef}>
                <g id='yearAxis' />
                <g id='studentAxis' />
                <g id='lines' />
                <g id='legend' />
            </svg>
        </Grid>
    </Grid>;

};

export default (TrendContainer);
