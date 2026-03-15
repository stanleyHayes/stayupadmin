import { Chip, Stack, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { DeleteForeverOutlined, EditOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ConfirmDialog from "./confirm-dialog.jsx";

const actionIcon = (colorKey, bgKey) => ({
    padding: 0.4,
    fontSize: 28,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 0,
    borderColor: bgKey,
    color: colorKey,
    backgroundColor: bgKey,
    cursor: "pointer",
});

const statusColor = (status) => {
    switch ((status || "").toUpperCase()) {
        case "ACTIVE":    return { color: "text.active",    bg: "light.active" };
        case "PENDING":   return { color: "text.pending",   bg: "light.pending" };
        case "SUSPENDED": return { color: "text.suspended", bg: "light.failed" };
        case "DELETED":   return { color: "text.red",       bg: "light.red" };
        default:          return { color: "text.secondary", bg: "light.grey" };
    }
};

const Category = ({ category, index, categories = [], onView, onEdit, onDelete }) => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const parentName = category?.parent
        ? (categories.find(c => c._id === category.parent || c.id === category.parent)?.name ?? category.parent)
        : "—";

    const sc = statusColor(category?.status);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {index + 1}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Link to={`/categories/${category?._id}`} style={{ textDecoration: "none" }}>
                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                            {category?.name}
                        </Typography>
                    </Link>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {category?.slug || "—"}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Chip
                        size="small"
                        label={(category?.status || "ACTIVE").toLowerCase()}
                        sx={{
                            color: sc.color,
                            backgroundColor: sc.bg,
                            fontWeight: 500,
                            fontSize: "0.75rem",
                        }}
                    />
                </TableCell>

                <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {parentName}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                        {category?.product_count ?? 0}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Stack direction="row" justifyContent="flex-start" spacing={1} alignItems="center">
                        <Tooltip title={`View ${category?.name}`}>
                            <VisibilityOutlined
                                onClick={onView}
                                sx={actionIcon("text.green", "light.green")}
                            />
                        </Tooltip>
                        <Tooltip title={`Edit ${category?.name}`}>
                            <Link to={`/categories/${category?._id}/update`} style={{ textDecoration: "none", display: "flex" }}>
                                <EditOutlined sx={actionIcon("secondary.main", "light.secondary")} />
                            </Link>
                        </Tooltip>
                        <Tooltip title={`Delete ${category?.name}`}>
                            <DeleteForeverOutlined
                                onClick={() => setOpenConfirmDialog(true)}
                                sx={actionIcon("text.red", "light.red")}
                            />
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>

            {openConfirmDialog && (
                <ConfirmDialog
                    open={openConfirmDialog}
                    handleClose={() => setOpenConfirmDialog(false)}
                    message={`Are you sure you want to delete "${category?.name}"?`}
                    handleDelete={() => onDelete?.(category)}
                />
            )}
        </React.Fragment>
    );
};

export default Category;
