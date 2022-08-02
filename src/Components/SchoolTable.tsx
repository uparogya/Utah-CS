import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from "@mui/material";
import { csv } from "d3-fetch";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
import Store from "../Interface/Store";
type Props = {

};

const SchoolTable: FC<Props> = ({ }: Props) => {
    const [schoolCSOffer, setSchoolCSOffer] = useState([]);

    const [schoolDemographic, setSchoolDemographic] = useState([]);

    const store = useContext(Store);

    useEffect(() => {
        // shool offering
        csv("/data/schoolOffer.csv").then((schoolCSOfferInput) => {
            // console.log(schoolCSOfferInput);
            stateUpdateWrapperUseJSON(schoolCSOffer, schoolCSOfferInput, setSchoolCSOffer);
        });

        csv("/data/schoolDemo.csv").then((schoolDemo) => {
            const schoolDemoCopy = schoolDemo.filter(d => d['LEA TYPE'] === 'District').map((schoolEntry) => {
                const totalHS = parseInt(schoolEntry['Grade_9'] || '0') + parseInt(schoolEntry['Grade_10'] || '0') + parseInt(schoolEntry['Grade_11'] || '0') + parseInt(schoolEntry['Grade_12'] || '0');
                return {
                    ...schoolEntry,
                    Female: `${parseInt(schoolEntry['Female'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                    Male: `${parseInt(schoolEntry['Male'] || '0') / parseInt(schoolEntry['Total K-12'] || '0') * totalHS}`,
                    'Total-HS': `${totalHS}`
                };
            }).filter(d => parseInt(d['Total-HS']) > 0);
            stateUpdateWrapperUseJSON(schoolDemographic, schoolDemoCopy, setSchoolDemographic);
        });
    }, []);

    const generateSchoolEntry = (schoolName: string, totalStudents: string) => {
        return (
            <>
                <TableRow>
                    <TableCell>{schoolName}</TableCell>
                    <TableCell>{totalStudents}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </>
        );
    };


    return <TableContainer component={Container}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
            <TableHead>
                <TableRow>

                    <TableCell>School Name</TableCell>
                    <TableCell align="right">Total Students</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {store.selectedDistricts.length > 0 ?
                    schoolDemographic.filter(d => store.selectedDistricts.includes(d['LEA Name'])).map((schoolEntry) => generateSchoolEntry(schoolEntry['School Name'], schoolEntry['Total-HS']))

                    : schoolDemographic.map((schoolEntry) => generateSchoolEntry(schoolEntry['School Name'], schoolEntry['Total-HS']))}
            </TableBody>
        </Table>
    </TableContainer>;
};

export default observer(SchoolTable);