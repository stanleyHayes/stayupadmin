// src/pages/categories/CategoriesPage.jsx
import React, {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
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
import {CategoryOutlined, FolderOutlined, SubdirectoryArrowRightOutlined, VisibilityOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
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
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

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
        dispatch(fetchCategories());
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

    if (categoryLoading && categories.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={6}/></Box></Layout>;

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
                    <PageHeader
                        title="Categories"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search categories..."
                        action={
                            <Link to="/category/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Category</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Categories" value={categories?.length || 0} icon={<CategoryOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={8}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={categories?.filter(c => !c.is_deleted).length || 0} icon={<FolderOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green" trend={5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Top Level" value={categories?.filter(c => c.parent === 0 || !c.parent).length || 0} icon={<SubdirectoryArrowRightOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Displayed" value={categories?.filter(c => c.display !== "hidden").length || 0} icon={<VisibilityOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
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
