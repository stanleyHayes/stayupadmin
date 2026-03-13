import React, { useState, useMemo } from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Box, Button, Chip, Container, Divider, Grid, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip, Typography,
} from "@mui/material";
import {
    DeleteForeverOutlined, EditOutlined, SearchOutlined, TuneOutlined,
} from "@mui/icons-material";

const SEED_VARIATIONS = [
    { id: "var_001", name: "Color", slug: "color", options: ["Black", "White", "Navy", "Grey", "Red"], product_count: 48, status: "ACTIVE" },
    { id: "var_002", name: "Size", slug: "size", options: ["XS", "S", "M", "L", "XL", "XXL"], product_count: 62, status: "ACTIVE" },
    { id: "var_003", name: "Storage", slug: "storage", options: ["64GB", "128GB", "256GB", "512GB", "1TB"], product_count: 19, status: "ACTIVE" },
    { id: "var_004", name: "RAM", slug: "ram", options: ["4GB", "8GB", "16GB", "32GB"], product_count: 14, status: "ACTIVE" },
    { id: "var_005", name: "Material", slug: "material", options: ["Cotton", "Polyester", "Leather", "Wool", "Silk"], product_count: 31, status: "ACTIVE" },
    { id: "var_006", name: "Weight", slug: "weight", options: ["250g", "500g", "1kg", "2kg", "5kg"], product_count: 11, status: "PENDING" },
    { id: "var_007", name: "Connectivity", slug: "connectivity", options: ["Bluetooth", "USB-C", "Lightning", "3.5mm", "Wireless"], product_count: 8, status: "ACTIVE" },
    { id: "var_008", name: "Screen Size", slug: "screen-size", options: ["5.5\"", "6.1\"", "6.7\"", "13\"", "15\"", "17\""], product_count: 22, status: "ACTIVE" },
    { id: "var_009", name: "Scent", slug: "scent", options: ["Lavender", "Vanilla", "Citrus", "Unscented"], product_count: 5, status: "PENDING" },
    { id: "var_010", name: "Legacy Option", slug: "legacy-option", options: ["Option A", "Option B"], product_count: 0, status: "SUSPENDED" },
];

const statusColor = (status) => {
    switch ((status || "").toUpperCase()) {
        case "ACTIVE":    return { color: "text.active",    bg: "light.active" };
        case "PENDING":   return { color: "text.pending",   bg: "light.pending" };
        case "SUSPENDED": return { color: "text.suspended", bg: "light.failed" };
        default:          return { color: "text.secondary", bg: "light.grey" };
    }
};

const actionIcon = (colorKey, bgKey) => ({
    padding: 0.4,
    fontSize: 28,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: "25%",
    borderColor: bgKey,
    color: colorKey,
    backgroundColor: bgKey,
    cursor: "pointer",
});

const VariationsPage = () => {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return SEED_VARIATIONS;
        return SEED_VARIATIONS.filter(v =>
            v.name.toLowerCase().includes(q) ||
            v.slug.toLowerCase().includes(q) ||
            v.options.some(o => o.toLowerCase().includes(q))
        );
    }, [query]);

    return (
        <Layout>
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    {/* Header */}
                    <Grid container spacing={3} alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, md: "auto" }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                                <Box>
                                    <Typography variant="h4" sx={{ color: "text.heading" }}>Variations</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Manage product variation types and their options.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: "auto" }}>
                            <Stack direction="row" spacing={1.5}>
                                <Button size="small" color="secondary" variant="outlined" startIcon={<TuneOutlined fontSize="small" />}>
                                    Add Variation
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Search bar */}
                    <Paper elevation={0} sx={{ mb: 3, px: 2, py: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
                        <SearchOutlined sx={{ color: "text.muted", fontSize: 20 }} />
                        <TextField
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            variant="standard"
                            placeholder="Search by name, slug, or option value…"
                            fullWidth
                            size="small"
                            slotProps={{ input: { disableUnderline: true } }}
                        />
                    </Paper>

                    {/* Table */}
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Slug</TableCell>
                                    <TableCell>Options</TableCell>
                                    <TableCell>Products</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                No variations found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((v, index) => {
                                    const sc = statusColor(v.status);
                                    return (
                                        <TableRow key={v.id}>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{index + 1}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{v.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{v.slug}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ maxWidth: 280 }}>
                                                    {v.options.slice(0, 4).map(opt => (
                                                        <Chip
                                                            key={opt}
                                                            label={opt}
                                                            size="small"
                                                            sx={{ fontSize: "0.7rem", height: 20 }}
                                                        />
                                                    ))}
                                                    {v.options.length > 4 && (
                                                        <Chip
                                                            label={`+${v.options.length - 4}`}
                                                            size="small"
                                                            sx={{ fontSize: "0.7rem", height: 20, color: "text.secondary" }}
                                                        />
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{v.product_count}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={v.status.toLowerCase()}
                                                    sx={{ color: sc.color, backgroundColor: sc.bg, fontWeight: 500, fontSize: "0.75rem" }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title={`Edit ${v.name}`}>
                                                        <EditOutlined sx={actionIcon("secondary.main", "light.secondary")} />
                                                    </Tooltip>
                                                    <Tooltip title={`Delete ${v.name}`}>
                                                        <DeleteForeverOutlined sx={actionIcon("text.red", "light.red")} />
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="caption" color="text.muted">
                        {filtered.length} of {SEED_VARIATIONS.length} variation types
                    </Typography>
                </Container>
            </Box>
        </Layout>
    );
};

export default VariationsPage;
