import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { sum } from "d3-array";
import { format } from "d3-format";
import { scaleLinear, scaleBand } from "d3-scale";
import { observer } from "mobx-react-lite";
import { FC, useContext, } from "react";
import { RaceColor } from "../../Preset/Colors";
import styled from "@emotion/styled";
import Store from "../../Interface/Store";
import { RaceDictionary } from "../../Preset/Constants";

type Props = {
    openDialog: boolean,
    setDialogVisibility: (value: boolean) => void,
    stateRaceOutput: { [key: string]: number; },
    CSRaceOutput: { [key: string]: number; };
};
const RaceDialog: FC<Props> = ({ openDialog, setDialogVisibility, stateRaceOutput, CSRaceOutput }) => {



    const store = useContext(Store);

    const dialogSVGWidth = 300;
    const dialogSVGHeight = 500;
    const leftPadding = 50;


    const barChartScale = scaleLinear().domain([0, 1]).range([leftPadding, dialogSVGWidth]);
    const barChartHeightScale = scaleBand().domain(Object.keys(stateRaceOutput)).range([0, dialogSVGHeight]).padding(0.3);



    return (<Dialog open={openDialog} onClose={() => setDialogVisibility(false)}>
        <DialogTitle children={`${store.currentShownCSType} Race Breakdown`} />
        <DialogContent>
            <svg width={dialogSVGWidth} height={dialogSVGHeight}>
                {Object.keys(stateRaceOutput).map((d) => (
                    <g key={`${d}`}>
                        <rect x={leftPadding}
                            fill={RaceColor[d]}
                            height={barChartHeightScale.bandwidth() * 0.45}
                            y={barChartHeightScale(d)}
                            width={barChartScale(stateRaceOutput[d] / sum(Object.values(stateRaceOutput))) - leftPadding} />
                        <rect x={leftPadding}
                            fill={RaceColor[d]}
                            height={barChartHeightScale.bandwidth() * 0.45}
                            y={(barChartHeightScale(d) || 0) + barChartHeightScale.bandwidth() * 0.55}
                            width={barChartScale(CSRaceOutput[d] / sum(Object.values(CSRaceOutput))) - leftPadding} />
                        <g>
                            <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) + 0.25 * barChartHeightScale.bandwidth()}
                            >
                                State
                            </DialogText>
                            <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) + 0.75 * barChartHeightScale.bandwidth()}
                            >
                                CS
                            </DialogText>
                            <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) - 12} fontWeight='bold'>
                                {RaceDictionary[d]}
                            </DialogText>
                        </g>

                        <g>
                            <NumberLabText x={dialogSVGWidth} y={(barChartHeightScale(d) || 0) + 0.45 * 0.5 * barChartHeightScale.bandwidth()}>
                                {`${stateRaceOutput[d]}, ${format(',.2%')(stateRaceOutput[d] / sum(Object.values(stateRaceOutput)))}`}
                            </NumberLabText>
                            <NumberLabText x={dialogSVGWidth} y={(barChartHeightScale(d) || 0) + 0.75 * barChartHeightScale.bandwidth()}>
                                {`${CSRaceOutput[d]}, ${format(',.2%')(CSRaceOutput[d] / sum(Object.values(CSRaceOutput)))}`}
                            </NumberLabText>
                        </g>
                    </g>
                ))}
            </svg>
            <DialogActions>
                <Button children='Close' onClick={() => setDialogVisibility(false)} />
            </DialogActions>
        </DialogContent>
    </Dialog>);
};

export default observer(RaceDialog);

const DialogText = styled.text({
    fontSize: 'small',
    alignmentBaseline: 'central',
    textAnchor: 'start'
});

const NumberLabText = styled.text({
    fontSize: 'x-small',
    alignmentBaseline: 'central',
    textAnchor: 'end'
});
