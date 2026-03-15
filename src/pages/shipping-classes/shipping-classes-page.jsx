import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchShippingClasses, createShippingClass, deleteShippingClass, selectShippingClasses} from "../../redux/features/shipping-classes/shipping-classes-slice";
import {DeleteForeverOutlined, LocalShippingOutlined, CategoryOutlined, AttachMoneyOutlined} from "@mui/icons-material";
import KPIBox from "../../components/shared/kpi-box.jsx";

const ShippingClassesPage = () => {
    const dispatch = useDispatch();
    const {shippingClasses, shippingClassLoading, shippingClassError} = useSelector(selectShippingClasses);
    const [form, setForm] = useState({name: "", slug: "", description: ""});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { dispatch(fetchShippingClasses()); }, [dispatch]);

    const handleChange = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}));

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        const result = await dispatch(createShippingClass({...form}));
        if (!result.error) {
            setForm({name: "", slug: "", description: ""});
            setShowForm(false);
        }
    };

    const handleDelete = async (sc) => {
        if (!window.confirm(`Delete shipping class "${sc.name}"? This cannot be undone.`)) return;
        await dispatch(deleteShippingClass(sc._id));
    };

    return (
        <Layout>
            {shippingClassLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {shippingClassError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{shippingClassError}</AlertTitle></Alert>}
                <Container>
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Typography variant="h4" sx={{color: "text.secondary"}}>Shipping Classes</Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Button size="small" color="secondary" variant="outlined" onClick={() => setShowForm(v => !v)}>
                                {showForm ? "Cancel" : "Add Shipping Class"}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Total Classes" value={shippingClasses?.length || 0} icon={<LocalShippingOutlined/>} iconColor="secondary" iconBg="secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="With Description" value={shippingClasses?.filter(s => s.description).length || 0} icon={<CategoryOutlined/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Active" value={shippingClasses?.length || 0} icon={<AttachMoneyOutlined/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 4}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Slug</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Products</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shippingClasses && shippingClasses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body2" color="text.secondary" align="center">No shipping classes found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {shippingClasses && shippingClasses.map((sc, i) => (
                                        <TableRow key={sc._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell><Typography variant="body2">{sc.name}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{sc.slug || "—"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary" sx={{maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{sc.description || "—"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2">{sc.count ?? 0}</Typography></TableCell>
                                            <TableCell>
                                                <Tooltip title={`Delete ${sc.name}`}>
                                                    <DeleteForeverOutlined
                                                        onClick={() => handleDelete(sc)}
                                                        sx={{
                                                            padding: 0.4,
                                                            fontSize: 28,
                                                            borderWidth: 1,
                                                            borderStyle: "solid",
                                                            borderRadius: 0,
                                                            borderColor: "light.red",
                                                            color: "text.red",
                                                            backgroundColor: "light.red",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {showForm && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <form onSubmit={handleAdd}>
                                                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{py: 1}}>
                                                        <TextField name="name" label="Name" value={form.name} onChange={handleChange} size="small" required sx={{minWidth: 180}}/>
                                                        <TextField name="slug" label="Slug" value={form.slug} onChange={handleChange} size="small" sx={{minWidth: 140}}/>
                                                        <TextField name="description" label="Description" value={form.description} onChange={handleChange} size="small" sx={{minWidth: 220}}/>
                                                        <Button type="submit" variant="contained" color="secondary" size="small" disabled={shippingClassLoading}>Add</Button>
                                                        <Button variant="outlined" size="small" onClick={() => setShowForm(false)}>Cancel</Button>
                                                    </Stack>
                                                </form>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default ShippingClassesPage;
