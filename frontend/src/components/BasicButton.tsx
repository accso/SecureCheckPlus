import Button from "@mui/material/Button";
import React from "react";
import {SvgIconProps} from "@mui/material";
import {mainTheme} from "../style/globalStyle";

type BasicButtonProps = {
    label: string,
    bgcolor?: string,
    color?: string,
    variant?: "contained" | "text" | "outlined",
    disabled?: boolean
    onClick?: () => void
    sx?: { [key: string]: any }
    invert?: boolean
    startIcon?: React.ReactElement<SvgIconProps>
    endIcon?: React.ReactElement<SvgIconProps>
}

export default function BasicButton (props: BasicButtonProps){
    let sxProps: {[key: string]: any} = {};

    if (props.invert === undefined || !props.invert){
        sxProps["bgcolor"] = props.bgcolor === undefined ? mainTheme.palette.primary.main : props.bgcolor;
        sxProps["color"] = props.color === undefined ? mainTheme.palette.secondary.main : props.color;
    }else{
        sxProps["bgcolor"] = props.bgcolor === undefined ? mainTheme.palette.secondary.main : props.bgcolor;
        sxProps["color"] = props.color === undefined ? mainTheme.palette.primary.main : props.color;
    }

    sxProps = {...sxProps, ...props.sx, ...{"&:hover": {bgcolor: sxProps["bgcolor"]}}}

    return(
        <Button
            startIcon={props.startIcon === undefined ? null : props.startIcon}
            endIcon={props.endIcon === undefined ? null : props.endIcon}
            onClick={props.onClick === undefined ? () => {} : props.onClick}
            disabled={props.disabled === undefined ? false : props.disabled}
            sx={sxProps}
            variant={props.variant === undefined ? "contained" : props.variant}>
            {props.label}
        </Button>)
}