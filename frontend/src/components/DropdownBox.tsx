import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme, useTheme} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';

type DropdownBoxProps = {
    title?: string
    valueToLabelMap: object
    state: {
        value: string
        setValue: Dispatch<SetStateAction<string>>
    }
    /**
     * Arrow Icon
     */
    arrowIcon?: React.ElementType | undefined
}

export default function DropdownBox(props: DropdownBoxProps){
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent) => {
        props.state.setValue(event.target.value);
    };

    return(<>
            <InputLabel>{props.title}</InputLabel>
            <FormControl variant={"outlined"} focused={false} size={"small"}>
                <Select
                    value={props.state.value}
                    onChange={handleChange}
                    IconComponent={props.arrowIcon ? props.arrowIcon : KeyboardDoubleArrowDownRoundedIcon}
                    sx={dropdownStyle(theme)}
                >
                    {Object.keys(props.valueToLabelMap).map(key => <MenuItem value={key} key={key}>{props.valueToLabelMap[key as keyof typeof props.valueToLabelMap]}</MenuItem>)}
                </Select>
            </FormControl>
        </>
    )
}

const dropdownStyle = (theme: Theme) => {
    return {
        ml: "5px",
        borderRadius: "5px",
        boxShadow: 1,
        "& .MuiSvgIcon-root": {
            color: theme.palette.secondary.main
        }
    }
}