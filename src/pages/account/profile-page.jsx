import React from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid,
    Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import {
    EditOutlined, LockOutlined, Verified, ArrowBack,
    EmailOutlined, PhoneOutlined, PersonOutlined,
    CalendarMonthOutlined, AdminPanelSettingsOutlined,
    BadgeOutlined
} from "@mui/icons-material";
import moment from "moment";

const InfoRow = ({icon, label, value, isLink, href}) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{py: 1}}>
        <Box sx={{
            width: 36, height: 36, borderRadius: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            backgroundColor: "background.default", flexShrink: 0
        }}>
            {React.cloneElement(icon, {sx: {fontSize: 18, color: "text.secondary"}})}
        </Box>
        <Box sx={{flex: 1, minWidth: 0}}>
            <Typography variant="caption" color="text.secondary" sx={{display: "block", lineHeight: 1.2, fontSize: 11}}>{label}</Typography>
            {isLink ? (
                <Typography variant="body2" component="a" href={href} sx={{color: "secondary.main", textDecoration: "none", fontWeight: 500}}>
                    {value || "—"}
                </Typography>
            ) : (
                <Typography variant="body2" sx={{fontWeight: 500}}>{value || "—"}</Typography>
            )}
        </Box>
    </Stack>
);

const ProfilePage = () => {
    const navigate = useNavigate();
    const {user} = useSelector(selectAuth);

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : "AD";

    const roleLabel = (user?.role || "admin").replace(/_/g, " ");
    const statusColor = user?.status === "ACTIVE" ? "success" : user?.status === "SUSPENDED" ? "error" : "warning";

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" color="inherit">Back</Button>
                            <Typography variant="h5" sx={{fontWeight: 700}}>My Profile</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to="/profile/update" style={{textDecoration: "none"}}>
                                <Button startIcon={<EditOutlined/>} variant="contained" color="secondary" size="small">Edit Profile</Button>
                            </Link>
                            <Link to="/change-password" style={{textDecoration: "none"}}>
                                <Button startIcon={<LockOutlined/>} variant="outlined" color="secondary" size="small">Change Password</Button>
                            </Link>
                        </Stack>
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    <Grid container spacing={3}>
                        {/* Profile Card */}
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{overflow: "hidden"}}>
                                {/* Header Banner */}
                                <Box sx={{
                                    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                    p: 3, pb: 5, textAlign: "center"
                                }}/>
                                <Box sx={{px: 3, pb: 3, mt: -4, textAlign: "center"}}>
                                    <Avatar
                                        src={user?.image}
                                        sx={{
                                            width: 80, height: 80, mx: "auto", mb: 1.5,
                                            fontSize: 28, fontWeight: 700,
                                            bgcolor: "secondary.main", color: "#fff",
                                            border: "4px solid", borderColor: "background.paper"
                                        }}>
                                        {initials}
                                    </Avatar>
                                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{mb: 0.5}}>
                                        <Typography variant="h6" sx={{fontWeight: 700}}>{user?.firstName} {user?.lastName}</Typography>
                                        {user?.is_verified && <Verified sx={{fontSize: 18, color: "#F59E0B"}}/>}
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1.5}}>@{user?.username}</Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Chip
                                            label={roleLabel}
                                            size="small"
                                            color="secondary"
                                            sx={{fontWeight: 600, textTransform: "capitalize"}}
                                        />
                                        <Chip
                                            label={user?.status || "Active"}
                                            size="small"
                                            color={statusColor}
                                            sx={{fontWeight: 600}}
                                        />
                                    </Stack>
                                </Box>
                            </Paper>

                            {/* Quick Stats */}
                            <Paper elevation={0} sx={{mt: 2, p: 0, overflow: "hidden"}}>
                                <Stack divider={<Divider/>}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{px: 2.5, py: 2}}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 0,
                                            background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                        }}>
                                            <Verified sx={{fontSize: 20, color: "#fff"}}/>
                                        </Box>
                                        <Box sx={{flex: 1}}>
                                            <Typography variant="caption" color="text.secondary" sx={{fontSize: 11}}>Verification</Typography>
                                            <Typography sx={{fontFamily: "'Inconsolata', monospace", fontWeight: 700, fontSize: 16, lineHeight: 1.3, color: "text.primary"}}>
                                                {user?.is_verified ? "Verified" : "Unverified"}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{px: 2.5, py: 2}}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 0,
                                            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                        }}>
                                            <AdminPanelSettingsOutlined sx={{fontSize: 20, color: "#fff"}}/>
                                        </Box>
                                        <Box sx={{flex: 1}}>
                                            <Typography variant="caption" color="text.secondary" sx={{fontSize: 11}}>Account Status</Typography>
                                            <Typography sx={{fontFamily: "'Inconsolata', monospace", fontWeight: 700, fontSize: 16, lineHeight: 1.3, color: "text.primary"}}>
                                                {user?.status || "Active"}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{px: 2.5, py: 2}}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 0,
                                            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                        }}>
                                            <CalendarMonthOutlined sx={{fontSize: 20, color: "#fff"}}/>
                                        </Box>
                                        <Box sx={{flex: 1}}>
                                            <Typography variant="caption" color="text.secondary" sx={{fontSize: 11}}>Member For</Typography>
                                            <Typography sx={{fontFamily: "'Inconsolata', monospace", fontWeight: 700, fontSize: 16, lineHeight: 1.3, color: "text.primary"}}>
                                                {user?.created_at ? moment(user.created_at).fromNow(true) : "—"}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Details */}
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 600, mb: 1.5, color: "text.secondary",
                                    textTransform: "uppercase", fontSize: 11, letterSpacing: 1
                                }}>
                                    Personal Information
                                </Typography>
                                <InfoRow icon={<PersonOutlined/>} label="Full Name" value={`${user?.firstName} ${user?.lastName}`}/>
                                <Divider sx={{my: 0.5}}/>
                                <InfoRow icon={<EmailOutlined/>} label="Email Address" value={user?.email} isLink href={`mailto:${user?.email}`}/>
                                <Divider sx={{my: 0.5}}/>
                                <InfoRow icon={<PhoneOutlined/>} label="Phone Number" value={user?.phone} isLink href={`tel:${user?.phone}`}/>
                                <Divider sx={{my: 0.5}}/>
                                <InfoRow icon={<BadgeOutlined/>} label="Username" value={`@${user?.username}`}/>
                            </Paper>

                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 600, mb: 1.5, color: "text.secondary",
                                    textTransform: "uppercase", fontSize: 11, letterSpacing: 1
                                }}>
                                    Role & Access
                                </Typography>
                                <InfoRow icon={<AdminPanelSettingsOutlined/>} label="Role" value={roleLabel}/>
                                <Divider sx={{my: 0.5}}/>
                                <InfoRow icon={<Verified/>} label="Verification Status" value={user?.is_verified ? "Verified" : "Not Verified"}/>
                                <Divider sx={{my: 0.5}}/>
                                <InfoRow icon={<CalendarMonthOutlined/>} label="Member Since" value={user?.created_at ? moment(user.created_at).format("MMMM D, YYYY") : "—"}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ProfilePage;
