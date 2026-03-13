import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderNotes, deleteOrderNote, selectOrderNotes} from "../../redux/features/order-notes/order-notes-slice";
import {SearchOutlined, VisibilityOutlined, DeleteForeverOutlined, Add} from "@mui/icons-material";
import moment from "moment";

const OrderNotesPage = () => {
    const dispatch = useDispatch();
    const {orderNotes, orderNoteLoading, orderNoteError} = useSelector(selectOrderNotes);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchOrderNotes()); }, [dispatch]);

    const handleSearch = () => dispatch(fetchOrderNotes({search: query}));
    const handleDelete = async (note) => {
        if (!window.confirm("Delete this order note? This cannot be undone.")) return;
        await dispatch(deleteOrderNote(note._id));
    };

    return (
        <Layout>
            {orderNoteLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderNoteError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderNoteError}</AlertTitle></Alert>}
                <Container>
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Order Notes</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Link to="/order-note/new" style={{textDecoration: "none"}}>
                                        <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined">Add Note</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 8}}>
                                    <Stack direction="row" spacing={1} sx={{backgroundColor: "background.paper", p: 1, borderRadius: 2}}>
                                        <TextField value={query} size="small" placeholder="Search notes..." onChange={e => setQuery(e.target.value)} variant="standard" slotProps={{ input: { disableUnderline: true } }} fullWidth/>
                                        <SearchOutlined onClick={handleSearch} sx={{cursor: "pointer", alignSelf: "center"}}/>
                                    </Stack>
                                </Grid>
                                <Grid size={{xs: 12, md: 4}}>
                                    <Button size="small" color="secondary" variant="outlined" fullWidth onClick={handleSearch}>Search</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 4}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>Content</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Author</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderNotes && orderNotes.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No order notes found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {orderNotes && orderNotes.map((note, i) => (
                                        <TableRow key={note._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Link to={`/orders/${note.order_id}`} style={{textDecoration: "none"}}>
                                                    <Typography variant="body2" color="secondary">#{note.order_id}</Typography>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                    {note.content}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={note.note_type || "order_note"} size="small" color={note.note_type === "customer_note" ? "info" : "default"}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{note.author || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{note.created_at ? moment(note.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Order Note">
                                                        <Link to={`/order-notes/${note._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Order Note">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(note)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
                                                        />
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

export default OrderNotesPage;
