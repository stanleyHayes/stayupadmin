import React from "react";
import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";

/**
 * Skeleton rows for table loading states.
 * Props:
 *   - rows: number of skeleton rows (default 6)
 *   - cols: number of columns (default 6)
 */
const TableSkeleton = ({ rows = 6, cols = 6 }) => (
    <TableBody>
        {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
                {Array.from({ length: cols }).map((_, c) => (
                    <TableCell key={c}>
                        <Skeleton variant="text" width={c === 0 ? 30 : "80%"} height={24} />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </TableBody>
);

export default TableSkeleton;
