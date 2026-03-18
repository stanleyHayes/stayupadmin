import {Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import moment from "moment";
import {DeleteForeverOutlined, EditOutlined, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import Status from "./status.jsx";
import ConfirmDialog from "./confirm-dialog.jsx";
import OrderQuickView from "./order-quick-view.jsx";
import {motion} from "framer-motion";

/**
 * Resolve the customer name and ID from an order.
 * The backend field is `customer_id` and can be:
 *   - a populated object: { _id, first_name, last_name, email }
 *   - a string ObjectId
 *   - null/undefined
 * Legacy seed data used `customer` (object with `name`).
 */
const resolveCustomer = (order) => {
    // Try customer_id first (backend), then customer (legacy seed data)
    const c = order.customer_id ?? order.customer;
    if (!c) return { name: "—", id: null };

    if (typeof c === "object" && c !== null) {
        const name = c.display_name || c.name || (c.first_name ? `${c.first_name} ${c.last_name || ""}`.trim() : null) || c.email || "—";
        return { name, email: c.email || null, id: c._id || c.id };
    }

    // String ID — no name available without a store lookup
    return { name: String(c).slice(-8), email: null, id: c };
};

/**
 * Resolve the order total for display.
 * Backend sends `total` as a string like "98.97" and `currency` as "GHS".
 * Legacy seed data used `total: { amount, currency }`.
 */
const resolveTotal = (order) => {
    const t = order.total;
    const cur = order.currency || "GBP";
    if (t == null) return "—";
    if (typeof t === "string" || typeof t === "number") {
        const sym = cur === "GHS" ? "GH₵" : cur === "USD" ? "$" : cur === "EUR" ? "€" : "£";
        return `${sym}${Number(t).toFixed(2)}`;
    }
    if (typeof t === "object") {
        const amount = t.amount ?? t.subtotal ?? 0;
        const c = t.currency || cur;
        const sym = c === "GHS" ? "GH₵" : c === "USD" ? "$" : c === "EUR" ? "€" : "£";
        return `${sym}${Number(amount).toFixed(2)}`;
    }
    return "—";
};

const Order = ({order, index = 0}) => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openQuickViewDialog, setOpenQuickViewDialog] = useState(false);
    const customer = resolveCustomer(order);
    const date = order.date_created || order.created_at || order.createdAt;

    const handleDeleteClick = () => {
        setOpenConfirmDialog(true);
    }

    const handleQuickViewClick = () => {
        setOpenQuickViewDialog(true);
    }

    return (
        <React.Fragment>
            <TableRow
                component={motion.tr}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3, delay: Math.min(index * 0.04, 0.5), ease: "easeOut"}}
                sx={{"&:hover": {backgroundColor: "action.hover"}}}
            >
                <TableCell>
                    <Tooltip title={`Detailed view of order ${order.number}`}>
                        <Link to={`/orders/${order._id}`} style={{textDecoration: "none"}}>
                            <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                                {order.number}
                            </Typography>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    {customer.id ? (
                        <Link to={`/customers/${customer.id}`} style={{textDecoration: "none"}}>
                            <Typography variant="body2" sx={{color: "text.primary"}}>{customer.name}</Typography>
                            {customer.email && <Typography variant="caption" color="text.secondary">{customer.email}</Typography>}
                        </Link>
                    ) : (
                        <Typography variant="body2">{customer.name}</Typography>
                    )}
                </TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        {date ? moment(date).fromNow() : "—"}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        {resolveTotal(order)}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Status status={order.status}/>
                </TableCell>
                <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title={`View order ${order.number}`}>
                            <Link to={`/orders/${order._id}`} style={{textDecoration: "none"}}>
                                <VisibilityOutlined
                                    sx={{
                                        padding: 0.4,
                                        fontSize: 28,
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderRadius: 1,
                                        borderColor: "light.green",
                                        color: "icon.green",
                                        backgroundColor: "light.green",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {transform: "scale(1.15)"},
                                    }}
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title={`Update order ${order.number}`}>
                            <Link to={`/orders/${order._id}/update`} style={{textDecoration: "none"}}>
                                <EditOutlined
                                    sx={{
                                        padding: 0.4,
                                        fontSize: 28,
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderRadius: 1,
                                        borderColor: "light.secondary",
                                        color: "secondary.main",
                                        backgroundColor: "light.secondary",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {transform: "scale(1.15)"},
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
                                    borderRadius: 1,
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
