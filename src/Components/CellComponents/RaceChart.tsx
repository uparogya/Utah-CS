import { FC, useEffect, useState } from "react";
import { ComponentSVG } from "../GeneralComponents";
import { range } from 'd3-array';
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
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

    useEffect(() => {
        setOutput({
            white: whiteNum,
            hispanic: hispaNum,
            asian: asianNum,
            black: blackNum,
            native: nativeNum,
            other: otherNum
        });
    }, [whiteNum, nativeNum, blackNum, asianNum, otherNum, hispaNum]);

    const totalStudent = whiteNum + nativeNum + blackNum + asianNum + otherNum + hispaNum;

    const [openDialog, setDialogVisibility] = useState(false);

    const barChartScale = scaleLinear().domain([0, 1]).range([0, dialogSVGWidth]);
    const barChartHeightScale = scaleBand().domain(Object.keys(outputObj)).range([0, dialogSVGHeight]).padding(0.3);

    return (
        <div>
            <div onClick={() => setDialogVisibility(true)}>
                <SmallerText>Black: {format(',.2%')(blackNum / totalStudent)}</SmallerText><br />
                <SmallerText>Hispanic: {format(',.2%')(hispaNum / totalStudent)}</SmallerText><br />
                <SmallerText>Asian: {format(',.2%')(asianNum / totalStudent)}</SmallerText><br />
                <SmallerText>Native American: {format(',.2%')(nativeNum / totalStudent)} </SmallerText>
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
                                <text children={`${d}, ${outputObj[d]}, ${format(',.2%')(outputObj[d] / totalStudent)}`}
                                    x={dialogSVGWidth}
                                    y={(barChartHeightScale(d) || 0) + 0.5 * barChartHeightScale.bandwidth()}
                                    alignmentBaseline='middle'
                                    fill={XDarkGray}
                                    textAnchor='end' />
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

export default RaceChart;
