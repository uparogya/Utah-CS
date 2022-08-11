import styled from "@emotion/styled";
import { Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { GenderColor, XDarkGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
import { ComponentSVG } from "../GeneralComponents";
type Props = {
    maleNum: number,
    femaleNum: number,
};
const GenderRatioChart: FC<Props> = ({ maleNum, femaleNum }: Props) => {

    const [totalStudent, setTotalStudent] = useState(maleNum + femaleNum);

    useEffect(() => {
        setTotalStudent(maleNum + femaleNum);
    }, [maleNum, femaleNum]);
    return (
        <ComponentSVG>
            <g>

                <rect
                    x={0}
                    y={0}
                    height={CellSVGHeight}
                    width={CellSVGWidth * (maleNum / totalStudent)}
                    fill={GenderColor.male} />

                <rect x={CellSVGWidth * (maleNum / totalStudent)}
                    y={0}
                    height={CellSVGHeight}
                    width={CellSVGWidth * (femaleNum
                        / totalStudent)}
                    fill={GenderColor.female} />
                <OnChartText children={maleNum} x={0} y={CellSVGHeight * 0.5} alignmentBaseline='middle' textAnchor='start' />
                <OnChartText children={femaleNum} x={CellSVGWidth} y={CellSVGHeight * 0.5} fill={XDarkGray} alignmentBaseline='middle' textAnchor='end' />
            </g>
        </ComponentSVG>
    );
};

export default GenderRatioChart;

const OnChartText = styled.text({
    fill: XDarkGray,
    fontSize: 'smaller'
});