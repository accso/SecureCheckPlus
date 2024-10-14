import React from "react";

export interface InfoBoxProps {
    /**
     * The component that should be placed in the body.
     */
    component: React.ReactNode
    /**
     * The component that should be place in the header.
     */
    headerComponent?: React.ReactNode
}