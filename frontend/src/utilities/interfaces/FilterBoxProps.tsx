import React, {Dispatch, SetStateAction} from "react";

export interface FilterBoxProps {
    /**
     * A object which map values to a label.
     */
    labelMap: {}
    /**
     * Available filters to choose from.
     */
    values: string[]
    /**
     * Available colors to choose from. Should have the same order as the values.
     */
    colors: string[]
    /**
     * Set the selected filters.
     */
    setSelected: Dispatch<SetStateAction<string[]>>
    /**
     * The value of the selected filters.
     */
    selected: string[]
    /**
     * The title of the filterbox.
     */
    title: string
    /**
     * Background color of the filterbox.
     */
    background?: string
    /**
     * Arrow Icon
     */
    arrowIcon?: React.ElementType | undefined
}