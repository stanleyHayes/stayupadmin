import {Box, Button, Dialog, DialogContent, Grid, Stack, Typography} from "@mui/material";
import {WarningAmberOutlined} from "@mui/icons-material";
import React from "react";

const ConfirmDialog = ({open, handleDelete, handleClose, message}) => {

    const handleDeleteClick = () => {
        handleDelete();
        handleClose();
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogContent>
                <Stack sx={{mb: 3}} direction="row" justifyContent="center">
                    <WarningAmberOutlined
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
                </Stack>
                <Typography align="center" variant="body1" sx={{color: "text.red", mb: 3}}>{message}</Typography>
            </DialogContent>
            <Box>
                <Grid container={true}>
                    <Grid item={true} xs={6}>
                        <Button
                            sx={{
                                textTransform: "capitalize",
                                borderWidth: 2,
                                color: "text.primary",
                                backgroundColor: "light.primary"
                            }}
                            size="small"
                            variant="text"
                            fullWidth={true}>Cancel</Button>
                    </Grid>
                    <Grid item={true} xs={6}>
                        <Button
                            onClick={handleDeleteClick}
                            sx={{
                                textTransform: "capitalize",
                                color: "text.red",
                                backgroundColor: "light.red"
                            }}
                            size="small"
                            variant="text"
                            fullWidth={true}>Delete</Button>
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    )
}


export default ConfirmDialog;