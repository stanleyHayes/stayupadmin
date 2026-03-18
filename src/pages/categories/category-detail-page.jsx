import React from "react";
import {
    Box, Button, Chip, Container, Divider, Grid, LinearProgress,
    Paper, Stack, Typography, Alert, AlertTitle
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {deleteCategory, selectCategories} from "../../redux/features/categories/categories-slice";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2" component="div">{value ?? "—"}</Typography>
    </Box>
);

const CategoryDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {categoryID} = useParams();
    const {categories, categoryLoading, categoryError} = useSelector(selectCategories);
    const category = categories?.find(c => (c._id || c.id) === categoryID) || null;

    const handleDelete = async () => {
        if (!window.confirm(`Delete category "${category?.name}"? This cannot be undone.`)) return;
        await dispatch(deleteCategory(categoryID));
        navigate("/categories");
    };

    const c = category || {};

    return (
        <Layout>
            {categoryLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {categoryError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{categoryError}</AlertTitle></Alert>}
                {!category && !categoryLoading && (
                    <Alert severity="warning" sx={{mb: 2}}><AlertTitle>Category not found</AlertTitle></Alert>
                )}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Category Details</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/categories/${categoryID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete} disabled={!category}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                <CategoryIcon sx={{fontSize: 56, color: "secondary.main", mb: 1}}/>
                                <Typography variant="h6" sx={{mb: 0.5}}>{c.name || "—"}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>/{c.slug || "—"}</Typography>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    {c.status && <Chip label={c.status} size="small" color={c.status === "ACTIVE" ? "success" : c.status === "PENDING" ? "warning" : "default"}/>}
                                    {c.published !== undefined && <Chip label={c.published ? "Published" : "Draft"} size="small" variant="outlined"/>}
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Category Information</Typography>
                                <InfoRow label="Name" value={c.name}/>
                                <InfoRow label="Slug" value={c.slug}/>
                                <InfoRow label="Description" value={c.description}/>
                                <InfoRow label="Parent" value={c.parent || "None (Top Level)"}/>
                                <InfoRow label="Product count" value={String(c.count ?? c.product_count ?? 0)}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>SEO</Typography>
                                <InfoRow label="SEO title" value={c.meta?.seo_title}/>
                                <InfoRow label="SEO description" value={c.meta?.seo_description}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Timestamps</Typography>
                                <InfoRow label="Created" value={c.created_at ? moment(c.created_at).format("LLL") : null}/>
                                <InfoRow label="Updated" value={c.updated_at ? moment(c.updated_at).format("LLL") : null}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default CategoryDetailPage;
