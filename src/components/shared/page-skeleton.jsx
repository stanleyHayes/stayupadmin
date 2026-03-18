import React from "react";
import { Box, Container, Grid, Paper, Skeleton, Stack } from "@mui/material";

/**
 * Full-page skeleton for detail pages (left card + right content).
 */
export const DetailSkeleton = () => (
    <Container>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Skeleton animation="wave" variant="rectangular" width={80} height={32} />
            <Skeleton animation="wave" variant="text" width={200} height={32} />
        </Stack>
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
                    <Skeleton animation="wave" variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 2 }} />
                    <Skeleton animation="wave" variant="text" width="60%" sx={{ mx: "auto", mb: 1 }} />
                    <Skeleton animation="wave" variant="text" width="40%" sx={{ mx: "auto", mb: 2 }} />
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Skeleton animation="wave" variant="rectangular" width={60} height={24} />
                        <Skeleton animation="wave" variant="rectangular" width={60} height={24} />
                    </Stack>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper elevation={0} sx={{ p: 3 }}>
                    <Skeleton animation="wave" variant="text" width={180} height={28} sx={{ mb: 2 }} />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Stack key={i} direction="row" spacing={2} sx={{ py: 0.75 }}>
                            <Skeleton animation="wave" variant="text" width={120} height={20} />
                            <Skeleton animation="wave" variant="text" width="50%" height={20} />
                        </Stack>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    </Container>
);

/**
 * Skeleton for list pages (KPIs + table).
 */
export const ListSkeleton = ({ kpis = 4, rows = 8, cols = 6 }) => (
    <Container>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Skeleton animation="wave" variant="text" width={160} height={36} />
            <Skeleton animation="wave" variant="rectangular" width={120} height={32} />
        </Stack>
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {Array.from({ length: kpis }).map((_, i) => (
                <Grid key={i} size={{ xs: 6, sm: 3 }}>
                    <Paper elevation={0} sx={{ p: 2.5 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Skeleton animation="wave" variant="rectangular" width={40} height={40} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton animation="wave" variant="text" width="70%" height={14} sx={{ mb: 0.5 }} />
                                <Skeleton animation="wave" variant="text" width="40%" height={24} />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            ))}
        </Grid>
        <Paper elevation={0}>
            {/* Header row */}
            <Stack direction="row" spacing={2} sx={{ px: 2, py: 1.5, borderBottom: 2, borderColor: "divider" }}>
                {Array.from({ length: cols }).map((_, c) => (
                    <Skeleton key={c} animation="wave" variant="text" width={c === 0 ? 30 : `${Math.floor(80 / cols)}%`} height={18} />
                ))}
            </Stack>
            {/* Data rows */}
            {Array.from({ length: rows }).map((_, r) => (
                <Stack key={r} direction="row" spacing={2} alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
                    {Array.from({ length: cols }).map((_, c) => (
                        c === 1 ? (
                            <Stack key={c} direction="row" spacing={1} alignItems="center" sx={{ width: `${Math.floor(80 / cols)}%` }}>
                                <Skeleton animation="wave" variant="circular" width={28} height={28} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton animation="wave" variant="text" width="80%" height={16} />
                                    <Skeleton animation="wave" variant="text" width="50%" height={12} />
                                </Box>
                            </Stack>
                        ) : (
                            <Skeleton key={c} animation="wave" variant="text" width={c === 0 ? 30 : `${Math.floor(80 / cols)}%`} height={20} />
                        )
                    ))}
                </Stack>
            ))}
        </Paper>
    </Container>
);

/**
 * Skeleton for card grid pages (like products).
 */
export const CardGridSkeleton = ({ cards = 8 }) => (
    <Container>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Skeleton animation="wave" variant="text" width={160} height={36} />
            <Skeleton animation="wave" variant="rectangular" width={120} height={32} />
        </Stack>
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 6, sm: 3 }}>
                    <Paper elevation={0} sx={{ p: 2.5 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Skeleton animation="wave" variant="rectangular" width={40} height={40} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton animation="wave" variant="text" width="70%" height={14} sx={{ mb: 0.5 }} />
                                <Skeleton animation="wave" variant="text" width="40%" height={24} />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            ))}
        </Grid>
        <Grid container spacing={2}>
            {Array.from({ length: cards }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={0} sx={{ overflow: "hidden" }}>
                        <Skeleton animation="wave" variant="rectangular" width="100%" height={200} />
                        <Box sx={{ p: 2 }}>
                            <Skeleton animation="wave" variant="text" width="80%" height={18} sx={{ mb: 0.5 }} />
                            <Skeleton animation="wave" variant="text" width="60%" height={14} sx={{ mb: 1.5 }} />
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Skeleton animation="wave" variant="text" width={60} height={22} />
                                <Skeleton animation="wave" variant="text" width={40} height={14} />
                            </Stack>
                            <Stack direction="row" spacing={1} justifyContent="space-between">
                                <Skeleton animation="wave" variant="text" width={50} height={12} />
                                <Skeleton animation="wave" variant="rectangular" width={60} height={20} />
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </Container>
);
