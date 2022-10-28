import { TableRow, TableCell, Checkbox } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FunctionCell, NoBorderCell, TextCell } from "../GeneralComponents";
import PercentageChart from "../CellComponents/PercentageChart";
import { sum } from "d3-array";
import RemoveIcon from '@mui/icons-material/Remove';
import { CourseCategoryColor } from "../../Preset/Colors";
import { CSDemographic } from "../../Interface/Types";

type Props = {
    districtEntry: { [key: string]: string | { [key: string]: CSDemographic; }; };
};

const DistrictRow: FC<Props> = ({ districtEntry }: Props) => {
    const store = useContext(Store);
    const [isExpanded, setExpanded] = useState(false);
    const [isExpandable, setExpandable] = useState(districtEntry.expandable === 'true');

    const [csDistrictEnrollment, setCSEnrollment] = useState<{ [key: string]: CSDemographic; }>(districtEntry['enrollment'] as { [key: string]: CSDemographic; });

    useEffect(() => {
        setCSEnrollment(districtEntry['enrollment'] as { [key: string]: CSDemographic; });

        setExpandable(districtEntry['expandable'] === 'true');
    }, [districtEntry]);




    const expansionToggle = () => {
        if (isExpandable) {
            setExpanded(!isExpanded);
        }
    };

    return (<>
        <TableRow >
            <FunctionCell>
                <Checkbox checked={store.selectedDistricts.includes(districtEntry['LEA Name'] as string)}
                    onChange={() => store.setSelectedDistricts(districtEntry['LEA Name'] as string)} />
            </FunctionCell>

            <FunctionCell style={{ paddingTop: '5px' }}
                onClick={expansionToggle}>
                {isExpandable ? (isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />) : <RemoveIcon style={{ paddingLeft: '2px' }} fontSize="small" />}
            </FunctionCell>
            <TextCell onClick={expansionToggle}>{districtEntry['LEA Name'] as string}</TextCell>
            <TextCell onClick={expansionToggle}>{districtEntry['Total HS'] as string}</TextCell>
            <TextCell> <PercentageChart actualVal={getSum(csDistrictEnrollment)} percentage={sum(Object.values(csDistrictEnrollment).map(d => d.Total as number)) / parseInt(districtEntry['Total HS'] as string)} /></TextCell>
            <TextCell>
                <GenderRatioChart
                    femaleNum={parseInt(districtEntry['Female'] as string)}
                    maleNum={parseInt(districtEntry['Male'] as string)}
                />
            </TextCell>



        </TableRow>
        {isExpanded ? (
            Object.keys(csDistrictEnrollment).map((category) => (
                csDistrictEnrollment[category].Total ?
                    <TableRow key={`${districtEntry['LEA Name']}-${category}`}>
                        <NoBorderCell />
                        <NoBorderCell />
                        <TextCell style={{ color: CourseCategoryColor[category] }} children={category} />
                        <TextCell colSpan={2}>
                            <PercentageChart actualVal={csDistrictEnrollment[category].Total as number} percentage={csDistrictEnrollment[category].Total as number / sum(Object.values(csDistrictEnrollment).map(d => d.Total as number))} />
                        </TextCell>

                        <TextCell>
                            <GenderRatioChart femaleNum={csDistrictEnrollment[category].Female as number} maleNum={csDistrictEnrollment[category].Total as number - (csDistrictEnrollment[category].Female as number)} />
                        </TextCell>
                    </TableRow> : <></>
            ))
        ) : <></>}
    </>);
};

export default observer(DistrictRow);

const getSum = (districtEnrollment: { [key: string]: CSDemographic; }) => {
    let hasSpecialCase = false;
    const sumResult = sum(Object.values(districtEnrollment).map(d => {
        hasSpecialCase = hasSpecialCase || d.Total === 'n<10';
        return d.Total as number;
    }));
    if (!sumResult && hasSpecialCase) {

    }
    return (!sumResult && hasSpecialCase) ? 'n<10' : sumResult;

};
