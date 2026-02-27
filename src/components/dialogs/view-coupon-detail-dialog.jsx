import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Button,
    Typography,
    Chip
} from "@mui/material";
import moment from "moment";

/**
 * Props:
 * - open: boolean
 * - coupon: object | null
 * - onClose: () => void
 */
const ViewCouponDialog = ({ open, coupon, onClose }) => {
    const renderList = (arr) => {
        if (!arr || arr.length === 0) return <Typography variant="body2" color="text.secondary">—</Typography>;
        return arr.map((it, i) => <Chip key={i} size="small" label={String(it)} sx={{ mr: .5, mb: .5 }} />);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Coupon Details</DialogTitle>
            <DialogContent dividers>
                {coupon ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2">Code</Typography>
                            <Typography>{coupon.code}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2">Amount</Typography>
                            <Typography>{coupon.amount ?? "—"}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2">Type</Typography>
                            <Typography>{coupon.discount_type ?? "fixed_cart"}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2">Expires</Typography>
                            <Typography>{coupon.date_expires ? moment(coupon.date_expires).format("YYYY-MM-DD") : "—"}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Description</Typography>
                            <Typography>{coupon.description || "—"}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Included Emails</Typography>
                            {renderList(coupon.included_emails)}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Included Products</Typography>
                            <Typography>{(coupon.included_products || []).join(", ") || "—"}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Excluded Products</Typography>
                            <Typography>{(coupon.excluded_products || []).join(", ") || "—"}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Usage Count</Typography>
                            <Typography>{coupon.usage_count ?? 0}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Meta</Typography>
                            <Typography style={{ wordBreak: "break-word" }}>{(coupon.meta_data && coupon.meta_data.length) ? JSON.stringify(coupon.meta_data) : "—"}</Typography>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>No coupon selected</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewCouponDialog;
