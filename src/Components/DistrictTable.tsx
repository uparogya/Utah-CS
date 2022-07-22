import { TableContainer, Container, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC } from "react";
type Props = {

};

const DistrictTable: FC<Props> = ({ }: Props) => {
    return <TableContainer component={Container}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Disctrict Name</TableCell>
                    <TableCell>Total Students</TableCell>
                    <TableCell >Gender</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {/* {rows.map((row) => (
          <TableRow
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.calories}</TableCell>
            <TableCell align="right">{row.fat}</TableCell>
            <TableCell align="right">{row.carbs}</TableCell>
            <TableCell align="right">{row.protein}</TableCell>
          </TableRow>
        ))} */}
            </TableBody>
        </Table>
    </TableContainer>;
};

export default observer(DistrictTable);