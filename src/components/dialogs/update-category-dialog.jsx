
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

/**
 * Props:
 * - open: boolean
 * - category: object | null
 * - onClose: () => void
 * - onUpdate: ({id, data}) => void
 */
const UpdateCategoryDialog = ({ open, category, onClose, onUpdate }) => {
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!category) {
            setForm(null);
            setErrors({});
            return;
        }
        setForm({
            name: category.name ?? "",
            slug: category.slug ?? "",
            description: category.description ?? "",
            parent: category.parent ?? "",
            published: !!category.published,
            status: category.status ?? "ACTIVE",
            visible_from: category.visible_from ? moment(category.visible_from) : null
        });
    }, [category]);

    if (!form) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Update Category</DialogTitle>
                <DialogContent dividers>
                    <p>No category selected</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const validate = () => {
        const e = {};
        if (!form.name || form.name.trim() === "") e.name = "Name is required";
        if (form.slug && /\s/.test(form.slug)) e.slug = "Slug cannot contain spaces";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const normalize = () => ({
        name: form.name.trim(),
        slug: form.slug ? form.slug.trim().toLowerCase() : form.name.trim().toLowerCase().replace(/\s+/g, "-"),
        description: form.description || "",
        parent: form.parent || null,
        published: !!form.published,
        status: form.status || "ACTIVE",
        visible_from: form.visible_from ? moment(form.visible_from).toISOString() : null
    });

    const handleSave = () => {
        if (!validate()) return;
        const payload = normalize();
        onUpdate?.({ id: category._id ?? category.id, data: payload });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Update Category</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <TextField
                            label="Name"
                            fullWidth
                            size="small"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <TextField
                            label="Slug"
                            fullWidth
                            size="small"
                            value={form.slug}
                            onChange={e => setForm({ ...form, slug: e.target.value })}
                            error={!!errors.slug}
                            helperText={errors.slug}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <TextField
                            label="Parent Category ID"
                            fullWidth
                            size="small"
                            value={form.parent}
                            onChange={e => setForm({ ...form, parent: e.target.value })}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select value={form.status} label="Status" onChange={e => setForm({ ...form, status: e.target.value })}>
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                <MenuItem value="DELETED">Deleted</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Visible From (optional)"
                                value={form.visible_from}
                                onChange={d => setForm({ ...form, visible_from: d ? moment(d) : null })}
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <TextField
                            label="Description"
                            fullWidth
                            size="small"
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <FormControlLabel
                            control={<Switch checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />}
                            label="Published"
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

export default UpdateCategoryDialog;
