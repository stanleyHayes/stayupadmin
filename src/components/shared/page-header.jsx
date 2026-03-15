import {Box, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";
import {motion} from "framer-motion";

const PageHeader = ({title, subtitle, query, onQueryChange, searchPlaceholder = "Search...", action}) => (
    <Stack direction={{xs: "column", sm: "row"}} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
            <motion.div initial={{opacity: 0, x: -16}} animate={{opacity: 1, x: 0}} transition={{duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94]}}>
                <Box>
                    <Typography variant="h4" sx={{color: "text.heading", fontWeight: 700}}>{title}</Typography>
                    {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
                </Box>
            </motion.div>
            {action && (
                <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.3, delay: 0.15}}>
                    {action}
                </motion.div>
            )}
        </Stack>
        {onQueryChange && (
            <motion.div initial={{opacity: 0, x: 16}} animate={{opacity: 1, x: 0}} transition={{duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94]}} style={{width: "auto"}}>
                <TextField
                    value={query}
                    onChange={e => onQueryChange(e.target.value)}
                    size="small"
                    placeholder={searchPlaceholder}
                    sx={{minWidth: {xs: "100%", sm: 280}}}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlined sx={{fontSize: 20, color: "text.secondary"}}/>
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </motion.div>
        )}
    </Stack>
);

export default PageHeader;
