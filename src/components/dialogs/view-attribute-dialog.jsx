// src/components/attributes/ViewAttributeDialog.jsx
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Stack, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { selectAttributes } from "../../redux/features/attributes/attributes-slice";
import moment from "moment";

const Row = ({ label, children }) => (
    <Stack spacing={0.5} sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2">{children ?? "—"}</Typography>
    </Stack>
);

const ViewAttributeDialog = ({ open, onClose }) => {
    const { attribute } = useSelector(selectAttributes);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>View attribute</DialogTitle>
            <DialogContent dividers>
                {!attribute ? (
                    <Typography variant="body2">No attribute selected</Typography>
                ) : (
                    <>
                        <Row label="ID">{attribute.id}</Row>
                        <Row label="Name">{attribute.name}</Row>
                        <Row label="Slug">{attribute.slug}</Row>
                        <Row label="Type">{attribute.type}</Row>
                        <Row label="Order by">{attribute.order_by}</Row>
                        <Row label="Has archives">{attribute.has_archives ? "Yes" : "No"}</Row>
                        <Row label="Terms count">{attribute.terms_count ?? 0}</Row>

                        <Divider sx={{ my: 1 }} />

                        <Row label="Created at">{attribute.created_at ? moment(attribute.created_at).format("LLL") : "—"}</Row>
                        <Row label="Updated at">{attribute.updated_at ? moment(attribute.updated_at).format("LLL") : "—"}</Row>

                        {attribute._links && (
                            <>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle2">Links</Typography>
                                {Object.keys(attribute._links).map((k) =>
                                    (attribute._links[k] || []).map((ln, i) => (
                                        <Typography key={`${k}-${i}`} variant="body2"><strong>{k}:</strong> {ln.href}</Typography>
                                    ))
                                )}
                            </>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewAttributeDialog;
