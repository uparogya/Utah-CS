import { FC, useEffect, useState, useContext } from "react";
import { RaceDictionary, GenderDictionary } from "../../Preset/Constants";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import Store from "../../Interface/Store";
import { computeTextOutcome } from "./PercentageChart";
import { sum } from "d3-array";

type Props = {
    option: 'gender' | 'race';
    outputObj: {
        white: number,
        hispanic: number,
        asian: number,
        black: number,
        native: number,
        other: number,
        pacific: number,
        [key: string]: number;
    } | {
        male: number,
        female: number,
        [key: string]: number;
    };
    keyIdentity: string,

};

const RaceChart: FC<Props> = ({ option, keyIdentity, outputObj }: Props) => {

    const outputObjKeys = Object.keys(outputObj);

    const defaultAttributes = option === 'race' ? ['black', 'asian', 'hispanic'] : ['male', 'female'];
    const store = useContext(Store);

    const [totalStudent, setTotal] = useState(0);


    const [topThree, setTopThree] = useState(defaultAttributes);
    useEffect(() => {
        const topAttributes = outputObjKeys.length <= 3 ? outputObjKeys 
            : Object.keys(outputObj).sort((a, b) => outputObj[b] - outputObj[a]).filter(r => r !== 'white' && (outputObj[r] as any) !== 'n<10')!.slice(0, 3);
        // setOutput(output);
        topAttributes.length === 0 ? setTopThree(defaultAttributes) : setTopThree(topAttributes);
        setTotal(sum(Object.values(outputObj)));
    }, [outputObj]);

    return (
        totalStudent === 0 ?
            <> - </>
            :
            <div style={{ cursor: 'pointer' }}>
                {topThree.map((objKey) => (
                    <span key={`${keyIdentity}-${objKey}`}>
                        <SmallerText children={
                            `${option === 'race' ? RaceDictionary[objKey] : GenderDictionary[objKey]}: ${computeTextOutcome(outputObj[objKey], outputObj[objKey] / totalStudent, store.showPercentage)}`
                        } /><br />
                    </span>
                ))}
            </div>

    );
};

const SmallerText = styled.span({
    fontSize: 'smaller',
    textDecoration: 'underline'
});

export default observer(RaceChart);
