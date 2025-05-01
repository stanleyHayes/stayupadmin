import {Avatar, Stack, Typography} from "@mui/material";

const ProductProfile = ({product}) => {
    return (
        <Stack
            justifyContent="flex-start"
            sx={{py: 1}}
            direction="row"
            spacing={2}
            alignItems="center">
            <Avatar
                src={product?.image?.secure_url}
                variant="circular"
                sx={{width: 30, height: 30}}
            />
            <Typography
                variant="caption"
                display="inline"
                component="span"
                sx={{color: "text.primary"}}>
                {product?.title}
            </Typography>
        </Stack>
    )
}

export default ProductProfile;