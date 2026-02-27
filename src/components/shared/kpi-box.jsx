import {Paper, Stack, Typography} from "@mui/material";

const KPIBox = ({label, value, subtitle}) => (
    <Paper
        elevation={0}
        sx={{
            p: 2,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "border.default",
            minWidth: 180,
        }}
    >
        <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="h5" sx={{fontWeight: 700}}>
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Stack>
    </Paper>
);

export default KPIBox;