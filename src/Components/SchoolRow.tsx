import { TableRow, TableCell } from "@mui/material";
import { FC, useState } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DarkGray } from "../Preset/Colors";

type Props = {
    schoolEntry: { [key: string]: string | any[]; };
};

const SchoolRow: FC<Props> = ({ schoolEntry }: Props) => {

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <TableRow onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
                <TableCell>{isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</TableCell>
                <TableCell>{schoolEntry['School Name']}</TableCell>
                <TableCell>{schoolEntry['Total-HS']}</TableCell>
                <TableCell> - </TableCell>
            </TableRow>
            {isExpanded ?
                (schoolEntry['CSCourses'].length > 0 && typeof schoolEntry['CSCourses'] === 'object') ?
                    schoolEntry['CSCourses'].map((csCourse) => (
                        <TableRow>
                            <TableCell />
                            <TableCell colSpan={3} style={{ color: DarkGray }}>
                                {csCourse['Course Name']}
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