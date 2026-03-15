import React, { useState } from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Alert, Box, Button, Chip, Container, Divider, Grid, Paper,
    Stack, Typography,
} from "@mui/material";
import {
    AutorenewOutlined,
    CancelOutlined,
    CheckCircleOutlined,
    EmailOutlined,
    LocalShippingOutlined,
    PrintOutlined,
    ReceiptOutlined,
    RefreshOutlined,
} from "@mui/icons-material";

const ACTION_GROUPS = [
    {
        title: "Status Updates",
        description: "Change the status of selected orders in bulk.",
        color: "text.blue",
        bg: "light.blue",
        icon: <AutorenewOutlined fontSize="small" />,
        actions: [
            {
                label: "Mark as Processing",
                description: "Move pending orders into the processing queue.",
                icon: <AutorenewOutlined />,
                color: "secondary",
                badge: "processing",
                badgeColor: { color: "text.pending", bg: "light.pending" },
            },
            {
                label: "Mark as Completed",
                description: "Set orders to completed — typically after fulfilment.",
                icon: <CheckCircleOutlined />,
                color: "secondary",
                badge: "completed",
                badgeColor: { color: "text.active", bg: "light.active" },
            },
            {
                label: "Mark as Cancelled",
                description: "Cancel orders and trigger stock restoration.",
                icon: <CancelOutlined />,
                color: "error",
                badge: "cancelled",
                badgeColor: { color: "text.red", bg: "light.red" },
            },
        ],
    },
    {
        title: "Shipping & Fulfilment",
        description: "Actions related to order dispatch and tracking.",
        color: "text.green",
        bg: "light.green",
        icon: <LocalShippingOutlined fontSize="small" />,
        actions: [
            {
                label: "Generate Shipping Labels",
                description: "Create printable shipping labels for selected orders.",
                icon: <PrintOutlined />,
                color: "secondary",
            },
            {
                label: "Mark as Shipped",
                description: "Update status to shipped and notify customers.",
                icon: <LocalShippingOutlined />,
                color: "secondary",
                badge: "shipped",
                badgeColor: { color: "text.active", bg: "light.active" },
            },
        ],
    },
    {
        title: "Communication",
        description: "Send emails or notifications related to orders.",
        color: "text.yellow",
        bg: "light.yellow",
        icon: <EmailOutlined fontSize="small" />,
        actions: [
            {
                label: "Send Order Confirmation",
                description: "Re-send the order confirmation email to customers.",
                icon: <EmailOutlined />,
                color: "secondary",
            },
            {
                label: "Send Tracking Info",
                description: "Email tracking numbers and dispatch details to customers.",
                icon: <EmailOutlined />,
                color: "secondary",
            },
        ],
    },
    {
        title: "Documents",
        description: "Generate and export order documents.",
        color: "text.orange",
        bg: "light.orange",
        icon: <ReceiptOutlined fontSize="small" />,
        actions: [
            {
                label: "Export to CSV",
                description: "Download selected orders as a CSV spreadsheet.",
                icon: <ReceiptOutlined />,
                color: "secondary",
            },
            {
                label: "Print Invoices",
                description: "Generate printable invoices for selected orders.",
                icon: <PrintOutlined />,
                color: "secondary",
            },
        ],
    },
];

const iconBox = (color, bg) => ({
    width: 36,
    height: 36,
    borderRadius: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg,
    color: color,
    flexShrink: 0,
});

const OrderActionsPage = () => {
    const [runAlert, setRunAlert] = useState(null);

    const handleRun = (label) => {
        setRunAlert(label);
        setTimeout(() => setRunAlert(null), 3000);
    };

    return (
        <Layout>
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={2}>
                            <Box>
                                <Typography variant="h4" sx={{ color: "text.heading", mb: 0.5 }}>Order Actions</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Bulk operations and automated actions for managing orders.
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                startIcon={<RefreshOutlined fontSize="small" />}
                            >
                                Refresh
                            </Button>
                        </Stack>
                    </Box>

                    {runAlert && (
                        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setRunAlert(null)}>
                            <strong>{runAlert}</strong> — action queued. Select orders to apply this to them.
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {ACTION_GROUPS.map((group) => (
                            <Grid key={group.title} size={{ xs: 12, md: 6 }}>
                                <Paper elevation={0} sx={{ overflow: "hidden", height: "100%" }}>
                                    {/* Group header */}
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 3, py: 2.5 }}>
                                        <Box sx={iconBox(group.color, group.bg)}>
                                            {group.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2">{group.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">{group.description}</Typography>
                                        </Box>
                                    </Stack>
                                    <Divider />

                                    {/* Action rows */}
                                    <Stack divider={<Divider />} sx={{ px: 3, py: 1 }}>
                                        {group.actions.map((action) => (
                                            <Stack
                                                key={action.label}
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                spacing={2}
                                                sx={{ py: 1.5 }}
                                            >
                                                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {action.label}
                                                        </Typography>
                                                        {action.badge && (
                                                            <Chip
                                                                label={action.badge}
                                                                size="small"
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: "0.68rem",
                                                                    fontWeight: 500,
                                                                    color: action.badgeColor?.color,
                                                                    backgroundColor: action.badgeColor?.bg,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {action.description}
                                                    </Typography>
                                                </Stack>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color={action.color}
                                                    sx={{ flexShrink: 0 }}
                                                    onClick={() => handleRun(action.label)}
                                                >
                                                    Run
                                                </Button>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                            <Box sx={iconBox("text.blue", "light.blue")}>
                                <AutorenewOutlined fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2">How to use bulk actions</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Navigate to the Orders page, select the orders you want to act on using the checkboxes,
                                    then return here and run an action. Actions will be applied only to your selected orders.
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default OrderActionsPage;
