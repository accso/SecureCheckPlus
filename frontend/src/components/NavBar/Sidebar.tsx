import React, {Dispatch, SetStateAction} from "react";
import {Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {sideBarLower, sideBarUpper} from "../../utilities/constants";
import {useNavigate} from "react-router-dom";
import {useConfig} from "../../context/ConfigContext";

export interface SidebarProps {
    /**
     * The state variable as boolean, whether the sidebar is opened or closed.
     */
    isOpen: boolean
    /**
     * The state function to change the state variable.
     */
    onClose: Dispatch<SetStateAction<boolean>>
}

/**
 * A toggleable sidebar. Its contents are defined in the constants.tsx.
 * @param {SidebarProps} props
 */
export default function Sidebar(props: SidebarProps) {
    const navigate = useNavigate();
    const {baseUrl} = useConfig();

    /**
     * The top side of the divider containing mostly links to in app pages.
     * @param {NavigateFunction} navigate - A useNavigate() instance, to navigate the user on click.
     */
    const topList = (
        <List>
            {sideBarUpper[0].map((text, index) => (
                <ListItem sx={{borderRadius: "5px"}} button key={index}
                          onClick={() => navigate(baseUrl ? `/${baseUrl}${sideBarUpper[2][index] as string}` : sideBarUpper[2][index] as string)}>
                    <ListItemIcon>
                        {sideBarUpper[1][index]}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                </ListItem>
            ))}
        </List>
    )

    /**
     * The bottom side of the divider containing mostly external links.
     */
    const bottomList = (
        <List>
            {sideBarLower[0].map((text, index) => (
                <ListItem sx={{borderRadius: "5px"}} button key={index}
                          onClick={() => window.open(sideBarLower[2][index] as string)}>
                    <ListItemIcon>
                        {sideBarLower[1][index]}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                </ListItem>
            ))}
        </List>
    )

    return (
        <Drawer
            open={props.isOpen}
            onClose={props.onClose}
            variant="temporary"
            sx={sidebarStyle}>

            <Box sx={sidebarStyle}>
                {topList}
                <Divider/>
                {bottomList}
            </Box>
        </Drawer>
    )
}

/*************
 * Styles
 *************/
const sidebarStyle = {
    marginTop: "3rem",
    marginRight: "1rem",
    marginLeft: "1rem"
}