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
import {OpenInNew, VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";
import {useState} from "react";
import logo from "../../assets/images/logo.png";

const ResetPasswordPage = () => {
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema: yup.object({}).shape({
            password: yup.string().required("Field required"),
            confirmPassword: yup.string()
                .oneOf([yup.ref('password'), null], 'Passwords must match')
                .required('Field required')
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
                height: {xs: "100vh"},
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Box sx={{paddingBottom: 4}}>
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
                    <Grid
                        sx={{height: "100%"}}
                        container={true}
                        justifyContent="center">
                        <Grid sx={{height: "100%"}} item={true} xs={12} md={12} lg={10}>
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
                                            fontSize: {xs: 32, lg: 42}
                                        }}>
                                        Reset your password
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{color: "text.secondary", mb: 4, fontWeight: 500}}>
                                        You've successfully verified your account. Enter new password below.
                                    </Typography>

                                    <Box sx={{mb: 4}}>
                                        <form onSubmit={formik.handleSubmit}>
                                            <Stack sx={{mb: 4}} direction="column" spacing={2}>
                                                <FormControl fullWidth={true}>
                                                    <OutlinedInput
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
                                                                    cursor: "pointer",
                                                                    backgroundColor: "light.secondary"
                                                                }}
                                                                onClick={() => setShowPassword(false)}
                                                            /> : <VisibilityOutlined
                                                                sx={{
                                                                    color: "secondary.main",
                                                                    fontSize: 28,
                                                                    padding: 0.6,
                                                                    borderRadius: "10%",
                                                                    cursor: "pointer",
                                                                    backgroundColor: "light.secondary"
                                                                }}
                                                                onClick={() => setShowPassword(true)}
                                                            />
                                                        }
                                                    />
                                                    {formik.touched.password && formik.errors.password && (
                                                        <FormHelperText>
                                                            formik.errors.password
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>

                                                <FormControl fullWidth={true}>
                                                    <OutlinedInput
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        required={true}
                                                        fullWidth={true}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        margin="none"
                                                        size="medium"
                                                        placeholder="Confirm Password"
                                                        error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                                                        value={formik.values.confirmPassword}
                                                        variant="outlined"
                                                        type={showPassword ? "text" : "password"}
                                                        endAdornment={showPassword ?
                                                            <VisibilityOffOutlined
                                                                sx={{
                                                                    color: "secondary.main",
                                                                    fontSize: 28,
                                                                    padding: 0.6,
                                                                    borderRadius: "10%",
                                                                    cursor: "pointer",
                                                                    backgroundColor: "light.secondary"
                                                                }}
                                                                onClick={() => setShowPassword(false)}
                                                            /> : <VisibilityOutlined
                                                                sx={{
                                                                    color: "secondary.main",
                                                                    fontSize: 28,
                                                                    padding: 0.6,
                                                                    borderRadius: "10%",
                                                                    cursor: "pointer",
                                                                    backgroundColor: "light.secondary"
                                                                }}
                                                                onClick={() => setShowPassword(true)}
                                                            />
                                                        }
                                                    />
                                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                        <FormHelperText>
                                                            formik.errors.confirmPassword
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
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
                                                    mb: 4
                                                }}>
                                                Reset password
                                            </Button>
                                        </form>
                                    </Box>

                                    <Button
                                        color="secondary"
                                        fullWidth={true}
                                        startIcon={<OpenInNew/>}>
                                        <MUILink color="secondary" href="" underline="none" target="_blank">
                                            Back to Login
                                        </MUILink>
                                    </Button>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}

export default ResetPasswordPage;