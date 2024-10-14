import React from "react";
import {useNavigate} from "react-router-dom";
import {Breadcrumbs, Link} from "@mui/material";
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import {mainTheme} from "../../style/globalStyle";
import localization from "../../utilities/localization";
import {useConfig} from "../../context/ConfigContext";
import {urlAddress} from "../../utilities/constants";

interface Path {
    /**
     * A single path variant corresponding on the current url location.
     */
    pathname: string
}

/**
 * The main breadcrumb container component and its breadcrumbs.
 * Generates breadcrumbs based on the current url location.
 * @return {JSX.Element}
 */
export default function CustomBreadcrumbs(path: Path) {
    const navigate = useNavigate();
    const {baseUrl} = useConfig();

    // Don't show Breadcrumbs on Error Page
    if (path.pathname.endsWith(urlAddress.api.unknownPage)) {
        return <></>;
    }

    const pathname = removeBaseUrl(path.pathname)
    const breadcrumbsPaths: string[] = []

    /**
     * Removes the baseUrl from the provided path with the option to keep a leading slash.
     */
    function removeBaseUrl(path: string, keepLeadingSlash = false) {
        if (baseUrl.length > 0) {
            const newPath = path.slice(baseUrl.length + 1);
            return keepLeadingSlash ? newPath : newPath.slice(1);
        }
        return keepLeadingSlash ? path : path.slice(1);
    }

    /**
     * Generates an array consisting of all natural link combination based on the current url location.
     * E.g. "this/is/my/path" => [this, this/is, this/is/my, this/is/my/path]
     */
    function generateBreadcrumbTexts() {
        const n = pathname.split("/").length
        for (let i = 1; i <= n; i++) {
            const breadcrumbPath = pathname.split("/", i)
            breadcrumbsPaths.push("/" + breadcrumbPath.join("/"))
        }
    }

    generateBreadcrumbTexts();

    /**
     * Generates a Link component with an onClick Event based on the given path.
     * @param {Path} path - BreadcrumbProps is basically just one of many path combinations
     *                                              mentioned in CustomBreadcrumbs.
     * @return {Link}
     */
    function BreadcrumbElement(path: Path) {

        function getName() {
            const breadcrumbElements = path.pathname.split("/")
            let lastElement = breadcrumbElements[breadcrumbElements.length - 1]
            lastElement = lastElement.replaceAll("%20", " ")

            if (Object.keys(localization.breadCrumbMap).includes(lastElement)) {
                return localization.breadCrumbMap[lastElement as keyof typeof localization.breadCrumbMap]
            }

            return lastElement.charAt(0).toUpperCase() + lastElement.slice(1)
        }

        return (
            <Link sx={breadcrumbStyle(removeBaseUrl(location.pathname, true), path.pathname)}
                  onClick={() => {
                      navigate(baseUrl + path.pathname)
                  }}>{getName()}</Link>)
    }

    return (
        <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small"/>}>
            {breadcrumbsPaths.map((path, index) => <BreadcrumbElement pathname={path} key={index}/>)}
        </Breadcrumbs>
    )
}

/*****************
 * Styles
 *****************/
const breadcrumbStyle = (path: string, breadcrumbPath: string) => {
    return {
        textDecoration: "none",
        color: path === breadcrumbPath ? mainTheme.palette.secondary.main : mainTheme.palette.primary.main,
        fontSize: "1.2rem",
        "&:hover": {
            cursor: "pointer",
            textDecoration: "underline"
        }
    }
}