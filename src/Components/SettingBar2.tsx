import { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import Store from "../Interface/Store2";
import { Grid, FormControl, Select, MenuItem, SelectChangeEvent, InputLabel } from "@mui/material";
import { PossibleSchoolYears } from "../Preset/Constants2";
import { DataContext } from "../App2";

const SettingBar: FC = () => {
    const store = useContext(Store);
    const { courseData } = useContext(DataContext);
    
    const handleYearChange = (e: SelectChangeEvent) => {
        store.updateSchoolYear(e.target.value);
    };

    const handlePercentChange = (e: SelectChangeEvent) => {
        store.updateShowPercentage();
    };

    const handleCategoryChange = (e: SelectChangeEvent) => {
        store.updateCourseCategory(e.target.value);
    };

    const handleLevelChange = (e: SelectChangeEvent) => {
        store.updateCourseLevel(e.target.value);
    };

    const availableCategories = courseData?.byCategory 
        ? Object.keys(courseData.byCategory).sort() 
        : [];

    return (
        <Grid 
            container 
            spacing={2} 
            alignItems="center" 
            justifyContent="center" 
            sx={{ marginTop: '10px', paddingBottom: '10px' }}
        >

            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                
                <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="cat-label">Course Category</InputLabel>
                    <Select 
                        labelId="cat-label"
                        value={store.courseCategory} 
                        onChange={handleCategoryChange}
                        label="Course Category"
                    >
                        {availableCategories.map((cat) => (
                            <MenuItem key={`${cat}-mi`} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="lvl-label">Level</InputLabel>
                    <Select 
                        labelId="lvl-label"
                        value={store.courseLevel} 
                        onChange={handleLevelChange}
                        label="Level"
                    >
                        <MenuItem value="All">All Levels</MenuItem>
                        <MenuItem value="Basic">Basic</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                </FormControl>

            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="year-label">Academic Year</InputLabel>
                    <Select 
                        labelId="year-label"
                        value={store.schoolYearShowing} 
                        onChange={handleYearChange} 
                        label="Academic Year"
                    >
                        {PossibleSchoolYears.map((year) => (
                            <MenuItem value={year} key={`${year}-mi`}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="disp-label">Display Mode</InputLabel>
                    <Select 
                        labelId="disp-label"
                        value={String(store.showPercentage)} 
                        onChange={handlePercentChange} 
                        label="Display Mode"
                    >
                        <MenuItem value="true">Percentage (%)</MenuItem>
                        <MenuItem value="false">Count (#)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

        </Grid>
    )
}

export default observer(SettingBar);