import { TableRow, Checkbox } from "@mui/material";
import { FC, useContext, useState } from "react";
import AttributeChart from "../CellComponents/AttributeChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { FunctionCell, TextCell } from "../GeneralComponents";
import PercentageChart from "../CellComponents/PercentageChart";
import { findAttribute } from "../../Interface/AttributeFinder";
import { format } from "d3-format";
import DistrictDataModal from "./DistrictDataModal"
import { CourseCategoryColor } from "../../Preset/Colors";

type Props = {
    districtEntry: Array<string | number>;
    titleEntry: string[];
};

const DistrictRow: FC<Props> = ({ districtEntry, titleEntry }: Props) => {
    const store = useContext(Store);

    const districtAttributeFinder = (attributeName: string) =>
        findAttribute(attributeName, titleEntry, districtEntry);

    const [selectedDistrict, setSelectedDistrict] = useState<Array<string | number> | null>();

    const openDistrictDataBreakdown = (districtEntry: Array<string | number>, titleEntry: string[]) => {
        setSelectedDistrict(districtEntry);
      };

    const closeDistrictDataBreakdown = () => {
        setSelectedDistrict(null);
      };

    return (<><TableRow>

        <FunctionCell >
            <Checkbox
                checked={store.selectedDistricts.includes(districtEntry[0] as string)}
                onChange={() => store.updateSelectedDistrict(districtEntry[0] as string)}

            />

        </FunctionCell>

        <TextCell style={{textDecoration:'underline', color:CourseCategoryColor[store.currentShownCSType], cursor: 'pointer'}} onClick={() => openDistrictDataBreakdown(districtEntry, titleEntry)}>{districtAttributeFinder('District Name')}</TextCell>
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
    {selectedDistrict && (
            <DistrictDataModal onClose={closeDistrictDataBreakdown} districtEntry={selectedDistrict} titleEntry={titleEntry} />
        )}
    </>
    )
        ;

};

export default observer(DistrictRow);

