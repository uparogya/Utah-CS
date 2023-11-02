import { TableSortLabel } from "@mui/material";
import { FC } from "react";
import { XDarkGray } from "../../Preset/Colors";
import { TextCell } from "../GeneralComponents";

type Props = {
    headerName: string|boolean,
    isSorting: boolean,
    isSortUp: boolean,
    onClick: () => void,
    isSortPercentage?: boolean,
    additionalStyle?: React.CSSProperties;
};

const SortableHeader: FC<Props> = ({ headerName, isSortUp, isSorting, isSortPercentage, onClick, additionalStyle }: Props) => {

    const findHeaderName = () => {
        if (isSortPercentage !== undefined && isSorting) {
            return `${headerName} ${isSortPercentage ? '%' : '#'}`;
        } return headerName;
    };
    return (
        <TextCell onClick={onClick} >
            <TableSortLabel
                style={{ color: XDarkGray, fontWeight: isSorting ? 'bold' : undefined, ...additionalStyle }} hideSortIcon direction={isSortUp ? 'desc' : 'asc'} active={isSorting} children={findHeaderName()} />
        </TextCell>
    );
};
export default SortableHeader;
