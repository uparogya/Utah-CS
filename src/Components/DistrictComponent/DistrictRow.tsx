import { TableRow, Checkbox, FormControl, FormControlLabel } from "@mui/material";
import { FC, useContext } from "react";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import Store from "../../Interface/Store";
import { observer } from "mobx-react-lite";
import { TextCell } from "../GeneralComponents";
import PercentageChart from "../CellComponents/PercentageChart";
import { findAttribute } from "../../Interface/AttributeFinder";

type Props = {
    districtEntry: Array<string | number>;
    titleEntry: string[];
};

const DistrictRow: FC<Props> = ({ districtEntry, titleEntry }: Props) => {
    const store = useContext(Store);
    // const [isExpanded, setExpanded] = useState(false);




    // const findAttribute = (attributeName: string) => {

    //     return ((districtEntry[titleEntry.indexOf(attributeName)]) as number) || 0;
    // };

    const districtAttributeFinder = (attributeName: string) =>
        findAttribute(attributeName, titleEntry, districtEntry);



    return <TableRow>

        <TextCell style={{ textAlign: 'left' }}>
            <FormControl>

                <FormControlLabel
                    control={<Checkbox
                        checked={store.selectedDistricts.includes(districtEntry[0] as string)}
                        onChange={() => store.setSelectedDistricts(districtEntry[0] as string)}
                    />} label={districtAttributeFinder('District Name')} />
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

// const getSum = (districtEnrollment: { [key: string]: CSDemographic; }) => {
//     let hasSpecialCase = false;
//     const sumResult = sum(Object.values(districtEnrollment).map(d => {
//         hasSpecialCase = hasSpecialCase || d.Total === 'n<10';
//         return d.Total as number;
//     }));
//     if (!sumResult && hasSpecialCase) {

//     }
//     return (!sumResult && hasSpecialCase) ? 'n<10' : sumResult;

// };
