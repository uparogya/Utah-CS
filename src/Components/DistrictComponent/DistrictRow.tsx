import { TableRow, Checkbox } from "@mui/material";
import { FC, useContext } from "react";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { FunctionCell, TextCell } from "../GeneralComponents";
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

        <FunctionCell >
            <Checkbox
                checked={store.selectedDistricts.includes(districtEntry[0] as string)}
                onChange={() => store.updateSelectedDistrict(districtEntry[0] as string)}

            />

        </FunctionCell>

        <TextCell>{districtAttributeFinder('District Name')}</TextCell>
        <TextCell>{districtAttributeFinder('TOTAL: Total')}</TextCell>

        <TextCell>
            <PercentageChart
                actualVal={districtAttributeFinder(`${store.currentShownCSType}: Total`)}
                percentage={districtAttributeFinder(`${store.currentShownCSType}: Total`) / districtAttributeFinder('TOTAL: Total')} />
        </TextCell>
        <TextCell>
            <GenderRatioChart
                // femaleNum={districtAttributeFinder('TOTAL: Female')}
                // maleNum={districtAttributeFinder('TOTAL: Male')}
                totalStudent={districtAttributeFinder(`${store.currentShownCSType}: Total`)}
                femaleNum={districtAttributeFinder(`${store.currentShownCSType}: Female`)}
                maleNum={districtAttributeFinder(`${store.currentShownCSType}: Male`)}
            />
        </TextCell>
    </TableRow>
        ;

};

export default observer(DistrictRow);


const Label = styled.span({
    fontSize: '0.875rem'
});
