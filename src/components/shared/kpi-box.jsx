import { Box, Paper, Stack, Typography } from "@mui/material";
import { TrendingUpOutlined, TrendingDownOutlined } from "@mui/icons-material";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "./count-up.jsx";

const KPIBox = ({ label, value, subtitle, trend, icon, iconColor = "secondary.main", iconBg = "light.secondary" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ height: "100%" }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "border.default",
                    width: "100%",
                    height: "100%",
                    transition: "border-color 0.25s, box-shadow 0.25s",
                    "&:hover": {
                        borderColor: "secondary.main",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    },
                }}
            >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontFamily: "'Inconsolata', monospace", fontWeight: 700 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                        {trend != null && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.35, delay: 0.25 }}
                            >
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
                            </motion.div>
                        )}
                    </Stack>
                    {icon && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 0,
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
                        </motion.div>
                    )}
                </Stack>
            </Paper>
        </motion.div>
    );
};

export default KPIBox;
