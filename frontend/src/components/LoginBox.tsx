import React, {useState} from "react";
import localization from "../utilities/localization";
import language from "../utilities/localization";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button"
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import {useNotification} from "../context/NotificationContext";
import {login} from "../queries/user-requests";
import Typography from "@mui/material/Typography";
import {localStorageItemKeys, urlAddress} from "../utilities/constants";
import ImageDropDown from "./ImageDropDown";
import {getSupportedLanguages} from "../utilities/supportedLanguages";

/**
 * The login box at the login page. Takes the user inputs and requests an authentication process
 * through the AuthProvider
 */
const LoginBox: React.FunctionComponent = () => {
    const notification = useNotification();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const eyeIconSize = 25;
    let defaultLanguage = localStorage.getItem(localStorageItemKeys.defaultLanguage) ? localStorage.getItem(localStorageItemKeys.defaultLanguage) : null;
    let allLanguages = getSupportedLanguages();
    let defaultLanguageIndex = allLanguages.abbreviations.indexOf(defaultLanguage ? defaultLanguage : "");

    /**
     * If submit button is pressed redirect request to AuthProvider.
     * Submits on enter or on click.
     * @param clicked
     * @param e
     */
    const onConfirm = (clicked: boolean = false, e?: React.KeyboardEvent): void => {
        // @ts-ignore handled by first statement
        if ((e === undefined && clicked) || (e.key === "Enter")) {
            if (username.includes("@")) {
                login({
                    username: username,
                    password: password,
                    keepMeLoggedIn: stayLoggedIn,
                }).then(navigateAfterLogin).catch(() => {
                    notification.error(localization.notificationMessage.incorrectLogin)
                })
            } else {
                notification.warn(localization.notificationMessage.usernameIsNotMail)
            }
        }
    }

    const navigateAfterLogin = () => {
        window.location.reload();
    }

    return <Stack sx={loginContainer}
                   onKeyDown={(e) => onConfirm(false, e)}
    >
        <Stack sx={flagContainer}>
                <ImageDropDown texts={allLanguages.names}
                               values={allLanguages.abbreviations}
                               /*imageURLs={allLanguages.flagURLs}*/
                               imagesOnly={false}
                               localStorageItemKey={localStorageItemKeys.selectedLanguage}
                               defaultIndex={defaultLanguageIndex != -1 ? defaultLanguageIndex : 0}
                />
        </Stack>
        <Stack sx={headlineContainer}>
            <Typography sx={titleStyle} variant="h3">{localization.loginPage.login}</Typography>
                <Stack sx={formContainer}>
                    <Stack sx={emailRow}>
                             {/* <PersonRoundedIcon sx={icon}/> */}
                            <TextField sx={inputField}
                                       size="small"
                                       id="email"
                                       label={language.loginPage.userLabel}
                                       variant="filled"
                                       required
                                       value={username}
                                       onChange={e => setUsername(e.target.value)}/>
                        </Stack>
                    <Stack sx={passwordRow}>
                                {/* <PersonRoundedIcon sx={icon}/> */}
                                <TextField sx={inputField}
                                           size="small"
                                           id="password"
                                           label={language.loginPage.passwordLabel}
                                           variant="filled"
                                           type = {visible ? "text" : "password"} required
                                           value={password}
                                           onChange={e => setPassword(e.target.value)}/>
                            <Stack sx={eye} onClick={() => setVisible(!visible)}>
                                    {visible ? <img src={urlAddress.media.rootUrlWithBase + urlAddress.media.eye} height={eyeIconSize} width={eyeIconSize}/>
                                        : <img src={urlAddress.media.rootUrlWithBase + urlAddress.media.eyeCrossed} height={eyeIconSize} width={eyeIconSize}/>}
                            </Stack>
                        </Stack>
                </Stack>
        </Stack>
            <Stack sx={keepMeLoggedIn}>
                <input type="checkbox" style={checkbox} onClick={() => setStayLoggedIn(!stayLoggedIn)}/>
                <Typography variant="caption">{language.loginPage.checkBoxLabel}</Typography>
            </Stack>
            <Button sx={button}
                    variant="contained"
                    startIcon={<LoginRoundedIcon/>}
                    onClick={() => onConfirm(true)}
            >{language.loginPage.buttonLabel}
            </Button>
        </Stack>
}


/**************
 * Styles
 **************/

const loginContainer = {
    position: "relative",
    width: "100%",
    maxWidth: "90vh",
    margin: "auto",
    padding: "20px",

};

const flagContainer = {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: "2%",
    top: "5%",
}

const headlineContainer = {
    marginTop: "30%",
}

const titleStyle = {
    paddingBottom: "5%",
}

const formContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
}

const inputField = {
    width: "100%",
}


const emailRow = {
    display: "flex",
    alignItems: "center",
}

const passwordRow = {
    display: "flex",
    alignItems: "center",
    position: "relative",
}

const eye = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
}


const keepMeLoggedIn = {
    //T,R,B,L
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "15px",
}

const checkbox = {
    margin: "0px 5px 3px 0px",
}


const button = {
    width: "20%",
    height: "auto",
    marginTop: "3%",
}




export default LoginBox;