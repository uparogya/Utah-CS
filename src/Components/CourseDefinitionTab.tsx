import { FC, useContext, useState } from "react";
import Store from "../Interface/Store";
import { Grid, List, ListItem, Typography, Card, CardContent, Button } from "@mui/material";
import { DataContext, TableTitle } from "../App";
import { generateCourseList } from "./TrendComponent/TrendContainer";
import { observer } from "mobx-react-lite";
import ArticleIcon from '@mui/icons-material/Article';
import styled from '@emotion/styled';
import { CourseCategoryColor } from "../Preset/Colors";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import PieChartIcon from '@mui/icons-material/PieChart';
import CourseInfoModal from "./CourseDescriptionComponent/CourseInfoModal";
import CoursePieChartDisplay from "./CourseDescriptionComponent/CoursePieChartDisplay";

interface CategoryCardProps {
    categoryKey: string;
}

const CategoryTitle = styled(Typography)((props: CategoryCardProps) => ({
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '15px',
    color: CourseCategoryColor[props.categoryKey],
}));

const CategoryDescription = styled(Typography)({
    fontSize: '14px',
    fontWeight: 'lighter'
})

const CategoryCard = styled(Card)((props: CategoryCardProps) => ({
    width: '220px',
    height: '220px',
    padding: '20px',
    margin: '20px',
    borderRadius: '8px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: CourseCategoryColor[props.categoryKey],
}));

const RevealData = styled(IconButton)((props: CategoryCardProps) => ({
    marginTop: '-5px',
    color: CourseCategoryColor[props.categoryKey],
    marginLeft: '-4px'
}));

const CourseDefinitionTab: FC = () => {

    const store = useContext(Store);
    const courseCateData = useContext(DataContext).courseList;

    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [pieChartCourse, setPieChartCourse] = useState<string | null>(null);

    const openModal = (courseType: string) => {
        setSelectedCourse(courseType);
      };
    
      const closeModal = () => {
        setSelectedCourse(null);
      };

      const openPieChart = (courseType: string) => {
        setPieChartCourse(courseType);
      };
    
      const closePieChart = () => {
        setPieChartCourse(null);
      };


    const generateList = () => {
        return generateCourseList(store.currentShownCSType, courseCateData).map(courseInfo => <ListItem key={courseInfo[0]}>{courseInfo[1]}</ListItem>);
    };

    return (
    <Grid container direction="row" justifyContent={'center'} alignContent={'center'}>
        <Grid item md={4}>
            <Grid container direction="column" alignContent={'center'} justifyContent={'space-around'} style={{'height':'100%'}}>
                <Grid item>
                    <CategoryCard categoryKey='CS'>
                        <CardContent>
                            <CategoryTitle categoryKey='CS'>
                                <RevealData categoryKey='CS' onClick={() => openPieChart('CS')} aria-label="info">
                                    <PieChartIcon />
                                </RevealData>
                                All CS
                                <RevealData categoryKey='CS' onClick={() => openModal('CS')} aria-label="info">
                                    <InfoIcon />
                                </RevealData>
                            </CategoryTitle>
                            <CategoryDescription>
                                Includes all courses connected to computer science: <b style={{color:CourseCategoryColor['CSC']}}>Core CS</b> and <b style={{color:CourseCategoryColor['CSR']}}>Related CS</b> courses. 
                                <br></br><br></br>
                                <a href="https://docs.google.com/spreadsheets/d/1vjRWlFjWpiI3693YyfJjWGzG95QnKhzD3JTz2yuprtc/edit#gid=0" target="_blank" rel="noopener noreferrer"><ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize='small' /> Course Description</a>
                                <br></br>
                                <a href="https://drive.google.com/drive/folders/1s7HDlOPJdgttVf39jmB4OwiipTal5jht" target="_blank" rel="noopener noreferrer"><ArticleIcon style={{ verticalAlign: 'text-bottom' }} fontSize='small' /> Infographics From Funded LEAs</a>
                            </CategoryDescription>
                        </CardContent>
                    </CategoryCard>
                </Grid>
            </Grid>
        </Grid>

        <Grid item md={4}>
            <Grid container direction="column" alignContent={'center'}>
                <Grid item>
                    <CategoryCard categoryKey='CSC'>
                        <CardContent>
                            <CategoryTitle categoryKey='CSC'>
                                <RevealData categoryKey='CSC' onClick={() => openPieChart('CSC')} aria-label="info">
                                    <PieChartIcon />
                                </RevealData>
                                Core CS
                                <RevealData categoryKey='CSC' onClick={() => openModal('CSC')} aria-label="info">
                                    <InfoIcon />
                                </RevealData>
                            </CategoryTitle>
                            <CategoryDescription>These courses directly teach fundamental computer science or programming skills. They are divided into two categories: <b style={{color:CourseCategoryColor['CSB']}}>Basic CS</b> and <b style={{color:CourseCategoryColor['CSA']}}>Advanced CS</b>.</CategoryDescription>
                        </CardContent>
                    </CategoryCard>
                </Grid>
                <Grid item>
                    <CategoryCard categoryKey='CSR'>
                        <CardContent>
                            <CategoryTitle categoryKey='CSR'>
                                <RevealData categoryKey='CSR' onClick={() => openPieChart('CSR')} aria-label="info">
                                    <PieChartIcon />
                                </RevealData>
                                Related CS
                                <RevealData categoryKey='CSR' onClick={() => openModal('CSR')} aria-label="info">
                                    <InfoIcon />
                                </RevealData>
                            </CategoryTitle>
                            <CategoryDescription>The emphasis of these courses is on the application, rather than the skills, of computer science in a variety of settings.</CategoryDescription>
                        </CardContent>
                    </CategoryCard>
                </Grid>
            </Grid>
        </Grid>

        <Grid item md={4}>
            <Grid container direction="column" alignContent={'center'}>
                <Grid item>
                    <CategoryCard categoryKey='CSB'>
                        <CardContent>
                            <CategoryTitle categoryKey='CSB'>
                                <RevealData categoryKey='CSB' onClick={() => openPieChart('CSB')} aria-label="info">
                                    <PieChartIcon />
                                </RevealData>
                                Basic CS
                                <RevealData categoryKey='CSB' onClick={() => openModal('CSB')} aria-label="info">
                                    <InfoIcon />
                                </RevealData>
                            </CategoryTitle>
                            <CategoryDescription>Introductory CS Courses for those with no prior experience in the area.</CategoryDescription>
                        </CardContent>
                    </CategoryCard>
                </Grid>
                <Grid item>
                    <CategoryCard categoryKey='CSA'>
                        <CardContent>
                            <CategoryTitle categoryKey='CSA'>
                                <RevealData categoryKey='CSA' onClick={() => openPieChart('CSA')} aria-label="info">
                                    <PieChartIcon />
                                </RevealData>
                                Advanced CS
                                <RevealData categoryKey="CSA" onClick={() => openModal('CSA')} aria-label="info">
                                    <InfoIcon />
                                </RevealData>
                            </CategoryTitle>
                            <CategoryDescription>Courses intended for those with prior experience.</CategoryDescription>
                        </CardContent>
                    </CategoryCard>
                </Grid>
            </Grid>
        </Grid>

        {selectedCourse && (
            <CourseInfoModal courseType={selectedCourse} onClose={closeModal} />
        )}
        {pieChartCourse && (
            <CoursePieChartDisplay courseType={pieChartCourse} onClose={closePieChart} />
        )}
    </Grid>
    );
};

export default observer(CourseDefinitionTab);
