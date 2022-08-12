import { FC, useEffect, useState } from "react";
import { ComponentSVG } from "../GeneralComponents";
import { range } from 'd3-array';
import { CellSVGHeight, CellSVGWidth, RaceDictionary } from "../../Preset/Constants";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import { format } from "d3-format";
import { XDarkGray, RaceColor } from "../../Preset/Colors";
import styled from "@emotion/styled";
import { scaleBand, scaleLinear } from "d3-scale";

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


    const dialogSVGWidth = 300;
    const dialogSVGHeight = 500;

    const [outputObj, setOutput] = useState<{ [key: string]: number; }>({
        white: whiteNum,
        hispanic: hispaNum,
        asian: asianNum,
        black: blackNum,
        native: nativeNum,
        other: otherNum
    });

    const [topThreeRace, setTopThree] = useState(['black', 'asian', 'hispanic']);
    useEffect(() => {
        const output: { [key: string]: number; } = {
            white: whiteNum,
            hispanic: hispaNum,
            asian: asianNum,
            black: blackNum,
            native: nativeNum,
            other: otherNum
        };

        const topThree = Object.keys(output).sort((a, b) => output[b] - output[a]).filter(r => r !== 'white')!.slice(0, 3);
        setOutput(output);
        setTopThree(topThree);
    }, [whiteNum, nativeNum, blackNum, asianNum, otherNum, hispaNum]);

    const totalStudent = whiteNum + nativeNum + blackNum + asianNum + otherNum + hispaNum;

    const [openDialog, setDialogVisibility] = useState(false);

    const barChartScale = scaleLinear().domain([0, 1]).range([0, dialogSVGWidth]);
    const barChartHeightScale = scaleBand().domain(Object.keys(outputObj)).range([0, dialogSVGHeight]).padding(0.3);


    return (
        <div>
            <div onClick={() => setDialogVisibility(true)}>
                {topThreeRace.map((race) => (
                    <span key={`${keyIdentity}-${race}`}>
                        <SmallerText children={
                            `${RaceDictionary[race]}: ${format(',.2%')(outputObj[race] / totalStudent)}`
                        } /><br />
                    </span>
                ))}
            </div>
            <Dialog open={openDialog} onClose={() => setDialogVisibility(false)}>
                <DialogTitle children={`${keyIdentity} Race Breakdown`} />
                <DialogContent>
                    <svg width={dialogSVGWidth} height={dialogSVGHeight}>
                        {Object.keys(outputObj).map((d) => (
                            <g key={`${keyIdentity}${d}`}>
                                <rect x={0}
                                    fill={RaceColor[d]}
                                    height={barChartHeightScale.bandwidth()}
                                    y={barChartHeightScale(d)}
                                    width={barChartScale(outputObj[d] / totalStudent)} />
                                <text
                                    x={dialogSVGWidth}
                                    y={(barChartHeightScale(d) || 0) + 0.5 * barChartHeightScale.bandwidth()}
                                    alignmentBaseline='middle'
                                    fill={XDarkGray}
                                >
                                    <DialogTSpan x={dialogSVGWidth} dy='-0.8em'>
                                        {d}
                                    </DialogTSpan>
                                    <DialogTSpan x={dialogSVGWidth} dy='1.5em' >
                                        {outputObj[d]}, {format(',.2%')(outputObj[d] / totalStudent)}
                                    </DialogTSpan>

                                </text>
                            </g>
                        ))}
                    </svg>
                    <DialogActions>
                        <Button children='Close' onClick={() => setDialogVisibility(false)} />
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const SmallerText = styled.span({
    fontSize: 'smaller'
});
const DialogTSpan = styled.tspan({
    textAnchor: 'end',
    alignmentBaseline: 'middle'
});
export default RaceChart;
