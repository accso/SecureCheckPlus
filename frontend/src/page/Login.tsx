import React, {useState} from "react";
import LoginBox from "../components/LoginBox";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {urlAddress} from "../utilities/constants";
import localization from "../utilities/localization"
import {pageMotion} from "../style/animation";
import {motion} from "framer-motion";
import CustomDialog from "../components/CustomDialog";
import {Button} from "@mui/material";

/**
 * The login page of the app.
 */
const Login: React.FunctionComponent = () => {
    document.title = localization.pageTitles.login;

    const cookieAgreed = () => {
        const value = localStorage.getItem("cookieDialog");
        return value === "allowed";
    }

    const [isOpenCookieDialog, setOpenCookieDialog] = useState(!cookieAgreed());

    function agree() {
        localStorage.setItem("cookieDialog", "allowed");
        setOpenCookieDialog(false);
    }

    const dialogContent = (<Stack direction={"column"}>
        <Typography paragraph={true}>{localization.dialog.cookieDialog.cookieContentText}</Typography>
        <Stack sx={buttonContainerStyle}>
            <Button color={"error"}
                    onClick={() => window.history.back()}>{localization.dialog.cookieDialog.denyCookies}</Button>
            <Button color={"success"} onClick={() => agree()}>{localization.dialog.cookieDialog.acceptCookies}</Button>
        </Stack>
    </Stack>)

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageMotion}>
            <CustomDialog title={localization.dialog.cookieDialog.cookieTitle}
                          dialogContent={dialogContent}
                          openState={{value: isOpenCookieDialog, setValue: setOpenCookieDialog}}/>
            <Stack sx={max_container}>
                <Stack sx={container}>
                    <Box sx={image_container}>
                        <Typography sx={title} variant="h1" style={{fontSize: "1.9rem", fontWeight:"100", marginBottom:"15%"}}>{localization.loginPage.title}</Typography>
                        <Typography sx={title} variant="body2">{localization.loginPage.subTitle}</Typography>
                        <Box sx={image(`url(${urlAddress.media.rootUrlWithBase}${urlAddress.media.loginPageBackground})`)}/>
                    </Box>
                    <Box sx={login_box_container}>
                        <LoginBox/>
                    </Box>
                </Stack>
            </Stack>
        </motion.div>
    );
}


/**************
 * Styles
 **************/

const buttonContainerStyle = {
    flexDirection: "row",
    marginTop: "3rem",
    marginBottom: "1rem",
    justifyContent: "center",
}

const max_container = {
    width: "100%",
    height: "97.5vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

const container = {
    width: "85%",
    height: "85vh",
    display: "flex",
    flexDirection: "row",
}

const title = {
    color: "white",
    padding: "5vh 0 5vh 0"
}

const login_box_container = {
    background: "white",
    width: "65%",
    display: "block",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",

}

const image_container = {
    flexDirection: "column",
    width: "35%",
    marginRight: "2rem",
    textAlign: "center",
}

const image = (url: string) => {
  return {
    margin: "auto",
    display: "block",
    width: "70%",
    height: "70%",
    backgroundRepeat: "no-repeat",
    backgroundImage: url,
    }
}

export default Login
