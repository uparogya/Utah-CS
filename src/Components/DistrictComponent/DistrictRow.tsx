import { TableRow, TableCell, Checkbox } from "@mui/material";
import { FC, useContext, useState } from "react";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FunctionCell, TextCells } from "../GeneralComponents";

type Props = {
    districtEntry: { [key: string]: string; };
};

const DistrictRow: FC<Props> = ({ districtEntry }: Props) => {
    const store = useContext(Store);
    const [isExpanded, setExpanded] = useState(false);
    return (<TableRow >
        <FunctionCell>
            <Checkbox checked={store.selectedDistricts.includes(districtEntry['LEA Name'])}
                onChange={(e, d) => { store.setSelectedDistricts(districtEntry['LEA Name']); }} />
        </FunctionCell>
        <FunctionCell style={{ paddingTop: '5px' }}
            onClick={() => setExpanded(!isExpanded)}>
            {isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        </FunctionCell>
        <TextCells>{districtEntry['LEA Name']}</TextCells>
        <TextCells>{districtEntry['Total HS']}</TextCells>
        <FunctionCell />
        <TextCells>
            <GenderRatioChart
                femaleNum={parseInt(districtEntry['Female'])}
                maleNum={parseInt(districtEntry['Male'])}
            />
        </TextCells>
    </TableRow>);
};

export default observer(DistrictRow);
