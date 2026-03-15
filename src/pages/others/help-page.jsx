import Layout from "../../components/shared/layout.jsx";
import {Box, Button, Container, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import {
    ArrowBack,
    InventoryOutlined,
    ShoppingCartOutlined,
    PeopleOutline,
    BarChartOutlined,
    SettingsOutlined,
    SupportAgentOutlined
} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";

const HelpCard = ({icon, title, description, links, color = "secondary.main", bg = "light.secondary"}) => (
    <Paper elevation={0} sx={{p: 3, height: "100%"}}>
        <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 40, height: 40, borderRadius: 0,
                    backgroundColor: bg, color: color, flexShrink: 0
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{fontWeight: 600}}>{title}</Typography>
                    <Typography variant="caption" color="text.secondary">{description}</Typography>
                </Box>
            </Stack>
            <Divider/>
            <Stack spacing={1}>
                {links.map(({label, path}) => (
                    <Link key={path} to={path} style={{textDecoration: "none"}}>
                        <Typography variant="body2" sx={{color: "secondary.main", "&:hover": {textDecoration: "underline"}}}>
                            {label}
                        </Typography>
                    </Link>
                ))}
            </Stack>
        </Stack>
    </Paper>
);

const HelpPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container maxWidth="md">
                    <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" sx={{mb: 3}}>Back</Button>

                    <Typography variant="h4" sx={{color: "text.secondary", mb: 1}}>Help Center</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 4}}>
                        Quick guides to help you navigate the admin dashboard.
                    </Typography>

                    <Divider sx={{mb: 4}}/>

                    <Grid container spacing={3} sx={{mb: 4}}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <HelpCard
                                icon={<InventoryOutlined/>}
                                title="Managing Products"
                                description="Add, edit, and organize your inventory"
                                color="secondary.main"
                                bg="light.secondary"
                                links={[
                                    {label: "View all products", path: "/products"},
                                    {label: "Create a new product", path: "/product/new"},
                                    {label: "Manage categories", path: "/categories"},
                                    {label: "Manage attributes", path: "/attributes"}
                                ]}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <HelpCard
                                icon={<ShoppingCartOutlined/>}
                                title="Managing Orders"
                                description="Process, track, and fulfill orders"
                                color="text.blue"
                                bg="light.blue"
                                links={[
                                    {label: "View all orders", path: "/orders"},
                                    {label: "Create a new order", path: "/order/new"},
                                    {label: "Manage refunds", path: "/order-refunds"},
                                    {label: "View order notes", path: "/order-notes"}
                                ]}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <HelpCard
                                icon={<PeopleOutline/>}
                                title="Managing Customers"
                                description="View customers, subscribers, and messages"
                                color="text.green"
                                bg="light.green"
                                links={[
                                    {label: "View customers", path: "/customers"},
                                    {label: "View subscribers", path: "/subscribers"},
                                    {label: "View messages", path: "/messages"},
                                    {label: "Manage reviews", path: "/reviews"}
                                ]}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <HelpCard
                                icon={<BarChartOutlined/>}
                                title="Analytics & Reports"
                                description="Track performance and insights"
                                color="text.orange"
                                bg="light.orange"
                                links={[
                                    {label: "View analytics", path: "/analytics"},
                                    {label: "Dashboard overview", path: "/"},
                                ]}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <HelpCard
                                icon={<SettingsOutlined/>}
                                title="Configuration"
                                description="Set up payments, shipping, and taxes"
                                color="text.yellow"
                                bg="light.yellow"
                                links={[
                                    {label: "Payment gateways", path: "/payment-gateways"},
                                    {label: "Shipping methods", path: "/shipping-methods"},
                                    {label: "Tax rates", path: "/tax-rates"},
                                    {label: "Coupons", path: "/coupons"}
                                ]}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <HelpCard
                                icon={<SupportAgentOutlined/>}
                                title="Need More Help?"
                                description="Get in touch with the team"
                                color="text.red"
                                bg="light.red"
                                links={[
                                    {label: "Contact support", path: "/contact"},
                                    {label: "View FAQ", path: "/faq"},
                                    {label: "Settings", path: "/settings"}
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default HelpPage;
