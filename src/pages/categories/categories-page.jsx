// src/pages/categories/CategoriesPage.jsx
import React, {useEffect, useMemo, useState} from "react";
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
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {SearchOutlined} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import Category from "../../components/shared/category.jsx";

// Redux slice (place your thunks and selector in this file)
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    selectCategories
} from "../../redux/features/categories/categories-slice";
import CreateCategoryDialog from "../../components/dialogs/create-category-dialog.jsx";
import UpdateCategoryDialog from "../../components/dialogs/update-category-dialog.jsx";
import ViewCategoryDialog from "../../components/dialogs/view-category-dialog.jsx";

// Dialogs (place these files under src/components/categories/)

const CategoriesPage = () => {
    const dispatch = useDispatch();
    const {categories = [], categoryLoading = false, categoryError = null} = useSelector(selectCategories);

    // UI filters
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Dialog state
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        //dispatch(fetchCategories());
    }, [dispatch]);

    // client-side filtered list
    const filteredCategories = useMemo(() => {
        if (!Array.isArray(categories)) return [];
        const q = (query || "").trim().toLowerCase();
        return categories.filter(cat => {
            // status filter (allow DELETED via is_deleted)
            if (status !== "all") {
                if (status === "DELETED" && !cat.is_deleted) return false;
                if (status !== "DELETED" && status !== (cat.status || "ACTIVE")) {
                    if (!(status === "ACTIVE" && !cat.is_deleted)) return false;
                }
            }
            // date filter (created_at fallback)
            const dateToCheck = cat.created_at || cat.updated_at || null;
            if (dateToCheck) {
                const d = moment(dateToCheck);
                if (startDate && d.isBefore(moment(startDate).startOf("day"))) return false;
                if (endDate && d.isAfter(moment(endDate).endOf("day"))) return false;
            }
            if (!q) return true;
            const haystack = [
                cat.name,
                cat.slug,
                cat.description,
                (cat.meta && JSON.stringify(cat.meta)) || ""
            ].join(" ").toLowerCase();
            return haystack.includes(q);
        });
    }, [categories, query, status, startDate, endDate]);

    // Dialog handlers
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const handleOpenView = (category) => {
        setSelectedCategory(category);
        setOpenView(true);
    };
    const handleCloseView = () => {
        setSelectedCategory(null);
        setOpenView(false);
    };

    const handleOpenEdit = (category) => {
        setSelectedCategory(category);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setSelectedCategory(null);
        setOpenEdit(false);
    };

    // CRUD operations
    const handleCreate = (payload) => {
        dispatch(createCategory(payload));
        setOpenCreate(false);
    };

    const handleUpdate = ({id, data}) => {
        dispatch(updateCategory({id, data}));
        setOpenEdit(false);
        setSelectedCategory(null);
    };

    const handleDelete = (category) => {
        if (!window.confirm(`Delete category "${category.name}"?`)) return;
        dispatch(deleteCategory(category._id ?? category.id ?? category.slug));
    };

    return (
        <Layout>
            {categoryLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {categoryError && (
                    <Alert severity="error" sx={{mb: 2}}>
                        <AlertTitle>{categoryError}</AlertTitle>
                    </Alert>
                )}

                <Container>
                    <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Categories</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Button onClick={handleOpenCreate} size="small"
                                            color="secondary" variant="outlined" fullWidth>
                                        Add Category
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 6}}>
                                    <Stack
                                        divider={<Divider
                                            sx={{color: "light.secondary", backgroundColor: "light.secondary"}} flexItem
                                            variant="inset" light orientation="vertical"/>}
                                        sx={{backgroundColor: "background.paper", borderRadius: 3, padding: 1, px: 2}}
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
                                            placeholder="Search categories..."
                                            slotProps={{ input: { disableUnderline: true } }}
                                        />
                                        <SearchOutlined sx={{color: "background.icon"}} color="secondary"/>
                                    </Stack>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Button size="small"
                                            color="secondary" variant="outlined" fullWidth>
                                        Search Category
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{xs: 12, md: 3}}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    slotProps={{textField: {size: "small", fullWidth: true}}}
                                    value={startDate}
                                    onChange={date => setStartDate(moment(date))}
                                    disableFuture
                                    label="Start Date"
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid size={{xs: 12, md: 3}}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    slotProps={{textField: {size: "small", fullWidth: true}}}
                                    value={endDate}
                                    onChange={date => setEndDate(moment(date))}
                                    disableFuture
                                    label="End Date"
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid size={{xs: 12, md: 3}}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Status</InputLabel>
                                <Select onChange={e => setStatus(e.target.value)} value={status} fullWidth size="small"
                                        label="Status" variant="outlined">
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="DELETED">Deleted</MenuItem>
                                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{xs: 12, md: 3}}>
                            <Button size="small" color="secondary"
                                    variant="outlined" fullWidth>
                                Filter
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Slug</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Products</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography variant="body2" color="text.secondary" align="center">No categories found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCategories.map((category, index) => (
                                    <React.Fragment key={category._id ?? category.id ?? index}>
                                        <Category
                                            index={index}
                                            category={category}
                                            categories={categories}
                                            onView={() => handleOpenView(category)}
                                            onEdit={() => handleOpenEdit(category)}
                                            onDelete={() => handleDelete(category)}/>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>

                {/* Dialogs */}
                <CreateCategoryDialog open={openCreate} onClose={handleCloseCreate} onCreate={handleCreate}/>
                <UpdateCategoryDialog
                    open={openEdit}
                    category={selectedCategory}
                    onClose={handleCloseEdit}
                    onUpdate={handleUpdate}
                />
                <ViewCategoryDialog open={openView} category={selectedCategory} onClose={handleCloseView}/>
            </Box>
        </Layout>
    );
};

export default CategoriesPage;
