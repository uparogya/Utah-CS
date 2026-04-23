import styled from "@emotion/styled";
import { TableCell, TableContainer, TableSortLabel } from "@mui/material";
import { FC } from "react";
import { format } from "d3-format";

export const StickyTableContainer = styled(TableContainer)({
    maxHeight: '60vh',
    border: '1px solid #eee',
    borderRadius: '4px'
});

export const TextCell = styled(TableCell)({
    padding: '10px 14px',
    fontSize: '0.875rem'
});

export const FunctionCell = styled(TableCell)({
    padding: '0px 4px',
    width: '40px'
});

type SortProps = {
    headerName: string,
    isSorting: boolean,
    isSortUp: boolean,
    onClick: () => void,
    additionalStyle?: React.CSSProperties;
};

export const SortableHeader: FC<SortProps> = ({ headerName, isSortUp, isSorting, onClick, additionalStyle }) => (
    <TextCell onClick={onClick} style={{ backgroundColor: '#f9f9f9' }}>
        <TableSortLabel
            active={isSorting}
            direction={isSortUp ? 'asc' : 'desc'}
            style={{ fontWeight: 'bold', ...additionalStyle }}
        >
            {headerName}
        </TableSortLabel>
    </TextCell>
);

export const DataValue: FC<{ val: number, pct: number, showPercentage: boolean }> = ({ val, pct, showPercentage }) => {
    if (val === 0) return <span style={{ color: '#ccc' }}>n&lt;10</span>;
    return (
        <span>
            {showPercentage ? format(".1%")(pct) : format(",")(val)}
        </span >
    );
};