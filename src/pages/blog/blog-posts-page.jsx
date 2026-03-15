import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, FormControl,
    Grid, InputLabel, LinearProgress, MenuItem, Paper, Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, deletePost, selectBlog} from "../../redux/features/blog/blog-slice";
import {
    VisibilityOutlined, DeleteForeverOutlined, EditOutlined,
    ArticleOutlined, PublishOutlined, DraftsOutlined, StarOutlined
} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";

const statusColor = (s) => s === "published" ? "success" : s === "draft" ? "warning" : "default";

const BlogPostsPage = () => {
    const dispatch = useDispatch();
    const {posts, postLoading, postError} = useSelector(selectBlog);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [tagFilter, setTagFilter] = useState("all");

    useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

    const filteredPosts = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return posts;
        return posts.filter(item =>
            [item.title, item.author, item.content, item.excerpt].join(" ").toLowerCase().includes(q)
        );
    }, [posts, query]);

    const handleStatusFilter = (e) => {
        const s = e.target.value;
        setStatusFilter(s);
        dispatch(fetchPosts({search: query, status: s, tag: tagFilter}));
    };
    const handleTagFilter = (e) => {
        const t = e.target.value;
        setTagFilter(t);
        dispatch(fetchPosts({search: query, status: statusFilter, tag: t}));
    };
    const handleDelete = async (post) => {
        if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
        await dispatch(deletePost(post._id));
    };

    const totalPosts = posts?.length || 0;
    const publishedCount = posts?.filter(p => p.status === "published").length || 0;
    const draftCount = posts?.filter(p => p.status === "draft").length || 0;
    const featuredCount = posts?.filter(p => p.featured).length || 0;
    const tags = [...new Set(posts?.map(p => p.tag).filter(Boolean) || [])];

    return (
        <Layout>
            {postLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {postError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{postError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Blog Posts"
                        subtitle="Manage your blog content and articles"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search posts..."
                        action={
                            <Link to="/blog/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Post</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    {/* KPI Stats */}
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Posts" value={totalPosts} icon={<ArticleOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={12}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Published" value={publishedCount} icon={<PublishOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green" trend={8}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Drafts" value={draftCount} icon={<DraftsOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Featured" value={featuredCount} icon={<StarOutlined fontSize="small"/>} iconColor="text.yellow" iconBg="light.yellow"/>
                        </Grid>
                    </Grid>

                    {/* Filters */}
                    <Grid spacing={2} container alignItems="center" justifyContent="flex-end" sx={{mb: 2}}>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <FormControl size="small" sx={{minWidth: 120}}>
                                <InputLabel>Status</InputLabel>
                                <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                    <MenuItem value="draft">Draft</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <FormControl size="small" sx={{minWidth: 120}}>
                                <InputLabel>Tag</InputLabel>
                                <Select value={tagFilter} onChange={handleTagFilter} label="Tag">
                                    <MenuItem value="all">All</MenuItem>
                                    {tags.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Divider sx={{my: 3}}/>

                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Author</TableCell>
                                        <TableCell>Tag</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPosts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No posts found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredPosts.map((post, i) => (
                                        <TableRow key={post._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {post.featured && <StarOutlined sx={{fontSize: 16, color: "text.yellow"}}/>}
                                                    <Typography variant="body2" sx={{maxWidth: 280}} noWrap>{post.title || "—"}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar src={post.author?.avatar} sx={{width: 24, height: 24}}/>
                                                    <Typography variant="body2">{post.author?.name || "—"}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={post.tag} size="small" variant="outlined" color="secondary"/>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={post.status} size="small" color={statusColor(post.status)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{post.created_at ? moment(post.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Post">
                                                        <Link to={`/blog/${post._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}/>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Post">
                                                        <Link to={`/blog/${post._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.blue", color: "icon.blue", backgroundColor: "light.blue", cursor: "pointer"}}/>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Post">
                                                        <DeleteForeverOutlined onClick={() => handleDelete(post)} sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}/>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default BlogPostsPage;
