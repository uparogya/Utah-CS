import { FC } from "react";
import { ComponentSVG } from "../GeneralComponents";
import { range } from 'd3-array';
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
import { Tooltip } from "@mui/material";
import { format } from "d3-format";
import { RaceColor } from "../../Preset/Colors";

type Props = {
    whiteNum: number,
    nativeNum: number,
    blackNum: number,
    //asian / pacific islander
    asianNum: number,
    otherNum: number,
    hispaNum: number,
    keyIdentity: string,
    otherTooltip?: string,
};

const RaceChart: FC<Props> = ({ keyIdentity, whiteNum, nativeNum, blackNum, asianNum, otherNum, hispaNum, otherTooltip }: Props) => {


    const rectWidth = CellSVGWidth / 20;
    const rectHeight = CellSVGHeight / 5;
    const totalStudent = whiteNum + nativeNum + blackNum + asianNum + otherNum + hispaNum;

    //sequence: white, hispanic, black, native, asian, other

    const findFill = (index: number) => {

        let cumulator = Math.round(whiteNum / totalStudent * 100);
        if ((index + 1) <= cumulator) {
            return { color: RaceColor.white, tooltip: `White: ${whiteNum}, ${format(',.2%')(whiteNum / totalStudent)}` };
        }
        cumulator += Math.round(hispaNum / totalStudent * 100);
        if ((index + 1) <= cumulator) {
            return { color: RaceColor.hispanic, tooltip: `Hispanic: ${hispaNum}, ${format(',.2%')(hispaNum / totalStudent)}` };
        }
        cumulator += Math.round(blackNum / totalStudent * 100);
        if ((index + 1) <= cumulator) {
            return { color: RaceColor.black, tooltip: `Black: ${blackNum}, ${format(',.2%')(blackNum / totalStudent)} ` };
        }
        cumulator += Math.round(nativeNum / totalStudent * 100);
        if ((index + 1) <= cumulator) {
            return { color: RaceColor.native, tooltip: `Native American: ${nativeNum}, ${format(',.2%')(nativeNum / totalStudent)} ` };
        }
        cumulator += Math.round(asianNum / totalStudent * 100);
        if ((index + 1) <= cumulator) {
            return { color: RaceColor.asian, tooltip: `Asian / Pacific Islander: ${asianNum}, ${format(',.2%')(asianNum / totalStudent)} ` };
        }
        return { color: RaceColor.other, tooltip: otherTooltip || `Other: ${otherNum} ` };
    };



    return (<ComponentSVG>
        {range(100).map((index) => {
            const { color, tooltip } = findFill(index);
            return (
                <Tooltip title={tooltip} key={`${keyIdentity
                    } -${index} `}>
                    <rect
                        x={index % 20 * rectWidth}
                        y={Math.floor(index / 20) * rectHeight}
                        width={rectWidth - 1}
                        height={rectHeight - 1}
                        fill={color}

                    />
                </Tooltip>);
        })}
    </ComponentSVG>);
};

export default RaceChart;;;;;;;