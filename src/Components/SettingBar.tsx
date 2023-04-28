import { Grid, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { FC, useContext, useState } from "react";
import Store from "../Interface/Store";
import NumbersIcon from '@mui/icons-material/Numbers';
import PercentIcon from '@mui/icons-material/Percent';
import { observer } from "mobx-react-lite";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AcademicYearMenu from "./AcademicYearMenu";
import CSMenu from "./CSMenu";
import { PossibleCategories, PossibleSchoolYears } from "../Preset/Constants";


const SettingBar: FC = () => {

    // const [CSMenuAnchorEl, setCSMenuAnchorEl] = useState<null | HTMLElement>(null);
    // const handleCSMenuClose = () => {
    //     setCSMenuAnchorEl(null);
    // };
    // const handleCSTypeClick = (event: React.MouseEvent<HTMLElement>) => {
    //     setCSMenuAnchorEl(event.currentTarget);
    // };

    // const [yearMenuAnchorEl, setYearMenuAnchorEl] = useState<null | HTMLElement>(null);
    // const handleYearMenuClose = () => {
    //     setYearMenuAnchorEl(null);
    // };
    const handleYearChange = (e: SelectChangeEvent) => {
        store.updateSchoolYEar(e.target.value);
    };

    const handleCSChange = (e: SelectChangeEvent) => {
        store.updateSelectedCategory(e.target.value);
    };

    const store = useContext(Store);
    // TODO change the spans into form controls
    return <Grid xs={12} style={{ background: 'aliceblue', alignItems: 'center', color: '#3d3d3d' }} container>
        <Grid xs={2}>
            <Typography>Settings</Typography>
        </Grid>
        <Grid xs={4}>

            <FormControl variant="standard" style={{ flexDirection: 'row', alignItems: 'center' }}>

                <span>Course Category</span>
                <Select value={store.currentShownCSType} onChange={handleCSChange} label='Course Category' style={{ paddingLeft: '5px' }}>
                    {PossibleCategories.map((category) => (
                        <MenuItem key={`${category.name}-mi`} value={category.key}>{category.name}</MenuItem>
                    ))}

                </Select>
            </FormControl>



            {/* <span onClick={handleCSTypeClick} style={{ cursor: 'pointer' }}>
                <u>Utah {store.currentShownCSType}</u>
                <ArrowDropDownIcon fontSize='small' style={{ verticalAlign: 'text-bottom' }} />
            </span> */}
        </Grid>
        <Grid xs={4}>
            <FormControl variant="standard" style={{ flexDirection: 'row', alignItems: 'center' }}>

                <span>Academic Year</span>
                <Select value={store.schoolYearShowing} onChange={handleYearChange} label='Academic Year' style={{ paddingLeft: '5px' }}>
                    {PossibleSchoolYears.map((year) => (
                        <MenuItem value={year} key={`${year}-mi`}>{year}</MenuItem>
                    ))}

                </Select>
            </FormControl>
            {/* <span onClick={handleYearTypeClick} style={{ cursor: 'pointer' }}>
                <u>{store.schoolYearShowing}</u>
                <ArrowDropDownIcon fontSize='small' style={{ verticalAlign: 'text-bottom' }} />
            </span> */}
            {/* Academic Year */}
        </Grid>
        <Grid xs={2} >
            <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                <span>Change to </span>
                <IconButton size='small' onClick={() => store.updateShowPercentage()} children={store.showPercentage ? <NumbersIcon /> : <PercentIcon />} />
            </div>
        </Grid>
        {/* <CSMenu anchorEl={CSMenuAnchorEl} handleClose={handleCSMenuClose} />
        <AcademicYearMenu anchorEl={yearMenuAnchorEl} handleClose={handleYearMenuClose} /> */}
    </Grid>;
};

export default observer(SettingBar);
