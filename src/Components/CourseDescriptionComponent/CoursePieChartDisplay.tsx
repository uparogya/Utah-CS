import Box from '@mui/material/Box';
import { Typography, useTheme, useMediaQuery } from '@mui/material';
import Modal from '@mui/material/Modal';
import { FC, useContext, useEffect, useState } from "react";
import { CourseCategoryColor } from "../../Preset/Colors";
import { courseTitle } from './CourseInfoModal';
import { DataContext } from "../../App";
import { findAttribute } from '../../Interface/AttributeFinder';
import { PieChart } from '@mui/x-charts/PieChart';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw',
  bgcolor: 'background.paper',
  border: '2px solid dimgray',
  boxShadow: 50,
  p: 4,
  overflow: 'scroll'
};

interface CoursePieChartDisplayProps {
    courseType: string;
    onClose: () => void;
}

const categoryMatch: { [key: string]: string[] } = {
    CSB: ['BASIC'],
    CSA: ['ADVANCED'],
    CSR: ['RELATED'],
    CSC: ['BASIC', 'ADVANCED'],
    CS: ['BASIC', 'ADVANCED', 'RELATED']
};

const CoursePieChartDisplay: FC<CoursePieChartDisplayProps> = ({ courseType, onClose }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const marginLeft = isMobile ? '-60vw' : '-20vw';

    const courseData = useContext(DataContext).course;
    const courseAttributeFinder = (attributeName: string, selectedRow: (string | number)[]) =>
        findAttribute(attributeName, courseData[1], selectedRow);
    
    const [sortUp, setSortUp] = useState(true);
    const [sortedData, setSortedData] = useState(courseData);
    const [sortedOtherData, setOtherData] = useState(courseData);

    var AllCoursesTotal = 0;

    useEffect(() => {
        let newSortedData = [...courseData.filter(row =>
            categoryMatch[courseType].includes((row[0] as string)))];
    
        // Sort the course data based on the "Total" attribute
        newSortedData.sort((a, b) => {
            let aTotal = +courseAttributeFinder('Total', a);
            let bTotal = +courseAttributeFinder('Total', b);
            AllCoursesTotal += sortUp ? bTotal - aTotal : aTotal - bTotal;
            return sortUp ? bTotal - aTotal : aTotal - bTotal;
        });
    
        // Select the top 5 courses
        const topFiveCourses = newSortedData.slice(0, 5);
        const otherCourses = newSortedData.slice(5);
    
        // Update the state with the sorted data containing the top 5 courses
        setSortedData(topFiveCourses);
        setOtherData(otherCourses);
    }, [courseData, sortUp, courseType]); // Removed sortPercentage from dependency array

    // console.log("All = " + AllCoursesTotal)
    // console.log(sortedData);

    interface DataItem {
      id: number;
      value: number;
      label?: string;
    }

    const [data, setData] = useState<DataItem[]>([]);

    var totalOtherCoursesValue = 0;

    for (const otherCourse of sortedOtherData) {
      const thisTotal = typeof otherCourse[4] === 'number' ? otherCourse[4] : 0
      totalOtherCoursesValue += thisTotal;
      AllCoursesTotal += thisTotal;
  }

  for (let index = 0; index < sortedData.length; index++) {
    const element = sortedData[index];
    AllCoursesTotal += typeof element[4] === 'number' ? element[4] : Number(element[4]);
  }

    useEffect(() => {
      const newDataArray: DataItem[] = sortedData.map((course, index) => {
        const label = course[3] !== null ? course[3].toString() : '';
        var thisCourseTotal = typeof course[4] === 'number' ? course[4] : Number(course[4]);
        var thisCoursePercentage = ((thisCourseTotal/AllCoursesTotal)*100).toFixed(2);
        return {
          id: index,
          value: typeof course[4] === 'number' ? course[4] : Number(course[4]),
          label: label + " - " + thisCoursePercentage + "%"
        };
      });

      const otherCoursesTotalDataItem: DataItem = {
        id: newDataArray.length,
        value: totalOtherCoursesValue,
        label: 'Other Courses - ' + ((totalOtherCoursesValue/AllCoursesTotal)*100).toFixed(2) + "%", 
    };

    const updatedDataArray = [...newDataArray, otherCoursesTotalDataItem];
    
      setData(updatedDataArray);
    }, [sortedData]);

    // console.log(totalOtherCoursesValue)


    

  return (
    <div>
      <Modal
        open={true}
        onClose={onClose}
        aria-labelledby="Courses Under Category"
        aria-describedby="All Courses & Codes"
      >
        <Box sx={style}>
          <Typography id="Courses Under Category" variant="h6" component="h2" style={{color:CourseCategoryColor[courseType]}}>
            Top 5 {courseTitle(courseType)} Courses
          </Typography>
          <div style={{ marginLeft }}>
          <PieChart
            colors={['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b']}
            series={[
              {
                data: data,
              },
            ]}
            width={900}
            height={200}
          />
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CoursePieChartDisplay;