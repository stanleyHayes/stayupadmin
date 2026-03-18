import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderNotes, deleteOrderNote, selectOrderNotes} from "../../redux/features/order-notes/order-notes-slice";
import {VisibilityOutlined, DeleteForeverOutlined, NotesOutlined, NoteAddOutlined, PersonOutlined, TodayOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import moment from "moment";
import KPIBox from "../../components/shared/kpi-box.jsx";
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

const OrderNotesPage = () => {
    const dispatch = useDispatch();
    const {orderNotes, orderNoteLoading, orderNoteError} = useSelector(selectOrderNotes);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchOrderNotes()); }, [dispatch]);

    const filteredNotes = useMemo(() => {
        if (!Array.isArray(orderNotes)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return orderNotes;
        return orderNotes.filter(item => {
            const authorStr = item.author_name || (typeof item.author === "object" ? (item.author?.name || item.author?.first_name || "") : "") || item.added_by || "";
            const orderStr = typeof item.order_id === "object" ? (item.order_id?.number || "") : (item.order_id || "");
            return [item.content, item.note, authorStr, orderStr].join(" ").toLowerCase().includes(q);
        });
    }, [orderNotes, query]);

    const handleDelete = async (note) => {
        if (!window.confirm("Delete this order note? This cannot be undone.")) return;
        await dispatch(deleteOrderNote(note._id));
    };

    if (orderNoteLoading && orderNotes.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={7}/></Box></Layout>;

    return (
        <Layout>
            {orderNoteLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderNoteError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderNoteError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Order Notes"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search notes..."
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Notes" value={orderNotes?.length || 0} icon={<NotesOutlined/>} iconColor="secondary" iconBg="secondary" trend={6}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Customer Notes" value={orderNotes?.filter(n => n.customer_note).length || 0} icon={<PersonOutlined/>} iconColor="text.blue" iconBg="light.blue" trend={4}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Private Notes" value={orderNotes?.filter(n => !n.customer_note).length || 0} icon={<NoteAddOutlined/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Recent (This Week)" value={orderNotes?.filter(n => n.created_at && new Date(n.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length || 0} icon={<TodayOutlined/>} iconColor="text.green" iconBg="light.green" trend={15}/>
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
                                    {filteredNotes.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No order notes found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredNotes.map((note, i) => {
                                        const orderId = typeof note.order_id === "object" ? (note.order_id?._id || note.order_id?.id) : note.order_id;
                                        const orderNum = typeof note.order_id === "object" ? (note.order_id?.number || orderId) : note.order_id;
                                        const author = note.author_name
                                            || (typeof note.author === "object" ? (note.author?.display_name || note.author?.name || (note.author?.first_name ? `${note.author.first_name} ${note.author.last_name || ""}`.trim() : note.author?.email || null)) : null)
                                            || note.added_by || "—";
                                        return (
                                        <TableRow key={note._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Link to={`/orders/${orderId}`} style={{textDecoration: "none"}}>
                                                    <Typography variant="body2" color="secondary">#{orderNum}</Typography>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                    {typeof note.content === "string" ? note.content : "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={note.note_type || "order_note"} size="small" color={note.note_type === "customer_note" ? "info" : "default"}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{author}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{note.created_at ? moment(note.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Order Note">
                                                        <Link to={`/order-notes/${note._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Order Note">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(note)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );})}
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
