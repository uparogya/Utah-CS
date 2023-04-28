import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { select } from 'd3-selection';
import { DataContext, TableTitle } from "../../App";
import { scaleLinear, scalePoint } from "d3-scale";
import { PossibleCategories, PossibleSchoolYears } from "../../Preset/Constants";
import { findAttribute } from "../../Interface/AttributeFinder";
import { max } from "d3-array";
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from "d3-shape";
import { CourseCategoryColor, LightGray } from "../../Preset/Colors";
import { FormControl, Grid, InputLabel, List, ListItem, MenuItem, Select, Typography } from "@mui/material";
import 'd3-transition';
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import { format } from "d3-format";

const generateIncludedCat = (category: string) => {
    let includedCateList = [category];
    if (category === 'CS') {
        includedCateList = ['CSA', 'CSR', 'CSB'];
    } else if (category === 'CSC') {
        includedCateList = ['CSA', 'CSB'];
    }
    return includedCateList;
};

export const generateCourseList = (category: string, courseCategorization: (string | number)[][]) => {
    // if (openCategoryDialog === '')
    let includedCateList = generateIncludedCat(category);
    return courseCategorization.filter(courseInfo =>
        includedCateList.includes(courseInfo[2] as string));

};

function addSpaces(inputString: string): string {
    if (inputString === inputString.toUpperCase()) {
        return inputString;
    }

    return inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
}

