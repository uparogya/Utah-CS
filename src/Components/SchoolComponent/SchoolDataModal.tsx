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
                            <Table style={{ padding: '0px', border: '1px solid rgba(0,0,0,0.05)' }} stickyHeader aria-label="sticky table">
                                <TableHead style={{backgroundColor: 'dimgray'}}>
                                    <TableRow>
                                        <TableCell style={{fontWeight: 'bolder', borderRight: '1px solid lightgray', color:CourseCategoryColor[store.currentShownCSType]}} rowSpan={2}> Category </TableCell>
                                        <TableCell style={{fontWeight: 'bolder', textAlign: 'center', color:CourseCategoryColor[store.currentShownCSType]}} colSpan={2}> Students </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bolder', color: CourseCategoryColor[store.currentShownCSType] }}> {courseTitle(store.currentShownCSType)} Courses </TableCell>
                                        <TableCell style={{ fontWeight: 'bolder', color: CourseCategoryColor[store.currentShownCSType] }}> District </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow style={{backgroundColor: CourseCategoryColor[store.currentShownCSType]}}>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>Total Enrollment</TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>{schoolAttributeFinder(`${store.currentShownCSType}: Total`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Total`)) : schoolAttributeFinder(`${store.currentShownCSType}: Total`)}</TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>{schoolAttributeFinder(`TOTAL: Total`) >=0 ? format(',')(schoolAttributeFinder(`TOTAL: Total`)) : schoolAttributeFinder(`TOTAL: Total`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Male</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Male`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Male`)) : schoolAttributeFinder(`${store.currentShownCSType}: Male`)}</TableCell>
                                        <TableCell>{schoolAttributeFinder(`TOTAL: Male`) >=0 ? format(',')(schoolAttributeFinder(`TOTAL: Male`)) : schoolAttributeFinder(`TOTAL: Male`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Female</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Female`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Female`)) : schoolAttributeFinder(`${store.currentShownCSType}: Female`)}</TableCell>
                                        <TableCell>{schoolAttributeFinder(`TOTAL: Female`) >=0 ? format(',')(schoolAttributeFinder(`TOTAL: Female`)) : schoolAttributeFinder(`TOTAL: Female`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Econ. Disadvantaged</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)) : schoolAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)}</TableCell>
                                        <TableCell>{schoolAttributeFinder(`TOTAL: Eco. Dis.`) >=0 ? format(',')(schoolAttributeFinder(`TOTAL: Eco. Dis.`)) : schoolAttributeFinder(`TOTAL: Eco. Dis.`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Disability</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Disability`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Disability`)) : schoolAttributeFinder(`${store.currentShownCSType}: Disability`)}</TableCell>
                                        <TableCell>{schoolAttributeFinder(`TOTAL: Disability`) >=0 ? format(',')(schoolAttributeFinder(`TOTAL: Disability`)) : schoolAttributeFinder(`TOTAL: Disability`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>ESL</TableCell>
                                        <TableCell>{schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) >=0 ? format(',')(schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)) : schoolAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)}</TableCell>
                                        <TableCell>{schoolAttributeFinder(`TOTAL: Eng. Learners`) >=0 ? format(',')(schoolAttributeFinder(`TOTAL: Eng. Learners`)) : schoolAttributeFinder(`TOTAL: Eng. Learners`)}</TableCell>
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