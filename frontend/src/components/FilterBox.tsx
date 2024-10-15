import React, {useState} from "react";
import {Box, Checkbox, Chip, ListItemIcon, ListItemText, MenuItem, Select} from "@mui/material";
import localization from "../utilities/localization"
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import {FilterBoxProps} from "../utilities/interfaces/FilterBoxProps";
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';

/**
 * A multiselect dropdown box based on the given properties.
 * @param {FilterBoxProps} props
 */
const FilterBox: React.FunctionComponent<FilterBoxProps> = (props: FilterBoxProps) => {
    const allSelected = props.selected.length === props.values.length;
    const [open, setOpen] = useState(false);

    const handleChange = (e: any) => {
        const value = e.target.value;
        if (value[value.length - 1] === "all") {
            if (allSelected)
                props.setSelected([]);
            else
                props.setSelected(props.values);
            return;
        }
        props.setSelected(value);
    }

    /**
     * On click at the chip, removes the corresponding filter from the list of active filters.
     * @param value
     */
    const handleChip = (value: string) => {
        props.setSelected(props.selected.filter(element => element !== value))
    }

    return (
        <Select multiple
                onChange={handleChange}
                sx={filterBoxStyle}
                IconComponent={props.arrowIcon ? props.arrowIcon : KeyboardDoubleArrowDownRoundedIcon}
                style={{background: props.background != null ? props.background : "transparent",minHeight: "2.5rem", borderRadius: "0.5rem",}}
                disableUnderline={true}
                variant={"standard"}
                value={props.selected}
                renderValue={(selected) => (
                    <Box sx={chipBoxStyle}>
                        {selected.map((value) => (
                            <Chip key={value}
                                  label={props.labelMap[value as keyof typeof props.labelMap]}
                                  deleteIcon={
                                      <CancelRoundedIcon
                                          onMouseDown={(e: React.MouseEvent<SVGSVGElement>) => e.stopPropagation()}
                                      />
                                  }
                                  onDelete={() => handleChip(value)}
                                  sx={{backgroundColor: props.colors[props.values.indexOf(value)]}}
                            />)
                        )}
                    </Box>)}>
            <MenuItem value="all">
                <ListItemIcon>
                    <Checkbox
                        checked={allSelected}
                        indeterminate={
                            props.selected.length > 0 && props.selected.length < props.values.length
                        }
                    />
                </ListItemIcon>
                <ListItemText
                    primary={localization.filterBox.selectAll}
                />
            </MenuItem>
            {props.values.map((value) => (
                <MenuItem key={value} value={value}>
                    <ListItemIcon>
                        <Checkbox checked={props.selected.indexOf(value) > -1}/>
                    </ListItemIcon>
                    <ListItemText primary={props.labelMap[value as keyof typeof props.labelMap]}/>
                </MenuItem>
            ))}
        </Select>
    )
}

/**************
 * Styles
 **************/

const filterBoxStyle = {
    width: "60%",
}

const chipBoxStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
    paddingLeft: 1,
    paddingRight: 1,
}

export default FilterBox