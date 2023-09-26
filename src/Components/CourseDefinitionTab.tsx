import { FC, useContext } from "react";
import Store from "../Interface/Store";
import { Grid, List, ListItem, Typography, Card, CardContent } from "@mui/material";
import { DataContext, TableTitle } from "../App";
import { generateCourseList } from "./TrendComponent/TrendContainer";
import { observer } from "mobx-react-lite";
import ArticleIcon from '@mui/icons-material/Article';
import styled from '@emotion/styled';

const CategoryTitle = styled(Typography)({
    fontSize: '1.5rem'
});

const CategoryCard = styled(Card)({
    width: '200px',
    margin: 10
});

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
       
    <Grid container sx={{paddingTop: '20px'}}>
    <Grid container item justifyContent="space-evenly">
        <CategoryCard>
            <CardContent>
                <CategoryTitle>All CS Courses</CategoryTitle>
                <Typography>Includes all courses connected to computer science: Core CS and Related CS courses.</Typography>
            </CardContent>
        </CategoryCard>
        <CategoryCard>
            <CardContent>
                <CategoryTitle>Core CS Courses</CategoryTitle>
                <Typography>These courses directly teach fundamental computer science or programming skills. They are divided into two categories: Basic CS and Advanced CS.</Typography>
            </CardContent>
        </CategoryCard>
    </Grid>
    <Grid container item justifyContent="space-evenly">
        <CategoryCard>
            <CardContent>
                <CategoryTitle>Related CS Courses</CategoryTitle>
                <Typography>The emphasis of these courses is on the application, rather than the skills, of computer science in a variety of settings.</Typography>
            </CardContent>
        </CategoryCard>
        <CategoryCard>
            <CardContent>
                <CategoryTitle>Basic CS Courses</CategoryTitle>
                <Typography>Introductory CS Courses for those with no prior experience in the area.</Typography>
            </CardContent>
        </CategoryCard>
        <CategoryCard>
            <CardContent>
                <CategoryTitle>Advanced CS Courses</CategoryTitle>
                <Typography>Courses intended for those with prior experience.</Typography>
            </CardContent>
        </CategoryCard>
    </Grid>
    <Grid container item padding={2} justifyContent="space-evenly">
        <div>
            Link to <a href="https://docs.google.com/spreadsheets/d/1vjRWlFjWpiI3693YyfJjWGzG95QnKhzD3JTz2yuprtc/edit#gid=0"><ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize='small' />Course Description</a>
        </div>
        <div>
            Link to  <a href="https://drive.google.com/file/d/1ALKifSimEcPzN3y_m_SU-PJ-yVO_K7tu/view"><ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize='small' />Technical Report</a>
        </div>
    </Grid>
</Grid>
    );
};

export default observer(CourseDefinitionTab);
