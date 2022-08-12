import { TableRow, TableCell, Checkbox } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FunctionCell, NoBorderCell, TextCell } from "../GeneralComponents";
import PercentageChart from "../CellComponents/PercentageChart";
import { CategoryContext, EnrollmentDataContext } from "../../App";
import { sum } from "d3-array";
import RemoveIcon from '@mui/icons-material/Remove';
import { CourseCategoryColor } from "../../Preset/Colors";

type Props = {
    districtEntry: { [key: string]: string; };
};

const DistrictRow: FC<Props> = ({ districtEntry }: Props) => {
    const store = useContext(Store);
    const [isExpanded, setExpanded] = useState(false);
    const [isExpandable, setExpandable] = useState(false);

    const [csDistrictEnrollment, setCSEnrollment] = useState<{ [key: string]: number; }>({ "CS-related": 0, "CS-advanced": 0, "CS-basic": 0 });

    const enrollmentData = useContext(EnrollmentDataContext);

    const courseCategory = useContext(CategoryContext);
    useEffect(() => {
        const courseEnrollment = enrollmentData.filter(d => d['LEA'] === districtEntry['LEA Name']);
        setExpandable(courseEnrollment.length > 0);
        const newDistrictEnrollment: { [key: string]: number; } = { "CS-related": 0, "CS-advanced": 0, "CS-basic": 0 };
        courseEnrollment.forEach((course) => {
            const filterResult = courseCategory.filter(c => c['core_code'] === course['core_code']);
            const categoryResult = (filterResult.length > 0 ? filterResult[0][`category`] : 'CS-related');
            newDistrictEnrollment[categoryResult] += parseInt(course['Student enrollment']);
        });
        setCSEnrollment(newDistrictEnrollment);

    }, [enrollmentData, courseCategory, districtEntry]);

    const expansionToggle = () => {
        if (isExpandable) {
            setExpanded(!isExpanded);
        }
    };

    return (<>
        <TableRow >
            <FunctionCell>
                <Checkbox checked={store.selectedDistricts.includes(districtEntry['LEA Name'])}
                    onChange={() => store.setSelectedDistricts(districtEntry['LEA Name'])} />
            </FunctionCell>

            <FunctionCell style={{ paddingTop: '5px' }}
                onClick={expansionToggle}>
                {isExpandable ? (isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />) : <RemoveIcon style={{ paddingLeft: '2px' }} fontSize="small" />}
            </FunctionCell>
            <TextCell onClick={expansionToggle}>{districtEntry['LEA Name']}</TextCell>
            <TextCell onClick={expansionToggle}>{districtEntry['Total HS']}</TextCell>
            <TextCell> <PercentageChart actualVal={sum(Object.values(csDistrictEnrollment))} percentage={sum(Object.values(csDistrictEnrollment)) / parseInt(districtEntry['Total HS'])} /></TextCell>
            <TextCell>
                <GenderRatioChart
                    femaleNum={parseInt(districtEntry['Female'])}
                    maleNum={parseInt(districtEntry['Male'])}
                />
            </TextCell>
        </TableRow>
        {isExpanded ? (
            Object.keys(csDistrictEnrollment).map((category) => (
                <TableRow key={`${districtEntry['LEA Name']}-${category}`}>
                    <NoBorderCell />
                    <NoBorderCell />
                    <TextCell style={{ color: CourseCategoryColor[category] }} colSpan={2} children={category} />
                    <TextCell>
                        <PercentageChart actualVal={csDistrictEnrollment[category]} percentage={csDistrictEnrollment[category] / sum(Object.values(csDistrictEnrollment))} />
                    </TextCell>
                    <NoBorderCell />
                </TableRow>
            ))
        ) : <></>}
    </>);
};

export default observer(DistrictRow);
