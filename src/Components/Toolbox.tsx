import { Stack, Chip, Container, Box, Dialog, DialogTitle, List, ListItem, IconButton, Tooltip, Button, DialogActions } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext, useState } from "react";
import Store from "../Interface/Store";
import { PossibleCategories } from "../Preset/Constants";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CategoryContext } from "../App";
import { CourseCategoryColor, LightGray } from "../Preset/Colors";

const Toolbox: FC = () => {

    const store = useContext(Store);

    const categories = useContext(CategoryContext);
    console.log(categories);

    const [openCategoryDialog, setDialog] = useState('');
    const chipClickHandler = (chipName: string) => {
        if (store.selectedCategory.includes(chipName)) {
            store.setCategory(store.selectedCategory.filter(d => d !== chipName));
        } else {
            store.setCategory(store.selectedCategory.concat([chipName]));
        }
    };
    return (
        <Box style={{ maxWidth: '300px', padding: '5px' }}>
            <Container>
                Select courses to include for state-wise data.
            </Container>
            <Stack>
                {PossibleCategories.map((chipName) => (
                    <Container key={`${chipName}-chip`}>

                        <Chip label={chipName}
                            clickable
                            onClick={() => chipClickHandler(chipName)}
                            style={{
                                margin: '5px',
                                backgroundColor: store.selectedCategory.includes(chipName) ? CourseCategoryColor[chipName] : undefined,
                                color: store.selectedCategory.includes(chipName) ? LightGray : undefined
                            }}
                        // color={store.selectedCategory.includes(chipName) ? 'primary' : 'default'}
                        />
                        <Tooltip title='See list of courses'>
                            <IconButton onClick={() => setDialog(chipName)}>
                                <InfoOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </Container>
                ))}
            </Stack>
            <Dialog open={Boolean(openCategoryDialog)} onClose={() => setDialog('')}>
                <DialogTitle>{openCategoryDialog} courses</DialogTitle>
                <List>
                    {categories.map((cate) => cate['category'] === openCategoryDialog ? <ListItem key={cate['core_code']}>{cate['core_short_desc']}</ListItem> : <></>
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