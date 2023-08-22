import styled from "@emotion/styled";
import { TableCell, TableContainer } from "@mui/material";
import { CellSVGWidth, CellSVGHeight } from "../Preset/Constants";

export const ComponentSVG = styled.svg({
    width: CellSVGWidth,
    height: CellSVGHeight,
    verticalAlign: 'middle'
});


export const StickyTableContainer = styled(TableContainer)({
    maxHeight: '55vh'
});

export const TextCell = styled(TableCell)({
    padding: '8px'
});


export const FunctionCell = styled(TableCell)({
    padding: '0px',
});

export const NoBorderCell = styled(FunctionCell)({
    borderBottom: 'none',
});;
