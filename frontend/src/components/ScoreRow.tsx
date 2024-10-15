import React from "react";
import {Stack} from "@mui/material";
import {colors, mainTheme} from "../style/globalStyle";

export interface ScoreProps {
    /**
     * Text displayed
     */
    text: string
    /**
     * Big or small text
     */
    big: boolean
    /**
     * Score
     */
    score: number | string
}

function getScoreColor(props: ScoreProps) {
    if (!props.big || props.score === "–") return "transparent"

    if (props.score > 10) {
        return colors.severity.NA
    } else if (props.score >= 9) {
        return colors.severity.CRITICAL
    } else if (props.score >= 7) {
        return colors.severity.HIGH
    } else if (props.score >= 4) {
        return colors.severity.MEDIUM
    } else if (props.score >= 0.1) {
        return colors.severity.LOW
    } else if (props.score >= 0) {
        return colors.severity.NONE
    } else {
        return colors.severity.NA
    }
}

// Defines the row a score is presented in (e.g. Temporal Score)
const ScoreRow: React.FunctionComponent<ScoreProps> = (props: ScoreProps) => {
    return (
        <Stack sx={scoreRow(props)}>
            <Stack sx={scoreTitle((props.big))}>{props.text}</Stack>
            <Stack sx={scoreNumber(getScoreColor(props), props.big)}>{props.score}</Stack>
        </Stack>
    )
}

export default ScoreRow

/**************
 * Styles
 **************/

const scoreRow = (props: ScoreProps) => {
    return {
        flexDirection: "row",
        alignItems: "center",
        margin: props.big ? "0.3rem 0rem 0.3rem 0rem" : "0.2rem 0rem 0.2rem 0rem",
        justifyContent: "space-between",
    }
}

const scoreTitle = (big: boolean) => {
    return {
        fontSize: big ? "1.2rem" : "1rem",
        fontWeight: big ? "600" : "400",
    }
}

const scoreNumber = (backgroundColor: string, big: boolean) => {
    return {
        fontSize: big ? "1.2rem" : "1rem",
        fontWeight: big ? "600" : "400",
        width: "2rem",
        borderRadius: "0.5rem",
        background: backgroundColor,
        alignItems: "center",
        padding: "0.3rem"
    }
}