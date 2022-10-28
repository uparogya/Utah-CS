import { Stack, Chip, Container, Box, Dialog, DialogTitle, List, ListItem, IconButton, Tooltip, Button, DialogActions } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import Store from "../Interface/Store";
import { PossibleCategories } from "../Preset/Constants";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CourseCategoryColor, LightGray } from "../Preset/Colors";
import { csv } from "d3-fetch";
import { stateUpdateWrapperUseJSON } from "../Interface/StateChecker";

const Toolbox: FC = () => {

    const store = useContext(Store);

    const [courseCategorization, setCourseCategorization] = useState([]);
    useEffect(() => {
        //category
        csv("/data/courses.csv").then((categorization) => {
            stateUpdateWrapperUseJSON(courseCategorization, categorization, setCourseCategorization);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [openCategoryDialog, setDialog] = useState('');
    const chipClickHandler = (chipName: string) => {
        if (store.selectedCategory.includes(chipName)) {
            store.setCategory(store.selectedCategory.filter(d => d !== chipName));
        } else {
            store.setCategory(store.selectedCategory.concat([chipName]));
        }

    };
    return (
        <Box style={{ maxWidth: '300px', paddingBottom: '20px' }}>
            <List>
                <ListItem>
                    Select courses to include for state total data.
                </ListItem>
            </List>
            <ListItem>
                <Stack>
                    {PossibleCategories.map((category) => (
                        <Container key={`${category.name}-chip`}>

                            <Chip label={category.name}
                                clickable
                                onClick={() => chipClickHandler(category.key)}
                                style={{
                                    margin: '5px',
                                    backgroundColor: store.selectedCategory.includes(category.key) ? CourseCategoryColor[category.key] : undefined,
                                    color: store.selectedCategory.includes(category.key) ? LightGray : undefined
                                }}
                            // color={store.selectedCategory.includes(chipName) ? 'primary' : 'default'}
                            />
                            <Tooltip title='See list of courses'>
                                <IconButton onClick={() => setDialog(category.key)}>
                                    <InfoOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </Container>
                    ))}
                </Stack>
            </ListItem>

            <ListItem>
                Charter / District filter?
            </ListItem>

            <Dialog open={Boolean(openCategoryDialog)} onClose={() => setDialog('')}>
                <DialogTitle>{openCategoryDialog} courses</DialogTitle>
                <List>
                    {courseCategorization.map((cate) => cate['Initial Category'] === openCategoryDialog ? <ListItem key={cate['State Course Code']}>{cate['Course Name']}</ListItem> : <></>
                    )}
                </List>
                <DialogActions>
                    <Button onClick={() => setDialog('')}>close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default observer(Toolbox);
