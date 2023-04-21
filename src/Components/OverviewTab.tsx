import { Container, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { DataContext } from "../App";
import { findAttribute } from "../Interface/AttributeFinder";
import { format } from "d3-format";
import Store from "../Interface/Store";


const OverviewTab: FC = () => {

    const allData = useContext(DataContext);
    const store = useContext(Store);


    // find schools that offer cs core classes
    const findCSCOfferings = () => {
        const cscOfferingResult = allData.school.slice(2).filter((schoolEntry) => findAttribute('CSC: Number of Courses Offered', allData.school[1], schoolEntry));
        return cscOfferingResult.length / allData.school.slice(2).length;
    };

    const findCSStudents = () => {
        //Total students
        const totalStudent = findAttribute('TOTAL: Total', allData.state[1], allData.state.filter(row => row[0] === store.schoolYearShowing)[0]);
        // Total CS Students
        const totalCSStudent = findAttribute('CSC: Total', allData.state[1], allData.state.filter(row => row[0] === store.schoolYearShowing)[0]);
        return totalCSStudent / totalStudent;
    };


    return <Container>
        <div>
            <Typography variant="h3" gutterBottom>
                {allData.school.slice(2).length} of High Schools
            </Typography>
            <Typography variant="h3" gutterBottom>
                {format(',.2%')(findCSCOfferings())} of schools offering CS Core classes
            </Typography>
            <Typography variant="h3" gutterBottom>
                {format(',.2%')(findCSStudents())} of students taking CS Core classes
            </Typography>
            <Typography variant="h3" gutterBottom>
                {allData.courseList.filter((c) => c[2] === 'CSB' || c[2] === 'CSA').length} of CS core classes
            </Typography>
        </div>
    </Container>;
};

export default observer(OverviewTab);
