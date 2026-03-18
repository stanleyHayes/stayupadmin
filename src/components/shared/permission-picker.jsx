import React from "react";
import {
    Box, Checkbox, Divider, FormControlLabel, Paper, Stack,
    Typography, Button
} from "@mui/material";
import { PERMISSION_GROUPS, ALL_PERMISSIONS } from "../../utils/permissions";

/**
 * Reusable permission picker grid.
 *
 * Props:
 *   - value: string[] — currently selected permission keys
 *   - onChange: (permissions: string[]) => void
 *   - disabled: boolean
 */
const PermissionPicker = ({ value = [], onChange, disabled = false }) => {
    const selected = new Set(value);

    const toggle = (key) => {
        const next = new Set(selected);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        onChange([...next]);
    };

    const toggleGroup = (group) => {
        const keys = group.permissions.map(p => p.key);
        const allSelected = keys.every(k => selected.has(k));
        const next = new Set(selected);
        keys.forEach(k => allSelected ? next.delete(k) : next.add(k));
        onChange([...next]);
    };

    const selectAll = () => onChange([...ALL_PERMISSIONS]);
    const clearAll = () => onChange([]);

    return (
        <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button size="small" variant="outlined" color="secondary" onClick={selectAll} disabled={disabled}>
                    Select All
                </Button>
                <Button size="small" variant="outlined" onClick={clearAll} disabled={disabled}>
                    Clear All
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center", ml: 1 }}>
                    {value.length} of {ALL_PERMISSIONS.length} selected
                </Typography>
            </Stack>

            {PERMISSION_GROUPS.map((group, gi) => {
                const keys = group.permissions.map(p => p.key);
                const allChecked = keys.every(k => selected.has(k));
                const someChecked = keys.some(k => selected.has(k)) && !allChecked;

                return (
                    <Paper key={gi} elevation={0} sx={{ p: 2, mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={allChecked}
                                    indeterminate={someChecked}
                                    onChange={() => toggleGroup(group)}
                                    disabled={disabled}
                                    color="secondary"
                                />
                            }
                            label={
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    {group.label}
                                </Typography>
                            }
                        />
                        <Divider sx={{ my: 1 }} />
                        <Stack direction="row" flexWrap="wrap" sx={{ pl: 3 }}>
                            {group.permissions.map((perm) => (
                                <FormControlLabel
                                    key={perm.key}
                                    sx={{ minWidth: 220 }}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={selected.has(perm.key)}
                                            onChange={() => toggle(perm.key)}
                                            disabled={disabled}
                                            color="secondary"
                                        />
                                    }
                                    label={<Typography variant="body2">{perm.label}</Typography>}
                                />
                            ))}
                        </Stack>
                    </Paper>
                );
            })}
        </Box>
    );
};

export default PermissionPicker;
