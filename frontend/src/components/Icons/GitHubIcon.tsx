import {Icon} from "@mui/material";
import {urlAddress} from "../../utilities/constants";

export default function GitHubIcon() {
    return (
        <Icon>
            <img src={urlAddress.media.rootUrlWithBase + urlAddress.media.gitHubIcon} height={22} width={22}/>
        </Icon>
    )
}