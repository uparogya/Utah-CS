import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { select } from 'd3-selection';
import { DataContext, TableTitle, SectionTitle } from "../../App";
import { scaleLinear, scalePoint } from "d3-scale";
import { PossibleCategories, PossibleSchoolYears } from "../../Preset/Constants";
import { findAttribute } from "../../Interface/AttributeFinder";
import { max } from "d3-array";
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from "d3-shape";
import { CourseCategoryColor, LightGray } from "../../Preset/Colors";
import { FormControl, Grid, List, ListItem, MenuItem, Select, Container } from "@mui/material";
import 'd3-transition';
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { stateUpdateWrapperUseJSON } from "../../Interface/StateChecker";
import { format } from "d3-format";
import { computeTextOutcome } from "../CellComponents/PercentageChart";
import SortableHeader from "../CellComponents/SortableHeader";
import { FunctionCell, StickyTableContainer } from "../GeneralComponents";
import { Table, TableHead, TableRow, TableBody,TableCell, TableContainer, FormControlLabel, Paper } from "@mui/material";
import PercentageChart from "../CellComponents/PercentageChart";



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
    const output = courseCategorization.filter(courseInfo =>
        includedCateList.includes(courseInfo[2] as string));
    output.sort((a, b) => (a[1].toString()).localeCompare(b[1].toString()));
    return output;

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
    //const spaceBetweenChartAndTable = 10;
    //const chartHeight = 300;

    const store = useContext(Store);

    
    const courseCategoryLabel = `${PossibleCategories.find(d => d.key === store.currentShownCSType)?.shortName}`;

    //Students enrolled in ${courseCategoryLabel}
    const RequiredDemographic = [`TotalStudents`, 'Female', 'Hispanic', 'EconDisadvantaged', 'Disability','ESL'];
    const RowHeight = 30;
    const Margin = { top: 50, left: 100, right: 50, bottom: (RequiredDemographic.length + 0.5) * 10};
    const currentCSType = PossibleCategories.find(d => d.key === store.currentShownCSType);

    const currentCSTypeShortName = currentCSType?.shortName || '';
    const currentCSTypeColor = CourseCategoryColor[store.currentShownCSType];


    const courseCateData = useContext(DataContext).courseList;
    const tableCellStyle = {
      color: currentCSTypeColor, // Use the color you've defined for currentCSType
    };


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
            // code is similar to Overview Tab map code
            const svgSelection = select(svgRef.current);
            // const svgWidth = (svgSelection.node() as any).parentNode.clientWidth;
                const parentWidth = (svgSelection.node() as any).parentNode.clientWidth;
                const thresholdWidth = 900;
                const svgWidth = Math.max(parentWidth, thresholdWidth);
            //const svgHeight = (svgSelection.node() as any).parentNode.clientHeight;
            const svgHeight = 550; 

            svgSelection.attr('width', svgWidth)
                .attr('height', svgHeight)
                .attr('viewBox', `0 0 ${svgWidth} ${svgHeight+20}`)
                .attr('style', 'max-width: 100%; height: auto;');

            //Construct the data to visualize
            const tempData: { [key: string]: number | string, }[] = PossibleSchoolYears.map((year) => ({
                year: year,
                TotalStudents: stateAttributeFinder(`${store.currentShownCSType}: Total`, year),
                Female: stateAttributeFinder(`${store.currentShownCSType}: Female`, year),
                Hispanic: stateAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`, year),
                EconDisadvantaged: stateAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`, year),
                Disability: stateAttributeFinder(`${store.currentShownCSType}: Disability`, year),
                ESL: stateAttributeFinder(`${store.currentShownCSType}: Eng. Learners`, year),
                StateTotal: stateAttributeFinder(`TOTAL: Total`, year),
            })
            );

            const tableHeaders = Object.keys(tempData[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ));

            const studentEnrollmentAxis = scaleLinear()
                .domain([0, max(tempData, d => d.TotalStudents as number) || 0])
                .range([svgHeight - Margin.bottom, Margin.top + 20])
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
                .attr('font-size', '1rem');

            // draw student axis
            svgSelection.select('#studentAxis')
                .attr('font-size', '1rem')
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

         
            svgSelection.select('#circles')
                .attr('fill', CourseCategoryColor[store.currentShownCSType])
                .selectAll('circle')
                .data(tempData)
                .join('circle')
                .attr('cy', d => studentEnrollmentAxis((d.TotalStudents as number)))
                .attr('cx', d => yearScale(typeof d.year === "string" ? d.year : d.year.toString()) as any)
                .attr('r', 3);

            // below line removes any old labels before making new ones
            svgSelection.select('#labels').html("");
            svgSelection.select('#labels')
                .attr('font-size', '1rem')
                .selectAll()
                .data(tempData)
                .join('text')
                .attr('transform', d => `translate(${yearScale((d.year as string))},${studentEnrollmentAxis((d.TotalStudents as number))})`)
                .text(d => typeof d.TotalStudents === "number" ? d.TotalStudents.toLocaleString("en-US") : d.TotalStudents)
                .attr('fill', 'black')
                .each(function() {
                    select(this).attr('text-anchor', 'middle').attr('dy', '1em');
                });


                svgSelection.select('#graphTitle').html(""); // Clear the previous title
                // svgSelection.select('#graphTitle')
                //     .append('text')
                //     .attr('font-size', '1.3rem') 
                //     .attr('font-weight', 'bolder') 
                //     .attr('x', Margin.left / 2 + 200) 
                //     .attr('y', Margin.top /1.25) 
                //     .style('text-anchor', 'middle')
                //     .attr('fill', CourseCategoryColor[store.currentShownCSType]) // Set the fill color based on the selected course category
                //     .text(`${PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName} Statewide Enrollment Trends`);
                
            

            svgSelection.select('#studentAxisTitle').html(""); // clear title
            svgSelection.select('#studentAxisTitle')
                .append('text')
                .attr('font-size', '0.98rem')
                .attr('x', -((svgHeight - Margin.bottom + Margin.top) / 2)) 
                .attr('y', Margin.left - 70)  
                .attr('transform', 'rotate(-90)') 
                .style('text-anchor', 'middle') 
                .text(`Total Students in ${PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName} Courses`);
                
            svgSelection.select('#yearAxisTitle').html(""); // clear title
            svgSelection.select('#yearAxisTitle')
                .append('text')
                .attr('font-size', '0.98rem')
                .attr('x', (svgWidth-Margin.right)/2)
                .attr('y', svgHeight - Margin.bottom+45)
                .text('School Year');
            

            stateUpdateWrapperUseJSON(dataToVisualize, tempData, setData);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [svgRef, store.currentShownCSType]);

    // // // update text based on state

    
    const generateTable = () => {
        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {dataToVisualize.map((row, index) => (
                    <TableCell key={index}><strong>{row.year}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
              <TableRow>
                <TableCell > {store.showPercentage ? "%" : "#"} of Total Utah Students Enrolled in <span style={{ color: currentCSTypeColor }}>{currentCSTypeShortName}</span></TableCell>
                {dataToVisualize.map((row, index) => (
                  <TableCell key={index} align="left">
                    {typeof row.TotalStudents === 'number' && typeof row.StateTotal === 'number'
                      ? store.showPercentage ?  `${((row.TotalStudents / row.StateTotal) * 100).toFixed(2)}%`
                      : (row.TotalStudents)
                      :'N/A'}
                  </TableCell>
                ))}
              </TableRow>

              {RequiredDemographic.slice(1).map((demoName: string, rowIndex: number) => (
              <TableRow key={rowIndex}>
              <TableCell> {store.showPercentage ? "%" : "#"}  of {addSpaces(demoName)} <span style={{ color: currentCSTypeColor }}>{currentCSTypeShortName}</span> Students</TableCell>
              {dataToVisualize.map((row, colIndex) => (
                <TableCell key={colIndex} align="left">
                    {typeof row[demoName] === 'number' && typeof row.TotalStudents === 'number'
                    ? store.showPercentage ? `${((row[demoName] as number / row.TotalStudents as number) * 100).toFixed(2)}%`
                    : (row[demoName] as number)
                    : 'N/A'}
                
                </TableCell>
              ))}
            </TableRow>
          ))}

              </TableBody>
            </Table>
          </TableContainer>
        );
      };
/* use showPercentage to check if it is # or % then perform calculation accordingly
  {typeof row[demoName] === 'number' && typeof row.TotalStudents === 'number'
                    ? `${((row[demoName] as number / row.TotalStudents as number) * 100).toFixed(2)}%`
                    : 'N/A'} 

*/
    useEffect(() => {
        if (svgRef.current && dataToVisualize.length) {
            const svgSelection = select(svgRef.current);
            svgSelection.select('#body')
                .selectAll('g')
                .data(dataToVisualize)
                .join('g')
                .selectAll('text')
                // store.showPercentage ? (demoName === 'TotalStudents' ? (+d[demoName]) / (+d.StateTotal) : (+d[demoName]) / (+d.TotalStudents)) : d[demoName])
                .data(d => RequiredDemographic.map((demoName) => computeTextOutcome(d[demoName], demoName === 'TotalStudents' ? (+d[demoName]) / (+d.StateTotal) : (+d[demoName]) / (+d.TotalStudents), store.showPercentage)))
                // .data(d => RequiredDemographic.map((demoName) => d[demoName]))
                .join('text')
                .text(t => t)
                .attr('alignment-baseline', 'hanging')
                .attr('font-size', '1rem')
                .attr('text-anchor', 'middle')
                .attr('y', (_, i) => (i) * RowHeight);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.showPercentage]);


    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <svg ref={svgRef} >
                  <g id='graphTitle' />
                  <g id='yearAxis' />
                 <g id='yearAxisTitle' />
                              <g id='studentAxis' />
                              <g id='studentAxisTitle' />
                              <g id='lines' />
                              <g id='circles' />
                              <g id='labels' />
                              <g id='legend' />
                            </svg>
                            {generateTable() }
                            </div>
                    
                      );                      
                      
                            }
                      
                      
        

export default observer(TrendContainer);

