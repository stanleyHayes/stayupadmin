import {Link as MUILink, Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {DeleteForeverOutlined, EditOutlined, Verified, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import ConfirmDialog from "./confirm-dialog.jsx";

const Category = ({category, index}) => {

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleDeleteClick = () => {
        setOpenConfirmDialog(true);
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Tooltip title={`Detailed view of order ${category.name}`}>
                        <Link to={`/categories/${category._id}`} style={{textDecoration: "none"}}>
                            <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                                {index + 1}
                            </Typography>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title={`Quick view category ${category.name}`}>
                        <Link to={`/categorys/${category._id}`} style={{textDecoration: "none"}}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                    sx={{color: "text.primary"}}
                                    variant="body2">
                                    {category?.name}
                                </Typography>
                                {category.is_verified && (
                                    <Verified
                                        sx={{
                                            fontSize: 12,
                                            color: "secondary.main",
                                            cursor: "pointer"
                                        }}
                                    />
                                )}
                            </Stack>
                        </Link>
                    </Tooltip>
                </TableCell>

                <TableCell>
                    <Tooltip title={`Call ${category.name}`}>
                        <MUILink href={`tel:${category.phone}`}>
                            <Typography
                                sx={{color: "text.primary"}}
                                variant="body2">
                                {category.phone}
                            </Typography>
                        </MUILink>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        @{category.username.toLowerCase()}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Tooltip title={`Email ${category.name}`}>
                        <MUILink href={`mailto:${category.email}`}>
                            <Typography
                                sx={{color: "text.primary"}}
                                variant="body2">
                                {category.email}
                            </Typography>
                        </MUILink>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        spacing={1}
                        alignItems="center">
                        <Tooltip title={`Quick view order ${category.name}`}>
                            <VisibilityOutlined
                                sx={{
                                    padding: 0.4,
                                    fontSize: 28,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '30%',
                                    borderColor: "light.green",
                                    color: "text.green",
                                    backgroundColor: "light.green",
                                    cursor: "pointer"
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={`Update category ${category.name}`}>
                            <Link to={`/categorys/${category._id}/update`} style={{textDecoration: "none"}}>
                                <EditOutlined
                                    sx={{
                                        padding: 0.4,
                                        fontSize: 28,
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderRadius: '30%',
                                        borderColor: "light.secondary",
                                        color: "secondary.main",
                                        backgroundColor: "light.secondary",
                                        cursor: "pointer"
                                    }}
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title={`Delete order ${category.name}`}>
                            <DeleteForeverOutlined
                                onClick={handleDeleteClick}
                                sx={{
                                    padding: 0.4,
                                    fontSize: 28,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '30%',
                                    borderColor: "light.red",
                                    color: "text.red",
                                    backgroundColor: "light.red",
                                    cursor: "pointer"
                                }}
                            />
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>

            {openConfirmDialog && (
                <ConfirmDialog
                    open={openConfirmDialog}
                    handleClose={() => setOpenConfirmDialog(false)}
                    message={`Are you sure you want to delete category ${category.name}?`}
                    handleDelete={handleDeleteClick}
                />
            )}
        </React.Fragment>
    )
}

export default Category;