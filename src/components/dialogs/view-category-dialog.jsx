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
 * - category: object | null
 * - onClose: () => void
 */
const ViewCategoryDialog = ({ open, category, onClose }) => {
    const renderMeta = (meta) => {
        if (!meta) return <Typography variant="body2" color="text.secondary">—</Typography>;
        return Object.keys(meta).map((k) => <Chip key={k} size="small" label={`${k}: ${String(meta[k])}`} sx={{ mr: .5, mb: .5 }} />);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Category Details</DialogTitle>
            <DialogContent dividers>
                {category ? (
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Typography variant="subtitle2">Name</Typography>
                            <Typography>{category.name}</Typography>
                        </Grid>

                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Typography variant="subtitle2">Slug</Typography>
                            <Typography>{category.slug ?? "—"}</Typography>
                        </Grid>

                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Typography variant="subtitle2">Parent</Typography>
                            <Typography>{category.parent ?? "—"}</Typography>
                        </Grid>

                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Typography variant="subtitle2">Status</Typography>
                            <Typography>{category.status ?? "—"}</Typography>
                        </Grid>

                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Typography variant="subtitle2">Published</Typography>
                            <Typography>{category.published ? "Yes" : "No"}</Typography>
                        </Grid>

                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Typography variant="subtitle2">Visible From</Typography>
                            <Typography>{category.visible_from ? moment(category.visible_from).format("YYYY-MM-DD") : "—"}</Typography>
                        </Grid>

                        <Grid item size={{ xs: 12 }}>
                            <Typography variant="subtitle2">Description</Typography>
                            <Typography style={{ whiteSpace: "pre-wrap" }}>{category.description || "—"}</Typography>
                        </Grid>

                        <Grid item size={{ xs: 12 }}>
                            <Typography variant="subtitle2">Meta</Typography>
                            {renderMeta(category.meta)}
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>No category selected</Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewCategoryDialog;
