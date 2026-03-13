import {Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import currencyFormatter from "currency-formatter";
import {DeleteForeverOutlined, EditOutlined, Star, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import ConfirmDialog from "./confirm-dialog.jsx";
import ProductProfile from "./product-profile.jsx";

const actionIcon = (colorKey, borderKey) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    padding: 0.4,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: "25%",
    borderColor: borderKey,
    color: colorKey,
    backgroundColor: borderKey,
    cursor: "pointer",
    flexShrink: 0,
});

const Product = ({product, index}) => {

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleDeleteClick = () => {
        setOpenConfirmDialog(true);
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
                    <Tooltip title={`View product ${product.title}`}>
                        <Link to={`/products/${product._id}`} style={{textDecoration: "none"}}>
                            <ProductProfile product={product}/>
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                        {product.sku}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>
                        {product.stock_quantity > 0 ? product.stock_quantity : 'No Stock'}
                    </Typography>
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
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
                        <Tooltip title={`View product ${product.title}`}>
                            <Link to={`/products/${product._id}`} style={{textDecoration: "none", display: "flex"}}>
                                <VisibilityOutlined sx={actionIcon("icon.green", "light.green")}/>
                            </Link>
                        </Tooltip>
                        <Tooltip title={`Edit product ${product.title}`}>
                            <Link to={`/products/${product._id}/update`} style={{textDecoration: "none", display: "flex"}}>
                                <EditOutlined sx={actionIcon("secondary.main", "light.secondary")}/>
                            </Link>
                        </Tooltip>
                        <Tooltip title={`Delete product ${product.title}`}>
                            <DeleteForeverOutlined
                                onClick={handleDeleteClick}
                                sx={actionIcon("icon.red", "light.red")}
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


        </React.Fragment>
    )
}

export default Product;