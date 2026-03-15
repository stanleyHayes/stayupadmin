import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper,
    Select, Snackbar, Stack, Switch, TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchPaymentGateway, updatePaymentGateway, deletePaymentGateway,
    selectPaymentGateways
} from "../../redux/features/payment-gateways/payment-gateways-slice";
import {
    ArrowBack, Save, DeleteOutline, VisibilityOutlined, VisibilityOffOutlined,
    CreditCardOutlined, PhoneAndroidOutlined, CurrencyBitcoinOutlined,
    StorefrontOutlined, PaymentOutlined, CheckCircleOutline
} from "@mui/icons-material";

const CATEGORY_META = {
    card:         {label: "Card / Online", icon: <CreditCardOutlined/>, color: "#3B82F6", bg: "#EFF6FF"},
    mobile_money: {label: "Mobile Money", icon: <PhoneAndroidOutlined/>, color: "#F59E0B", bg: "#FFFBEB"},
    crypto:       {label: "Cryptocurrency", icon: <CurrencyBitcoinOutlined/>, color: "#8B5CF6", bg: "#F5F3FF"},
    offline:      {label: "Offline / Manual", icon: <StorefrontOutlined/>, color: "#10B981", bg: "#ECFDF5"},
};

const SettingField = ({settingKey, setting, value, onChange}) => {
    const [showPassword, setShowPassword] = useState(false);

    if (setting.type === "toggle") {
        return (
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{py: 1, px: 1, borderRadius: 0, backgroundColor: "background.default"}}>
                <Box>
                    <Typography variant="body2" sx={{fontWeight: 500}}>{setting.label}</Typography>
                    {setting.placeholder && <Typography variant="caption" color="text.secondary">{setting.placeholder}</Typography>}
                </Box>
                <Switch
                    checked={value === "yes"}
                    onChange={(e) => onChange(settingKey, e.target.checked ? "yes" : "no")}
                    color="secondary"
                    size="small"
                />
            </Stack>
        );
    }

    if (setting.type === "select") {
        return (
            <FormControl fullWidth size="small">
                <InputLabel>{setting.label}</InputLabel>
                <Select value={value} onChange={(e) => onChange(settingKey, e.target.value)} label={setting.label}>
                    {(setting.options || []).map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    if (setting.type === "textarea") {
        return (
            <TextField
                label={setting.label}
                value={value}
                onChange={(e) => onChange(settingKey, e.target.value)}
                size="small"
                fullWidth
                multiline
                rows={3}
                placeholder={setting.placeholder}
            />
        );
    }

    if (setting.type === "password") {
        return (
            <TextField
                label={setting.label}
                value={value}
                onChange={(e) => onChange(settingKey, e.target.value)}
                size="small"
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder={setting.placeholder}
                slotProps={{
                    input: {
                        endAdornment: (
                            <Box sx={{cursor: "pointer", display: "flex", color: "text.secondary"}} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOffOutlined sx={{fontSize: 18}}/> : <VisibilityOutlined sx={{fontSize: 18}}/>}
                            </Box>
                        )
                    }
                }}
            />
        );
    }

    return (
        <TextField
            label={setting.label}
            value={value}
            onChange={(e) => onChange(settingKey, e.target.value)}
            size="small"
            fullWidth
            type={setting.type === "email" ? "email" : "text"}
            placeholder={setting.placeholder}
        />
    );
};

const PaymentGatewayDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {gatewayID} = useParams();
    const {paymentGateway, paymentGatewayLoading, paymentGatewayError} = useSelector(selectPaymentGateways);

    const [localSettings, setLocalSettings] = useState({});
    const [localEnabled, setLocalEnabled] = useState(false);
    const [localTitle, setLocalTitle] = useState("");
    const [localDescription, setLocalDescription] = useState("");
    const [localMethodDescription, setLocalMethodDescription] = useState("");
    const [dirty, setDirty] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (gatewayID) dispatch(fetchPaymentGateway(gatewayID));
    }, [dispatch, gatewayID]);

    useEffect(() => {
        if (paymentGateway) {
            const settingValues = {};
            Object.entries(paymentGateway.settings || {}).forEach(([key, setting]) => {
                settingValues[key] = setting.value || "";
            });
            setLocalSettings(settingValues);
            setLocalEnabled(Boolean(paymentGateway.enabled));
            setLocalTitle(paymentGateway.title || "");
            setLocalDescription(paymentGateway.description || "");
            setLocalMethodDescription(paymentGateway.method_description || "");
            setDirty(false);
        }
    }, [paymentGateway]);

    const handleSettingChange = (key, value) => {
        setLocalSettings(prev => ({...prev, [key]: value}));
        setDirty(true);
    };

    const handleSave = () => {
        if (!paymentGateway) return;
        const updatedSettings = {};
        Object.entries(paymentGateway.settings || {}).forEach(([key, setting]) => {
            updatedSettings[key] = {...setting, value: localSettings[key] || ""};
        });
        dispatch(updatePaymentGateway({
            id: gatewayID,
            data: {
                enabled: localEnabled,
                title: localTitle,
                description: localDescription,
                method_description: localMethodDescription,
                settings: updatedSettings
            }
        }));
        setDirty(false);
        setSaved(true);
    };

    const handleDelete = () => {
        if (!window.confirm(`Delete "${paymentGateway?.title}" payment gateway? This cannot be undone.`)) return;
        dispatch(deletePaymentGateway(gatewayID));
        navigate("/payment-gateways");
    };

    const gw = paymentGateway || {};
    const settings = gw.settings || {};
    const settingEntries = Object.entries(settings);
    const catMeta = CATEGORY_META[gw.category] || CATEGORY_META.card;

    // Group settings by type
    const toggleSettings = settingEntries.filter(([, s]) => s.type === "toggle");
    const fieldSettings = settingEntries.filter(([, s]) => s.type !== "toggle");

    return (
        <Layout>
            {paymentGatewayLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {paymentGatewayError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{paymentGatewayError}</AlertTitle></Alert>}
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate("/payment-gateways")} variant="outlined" size="small" color="inherit">
                                Back
                            </Button>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{width: 40, height: 40, bgcolor: catMeta.bg, color: catMeta.color}}>
                                    {React.cloneElement(catMeta.icon, {sx: {fontSize: 20}})}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{fontWeight: 700, lineHeight: 1.2}}>{gw.title || "Configure Gateway"}</Typography>
                                    <Chip label={catMeta.label} size="small" sx={{mt: 0.25, height: 20, fontSize: 10, fontWeight: 600, backgroundColor: catMeta.bg, color: catMeta.color}}/>
                                </Box>
                            </Stack>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button startIcon={<DeleteOutline/>} variant="outlined" color="error" size="small" onClick={handleDelete}>
                                Delete
                            </Button>
                            <Button startIcon={<Save/>} variant="contained" color="secondary" size="small" onClick={handleSave} disabled={paymentGatewayLoading || !dirty}>
                                {dirty ? "Save Changes" : "Saved"}
                            </Button>
                        </Stack>
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    <Grid container spacing={3}>
                        {/* Left Column - Settings */}
                        <Grid size={{xs: 12, md: 8}}>
                            {/* General Info */}
                            <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>General Information</Typography>
                                <Stack spacing={2.5}>
                                    <TextField
                                        label="Gateway Name"
                                        value={localTitle}
                                        onChange={e => { setLocalTitle(e.target.value); setDirty(true); }}
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Description"
                                        value={localDescription}
                                        onChange={e => { setLocalDescription(e.target.value); setDirty(true); }}
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Short description shown at checkout"
                                    />
                                    <TextField
                                        label="Method Description"
                                        value={localMethodDescription}
                                        onChange={e => { setLocalMethodDescription(e.target.value); setDirty(true); }}
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Detailed description of how this payment method works"
                                    />
                                </Stack>
                            </Paper>

                            {/* API / Credential Fields */}
                            {fieldSettings.length > 0 && (
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 0.5, fontWeight: 600}}>Configuration</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{mb: 2.5, display: "block"}}>
                                        Enter your API keys, credentials, and other configuration details
                                    </Typography>
                                    <Stack spacing={2.5}>
                                        {fieldSettings.map(([key, setting]) => (
                                            <SettingField
                                                key={key}
                                                settingKey={key}
                                                setting={setting}
                                                value={localSettings[key] || ""}
                                                onChange={handleSettingChange}
                                            />
                                        ))}
                                    </Stack>
                                </Paper>
                            )}

                            {/* Toggle Settings */}
                            {toggleSettings.length > 0 && (
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 0.5, fontWeight: 600}}>Options</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{mb: 2, display: "block"}}>
                                        Toggle features and modes for this gateway
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {toggleSettings.map(([key, setting]) => (
                                            <SettingField
                                                key={key}
                                                settingKey={key}
                                                setting={setting}
                                                value={localSettings[key] || "no"}
                                                onChange={handleSettingChange}
                                            />
                                        ))}
                                    </Stack>
                                </Paper>
                            )}
                        </Grid>

                        {/* Right Column - Status & Info */}
                        <Grid size={{xs: 12, md: 4}}>
                            {/* Status Card */}
                            <Paper elevation={0} sx={{p: 3, mb: 3, border: "1px solid", borderColor: localEnabled ? "border.green" : "divider"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{
                                    p: 1.5, borderRadius: 0,
                                    backgroundColor: localEnabled ? "light.green" : "background.default"
                                }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {localEnabled
                                            ? <CheckCircleOutline sx={{fontSize: 20, color: "text.green"}}/>
                                            : <Box sx={{width: 20, height: 20, borderRadius: 0, border: "2px solid", borderColor: "text.secondary"}}/>
                                        }
                                        <Typography variant="body2" sx={{fontWeight: 600, color: localEnabled ? "text.green" : "text.secondary"}}>
                                            {localEnabled ? "Gateway Enabled" : "Gateway Disabled"}
                                        </Typography>
                                    </Stack>
                                    <Switch
                                        checked={localEnabled}
                                        onChange={(e) => { setLocalEnabled(e.target.checked); setDirty(true); }}
                                        color="secondary"
                                    />
                                </Stack>
                                <Typography variant="caption" color="text.secondary" sx={{mt: 1.5, display: "block"}}>
                                    {localEnabled
                                        ? "This gateway is visible to customers at checkout."
                                        : "Enable this gateway to make it available at checkout."
                                    }
                                </Typography>
                            </Paper>

                            {/* Gateway Info */}
                            <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Gateway Info</Typography>
                                <Stack spacing={1.5}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Category</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 0.5}}>
                                            <Avatar sx={{width: 24, height: 24, bgcolor: catMeta.bg, color: catMeta.color}}>
                                                {React.cloneElement(catMeta.icon, {sx: {fontSize: 14}})}
                                            </Avatar>
                                            <Typography variant="body2" sx={{fontWeight: 500}}>{catMeta.label}</Typography>
                                        </Stack>
                                    </Box>
                                    <Divider/>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Method Title</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 500}}>{gw.method_title || "—"}</Typography>
                                    </Box>
                                    <Divider/>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Settings Count</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 500}}>{settingEntries.length} configurable fields</Typography>
                                    </Box>
                                    <Divider/>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Display Order</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 500}}>#{gw.order || "—"}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* Quick Actions */}
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Quick Actions</Typography>
                                <Stack spacing={1.5}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        fullWidth
                                        onClick={handleSave}
                                        disabled={!dirty}
                                        startIcon={<Save/>}
                                    >
                                        Save Configuration
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        fullWidth
                                        onClick={handleDelete}
                                        startIcon={<DeleteOutline/>}
                                    >
                                        Remove Gateway
                                    </Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Snackbar
                open={saved}
                autoHideDuration={3000}
                onClose={() => setSaved(false)}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert severity="success" onClose={() => setSaved(false)} sx={{width: "100%"}}>
                    Gateway configuration saved successfully
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default PaymentGatewayDetailPage;
