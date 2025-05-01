import {
    Box,
    Button,
    CardMedia,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    Link as MUILink,
    OutlinedInput,
    Stack,
    Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {Link} from "react-router-dom";
import loginBanner from "./../../assets/images/register-banner.jpg";
import {VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";
import {useState} from "react";
import logo from "../../assets/images/logo.png";

const RegisterPage = () => {
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: ""
        },
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema: yup.object({}).shape({
            username: yup.string().required("Username required"),
            email: yup.string().required('Email required').email('Enter a valid email'),
            password: yup.string().required("Field required"),
        })
    });

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                overflowX: "hidden",
                overflowY: {xs: "auto", lg: "hidden"},
                height: {xs: "100vh"}
            }}>
            <Box sx={{flexBasis: {xs: "100%", lg: "70%", height: "100%"}, paddingBottom: 4, paddingTop: 4}}>
                <Container sx={{height: "100%", display: "flex", flexDirection: "column"}}>
                    <Stack justifyContent="center" direction="row">
                        <Link to="/" style={{textDecoration: "none"}}>
                            <CardMedia
                                component="img"
                                src={logo}
                                sx={{height: 150, objectFit: "contain"}}
                            />
                        </Link>
                    </Stack>
                    <Box sx={{flexGrow: 1}}>
                        <Grid sx={{height: "100%"}} container={true} justifyContent="center">
                            <Grid sx={{height: "100%"}} item={true} xs={12} md={8} lg={6}>
                                <Stack
                                    spacing={2}
                                    sx={{height: "100%"}}
                                    direction="column"
                                    justifyContent="space-between">
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                color: "text.primary",
                                                fontWeight: 700,
                                                mb: 3,
                                                fontSize: {xs: 32, lg: 48}
                                            }}>
                                            Create your account
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{color: "text.secondary", mb: 2, fontWeight: 500}}>
                                            Choose your iChoose username. You can always change it later.
                                        </Typography>
                                        <Box sx={{mb: 2}}>
                                            <form onSubmit={formik.handleSubmit}>
                                                <Stack sx={{mb: 12}} direction="column" spacing={2}>
                                                    <FormControl fullWidth={true}>
                                                        <OutlinedInput
                                                            sx={{
                                                                borderRadius: 4,
                                                                backgroundColor: "background.paper"
                                                            }}
                                                            name="username"
                                                            id="username"
                                                            required={true}
                                                            fullWidth={true}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            margin="none"
                                                            size="medium"
                                                            placeholder="Enter username"
                                                            error={Boolean(formik.touched.username && formik.errors.username)}
                                                            value={formik.values.username}
                                                            variant="outlined"
                                                            type= "text"
                                                        />
                                                        {formik.touched.username && formik.errors.username && (
                                                            <FormHelperText>
                                                                {formik.errors.username}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>

                                                    <FormControl fullWidth={true}>
                                                        <OutlinedInput
                                                            sx={{
                                                                borderRadius: 4,
                                                                backgroundColor: "background.paper"
                                                            }}
                                                            name="email"
                                                            id="email"
                                                            required={true}
                                                            fullWidth={true}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            margin="none"
                                                            size="medium"
                                                            placeholder="Enter email"
                                                            error={Boolean(formik.touched.email && formik.errors.email)}
                                                            value={formik.values.email}
                                                            variant="outlined"
                                                            type= "email"
                                                        />
                                                        {formik.touched.email && formik.errors.email && (
                                                            <FormHelperText>
                                                                {formik.errors.email}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>

                                                    <FormControl fullWidth={true}>
                                                        <OutlinedInput
                                                            sx={{
                                                                borderRadius: 4,
                                                                backgroundColor: "background.paper"
                                                            }}
                                                            name="password"
                                                            id="password"
                                                            required={true}
                                                            fullWidth={true}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            margin="none"
                                                            size="medium"
                                                            placeholder="Password"
                                                            error={Boolean(formik.touched.password && formik.errors.password)}
                                                            value={formik.values.email}
                                                            variant="outlined"
                                                            type={showPassword ? "text" : "password"}
                                                            endAdornment={showPassword ?
                                                                <VisibilityOffOutlined
                                                                    sx={{
                                                                        color: "secondary.main",
                                                                        fontSize: 28,
                                                                        padding: 0.6,
                                                                        borderRadius: "10%",
                                                                        cursor: "pointer"
                                                                    }}
                                                                    onClick={() => setShowPassword(false)}
                                                                /> : <VisibilityOutlined
                                                                    sx={{
                                                                        color: "secondary.main",
                                                                        fontSize: 28,
                                                                        padding: 0.6,
                                                                        borderRadius: "10%",
                                                                        cursor: "pointer"
                                                                    }}
                                                                    onClick={() => setShowPassword(true)}
                                                                />
                                                            }
                                                        />
                                                        {formik.touched.password && formik.errors.password && (
                                                            <FormHelperText>
                                                                {formik.errors.password}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Stack>

                                                <Typography variant="body2" sx={{color: "text.secondary", mb: 2}}>
                                                    By clicking Create account, you agree to iChoose's{" "}
                                                    <Link style={{textDecoration: "none"}} to="/terms">
                                                        <Typography
                                                            variant="body2"
                                                            component="span"
                                                            sx={{color: "secondary.main"}}>
                                                            Terms and Conditions
                                                        </Typography>
                                                    </Link>,{" "} confirm you have read our {" "}
                                                    <Link style={{textDecoration: "none"}} to="/privacy">
                                                        <Typography variant="body2" component="span"
                                                                    sx={{color: "secondary.main"}}>Privacy
                                                            Notice.</Typography>
                                                    </Link> {" "} You may receive offers, news and updates from us.
                                                </Typography>

                                                <Button
                                                    disableElevation={true}
                                                    color="secondary"
                                                    variant="contained"
                                                    fullWidth={true}
                                                    sx={{
                                                        textTransform: "capitalize",
                                                        padding: 2,
                                                        borderRadius: 4
                                                    }}>
                                                    Create Account
                                                </Button>
                                            </form>
                                        </Box>

                                        <Typography align="center" variant="body2" sx={{color: "text.secondary"}}>
                                            Already have an account?{" "}
                                            <Link style={{textDecoration: "none"}} to="/auth/login">
                                                <Typography
                                                    variant="body2"
                                                    component="span"
                                                    sx={{color: "secondary.main"}}>
                                                    Log in
                                                </Typography>
                                            </Link>
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "text.secondary",
                                                textAlign: {xs: "center", lg: "left"},
                                                mb: {xs: 4, lg: 0}
                                            }}>
                                            This site is protected by the {" "}
                                            <MUILink
                                                underline="always"
                                                sx={{color: "secondary.main"}}
                                                target="_blank"
                                                href="">
                                                Google Privacy Policy</MUILink> {" "} and {" "}
                                            <MUILink
                                                underline="always"
                                                sx={{color: "secondary.main"}}
                                                target="_blank"
                                                href="">
                                                Terms of Service apply
                                            </MUILink>{" "}.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            <Box sx={{flexBasis: {xs: "100%", lg: "30%"}, display: {xs: "none", lg: "block"}}}>
                <CardMedia
                    component="img"
                    src={loginBanner}
                    sx={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "top"}}
                />
            </Box>
        </Box>
    )
}

export default RegisterPage;