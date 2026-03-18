import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, CardMedia, Chip, Container, Divider,
    Grid, LinearProgress, Paper, Stack, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchCollections, deleteCollection, selectCollections} from "../../redux/features/collections/collections-slice";
import {VisibilityOutlined, EditOutlined, DeleteForeverOutlined, CollectionsOutlined, ImageNotSupported} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import {CardGridSkeleton} from "../../components/shared/page-skeleton.jsx";

const CollectionsPage = () => {
    const dispatch = useDispatch();
    const {collections, collectionLoading, collectionError} = useSelector(selectCollections);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchCollections()); }, [dispatch]);

    const filtered = useMemo(() => {
        if (!Array.isArray(collections)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return collections;
        return collections.filter(c => [c.name, c.description, c.slug].join(" ").toLowerCase().includes(q));
    }, [collections, query]);

    const handleDelete = (col) => {
        if (!window.confirm(`Delete collection "${col.name}"?`)) return;
        dispatch(deleteCollection(col._id ?? col.id));
    };

    const colImage = (c) => {
        if (!c.image) return null;
        return typeof c.image === "object" ? (c.image.secure_url || c.image.url || c.image.src) : c.image;
    };

    if (collectionLoading && (!collections || collections.length === 0)) return <Layout><Box sx={{pt: 4, pb: 6}}><CardGridSkeleton cards={4}/></Box></Layout>;

    return (
        <Layout>
            {collectionLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {collectionError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{collectionError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Collections"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search collections..."
                        action={
                            <Link to="/collection/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">New Collection</Button>
                            </Link>
                        }
                    />
                    <Divider sx={{my: 3}}/>

                    {filtered.length === 0 ? (
                        <Paper elevation={0} sx={{p: 6, textAlign: "center"}}>
                            <CollectionsOutlined sx={{fontSize: 48, color: "action.disabled", mb: 1}}/>
                            <Typography variant="body2" color="text.secondary">No collections found</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {filtered.map((col) => {
                                const img = colImage(col);
                                const productCount = col.products?.length || 0;
                                return (
                                    <Grid key={col._id || col.id} size={{xs: 12, sm: 6, lg: 3}}>
                                        <Paper elevation={0} sx={{
                                            overflow: "hidden", height: "100%", display: "flex", flexDirection: "column",
                                            transition: "all 0.2s", "&:hover": {borderColor: "secondary.main", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)"}
                                        }}>
                                            <Link to={`/collections/${col._id || col.id}`} style={{textDecoration: "none"}}>
                                                <Box sx={{position: "relative", height: 200, backgroundColor: "background.alternative"}}>
                                                    {img ? (
                                                        <Box component="img" src={img} alt={col.name} sx={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}/>
                                                    ) : (
                                                        <Box sx={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                            <ImageNotSupported sx={{fontSize: 40, color: "action.disabled"}}/>
                                                        </Box>
                                                    )}
                                                    <Stack direction="row" spacing={0.5} sx={{position: "absolute", top: 10, left: 10}}>
                                                        {col.featured && <Chip label="Featured" size="small" color="warning" sx={{height: 22, fontSize: 10, fontWeight: 600}}/>}
                                                        {!col.is_active && <Chip label="Inactive" size="small" color="default" sx={{height: 22, fontSize: 10}}/>}
                                                    </Stack>
                                                    <Chip label={`${productCount} product${productCount !== 1 ? "s" : ""}`} size="small" sx={{
                                                        position: "absolute", bottom: 10, right: 10, height: 22, fontSize: 10,
                                                        backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", fontWeight: 600
                                                    }}/>
                                                </Box>
                                            </Link>

                                            <Box sx={{p: 2.5, flex: 1, display: "flex", flexDirection: "column"}}>
                                                <Link to={`/collections/${col._id || col.id}`} style={{textDecoration: "none", color: "inherit"}}>
                                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 0.5}}>{col.name}</Typography>
                                                </Link>
                                                {col.slug && <Typography variant="caption" color="text.muted" sx={{fontFamily: "monospace", mb: 1}}>/{col.slug}</Typography>}
                                                {col.description && (
                                                    <Typography variant="caption" color="text.secondary" sx={{
                                                        mb: 2, lineHeight: 1.5, flex: 1,
                                                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                    }}>{col.description}</Typography>
                                                )}
                                                <Divider sx={{my: 1}}/>
                                                <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                                                    <Tooltip title="View"><Link to={`/collections/${col._id || col.id}`}><VisibilityOutlined sx={{fontSize: 20, color: "icon.green", cursor: "pointer"}}/></Link></Tooltip>
                                                    <Tooltip title="Edit"><Link to={`/collections/${col._id || col.id}/update`}><EditOutlined sx={{fontSize: 20, color: "secondary.main", cursor: "pointer"}}/></Link></Tooltip>
                                                    <Tooltip title="Delete"><DeleteForeverOutlined onClick={() => handleDelete(col)} sx={{fontSize: 20, color: "icon.red", cursor: "pointer"}}/></Tooltip>
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

export default CollectionsPage;
