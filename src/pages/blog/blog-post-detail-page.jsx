import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, CardMedia, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchPost, updatePost, deletePost, selectBlog} from "../../redux/features/blog/blog-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PublishIcon from "@mui/icons-material/Publish";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import moment from "moment";
import {Link} from "react-router-dom";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => s === "published" ? "success" : s === "draft" ? "warning" : "default";

const BlogPostDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {postID} = useParams();
    const {post, postLoading, postError} = useSelector(selectBlog);

    useEffect(() => {
        if (postID) dispatch(fetchPost(postID));
    }, [dispatch, postID]);

    const handlePublish = () => dispatch(updatePost({id: postID, data: {status: "published"}}));
    const handleDraft = () => dispatch(updatePost({id: postID, data: {status: "draft"}}));
    const handleToggleFeatured = () => dispatch(updatePost({id: postID, data: {featured: !post?.featured}}));
    const handleDelete = async () => {
        if (!window.confirm("Delete this post? This cannot be undone.")) return;
        await dispatch(deletePost(postID));
        navigate("/blog");
    };

    const p = post || {};

    return (
        <Layout>
            {postLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {postError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{postError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}} flexWrap="wrap">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Blog Post</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {p.status === "draft" && (
                                <Button startIcon={<PublishIcon/>} variant="outlined" color="success" size="small" onClick={handlePublish}>Publish</Button>
                            )}
                            {p.status === "published" && (
                                <Button variant="outlined" color="warning" size="small" onClick={handleDraft}>Unpublish</Button>
                            )}
                            <Button startIcon={p.featured ? <StarIcon/> : <StarBorderIcon/>} variant="outlined" color="secondary" size="small" onClick={handleToggleFeatured}>
                                {p.featured ? "Unfeature" : "Feature"}
                            </Button>
                            <Link to={`/blog/${postID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                {p.image && (
                                    <CardMedia component="img" src={p.image} alt={p.title} sx={{width: "100%", height: 220, objectFit: "cover", borderRadius: 0, mb: 2}}/>
                                )}
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>{p.title || "—"}</Typography>
                                <InfoRow label="Tag" value={p.tag && <Chip label={p.tag} size="small" variant="outlined" color="secondary"/>}/>
                                <InfoRow label="Author" value={
                                    p.author ? (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Avatar src={p.author.avatar} sx={{width: 20, height: 20}}/>
                                            <Typography variant="body2">{p.author.name}</Typography>
                                        </Stack>
                                    ) : "—"
                                }/>
                                <InfoRow label="Created" value={p.created_at ? moment(p.created_at).format("LLL") : null}/>
                                <InfoRow label="Updated" value={p.updated_at ? moment(p.updated_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Excerpt</Typography>
                                <Typography variant="body2" sx={{mt: 0.5, mb: 2, fontStyle: "italic"}}>{p.excerpt || "—"}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Content</Typography>
                                <Typography variant="body2" sx={{mt: 0.5, whiteSpace: "pre-wrap", lineHeight: 1.8}}>{p.content || "—"}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Stack spacing={2}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                    <Stack spacing={1}>
                                        <Chip label={p.status || "—"} size="small" color={statusColor(p.status)}/>
                                        {p.featured && <Chip label="Featured" size="small" color="warning" variant="outlined"/>}
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default BlogPostDetailPage;
