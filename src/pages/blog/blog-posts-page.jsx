import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, CardMedia, Chip, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select,
    Stack, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, deletePost, selectBlog} from "../../redux/features/blog/blog-slice";
import {
    VisibilityOutlined, DeleteForeverOutlined, EditOutlined,
    ArticleOutlined, PublishOutlined, DraftsOutlined, StarOutlined, Star
} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";
import {CardGridSkeleton} from "../../components/shared/page-skeleton.jsx";

const statusColor = (s) => s === "published" ? "success" : s === "draft" ? "warning" : s === "archived" ? "default" : "default";

const authorName = (a) => {
    if (!a) return "Unknown";
    if (typeof a === "string") return a;
    return a.display_name || a.name || (a.first_name ? `${a.first_name} ${a.last_name || ""}`.trim() : a.email || "Unknown");
};

const authorAvatar = (a) => {
    if (!a || typeof a === "string") return null;
    return a.avatar_url || a.avatar || a.image || null;
};

const postTag = (p) => {
    if (p.tag) return typeof p.tag === "string" ? p.tag : null;
    if (Array.isArray(p.tags) && p.tags.length > 0) return p.tags[0];
    if (p.category) return p.category;
    return null;
};

const postImage = (p) => {
    if (!p.image) return null;
    if (typeof p.image === "string") return p.image;
    return p.image.secure_url || p.image.url || p.image.src || null;
};

const postDate = (p) => p.date_created || p.created_at || p.createdAt;

