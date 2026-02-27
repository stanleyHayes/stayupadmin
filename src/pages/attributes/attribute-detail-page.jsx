// src/pages/attributes/AttributeDetailPage.jsx
import React, { useEffect } from "react";
import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttribute, selectAttributes } from "../../redux/features/attributes/attributes-slice";
import Layout from "../../components/shared/layout.jsx";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";

const MetaRow = ({ label, value }) => (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 120 }}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const AttributeDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { attribute } = useSelector(selectAttributes);

    useEffect(() => {
        if (id) dispatch(fetchAttribute(id));
    }, [dispatch, id]);

    return (
        <Layout>
            <Container sx={{ py: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Attribute details</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button component={RouterLink} to={`/attributes`} variant="outlined" size="small">All attributes</Button>
                        <Button component={RouterLink} to={`/attributes/${id}/edit`} startIcon={<EditIcon />} variant="contained" color="secondary" size="small">Edit</Button>
                    </Stack>
                </Stack>

                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Card elevation={0}>
                            <CardHeader title={attribute?.name || "—"} subheader={attribute?.slug || "—"} />
                            <CardContent>
                                <MetaRow label="ID" value={attribute?.id} />
                                <MetaRow label="Type" value={attribute?.type} />
                                <MetaRow label="Order by" value={attribute?.order_by} />
                                <MetaRow label="Has archives" value={attribute?.has_archives ? "Yes" : "No"} />
                                <MetaRow label="Terms count" value={attribute?.terms_count ?? 0} />

                                {attribute?._links && (
                                    <>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Links</Typography>
                                        <Stack spacing={1}>
                                            {Object.keys(attribute._links).map((k) =>
                                                (attribute._links[k] || []).map((ln, i) => (
                                                    <Button key={`${k}-${i}`} startIcon={<LinkIcon />} size="small" href={ln.href} target="_blank" rel="noopener noreferrer" sx={{ justifyContent: "flex-start" }}>
                                                        {k} — {ln.href}
                                                    </Button>
                                                ))
                                            )}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 8 }}>
                        <Card elevation={0}>
                            <CardContent>
                                <Typography variant="subtitle1">Meta</Typography>
                                <MetaRow label="Created at" value={attribute?.created_at ? moment(attribute.created_at).format("LLL") : "—"} />
                                <MetaRow label="Updated at" value={attribute?.updated_at ? moment(attribute.updated_at).format("LLL") : "—"} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default AttributeDetailPage;
