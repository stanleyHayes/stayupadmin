import {Link as MUILink, Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {DeleteForeverOutlined, EditOutlined, Verified, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import ConfirmDialog from "./confirm-dialog.jsx";

const Coupon = ({coupon, index}) => {

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleDeleteClick = () => {
        setOpenConfirmDialog(true);
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Tooltip title={`Detailed view of order ${coupon.name}`}>
                        <Link to={`/categories/${coupon._id}`} style={{textDecoration: "none"}}>
                            <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                                {index + 1}
                            </Typography>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title={`Quick view coupon ${coupon.name}`}>
                        <Link to={`/coupons/${coupon._id}`} style={{textDecoration: "none"}}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                    sx={{color: "text.primary"}}
                                    variant="body2">
                                    {coupon?.name}
                                </Typography>
                                {coupon.is_verified && (
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
                    <Tooltip title={`Call ${coupon.name}`}>
                        <MUILink href={`tel:${coupon.phone}`}>
                            <Typography
                                sx={{color: "text.primary"}}
                                variant="body2">
                                {coupon.phone}
                            </Typography>
                        </MUILink>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        @{coupon.username.toLowerCase()}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Tooltip title={`Email ${coupon.name}`}>
                        <MUILink href={`mailto:${coupon.email}`}>
                            <Typography
                                sx={{color: "text.primary"}}
                                variant="body2">
                                {coupon.email}
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
                        <Tooltip title={`Quick view order ${coupon.name}`}>
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
                        <Tooltip title={`Update coupon ${coupon.name}`}>
                            <Link to={`/coupons/${coupon._id}/update`} style={{textDecoration: "none"}}>
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
                        <Tooltip title={`Delete order ${coupon.name}`}>
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
                    message={`Are you sure you want to delete coupon ${coupon.name}?`}
                    handleDelete={handleDeleteClick}
                />
            )}
        </React.Fragment>
    )
}

export default Coupon;