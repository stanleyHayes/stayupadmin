// src/components/attributes/UpdateAttributeDialog.jsx
import React, { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Stack, FormControlLabel, Switch } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectAttributes, updateAttribute, clearAttribute } from "../../redux/features/attributes/attributes-slice";

const AttrSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    slug: Yup.string().nullable(),
    type: Yup.string().oneOf(["select"], "Only 'select' supported").required(),
    order_by: Yup.string().oneOf(["menu_order", "name", "name_num", "id"]).required(),
    has_archives: Yup.boolean()
});

const UpdateAttributeDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { attribute } = useSelector(selectAttributes);

    useEffect(() => {
        if (!open) dispatch(clearAttribute());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!open) return null;

    const initial = {
        name: attribute?.name || "",
        slug: attribute?.slug || "",
        type: attribute?.type || "select",
        order_by: attribute?.order_by || "menu_order",
        has_archives: attribute?.has_archives || false
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Update attribute</DialogTitle>
            <Formik
                enableReinitialize
                initialValues={initial}
                validationSchema={AttrSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    await dispatch(updateAttribute({ id: attribute.id, data: values }));
                    setSubmitting(false);
                    onClose();
                }}
            >
                {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
                    <Form>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12, md: "auto" }}>
                                    <Stack spacing={1}>
                                        <TextField size="small" label="Name" name="name" value={values.name} onChange={handleChange} error={Boolean(touched.name && errors.name)} helperText={touched.name && errors.name ? errors.name : ""} fullWidth />
                                        <TextField size="small" label="Slug (optional)" name="slug" value={values.slug} onChange={handleChange} fullWidth />
                                        <TextField size="small" label="Type" name="type" value={values.type} onChange={handleChange} fullWidth disabled />
                                        <TextField size="small" label="Order by" name="order_by" value={values.order_by} onChange={handleChange} fullWidth />
                                        <FormControlLabel control={<Switch checked={values.has_archives} onChange={(e) => setFieldValue("has_archives", e.target.checked)} />} label="Has archives" />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Update"}</Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default UpdateAttributeDialog;
