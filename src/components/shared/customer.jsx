import {Link as MUILink, Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {DeleteForeverOutlined, EditOutlined, Verified, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import ConfirmDialog from "./confirm-dialog.jsx";
import CustomerQuickView from "./customer-quick-view.jsx";

const Customer = ({customer, index}) => {

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openQuickViewDialog, setOpenQuickViewDialog] = useState(false);

    const handleDeleteClick = () => {
        setOpenConfirmDialog(true);
    }

    const handleQuickViewClick = () => {
        setOpenQuickViewDialog(true);
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Tooltip title={`Detailed view of order ${customer.name}`}>
                        <Link to={`/customers/${customer._id}`} style={{textDecoration: "none"}}>
                            <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                                {index + 1}
                            </Typography>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title={`Quick view customer ${customer.name}`}>
                        <Link to={`/customers/${customer._id}`} style={{textDecoration: "none"}}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                    sx={{color: "text.primary"}}
                                    variant="body2">
                                    {customer?.name}
                                </Typography>
                                {customer.is_verified && (
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
                    <Tooltip title={`Call ${customer.name}`}>
                        <MUILink href={`tel:${customer.phone}`}>
                            <Typography
                                sx={{color: "text.primary"}}
                                variant="body2">
                                {customer.phone}
                            </Typography>
                        </MUILink>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        @{customer.username.toLowerCase()}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Tooltip title={`Email ${customer.name}`}>
                        <MUILink href={`mailto:${customer.email}`}>
                            <Typography
                                sx={{color: "text.primary"}}
                                variant="body2">
                                {customer.email}
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
                        <Tooltip title={`Quick view order ${customer.name}`}>
                            <VisibilityOutlined
                                onClick={handleQuickViewClick}
                                sx={{
                                    padding: 0.4,
                                    fontSize: 28,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '100%',
                                    borderColor: "light.green",
                                    color: "text.green",
                                    backgroundColor: "light.green",
                                    cursor: "pointer"
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={`Update customer ${customer.name}`}>
                            <Link to={`/customers/${customer._id}/update`} style={{textDecoration: "none"}}>
                                <EditOutlined
                                    sx={{
                                        padding: 0.4,
                                        fontSize: 28,
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderRadius: '100%',
                                        borderColor: "light.secondary",
                                        color: "secondary.main",
                                        backgroundColor: "light.secondary",
                                        cursor: "pointer"
                                    }}
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title={`Delete order ${customer.name}`}>
                            <DeleteForeverOutlined
                                onClick={handleDeleteClick}
                                sx={{
                                    padding: 0.4,
                                    fontSize: 28,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '100%',
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
                    message={`Are you sure you want to delete customer ${customer.name}?`}
                    handleDelete={handleDeleteClick}
                />
            )}

            {openQuickViewDialog && (
                <CustomerQuickView
                    customer={customer}
                    open={openQuickViewDialog}
                    handleClose={() => setOpenQuickViewDialog(false)}
                />
            )}
        </React.Fragment>
    )
}

export default Customer;