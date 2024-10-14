import React from "react";
import {Card, CardContent, CardHeader} from "@mui/material";
import {mainTheme} from "../style/globalStyle";
import {InfoBoxProps} from "../utilities/interfaces/InfoBoxProps";


/**
 * A card component to display data. It has a header and a body.
 * @param {InfoBoxProps} component
 */
const InfoBox: React.FunctionComponent<InfoBoxProps> = (component: InfoBoxProps) => {
    return (
        <Card sx={boxProps(component)} elevation={3}>
            {component.headerComponent === undefined ? null :
                <CardHeader subheader={component.headerComponent} sx={headerStyle}/>}
            <CardContent sx={boxProps(component.headerComponent)}>
                {component.component}
            </CardContent>
        </Card>
    )
}

/**************
 * Styles
 **************/

const boxProps = (headerComponent: React.ReactNode) => {
    return {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: mainTheme.palette.primary.main,
        borderRadius: "0.5rem",
        paddingTop: headerComponent === undefined ? "2rem" : 0,
    }
}

const headerStyle = {
    height: "2rem",
    width: "100%",
    paddingBottom: 0,
    paddingTop: 0
}

export default InfoBox

