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

/**
 * Props:
 * - open: boolean
 * - category: object | null
 * - onClose: () => void
 */
const ViewCategoryDialog = ({ open, category, onClose }) => {
    const renderMeta = (meta) => {
        if (!meta) return "—";
        return Object.keys(meta).map((k) => <Chip key={k} size="small" label={`${k}: ${String(meta[k])}`} sx={{ mr: 0.5, mb: 0.5 }} />);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Category Details</DialogTitle>
            <DialogContent dividers>
                {category ? (
                    <>
                        <Row label="Name">{category.name}</Row>
                        <Row label="Slug">{category.slug ?? "—"}</Row>
                        <Row label="Parent">{category.parent ?? "—"}</Row>

                        <Divider sx={{ my: 1.5 }} />

                        <Row label="Status">{category.status ?? "—"}</Row>
                        <Row label="Published">{category.published ? "Yes" : "No"}</Row>
                        <Row label="Visible From">{category.visible_from ? moment(category.visible_from).format("LLL") : "—"}</Row>

                        <Divider sx={{ my: 1.5 }} />

                        <Row label="Description">
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {category.description || "—"}
                            </Typography>
                        </Row>

                        <Stack spacing={0.5} sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">Meta</Typography>
                            <Stack direction="row" flexWrap="wrap">{renderMeta(category.meta)}</Stack>
                        </Stack>
                    </>
                ) : (
                    <Typography variant="body2">No category selected</Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewCategoryDialog;
