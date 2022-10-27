import { TableSortLabel } from "@mui/material";
import { FC, useEffect } from "react";
import { XDarkGray } from "../../Preset/Colors";
import { TextCell } from "../GeneralComponents";

type Props = {
    headerName: string,
    isSorting: boolean,
    isSortUp: boolean,
    onClick: () => void,
    isSortPercentage?: boolean,

};

const SortableHeader: FC<Props> = ({ headerName, isSortUp, isSorting, isSortPercentage, onClick }: Props) => {

    const findHeaderName = () => {
        if (['CS Enrollment', 'Gender'].includes(headerName) && isSorting) {
            return `${headerName} ${isSortPercentage ? '%' : '#'}`;
        } return headerName;
    };
    return (
        <TextCell onClick={onClick} >
            <TableSortLabel style={{ color: XDarkGray, fontWeight: isSorting ? 'bold' : undefined }} hideSortIcon direction={isSortUp ? 'asc' : 'desc'} active={isSorting} children={findHeaderName()} />
        </TextCell>
    );
};
export default SortableHeader;