import { TableRow, Checkbox, FormControl, FormControlLabel } from "@mui/material";
import { FC, useContext } from "react";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { TextCell } from "../GeneralComponents";
import PercentageChart from "../CellComponents/PercentageChart";
import { findAttribute } from "../../Interface/AttributeFinder";
import styled from "@emotion/styled";

type Props = {
    districtEntry: Array<string | number>;
    titleEntry: string[];
};

const DistrictRow: FC<Props> = ({ districtEntry, titleEntry }: Props) => {
    const store = useContext(Store);

    const districtAttributeFinder = (attributeName: string) =>
        findAttribute(attributeName, titleEntry, districtEntry);



    return <TableRow>

        <TextCell style={{ textAlign: 'left' }}>
            <FormControl>

                <FormControlLabel
                    control={<Checkbox
                        checked={store.selectedDistricts.includes(districtEntry[0] as string)}
                        onChange={() => store.setSelectedDistricts(districtEntry[0] as string)}

                    />} label={<Label>{districtAttributeFinder('District Name')}</Label>} />
            </FormControl>


        </TextCell>
        <TextCell>{districtAttributeFinder('TOTAL: Total')}</TextCell>

        <TextCell>
            <PercentageChart
                actualVal={districtAttributeFinder(`${store.currentShownCSType}: Total`)}
                percentage={districtAttributeFinder(`${store.currentShownCSType}: Total`) / districtAttributeFinder('TOTAL: Total')} />
        </TextCell>
        <TextCell>
            <GenderRatioChart
                femaleNum={districtAttributeFinder('TOTAL: Female')}
                maleNum={districtAttributeFinder('TOTAL: Male')}
                compareFemaleNum={districtAttributeFinder(`${store.currentShownCSType}: Female`)}
                compareMaleNum={districtAttributeFinder(`${store.currentShownCSType}: Male`)}
            />
        </TextCell>
    </TableRow>
        ;

};

export default observer(DistrictRow);


const Label = styled.span({
    fontSize: '0.875rem'
});
