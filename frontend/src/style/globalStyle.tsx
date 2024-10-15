import {createTheme} from "@mui/material";

export const mainTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: '#003c3c',
            contrastText: '#00CB75',
        },
        secondary: {
            main: '#00CB75',
            contrastText: '#003c3c',
        },
        background: {
            default: '#F0F2F5',
            paper: "#ffffff"
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        fontWeightLight: 300,
        h1: {
            fontSize: "4rem",
            fontWeight: 500
        },
        h3: {
            fontSize: "2rem",
            fontWeight: 500
        },
    },
})

export const colors = {
    severity: {
        CRITICAL: "#FF3F3F",
        HIGH: "#FF7F00",
        MEDIUM: "#FFEB83",
        LOW: "#00CB75",
        NONE: "#CCA9DD",
        NA: "#90C2E7"
    },
    status: {
        REVIEW: "#90C2E7",
        REVIEW_AGAIN: "#90C2E7",
        THREAT: "#FF3F3F",
        THREAT_WIP: "#FF3F3F",
        THREAT_FIXED: "#00CB75",
        NO_THREAT: "#00CB75",
    },
    solution: {
        NO_SOLUTION_NEEDED: "#00CB75",
        CHANGE_VERSION: "#FFEB83",
        CHANGE_DEPENDENCY: "#FF7F00",
        PROGRAMMING: "#fa6d2b",
        NO_SOLUTION: "#FF3F3F"
    },
    threshold: {
        ALWAYS: "#90C2E7",
        CRITICAL: "#FF3F3F",
        HIGH: "#FF7F00",
        MEDIUM: "#FFEB83",
        LOW: "#00CB75",
        NONE: "#FFFFFF",
        NEVER: "#90C2E7"
    }
    ,
    vulnerabilityVector: {
        attackVector: {
            NETWORK: "#FF3F3F",
            ADJACENT: "#FF7F00",
            LOCAL: "#FFEB83",
            PHYSICAL: "#00CB75"
        },
        attackComplexity: {
            LOW: "#FF3F3F",
            HIGH: "#FF7F00"
        },
        privilegesRequired: {
            NONE: "#FF3F3F",
            LOW: "#FF7F00",
            HIGH: "#FFEB83"
        },
        userInteraction: {
            NONE: "#FF3F3F",
            REQUIRED: "#FFEB83"
        },
        impactMetrics: {
            HIGH: "#FF3F3F",
            LOW: "#FFEB83",
            NONE: "#FFFFFF"
        },
        scope: {
            CHANGED: "#FF3F3F",
            UNCHANGED: "#FFFFFF"
        }
    },
}