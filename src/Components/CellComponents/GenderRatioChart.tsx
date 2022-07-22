import styled from "@emotion/styled";
import { FC } from "react";
import { CellSVGHeight, CellSVGWidth, FemaleColor, MaleColor } from "../../Preset/Constants";
type Props = {
    maleNum: number,
    femaleNum: number,
};
const GenderRatioChart: FC<Props> = ({ maleNum, femaleNum
}: Props) => {

    return (
        <ComponentSVG>
            <g>
                <rect
                    x={0}
                    y={0}
                    height={CellSVGHeight}
                    width={CellSVGWidth * (maleNum / (maleNum + femaleNum
                    ))}
                    fill={MaleColor} />
                <rect x={CellSVGWidth * (maleNum / (maleNum + femaleNum
                ))}
                    y={0}
                    height={CellSVGHeight}
                    width={CellSVGWidth * (femaleNum
                        / (maleNum + femaleNum
                        ))}
                    fill={FemaleColor} />
            </g>
            <g>
                <BarText
                    x={2}
                    y={0.5 * CellSVGHeight}
                    textAnchor="start"
                >
                    {maleNum}
                </BarText>
                <BarText
                    x={CellSVGWidth - 2}
                    y={0.5 * CellSVGHeight}
                    textAnchor="end">
                    {femaleNum}
                </BarText>
            </g>
        </ComponentSVG>
    );
};

export default GenderRatioChart;

const ComponentSVG = styled.svg`
    width: ${CellSVGWidth}px;
    height: ${CellSVGHeight}px
`;

const BarText = styled.text`
    alignment-baseline: middle;
    fill: white;
`;