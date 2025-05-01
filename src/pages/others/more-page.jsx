import Layout from "../../components/shared/layout.jsx";
import {Avatar, Card, CardContent, Container, Divider, Stack, Typography} from "@mui/material";
import {
    Article,
    ArticleOutlined,
    ChevronRight,
    ContactPage,
    ContactPageOutlined,
    Edit,
    EditOutlined,
    Info,
    InfoOutlined,
    Lock,
    LockOutlined,
    Shield,
    ShieldOutlined
} from "@mui/icons-material";
import {Link, useLocation} from "react-router-dom";
import DropdownLink from "../../components/shared/dropdown-link.jsx";
import React from "react";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import {selectUI} from "../../redux/features/ui/ui-slice";

const MorePage = () => {

    const {user} = useSelector(selectAuth);
    const {theme} = useSelector(selectUI);
    const {pathname} = useLocation();
    return (
        <Layout>
            <Container maxWidth="sm" sx={{py: 1}}>
                <Stack
                    divider={<Divider variant="fullWidth" light={true}/>}
                    direction="column"
                    spacing={1}
                    sx={{padding: 1}}>
                    <Link to="/profile" style={{textDecoration: "none", display: "block", width: "100%"}}>
                        <Card
                            elevation={0}
                            sx={{
                                backgroundColor: theme === 'light' ? "rgba(255, 255, 255, 0.3)": "rgba(0, 0, 0, 0.3)",
                                backdropFilter: "blur(35px)",
                                borderRadius: 1.5
                            }}>
                            <CardContent>
                                <Stack
                                    sx={{width: "100%"}}
                                    justifyContent="space-between"
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}>
                                    <Stack
                                        justifyContent="center"
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}>
                                        <Avatar src={user.image} variant="circular" sx={{}}/>
                                        <Stack spacing={1}>
                                            <Typography
                                                variant="body2"
                                                sx={{color: "text.primary"}}>
                                                {`${user.firstName} ${user.lastName}`}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{color: "text.secondary", fontSize: 10}}>
                                                View Profile
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <ChevronRight sx={{color: "background.icon"}}/>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Link>
                    <DropdownLink
                        icon={
                            pathname === "/profile/update" ?
                                (
                                    <Edit
                                        sx={{
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.secondary",
                                            padding: 1,
                                            fontSize: 36,
                                        }}
                                        color="secondary"/>
                                ) :
                                (
                                    <EditOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 36,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.icon",
                                            color: "background.icon"
                                        }}/>
                                )
                        }
                        label="Update Profile"
                        path="/profile/update"
                    />
                    <DropdownLink
                        icon={
                            pathname === "/update-password" ?
                                (
                                    <Lock
                                        sx={{
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.secondary",
                                            padding: 1,
                                            fontSize: 36,
                                        }}
                                        color="secondary"/>
                                ) :
                                (
                                    <LockOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 36,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.icon",
                                            color: "background.icon"
                                        }}/>
                                )
                        }
                        label="Update Password" path="/update-password"/>
                    <DropdownLink
                        icon={
                            pathname === "/us" ?
                                (
                                    <Info
                                        sx={{
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.secondary",
                                            padding: 1,
                                            fontSize: 36,
                                        }}
                                        color="secondary"/>
                                ) :
                                (
                                    <InfoOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 36,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.icon",
                                            color: "background.icon"
                                        }}/>
                                )
                        }
                        label="About Us" path="/us"/>
                    <DropdownLink
                        icon={
                            pathname === "/contact" ?
                                (
                                    <ContactPage
                                        sx={{
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.secondary",
                                            padding: 1,
                                            fontSize: 36,
                                        }}
                                        color="secondary"/>
                                ) :
                                (
                                    <ContactPageOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 36,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.icon",
                                            color: "background.icon"
                                        }}/>
                                )
                        }
                        label="Contact Us" path="/contact"/>
                    <DropdownLink
                        icon={
                            pathname === "/terms" ?
                                (
                                    <Article
                                        sx={{
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.secondary",
                                            padding: 1,
                                            fontSize: 36,
                                        }}
                                        color="secondary"/>
                                ) :
                                (
                                    <ArticleOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 36,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.icon",
                                            color: "background.icon"
                                        }}/>
                                )
                        }
                        label="Terms" path="/terms"/>
                    <DropdownLink
                        icon={
                            pathname === "/privacy" ?
                                (
                                    <Shield
                                        sx={{
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.secondary",
                                            padding: 1,
                                            fontSize: 36,
                                        }}
                                        color="secondary"/>
                                ) :
                                (
                                    <ShieldOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 36,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '30%',
                                            borderColor: "light.icon",
                                            color: "background.icon"
                                        }}/>
                                )
                        }
                        label="Privacy" path="/privacy"/>
                </Stack>
            </Container>
        </Layout>
    )
}

export default MorePage;