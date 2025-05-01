import {Box, Button, Dialog, DialogContent, Divider, Grid, Stack, Typography} from "@mui/material";
import Status from "./status.jsx";
import {motion} from "framer-motion";
import {Close} from "@mui/icons-material";
import React from "react";
import {Link} from "react-router-dom";

const ProductQuickView = ({product, open, handleClose}) => {
    return (
        <Dialog maxWidth="md" open={open} onClose={handleClose}>
            <DialogContent>
                <Grid container={true} spacing={4} alignItems="center">
                    <Grid item={true} xs={12} md={3}>
                        <Typography variant="body2" sx={{color: "text.primary", fontWeight: 600}}>
                            Product {product.title}
                        </Typography>
                    </Grid>
                    <Grid item={true} xs={12} md={9}>
                        <Box>
                            <Stack
                                divider={
                                    <Divider
                                        light={true}
                                        orientation="vertical"
                                        flexItem={true}
                                        variant="fullWidth"
                                    />
                                }
                                alignItems="center"
                                direction="row"
                                spacing={1}>
                                <Link to={`/products/${product._id}/update`} style={{textDecoration: "none"}}>
                                    <Button
                                        sx={{
                                            textTransform: "capitalize",
                                            borderWidth: 2
                                        }}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        fullWidth={true}>Edit</Button>
                                </Link>

                                <Status status={product.status}/>

                                <Box component={motion.div} exit={{}}>
                                    <Close
                                        onClick={handleClose}
                                        sx={{
                                            padding: 1,
                                            fontSize: 36,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.secondary",
                                            color: "secondary.main",
                                            backgroundColor: "light.secondary",
                                            cursor: "pointer"
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                <Divider variant="fullWidth" light={true} sx={{py: 1}}/>

                <Box sx={{mb: 4}}>
                    <Grid container={true} spacing={4}>
                        <Grid item={true} xs={12} md={6}></Grid>
                        <Grid item={true} xs={12} md={6}></Grid>
                    </Grid>
                </Box>

            </DialogContent>
        </Dialog>
    )
}
export default ProductQuickView;