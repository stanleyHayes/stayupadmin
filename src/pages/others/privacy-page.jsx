import Layout from "../../components/shared/layout.jsx";
import {Box, Button, Container, Divider, Paper, Stack, Typography} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const Section = ({title, children}) => (
    <Box sx={{mb: 3}}>
        <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{lineHeight: 1.8}} component="div">
            {children}
        </Typography>
    </Box>
);

const PrivacyPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container maxWidth="md">
                    <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" sx={{mb: 3}}>Back</Button>

                    <Typography variant="h4" sx={{color: "text.secondary", mb: 1}}>Privacy Policy</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                        Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Last updated: January 1, 2024</Typography>

                    <Divider sx={{my: 4}}/>

                    <Paper elevation={0} sx={{p: 3}}>
                        <Stack spacing={0}>
                            <Section title="1. Information We Collect">
                                We collect information that you provide directly to us, including your name, email address, phone number, shipping address, and payment details. We also collect information automatically through cookies, device identifiers, and usage analytics when you interact with our platform.
                            </Section>

                            <Section title="2. How We Use Your Information">
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>We use the information we collect to:</Typography>
                                    <Stack spacing={0.5} sx={{pl: 2}}>
                                        {[
                                            "Process and fulfill your orders",
                                            "Communicate with you about your account and orders",
                                            "Send promotional materials and newsletters (with your consent)",
                                            "Improve our platform and user experience",
                                            "Prevent fraud and ensure security",
                                            "Comply with legal obligations"
                                        ].map((item, i) => (
                                            <Typography key={i} variant="body2" color="text.secondary">
                                                {`\u2022 ${item}`}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            </Section>

                            <Section title="3. Data Sharing">
                                We do not sell your personal information to third parties. We may share your data with trusted service providers who assist in operating our platform, processing payments, and delivering orders. All third parties are required to maintain the confidentiality of your information.
                            </Section>

                            <Section title="4. Data Security">
                                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
                            </Section>

                            <Section title="5. Cookies">
                                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
                            </Section>

                            <Section title="6. Your Rights">
                                You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by unsubscribing from our newsletter or contacting our support team.
                            </Section>

                            <Section title="7. Data Retention">
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. When your data is no longer needed, we will securely delete or anonymize it.
                            </Section>

                            <Section title="8. Changes to This Policy">
                                We may update this privacy policy from time to time. We will notify you of any significant changes through the platform or via email. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                            </Section>

                            <Section title="9. Contact">
                                If you have any questions or concerns about this privacy policy, please contact us at privacy@stayup.com.
                            </Section>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default PrivacyPage;
