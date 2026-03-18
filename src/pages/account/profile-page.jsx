import React from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid,
    Paper, Stack, Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/features/authentication/authentication-slice";
import {
    EditOutlined, LockOutlined, Verified, ArrowBack,
    EmailOutlined, PhoneOutlined, PersonOutlined,
    CalendarMonthOutlined, AdminPanelSettingsOutlined,
    BadgeOutlined
} from "@mui/icons-material";
import moment from "moment";

const InfoRow = ({ icon, label, value, isLink, href }) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1 }}>
        <Box sx={{
            width: 36, height: 36, borderRadius: 1, display: "flex",
            alignItems: "center", justifyContent: "center",
            backgroundColor: "background.default", flexShrink: 0
        }}>
            {React.cloneElement(icon, { sx: { fontSize: 18, color: "text.secondary" } })}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2, fontSize: 11 }}>{label}</Typography>
            {isLink ? (
                <Typography variant="body2" component="a" href={href} sx={{ color: "secondary.main", textDecoration: "none", fontWeight: 500 }}>
                    {value || "—"}
                </Typography>
            ) : (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{value || "—"}</Typography>
            )}
        </Box>
    </Stack>
);

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useSelector(selectAuth);

    const name = user?.display_name || user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.email || "Admin");
    const initials = user?.first_name && user?.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
        : name[0]?.toUpperCase() || "A";

    const roleLabel = (user?.role || "admin").replace(/_/g, " ");
    const statusColor = (user?.status || "").toLowerCase() === "active" ? "success" : (user?.status || "").toLowerCase() === "suspended" ? "error" : "warning";
    const memberDate = user?.date_created || user?.created_at;
    return (
        <Layout>
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="outlined" size="small" color="inherit">Back</Button>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>My Profile</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to="/profile/update" style={{ textDecoration: "none" }}>
                                <Button startIcon={<EditOutlined />} variant="contained" color="secondary" size="small">Edit Profile</Button>
                            </Link>
                            <Link to="/change-password" style={{ textDecoration: "none" }}>
                                <Button startIcon={<LockOutlined />} variant="outlined" color="secondary" size="small">Change Password</Button>
                            </Link>
                        </Stack>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ overflow: "hidden" }}>
                                <Box sx={{ background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", p: 3, pb: 5, textAlign: "center" }} />
                                <Box sx={{ px: 3, pb: 3, mt: -4, textAlign: "center" }}>
                                    <Avatar
                                        src={user?.avatar_url || user?.image}
                                        sx={{
                                            width: 80, height: 80, mx: "auto", mb: 1.5,
                                            fontSize: 28, fontWeight: 700,
                                            bgcolor: "secondary.main", color: "#fff",
                                            border: "4px solid", borderColor: "background.paper"
                                        }}>
                                        {initials}
                                    </Avatar>
                                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ mb: 0.5 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{name}</Typography>
                                        {user?.is_verified && <Verified sx={{ fontSize: 18, color: "#F59E0B" }} />}
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                        {user?.username ? `@${user.username}` : user?.email || ""}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Chip label={roleLabel} size="small" color="secondary" sx={{ fontWeight: 600, textTransform: "capitalize" }} />
                                        <Chip label={user?.status || "Active"} size="small" color={statusColor} sx={{ fontWeight: 600, textTransform: "capitalize" }} />
                                    </Stack>
                                </Box>
                            </Paper>

                            <Paper elevation={0} sx={{ mt: 2, p: 0, overflow: "hidden" }}>
                                <Stack divider={<Divider />}>
                                    {[
                                        { gradient: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", icon: <Verified />, label: "Verification", value: user?.is_verified ? "Verified" : "Unverified" },
                                        { gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", icon: <AdminPanelSettingsOutlined />, label: "Account Status", value: user?.status || "Active" },
                                        { gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", icon: <CalendarMonthOutlined />, label: "Member For", value: memberDate ? moment(memberDate).fromNow(true) : "—" },
                                    ].map((item, i) => (
                                        <Stack key={i} direction="row" spacing={2} alignItems="center" sx={{ px: 2.5, py: 2 }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: 1, background: item.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                {React.cloneElement(item.icon, { sx: { fontSize: 20, color: "#fff" } })}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>{item.label}</Typography>
                                                <Typography sx={{ fontFamily: "'GoogleSans', sans-serif", fontWeight: 700, fontSize: 16, lineHeight: 1.3, color: "text.primary", textTransform: "capitalize" }}>
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, md: 8 }}>
                            <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary", textTransform: "uppercase", fontSize: 11, letterSpacing: 1 }}>
                                    Personal Information
                                </Typography>
                                <InfoRow icon={<PersonOutlined />} label="Full Name" value={name} />
                                <Divider sx={{ my: 0.5 }} />
                                <InfoRow icon={<EmailOutlined />} label="Email Address" value={user?.email} isLink href={`mailto:${user?.email}`} />
                                <Divider sx={{ my: 0.5 }} />
                                <InfoRow icon={<PhoneOutlined />} label="Phone Number" value={user?.phone} isLink href={`tel:${user?.phone}`} />
                                <Divider sx={{ my: 0.5 }} />
                                <InfoRow icon={<BadgeOutlined />} label="Username" value={user?.username ? `@${user.username}` : "—"} />
                            </Paper>

                            <Paper elevation={0} sx={{ p: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary", textTransform: "uppercase", fontSize: 11, letterSpacing: 1 }}>
                                    Role & Access
                                </Typography>
                                <InfoRow icon={<AdminPanelSettingsOutlined />} label="Role" value={roleLabel} />
                                <Divider sx={{ my: 0.5 }} />
                                <InfoRow icon={<Verified />} label="Verification Status" value={user?.is_verified ? "Verified" : "Not Verified"} />
                                <Divider sx={{ my: 0.5 }} />
                                <InfoRow icon={<CalendarMonthOutlined />} label="Member Since" value={memberDate ? moment(memberDate).format("MMMM D, YYYY") : "—"} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ProfilePage;
