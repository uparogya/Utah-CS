import Box from '@mui/material/Box';
import { Typography, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import { StickyTableContainer } from "../GeneralComponents";
import Modal from '@mui/material/Modal';
import { FC, useContext } from "react";
// import Store from "../../Interface/Store";
import { DataContext } from "../../App";
import { generateCourseList } from "../TrendComponent/TrendContainer";
import { CourseCategoryColor } from "../../Preset/Colors";
import { courseTitle, ModalTitleBar } from "../FrequentlyUsedComponents/FrequentlyUsedComponents";

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
};

interface CourseInfoModalProps {
    courseType: string;
    onClose: () => void;
}

// export const courseTitle = (courseType: string) => {
//   if(courseType == 'CSC'){
//     return 'Core CS';
//   }else if(courseType == 'CSB'){
//     return 'Basic CS';
//   }else if(courseType == 'CSA'){
//     return 'Advanced CS';
//   }else if(courseType == 'CSR'){
//     return 'Related CS';
//   }else if(courseType == 'CS'){
//     return 'All CS';
//   }else{
//     return null;
//   }
// }

const CourseInfoModal: FC<CourseInfoModalProps> = ({ courseType, onClose }) => {

    // const store = useContext(Store);
    const courseCateData = useContext(DataContext).courseList;

    const generateList = () => {
        return generateCourseList(courseType, courseCateData).map(courseInfo => 
            <TableRow key={courseInfo[0]}>
                <TableCell>
                    {courseInfo[0]}
                </TableCell>
                <TableCell>
                    {courseInfo[1]}
                </TableCell>
            </TableRow>
        );
    };

  return (
    <div>
      <Modal
        open={true}
        onClose={onClose}
        aria-labelledby="Courses Under Category"
        aria-describedby="All Courses & Codes"
      >
        <Box sx={style}>
          {ModalTitleBar(courseTitle(courseType) + " Courses", CourseCategoryColor[courseType], onClose)}
          {/* <Typography id="Courses Under Category" variant="h6" component="h2" style={{color:CourseCategoryColor[courseType]}}>
            {courseTitle(courseType)} Courses
          </Typography> */}
          <Typography id="All Courses & Codes" sx={{ mt: 2 }}>
            <StickyTableContainer>
                <Table style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }} stickyHeader aria-label="sticky table">
                    <TableHead style={{backgroundColor: 'dimgray'}}>
                        <TableRow>
                            <TableCell style={{fontWeight: 'bolder', color:CourseCategoryColor[courseType]}}>
                                Course Code
                            </TableCell>
                            <TableCell style={{fontWeight: 'bolder', color:CourseCategoryColor[courseType]}}>
                                Course Name
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {generateList()}
                    </TableBody>
                </Table>
            </StickyTableContainer>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default CourseInfoModal;