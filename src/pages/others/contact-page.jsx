import Layout from "../../components/shared/layout.jsx";
import {Box, Button, Container, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import {ArrowBack, EmailOutlined, PhoneOutlined, LocationOnOutlined, AccessTimeOutlined} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const InfoCard = ({icon, title, lines, color = "secondary.main", bg = "light.secondary"}) => (
    <Paper elevation={0} sx={{p: 3, height: "100%"}}>
        <Stack spacing={2}>
            <Box sx={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 40, height: 40, borderRadius: 0,
                backgroundColor: bg, color: color
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 0.5}}>{title}</Typography>
                {lines.map((line, i) => (
                    <Typography key={i} variant="body2" color="text.secondary">{line}</Typography>
                ))}
            </Box>
        </Stack>
    </Paper>
);

const ContactPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container maxWidth="md">
                    <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" sx={{mb: 3}}>Back</Button>

                    <Typography variant="h4" sx={{color: "text.secondary", mb: 1}}>Contact Us</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 4}}>
                        Have questions or need support? Reach out to us through any of the channels below.
                    </Typography>

                    <Divider sx={{mb: 4}}/>

                    <Grid container spacing={3} sx={{mb: 4}}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <InfoCard
                                icon={<EmailOutlined/>}
                                title="Email"
                                lines={["support@stayup.com", "partnerships@stayup.com"]}
                                color="text.blue"
                                bg="light.blue"
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <InfoCard
                                icon={<PhoneOutlined/>}
                                title="Phone"
                                lines={["+233 (0) 24 000 0000", "+233 (0) 50 000 0000"]}
                                color="text.green"
                                bg="light.green"
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <InfoCard
                                icon={<LocationOnOutlined/>}
                                title="Address"
                                lines={["Stay Up HQ", "Accra, Ghana"]}
                                color="text.orange"
                                bg="light.orange"
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <InfoCard
                                icon={<AccessTimeOutlined/>}
                                title="Business Hours"
                                lines={["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM", "Sun: Closed"]}
                                color="secondary.main"
                                bg="light.secondary"
                            />
                        </Grid>
                    </Grid>

                    <Paper elevation={0} sx={{p: 3}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>Customer Messages</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                            Messages submitted through the contact form on the website can be viewed and managed from the admin dashboard.
                        </Typography>
                        <Button variant="outlined" color="secondary" size="small" onClick={() => navigate("/messages")}>
                            View Messages
                        </Button>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default ContactPage;
