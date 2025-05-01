import {Avatar, Divider, Menu, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import {
    Article, ArticleOutlined,
    ContactPage,
    ContactPageOutlined,
    Edit,
    EditOutlined, Info,
    InfoOutlined,
    KeyboardArrowDown, Lock,
    LockOutlined, Shield, ShieldOutlined
} from "@mui/icons-material";
import React, {useState} from "react";
import DropdownLink from "./dropdown-link.jsx";
import {Link, useLocation} from "react-router-dom";

const ProfileDropdown = () => {
    const {user} = useSelector(selectAuth);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState(null);
    const {pathname} = useLocation();

    const handleMenuClose = () => {
        setMenuOpen(false);
        setAnchorElement(null);
    }

    const handleMenuOpen = event => {
        setMenuOpen(true);
        setAnchorElement(event.currentTarget);
    }

    return (
        <React.Fragment>
            <Stack
                direction="row" alignItems="center" spacing={2}>
                <Avatar src={user.image} variant="circular" sx={{}}/>
                <Stack>
                    <Typography
                        variant="body2"
                        sx={{color: "text.primary"}}>
                        {`${user.firstName} ${user.lastName}`}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{color: "secondary.main", fontWeight: 500, fontSize: 10}}>
                        @{user.username}
                    </Typography>
                </Stack>
                <KeyboardArrowDown sx={{cursor: "pointer", color: "background.icon"}} onClick={handleMenuOpen}/>
            </Stack>
            <Menu
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.35)",
                    backdropFilter: "blur(5px)"
                }}
                anchorEl={anchorElement}
                anchorOrigin={{horizontal: "left", vertical: "top"}}
                onClose={handleMenuClose}
                open={menuOpen}
                variant="menu">
                <Stack
                    divider={<Divider variant="fullWidth" light={true}/>}
                    direction="column"
                    spacing={1}
                    sx={{padding: 1}}>
                    <Link to="/profile" style={{textDecoration: "none", display: "block", width: "100%"}}>
                        <Stack direction="row" alignItems="center" spacing={2}>
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
                    </Link>
                    <DropdownLink
                        icon={
                            pathname === "/profile/update" ?
                                (
                                    <Edit
                                        sx={{
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.default",
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
                                            borderRadius: '100%',
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
                                            borderRadius: '100%',
                                            borderColor: "light.default",
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
                                            borderRadius: '100%',
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
                                            borderRadius: '100%',
                                            borderColor: "light.default",
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
                                            borderRadius: '100%',
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
                                            borderRadius: '100%',
                                            borderColor: "light.default",
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
                                            borderRadius: '100%',
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
                                            borderRadius: '100%',
                                            borderColor: "light.default",
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
                                            borderRadius: '100%',
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
                                            borderRadius: '100%',
                                            borderColor: "light.default",
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
                                            borderRadius: '100%',
                                            borderColor: "light.icon",
                                            color: "background.icon"
                                        }}
                                    />
                                )
                        }
                        label="Privacy" path="/privacy"/>
                </Stack>
            </Menu>
        </React.Fragment>
    )
}

export default ProfileDropdown;