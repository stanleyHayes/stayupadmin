import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTaxClasses, createTaxClass, deleteTaxClass, selectTaxClasses} from "../../redux/features/tax-classes/tax-classes-slice";
import {DeleteForeverOutlined, Add} from "@mui/icons-material";

const TaxClassesPage = () => {
    const dispatch = useDispatch();
    const {taxClasses, taxClassLoading, taxClassError} = useSelector(selectTaxClasses);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => { dispatch(fetchTaxClasses()); }, [dispatch]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        const result = await dispatch(createTaxClass({name: newName.trim()}));
        if (!result.error) {
            setNewName("");
            setShowForm(false);
        }
    };

    const handleDelete = async (tc) => {
        if (!window.confirm(`Delete tax class "${tc.name}"? This cannot be undone.`)) return;
        await dispatch(deleteTaxClass(tc._id));
    };

    return (
        <Layout>
            {taxClassLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {taxClassError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{taxClassError}</AlertTitle></Alert>}
                <Container>
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Typography variant="h4" sx={{color: "text.secondary"}}>Tax Classes</Typography>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined" onClick={() => setShowForm(v => !v)}>
                                {showForm ? "Cancel" : "Add Tax Class"}
                            </Button>
                        </Grid>
                    </Grid>

                    {showForm && (
                        <Paper elevation={0} sx={{p: 3, mt: 3}}>
                            <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>New Tax Class</Typography>
                            <form onSubmit={handleAdd}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TextField
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        label="Class Name" size="small" required sx={{minWidth: 250}}
                                    />
                                    <Button type="submit" variant="contained" color="secondary" size="small" disabled={taxClassLoading}>Add Class</Button>
                                </Stack>
                            </form>
                        </Paper>
                    )}

                    <Divider sx={{my: 4}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Slug</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taxClasses && taxClasses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <Typography variant="body2" color="text.secondary" align="center">No tax classes found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {taxClasses && taxClasses.map((tc, i) => (
                                        <TableRow key={tc._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell><Typography variant="body2">{tc.name}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{tc.slug || "—"}</Typography></TableCell>
                                            <TableCell>
                                                <Tooltip title="Delete Tax Class">
                                                    <DeleteForeverOutlined
                                                        onClick={() => handleDelete(tc)}
                                                        sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "100%", borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
                                                    />
                                                </Tooltip>
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

export default TaxClassesPage;
