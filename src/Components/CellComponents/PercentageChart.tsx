import styled from "@emotion/styled";
import { format } from "d3-format";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../../Interface/Store";
import { LightGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";

type Props = {
    actualVal: number | string;
    percentage: number;
    tooltip?: string;
};

const PercentageChart: FC<Props> = ({ actualVal, percentage, tooltip }: Props) => {

    const store = useContext(Store);

    return (
        <SmallerComponentSVG onClick={() => actualVal === 0 ? null : store.updateShowPercentage()} >
            {/* minimum width would be 2 px to show things. */}
            {computeTextOutcome(actualVal, percentage, store.showPercentage) === '0' ? <></> : <rect x={0} y={0}
                fill="none"
                width={CellSVGWidth}
                height={CellSVGHeight}
                strokeWidth={2}
                stroke={LightGray} />}

            <rect x={0}
                y={0}
                opacity={actualVal === 0 ? 0 : 1}
                width={(percentage * CellSVGWidth > 2 ? percentage * CellSVGWidth : 2) || 0}
                height={CellSVGHeight}
                fill={LightGray} />

            <BarText x={CellSVGWidth / 2}
                y={CellSVGHeight / 2}
                textAnchor='middle'>
                {computeTextOutcome(actualVal, percentage, store.showPercentage)}
            </BarText>
        </SmallerComponentSVG>
    );
};

const computeTextOutcome = (input: string | number, percentage: number, showPercentage: boolean) => {
    if (input === 0) {
        return '-';
    }
    if (input === 'n<10') {
        return input;
    }
    return showPercentage ? format(',.2%')(percentage) : input;
};

const BarText = styled.text`
    alignment-baseline: middle;
    fill: black;
`;

const SmallerComponentSVG = styled.svg({
    width: CellSVGWidth,
    height: CellSVGHeight,
    verticalAlign: 'middle'
});

export default observer(PercentageChart);
