import {Avatar, Stack, Typography} from "@mui/material";
import {productImageUrl} from "../../utils/helpers.js";

const ProductProfile = ({product}) => {
    return (
        <Stack
            justifyContent="flex-start"
            sx={{py: 1}}
            direction="row"
            spacing={2}
            alignItems="center">
            <Avatar
                src={productImageUrl(product)}
                variant="circular"
                sx={{width: 30, height: 30}}
            />
            <Typography
                variant="caption"
                display="inline"
                component="span"
                sx={{color: "text.primary"}}>
                {product?.title || product?.name}
            </Typography>
        </Stack>
    )
}

export default ProductProfile;
