import { FC, useContext } from "react";
import Store from "../../Interface/Store";
import { findAttribute } from "../../Interface/AttributeFinder";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { CourseCategoryColor } from "../../Preset/Colors";
import { StickyTableContainer } from "../GeneralComponents";
import { courseTitle, ModalTitleBar } from "../FrequentlyUsedComponents/FrequentlyUsedComponents";
import { format } from "d3-format";

interface SchoolDataModalProps {
    schoolEntry: Array<string | number>;
    titleEntry: string[];
    onClose: () => void;
}

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

const SchoolDataModal: FC<SchoolDataModalProps> = ({ schoolEntry, titleEntry, onClose }) => {

    const store = useContext(Store);

    const schoolAttributeFinder = (attributeName: string) =>
        findAttribute(attributeName, titleEntry, schoolEntry);


    // DETAILS OF WHAT I AM DOING HERE IS IN DistrictDataModal.tsx
    const Total_Column_M_to_S: Record<string, number> = {
        'White': 0,
        'Hispanic': 0,
        'Asian': 0,
        'Black': 0,
        'Native American': 0,
        'Pacific Islander': 0,
        'Two or More Races': 0
    };

    const Total_Column_M_to_S_Attributes: Record<string, string> = {
        'Native American': 'TOTAL: American Indian or Alaska Native',
        'Asian': 'TOTAL: Asian',
        'Black': 'TOTAL: Black or African American',
        'Hispanic': 'TOTAL: Hispanic or Latino',
        'Pacific Islander': 'TOTAL: Native Hawaiian or Pacific Islander',
        'Two or More Races': 'TOTAL: Two or more races',
        'White': 'TOTAL: White'
    };

    Object.keys(Total_Column_M_to_S_Attributes).forEach(key => {
        Total_Column_M_to_S[key] = (schoolAttributeFinder(Total_Column_M_to_S_Attributes[key])>0) ? schoolAttributeFinder(Total_Column_M_to_S_Attributes[key]) : 0;
    });

    const sorted_Total_Column_M_to_S = Object.fromEntries(
        Object.entries(Total_Column_M_to_S).sort(([, valueA], [, valueB]) => valueB - valueA)
    );

    const TopTwoRace = Object.entries(sorted_Total_Column_M_to_S).slice(0,2);

    const Races_Students_Count: Record<string, number> = {
        'White': 0,
        'Hispanic': 0,
        'Asian': 0,
        'Black': 0,
        'Native American': 0,
        'Pacific Islander': 0,
        'Two or More Races': 0
    };

    const Races_Students_Attributes: Record<string, string> = {
        'Native American': `${store.currentShownCSType}: American Indian or Alaska Native`,
        'Asian': `${store.currentShownCSType}: Asian`,
        'Black': `${store.currentShownCSType}: Black or African American`,
        'Hispanic': `${store.currentShownCSType}: Hispanic or Latino`,
        'Pacific Islander': `${store.currentShownCSType}: Native Hawaiian or Pacific Islander`,
        'Two or More Races': `${store.currentShownCSType}: Two or more races`,
        'White': `${store.currentShownCSType}: White`
    };

    Object.keys(Races_Students_Attributes).forEach(key => {
        Races_Students_Count[key] = (schoolAttributeFinder(Races_Students_Attributes[key]))>0 ? schoolAttributeFinder(Races_Students_Attributes[key]) : 0;
    });

    const TopRaces = Object.fromEntries(
        Object.entries(Races_Students_Count).filter(([_, value]) => value > 0)
    );

    const TopTwoRaceInSchool = Object.entries(TopRaces).slice(0,2);

    const TableRowContent = () => {
        switch (TopTwoRaceInSchool.length) {
            case 2:
                return (<>
                    <TableRow>
                        <TableCell>{TopTwoRaceInSchool[0][0]}</TableCell>
                        <TableCell>{format(',')(TopTwoRaceInSchool[0][1])}</TableCell>
                        <TableCell>{(TopTwoRaceInSchool[0][1] >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((TopTwoRaceInSchool[0][1]/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{TopTwoRaceInSchool[1][0]}</TableCell>
                        <TableCell>{format(',')(TopTwoRaceInSchool[1][1])}</TableCell>
                        <TableCell>{(TopTwoRaceInSchool[1][1] >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((TopTwoRaceInSchool[1][1]/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Other Races</TableCell>
                        <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Total`) >= 0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Total`) - TopTwoRaceInSchool[0][1] - TopTwoRaceInSchool[1][1]) : 'N/A')}</TableCell>
                        <TableCell>{((schoolAttributeFinder(`${store.currentShownCSType}: Total`) - TopTwoRaceInSchool[0][1] - TopTwoRaceInSchool[1][1]) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? (((schoolAttributeFinder(`${store.currentShownCSType}: Total`) - TopTwoRaceInSchool[0][1] - TopTwoRaceInSchool[1][1])/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                    </TableRow>
                </>)
            case 1:
                return (<>
                    <TableRow>
                        <TableCell>{TopTwoRaceInSchool[0][0]}</TableCell>
                        <TableCell>{format(',')(TopTwoRaceInSchool[0][1])}</TableCell>
                        <TableCell>{(TopTwoRaceInSchool[0][1] >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((TopTwoRaceInSchool[0][1]/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{TopTwoRaceInSchool[0][0] == TopTwoRace[0][0] ? TopTwoRace[1][0] : TopTwoRace[0][0]}</TableCell>
                        <TableCell>{TopTwoRaceInSchool[0][0] == TopTwoRace[0][0] ? schoolAttributeFinder(Races_Students_Attributes[TopTwoRace[1][0]]) : schoolAttributeFinder(Races_Students_Attributes[TopTwoRace[0][0]])}</TableCell>
                        <TableCell>N/A</TableCell>
                    </TableRow>
                </>)
            default:
                return (<>
                <TableRow>
                    <TableCell>{TopTwoRace[0][0]}</TableCell>
                    <TableCell>{schoolAttributeFinder(Races_Students_Attributes[TopTwoRace[0][0]])}</TableCell>
                        <TableCell>N/A</TableCell>
                    </TableRow>
                <TableRow>
                    <TableCell>{TopTwoRace[1][0]}</TableCell>
                    <TableCell>{schoolAttributeFinder(Races_Students_Attributes[TopTwoRace[1][0]])}</TableCell>
                        <TableCell>N/A</TableCell>
                    </TableRow>
                </>)
        }
    }

    return(
        <div>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="School Data Modal"
                aria-describedby="School Data Modal"
            >
                <Box sx={style}>
                    {ModalTitleBar(schoolAttributeFinder('School Name'), CourseCategoryColor[store.currentShownCSType], onClose)}
                    <div style={{backgroundColor:'rgba(0,0,0,0.05)'}}>
                        <StickyTableContainer>
                            <Table style={{ padding: '0px', border: '1px solid rgba(0,0,0,0.05)' }} aria-label="sticky table">
                                <TableHead style={{backgroundColor: 'white'}}>
                                    <TableRow>
                                        <TableCell style={{fontWeight: 'bolder', borderRight: '1px solid lightgray', color:CourseCategoryColor[store.currentShownCSType]}} rowSpan={2}> Category </TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color:CourseCategoryColor[store.currentShownCSType]}} colSpan={2}> Students </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bolder', color: CourseCategoryColor[store.currentShownCSType] }}> # </TableCell>
                                        <TableCell style={{ fontWeight: 'bolder', color: CourseCategoryColor[store.currentShownCSType] }}> % </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow style={{backgroundColor: CourseCategoryColor[store.currentShownCSType]}}>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>Total {courseTitle(store.currentShownCSType)} Enrollment</TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>{schoolAttributeFinder(`${store.currentShownCSType}: Total`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Total`)) : schoolAttributeFinder(`${store.currentShownCSType}: Total`)}</TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>100%</TableCell>
                                    </TableRow>
                                    {
                                        (schoolAttributeFinder(`${store.currentShownCSType}: Male`) >= 0 && isNaN(schoolAttributeFinder(`${store.currentShownCSType}: Female`))) || schoolAttributeFinder(`${store.currentShownCSType}: Male`) > schoolAttributeFinder(`${store.currentShownCSType}: Female`) ? (
                                            <>
                                            <TableRow>
                                                <TableCell>Male</TableCell>
                                                <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Male`) >= 0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Male`)) : schoolAttributeFinder(`${store.currentShownCSType}: Male`)}</TableCell>
                                                <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Male`) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((schoolAttributeFinder(`${store.currentShownCSType}: Male`)/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Female</TableCell>
                                                <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Female`) >= 0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Female`)) : schoolAttributeFinder(`${store.currentShownCSType}: Female`)}</TableCell>
                                                <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Female`) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((schoolAttributeFinder(`${store.currentShownCSType}: Female`)/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                            </TableRow>
                                            </>
                                        ) : (
                                            <>
                                            <TableRow>
                                                <TableCell>Female</TableCell>
                                                <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Female`) >= 0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Female`)) : schoolAttributeFinder(`${store.currentShownCSType}: Female`)}</TableCell>
                                                <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Female`) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((schoolAttributeFinder(`${store.currentShownCSType}: Female`)/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Male</TableCell>
                                                <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Male`) >= 0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Male`)) : schoolAttributeFinder(`${store.currentShownCSType}: Male`)}</TableCell>
                                                <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Male`) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((schoolAttributeFinder(`${store.currentShownCSType}: Male`)/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                            </TableRow>
                                            </>
                                        )
                                    }
                                    {TableRowContent()}
                                    <TableRow>
                                        <TableCell>Econ. Disadvantaged</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)) : schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)}</TableCell>
                                        <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Disability</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Disability`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Disability`)) : schoolAttributeFinder(`${store.currentShownCSType}: Disability`)}</TableCell>
                                        <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Disability`) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((schoolAttributeFinder(`${store.currentShownCSType}: Disability`)/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>English Learner</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)) : schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)}</TableCell>
                                        <TableCell>{(schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) >0 && schoolAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)/schoolAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </StickyTableContainer>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default SchoolDataModal;