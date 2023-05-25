import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import Store from "../../Interface/Store";
import { GenderColor, XDarkGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
import { ComponentSVG } from "../GeneralComponents";
import { computeTextOutcome } from "./PercentageChart";
type Props = {
    maleNum: number | string,
    femaleNum: number | string,
    compareMaleNum?: number,
    compareFemaleNum?: number;
    totalStudent: number | string;
};
const GenderRatioChart: FC<Props> = ({ maleNum, femaleNum, compareFemaleNum, compareMaleNum, totalStudent }: Props) => {

    // const [totalStudent, setTotalStudent] = useState(maleNum + femaleNum);

    const [compareTotalStudent, setCompareTotalStudent] = useState(0);

    const store = useContext(Store);

    const [hasComparison, setHasComparison] = useState(false);

    useEffect(() => {
        setHasComparison(Boolean(compareFemaleNum || compareMaleNum));
        setCompareTotalStudent((+(compareFemaleNum || 0) || 0) + (+(compareMaleNum || 0) || 0));
    }, [compareFemaleNum, compareMaleNum]);

    const [computedFemale, setFemale] = useState(femaleNum);

    const [computedMale, setMale] = useState(maleNum);

    useEffect(() => {
        if (femaleNum === 'n<10' && (+totalStudent) - (+maleNum) > 0) {
            setFemale((+totalStudent) - (+maleNum));
            setMale(+maleNum);
        } else if (maleNum === 'n<10' && (+totalStudent) - (+femaleNum) > 0) {
            setMale((+totalStudent) - (+femaleNum));
            setFemale(+femaleNum);
        }
        else {
            setFemale(femaleNum);
            setMale(maleNum);
        }
    }, [maleNum, femaleNum, totalStudent, store.currentShownCSType]);



    const TextMargin = 5;
    const RectMargin = 2;
    return (totalStudent ?
        <ComponentSVG onClick={(e) => store.updateShowPercentage()} style={{ cursor: 'pointer' }}>
            <g>
                <rect
                    x={0}
                    y={RectMargin}
                    height={(hasComparison ? 0.5 : 1) * CellSVGHeight - 2 * RectMargin}
                    width={CellSVGWidth * (((+computedMale) / (+totalStudent)) || 0.5)}
                    strokeWidth={2}
                    fillOpacity={(+totalStudent) ? 1 : 0}
                    stroke={GenderColor.male}
                    fill={GenderColor.male} />

                <rect x={CellSVGWidth * (((+computedMale) / (+totalStudent)) || 0.5)}
                    y={RectMargin}
                    height={(hasComparison ? 0.5 : 1) * CellSVGHeight - 2 * RectMargin}
                    width={CellSVGWidth * (((+computedFemale) / (+totalStudent)) || 0.5)}
                    strokeWidth={2}
                    stroke={GenderColor.female}
                    fillOpacity={(+totalStudent) ? 1 : 0}
                    fill={GenderColor.female} />

                <OnChartText children={computeTextOutcome(computedMale, (+computedMale) / (+totalStudent), store.showPercentage)} x={TextMargin} y={CellSVGHeight * (hasComparison ? 0.5 : 1) * 0.5} alignmentBaseline='middle' textAnchor='start' />
                <OnChartText children={computeTextOutcome(computedFemale, (+computedFemale) / (+totalStudent), store.showPercentage)} x={CellSVGWidth - TextMargin} y={CellSVGHeight * (compareMaleNum ? 0.5 : 1) * 0.5} fill={XDarkGray} alignmentBaseline='middle' textAnchor='end' />
            </g>
            {
                hasComparison ? <g>
                    <rect
                        x={0}
                        y={0.5 * CellSVGHeight}
                        height={0.5 * CellSVGHeight}
                        width={CellSVGWidth * ((compareMaleNum || 0) / compareTotalStudent) || 0}
                        fill={GenderColor.male} />

                    <rect x={(CellSVGWidth * ((compareMaleNum || 0) / compareTotalStudent)) || 0}
                        y={0.5 * CellSVGHeight}
                        height={0.5 * CellSVGHeight}
                        width={CellSVGWidth * ((compareFemaleNum || 0) / compareTotalStudent) || 0}
                        fill={GenderColor.female} />

                    <OnChartText children={computeTextOutcome(compareMaleNum || 0, (compareMaleNum || 0) / compareTotalStudent, store.showPercentage)} x={TextMargin} y={CellSVGHeight * 0.75} alignmentBaseline='middle' textAnchor='start' />
                    <OnChartText children={computeTextOutcome(compareFemaleNum || 0, (compareFemaleNum || 0) / compareTotalStudent, store.showPercentage)} x={CellSVGWidth - TextMargin} y={CellSVGHeight * 0.75} fill={XDarkGray} alignmentBaseline='middle' textAnchor='end' />
                </g> : <></>
            }

        </ComponentSVG> : <>-</>
    );
};

export default observer(GenderRatioChart);

const OnChartText = styled.text({
    fill: XDarkGray,
    fontSize: 'smaller'
});
