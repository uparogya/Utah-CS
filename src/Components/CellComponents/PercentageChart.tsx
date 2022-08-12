import styled from "@emotion/styled";
import { format } from "d3-format";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../../Interface/Store";
import { LightGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";

type Props = {
    actualVal: number;
    percentage: number;
    tooltip?: string;
};

const PercentageChart: FC<Props> = ({ actualVal, percentage, tooltip }: Props) => {

    const store = useContext(Store);
    return (
        <SmallerComponentSVG onClick={() => store.updateShowPercentage()}>
            {/* minimum width would be 2 px to show things. */}
            <rect x={0}
                y={0}
                width={percentage * CellSVGWidth > 2 ? percentage * CellSVGWidth : 2}
                height={CellSVGHeight}
                fill={LightGray} />
            <BarText x={CellSVGWidth / 2}
                y={CellSVGHeight / 2}
                textAnchor='middle'>
                {store.showPercentage ? format(',.2%')(percentage) : actualVal}
            </BarText>
        </SmallerComponentSVG>
    );
};

const BarText = styled.text`
    alignment-baseline: middle;
    fill: black;
`;

const SmallerComponentSVG = styled.svg({
    width: CellSVGWidth - 20,
    height: CellSVGHeight,
    verticalAlign: 'middle'
});

export default observer(PercentageChart);