import React, {useState} from "react";
import {
    Badge, Box, Chip, Divider, Menu, MenuItem, Stack, Typography
} from "@mui/material";
import {NotificationsOutlined, ShoppingCartOutlined, MailOutline, SubscriptionsOutlined, RateReviewOutlined} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {selectOrder} from "../../redux/features/orders/orders-slice";
import {selectMessages} from "../../redux/features/messages/messages-slice";
import {selectSubscribers} from "../../redux/features/subscribers/subscribers-slice";
import {selectReviews} from "../../redux/features/reviews/reviews-slice";
import {useNavigate} from "react-router-dom";

const NotificationDropdown = ({iconSx = {}}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const {orders} = useSelector(selectOrder);
    const {messages} = useSelector(selectMessages);
    const {subscribers} = useSelector(selectSubscribers);
    const {reviews} = useSelector(selectReviews);

    // Counts
    const pendingOrders = (orders || []).filter(o => ["pending", "processing", "on-hold"].includes(o.status)).length;
    const unreadMessages = (messages || []).filter(m => m.status === "unread").length;
    const newSubscribers = (subscribers || []).filter(s => {
        if (!s.created_at && !s.date_created) return false;
        const d = new Date(s.date_created || s.created_at);
        return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000; // last 7 days
    }).length;
    const pendingReviews = (reviews || []).filter(r => r.status === "pending" || r.status === "hold").length;

    const totalCount = pendingOrders + unreadMessages + newSubscribers + pendingReviews;

    const items = [
        {icon: <ShoppingCartOutlined sx={{fontSize: 18}}/>, label: "Pending orders", count: pendingOrders, path: "/orders", color: "text.blue", bg: "light.blue"},
        {icon: <MailOutline sx={{fontSize: 18}}/>, label: "Unread messages", count: unreadMessages, path: "/messages", color: "text.orange", bg: "light.orange"},
        {icon: <SubscriptionsOutlined sx={{fontSize: 18}}/>, label: "New subscribers", count: newSubscribers, path: "/subscribers", color: "text.green", bg: "light.green"},
        {icon: <RateReviewOutlined sx={{fontSize: 18}}/>, label: "Pending reviews", count: pendingReviews, path: "/reviews", color: "text.red", bg: "light.red"},
    ];

    const handleClick = (path) => {
        setAnchorEl(null);
        navigate(path);
    };

    return (
        <>
            <Badge
                badgeContent={totalCount}
                max={99}
                color="error"
                sx={{
                    cursor: "pointer",
                    "& .MuiBadge-badge": {fontSize: 10, height: 18, minWidth: 18, fontWeight: 700},
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <NotificationsOutlined sx={iconSx}/>
            </Badge>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                slotProps={{paper: {sx: {mt: 1, minWidth: 280, p: 0, borderRadius: 1}}}}
                transformOrigin={{horizontal: "right", vertical: "top"}}
                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            >
                <Box sx={{px: 2, py: 1.5}}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Notifications</Typography>
                        {totalCount > 0 && <Chip label={totalCount} size="small" color="error" sx={{height: 20, fontSize: 11, fontWeight: 700}}/>}
                    </Stack>
                </Box>
                <Divider/>
                {items.map((item, i) => (
                    <MenuItem key={i} onClick={() => handleClick(item.path)} sx={{py: 1.5, px: 2}}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{width: "100%"}}>
                            <Box sx={{width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: item.bg, color: item.color, flexShrink: 0}}>
                                {item.icon}
                            </Box>
                            <Box sx={{flex: 1, minWidth: 0}}>
                                <Typography variant="body2" sx={{fontWeight: 500}}>{item.label}</Typography>
                            </Box>
                            {item.count > 0 ? (
                                <Chip label={item.count} size="small" sx={{height: 20, fontSize: 11, fontWeight: 700, backgroundColor: item.bg, color: item.color}}/>
                            ) : (
                                <Typography variant="caption" color="text.muted">0</Typography>
                            )}
                        </Stack>
                    </MenuItem>
                ))}
                {totalCount === 0 && (
                    <Box sx={{p: 3, textAlign: "center"}}>
                        <Typography variant="body2" color="text.secondary">All caught up</Typography>
                    </Box>
                )}
            </Menu>
        </>
    );
};

export default NotificationDropdown;
