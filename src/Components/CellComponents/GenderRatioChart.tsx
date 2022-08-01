import { Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { GenderColor } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
import { ComponentSVG } from "../GeneralComponents";
type Props = {
    maleNum: number,
    femaleNum: number,
    otherNum: number,
};
const GenderRatioChart: FC<Props> = ({ maleNum, femaleNum, otherNum }: Props) => {

    const [totalStudent, setTotalStudent] = useState(maleNum + femaleNum + otherNum);

    useEffect(() => {
        setTotalStudent(maleNum + femaleNum + otherNum);
    }, [maleNum, femaleNum, otherNum]);
    return (
        <ComponentSVG>
            <g>
                <Tooltip title={`Male: ${maleNum}`}>
                    <rect
                        x={0}
                        y={0}
                        height={CellSVGHeight}
                        width={CellSVGWidth * (maleNum / totalStudent)}
                        fill={GenderColor.male} />
                </Tooltip>
                <Tooltip title={`Female: ${femaleNum}`}>
                    <rect x={CellSVGWidth * (maleNum / totalStudent)}
                        y={0}
                        height={CellSVGHeight}
                        width={CellSVGWidth * (femaleNum
                            / totalStudent)}
                        fill={GenderColor.female} />
                </Tooltip>
                {otherNum > 0 ? <Tooltip title={`Other: ${otherNum}`}>
                    <rect x={CellSVGHeight * ((maleNum + femaleNum) / totalStudent)}
                        y={0}
                        height={CellSVGHeight}
                        fill={GenderColor.other}
                        width={CellSVGHeight * otherNum / totalStudent}
                    />
                </Tooltip> : <></>}

            </g>
        </ComponentSVG>
    );
};

export default GenderRatioChart;

