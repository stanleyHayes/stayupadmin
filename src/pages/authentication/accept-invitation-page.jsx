import React, {useEffect, useState} from "react";
import {
    Alert, Box, Button, CardMedia, Chip, Container, Divider,
    Stack, TextField, Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../redux/features/authentication/authentication-slice";
import {fetchInvitation, selectInvitations as selectInvitation} from "../../redux/features/invitations/invitations-slice";
import {VisibilityOffOutlined, VisibilityOutlined, BadgeOutlined, CheckCircleOutline} from "@mui/icons-material";
import logo from "../../assets/images/logo/logo_image.png";
import {motion} from "framer-motion";
import moment from "moment";

const AcceptInvitationPage = () => {
    const {token: urlToken} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {invitation, invitationLoading} = useSelector(selectInvitation);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [manualToken, setManualToken] = useState("");
    const isRedeemMode = urlToken === "redeem" || !urlToken;
    const activeToken = isRedeemMode ? null : urlToken;

    useEffect(() => {
        if (activeToken) dispatch(fetchInvitation(activeToken));
    }, [dispatch, activeToken]);

    const handleRedeemToken = () => {
        if (!manualToken.trim()) return;
        dispatch(fetchInvitation(manualToken.trim()));
    };

    const isExpired = invitation?.status === "EXPIRED" || (invitation?.expires_at && moment(invitation.expires_at).isBefore(moment()));
    const isAccepted = invitation?.status === "ACCEPTED";

    const formik = useFormik({
        initialValues: {first_name: "", last_name: "", username: "", phone: "", password: "", confirmPassword: ""},
        validationSchema: yup.object({
            first_name: yup.string().required("First name is required"),
            last_name: yup.string().required("Last name is required"),
            username: yup.string().required("Username is required"),
            password: yup.string().min(8, "Min 8 characters").required("Password is required"),
            confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            await new Promise(r => setTimeout(r, 1000));
            dispatch(login({
                first_name: values.first_name,
                last_name: values.last_name,
                username: values.username,
                email: invitation?.email,
                phone: values.phone,
                role: invitation?.role || "admin",
                status: "ACTIVE",
                is_verified: true,
                created_at: new Date().toISOString(),
            }));
            setLoading(false);
            navigate("/");
        }
    });

    return (
        <Box sx={{minHeight: "100vh", display: "flex", backgroundColor: "background.default"}}>
            {/* Left — Branding */}
            <Box sx={{
                display: {xs: "none", md: "flex"}, flexBasis: "40%",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
                flexDirection: "column", justifyContent: "center", alignItems: "center",
                p: 6, position: "relative", overflow: "hidden",
            }}>
                <Box sx={{position: "absolute", top: -60, right: -60, width: 200, height: 200, backgroundColor: "rgba(255,255,255,0.06)"}}/>
                <Box sx={{position: "absolute", bottom: -80, left: -40, width: 250, height: 250, backgroundColor: "rgba(255,255,255,0.04)"}}/>
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6}}>
                    <Stack spacing={3} alignItems="center" sx={{position: "relative", zIndex: 1}}>
                        <CardMedia component="img" src={logo} sx={{width: 64, height: 64, objectFit: "contain"}}/>
                        <Typography sx={{color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: -0.5}}>StayUp</Typography>
                        <Typography sx={{color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 300, fontSize: 14}}>
                            You've been invited to join the admin team. Set up your account below.
                        </Typography>
                        {invitation && (
                            <Stack spacing={1} alignItems="center" sx={{mt: 2, p: 2, backgroundColor: "rgba(255,255,255,0.1)", width: "100%"}}>
                                <Typography variant="caption" sx={{color: "rgba(255,255,255,0.6)"}}>Invited as</Typography>
                                <Chip label={(invitation.role || "admin").replace("_", " ")} sx={{backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, textTransform: "capitalize"}}/>
                                <Typography variant="caption" sx={{color: "rgba(255,255,255,0.5)", mt: 1}}>
                                    Invited by {invitation.invited_by || "Admin"}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </motion.div>
            </Box>

            {/* Right — Form */}
            <Box sx={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: {xs: 3, sm: 6}, overflowY: "auto"}}>
                <Container maxWidth="sm">
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 4, display: {xs: "flex", md: "none"}}}>
                            <CardMedia component="img" src={logo} sx={{width: 32, height: 32, objectFit: "contain"}}/>
                            <Typography sx={{color: "secondary.main", fontSize: 20, fontWeight: 800}}>StayUp</Typography>
                        </Stack>

                        <Box sx={{mb: 1}}>
                            <Box sx={{width: 44, height: 44, mb: 2, background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <BadgeOutlined sx={{color: "#fff", fontSize: 22}}/>
                            </Box>
                            <Typography variant="h4" sx={{fontWeight: 800, mb: 0.5}}>Accept Invitation</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {invitation?.email
                                    ? `Complete your profile for ${invitation.email}`
                                    : "Set up your admin account"}
                            </Typography>
                        </Box>

                        {/* Invitation status checks */}
                        {isExpired && (
                            <Alert severity="error" sx={{mt: 2}}>
                                This invitation has expired. Please ask your administrator to send a new one.
                            </Alert>
                        )}
                        {isAccepted && (
                            <Alert severity="info" sx={{mt: 2}}>
                                This invitation has already been accepted. <Link to="/auth/login" style={{color: "#6366F1"}}>Sign in instead</Link>
                            </Alert>
                        )}
                        {/* Manual token entry for /auth/invite/redeem */}
                        {isRedeemMode && !invitation && (
                            <Box sx={{mt: 2}}>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                    Enter the invitation token from the email you received.
                                </Typography>
                                <Stack direction="row" spacing={1.5}>
                                    <TextField
                                        size="small" fullWidth
                                        label="Invitation Token"
                                        placeholder="Paste your token here"
                                        value={manualToken}
                                        onChange={e => setManualToken(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleRedeemToken()}
                                    />
                                    <Button variant="contained" color="secondary" onClick={handleRedeemToken} disabled={!manualToken.trim() || invitationLoading} sx={{minWidth: 100}}>
                                        {invitationLoading ? "..." : "Redeem"}
                                    </Button>
                                </Stack>
                            </Box>
                        )}

                        {!invitation && !invitationLoading && !isRedeemMode && (
                            <Alert severity="warning" sx={{mt: 2}}>
                                Invalid invitation link. Please check your email for the correct link.
                            </Alert>
                        )}

                        {invitation && !isExpired && !isAccepted && (
                            <>
                                {/* Invitation Info */}
                                <Stack direction="row" spacing={2} sx={{mt: 2, mb: 3, p: 2, backgroundColor: "light.secondary"}}>
                                    <CheckCircleOutline sx={{color: "secondary.main", fontSize: 20, mt: 0.25}}/>
                                    <Box>
                                        <Typography variant="body2" sx={{fontWeight: 600}}>Valid invitation</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Role: <strong>{(invitation.role || "admin").replace("_", " ")}</strong> &middot; Expires {moment(invitation.expires_at).fromNow()}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                                <form onSubmit={formik.handleSubmit}>
                                    <Stack spacing={2}>
                                        <Stack direction="row" spacing={2}>
                                            <TextField name="first_name" label="First Name" fullWidth size="small" value={formik.values.first_name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.first_name && formik.errors.first_name)} helperText={formik.touched.first_name && formik.errors.first_name}/>
                                            <TextField name="last_name" label="Last Name" fullWidth size="small" value={formik.values.last_name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.last_name && formik.errors.last_name)} helperText={formik.touched.last_name && formik.errors.last_name}/>
                                        </Stack>
                                        <TextField name="username" label="Username" fullWidth size="small" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.username && formik.errors.username)} helperText={formik.touched.username && formik.errors.username}/>
                                        <TextField name="phone" label="Phone (optional)" fullWidth size="small" value={formik.values.phone} onChange={formik.handleChange}/>
                                        <TextField
                                            name="password" label="Password" fullWidth size="small"
                                            type={showPassword ? "text" : "password"}
                                            value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched.password && formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                            slotProps={{input: {endAdornment: <Box sx={{cursor: "pointer", display: "flex", color: "text.secondary"}} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOffOutlined sx={{fontSize: 18}}/> : <VisibilityOutlined sx={{fontSize: 18}}/>}</Box>}}}
                                        />
                                        <TextField name="confirmPassword" label="Confirm Password" fullWidth size="small" type="password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}/>
                                        <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={loading} sx={{py: 1.25}}>
                                            {loading ? "Creating account..." : "Accept & Create Account"}
                                        </Button>
                                    </Stack>
                                </form>

                                <Divider sx={{my: 3}}/>

                                <Typography align="center" variant="body2" color="text.secondary">
                                    Already have an account?{" "}
                                    <Link to="/auth/login" style={{textDecoration: "none"}}>
                                        <Typography variant="body2" component="span" sx={{color: "secondary.main", fontWeight: 600}}>Sign in</Typography>
                                    </Link>
                                </Typography>
                            </>
                        )}
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default AcceptInvitationPage;
