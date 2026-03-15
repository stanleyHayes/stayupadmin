import React, {useEffect} from "react";
import {
    Box, Button, Checkbox, Container, FormControlLabel, Grid,
    LinearProgress, Paper, Stack, TextField, Typography, Alert, AlertTitle
} from "@mui/material";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchPost, updatePost, selectBlog} from "../../redux/features/blog/blog-slice";
import {useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    excerpt: Yup.string().required("Excerpt is required"),
    content: Yup.string().required("Content is required"),
    tag: Yup.string().required("Tag is required"),
    image: Yup.string().url("Must be a valid URL"),
    author_name: Yup.string().required("Author name is required"),
});

const UpdateBlogPostPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {postID} = useParams();
    const {post, postLoading, postError} = useSelector(selectBlog);

    useEffect(() => {
        if (postID) dispatch(fetchPost(postID));
    }, [dispatch, postID]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: post?.title || "",
            excerpt: post?.excerpt || "",
            content: post?.content || "",
            tag: post?.tag || "",
            image: post?.image || "",
            author_name: post?.author?.name || "",
            author_avatar: post?.author?.avatar || "",
            featured: post?.featured || false,
        },
        validationSchema,
        onSubmit: async (values) => {
            const data = {
                title: values.title,
                excerpt: values.excerpt,
                content: values.content,
                tag: values.tag,
                image: values.image,
                featured: values.featured,
                author: {
                    name: values.author_name,
                    avatar: values.author_avatar
                }
            };
            const result = await dispatch(updatePost({id: postID, data}));
            if (!result.error) navigate(`/blog/${postID}`);
        }
    });

    return (
        <Layout>
            {postLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {postError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{postError}</AlertTitle></Alert>}
                <Container maxWidth="md">
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Edit Blog Post</Typography>
                    </Stack>

                    <Paper elevation={0} sx={{p: 3}}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid size={{xs: 12}}>
                                    <TextField fullWidth label="Title" name="title" value={formik.values.title} onChange={formik.handleChange} error={formik.touched.title && Boolean(formik.errors.title)} helperText={formik.touched.title && formik.errors.title} size="small"/>
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <TextField fullWidth label="Excerpt" name="excerpt" value={formik.values.excerpt} onChange={formik.handleChange} error={formik.touched.excerpt && Boolean(formik.errors.excerpt)} helperText={formik.touched.excerpt && formik.errors.excerpt} size="small" multiline rows={2}/>
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <TextField fullWidth label="Content" name="content" value={formik.values.content} onChange={formik.handleChange} error={formik.touched.content && Boolean(formik.errors.content)} helperText={formik.touched.content && formik.errors.content} size="small" multiline rows={6}/>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <TextField fullWidth label="Tag" name="tag" value={formik.values.tag} onChange={formik.handleChange} error={formik.touched.tag && Boolean(formik.errors.tag)} helperText={formik.touched.tag && formik.errors.tag} size="small"/>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <TextField fullWidth label="Image URL" name="image" value={formik.values.image} onChange={formik.handleChange} error={formik.touched.image && Boolean(formik.errors.image)} helperText={formik.touched.image && formik.errors.image} size="small"/>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <TextField fullWidth label="Author Name" name="author_name" value={formik.values.author_name} onChange={formik.handleChange} error={formik.touched.author_name && Boolean(formik.errors.author_name)} helperText={formik.touched.author_name && formik.errors.author_name} size="small"/>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <TextField fullWidth label="Author Avatar URL" name="author_avatar" value={formik.values.author_avatar} onChange={formik.handleChange} size="small"/>
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <FormControlLabel control={<Checkbox checked={formik.values.featured} onChange={formik.handleChange} name="featured" color="secondary"/>} label="Mark as Featured"/>
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button variant="outlined" size="small" onClick={() => navigate(-1)}>Cancel</Button>
                                        <Button type="submit" variant="contained" color="secondary" size="small">Update Post</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default UpdateBlogPostPage;
