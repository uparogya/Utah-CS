import { Grid, Typography, IconButton } from "@mui/material";
import { FC, useContext, useState } from "react";
import Store from "../Interface/Store";
import NumbersIcon from '@mui/icons-material/Numbers';
import PercentIcon from '@mui/icons-material/Percent';
import { observer } from "mobx-react-lite";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AcademicYearMenu from "./AcademicYearMenu";
import CSMenu from "./CSMenu";


const SettingBar: FC = () => {

    const [CSMenuAnchorEl, setCSMenuAnchorEl] = useState<null | HTMLElement>(null);
    const handleCSMenuClose = () => {
        setCSMenuAnchorEl(null);
    };
    const handleCSTypeClick = (event: React.MouseEvent<HTMLElement>) => {
        setCSMenuAnchorEl(event.currentTarget);
    };

    const [yearMenuAnchorEl, setYearMenuAnchorEl] = useState<null | HTMLElement>(null);
    const handleYearMenuClose = () => {
        setYearMenuAnchorEl(null);
    };
    const handleYearTypeClick = (event: React.MouseEvent<HTMLElement>) => {
        setYearMenuAnchorEl(event.currentTarget);
    };

    const store = useContext(Store);
    // TODO change the spans into form controls
    return <Grid xs={12} style={{ background: 'aliceblue', alignItems: 'center' }} container>
        <Grid xs={3}>
            <Typography>Settings</Typography>
        </Grid>
        <Grid xs={3}>
            <span onClick={handleCSTypeClick} style={{ cursor: 'pointer' }}>
                <u>Utah {store.currentShownCSType}</u>
                <ArrowDropDownIcon fontSize='small' style={{ verticalAlign: 'text-bottom' }} />
            </span>
        </Grid>
        <Grid xs={3}>
            <span onClick={handleYearTypeClick} style={{ cursor: 'pointer' }}>
                <u>{store.schoolYearShowing}</u>
                <ArrowDropDownIcon fontSize='small' style={{ verticalAlign: 'text-bottom' }} />
            </span>
            Academic Year
        </Grid>
        <Grid xs={3}>
            <IconButton size='small' onClick={() => store.updateShowPercentage()} children={store.showPercentage ? <NumbersIcon /> : <PercentIcon />} />
        </Grid>
        <CSMenu anchorEl={CSMenuAnchorEl} handleClose={handleCSMenuClose} />
        <AcademicYearMenu anchorEl={yearMenuAnchorEl} handleClose={handleYearMenuClose} />
    </Grid>;
};

export default observer(SettingBar);
