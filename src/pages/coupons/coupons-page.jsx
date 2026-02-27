// src/pages/attributes/CouponsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Grid,
    IconButton,
    Tooltip,
    Chip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { motion } from "framer-motion";
import { Close, SearchOutlined, Visibility, Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../../components/shared/empty.jsx";

// Redux slice exports (expected)
import {
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    selectCoupons
} from "../../redux/features/coupons/coupons-slice";

// Dialog components (must exist at these paths)
import CreateCouponDialog from "../../components/dialogs/create-coupon-dialog.jsx";
import UpdateCouponDialog from "../../components/dialogs/update-coupon-dialog.jsx";
import ViewCouponDialog from "../../components/dialogs/view-coupon-detail-dialog.jsx";

const CouponsPage = () => {
    const dispatch = useDispatch();
    const { coupons = [], couponLoading = false, couponError = null } = useSelector(selectCoupons);

    // UI state
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(moment().startOf("day"));
    const [endDate, setEndDate] = useState(moment().endOf("day"));

    // Dialog state
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    // Fetch attributes on mount
    useEffect(() => {
        //dispatch(fetchCoupons());
    }, [dispatch]);

    // Filtered list (client-side)
    const filteredCoupons = useMemo(() => {
        if (!Array.isArray(coupons)) return [];
        const q = (query || "").trim().toLowerCase();

        return coupons.filter(c => {
            // status filter (supports DELETED via is_deleted)
            if (status !== "all") {
                if (status === "DELETED" && !c.is_deleted) return false;
                if (status !== "DELETED" && status !== (c.status || "ACTIVE")) {
                    // fallback: allow show active if not deleted
                    if (!(status === "ACTIVE" && !c.is_deleted)) return false;
                }
            }
            // date filter (use created_at or date_expires)
            const dateToCheck = c.created_at || c.date_expires || null;
            if (dateToCheck) {
                const d = moment(dateToCheck);
                if (startDate && d.isBefore(moment(startDate).startOf("day"))) return false;
                if (endDate && d.isAfter(moment(endDate).endOf("day"))) return false;
            }
            // query search across code, description, emails
            if (!q) return true;
            const haystack = [
                c.code,
                c.description,
                (c.included_emails || []).join(" "),
                (c.amount != null ? String(c.amount) : "")
            ].join(" ").toLowerCase();
            return haystack.includes(q);
        });
    }, [coupons, query, status, startDate, endDate]);

    // Dialog handlers
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const handleOpenView = (coupon) => {
        setSelectedCoupon(coupon);
        setOpenView(true);
    };
    const handleCloseView = () => {
        setSelectedCoupon(null);
        setOpenView(false);
    };

    const handleOpenEdit = (coupon) => {
        setSelectedCoupon(coupon);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setSelectedCoupon(null);
        setOpenEdit(false);
    };

    // CRUD operations (dispatch thunks)
    const handleCreate = (payload) => {
        dispatch(createCoupon(payload));
        setOpenCreate(false);
    };

    const handleUpdate = ({ id, data }) => {
        dispatch(updateCoupon({ id, data }));
        setOpenEdit(false);
        setSelectedCoupon(null);
    };

    const handleDelete = (coupon) => {
        if (!window.confirm(`Delete coupon "${coupon.code}"?`)) return;
        dispatch(deleteCoupon(coupon._id ?? coupon.id ?? coupon.code));
    };

    const renderEmails = (arr) => {
        if (!arr || arr.length === 0) return <Typography variant="body2" color="text.secondary">—</Typography>;
        return arr.map((e, i) => <Chip key={i} size="small" label={e} sx={{ mr: 0.5, mb: 0.5 }} />);
    };

    return (
        <Layout>
            {couponLoading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 8 }}>
                {couponError && (
                    <Alert severity="error" variant="standard">
                        <AlertTitle>{couponError}</AlertTitle>
                    </Alert>
                )}

                <Container>
                    <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item size={{ xs: 12, md: "auto" }}>
                                    <Typography variant="h4" sx={{ color: "text.secondary" }}>Coupons</Typography>
                                </Grid>
                                <Grid item size={{ xs: 12, md: "auto" }}>
                                    <Button
                                        sx={{ textTransform: "capitalize", borderWidth: 2 }}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        onClick={handleOpenCreate}
                                        fullWidth
                                    >
                                        Create Coupon
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item size={{ xs: 12, md: "auto" }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item size={{ xs: 12, md: 8 }}>
                                    <Stack
                                        divider={<Divider sx={{ color: "light.secondary", backgroundColor: "light.secondary" }} flexItem variant="inset" light orientation="vertical" />}
                                        sx={{ backgroundColor: "background.paper", borderRadius: 3, padding: 1, px: 2 }}
                                        spacing={2}
                                        alignItems="center"
                                        direction="row"
                                    >
                                        <TextField
                                            value={query}
                                            size="small"
                                            onChange={e => setQuery(e.target.value)}
                                            fullWidth
                                            variant="standard"
                                            type="text"
                                            placeholder="Search attributes by code, description, email..."
                                            InputProps={{ disableUnderline: true }}
                                        />
                                        <SearchOutlined sx={{ color: "background.icon" }} color="secondary" />
                                    </Stack>
                                </Grid>

                                <Grid item size={{ xs: 12, md: 4 }}>
                                    <Button sx={{ textTransform: "capitalize", borderWidth: 2 }} size="small" color="secondary" variant="outlined" fullWidth onClick={() => {}}>
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{ my: 4 }} />

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <DatePicker
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                value={startDate}
                                onChange={date => setStartDate(moment(date))}
                                label="Start Date"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <DatePicker
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                value={endDate}
                                onChange={date => setEndDate(moment(date))}
                                label="End Date"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Status</InputLabel>
                                <Select onChange={e => setStatus(e.target.value)} value={status} fullWidth size="small" label="Status" variant="outlined">
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="DELETED">Deleted</MenuItem>
                                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                sx={{ textTransform: "capitalize", borderWidth: 2 }}
                                size="small"
                                color="secondary"
                                variant="outlined"
                                fullWidth
                                onClick={() => { setQuery(""); setStatus("all"); setStartDate(moment().startOf("day")); setEndDate(moment().endOf("day")); }}
                            >
                                Reset Filters
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{ my: 4 }} />

                    {Array.isArray(coupons) && coupons.length === 0 ? (
                        <Box>
                            <Empty
                                icon={
                                    <Box component={motion.div} exit={{}}>
                                        <Close
                                            sx={{
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: "30%",
                                                borderColor: "light.secondary",
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                                cursor: "pointer"
                                            }}
                                        />
                                    </Box>
                                }
                                title="Coupons"
                                message="No attributes available"
                                button={
                                    <Button sx={{ textTransform: "capitalize", borderWidth: 2 }} size="small" color="secondary" variant="outlined" onClick={handleOpenCreate}>
                                        Create Coupon
                                    </Button>
                                }
                            />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} variant="elevation">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Expires</TableCell>
                                        <TableCell>Usage Count</TableCell>
                                        <TableCell>Emails</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filteredCoupons.map((c, idx) => (
                                        <TableRow hover key={c._id ?? c.id ?? idx}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2">{c.code}</Typography>
                                                <Typography variant="caption" color="text.secondary">{c.description}</Typography>
                                            </TableCell>
                                            <TableCell>{c.amount != null ? c.amount : "—"}</TableCell>
                                            <TableCell>{c.discount_type ?? "fixed_cart"}</TableCell>
                                            <TableCell>{c.date_expires ? moment(c.date_expires).format("YYYY-MM-DD") : "—"}</TableCell>
                                            <TableCell>{c.usage_count ?? 0}</TableCell>
                                            <TableCell>{renderEmails(c.included_emails)}</TableCell>
                                            <TableCell>
                                                <Tooltip title="View"><IconButton size="small" onClick={() => handleOpenView(c)}><Visibility /></IconButton></Tooltip>
                                                <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenEdit(c)}><Edit /></IconButton></Tooltip>
                                                <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(c)}><Delete /></IconButton></Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>

                {/* Dialogs */}
                <CreateCouponDialog open={openCreate} onClose={handleCloseCreate} onCreate={handleCreate} />
                <UpdateCouponDialog open={openEdit} coupon={selectedCoupon} onClose={handleCloseEdit} onUpdate={handleUpdate} />
                <ViewCouponDialog open={openView} coupon={selectedCoupon} onClose={handleCloseView} />
            </Box>
        </Layout>
    );
};

export default CouponsPage;
