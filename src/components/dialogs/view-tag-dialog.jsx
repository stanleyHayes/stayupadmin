// src/components/tags/ViewTagDialog.jsx
import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Stack,
    Link as MuiLink,
    Divider
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectTags } from "../../redux/features/tags/tags-slice";
import moment from "moment";

const Row = ({ label, children }) => (
    <Stack spacing={0.5} sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2">{children ?? "—"}</Typography>
    </Stack>
);

const ViewTagDialog = ({ open, onClose }) => {
    const { tag } = useSelector(selectTags);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>View tag</DialogTitle>
            <DialogContent dividers>
                {!tag ? (
                    <Typography variant="body2">No tag selected</Typography>
                ) : (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Row label="ID">{tag.id}</Row>
                        <Row label="Name">{tag.name}</Row>
                        <Row label="Slug">{tag.slug}</Row>
                        <Row label="Count">{tag.count ?? 0}</Row>
                        <Row label="Description">
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{tag.description || "—"}</Typography>
                        </Row>

                        <Divider />

                        <Row label="Created at">{tag.created_at ? moment(tag.created_at).format("LLL") : tag.created ? moment(tag.created).format("LLL") : "—"}</Row>
                        <Row label="Updated at">{tag.updated_at ? moment(tag.updated_at).format("LLL") : tag.updated ? moment(tag.updated).format("LLL") : "—"}</Row>

                        {tag._links && (
                            <>
                                <Divider />
                                <Typography variant="subtitle2">Links</Typography>
                                <Stack spacing={1}>
                                    {Object.keys(tag._links).map((k) =>
                                        (tag._links[k] || []).map((ln, i) => (
                                            <MuiLink key={`${k}-${i}`} href={ln.href} target="_blank" rel="noopener noreferrer" variant="body2">
                                                {k} — {ln.href}
                                            </MuiLink>
                                        ))
                                    )}
                                </Stack>
                            </>
                        )}
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewTagDialog;
