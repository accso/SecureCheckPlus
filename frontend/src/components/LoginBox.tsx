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
import apiClient from "../queries/apiClient";

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

    // Debug: component mounted
    console.debug && console.debug("LoginBox mounted", { usernameInit: username, passwordInit: password });

    /**
     * If submit button is pressed redirect request to AuthProvider.
     * Submits on enter or on click.
     * @param clicked
     * @param e
     */
    const onConfirm = async (clicked: boolean = false, e?: React.KeyboardEvent): Promise<void> => {
        console.debug("LoginBox.onConfirm called", { clicked, key: e?.key, username, password, stayLoggedIn });
        // @ts-ignore handled by first statement
        if ((e === undefined && clicked) || (e && e.key === "Enter")) {
            // Previously we required an '@' in the username (email). Some deployments/users use plain
            // usernames — allow any non-empty username so the request is triggered. Keep a minimal check.
            if (username && username.trim().length > 0) {
                // CSRF-Token vorab holen – Fehler werden ignoriert,
                // da der Login-POST auch ohne vorheriges Cookie funktioniert.
                // GET /api/login liefert 405 (nur POST erlaubt), setzt aber das csrftoken-Cookie.
                try {
                    console.debug("Fetching CSRF token via GET api/login ...");
                    await apiClient.get(urlAddress.api.login);
                } catch (csrfErr: any) {
                    // 405 Method Not Allowed ist erwartet – csrftoken-Cookie wird trotzdem gesetzt.
                    console.debug("CSRF pre-fetch finished (status ignored):", csrfErr?.response?.status);
                }

                try {
                    console.debug("Calling login() with", { username, stayLoggedIn });
                    await login({
                        username: username,
                        password: password,
                        keepMeLoggedIn: stayLoggedIn,
                    });
                    console.debug("login() successful");
                    reloadPage();
                } catch (err: any) {
                    console.error("Login failed:", err);
                    if (err?.response?.status === 401 || err?.response?.status === 403) {
                        notification.error(localization.notificationMessage.incorrectLogin);
                    } else {
                        notification.error(localization.notificationMessage.serverError || "Server error");
                    }
                }
            } else {
                console.debug("username empty", username);
                notification.warn(localization.notificationMessage.usernameIsNotMail)
            }
        }
    }

    const reloadPage = () => {
        // Navigate to the main app (loads app.js bundle via nginx → index.html)
        window.location.href = '/';
    }

    // New: submit handler for semantic form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.debug('Login form submitted', { username, password, stayLoggedIn });
        // Call existing onConfirm to run the login flow (clicked=true -> triggers login attempt)
        await onConfirm(true);
    }

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack sx={loginContainer}>
         <Stack sx={flagContainer}>
                 <ImageDropDown texts={allLanguages.names}
                                values={allLanguages.abbreviations}
                                /*imageURLs={allLanguages.flagURLs}*/
                                imagesOnly={false}
                                localStorageItemKey={localStorageItemKeys.selectedLanguage}
                                defaultIndex={defaultLanguageIndex != -1 ? defaultLanguageIndex : 0}
                                onSelectionChange={reloadPage}
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
                                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUsername(e.target.value)}/>
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
                                           onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
                                            InputProps={{ style: { paddingRight: `${eyeIconSize + 24}px` } }} />
                            <Stack sx={{ ...eye, zIndex: 2, pointerEvents: 'auto' }} onClick={() => setVisible(!visible)}>
                                    {visible ? <img src={urlAddress.media.rootUrlWithBase + urlAddress.media.eye} height={eyeIconSize} width={eyeIconSize} alt="show"/>
                                        : <img src={urlAddress.media.rootUrlWithBase + urlAddress.media.eyeCrossed} height={eyeIconSize} width={eyeIconSize} alt="hide"/>}
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
                     type="submit"
                     startIcon={<LoginRoundedIcon/>}
             >{language.loginPage.buttonLabel}
             </Button>
        </Stack>
        </form>
    )
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