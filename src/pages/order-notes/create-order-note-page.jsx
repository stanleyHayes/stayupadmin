import React from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createOrderNote, selectOrderNotes} from "../../redux/features/order-notes/order-notes-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateOrderNotePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orderNoteLoading, orderNoteError} = useSelector(selectOrderNotes);

    const formik = useFormik({
        initialValues: {order_id: "", content: "", note_type: "order_note", author: ""},
        validationSchema: Yup.object({
            content: Yup.string().required("Content is required"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(createOrderNote(values));
            if (!result.error) navigate("/order-notes");
        }
    });

    return (
        <Layout>
            {orderNoteLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Add Order Note</Typography>
                    </Stack>
                    {orderNoteError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderNoteError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Note Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                name="order_id" label="Order ID"
                                                value={formik.values.order_id} onChange={formik.handleChange}
                                                size="small" fullWidth
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                name="content" label="Content"
                                                value={formik.values.content} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={Boolean(formik.touched.content && formik.errors.content)}
                                                helperText={formik.touched.content && formik.errors.content}
                                                size="small" fullWidth multiline rows={4} required
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                name="author" label="Author"
                                                value={formik.values.author} onChange={formik.handleChange}
                                                size="small" fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Note Type</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Type</InputLabel>
                                        <Select name="note_type" value={formik.values.note_type} onChange={formik.handleChange} label="Type">
                                            <MenuItem value="order_note">Order Note</MenuItem>
                                            <MenuItem value="customer_note">Customer Note</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={orderNoteLoading}>Add Note</Button>
                                        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>Cancel</Button>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>
        </Layout>
    );
};

export default CreateOrderNotePage;
