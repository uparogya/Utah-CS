import { TableRow, TableCell } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CourseCategoryColor, DarkGray } from "../../Preset/Colors";
import { CategoryContext } from "../../App";
import PercentageChart from "../CellComponents/PercentageChart";
import { FunctionCell, NoBorderCell, TextCell } from "../GeneralComponents";
import { Enrollment } from "../../Interface/Types";
import { PossibleCategories } from "../../Preset/Constants";
import { sum } from "d3-array";

type Props = {
    schoolEntry: { [key: string]: string | Enrollment; };
};

const SchoolRow: FC<Props> = ({ schoolEntry }: Props) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const [totalCSEnrollment, setEnrollment] = useState(0);

    const category = useContext(CategoryContext);

    useEffect(() => {

        setEnrollment(PossibleCategories.reduce((sum, category) => sum + (parseInt(`${(schoolEntry['CSCourses'] as Enrollment)[category.key].Total}`) || 0), 0));
    }, [schoolEntry]);

    return (
        <>
            <TableRow style={{ cursor: 'pointer' }}>
                <FunctionCell onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                </FunctionCell>
                <TextCell onClick={() => setIsExpanded(!isExpanded)}>
                    {(schoolEntry['School Name'] as string)}
                </TextCell>
                <TextCell onClick={() => setIsExpanded(!isExpanded)}>
                    {(schoolEntry['Total Students'] as string)}
                </TextCell>
                {/* TODO fix the height here. */}
                <TextCell>
                    {(!totalCSEnrollment && findSpecialCase(schoolEntry['CSCourses'] as Enrollment)) ?
                        'n<10'
                        :
                        <PercentageChart actualVal={totalCSEnrollment} percentage={totalCSEnrollment / parseInt(schoolEntry['Total Students'] as string)} />
                    }
                </TextCell>
            </TableRow>
            {isExpanded ? (
                Object.keys(schoolEntry['CSCourses']).map((category) => (

                    <TableRow key={`${schoolEntry['School Name']}-${category}`}>
                        <NoBorderCell />
                        <TextCell style={{ color: CourseCategoryColor[category] }} children={category} />
                        <TextCell colSpan={2}>
                            <PercentageChart actualVal={(schoolEntry['CSCourses'] as Enrollment)[category].Total as number} percentage={(schoolEntry['CSCourses'] as Enrollment)[category].Total as number / sum(Object.values(schoolEntry['CSCourses']).map(d => d.Total as number))} />
                        </TextCell>


                    </TableRow>
                ))
            ) : <></>}
        </>


    );
};
export default SchoolRow;

const findSpecialCase = (input: Enrollment) => {
    return input.CSA.Total === 'n<10' || input.CSB.Total === 'n<10' || input.CSR.Total === 'n<10';
};
