import { Box, Paper, Stack, Typography } from "@mui/material";
import { TrendingUpOutlined, TrendingDownOutlined } from "@mui/icons-material";

const KPIBox = ({ label, value, subtitle, trend, icon, iconColor = "secondary.main", iconBg = "light.secondary" }) => (
    <Paper
        elevation={0}
        sx={{
            p: 2.5,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "border.default",
            width: "100%",
        }}
    >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" noWrap>
                    {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
                {trend != null && (
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                        {trend >= 0
                            ? <TrendingUpOutlined sx={{ fontSize: 14, color: "text.green" }} />
                            : <TrendingDownOutlined sx={{ fontSize: 14, color: "text.red" }} />
                        }
                        <Typography
                            variant="caption"
                            sx={{ color: trend >= 0 ? "text.green" : "text.red", fontWeight: 500 }}
                        >
                            {trend >= 0 ? "+" : ""}{trend}% vs last period
                        </Typography>
                    </Stack>
                )}
            </Stack>
            {icon && (
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "25%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: iconBg,
                        color: iconColor,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>
            )}
        </Stack>
    </Paper>
);

export default KPIBox;
