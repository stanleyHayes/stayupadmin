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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5, flexWrap: {xs: "wrap", sm: "nowrap"}}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: {xs: "auto", sm: 100}, fontWeight: 600, flexShrink: 0}}>{label}</Typography>
        <Typography variant="body2" component="div" sx={{minWidth: 0, wordBreak: "break-word"}}>{value ?? "—"}</Typography>
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

    if (postLoading && !post) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

    const p = post || {};

    return (
        <Layout>
            {postLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {postError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{postError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "stretch", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5" noWrap>Blog Post</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{gap: 0.5}}>
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
                                {(() => {
                                    const img = typeof p.image === "object" ? (p.image?.secure_url || p.image?.url || p.image?.src) : p.image;
                                    return img ? <CardMedia component="img" src={img} alt={p.title} sx={{width: "100%", height: 280, objectFit: "cover", borderRadius: 1, mb: 2}}/> : null;
                                })()}
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>{p.title || "—"}</Typography>
                                <InfoRow label="Tag" value={(() => {
                                    const tag = p.tag || (Array.isArray(p.tags) && p.tags[0]) || p.category;
                                    return tag ? <Chip label={tag} size="small" variant="outlined" color="secondary"/> : null;
                                })()}/>
                                <InfoRow label="Author" value={
                                    p.author ? (
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{minWidth: 0}}>
                                            <Avatar src={p.author.avatar_url || p.author.avatar} sx={{width: 20, height: 20, flexShrink: 0}}/>
                                            <Typography variant="body2" noWrap>{p.author.display_name || p.author.name || (p.author.first_name ? `${p.author.first_name} ${p.author.last_name || ""}`.trim() : p.author.email || "—")}</Typography>
                                        </Stack>
                                    ) : "—"
                                }/>
                                <InfoRow label="Created" value={(p.date_created || p.created_at) ? moment(p.date_created || p.created_at).format("LLL") : null}/>
                                <InfoRow label="Updated" value={(p.date_modified || p.updated_at) ? moment(p.date_modified || p.updated_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Excerpt</Typography>
                                <Typography variant="body2" sx={{mt: 0.5, mb: 2, fontStyle: "italic"}}>{p.excerpt || "—"}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Content</Typography>
                                {p.content ? (
                                    <Box sx={{
                                        mt: 0.5,
                                        "& h1": { fontSize: 28, fontWeight: 700, mt: 3, mb: 1 },
                                        "& h2": { fontSize: 22, fontWeight: 700, mt: 2.5, mb: 1 },
                                        "& h3": { fontSize: 18, fontWeight: 600, mt: 2, mb: 0.5 },
                                        "& p": { fontSize: 14, lineHeight: 1.8, mb: 1.5 },
                                        "& ul, & ol": { pl: 3, mb: 1.5 },
                                        "& li": { fontSize: 14, lineHeight: 1.8, mb: 0.5 },
                                        "& blockquote": { borderLeft: 3, borderColor: "secondary.main", pl: 2, ml: 0, my: 1.5, color: "text.secondary", fontStyle: "italic" },
                                        "& code": { backgroundColor: "action.hover", px: 0.5, py: 0.25, borderRadius: 1, fontSize: 13, fontFamily: "monospace" },
                                        "& pre": { backgroundColor: "action.hover", p: 2, borderRadius: 1, overflow: "auto", mb: 1.5, "& code": { backgroundColor: "transparent", p: 0 } },
                                        "& img": { maxWidth: "100%", borderRadius: 1 },
                                        "& a": { color: "secondary.main" },
                                        "& hr": { my: 2, border: "none", borderTop: 1, borderColor: "divider" },
                                        "& table": { width: "100%", borderCollapse: "collapse", mb: 1.5 },
                                        "& th, & td": { border: 1, borderColor: "divider", px: 1.5, py: 0.75, fontSize: 13, textAlign: "left" },
                                        "& th": { fontWeight: 600, backgroundColor: "action.hover" },
                                    }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={{mt: 0.5}}>—</Typography>
                                )}
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
