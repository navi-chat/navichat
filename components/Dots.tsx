"use client"

import { motion } from "motion/react"

function LoadingThreeDotsPulse() {
    const dotVariants = {
        pulse: {
            scale: [1, 1.3, 1],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut" as const,
            },
        },
    }

    return (
        <motion.div
            animate="pulse"
            transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
            className="container"
        >
            <motion.div className="dot bg-foreground/90" variants={dotVariants} />
            <motion.div className="dot bg-foreground/90" variants={dotVariants} />
            <motion.div className="dot bg-foreground/90" variants={dotVariants} />
            <StyleSheet />
        </motion.div>
    )
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
    return (
        <style>
            {`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
            }

            .dot {
                width: 3px;
                height: 3px;
                border-radius: 50%;
                will-change: transform;
            }
            `}
        </style>
    )
}

export default LoadingThreeDotsPulse
