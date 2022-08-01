import styled from "@emotion/styled";
import { Tooltip } from "@mui/material";
import { format } from "d3-format";
import { FC } from "react";
import { LightGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
import { ComponentSVG } from "../GeneralComponents";

type Props = {
    actualVal: number;
    percentage: number;
};

const PercentageChart: FC<Props> = ({ actualVal, percentage }: Props) => {
    return (
        <Tooltip title={format(',.2%')(percentage)}>
            <ComponentSVG>
                {/* minimum width would be 2 px to show things. */}
                <rect x={0}
                    y={0}
                    width={percentage * CellSVGWidth > 2 ? percentage * CellSVGWidth : 2}
                    height={CellSVGHeight}
                    fill={LightGray} />
                <BarText x={CellSVGWidth / 2}
                    y={CellSVGHeight / 2}
                    textAnchor='middle'>
                    {actualVal}
                </BarText>
            </ComponentSVG>
        </Tooltip>
    );
};

const BarText = styled.text`
    alignment-baseline: middle;
    fill: black;
`;

export default PercentageChart;