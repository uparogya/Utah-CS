import { FC, useContext } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { findAttribute } from "../../Interface/AttributeFinder";
import Store from "../../Interface/Store";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { CourseCategoryColor } from "../../Preset/Colors";
import { courseTitle } from "../CourseDescriptionComponent/CourseInfoModal";
import { StickyTableContainer } from "../GeneralComponents";
import { format } from "d3-format";

interface DistrictDataModalProps {
    districtEntry: Array<string | number>;
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

const DistrictDataModal: FC<DistrictDataModalProps> = ({ districtEntry, titleEntry, onClose }) => {
    const store = useContext(Store);

    const districtAttributeFinder = (attributeName: string) =>
        findAttribute(attributeName, titleEntry, districtEntry);

    return (
        <div>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="Courses Under Category"
                aria-describedby="All Courses & Codes"
            >
                <Box sx={style}>
                    <Typography id="Courses Under Category" variant="h6" component="h2" style={{color:CourseCategoryColor[store.currentShownCSType], marginBottom: '25px'}}>
                        {districtAttributeFinder('District Name')} {/*- {courseTitle(store.currentShownCSType)}*/}
                    </Typography>
                    <div style={{backgroundColor:'rgba(0,0,0,0.05)'}}>
                        <StickyTableContainer>
                            <Table style={{ padding: '0px', border: '1px solid rgba(0,0,0,0.05)' }} stickyHeader aria-label="sticky table">
                                <TableHead style={{backgroundColor: 'dimgray'}}>
                                    <TableRow>
                                        <TableCell style={{fontWeight: 'bolder', color:CourseCategoryColor[store.currentShownCSType]}}>
                                            Race/Category
                                        </TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color:CourseCategoryColor[store.currentShownCSType]}}>
                                            Number of Students
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>White</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: White`) >= 0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: White`)) : (districtAttributeFinder(`${store.currentShownCSType}: White`))}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Hispanic</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`) >=0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`)) : districtAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Other Races</TableCell>
                                        <TableCell>{format(',')((districtAttributeFinder(`${store.currentShownCSType}: Total`) >= 0 ? districtAttributeFinder(`${store.currentShownCSType}: Total`) : 0) - (districtAttributeFinder(`${store.currentShownCSType}: White`) >= 0 ? districtAttributeFinder(`${store.currentShownCSType}: White`) : 0) - (districtAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`) >=0 ? districtAttributeFinder(`${store.currentShownCSType}: Hispanic or Latino`) : 0))}</TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: CourseCategoryColor[store.currentShownCSType], color: 'white'}}>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>Total {courseTitle(store.currentShownCSType)} Enrollment</TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>{districtAttributeFinder(`${store.currentShownCSType}: Total`) >=0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Total`)) : districtAttributeFinder(`${store.currentShownCSType}: Total`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Econ. Disadvantaged</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) >=0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)) : districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Disability</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: Disability`) >= 0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Disability`)) : districtAttributeFinder(`${store.currentShownCSType}: Disability`)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>ESL</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) >= 0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)) : districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)}</TableCell>
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

export default DistrictDataModal;