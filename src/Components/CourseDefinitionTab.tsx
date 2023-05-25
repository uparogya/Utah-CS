import { FC, useContext } from "react";
import Store from "../Interface/Store";
import { Grid, List, ListItem, Typography } from "@mui/material";
import { DataContext, TableTitle } from "../App";
import { generateCourseList } from "./TrendComponent/TrendContainer";
import { observer } from "mobx-react-lite";
import ArticleIcon from '@mui/icons-material/Article';

const CourseDefinitionTab: FC = () => {

    const store = useContext(Store);
    const courseCateData = useContext(DataContext).courseList;


    const generateList = () => {
        return generateCourseList(store.currentShownCSType, courseCateData).map(courseInfo => <ListItem key={courseInfo[0]}>{courseInfo[1]}</ListItem>);
    };

    return (
        // <Grid container>
        //     <Grid xs={3} style={{ padding: '5px' }}>
        //         <TableTitle color={'primary'} children={`${store.currentShownCSType} Courses`} />
        //         <List style={{ maxHeight: '45vh', overflow: 'auto' }}>
        //             {generateList()}
        //         </List>
        //     </Grid>
        //     <Grid xs={9}>
        <div style={{ padding: '20px' }}>
            <Typography style={{ textAlign: 'left' }} color='#3d3d3d'>
                <b>All CS Courses</b> - includes all courses connected to computer science: Core CS and Related CS courses.
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
                <div style={{ float: 'left' }}>
                    Link to <a href="https://docs.google.com/spreadsheets/d/1vjRWlFjWpiI3693YyfJjWGzG95QnKhzD3JTz2yuprtc/edit#gid=0"><ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize='small' />Course Description</a>
                </div>

                <div style={{ float: 'right' }}>
                    Link to  <a href="https://drive.google.com/file/d/1ALKifSimEcPzN3y_m_SU-PJ-yVO_K7tu/view"><ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize='small' />Technical Report</a>
                </div>
            </Typography>
        </div>
        //    </Grid>
        // </Grid>
    );
};

export default observer(CourseDefinitionTab);
