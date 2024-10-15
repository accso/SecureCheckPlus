import React from "react";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {DropdownProps} from "../utilities/interfaces/DropdownProps";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";

/**
 * A dropdown menu which takes several parameters and creates the dropdown based on the given parameter.
 * @param {DropdownProps} props
 */
const DropdownMenu: React.FunctionComponent<DropdownProps> = (props: DropdownProps) => {
    let backgroundColor = props.background != null ? props.background : "transparent";
    const handleChange = (e: SelectChangeEvent) => {
        props.state.setValue(e.target.value);
    };

    return (<>
            <Select disableUnderline={true}
                    variant={"standard"}
                    sx={dropdownStyle(props, backgroundColor)}
                    IconComponent={props.arrowIcon ? props.arrowIcon : KeyboardDoubleArrowDownRoundedIcon}
                    readOnly={props.readOnly === undefined ? false : props.readOnly}
                    autoWidth={true}
                    value={props.state.value}
                    onChange={handleChange}
                    MenuProps={{
                        style: {
                            maxHeight: 400,
                        },
                    }}
            >
                {props.choices.map((choice) =>
                    <MenuItem key={choice}
                              value={choice}>
                        {props.labelValueMap === undefined ? choice : props.labelValueMap[choice as keyof typeof props.labelValueMap]}
                    </MenuItem>)}
            </Select>
        </>
    )
}


/**************
 * Styles
 * @param props - The colorToValue Map, if none is given the background color will be white.
 *************/
const dropdownStyle = (props: DropdownProps, backgroundColor: string) => {
    return {
        padding: "0.5rem",
        borderRadius: "0.5rem",
        height: "2.5rem",
        fontSize: "1.2rem",
        textAlign: "center",
        background: props.colorValueMap === undefined ? backgroundColor : props.colorValueMap[props.state.value as keyof typeof props.colorValueMap],
        color: props.textColor != null ? props.textColor : "#000000",
    }
}

export default DropdownMenu