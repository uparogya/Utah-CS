import styled from "@emotion/styled";
import { Tooltip } from "@mui/material";
import { format } from "d3-format";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import Store from "../../Interface/Store";
import { GenderColor, XDarkGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";
import { ComponentSVG } from "../GeneralComponents";
type Props = {
    maleNum: number,
    femaleNum: number,
};
const GenderRatioChart: FC<Props> = ({ maleNum, femaleNum }: Props) => {

    const [totalStudent, setTotalStudent] = useState(maleNum + femaleNum);

    const store = useContext(Store);


    useEffect(() => {
        setTotalStudent(maleNum + femaleNum);

    }, [maleNum, femaleNum]);

    const TextMargin = 5;
    return (totalStudent ?
        <ComponentSVG onClick={(e) => store.updateShowPercentage()}>
            <g>
                <rect
                    x={0}
                    y={0}
                    height={CellSVGHeight}
                    width={CellSVGWidth * (maleNum / totalStudent) || 0}
                    fill={GenderColor.male} />

                <rect x={(CellSVGWidth * (maleNum / totalStudent)) || 0}
                    y={0}
                    height={CellSVGHeight}
                    width={CellSVGWidth * (femaleNum
                        / totalStudent) || 0}
                    fill={GenderColor.female} />
                <OnChartText children={store.showPercentage ? format('.0%')(maleNum / totalStudent) : maleNum} x={TextMargin} y={CellSVGHeight * 0.5} alignmentBaseline='middle' textAnchor='start' />
                <OnChartText children={store.showPercentage ? format('.0%')(femaleNum / totalStudent) : femaleNum} x={CellSVGWidth - TextMargin} y={CellSVGHeight * 0.5} fill={XDarkGray} alignmentBaseline='middle' textAnchor='end' />
            </g>
        </ComponentSVG> : <>-</>
    );
};

export default observer(GenderRatioChart);

const OnChartText = styled.text({
    fill: XDarkGray,
    fontSize: 'smaller'
});
