import styled from "@emotion/styled";
import { TableCell, TableContainer } from "@mui/material";
import { CellSVGWidth, CellSVGHeight } from "../Preset/Constants";

export const ComponentSVG = styled.svg`
    width: ${CellSVGWidth}px;
    height: ${CellSVGHeight}px;
`;


export const StickyTableContainer = styled(TableContainer)({
    maxHeight: '55vh'
});

export const TextCells = styled(TableCell)({
    padding: '10px'
});


export const FunctionCell = styled(TableCell)({
    padding: '0px'
});