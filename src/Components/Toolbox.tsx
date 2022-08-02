import { Stack, Chip, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../Interface/Store";
import { PossibleCategories } from "../Preset/Constants";

const Toolbox: FC = () => {

    const store = useContext(Store);
    const chipClickHandler = (chipName: string) => {
        if (store.selectedCategory.includes(chipName)) {
            store.setCategory(store.selectedCategory.filter(d => d !== chipName));
        } else {
            store.setCategory(store.selectedCategory.concat([chipName]));
        }
    };
    return (
        <Box>
            <Stack>
                {PossibleCategories.map((chipName) => (
                    <Chip label={chipName}
                        clickable
                        onClick={() => chipClickHandler(chipName)}
                        style={{ margin: '5px' }}
                        color={store.selectedCategory.includes(chipName) ? 'primary' : 'default'} />
                ))}
            </Stack>
        </Box>
    );
};

export default observer(Toolbox);