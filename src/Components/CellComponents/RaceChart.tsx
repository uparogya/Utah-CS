import { FC, useEffect, useState, useContext } from "react";
import { RaceDictionary } from "../../Preset/Constants";
import { format } from "d3-format";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import Store from "../../Interface/Store";

type Props = {
    whiteNum: number,
    nativeNum: number,
    blackNum: number,
    //asian / pacific islander
    asianNum: number,
    otherNum: number,
    hispaNum: number,
    keyIdentity: string,

};

const RaceChart: FC<Props> = ({ keyIdentity, whiteNum, nativeNum, blackNum, asianNum, otherNum, hispaNum }: Props) => {



    const store = useContext(Store);

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




    return (
        <div>
            <div style={{ cursor: 'pointer' }}>
                {topThreeRace.map((race) => (
                    <span key={`${keyIdentity}-${race}`}>
                        <SmallerText children={
                            `${RaceDictionary[race]}: ${store.showPercentage ? format(',.2%')(outputObj[race] / totalStudent) : outputObj[race]}`
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
