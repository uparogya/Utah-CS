import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { sum } from "d3-array";
import { format } from "d3-format";
import { scaleLinear, scaleBand } from "d3-scale";
import { observer } from "mobx-react-lite";
import { FC, useContext, } from "react";
import { RaceColor } from "../../Preset/Colors";
import styled from "@emotion/styled";
import Store from "../../Interface/Store";
import { RaceDictionary, PossibleCategories } from "../../Preset/Constants";

type Props = {
    openDialog: boolean,
    setDialogVisibility: (value: boolean) => void,
    stateRaceOutput?: { [key: string]: number; },
    CSRaceOutput: { [key: string]: number; };
};
const RaceDialog: FC<Props> = ({ openDialog, setDialogVisibility, CSRaceOutput, stateRaceOutput }) => {



    const store = useContext(Store);

    const dialogSVGWidth = 300;
    const dialogSVGHeight = 500;
    const leftPadding = 50;


    const barChartScale = scaleLinear().domain([0, 1]).range([leftPadding, dialogSVGWidth]);
    const barChartHeightScale = scaleBand().domain(Object.keys(CSRaceOutput)).range([0, dialogSVGHeight]).padding(0.3);

    const currentCSTypeShortName = PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName;

    return (<Dialog open={openDialog} onClose={() => setDialogVisibility(false)}>
        <DialogTitle children={`${currentCSTypeShortName} Race Breakdown`} />
        <DialogContent>
            <svg width={dialogSVGWidth} height={dialogSVGHeight}>
                {Object.keys(CSRaceOutput).map((d) => (
                    <g key={`${d}`}>
                        {stateRaceOutput ? <rect x={leftPadding}
                            fill={RaceColor[d]}
                            height={barChartHeightScale.bandwidth() * 0.45}
                            y={barChartHeightScale(d)}
                            width={barChartScale(stateRaceOutput[d] / sum(Object.values(stateRaceOutput))) - leftPadding} /> : <></>}

                        <rect x={leftPadding}
                            fill={RaceColor[d]}
                            height={barChartHeightScale.bandwidth() * 0.45}
                            y={(barChartHeightScale(d) || 0) + barChartHeightScale.bandwidth() * (0.55 - (stateRaceOutput ? 0 : 0.25))}
                            width={barChartScale(CSRaceOutput[d] / sum(Object.values(CSRaceOutput))) - leftPadding} />

                        <g>
                            {stateRaceOutput ? <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) + 0.25 * barChartHeightScale.bandwidth()}
                            >
                                State
                            </DialogText> : <></>}

                            <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) + (0.5 + (stateRaceOutput ? 0.25 : 0)) * barChartHeightScale.bandwidth()}
                            >
                                {currentCSTypeShortName}
                            </DialogText>
                            <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) - 12} fontWeight='bold'>
                                {RaceDictionary[d]}
                            </DialogText>
                        </g>

                        <g>
                            {stateRaceOutput ? <NumberLabText x={dialogSVGWidth} y={(barChartHeightScale(d) || 0) + 0.45 * 0.5 * barChartHeightScale.bandwidth()}>
                                {`${stateRaceOutput[d].toLocaleString("en-US")} (${format(',.1%')(stateRaceOutput[d] / sum(Object.values(stateRaceOutput)))})`}
                            </NumberLabText> : <></>}

                            <NumberLabText x={dialogSVGWidth} y={(barChartHeightScale(d) || 0) + (0.5 + (stateRaceOutput ? 0.25 : 0)) * barChartHeightScale.bandwidth()}>
                                {`${CSRaceOutput[d].toLocaleString("en-US")} (${format(',.1%')(CSRaceOutput[d] / sum(Object.values(CSRaceOutput)))})`}
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
