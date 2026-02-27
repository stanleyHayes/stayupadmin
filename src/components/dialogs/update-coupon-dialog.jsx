import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

/**
 * Props:
 * - open: boolean
 * - coupon: object | null
 * - onClose: () => void
 * - onUpdate: ({id, data}) => void
 */
const UpdateCouponDialog = ({ open, coupon, onClose, onUpdate }) => {
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!coupon) {
            setForm(null);
            setErrors({});
            return;
        }
        setForm({
            code: coupon.code ?? "",
            amount: coupon.amount ?? "",
            discount_type: coupon.discount_type ?? "fixed_cart",
            description: coupon.description ?? "",
            date_expires: coupon.date_expires ? moment(coupon.date_expires) : null,
            usage_limit: coupon.usage_limit ?? "",
            usage_limit_per_user: coupon.usage_limit_per_user ?? "",
            limit_usage_to_x_items: coupon.limit_usage_to_x_items ?? "",
            free_shipping: !!coupon.free_shipping,
            exclude_sale_items: !!coupon.exclude_sale_items,
            individual_use: !!coupon.individual_use,
            minimum_amount: coupon.minimum_amount ?? "",
            maximum_amount: coupon.maximum_amount ?? "",
            included_emails: (coupon.included_emails || []).join(", "),
            included_products: (coupon.included_products || []).join(", "),
            excluded_products: (coupon.excluded_products || []).join(", "),
            included_product_categories: (coupon.included_product_categories || []).join(", "),
            excluded_product_categories: (coupon.excluded_product_categories || []).join(", ")
        });
    }, [coupon]);

    if (!form) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Update Coupon</DialogTitle>
                <DialogContent dividers>
                    <p>No coupon selected</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const validate = () => {
        const e = {};
        if (!form.code || form.code.trim() === "") e.code = "Code is required";
        if (form.amount !== "" && isNaN(Number(form.amount))) e.amount = "Amount must be a number";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const normalize = () => ({
        code: form.code.trim(),
        amount: form.amount === "" ? 0 : Number(form.amount),
        discount_type: form.discount_type,
        description: form.description,
        date_expires: form.date_expires ? moment(form.date_expires).toISOString() : null,
        usage_limit: form.usage_limit === "" ? null : Number(form.usage_limit),
        usage_limit_per_user: form.usage_limit_per_user === "" ? null : Number(form.usage_limit_per_user),
        limit_usage_to_x_items: form.limit_usage_to_x_items === "" ? null : Number(form.limit_usage_to_x_items),
        free_shipping: !!form.free_shipping,
        exclude_sale_items: !!form.exclude_sale_items,
        individual_use: !!form.individual_use,
        minimum_amount: form.minimum_amount === "" ? null : Number(form.minimum_amount),
        maximum_amount: form.maximum_amount === "" ? null : Number(form.maximum_amount),
        included_emails: form.included_emails ? form.included_emails.split(",").map(s => s.trim()).filter(Boolean) : [],
        included_products: form.included_products ? form.included_products.split(",").map(s => s.trim()).filter(Boolean) : [],
        excluded_products: form.excluded_products ? form.excluded_products.split(",").map(s => s.trim()).filter(Boolean) : [],
        included_product_categories: form.included_product_categories ? form.included_product_categories.split(",").map(s => s.trim()).filter(Boolean) : [],
        excluded_product_categories: form.excluded_product_categories ? form.excluded_product_categories.split(",").map(s => s.trim()).filter(Boolean) : []
    });

    const handleSave = () => {
        if (!validate()) return;
        const payload = normalize();
        onUpdate?.({ id: coupon._id ?? coupon.id, data: payload });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Update Coupon</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Code"
                            fullWidth
                            size="small"
                            value={form.code}
                            onChange={e => setForm({ ...form, code: e.target.value })}
                            error={!!errors.code}
                            helperText={errors.code}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Amount"
                            fullWidth
                            size="small"
                            value={form.amount}
                            onChange={e => setForm({ ...form, amount: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Discount Type</InputLabel>
                            <Select
                                label="Discount Type"
                                value={form.discount_type}
                                onChange={e => setForm({ ...form, discount_type: e.target.value })}
                            >
                                <MenuItem value="percent">Percent</MenuItem>
                                <MenuItem value="fixed_at">Fixed At</MenuItem>
                                <MenuItem value="fixed_cart">Fixed Cart</MenuItem>
                                <MenuItem value="fixed_product">Fixed Product</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Expires"
                                value={form.date_expires}
                                onChange={(d) => setForm({ ...form, date_expires: d ? moment(d) : null })}
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Usage limit"
                            fullWidth
                            size="small"
                            value={form.usage_limit}
                            onChange={e => setForm({ ...form, usage_limit: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Usage limit per user"
                            fullWidth
                            size="small"
                            value={form.usage_limit_per_user}
                            onChange={e => setForm({ ...form, usage_limit_per_user: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Included emails (comma separated)"
                            fullWidth
                            size="small"
                            value={form.included_emails}
                            onChange={e => setForm({ ...form, included_emails: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={<Switch checked={form.free_shipping} onChange={e => setForm({ ...form, free_shipping: e.target.checked })} />}
                            label="Free shipping"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={<Switch checked={form.exclude_sale_items} onChange={e => setForm({ ...form, exclude_sale_items: e.target.checked })} />}
                            label="Exclude sale items"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="secondary" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateCouponDialog;
