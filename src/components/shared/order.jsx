import {Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import moment from "moment";
import currencyFormatter from "currency-formatter";
import {DeleteForeverOutlined, EditOutlined, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import Status from "./status.jsx";
import ConfirmDialog from "./confirm-dialog.jsx";
import OrderQuickView from "./order-quick-view.jsx";

const Order = ({order}) => {

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
                    <Tooltip title={`Detailed view of order ${order.number}`}>
                        <Link to={`/customers/${order.customer._id}`} style={{textDecoration: "none"}}>
                            <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                                {order.number}
                            </Typography>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title={`Quick view customer ${order.customer.name}`}>
                        <Link to={`/customers/${order.customer._id}`} style={{textDecoration: "none"}}>
                            <Typography
                                sx={{color: "text.primary"}}
                                variant="body2">
                                {order?.customer?.name}
                            </Typography>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        {moment(new Date(order.createdAt)).fromNow()}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        {currencyFormatter.format(order.total.amount, {code: order.total.currency})}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Status status={order.status}/>
                </TableCell>
                <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title={`Quick view order ${order.number}`}>
                            <VisibilityOutlined
                                onClick={handleQuickViewClick}
                                sx={{
                                    padding: 0.4,
                                    fontSize: 28,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '100%',
                                    borderColor: "light.green",
                                    color: "icon.green",
                                    backgroundColor: "light.green",
                                    cursor: "pointer"
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={`Update order ${order.number}`}>
                            <Link to={`/orders/${order._id}/update`} style={{textDecoration: "none"}}>
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
                        <Tooltip title={`Delete order ${order.number}`}>
                            <DeleteForeverOutlined
                                onClick={handleDeleteClick}
                                sx={{
                                    padding: 0.4,
                                    fontSize: 28,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '100%',
                                    borderColor: "light.red",
                                    color: "icon.red",
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
                    message={`Are you sure you want to delete order ${order.number}?`}
                    handleDelete={handleDeleteClick}
                />
            )}

            {openQuickViewDialog && (
                <OrderQuickView
                    order={order}
                    open={openQuickViewDialog}
                    handleClose={() => setOpenQuickViewDialog(false)}
                />
            )}
        </React.Fragment>
    )
}

export default Order;