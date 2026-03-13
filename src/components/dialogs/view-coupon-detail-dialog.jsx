import React from "react";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import moment from "moment";

const Row = ({ label, children }) => (
    <Stack spacing={0.5} sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2">{children ?? "—"}</Typography>
    </Stack>
);

const renderList = (arr) => {
    if (!arr || arr.length === 0) return "—";
    return arr.map((it, i) => <Chip key={i} size="small" label={String(it)} sx={{ mr: 0.5, mb: 0.5 }} />);
};

/**
 * Props:
 * - open: boolean
 * - coupon: object | null
 * - onClose: () => void
 */
const ViewCouponDialog = ({ open, coupon, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Coupon Details</DialogTitle>
            <DialogContent dividers>
                {coupon ? (
                    <>
                        <Row label="Code">{coupon.code}</Row>
                        <Row label="Discount Type">{coupon.discount_type ?? "fixed_cart"}</Row>
                        <Row label="Amount">{coupon.amount ?? "—"}</Row>
                        <Row label="Expires">{coupon.date_expires ? moment(coupon.date_expires).format("LLL") : "—"}</Row>

                        <Divider sx={{ my: 1.5 }} />

                        <Row label="Usage Count">{coupon.usage_count ?? 0}</Row>
                        <Row label="Usage Limit">{coupon.usage_limit ?? "—"}</Row>
                        <Row label="Usage Limit Per User">{coupon.usage_limit_per_user ?? "—"}</Row>
                        <Row label="Free Shipping">{coupon.free_shipping ? "Yes" : "No"}</Row>
                        <Row label="Exclude Sale Items">{coupon.exclude_sale_items ? "Yes" : "No"}</Row>
                        <Row label="Individual Use">{coupon.individual_use ? "Yes" : "No"}</Row>

                        <Divider sx={{ my: 1.5 }} />

                        <Row label="Minimum Amount">{coupon.minimum_amount ?? "—"}</Row>
                        <Row label="Maximum Amount">{coupon.maximum_amount ?? "—"}</Row>

                        <Row label="Description">
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {coupon.description || "—"}
                            </Typography>
                        </Row>

                        <Divider sx={{ my: 1.5 }} />

                        <Stack spacing={0.5} sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">Included Emails</Typography>
                            <Stack direction="row" flexWrap="wrap">{renderList(coupon.included_emails)}</Stack>
                        </Stack>

                        <Row label="Included Products">{(coupon.included_products || []).join(", ") || "—"}</Row>
                        <Row label="Excluded Products">{(coupon.excluded_products || []).join(", ") || "—"}</Row>
                        <Row label="Included Categories">{(coupon.included_product_categories || []).join(", ") || "—"}</Row>
                        <Row label="Excluded Categories">{(coupon.excluded_product_categories || []).join(", ") || "—"}</Row>
                    </>
                ) : (
                    <Typography variant="body2">No coupon selected</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewCouponDialog;
