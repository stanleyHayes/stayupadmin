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
import logo from "../../assets/images/logo.png";
import {OpenInNew} from "@mui/icons-material";

const ForgotPasswordPage = () => {
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
                                        variant="h4"
                                        sx={{
                                            color: "text.primary",
                                            fontWeight: 700,
                                            mb: 4,
                                            fontSize: {xs: 32, lg: 44}
                                        }}>
                                        Reset your password
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{color: "text.secondary", mb: 4, fontWeight: 500}}>
                                        If you signed up with a username and password, reset your password below.
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
                                                        type= "text"
                                                    />
                                                    {formik.touched.username && formik.errors.username && (
                                                        <FormHelperText>
                                                            {formik.errors.username}
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
                                                    mb: 4,
                                                    borderRadius: 4
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

export default ForgotPasswordPage;