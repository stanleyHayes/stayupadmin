import {Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import currencyFormatter from "currency-formatter";
import {DeleteForeverOutlined, EditOutlined, Star, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import ConfirmDialog from "./confirm-dialog.jsx";
import ProductQuickView from "./order-quick-view.jsx";
import ProductProfile from "./product-profile.jsx";

const Product = ({product, index}) => {

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
                    <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                        {index + 1}
                    </Typography>
                </TableCell>
                <TableCell sx={{maxWidth: "100%"}}>
                    <Tooltip title={`Quick view customer ${product.title}`}>
                        <Link to={`/products/${product._id}`} style={{textDecoration: "none"}}>
                            <ProductProfile product={product}/>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title={`Detailed view of order ${product.title}`}>
                        <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                            {product.sku}
                        </Typography>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip title={`Detailed view of order ${product.title}`}>
                        <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                            {product.stock_quantity > 0 ? product.stock_quantity : 'No Stock'}
                        </Typography>
                    </Tooltip>
                </TableCell>
                <TableCell align="center">
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        {currencyFormatter.format(product.price.amount, {code: product.price.currency})}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Star color={product.featured ? "secondary" : "disabled"}/>
                </TableCell>
                <TableCell>
                    <Stack justifyContent="center" direction="row" spacing={1} alignItems="center">
                        <Tooltip title={`Quick view product ${product.title}`}>
                            <VisibilityOutlined
                                onClick={handleQuickViewClick}
                                sx={{
                                    padding: 0.6,
                                    fontSize: 32,
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
                        <Tooltip title={`Update product ${product.title}`}>
                            <Link to={`/products/${product._id}/update`} style={{textDecoration: "none"}}>
                                <EditOutlined
                                    sx={{
                                        padding: 0.6,
                                        fontSize: 32,
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
                        <Tooltip title={`Delete product ${product.title}`}>
                            <DeleteForeverOutlined
                                onClick={handleDeleteClick}
                                sx={{
                                    padding: 0.6,
                                    fontSize: 32,
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
                    message={`Are you sure you want to delete order ${product.title}?`}
                    handleDelete={handleDeleteClick}
                />
            )}

            {openQuickViewDialog && (
                <ProductQuickView
                    product={product}
                    open={openQuickViewDialog}
                    handleClose={() => setOpenQuickViewDialog(false)}
                />
            )}
        </React.Fragment>
    )
}

export default Product;