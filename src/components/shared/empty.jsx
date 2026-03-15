import {Box, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";

const Empty = ({title, message, icon, button}) => {
    return (
        <Box
            component={motion.div}
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94]}}
            sx={{
                backgroundColor: 'background.paper',
                padding: 4
            }}>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" justifyContent="center">
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4, delay: 0.15}}
                    >
                        {icon}
                    </motion.div>
                </Stack>
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.35, delay: 0.2}}>
                    <Typography sx={{color: 'text.primary'}} variant="h5" align="center">{title}</Typography>
                </motion.div>
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.35, delay: 0.3}}>
                    <Typography sx={{color: 'text.secondary'}} variant="body1" align="center">{message}</Typography>
                </motion.div>
                <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.35, delay: 0.4}}>
                    <Stack direction="row" justifyContent="center">
                        {button}
                    </Stack>
                </motion.div>
            </Stack>
        </Box>
    )
}

export default Empty;
