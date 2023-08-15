import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { sum } from "d3-array";
import { format } from "d3-format";
import { scaleLinear, scaleBand } from "d3-scale";
import { observer } from "mobx-react-lite";
import { FC, useContext, } from "react";
import { RaceColor, GenderColor } from "../../Preset/Colors";
import styled from "@emotion/styled";
import Store from "../../Interface/Store";
import { RaceDictionary, GenderDictionary, PossibleCategories } from "../../Preset/Constants";

type Props = {
    option: 'Gender' | 'Race',
    openDialog: boolean,
    setDialogVisibility: (value: boolean) => void,
    stateAttributeOutput?: { [key: string]: number; },
    CSAttributeOutput: { [key: string]: number; };
};
const AttributeDialog: FC<Props> = ({ option, openDialog, setDialogVisibility, CSAttributeOutput, stateAttributeOutput }) => {



    const store = useContext(Store);

    const dialogSVGWidth = 300;
    const dialogSVGHeight = 500;
    const leftPadding = 50;


    const barChartScale = scaleLinear().domain([0, 1]).range([leftPadding, dialogSVGWidth]);
    const barChartHeightScale = scaleBand().domain(Object.keys(CSAttributeOutput)).range([0, dialogSVGHeight]).padding(0.3);

    const currentCSTypeShortName = PossibleCategories.filter(d => d.key === store.currentShownCSType)[0].shortName;

    return (<Dialog open={openDialog} onClose={() => setDialogVisibility(false)}>
        <DialogTitle children={`${currentCSTypeShortName} ${option} Breakdown`} />
        <DialogContent>
            <svg width={dialogSVGWidth} height={dialogSVGHeight}>
                {Object.keys(CSAttributeOutput).map((d) => (
                    <g key={`${d}`}>
                        {stateAttributeOutput ? <rect x={leftPadding}
                            fill={option === 'Race' ? RaceColor[d] : GenderColor[d]}
                            height={barChartHeightScale.bandwidth() * 0.45}
                            y={barChartHeightScale(d)}
                            width={barChartScale(stateAttributeOutput[d] / sum(Object.values(stateAttributeOutput))) - leftPadding} /> : <></>}

                        <rect x={leftPadding}
                            fill={option === 'Race' ? RaceColor[d] : GenderColor[d]}
                            height={barChartHeightScale.bandwidth() * 0.45}
                            y={(barChartHeightScale(d) || 0) + barChartHeightScale.bandwidth() * (0.55 - (stateAttributeOutput ? 0 : 0.25))}
                            width={barChartScale(CSAttributeOutput[d] / sum(Object.values(CSAttributeOutput))) - leftPadding} />

                        <g>
                            {stateAttributeOutput ? <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) + 0.25 * barChartHeightScale.bandwidth()}
                            >
                                State
                            </DialogText> : <></>}

                            <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) + (0.5 + (stateAttributeOutput ? 0.25 : 0)) * barChartHeightScale.bandwidth()}
                            >
                                {currentCSTypeShortName}
                            </DialogText>
                            <DialogText x={0}
                                y={(barChartHeightScale(d) || 0) - 12} fontWeight='bold'>
                                {option === 'Race' ? RaceDictionary[d] : GenderDictionary[d]}
                            </DialogText>
                        </g>

                        <g>
                            {stateAttributeOutput ? <NumberLabText x={dialogSVGWidth} y={(barChartHeightScale(d) || 0) + 0.45 * 0.5 * barChartHeightScale.bandwidth()}>
                                {`${stateAttributeOutput[d].toLocaleString("en-US")} (${format(',.1%')(stateAttributeOutput[d] / sum(Object.values(stateAttributeOutput)))})`}
                            </NumberLabText> : <></>}

                            <NumberLabText x={dialogSVGWidth} y={(barChartHeightScale(d) || 0) + (0.5 + (stateAttributeOutput ? 0.25 : 0)) * barChartHeightScale.bandwidth()}>
                                {`${CSAttributeOutput[d].toLocaleString("en-US")} (${format(',.1%')(CSAttributeOutput[d] / sum(Object.values(CSAttributeOutput)))})`}
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

export default observer(AttributeDialog);

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
