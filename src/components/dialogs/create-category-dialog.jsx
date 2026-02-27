import React, {useState} from "react";
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
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onCreate: (payload) => void
 */
const CreateCategoryDialog = ({open, onClose, onCreate}) => {
    const empty = {
        name: "",
        slug: "",
        description: "",
        parent: "",
        published: true,
        status: "ACTIVE",
        visible_from: null, // optional date
    };

    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});

    const reset = () => {
        setForm(empty);
        setErrors({});
    };

    const close = () => {
        reset();
        onClose?.();
    };

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

    const handleCreate = () => {
        if (!validate()) return;
        const payload = normalize();
        onCreate?.(payload);
        reset();
    };

    return (
        <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
            <DialogTitle>Create Category</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12}}>
                        <TextField
                            label="Name"
                            fullWidth
                            size="small"
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <TextField
                            label="Slug (optional)"
                            fullWidth
                            size="small"
                            value={form.slug}
                            onChange={e => setForm({...form, slug: e.target.value})}
                            error={!!errors.slug}
                            helperText={errors.slug}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <TextField
                            label="Parent Category ID (optional)"
                            fullWidth
                            size="small"
                            value={form.parent}
                            onChange={e => setForm({...form, parent: e.target.value})}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={form.status}
                                label="Status"
                                onChange={e => setForm({...form, status: e.target.value})}
                                variant="outlined">
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                <MenuItem value="DELETED">Deleted</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Visible From (optional)"
                                value={form.visible_from}
                                onChange={d => setForm({...form, visible_from: d ? moment(d) : null})}
                                slotProps={{textField: {size: "small", fullWidth: true}}}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <TextField
                            label="Description"
                            fullWidth
                            size="small"
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.published}
                                    onChange={e => setForm({...form, published: e.target.checked})}/>}
                            label="Published"
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button variant="contained" color="secondary" onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCategoryDialog;
