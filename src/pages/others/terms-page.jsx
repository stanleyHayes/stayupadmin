import Layout from "../../components/shared/layout.jsx";
import {Box, Button, Container, Divider, Paper, Stack, Typography} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const Section = ({title, children}) => (
    <Box sx={{mb: 3}}>
        <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{lineHeight: 1.8}}>
            {children}
        </Typography>
    </Box>
);

const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container maxWidth="md">
                    <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" sx={{mb: 3}}>Back</Button>

                    <Typography variant="h4" sx={{color: "text.secondary", mb: 1}}>Terms of Service</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                        Please read these terms carefully before using the Stay Up platform.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Last updated: January 1, 2024</Typography>

                    <Divider sx={{my: 4}}/>

                    <Paper elevation={0} sx={{p: 3}}>
                        <Stack spacing={0}>
                            <Section title="1. Acceptance of Terms">
                                By accessing and using the Stay Up platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
                            </Section>

                            <Section title="2. Use of the Platform">
                                The Stay Up admin dashboard is intended for authorized administrators only. You agree not to share your login credentials with unauthorized individuals. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
                            </Section>

                            <Section title="3. Products and Pricing">
                                All product listings, descriptions, and pricing are managed through the admin dashboard. Administrators are responsible for ensuring the accuracy of product information. Stay Up reserves the right to modify pricing and product availability at any time.
                            </Section>

                            <Section title="4. Orders and Payments">
                                Orders placed through the Stay Up store are subject to acceptance and availability. Payment is processed through our supported payment gateways. We reserve the right to refuse or cancel any order for reasons including fraud prevention, stock availability, or pricing errors.
                            </Section>

                            <Section title="5. Returns and Refunds">
                                Our return and refund policies are detailed separately and apply to all purchases. Refund requests are processed through the admin dashboard and are subject to review based on the circumstances of each case.
                            </Section>

                            <Section title="6. Intellectual Property">
                                All content on the Stay Up platform, including text, images, logos, and software, is the property of Stay Up and is protected by applicable intellectual property laws. Unauthorized reproduction or distribution is strictly prohibited.
                            </Section>

                            <Section title="7. Limitation of Liability">
                                Stay Up shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability shall not exceed the amount paid by the customer for the specific product or service in question.
                            </Section>

                            <Section title="8. Changes to Terms">
                                We reserve the right to update these terms at any time. Changes will be communicated through the admin dashboard and will take effect upon posting. Continued use of the platform after changes constitutes acceptance of the updated terms.
                            </Section>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default TermsPage;
