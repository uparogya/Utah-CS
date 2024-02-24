import { TableRow, Checkbox } from "@mui/material";
import { FC, useContext } from "react";
import AttributeChart from "../CellComponents/AttributeChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { FunctionCell, TextCell } from "../GeneralComponents";
import PercentageChart from "../CellComponents/PercentageChart";
import { findAttribute } from "../../Interface/AttributeFinder";
import { format } from "d3-format";

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
        {/* schoolAttributeFinder('TOTAL: Total') >= 0 ? format(',')(schoolAttributeFinder('TOTAL: Total')) : (schoolAttributeFinder('TOTAL: Total'))} */}
        <TextCell>{districtAttributeFinder('TOTAL: Total') >= 0 ? format(',')(districtAttributeFinder('TOTAL: Total')) : districtAttributeFinder('TOTAL: Total')}</TextCell>

        <TextCell>
            <PercentageChart
                actualVal={districtAttributeFinder(`${store.currentShownCSType}: Total`)}
                percentage={districtAttributeFinder(`${store.currentShownCSType}: Total`) / districtAttributeFinder('TOTAL: Total')} />
        </TextCell>
        <TextCell>
            <AttributeChart option='gender' keyIdentity="CSDistrict"
                outputObj={{
                    male: districtAttributeFinder(`${store.currentShownCSType}: Male`),
                    female: districtAttributeFinder(`${store.currentShownCSType}: Female`),
                }}
            />
        </TextCell>
    </TableRow>
        ;

};

export default observer(DistrictRow);