const BlogPostsPage = () => {
    const dispatch = useDispatch();
    const {posts, postLoading, postError} = useSelector(selectBlog);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [tagFilter, setTagFilter] = useState("all");

    useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

    const filteredPosts = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        let result = [...posts];
        if (statusFilter !== "all") result = result.filter(p => p.status === statusFilter);
        if (tagFilter !== "all") result = result.filter(p => postTag(p) === tagFilter);
        const q = query.trim().toLowerCase();
        if (q) result = result.filter(p =>
            [p.title, authorName(p.author), p.content, p.excerpt, postTag(p)].join(" ").toLowerCase().includes(q)
        );
        return result;
    }, [posts, query, statusFilter, tagFilter]);

    const handleDelete = async (post) => {
        if (!window.confirm(`Delete "${post.title}"?`)) return;
        await dispatch(deletePost(post._id));
    };

    const totalPosts = posts?.length || 0;
    const publishedCount = posts?.filter(p => p.status === "published").length || 0;
    const draftCount = posts?.filter(p => p.status === "draft").length || 0;
    const featuredCount = posts?.filter(p => p.featured).length || 0;
    const allTags = [...new Set((posts || []).map(p => postTag(p)).filter(Boolean))];

    if (postLoading && (!posts || posts.length === 0)) return <Layout><Box sx={{pt: 4, pb: 6}}><CardGridSkeleton cards={6}/></Box></Layout>;

    return (
        <Layout>
            {postLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {postError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{postError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Blog Posts"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search posts..."
                        action={
                            <Link to="/blog/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">New Post</Button>
                            </Link>
                        }
                    />
                    <Divider sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total" value={totalPosts} icon={<ArticleOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Published" value={publishedCount} icon={<PublishOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Drafts" value={draftCount} icon={<DraftsOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Featured" value={featuredCount} icon={<StarOutlined fontSize="small"/>} iconColor="text.yellow" iconBg="light.yellow"/>
                        </Grid>
                    </Grid>

                    {/* Filters */}
                    <Stack direction="row" spacing={2} sx={{mb: 3}} flexWrap="wrap">
                        <FormControl size="small" sx={{minWidth: 110}}>
                            <InputLabel>Status</InputLabel>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Status">
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="published">Published</MenuItem>
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="archived">Archived</MenuItem>
                            </Select>
                        </FormControl>
                        {allTags.length > 0 && (
                            <FormControl size="small" sx={{minWidth: 110}}>
                                <InputLabel>Tag</InputLabel>
                                <Select value={tagFilter} onChange={e => setTagFilter(e.target.value)} label="Tag">
                                    <MenuItem value="all">All</MenuItem>
                                    {allTags.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}
                    </Stack>

                    {/* Post Cards */}
                    {filteredPosts.length === 0 ? (
                        <Paper elevation={0} sx={{p: 6, textAlign: "center"}}>
                            <Typography variant="body2" color="text.secondary">No posts found</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredPosts.map((post) => {
                                const img = postImage(post);
                                const tag = postTag(post);
                                const date = postDate(post);
                                const author = post.author;
                                return (
                                    <Grid key={post._id} size={{xs: 12, sm: 6, lg: 4}}>
                                        <Paper elevation={0} sx={{
                                            overflow: "hidden", height: "100%", display: "flex", flexDirection: "column",
                                            transition: "all 0.2s", "&:hover": {borderColor: "secondary.main", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)"}
                                        }}>
                                            {/* Image */}
                                            <Link to={`/blog/${post._id}`} style={{textDecoration: "none"}}>
                                                <Box sx={{position: "relative", backgroundColor: "background.alternative", height: 180}}>
                                                    {img ? (
                                                        <Box component="img" src={img} alt={post.title} sx={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}/>
                                                    ) : (
                                                        <Box sx={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                            <ArticleOutlined sx={{fontSize: 40, color: "action.disabled"}}/>
                                                        </Box>
                                                    )}
                                                    {post.featured && <Star sx={{position: "absolute", top: 10, right: 10, fontSize: 20, color: "#F59E0B"}}/>}
                                                    <Chip label={post.status || "draft"} size="small" color={statusColor(post.status)} sx={{position: "absolute", top: 10, left: 10, height: 22, fontSize: 10, textTransform: "capitalize", fontWeight: 600}}/>
                                                </Box>
                                            </Link>

                                            {/* Content */}
                                            <Box sx={{p: 2.5, flex: 1, display: "flex", flexDirection: "column"}}>
                                                {tag && <Chip label={tag} size="small" variant="outlined" color="secondary" sx={{alignSelf: "flex-start", mb: 1, height: 20, fontSize: 10}}/>}

                                                <Link to={`/blog/${post._id}`} style={{textDecoration: "none", color: "inherit"}}>
                                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 0.5, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"}}>
                                                        {post.title || "Untitled"}
                                                    </Typography>
                                                </Link>

                                                {post.excerpt && (
                                                    <Typography variant="caption" color="text.secondary" sx={{mb: 2, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1}}>
                                                        {post.excerpt}
                                                    </Typography>
                                                )}

                                                <Divider sx={{my: 1.5}}/>

                                                {/* Footer */}
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Avatar src={authorAvatar(author)} sx={{width: 24, height: 24, fontSize: 11}}>
                                                            {(authorName(author)?.[0] || "?").toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="caption" sx={{fontWeight: 600, lineHeight: 1.2, display: "block"}}>{authorName(author)}</Typography>
                                                            <Typography variant="caption" color="text.muted" sx={{fontSize: 10}}>{date ? moment(date).format("MMM D, YYYY") : "—"}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Stack direction="row" spacing={0.5}>
                                                        <Tooltip title="View">
                                                            <Link to={`/blog/${post._id}`}>
                                                                <VisibilityOutlined sx={{fontSize: 20, color: "icon.green", cursor: "pointer", "&:hover": {transform: "scale(1.15)"}}}/>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title="Edit">
                                                            <Link to={`/blog/${post._id}/update`}>
                                                                <EditOutlined sx={{fontSize: 20, color: "secondary.main", cursor: "pointer", "&:hover": {transform: "scale(1.15)"}}}/>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <DeleteForeverOutlined onClick={() => handleDelete(post)} sx={{fontSize: 20, color: "icon.red", cursor: "pointer", "&:hover": {transform: "scale(1.15)"}}}/>
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default BlogPostsPage;
