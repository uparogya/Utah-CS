import { Menu, MenuItem } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../Interface/Store";
import { PossibleSchoolYears } from "../Preset/Constants";

type Prop = {
    anchorEl: null | HTMLElement;
    handleClose: () => void;
};

const AcademicYearMenu: FC<Prop> = ({ anchorEl, handleClose }: Prop) => {

    const store = useContext(Store);

    const handleClick = (year: string) => {
        // store.updateSelectedCategory(newCat);
        store.updateSchoolYEar(year);
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
    >{PossibleSchoolYears.map((year) => (
        <MenuItem onClick={() => handleClick(year)} key={`${year}-mi`}>{year}</MenuItem>
    ))}
    </Menu>);
};

export default observer(AcademicYearMenu);
