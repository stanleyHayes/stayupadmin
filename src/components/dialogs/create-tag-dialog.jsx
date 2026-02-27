// src/components/tags/CreateTagDialog.jsx
import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Stack
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createTag } from "../../redux/features/tags/tags-slice";

const TagSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    slug: Yup.string().nullable(),
    description: Yup.string().nullable()
});

const CreateTagDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Create tag</DialogTitle>
            <Formik
                initialValues={{ name: "", slug: "", description: "" }}
                validationSchema={TagSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    await dispatch(createTag(values));
                    setSubmitting(false);
                    resetForm();
                    onClose();
                }}
            >
                {({ values, handleChange, errors, touched, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12}}>
                                    <Stack spacing={1}>
                                        <TextField size="small" label="Name" name="name" value={values.name} onChange={handleChange}
                                                   error={Boolean(touched.name && errors.name)} helperText={touched.name && errors.name ? errors.name : ""} fullWidth />
                                        <TextField size="small" label="Slug (optional)" name="slug" value={values.slug} onChange={handleChange} fullWidth />
                                        <TextField size="small" label="Description" name="description" value={values.description} onChange={handleChange} fullWidth multiline rows={3} />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create"}</Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default CreateTagDialog;
