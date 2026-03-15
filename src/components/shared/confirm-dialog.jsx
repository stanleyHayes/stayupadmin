import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
import { WarningAmberOutlined } from "@mui/icons-material";
import React from "react";

const ConfirmDialog = ({ open, handleDelete, handleClose, message }) => {

    const handleDeleteClick = () => {
        handleDelete();
        handleClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth>
            <DialogContent>
                <Stack alignItems="center" spacing={2} sx={{ py: 1 }}>
                    <WarningAmberOutlined
                        sx={{
                            padding: 1.5,
                            fontSize: 40,
                            borderRadius: 0,
                            color: "text.red",
                            backgroundColor: "light.red",
                        }}
                    />
                    <Typography align="center" variant="body1" color="text.primary">
                        {message}
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={handleClose} variant="outlined" color="inherit" fullWidth>
                    Cancel
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    variant="contained"
                    color="error"
                    fullWidth
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
