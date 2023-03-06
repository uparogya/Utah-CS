import styled from "@emotion/styled";
import { format } from "d3-format";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import Store from "../../Interface/Store";
import { GenderColor, XDarkGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
import { ComponentSVG } from "../GeneralComponents";
type Props = {
    maleNum: number,
    femaleNum: number,
    compareMaleNum?: number,
    compareFemaleNum?: number;
};
const GenderRatioChart: FC<Props> = ({ maleNum, femaleNum, compareFemaleNum, compareMaleNum }: Props) => {

    const [totalStudent, setTotalStudent] = useState(maleNum + femaleNum);

    const [compareTotalStudent, setCompareTotalStudent] = useState(0);

    const store = useContext(Store);

    const [hasComparison, setHasComparison] = useState(false);

    useEffect(() => {
        setHasComparison(Boolean(compareFemaleNum || compareMaleNum));
        setCompareTotalStudent((compareFemaleNum || 0) + (compareMaleNum || 0));
    }, [compareFemaleNum, compareMaleNum]);


    useEffect(() => {
        setTotalStudent(maleNum + femaleNum);

    }, [maleNum, femaleNum]);

    const TextMargin = 5;
    return (totalStudent ?
        <ComponentSVG onClick={(e) => store.updateShowPercentage()} style={{ cursor: 'pointer' }}>
            <g>
                <rect
                    x={0}
                    y={0}
                    height={(hasComparison ? 0.5 : 1) * CellSVGHeight}
                    width={CellSVGWidth * (maleNum / totalStudent) || 0}
                    fill={GenderColor.male} />

                <rect x={(CellSVGWidth * (maleNum / totalStudent)) || 0}
                    y={0}
                    height={(hasComparison ? 0.5 : 1) * CellSVGHeight}
                    width={CellSVGWidth * (femaleNum / totalStudent) || 0}
                    fill={GenderColor.female} />
                <OnChartText children={store.showPercentage ? format('.0%')(maleNum / totalStudent) : maleNum} x={TextMargin} y={CellSVGHeight * (hasComparison ? 0.5 : 1) * 0.5} alignmentBaseline='middle' textAnchor='start' />
                <OnChartText children={store.showPercentage ? format('.0%')(femaleNum / totalStudent) : femaleNum} x={CellSVGWidth - TextMargin} y={CellSVGHeight * (compareMaleNum ? 0.5 : 1) * 0.5} fill={XDarkGray} alignmentBaseline='middle' textAnchor='end' />
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
                    <OnChartText children={store.showPercentage ? format('.0%')((compareMaleNum || 0) / compareTotalStudent) : (compareMaleNum || 0)} x={TextMargin} y={CellSVGHeight * 0.75} alignmentBaseline='middle' textAnchor='start' />
                    <OnChartText children={store.showPercentage ? format('.0%')((compareFemaleNum || 0) / compareTotalStudent) : (compareFemaleNum || 0)} x={CellSVGWidth - TextMargin} y={CellSVGHeight * 0.75} fill={XDarkGray} alignmentBaseline='middle' textAnchor='end' />
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
