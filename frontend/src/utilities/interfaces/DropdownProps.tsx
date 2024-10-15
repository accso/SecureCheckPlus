import React, {Dispatch, SetStateAction} from "react";

export interface DropdownProps {
    /**
     * A boolean whether the dropdown is read only.
     */
    readOnly?: boolean
    /**
     * An object containing the values as keys and the values as label. E.g. CRITICAL -> Critical
     *  => {Critical: "Critical"}
     */
    labelValueMap?: {}
    /**
     * An object which maps the values to a color. E.g. CRITICAL -> "#FFFFFF" => {CRITICAL: "#FFFFFF"}
     */
    colorValueMap?: {}
    /**
     * All values available to choose from. Should be consistent with colorMap and labelMap.
     */
    choices: string[]
    /**
     * A useState Hook to get and set the values chosen by the Dropdown menu.
     */
    state: {
        value: string
        setValue: Dispatch<SetStateAction<string>>
    }
    /**
     * Background color of the Dropdown.
     */
    background?: string
    /**
     * Text color of the Dropdown.
     */
    textColor?: string
    /**
     * Arrow Icon
     */
    arrowIcon?: React.ElementType | undefined
}