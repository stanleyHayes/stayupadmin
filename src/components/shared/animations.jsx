import {motion} from "framer-motion";
import React from "react";

// Fade up — for cards, KPI boxes, papers
export const FadeUp = ({children, delay = 0, duration = 0.45, y = 18, ...props}) => (
    <motion.div
        initial={{opacity: 0, y}}
        animate={{opacity: 1, y: 0}}
        transition={{duration, delay, ease: [0.25, 0.46, 0.45, 0.94]}}
        {...props}
    >
        {children}
    </motion.div>
);

// Fade in — for sections, text
export const FadeIn = ({children, delay = 0, duration = 0.4, ...props}) => (
    <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration, delay, ease: "easeOut"}}
        {...props}
    >
        {children}
    </motion.div>
);

// Scale in — for icons, badges
export const ScaleIn = ({children, delay = 0, duration = 0.35, ...props}) => (
    <motion.div
        initial={{opacity: 0, scale: 0.85}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration, delay, ease: [0.25, 0.46, 0.45, 0.94]}}
        {...props}
    >
        {children}
    </motion.div>
);

// Slide in from left
export const SlideInLeft = ({children, delay = 0, duration = 0.4, ...props}) => (
    <motion.div
        initial={{opacity: 0, x: -20}}
        animate={{opacity: 1, x: 0}}
        transition={{duration, delay, ease: [0.25, 0.46, 0.45, 0.94]}}
        {...props}
    >
        {children}
    </motion.div>
);

// Stagger container — wraps children that should animate in sequence
export const StaggerContainer = ({children, stagger = 0.06, delay = 0, ...props}) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            hidden: {},
            visible: {transition: {staggerChildren: stagger, delayChildren: delay}}
        }}
        {...props}
    >
        {children}
    </motion.div>
);

// Stagger item — child of StaggerContainer
export const StaggerItem = ({children, y = 14, ...props}) => (
    <motion.div
        variants={{
            hidden: {opacity: 0, y},
            visible: {opacity: 1, y: 0, transition: {duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94]}}
        }}
        {...props}
    >
        {children}
    </motion.div>
);

// Table row animation
export const AnimatedRow = ({children, index = 0, ...props}) => (
    <motion.tr
        initial={{opacity: 0, y: 8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3, delay: Math.min(index * 0.04, 0.4), ease: "easeOut"}}
        style={{display: "table-row"}}
        {...props}
    >
        {children}
    </motion.tr>
);
