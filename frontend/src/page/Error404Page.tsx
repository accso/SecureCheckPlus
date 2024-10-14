import React, {useEffect} from "react";
import {Stack, Typography} from "@mui/material";
import localization from "../utilities/localization"
import {urlAddress} from "../utilities/constants";
import Button from "@mui/material/Button";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {mainTheme} from "../style/globalStyle";
import {motion} from "framer-motion";
import {pageMotion} from "../style/animation";
import {unknownPage} from "../queries/misc-requests";

/**
 * The page that is displayed if objects or pages could not be found.
 */
const Error404Page: React.FunctionComponent = () => {
    document.title = localization.pageTitles.error
    useEffect(() => {unknownPage()}, [])
    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageMotion}>
            <Stack sx={containerStyle}>
                <Typography variant={"h4"}
                            sx={titleStyle}>{localization.notificationMessage.errorPageTitle}</Typography>
                <Typography variant={"h5"}
                            color={mainTheme.palette.primary.main}>{localization.notificationMessage.errorPageSubtitle}</Typography>
                <img alt="Error 404 image" width={"30%"} src={urlAddress.media.rootUrlWithBase + urlAddress.media.error404}/>
                <Button sx={button}
                        variant="contained"
                        startIcon={<ArrowBackRoundedIcon/>}
                        onClick={() => history.back()}
                >{localization.misc.back}</Button>
            </Stack>
        </motion.div>)
}

/**************
 * Styles
 **************/

const containerStyle = {
    width: "100%",
    height: "100%",
    direction: "column",
    marginTop: "5rem",
    alignItems: "center",
    justifyContent: "center"
}

const titleStyle = {
    fontWeight: "700",
    color: mainTheme.palette.primary.main,
}

const button = {
    margin: "2rem 0 0 1.5rem",
    width: "10rem"
}

export default Error404Page