import {
    Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent,
    Divider, Grid, Stack, Typography
} from "@mui/material";
import {motion} from "framer-motion";
import {
    Close, EmailOutlined, PhoneOutlined, PersonOutlined,
    CalendarMonthOutlined, Verified, LocationOnOutlined,
    ShoppingCartOutlined, EditOutlined
} from "@mui/icons-material";
import React from "react";
import {Link} from "react-router-dom";
import moment from "moment";

const InfoRow = ({icon, label, value, isLink, href}) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{py: 0.75}}>
        <Box sx={{
            width: 32, height: 32, borderRadius: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            backgroundColor: "light.secondary", color: "secondary.main", flexShrink: 0
        }}>
            {icon}
        </Box>
        <Box sx={{flex: 1, minWidth: 0}}>
            <Typography variant="caption" color="text.secondary" sx={{display: "block", lineHeight: 1.2}}>{label}</Typography>
            {isLink ? (
                <Typography variant="body2" component="a" href={href} sx={{color: "secondary.main", textDecoration: "none", fontWeight: 500}}>
                    {value || "—"}
                </Typography>
            ) : (
                <Typography variant="body2" sx={{fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{value || "—"}</Typography>
            )}
        </Box>
    </Stack>
);

const CustomerQuickView = ({customer, open, handleClose}) => {
    const initials = customer?.name
        ? customer.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const statusColor = (customer?.status || "ACTIVE") === "ACTIVE" ? "success"
        : customer?.status === "SUSPENDED" ? "error"
        : customer?.status === "PENDING" ? "warning" : "default";

    return (
        <Dialog scroll="paper" fullWidth maxWidth="sm" open={open} onClose={handleClose}
            PaperProps={{sx: {borderRadius: 0, overflow: "hidden"}}}>

            {/* Header */}
            <Box sx={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                p: 3, pb: 4, position: "relative"
            }}>
                <Box component={motion.div} exit={{}}
                    sx={{position: "absolute", top: 12, right: 12, cursor: "pointer"}}
                    onClick={handleClose}>
                    <Close sx={{
                        padding: 0.4, fontSize: 28, borderRadius: 0,
                        color: "#fff", backgroundColor: "rgba(255,255,255,0.2)",
                        "&:hover": {backgroundColor: "rgba(255,255,255,0.3)"}
                    }}/>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{
                        width: 56, height: 56, fontSize: 20, fontWeight: 700,
                        backgroundColor: "rgba(255,255,255,0.2)", color: "#fff"
                    }}>
                        {initials}
                    </Avatar>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6" sx={{color: "#fff", fontWeight: 700}}>
                                {customer?.name}
                            </Typography>
                            {customer?.is_verified && (
                                <Verified sx={{fontSize: 18, color: "#FCD34D"}}/>
                            )}
                        </Stack>
                        <Typography variant="body2" sx={{color: "rgba(255,255,255,0.8)"}}>
                            @{customer?.username?.toLowerCase()}
                        </Typography>
                        <Chip
                            label={customer?.status || "ACTIVE"}
                            size="small"
                            color={statusColor}
                            sx={{mt: 0.5, fontWeight: 600, fontSize: 11, height: 22}}
                        />
                    </Box>
                </Stack>
            </Box>

            <DialogContent sx={{p: 3}}>
                {/* Contact Information */}
                <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 1, color: "text.secondary", textTransform: "uppercase", fontSize: 11, letterSpacing: 1}}>
                    Contact Information
                </Typography>
                <Box sx={{mb: 2.5}}>
                    <InfoRow
                        icon={<EmailOutlined sx={{fontSize: 16}}/>}
                        label="Email Address"
                        value={customer?.email}
                        isLink href={`mailto:${customer?.email}`}
                    />
                    <InfoRow
                        icon={<PhoneOutlined sx={{fontSize: 16}}/>}
                        label="Phone Number"
                        value={customer?.phone}
                        isLink href={`tel:${customer?.phone}`}
                    />
                    <InfoRow
                        icon={<PersonOutlined sx={{fontSize: 16}}/>}
                        label="Username"
                        value={customer?.username ? `@${customer.username.toLowerCase()}` : "—"}
                    />
                </Box>

                <Divider sx={{my: 1.5}}/>

                {/* Address */}
                <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 1, mt: 2, color: "text.secondary", textTransform: "uppercase", fontSize: 11, letterSpacing: 1}}>
                    Address
                </Typography>
                <Box sx={{mb: 2.5}}>
                    <InfoRow
                        icon={<LocationOnOutlined sx={{fontSize: 16}}/>}
                        label="Location"
                        value={[customer?.address?.street, customer?.address?.city, customer?.address?.state, customer?.address?.country].filter(Boolean).join(", ") || "Not provided"}
                    />
                </Box>

                <Divider sx={{my: 1.5}}/>

                {/* Account Details */}
                <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 1, mt: 2, color: "text.secondary", textTransform: "uppercase", fontSize: 11, letterSpacing: 1}}>
                    Account Details
                </Typography>
                <Box>
                    <InfoRow
                        icon={<CalendarMonthOutlined sx={{fontSize: 16}}/>}
                        label="Member Since"
                        value={customer?.created_at ? moment(customer.created_at).format("MMMM D, YYYY") : customer?.createdAt ? moment(customer.createdAt).format("MMMM D, YYYY") : "—"}
                    />
                    <InfoRow
                        icon={<ShoppingCartOutlined sx={{fontSize: 16}}/>}
                        label="Total Orders"
                        value={customer?.orders?.length || customer?.totalOrders || "0"}
                    />
                </Box>

                {/* Quick Stats */}
                <Grid container spacing={1.5} sx={{mt: 2}}>
                    <Grid size={{xs: 4}}>
                        <Box sx={{p: 1.5, borderRadius: 0, backgroundColor: "light.green", textAlign: "center"}}>
                            <Typography variant="h6" sx={{fontWeight: 700, color: "text.green"}}>{customer?.orders?.length || 0}</Typography>
                            <Typography variant="caption" color="text.secondary">Orders</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{xs: 4}}>
                        <Box sx={{p: 1.5, borderRadius: 0, backgroundColor: "light.blue", textAlign: "center"}}>
                            <Typography variant="h6" sx={{fontWeight: 700, color: "text.blue"}}>{customer?.is_verified ? "Yes" : "No"}</Typography>
                            <Typography variant="caption" color="text.secondary">Verified</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{xs: 4}}>
                        <Box sx={{p: 1.5, borderRadius: 0, backgroundColor: "light.secondary", textAlign: "center"}}>
                            <Typography variant="h6" sx={{fontWeight: 700, color: "secondary.main"}}>
                                {customer?.created_at ? moment(customer.created_at).fromNow(true) : "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Member</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider/>

            <DialogActions sx={{p: 2, gap: 1}}>
                <Button size="small" variant="outlined" color="inherit" onClick={handleClose} sx={{flex: 1}}>
                    Close
                </Button>
                <Link to={`/customers/${customer?._id}/update`} style={{textDecoration: "none", flex: 1}}>
                    <Button size="small" color="secondary" variant="contained" fullWidth startIcon={<EditOutlined/>}>
                        Edit Customer
                    </Button>
                </Link>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerQuickView;
