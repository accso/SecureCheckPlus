import React, {useState} from "react";
import {urlAddress} from "../../utilities/constants";
import {Button, IconButton, Stack} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CustomDialog from "../CustomDialog";
import ProjectCreationContent from "./ProjectCreationContent"
import localization from "../../utilities/localization";
import Searchbar from "./Searchbar";
import Profile from "./Profile";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import {mainTheme} from "../../style/globalStyle";
import {useUserContext} from "../../context/UserContext";
import {useConfig} from "../../context/ConfigContext";

/**
 * The navigationbar which also contains the sidebar. Additional components like searchbar and profile can also
 * be passed as parameters. All child components will only be rendered if the user is authenticated.
 */
export default function Navbar() {
    const user = useUserContext();
    const location = useLocation();
    const navigate = useNavigate();
    const {baseUrl} = useConfig();
    const [sidebarIsOpen, setSidebarOpen] = useState(false)
    const [projectCreationMenuIsOpen, setOpenProjectCreationMenu] = useState(false);

    /**
     * The button to open and close the sidebar
     */
    const sidebarButton = user.username ? (
        <IconButton sx={{position: "absolute"}} onClick={toggleSidebarMenu}>
            <MenuRoundedIcon color={"secondary"}/>
        </IconButton>
    ) : null

    const secureCheckPlusLogoButton = (
        <Button sx={logoStyle} onClick={redirect}>
            <img alt={"SecureCheckPlus by Accso Logo"} src={urlAddress.media.rootUrlWithBase + urlAddress.media.logoHorizontal}/>
        </Button>
    )

    /**
     * This is used to toggle the sidebar by pressing the corresponding button.
     */
    function toggleSidebarMenu() {
        if (sidebarIsOpen) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true)
        }
    }

    /**
     * Redirects the user to standard path if he is authenticated.
     */
    function redirect() {
            navigate(baseUrl ? `/${baseUrl}` : urlAddress.redirects.standardAfterLogin)
    }

    return (
        <>
            <Stack sx={navbar}>
                {sidebarButton}
                {secureCheckPlusLogoButton}
                {user.username ? <Searchbar/> : null}
                {user.username ? <Profile/> : null}
            </Stack>

            <CustomDialog
                title={localization.dialog.createProject}
                dialogContent={<ProjectCreationContent setOpen={setOpenProjectCreationMenu}/>}
                openState={
                {
                    value: projectCreationMenuIsOpen,
                    setValue: setOpenProjectCreationMenu
                }
            }/>

            <Sidebar isOpen={sidebarIsOpen} onClose={() => setSidebarOpen(false)}/>

            <div style={breadcrumbContainerStyle}>
                <CustomBreadcrumbs pathname={location.pathname}/>
            </div>
        </>
    )

}

/************
 * Styles
 ************/

const logoStyle = {
    ml: "3rem",
    height: "2.8rem",
    "& img": {
        height: "100%"
    }
}

const navbar = {
    height: "2.8rem",
    width: "100vw",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    left: "0",
    top: "0",
    zIndex: "8",
    background: mainTheme.palette.primary.main
}

const breadcrumbContainerStyle = {
    marginTop: "3.5rem",
    marginBottom: "1rem",
    marginLeft: "5%"
}