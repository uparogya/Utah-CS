import { TableRow, Checkbox } from "@mui/material";
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
    districtEntry: Array<string | number>;
    titleEntry: string[];
};

const DistrictRow: FC<Props> = ({ districtEntry, titleEntry }: Props) => {
    const store = useContext(Store);
    const [isExpanded, setExpanded] = useState(false);




    const findAttribute = (attributeName: string) => {

        return ((districtEntry[titleEntry.indexOf(attributeName)]) as number) || 0;
    };



    return (<>
        <TableRow>
            <FunctionCell>
                <Checkbox checked={store.selectedDistricts.includes(districtEntry[0] as string)}
                    onChange={() => store.setSelectedDistricts(districtEntry[0] as string)} />
            </FunctionCell>

            <TextCell>{findAttribute('District Name')}</TextCell>
            <TextCell>{findAttribute('TOTAL: Total')}</TextCell>

            <TextCell>
                <PercentageChart
                    actualVal={findAttribute(`${store.currentShownCSType}: Total`)}
                    percentage={findAttribute(`${store.currentShownCSType}: Total`) / findAttribute('TOTAL: Total')} />
            </TextCell>
            <TextCell>
                <GenderRatioChart
                    femaleNum={findAttribute('TOTAL: Female')}
                    maleNum={findAttribute('TOTAL: Male')}
                    compareFemaleNum={findAttribute(`${store.currentShownCSType}: Female`)}
                    compareMaleNum={findAttribute(`${store.currentShownCSType}: Male`)}
                />
            </TextCell>
        </TableRow>
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
