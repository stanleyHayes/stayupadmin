import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {
    SearchOffOutlined, Inventory2Outlined, SentimentDissatisfiedOutlined,
    ReceiptLongOutlined, PeopleOutlined, LocalOfferOutlined, ArticleOutlined,
    MailOutline, RateReviewOutlined, ShieldOutlined, CollectionsOutlined
} from "@mui/icons-material";
import {motion} from "framer-motion";

const floatAnimation = {
    y: [0, -8, 0],
    transition: {duration: 3, repeat: Infinity, ease: "easeInOut"},
};

const pulseRing = {
    scale: [1, 1.2, 1],
    opacity: [0.25, 0.05, 0.25],
    transition: {duration: 2.5, repeat: Infinity, ease: "easeInOut"},
};

const stagger = {
    animate: {transition: {staggerChildren: 0.12}},
};

const fadeUp = {
    initial: {opacity: 0, y: 20},
    animate: {opacity: 1, y: 0, transition: {duration: 0.5, ease: "easeOut"}},
};

const PRESETS = {
    products: {icon: Inventory2Outlined, color: "secondary", particles: ["📦", "✨", "🏷️"]},
    orders: {icon: ReceiptLongOutlined, color: "secondary", particles: ["🛒", "📋", "✨"]},
    customers: {icon: PeopleOutlined, color: "secondary", particles: ["👥", "✨", "🌟"]},
    coupons: {icon: LocalOfferOutlined, color: "secondary", particles: ["🎫", "💰", "✨"]},
    blog: {icon: ArticleOutlined, color: "secondary", particles: ["📝", "✨", "💡"]},
    messages: {icon: MailOutline, color: "secondary", particles: ["📬", "✨", "💬"]},
    reviews: {icon: RateReviewOutlined, color: "secondary", particles: ["⭐", "✨", "💬"]},
    roles: {icon: ShieldOutlined, color: "secondary", particles: ["🔒", "✨", "🛡️"]},
    collections: {icon: CollectionsOutlined, color: "secondary", particles: ["🛍️", "✨", "📸"]},
    search: {icon: SearchOffOutlined, color: "secondary", particles: ["🔍", "✨", "💫"]},
    default: {icon: SentimentDissatisfiedOutlined, color: "secondary", particles: ["💭", "✨", "🌟"]},
};

const Empty = ({
    title = "Nothing here yet",
    message,
    description,
    action,
    button,
    preset = "default",
    icon: CustomIcon,
}) => {
    const config = PRESETS[preset] || PRESETS.default;
    const particles = config.particles;
    const desc = description || message || "No data to display right now.";

    // CustomIcon can be a JSX element (legacy) or a component class
    const isElement = CustomIcon && typeof CustomIcon === "object" && CustomIcon.$$typeof;
    const IconComponent = !CustomIcon ? config.icon : (isElement ? null : CustomIcon);

    return (
        <Card
            variant="outlined"
            sx={{
                borderStyle: "dashed",
                borderColor: "divider",
                overflow: "hidden",
                position: "relative",
            }}>
            <Box sx={{height: 3, background: (t) => `linear-gradient(90deg, ${t.palette.secondary.main}, transparent)`}}/>

            <CardContent sx={{py: {xs: 6, md: 8}, px: 3}}>
                <Stack
                    component={motion.div}
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    direction="column"
                    spacing={2.5}
                    alignItems="center">

                    {/* Animated icon with floating particles */}
                    <Box component={motion.div} variants={fadeUp} sx={{position: "relative", width: 100, height: 100}}>
                        {/* Pulse ring */}
                        <Box
                            component={motion.div}
                            animate={pulseRing}
                            sx={{position: "absolute", inset: -10, borderRadius: "50%", border: "2px solid", borderColor: "secondary.main"}}
                        />
                        {/* Main icon circle */}
                        <Box
                            component={motion.div}
                            animate={floatAnimation}
                            sx={{
                                width: 100, height: 100, borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                backgroundColor: "light.secondary", position: "relative",
                            }}>
                            {isElement ? CustomIcon : <IconComponent sx={{fontSize: 40, color: "secondary.main", opacity: 0.8}}/>}
                        </Box>
                        {/* Floating particles */}
                        {particles.map((emoji, i) => (
                            <Box
                                key={i}
                                component={motion.div}
                                animate={{
                                    y: [0, -10 - i * 4, 0],
                                    x: [0, (i - 1) * 6, 0],
                                    opacity: [0.4, 1, 0.4],
                                    rotate: [0, (i - 1) * 12, 0],
                                    transition: {duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3},
                                }}
                                sx={{
                                    position: "absolute", fontSize: 16,
                                    ...([{top: -2, right: 2}, {bottom: 2, left: -10}, {top: "40%", right: -14}][i]),
                                }}>
                                {emoji}
                            </Box>
                        ))}
                    </Box>

                    {/* Text */}
                    <Stack component={motion.div} variants={fadeUp} spacing={0.75} alignItems="center" sx={{maxWidth: 360}}>
                        <Typography variant="h6" fontWeight={800} align="center" sx={{letterSpacing: -0.3}}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{lineHeight: 1.7}}>
                            {desc}
                        </Typography>
                    </Stack>

                    {/* Actions */}
                    {(action || button) && (
                        <Stack component={motion.div} variants={fadeUp} direction="row" spacing={1.5} alignItems="center">
                            {action || button}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default Empty;
