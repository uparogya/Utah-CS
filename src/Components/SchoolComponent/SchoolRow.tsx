import { TableRow } from "@mui/material";
import { FC, useContext, useState } from "react";
import PercentageChart from "../CellComponents/PercentageChart";
import { TextCell } from "../GeneralComponents";
import { findAttribute } from "../../Interface/AttributeFinder";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { format } from "d3-format";
import { CourseCategoryColor } from "../../Preset/Colors";
import SchoolDataModal from "./SchoolDataModal"

type Props = {
    schoolEntry: (number | string)[];
    titleEntry: string[];
};

const SchoolRow: FC<Props> = ({ schoolEntry, titleEntry }: Props) => {
    const store = useContext(Store);

    const schoolAttributeFinder = (attributeName: string) => 
        findAttribute(attributeName, titleEntry, schoolEntry);

    const [selectedSchool, setSelectedSchool] = useState<Array<string | number> | null>();

    const openSchoolDataBreakdown = (schoolEntry: Array<string | number>, titleEntry: string[]) => {
        setSelectedSchool(schoolEntry);
    };

    const closeSchoolDataBreakdown = () => {
        setSelectedSchool(null);
    };

    return (<>
        <TableRow>
            <TextCell style={{textDecoration:'underline', color:CourseCategoryColor[store.currentShownCSType], cursor: 'pointer'}} onClick={() => openSchoolDataBreakdown(schoolEntry, titleEntry)}>
                {(schoolEntry[1])}
            </TextCell>
            <TextCell>
                {schoolAttributeFinder('TOTAL: Total') >= 0 ? format(',')(schoolAttributeFinder('TOTAL: Total')) : (schoolAttributeFinder('TOTAL: Total'))}
            </TextCell>
            <TextCell>
                <PercentageChart actualVal={schoolAttributeFinder(`${store.currentShownCSType}: Total`)} percentage={schoolAttributeFinder(`${store.currentShownCSType}: Total`) / schoolAttributeFinder('TOTAL: Total')} />
            </TextCell>
        </TableRow>
        {selectedSchool && (
            <SchoolDataModal onClose={closeSchoolDataBreakdown} schoolEntry={selectedSchool} titleEntry={titleEntry} />
        )}
    </>);
};
export default observer(SchoolRow);