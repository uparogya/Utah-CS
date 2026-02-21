import { FC, useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { format } from "d3-format";
import Store from "../../Interface/Store2";
import { observer } from "mobx-react-lite";

const LabelDictionary: Record<string, string> = {
    white: "White",
    hispanic: "Hispanic",
    asian: "Asian",
    black: "Black",
    native: "Native American",
    pacific: "Pacific Islander",
    twoOrMore: "Two or More",
    male: "Male",
    female: "Female",
    ecoDis: "Eco. Disadvantaged",
    disability: "Students w/ Disability",
    engLearner: "English Learners"
};

type DetailedStat = { 
    total: number; 
    male: number; 
    female: number; 
};

type Props = {
    title: string;
    data: Record<string, DetailedStat>;
    totalStudentNum: number;
    comparisonData?: Record<string, DetailedStat>;
    comparisonTotal?: number;
};

const AttributeChart: FC<Props> = ({ title, data, totalStudentNum, comparisonData, comparisonTotal }: Props) => {
    const store = useContext(Store);
    const [open, setOpen] = useState(false);

    const sortedKeys = Object.keys(data).sort((a, b) => data[b].total - data[a].total);
    const topThree = sortedKeys.slice(0, 3);

    const fmt = (val: number, total: number) => 
        store.showPercentage 
            ? format(".2%")(total > 0 ? val / total : 0) 
            : format(",")(val);

    return (
        <>
            <div 
                style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', color: '#1976d2' }}
                onClick={() => setOpen(true)}
            >
                {topThree.map(key => (
                    <div key={key} style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        <strong>{LabelDictionary[key] || key}:</strong> {fmt(data[key].total, totalStudentNum)}
                    </div>
                ))}
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {title} Breakdown
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption">
                            <span style={{color: '#E91E63'}}>Female (F)</span> | <span style={{color: '#2196F3'}}>Male (M)</span>
                        </Typography>
                    </Box>

                    {sortedKeys.map((key) => {
                        const item = data[key];
                        const ratio = totalStudentNum > 0 ? item.total / totalStudentNum : 0;
                        const widthPct = Math.min(100, Math.max(1, ratio * 100));
                        const fRatio = item.total > 0 ? (item.female / item.total) * 100 : 0;
                        const mRatio = item.total > 0 ? (item.male / item.total) * 100 : 0;

                        const sItem = comparisonData ? comparisonData[key] : null;
                        const sRatio = (sItem && comparisonTotal) ? sItem.total / comparisonTotal : 0;
                        const sWidthPct = Math.min(100, Math.max(1, sRatio * 100));
                        const sfRatio = sItem ? (sItem.female / sItem.total) * 100 : 0;
                        const smRatio = sItem ? (sItem.male / sItem.total) * 100 : 0;

                        return (
                            <Box key={key} sx={{ mb: 3 }}>
                                <Grid container justifyContent="space-between">
                                    <Typography variant="body2" fontWeight="bold">{LabelDictionary[key] || key} <Typography variant="caption" color="text.secondary">{format(",")(item.total)} ({format(".2%")(ratio)})</Typography></Typography>
                                </Grid>
                                
                                <Box sx={{ width: '100%', height: 12, bgcolor: '#eee', borderRadius: 1, mt: 0.5, display: 'flex', overflow: 'hidden' }}>
                                    <Box sx={{ width: `${widthPct}%`, display: 'flex', height: '100%' }}>
                                        <Tooltip title={`Female: ${format(",")(item.female)}`}>
                                            <Box sx={{ width: `${fRatio}%`, bgcolor: '#E91E63' }} /> 
                                        </Tooltip>
                                        <Tooltip title={`Male: ${format(",")(item.male)}`}>
                                            <Box sx={{ width: `${mRatio}%`, bgcolor: '#2196F3' }} />
                                        </Tooltip>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    F: {format(",")(item.female)} | M: {format(",")(item.male)}
                                </Typography>

                                {sItem && (
                                    <>
                                        <Typography variant="caption" color="text.secondary"><b>STATE:</b> {format(",")(sItem.total)} ({format(".2%")(sRatio)})</Typography>
                                        <Box sx={{ width: '100%', height: 12, bgcolor: '#eee', borderRadius: 1, mt: 0.5, display: 'flex', overflow: 'hidden' }}>
                                            <Box sx={{ width: `${sWidthPct}%`, display: 'flex', height: '100%' }}>
                                                <Tooltip title={`Female: ${format(",")(sItem.female)}`}>
                                                    <Box sx={{ width: `${sfRatio}%`, bgcolor: '#E91E63' }} /> 
                                                </Tooltip>
                                                <Tooltip title={`Male: ${format(",")(sItem.male)}`}>
                                                    <Box sx={{ width: `${smRatio}%`, bgcolor: '#2196F3' }} />
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            F: {format(",")(sItem.female)} | M: {format(",")(sItem.male)}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        );
                    })}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default observer(AttributeChart);