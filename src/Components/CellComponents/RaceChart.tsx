import { FC, useEffect, useState, useContext } from "react";
import { RaceDictionary } from "../../Preset/Constants";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import Store from "../../Interface/Store";
import { computeTextOutcome } from "./PercentageChart";
import { sum } from "d3-array";

type Props = {
    outputObj: {
        white: number,
        hispanic: number,
        asian: number,
        black: number,
        native: number,
        other: number,
        pacific: number,
        [key: string]: number;
    };
    keyIdentity: string,

};

const RaceChart: FC<Props> = ({ keyIdentity, outputObj }: Props) => {



    const store = useContext(Store);

    const [totalStudent, setTotal] = useState(0);



    const [topThreeRace, setTopThree] = useState(['black', 'asian', 'hispanic']);
    useEffect(() => {


        const topThree = Object.keys(outputObj).sort((a, b) => outputObj[b] - outputObj[a]).filter(r => r !== 'white' && (outputObj[r] as any) !== 'n<10')!.slice(0, 3);
        // setOutput(output);
        setTopThree(topThree);
        setTotal(sum(Object.values(outputObj)));
    }, [outputObj]);

    return (
        <div>
            <div style={{ cursor: 'pointer' }}>
                {topThreeRace.map((race) => (
                    <span key={`${keyIdentity}-${race}`}>
                        <SmallerText children={
                            `${RaceDictionary[race]}: ${computeTextOutcome(outputObj[race], outputObj[race] / totalStudent, store.showPercentage)}`
                        } /><br />
                    </span>
                ))}
            </div>

        </div>
    );
};

const SmallerText = styled.span({
    fontSize: 'smaller',
    textDecoration: 'underline'
});

export default observer(RaceChart);
