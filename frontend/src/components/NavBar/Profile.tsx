import {Avatar, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Logout, Settings} from "@mui/icons-material";
import localization from "../../utilities/localization";
import {urlAddress} from "../../utilities/constants";
import {useQuery} from "react-query";
import {getUserData, logout} from "../../queries/user-requests";
import CustomDialog from "../CustomDialog";
import UserSettingsContent from "../UserSettingsContent";
import {mainTheme} from "../../style/globalStyle";
import {useNotification} from "../../context/NotificationContext";
import {useUserContext} from "../../context/UserContext";

/**
 * The profile icon seen in the navbar. Also contains the user settings menu if opened.
 * The data is fetched internally using the server API.
 */
export default function Profile() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const user = useUserContext();
    const notification = useNotification();
    const {data: userData, isSuccess, isError} = useQuery("userData", getUserData)
    const [userSettingsState, setUserSettingsState] = useState(false)
    const [imageHash, setImageHash] = useState(userData?.data.imageHash)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (isError) {
            notification.error(localization.notificationMessage.errorUserDataFetch);
        } else if (isSuccess) {
            setImageHash(userData?.data.imageHash)
        }
    }, [userData])

    return (
        <>
            <Stack direction={"row"} alignItems={"center"}>
                <Typography sx={usernameStyle}>{user.username}</Typography>
                <Tooltip title={localization.navbar.profileIconTooltip}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{mr: "2rem"}}
                    >
                        <Avatar sx={avatarStyle} src={urlAddress.media.avatar + imageHash}/>
                    </IconButton>
                </Tooltip>
            </Stack>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                PaperProps={menuStyle}
            >
                <MenuItem sx={menuElementStyle} onClick={() => setUserSettingsState(true)}>
                    <ListItemIcon>
                        <Settings fontSize="small" color="secondary"/>
                    </ListItemIcon>
                    {localization.navbar.settings}
                </MenuItem>
                <MenuItem sx={menuElementStyle} onClick={() => {
                    logout();
                    setTimeout(function() {
                        location.reload();
                    }, 150);
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" color="secondary"/>
                    </ListItemIcon>
                    {localization.navbar.logout}
                </MenuItem>
            </Menu>
            <CustomDialog title={localization.dialog.userSettingsTitle}
                          openState={{
                              value: userSettingsState,
                              setValue: setUserSettingsState
                          }}
                          dialogContent={<UserSettingsContent setOpen={setUserSettingsState}/>}/>
        </>
    );
}

/*************
 * Styles
 *************/

const menuStyle = {
    elevation: 0,
    sx: {
        backgroundColor: mainTheme.palette.primary.main,
        color: mainTheme.palette.primary.contrastText,
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            backgroundColor: mainTheme.palette.primary.contrastText,
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
        },
    },
}

const menuElementStyle = {
    "&:hover": {
        backgroundColor: "white",
        color: "black"
    }
}

const avatarStyle = {
    width: 32,
    height: 32,
}

const usernameStyle = {
    fontSize: "1.2rem",
    mr: "1rem",
    color: mainTheme.palette.primary.contrastText,
}
