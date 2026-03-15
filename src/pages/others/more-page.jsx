import Layout from "../../components/shared/layout.jsx";
import {Avatar, Box, Card, CardContent, Container, Divider, Paper, Stack, Typography} from "@mui/material";
import {
    ChevronRight,
    EditOutlined,
    LockOutlined,
    InfoOutlined,
    ContactPageOutlined,
    ArticleOutlined,
    ShieldOutlined,
    SettingsOutlined,
    HelpOutlineOutlined,
    QuizOutlined,
    LogoutOutlined
} from "@mui/icons-material";
import {Link} from "react-router-dom";
import React from "react";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import {selectUI} from "../../redux/features/ui/ui-slice";

const MoreLink = ({icon, label, path, color = "icon.default", bg = "light.default"}) => (
    <Link to={path} style={{textDecoration: "none", display: "block"}}>
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                py: 1.5,
                px: 1,
                borderRadius: 0,
                "&:hover": {backgroundColor: "light.secondary", transition: "all 200ms ease-out"}
            }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 0,
                    backgroundColor: bg,
                    color: color
                }}>
                    {icon}
                </Box>
                <Typography variant="body2" sx={{color: "text.primary", fontSize: 13, fontWeight: 500}}>
                    {label}
                </Typography>
            </Stack>
            <ChevronRight sx={{color: "icon.default", fontSize: 18}}/>
        </Stack>
    </Link>
);

const SectionLabel = ({children}) => (
    <Typography variant="overline" sx={{color: "text.secondary", fontSize: 10, fontWeight: 600, px: 1, pt: 2, pb: 0.5, display: "block"}}>
        {children}
    </Typography>
);

const MorePage = () => {
    const {user} = useSelector(selectAuth);
    const {theme} = useSelector(selectUI);

    return (
        <Layout>
            <Container maxWidth="sm" sx={{py: 3}}>
                <Stack direction="column" spacing={2.5}>

                    {/* Profile Card */}
                    <Link to="/profile" style={{textDecoration: "none"}}>
                        <Card
                            elevation={0}
                            sx={{
                                backgroundColor: theme === "light" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                                backdropFilter: "blur(35px)",
                                borderRadius: 3
                            }}>
                            <CardContent sx={{py: 2.5}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar src={user.image} variant="circular" sx={{width: 44, height: 44}}/>
                                        <Stack spacing={0.25}>
                                            <Typography variant="body2" sx={{color: "text.primary", fontWeight: 600}}>
                                                {`${user.firstName} ${user.lastName}`}
                                            </Typography>
                                            <Typography variant="caption" sx={{color: "text.secondary", fontSize: 11}}>
                                                View Profile
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <ChevronRight sx={{color: "icon.default", fontSize: 20}}/>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Account Section */}
                    <Paper elevation={0} sx={{borderRadius: 0, overflow: "hidden"}}>
                        <SectionLabel>Account</SectionLabel>
                        <Box sx={{px: 1.5, pb: 1.5}}>
                            <MoreLink
                                icon={<EditOutlined fontSize="small"/>}
                                label="Update Profile"
                                path="/profile/update"
                                color="text.blue"
                                bg="light.blue"
                            />
                            <MoreLink
                                icon={<LockOutlined fontSize="small"/>}
                                label="Change Password"
                                path="/change-password"
                                color="text.orange"
                                bg="light.orange"
                            />
                            <MoreLink
                                icon={<SettingsOutlined fontSize="small"/>}
                                label="Settings"
                                path="/settings"
                                color="secondary.main"
                                bg="light.secondary"
                            />
                        </Box>
                    </Paper>

                    {/* Support Section */}
                    <Paper elevation={0} sx={{borderRadius: 0, overflow: "hidden"}}>
                        <SectionLabel>Support</SectionLabel>
                        <Box sx={{px: 1.5, pb: 1.5}}>
                            <MoreLink
                                icon={<HelpOutlineOutlined fontSize="small"/>}
                                label="Help Center"
                                path="/help"
                                color="text.green"
                                bg="light.green"
                            />
                            <MoreLink
                                icon={<QuizOutlined fontSize="small"/>}
                                label="FAQ"
                                path="/faq"
                                color="text.yellow"
                                bg="light.yellow"
                            />
                            <MoreLink
                                icon={<ContactPageOutlined fontSize="small"/>}
                                label="Contact Us"
                                path="/contact"
                                color="text.blue"
                                bg="light.blue"
                            />
                        </Box>
                    </Paper>

                    {/* Legal Section */}
                    <Paper elevation={0} sx={{borderRadius: 0, overflow: "hidden"}}>
                        <SectionLabel>Legal</SectionLabel>
                        <Box sx={{px: 1.5, pb: 1.5}}>
                            <MoreLink
                                icon={<InfoOutlined fontSize="small"/>}
                                label="About Us"
                                path="/us"
                                color="secondary.main"
                                bg="light.secondary"
                            />
                            <MoreLink
                                icon={<ArticleOutlined fontSize="small"/>}
                                label="Terms of Service"
                                path="/terms"
                                color="text.secondary"
                                bg="light.default"
                            />
                            <MoreLink
                                icon={<ShieldOutlined fontSize="small"/>}
                                label="Privacy Policy"
                                path="/privacy"
                                color="text.orange"
                                bg="light.orange"
                            />
                        </Box>
                    </Paper>

                    {/* Logout */}
                    <Paper elevation={0} sx={{borderRadius: 0, overflow: "hidden"}}>
                        <Box sx={{px: 1.5, py: 1}}>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{py: 1.5, px: 1, cursor: "pointer", borderRadius: 0, "&:hover": {backgroundColor: "light.red"}}}>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 36,
                                    height: 36,
                                    borderRadius: 0,
                                    backgroundColor: "light.red",
                                    color: "text.red"
                                }}>
                                    <LogoutOutlined fontSize="small"/>
                                </Box>
                                <Typography variant="body2" sx={{color: "text.red", fontSize: 13, fontWeight: 500}}>
                                    Logout
                                </Typography>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Version */}
                    <Typography variant="caption" align="center" sx={{color: "text.secondary", pt: 1, pb: 3, display: "block"}}>
                        Stay Up Admin v1.0.0
                    </Typography>
                </Stack>
            </Container>
        </Layout>
    );
};

export default MorePage;
