import { FC, useContext } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { findAttribute } from "../../Interface/AttributeFinder";
import Store from "../../Interface/Store";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { CourseCategoryColor } from "../../Preset/Colors";
import { courseTitle, ModalTitleBar } from "../FrequentlyUsedComponents/FrequentlyUsedComponents";
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

    // WHAT I AM DOING
    // FIRST I AM FINDING THE TOP 2 RACES IN THE ENTIRE DISTRICT DESPITE OF WHAT COURSE CATEGORY IS CHOSEN (COLUMN H-N)
    // THEN I AN KEEPING THOSE TWO RACES IN THE VARIABLE: TopTwoRace
    // THEN I AM FINDING THE TOP 2 RACES IN THE COURSE CATEGORY: TopTwoRaceInDistrict
    // THE IDEA IS:
    // IF IT IS POSSILBE TO SHOW THE TOP 2 IN THE COURSE CATEGORY IN A DISTRICT, SHOW IT AND CALCULATE OTHER RACE POPULATION
    // IF NOT, SHOW ONE OF THEM WITH NUMBER AND OTHER ONE WITHOUT NUMBER
    // TO DECIDE WHAT TO SHOW WITHOUT NUMBER, SEE THE TopTwoRace AND USE THOSE TWO TO DISPLAY THE OTHER ROW
    // IF THERE ARE NONE WITH NUMBER, USE BOTH FROM THE TopTwoRace
    // IDEA IS: `${store.currentShownCSType}: TopTwoRace[0][0]` & `${store.currentShownCSType}: TopTwoRace[1][0]`
    // THIS WILL GIVE THE NUMBER FROM THE SPECIFIC COURSE CATEGORY IN SPECIFIC DISTRICT
    // BUT FIRST, MAKE SURE [0][0] OR [1][0] IS NOT ALREADY INCLUDED

    const store = useContext(Store);

    const districtAttributeFinder = (attributeName: string) =>
        findAttribute(attributeName, titleEntry, districtEntry);

    // console.log(districtAttributeFinder(`TOTAL: Total`))
    const Total_Column_H_to_N: Record<string, number> = {
        'White': 0,
        'Hispanic': 0,
        'Asian': 0,
        'Black': 0,
        'Native American': 0,
        'Pacific Islander': 0,
        'Two or More Races': 0
    };

    const Total_Column_H_to_N_Attributes: Record<string, string> = {
        'Native American': 'TOTAL: American Indian or Alaska Native',
        'Asian': 'TOTAL: Asian',
        'Black': 'TOTAL: Black or African American',
        'Hispanic': 'TOTAL: Hispanic or Latino',
        'Pacific Islander': 'TOTAL: Native Hawaiian or Pacific Islander',
        'Two or More Races': 'TOTAL: Two or more races',
        'White': 'TOTAL: White'
    };

    Object.keys(Total_Column_H_to_N_Attributes).forEach(key => {
        Total_Column_H_to_N[key] = (districtAttributeFinder(Total_Column_H_to_N_Attributes[key])>0) ? districtAttributeFinder(Total_Column_H_to_N_Attributes[key]) : 0;
    });

    const sorted_Total_Column_H_to_N = Object.fromEntries(
        Object.entries(Total_Column_H_to_N).sort(([, valueA], [, valueB]) => valueB - valueA)
    );

    const TopTwoRace = Object.entries(sorted_Total_Column_H_to_N).slice(0,2); //IN THE ENTIRE DISTRICT
    // console.log(TopTwoRace)

    //FINDING TOP IN THE COURSE CATEGORY
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
        Races_Students_Count[key] = (districtAttributeFinder(Races_Students_Attributes[key]))>0 ? districtAttributeFinder(Races_Students_Attributes[key]) : 0;
    });

    const sorted_Races_Students_Count = Object.fromEntries(
        Object.entries(Races_Students_Count).sort(([, valueA], [, valueB]) => valueB - valueA)
    )

    const TopRaces = Object.fromEntries(
        Object.entries(Races_Students_Count).filter(([_, value]) => value > 0) //IN THE COURSE CATEGORY
    );

    const TopTwoRaceInDistrict = Object.entries(TopRaces).slice(0,2);
    // console.log(sorted_Races_Students_Count)
    // console.log(TopTwoRaceInDistrict)

    const TableRowContent = () => {
        switch (TopTwoRaceInDistrict.length) {
            case 2:
                return (<>
                    <TableRow>
                        <TableCell>{TopTwoRaceInDistrict[0][0]}</TableCell>
                        <TableCell>{format(',')(TopTwoRaceInDistrict[0][1])}</TableCell>
                        <TableCell>{(TopTwoRaceInDistrict[0][1] >0 && districtAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((TopTwoRaceInDistrict[0][1]/districtAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{TopTwoRaceInDistrict[1][0]}</TableCell>
                        <TableCell>{format(',')(TopTwoRaceInDistrict[1][1])}</TableCell>
                        <TableCell>{(TopTwoRaceInDistrict[1][1] >0 && districtAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((TopTwoRaceInDistrict[1][1]/districtAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Other Races</TableCell>
                        <TableCell>{(districtAttributeFinder(`${store.currentShownCSType}: Total`) >= 0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Total`) - TopTwoRaceInDistrict[0][1] - TopTwoRaceInDistrict[1][1]) : 'N/A')}</TableCell>
                        <TableCell>{(districtAttributeFinder(`${store.currentShownCSType}: Total`) >0 && (districtAttributeFinder(`${store.currentShownCSType}: Total`) - TopTwoRaceInDistrict[0][1] - TopTwoRaceInDistrict[1][1]) >0) ? (((districtAttributeFinder(`${store.currentShownCSType}: Total`) - TopTwoRaceInDistrict[0][1] - TopTwoRaceInDistrict[1][1])/districtAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                    </TableRow>
                </>)
            case 1:
                return (<>
                {/* 
                if [0][0] is hispanic and toptworaceindistrict is hispanic do white else do hispanic
                if [0][0] is white and toptworaceindistrict is white do hispanic else do white
                */}
                    {/* CASE1 */}
                    <TableRow>
                        <TableCell>{TopTwoRaceInDistrict[0][0]}</TableCell>
                        <TableCell>{format(',')(TopTwoRaceInDistrict[0][1])}</TableCell>
                        <TableCell>{(TopTwoRaceInDistrict[0][1] >0 && districtAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((TopTwoRaceInDistrict[0][1]/districtAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                        </TableRow>
                    <TableRow>
                        <TableCell>{TopTwoRaceInDistrict[0][0] == TopTwoRace[0][0] ? TopTwoRace[1][0] : TopTwoRace[0][0]}</TableCell>
                        <TableCell>{TopTwoRaceInDistrict[0][0] == TopTwoRace[0][0] ? districtAttributeFinder(Races_Students_Attributes[TopTwoRace[1][0]]) : districtAttributeFinder(Races_Students_Attributes[TopTwoRace[0][0]])}</TableCell>
                        <TableCell>N/A</TableCell>
                    </TableRow>
                </>)
            default:
                return (<>
                {/* toptworaceindistrict[0][0] and toptworaceindistrict[1][0] from the course */}
                <TableRow>
                    <TableCell>{TopTwoRace[0][0]}</TableCell>
                    <TableCell>{districtAttributeFinder(Races_Students_Attributes[TopTwoRace[0][0]])}</TableCell>
                    <TableCell>N/A</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{TopTwoRace[1][0]}</TableCell>
                    <TableCell>{districtAttributeFinder(Races_Students_Attributes[TopTwoRace[1][0]])}</TableCell>
                    <TableCell>N/A</TableCell>
                </TableRow>
                </>)
        }
    }


    return (
        <div>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="District Data Modal"
                aria-describedby="District Data Modal"
            >
                <Box sx={style}>
                    {ModalTitleBar(districtAttributeFinder('District Name'), CourseCategoryColor[store.currentShownCSType], onClose)}
                    {/* <Typography id="Courses Under Category" variant="h6" component="h2" style={{color:CourseCategoryColor[store.currentShownCSType], marginBottom: '25px'}}>
                        {districtAttributeFinder('District Name')}
                    </Typography> */}
                    <div style={{backgroundColor:'rgba(0,0,0,0.05)'}}>
                        <StickyTableContainer>
                            <Table style={{ padding: '0px', border: '1px solid rgba(0,0,0,0.05)'}}  aria-label="sticky table">
                                <TableHead style={{backgroundColor: 'white'}}>
                                    <TableRow>
                                        <TableCell style={{fontWeight: 'bolder', color:CourseCategoryColor[store.currentShownCSType], borderRight: '1px solid lightgray'}} rowSpan={2}> Category </TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color:CourseCategoryColor[store.currentShownCSType]}} colSpan={2}> Students </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bolder', color: CourseCategoryColor[store.currentShownCSType] }}> # </TableCell>
                                        <TableCell style={{ fontWeight: 'bolder', color: CourseCategoryColor[store.currentShownCSType] }}> % </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow style={{backgroundColor: CourseCategoryColor[store.currentShownCSType], color: 'white'}}>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>Total {courseTitle(store.currentShownCSType)} Enrollment</TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>{districtAttributeFinder(`${store.currentShownCSType}: Total`) >=0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Total`)) : districtAttributeFinder(`${store.currentShownCSType}: Total`)}</TableCell>
                                        <TableCell style={{fontWeight: 'bolder', color: 'white'}}>100%</TableCell>
                                    </TableRow>
                                    {TableRowContent()}
                                    <TableRow>
                                        <TableCell>Econ. Disadvantaged</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) >=0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)) : districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)}</TableCell>
                                        <TableCell>{(districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`) >0 && districtAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((districtAttributeFinder(`${store.currentShownCSType}: Eco. Dis.`)/districtAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Disability</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: Disability`) >= 0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Disability`)) : districtAttributeFinder(`${store.currentShownCSType}: Disability`)}</TableCell>
                                        <TableCell>{(districtAttributeFinder(`${store.currentShownCSType}: Disability`) >0 && districtAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((districtAttributeFinder(`${store.currentShownCSType}: Disability`)/districtAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
                                        </TableRow>
                                    <TableRow>
                                        <TableCell>English Learner</TableCell>
                                        <TableCell>{districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) >= 0 ? format(',')(districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)) : districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)}</TableCell>
                                        <TableCell>{(districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`) >0 && districtAttributeFinder(`${store.currentShownCSType}: Total`) >0) ? ((districtAttributeFinder(`${store.currentShownCSType}: Eng. Learners`)/districtAttributeFinder(`${store.currentShownCSType}: Total`))*100).toFixed(2) + '%' : 'N/A'}</TableCell>
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