import { TableRow, TableCell } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CourseCategoryColor, DarkGray } from "../../Preset/Colors";
import { format } from "d3-format";
import { CategoryContext } from "../../App";
import PercentageChart from "../CellComponents/PercentageChart";
import { FunctionCell, TextCells } from "../GeneralComponents";

type Props = {
    schoolEntry: { [key: string]: string | any[]; };
};

const SchoolRow: FC<Props> = ({ schoolEntry }: Props) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const [totalCSEnrollment, setEnrollment] = useState(0);

    const category = useContext(CategoryContext);

    useEffect(() => {
        setEnrollment(schoolEntry['CSCourses'].length > 0 && typeof schoolEntry['CSCourses'] === 'object' ? schoolEntry['CSCourses'].reduce((sum, course) => sum + parseInt(course['enrollment']), 0) : 0);
    }, [schoolEntry]);


    const findCourseCategoryColor = (csCourse: { [key: string]: string; }) => {
        let categoryResult = category.filter((d) => d['core_code'] === csCourse['Course ID']);
        return categoryResult.length > 0 ? CourseCategoryColor[categoryResult[0]['category']] : DarkGray;
    };

    return (
        <>
            <TableRow style={{ cursor: 'pointer' }}>
                <FunctionCell onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                </FunctionCell>
                <TextCells onClick={() => setIsExpanded(!isExpanded)}>
                    {schoolEntry['School Name']}
                </TextCells>
                <TextCells onClick={() => setIsExpanded(!isExpanded)}>
                    {schoolEntry['Total-HS']}
                </TextCells>
                <TextCells>
                    {totalCSEnrollment > 0 && schoolEntry['Total-HS'] !== '0' ?
                        <PercentageChart actualVal={totalCSEnrollment} percentage={totalCSEnrollment / parseInt(schoolEntry['Total-HS'] as string)} /> : '-'}
                </TextCells>
            </TableRow>
            {isExpanded ?
                (schoolEntry['CSCourses'].length > 0 && typeof schoolEntry['CSCourses'] === 'object') ?
                    schoolEntry['CSCourses'].map((csCourse) => (
                        <TableRow key={`${schoolEntry['School Name']}-${csCourse['Course ID']}`}>
                            <TableCell style={{ borderBottom: 'none' }} />
                            <TableCell colSpan={2} style={{ color: findCourseCategoryColor(csCourse) }}>
                                {csCourse['Course Name']}
                            </TableCell>
                            <TableCell style={{ color: DarkGray }}>
                                {csCourse['enrollment']}
                            </TableCell>
                        </TableRow>
                    )) :
                    <TableRow>
                        <TableCell />
                        <TableCell colSpan={3} style={{ color: DarkGray }}>
                            -- None Offered --
                        </TableCell>

                    </TableRow>

                : <></>}
        </>


    );
};
export default SchoolRow;