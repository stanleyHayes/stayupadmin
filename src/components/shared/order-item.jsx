import {TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import currencyFormatter from "currency-formatter";
import ProductProfile from "./product-profile.jsx";

const OrderItem = ({orderItem, index}) => {

    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>

            <TableCell>
                <Tooltip title={`Quick view product ${orderItem.product.name}`}>
                    <Link to={`/customers/${orderItem.product._id}`} style={{textDecoration: "none"}}>
                        <ProductProfile product={orderItem.product} />
                    </Link>
                </Tooltip>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{color: "text.secondary"}}>
                    {orderItem.quantity}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{color: "text.secondary"}}>
                    {currencyFormatter.format(
                        orderItem.product.price.amount,
                        {code: orderItem.product.price.currency}
                    )}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{color: "text.secondary"}}>
                    {currencyFormatter.format(
                        orderItem.product.price.amount * orderItem.quantity,
                        {code: orderItem.product.price.currency}
                    )}
                </Typography>
            </TableCell>
        </TableRow>
    )
}

export default OrderItem;