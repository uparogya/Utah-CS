import { FC, useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import Store from "../Interface/Store2";
import { Grid, FormControl, Select, MenuItem, SelectChangeEvent, InputLabel, Divider, FormHelperText, Box } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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

    const fromSheet = useMemo(() => {
        return courseData?.byCategory 
            ? Object.keys(courseData.byCategory).sort() 
            : [];
    }, [courseData]);
    
    const availableCategories = useMemo(() => {
        return ["CS Total", "CS Foundational", ...fromSheet];
    }, [fromSheet]);

    const getCategoryDefinition = (cat: string) => {
        if (cat === "CS Total") return "All course categories, including CS-Related.";
        if (cat === "CS Foundational") return "All course categories, excluding CS-Related.";
        return null;
    };

    const selectedDef = getCategoryDefinition(store.courseCategory);

    return (
        <Grid 
            container 
            spacing={2} 
            alignItems="flex-start"
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
                        {availableCategories.map((cat) => {
                            const isFirstSheetItem = fromSheet.length > 0 && cat === fromSheet[0];
                            const isManual = cat === "CS Total" || cat === "CS Foundational";

                            return [
                                isFirstSheetItem && <Divider key="cat-divider" sx={{ my: 1 }} />,
                                
                                <MenuItem key={`${cat}-mi`} value={cat}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {cat}
                                        {isManual && <InfoOutlinedIcon sx={{ fontSize: '1rem', color: '#94a3b8' }} />}
                                    </Box>
                                </MenuItem>
                            ];
                        })}
                    </Select>
                    
                    {selectedDef && (
                        <FormHelperText sx={{ color: '#003789', fontWeight: 400 }}>
                            {selectedDef}
                        </FormHelperText>
                    )}
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