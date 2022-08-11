import { TableRow, TableCell, Checkbox } from "@mui/material";
import { FC, useContext, useState } from "react";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type Props = {
    districtEntry: { [key: string]: string; };
};

const DistrictRow: FC<Props> = ({ districtEntry }: Props) => {
    const store = useContext(Store);
    const [isExpanded, setExpanded] = useState(false);
    return (<TableRow >
        <TableCell>
            <Checkbox checked={store.selectedDistricts.includes(districtEntry['LEA Name'])}
                onChange={(e, d) => { store.setSelectedDistricts(districtEntry['LEA Name']); }} />
        </TableCell>
        <TableCell onClick={() => setExpanded(!isExpanded)}>{isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</TableCell>
        <TableCell>{districtEntry['LEA Name']}</TableCell>

        <TableCell>{districtEntry['Total HS']}</TableCell>
        <TableCell></TableCell>
        <TableCell>
            <GenderRatioChart
                femaleNum={parseInt(districtEntry['Female'])}
                maleNum={parseInt(districtEntry['Male'])}
            />
        </TableCell>
    </TableRow>);
};

export default observer(DistrictRow);