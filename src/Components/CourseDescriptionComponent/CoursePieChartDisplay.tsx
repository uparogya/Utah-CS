import Box from '@mui/material/Box';
import { Typography, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import { StickyTableContainer } from "../GeneralComponents";
import Modal from '@mui/material/Modal';
import { FC, useContext, useEffect, useState } from "react";
import { CourseCategoryColor } from "../../Preset/Colors";
import { courseTitle } from './CourseInfoModal';
import { DataContext } from "../../App";
import { findAttribute } from '../../Interface/AttributeFinder';
import Store from '../../Interface/Store';
import { stateUpdateWrapperUseJSON } from '../../Interface/StateChecker';
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

    const courseData = useContext(DataContext).course;
    const courseAttributeFinder = (attributeName: string, selectedRow: (string | number)[]) =>
        findAttribute(attributeName, courseData[1], selectedRow);
    
    const [sortUp, setSortUp] = useState(true);
    const [sortedData, setSortedData] = useState(courseData);

    const store = useContext(Store);

    useEffect(() => {
        let newSortedData = [...courseData.filter(row =>
            categoryMatch[courseType].includes((row[0] as string)))];
    
        // Sort the course data based on the "Total" attribute
        newSortedData.sort((a, b) => {
            let aTotal = +courseAttributeFinder('Total', a);
            let bTotal = +courseAttributeFinder('Total', b);
            return sortUp ? bTotal - aTotal : aTotal - bTotal;
        });
    
        // Select the top 5 courses
        const topFiveCourses = newSortedData.slice(0, 5);
    
        // Update the state with the sorted data containing the top 5 courses
        setSortedData(topFiveCourses);
    }, [courseData, sortUp, courseType]); // Removed sortPercentage from dependency array

    interface DataItem {
      id: number;
      value: number;
      label?: string;
    }

    const [data, setData] = useState<DataItem[]>([]);

    useEffect(() => {
      const newDataArray: DataItem[] = sortedData.map((course, index) => {
        // Check if course[3] is not null before calling toString()
        const label = course[3] !== null ? course[3].toString() : '';
        return {
          id: index,
          value: typeof course[4] === 'number' ? course[4] : Number(course[4]),
          label: label // Ensure label is always a string or undefined
        };
      });
    
      setData(newDataArray);
    }, [sortedData]);
    

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
          <div style={{marginLeft: '-10vw'}}>
          <PieChart
            series={[
              {
                data: data,
              },
            ]}
            width={750}
            height={200}
          />
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CoursePieChartDisplay;