const TrendContainer: FC = () => {

    const svgRef = useRef(null);
    const stateData = useContext(DataContext).state;

    const store = useContext(Store);

    const RequiredDemographic = ['TotalStudents', 'Female', 'Hispanic', 'Disability', 'EconDisadvantaged', 'ESL'];
    const RowHeight = 30;
    const Margin = { top: 50, left: 100, right: 50, bottom: (RequiredDemographic.length + 0.5) * RowHeight };


    const courseCateData = useContext(DataContext).courseList;


    const stateAttributeFinder = useCallback((attributeName: string, year: string) =>
        findAttribute(attributeName, stateData[1], stateData.filter(row => row[0] === year)[0])
        , [stateData]);

    // const [store.currentShownCSType, setstore.currentShownCSType] = useState(PossibleCategories[0].key);

    const generateList = () => {
        return generateCourseList(store.currentShownCSType, courseCateData).map(courseInfo => <ListItem key={courseInfo[0]}>{courseInfo[1]}</ListItem>);
    };



    const [dataToVisualize, setData] = useState<{ [key: string]: number | string, }[]>([]);

    useEffect(() => {
        if (svgRef.current) {
            const svgSelection = select(svgRef.current);
            const svgWidth = (svgSelection.node() as any).clientWidth;
            const svgHeight = (svgSelection.node() as any).clientHeight;

            //Construct the data to visualize
            const tempData: { [key: string]: number | string, }[] = PossibleSchoolYears.map((year) => ({
                year: year,
                TotalStudents: stateAttributeFinder(`${store.currentShownCSType}: Total`, year),
                Female: stateAttributeFinder(`${store.currentShownCSType}: Female`, year),
                Hispanic: stateAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`, year),
                Disability: stateAttributeFinder(`${store.currentShownCSType}: Disability`, year),
                EconDisadvantaged: stateAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`, year),
                ESL: stateAttributeFinder(`${store.currentShownCSType}: Eng. Learners`, year),
                StateTotal: stateAttributeFinder(`TOTAL: Total`, year),
            })
            );

            // PossibleSchoolYears.map((y) = stateData.filter(row => row[0] === store.schoolYearShowing)[0])
            const studentEnrollmentAxis = scaleLinear()
                .domain([0, max(tempData, d => d.TotalStudents as number) || 0])
                .range([svgHeight - Margin.bottom, Margin.top])
                .nice();

            const yearScale = scalePoint()
                .domain(PossibleSchoolYears)
                .range([Margin.left, svgWidth - Margin.right])
                .padding(0.3);

            // draw year axis
            svgSelection.select('#yearAxis')
                .attr('transform', `translate(0,${svgHeight - Margin.bottom})`)
                .call(axisBottom(yearScale) as any);

            svgSelection.select('#yearAxis')
                .selectAll('text')
                .attr('font-size', 'small');

            // draw student axis
            svgSelection.select('#studentAxis')
                .attr('transform', `translate(${Margin.left},0)`)
                .transition()
                .duration(function () {
                    return svgSelection.select('#studentAxis').selectAll('text').size() ? 500 : 0;
                })
                .call(axisLeft(studentEnrollmentAxis) as any);

            // draw lines
            svgSelection.select('#lines')
                .selectAll('path')
                .data([store.currentShownCSType])
                .join('path')
                .attr('stroke', d => CourseCategoryColor[d])
                .datum(tempData)
                .attr('d', line()
                    .x((d: any) => (yearScale(d.year) || 0))
                    .y((d: any) => (studentEnrollmentAxis(d.TotalStudents) || 0)) as any
                )
                .attr("stroke-width", 2)
                .attr("fill", "none");

            // draw legends
            const legend = svgSelection.select('#legend').attr('transform', `translate(${svgWidth - 200},0)`);
            legend.selectAll('rect')
                .data([store.currentShownCSType])
                .join('rect')
                .attr('x', 10)
                .attr('y', (_, i) => i * 20 + 10)
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', d => CourseCategoryColor[d]);

            // Add the text label for each item in the legend
            legend.selectAll('text')
                .data([store.currentShownCSType])
                .join('text')
                .attr('x', 25)
                .attr('y', (d, i) => i * 20 + 20)
                .text(d => d);

            // draw table with demographics

            const tableG = svgSelection.select('#table');

            tableG.attr('transform', `translate(0,${svgHeight - Margin.bottom + RowHeight})`);

            tableG.select('#header')
                .attr('transform', 'translate(2,0)')
                .selectAll('text')
                .data(RequiredDemographic)
                .join('text')
                .text(d => addSpaces(d))
                .attr('alignment-baseline', 'hanging')
                .attr('font-size', 'small')
                .attr('y', (_, i) => (i) * RowHeight);

            const columns = tableG.select('#body')
                .selectAll('g')
                .data(tempData)
                .join('g')
                .attr('transform', d => `translate(${yearScale(d.year as string)},0)`);

            columns.selectAll('text')
                .data(d => RequiredDemographic.map((demoName) => store.showPercentage ? (demoName === 'TotalStudents' ? (+d[demoName]) / (+d.StateTotal) : (+d[demoName]) / (+d.TotalStudents)) : d[demoName]))
                // .data(d => RequiredDemographic.map((demoName) => d[demoName]))
                .join('text')
                .text(t => format(`,${store.showPercentage ? '.1%' : ''}`)(t as number))
                .attr('alignment-baseline', 'hanging')
                .attr('font-size', 'small')
                .attr('text-anchor', 'middle')
                .attr('y', (_, i) => (i) * RowHeight);

            // draw column lines
            columns.selectAll('line')
                .data([0])
                .join('line')
                .attr('x1', yearScale.step() * 0.5)
                .attr('x2', yearScale.step() * 0.5)
                .attr('y1', -0.5 * RowHeight)
                .attr('y2', RowHeight * RequiredDemographic.length)
                .attr('stroke', LightGray);

            tableG.select('#rowgrid')
                .selectAll('line')
                .data(RequiredDemographic)
                .join('line')
                .attr('x1', 2)
                .attr('x2', svgWidth)
                .attr('y1', (_, i) => RowHeight * (i - 0.25))
                .attr('y2', (_, i) => RowHeight * (i - 0.25))
                .attr('stroke', LightGray);

            stateUpdateWrapperUseJSON(dataToVisualize, tempData, setData);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [svgRef, store.currentShownCSType]);

    // // // update text based on state

    useEffect(() => {
        if (svgRef.current && dataToVisualize.length) {
            const svgSelection = select(svgRef.current);
            svgSelection.select('#body')
                .selectAll('g')
                .data(dataToVisualize)
                .join('g')
                .selectAll('text')
                .data(d => RequiredDemographic.map((demoName) => store.showPercentage ? (demoName === 'TotalStudents' ? (+d[demoName]) / (+d.StateTotal) : (+d[demoName]) / (+d.TotalStudents)) : d[demoName]))
                // .data(d => RequiredDemographic.map((demoName) => d[demoName]))
                .join('text')
                .text(t => format(`,${store.showPercentage ? '.1%' : ''}`)(t as number))
                .attr('alignment-baseline', 'hanging')
                .attr('font-size', 'small')
                .attr('text-anchor', 'middle')
                .attr('y', (_, i) => (i) * RowHeight);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.showPercentage]);


    return <Grid container>
        <Grid xs={3}>

            <TableTitle color={'primary'} children='Select Course to Show' />
            <FormControl variant="standard" style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <InputLabel>Course Category</InputLabel> */}
                <Select value={store.currentShownCSType} onChange={(e) => store.updateSelectedCategory(e.target.value)} label='Course Category' style={{ paddingLeft: '5px' }}>
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
                <g id='table'>
                    <g id='header' />
                    <g id='body' />
                    <g id='rowgrid' />
                </g>
            </svg>
        </Grid>
    </Grid>;

};

export default observer(TrendContainer);
