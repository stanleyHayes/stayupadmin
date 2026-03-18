import Layout from "../../components/shared/layout.jsx";
import {Box, Button, Container, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import {ArrowBack, StorefrontOutlined, GroupsOutlined, PublicOutlined} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const AboutUsPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container maxWidth="md">
                    <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" sx={{mb: 3}}>Back</Button>

                    <Typography variant="h4" sx={{color: "text.secondary", mb: 1}}>About Us</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 4}}>
                        Learn more about Stay Up and our mission.
                    </Typography>

                    <Divider sx={{mb: 4}}/>

                    <Grid container spacing={3} sx={{mb: 4}}>
                        {[
                            {icon: <StorefrontOutlined/>, title: "Our Story", color: "secondary.main", bg: "light.secondary", text: "Stay Up was founded with the vision of making quality fashion accessible to everyone. We believe that style should not be limited by budget, and we are committed to offering curated collections that blend contemporary trends with timeless appeal."},
                            {icon: <GroupsOutlined/>, title: "Our Team", color: "text.blue", bg: "light.blue", text: "Our team is a diverse group of fashion enthusiasts, technologists, and creatives who work together to bring you the best shopping experience. From product curation to customer service, every team member plays a vital role."},
                            {icon: <PublicOutlined/>, title: "Our Mission", color: "text.green", bg: "light.green", text: "We aim to empower individuals through fashion by providing high-quality products, exceptional customer service, and a seamless online shopping experience. We are committed to sustainability and ethical sourcing in every step of our supply chain."}
                        ].map(({icon, title, color, bg, text}) => (
                            <Grid size={{xs: 12}} key={title}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            width: 40, height: 40, borderRadius: 1,
                                            backgroundColor: bg, color: color, flexShrink: 0
                                        }}>
                                            {icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>{title}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{lineHeight: 1.7}}>
                                                {text}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Paper elevation={0} sx={{p: 3}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>What We Value</Typography>
                        <Stack spacing={1.5}>
                            {[
                                {label: "Quality First", desc: "Every product is carefully vetted to meet our quality standards before it reaches your wardrobe."},
                                {label: "Customer-Centric", desc: "Your satisfaction drives every decision we make, from product selection to delivery experience."},
                                {label: "Sustainability", desc: "We are actively working to reduce our environmental footprint through eco-friendly packaging and ethical partnerships."},
                                {label: "Community", desc: "We believe in building a community of style-conscious individuals who inspire and uplift each other."}
                            ].map(({label, desc}) => (
                                <Box key={label}>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>{label}</Typography>
                                    <Typography variant="body2" color="text.secondary">{desc}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default AboutUsPage;
