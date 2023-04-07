import { Stack, Chip, Container, Box, Dialog, DialogTitle, List, ListItem, IconButton, Tooltip, Button, DialogActions } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import Store from "../Interface/Store";
import { linkToData, PossibleCategories, PossibleSchoolYears } from "../Preset/Constants";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CourseCategoryColor, LightGray } from "../Preset/Colors";
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";
import readXlsxFile from "read-excel-file";
import styled from "@emotion/styled";

const Toolbox: FC = () => {

    const store = useContext(Store);

    const [courseCategorization, setCourseCategorization] = useState([]);


    useEffect(() => {
        fetch(linkToData,).then(response => response.blob())
            .then(blob => readXlsxFile(blob, { sheet: 'CS Courses' }))
            .then(data => {
                const cateList: any = { 'CS - Basic': 'CSB', 'CS - Advanced': 'CSA', 'CS - Related': 'CSR' };
                data = (data as Array<number | string>[]).map(d => Object.keys(cateList).includes(d[3] as any) ? ([d[0], d[2], cateList[d[3] as any]]) : ([]));
                data = data.filter(d => d.length > 0);
                // console.log(data);
                stateUpdateWrapperUseJSON(courseCategorization, data, setCourseCategorization);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateList = () => {
        // if (openCategoryDialog === '')
        let includedCateList = [openCategoryDialog];
        if (openCategoryDialog === 'CS') {
            includedCateList = ['CSA', 'CSR', 'CSB'];
        } else if (openCategoryDialog === 'CSC') {
            includedCateList = ['CSA', 'CSB'];
        }

        return courseCategorization.map(courseInfo =>
            includedCateList.includes(courseInfo[2]) ? <ListItem key={courseInfo[0]}>{courseInfo[1]}</ListItem> : <></>
        );
    };

    const [openCategoryDialog, setDialog] = useState('');

    return (
        <Box style={{ maxWidth: '300px', paddingBottom: '20px' }}>
            <List>
                <ListItem>
                    Select courses to include for state total data.
                </ListItem>
            </List>
            <Stack>
                {PossibleCategories.map((category) => (
                    <Container key={`${category.name}-chip`}>
                        <ChipComp label={category.name}
                            clickable
                            onClick={() => store.updateSelectedCategory(category.key)}
                            style={{
                                backgroundColor: store.currentShownCSType === category.key ? CourseCategoryColor[category.key] : undefined,
                                color: store.currentShownCSType === category.key ? LightGray : undefined
                            }}
                        // color={store.selectedCategory.includes(chipName) ? 'primary' : 'default'}
                        />
                        <Tooltip title='See list of courses'>
                            <IconButton onClick={() => setDialog(category.key)} size="small">
                                <InfoOutlinedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </Container>
                ))}
            </Stack>

            <ListItem>
                School Year
            </ListItem>
            <Stack>
                {PossibleSchoolYears.map((yearEntry) => (
                    <Container key={yearEntry}>
                        <ChipComp
                            label={yearEntry}
                            clickable
                            onClick={() => store.updateSchoolYEar(yearEntry)}
                            style={{
                                backgroundColor: store.schoolYearShowing === yearEntry ? 'darkblue' : undefined,
                                color: store.schoolYearShowing === yearEntry ? LightGray : undefined
                            }}
                        />
                    </Container>
                ))}
            </Stack>

            <ListItem>
                Percentage / Number Mode
            </ListItem>
            <Stack>
                <Container>
                    <ChipComp label={`Number #`}
                        clickable={store.showPercentage}
                        style={{
                            backgroundColor: !store.showPercentage ? 'darkblue' : undefined,
                            color: !store.showPercentage ? LightGray : undefined
                        }}
                        onClick={() => store.updateShowPercentage()} />
                </Container>
                <Container>
                    <ChipComp label={`Percentage %`}
                        style={{
                            backgroundColor: store.showPercentage ? 'darkblue' : undefined,
                            color: store.showPercentage ? LightGray : undefined
                        }}
                        clickable={!store.showPercentage}
                        onClick={() => store.updateShowPercentage()} />
                </Container>
            </Stack>
            <Dialog open={Boolean(openCategoryDialog)} onClose={() => setDialog('')}>
                <DialogTitle>{openCategoryDialog} courses</DialogTitle>
                <List>
                    {/* {courseCategorization.map((cate) => cate['Initial Category'] === openCategoryDialog ? <ListItem key={cate['State Course Code']}>{cate['Course Name']}</ListItem> : <></>
                    )} */}
                    {generateList()}
                </List>
                <DialogActions>
                    <Button onClick={() => setDialog('')}>close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default observer(Toolbox);

const ChipComp = styled(Chip)`
margin: '5px'
`;
