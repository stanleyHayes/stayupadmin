import {
    Box,
    Button,
    CardMedia,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    OutlinedInput,
    Stack,
    Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {Link} from "react-router-dom";
import loginBanner from "./../../assets/images/login-banner.jpg";
import {useState} from "react";
import {VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";
import logo from "../../assets/images/logo.png";

const LoginPage = () => {
    const formik = useFormik({
        initialValues: {
            username: "",
            email: ""
        },
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema: yup.object({}).shape({
            username: yup.string().required("Username required"),
            email: yup.string().required('Email required').email('Enter a valid email')
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
                        <Grid sx={{height: "100%"}} container={true} justifyContent="center" alignItems="center">
                            <Grid item={true} xs={12} md={8} lg={6}>
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
                                                mb: 4,
                                                fontSize: {xs: 32, lg: 48}
                                            }}>
                                            Log in to your account
                                        </Typography>

                                        <Box sx={{mb: 4}}>
                                            <form onSubmit={formik.handleSubmit}>
                                                <Stack sx={{mb: 4}} direction="column" spacing={2}>
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
                                                            type="text"
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
                                                            name="password"
                                                            id="password"
                                                            required={true}
                                                            fullWidth={true}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            margin="none"
                                                            size="medium"
                                                            placeholder="Enter password"
                                                            error={Boolean(formik.touched.password && formik.errors.password)}
                                                            value={formik.values.password}
                                                            variant="outlined"
                                                            type={showPassword ? "text" : "password"}
                                                            endAdornment={showPassword ?
                                                                <VisibilityOffOutlined
                                                                    sx={{
                                                                        color: "text.secondary",
                                                                        fontSize: 28,
                                                                        padding: 0.6,
                                                                        borderRadius: "10%",
                                                                        cursor: "pointer"
                                                                    }}
                                                                    onClick={() => setShowPassword(false)}
                                                                /> : <VisibilityOutlined
                                                                    sx={{
                                                                        color: "text.secondary",
                                                                        fontSize: 28,
                                                                        padding: 0.6,
                                                                        borderRadius: "10%",
                                                                        cursor: "pointer",
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

                                                <Stack sx={{mb: 4}} direction="row" alignItems="center"
                                                       justifyContent="center">
                                                    <Link style={{textDecoration: "none"}} to="/auth/forgot-password">
                                                        <Typography
                                                            variant="body2"
                                                            component="span"
                                                            sx={{color: "secondary.main"}}>
                                                            Forgot Password?
                                                        </Typography>
                                                    </Link>
                                                </Stack>


                                                <Button
                                                    disableElevation={true}
                                                    size="large"
                                                    color="secondary"
                                                    variant="contained"
                                                    fullWidth={true}
                                                    sx={{
                                                        textTransform: "capitalize",
                                                        padding: 2,
                                                        borderRadius: 3
                                                    }}>
                                                    Log In
                                                </Button>
                                            </form>
                                        </Box>

                                        <Typography align="center" variant="body2" sx={{color: "text.secondary"}}>
                                            Don't have an account?{" "}
                                            <Link style={{textDecoration: "none"}} to="/auth/register">
                                                <Typography
                                                    variant="body2"
                                                    component="span"
                                                    sx={{color: "secondary.main"}}>
                                                    Sign up
                                                </Typography>
                                            </Link>
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

export default LoginPage;