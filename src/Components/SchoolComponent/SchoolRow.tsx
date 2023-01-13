import { TableRow, TableCell } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { CourseCategoryColor, DarkGray } from "../../Preset/Colors";
import RemoveIcon from '@mui/icons-material/Remove';
import PercentageChart from "../CellComponents/PercentageChart";
import { FunctionCell, NoBorderCell, TextCell } from "../GeneralComponents";
import { Enrollment } from "../../Interface/Types";
import { PossibleCategories } from "../../Preset/Constants";
import { sum } from "d3-array";
import { findAttribute } from "../../Interface/AttributeFinder";
import Store from "../../Interface/Store";

type Props = {
    schoolEntry: (number | string)[];
    titleEntry: string[];
};

const SchoolRow: FC<Props> = ({ schoolEntry, titleEntry }: Props) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpandable, setIsExpandable] = useState(true);

    const store = useContext(Store);
    const schoolAttributeFinder = (attributeName: string) => findAttribute(attributeName, titleEntry, schoolEntry);

    return (
        <>
            <TableRow style={{ cursor: 'pointer' }}>

                <TextCell onClick={() => setIsExpanded(!isExpanded)}>
                    {(schoolEntry[1])}
                </TextCell>
                <TextCell onClick={() => setIsExpanded(!isExpanded)}>
                    {schoolAttributeFinder('TOTAL: Total')}
                </TextCell>
                <TextCell>
                    <PercentageChart actualVal={schoolAttributeFinder(`${store.currentShownCSType}: Total`)} percentage={schoolAttributeFinder(`${store.currentShownCSType}: Total`) / schoolAttributeFinder('TOTAL: Total')} />
                </TextCell>
            </TableRow>

        </>


    );
};
export default SchoolRow;

const findSpecialCase = (input: Enrollment) => {
    return input.CSA.Total === 'n<10' || input.CSB.Total === 'n<10' || input.CSR.Total === 'n<10';
};
