import { Menu, MenuItem } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../Interface/Store";
import { PossibleCategories } from "../Preset/Constants";

type Prop = {
    anchorEl: null | HTMLElement;
    handleClose: () => void;
};

const CSMenu: FC<Prop> = ({ anchorEl, handleClose }: Prop) => {

    const store = useContext(Store);

    const handleClick = (newCat: string) => {
        store.updateSelectedCategory(newCat);
        handleClose();
    };

    return (<Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
    >{PossibleCategories.map((category) => (
        <MenuItem onClick={() => { handleClick(category.key); }} key={`${category.name}-mi`}>{category.name}</MenuItem>
    ))}
    </Menu>);
};

export default observer(CSMenu);
