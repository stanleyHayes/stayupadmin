import {Avatar, Stack, Typography} from "@mui/material";
import {UTILS} from "../../utils/utils";

const CustomerProfile = ({customer}) => {
    return (
        <Stack
            justifyContent="flex-start"
            sx={{py: 1}}
            direction="row"
            spacing={2}
            alignItems="center">
            {customer?.image ? (
                <Avatar
                    src={customer?.image}
                    variant="circular"
                    sx={{width: 30, height: 30}}
                />
            ) : (
                <Avatar
                    variant="circular"
                    sx={{width: 30, height: 30, backgroundColor: "light.secondary"}}>
                    <Typography
                        sx={{color: "secondary.main"}}
                        variant="h6">
                        {UTILS.getInitials(customer?.name)}
                    </Typography>
                </Avatar>
            )}
            <Typography
                variant="body2"
                display="inline"
                component="span"
                sx={{color: "text.primary"}}>
                {customer?.name}
            </Typography>
        </Stack>
    )
}

export default CustomerProfile;