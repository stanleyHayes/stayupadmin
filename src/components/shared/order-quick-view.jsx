import {
    Box, Button,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Status from "./status.jsx";
import {motion} from "framer-motion";
import {Close} from "@mui/icons-material";
import React from "react";
import OrderItem from "./order-item.jsx";
import {Link} from "react-router-dom";

const OrderQuickView = ({order, open, handleClose}) => {
    return (
        <Dialog maxWidth="md" open={open} onClose={handleClose}>
            <DialogContent>
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="body2" sx={{color: "text.primary", fontWeight: 600}}>
                            Order {order.number}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Stack
                            divider={
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    variant="fullWidth"
                                />
                            }
                            alignItems="center"
                            direction="row"
                            spacing={1}>
                            <Link to={`/orders/${order._id}/update`} style={{textDecoration: "none"}}>
                                <Button
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    fullWidth={true}>Edit</Button>
                            </Link>

                            <Status status={order.status}/>

                            <Box component={motion.div} exit={{}}>
                                <IconButton onClick={handleClose} size="small">
                                    <Close fontSize="small" />
                                </IconButton>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider variant="fullWidth" sx={{py: 1}}/>

                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderItems.map((orderItem, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <OrderItem index={index} orderItem={orderItem}/>
                                    </React.Fragment>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

            </DialogContent>
        </Dialog>
    )
}
export default OrderQuickView;
