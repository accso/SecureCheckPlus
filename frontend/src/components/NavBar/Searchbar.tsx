import React, {SyntheticEvent, useEffect, useState} from "react";
import {Autocomplete, InputAdornment, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {useQuery} from "react-query";
import {getAllProjectsFlat} from "../../queries/project-requests";
import {useNavigate} from "react-router-dom";
import localization from "../../utilities/localization";
import {Project} from "../../utilities/interfaces/Project";
import {mainTheme} from "../../style/globalStyle";
import {useNotification} from "../../context/NotificationContext";
import {ArrowDropDownIcon} from "@mui/x-date-pickers";
import {useConfig} from "../../context/ConfigContext";

/**
 * The searchbar with suggestions. All suggestions are fetched internally via API.
 * @return {JSX.Element}
 */

export default function Searchbar() {
    const navigate = useNavigate();
    const {baseUrl} = useConfig();
    const notification = useNotification();
    const [allProjects, setAllProjects] = useState<Project[]>([])
    const {isError, isSuccess, data} = useQuery("allProjectsFlat", getAllProjectsFlat)

    useEffect(() => {
        if (isSuccess)
            setAllProjects(data?.data)
        if (isError) {
            notification.error(localization.notificationMessage.errorDataFetch);
        }
    }, [data, isError, isSuccess])


    /**
     * Navigates on click at the suggestions.
     * @param projectId
     */
    const handleNavigation = (projectId: string) => {
        navigate(baseUrl ? `/${baseUrl}/projects/${projectId}` : "/projects/" + projectId)
    }

    /**
     * Supports keyboard navigation for the searchbar.
     * @param e - Can be ignored, serves no purpose.
     * @param {Project} project - The project that is selected.
     */
    const handleSelection = (project: Project | null) => {
        if (project !== null) {
            handleNavigation(project.projectId)
        }
    }

    return (<Box width={"15rem"}>
            <Autocomplete
                noOptionsText={localization.misc.noProjectsFound}
                onChange={(e: SyntheticEvent, project: Project | null) => handleSelection(project)}
                autoComplete
                popupIcon={<ArrowDropDownIcon sx={{color: mainTheme.palette.primary.contrastText}}/>}
                renderInput={
                    (params) => (
                        <TextField
                            {...params}
                            InputProps={{
                                disableUnderline: true,
                                ...params.InputProps,
                                type: "search",
                                autoComplete: "new-password",
                                style: inputStyle,
                                startAdornment: (
                                    <InputAdornment position="start" style={{marginBottom: "0.5rem"}}>
                                        <SearchRoundedIcon color={"secondary"}/>
                                    </InputAdornment>
                                ),
                            }}
                            placeholder={localization.navbar.searchbarPlaceholder}
                            hiddenLabel={true}
                            size="small"
                            variant="filled"
                        />)}
                options={allProjects}
                getOptionLabel={(option) => (option.projectId)}
                renderOption={(props, option) => (
                    <Box
                        component="li"
                        {...props}
                        onClick={() => handleNavigation(option.projectId)}
                        sx={suggestionStyle}>
                        {option.projectId} {option.projectName === "" ? "" : "(" + option.projectName + ")"}
                    </Box>
                )}
            />
        </Box>
    );
}

/**************
 * Styles
 **************/

const inputStyle = {
    borderRadius: "3px",
    backgroundColor: mainTheme.palette.primary.light,
    color: mainTheme.palette.primary.contrastText,
    height: "2.3rem",
}

const suggestionStyle = {
    color: mainTheme.palette.primary.main,
    backgroundColor: mainTheme.palette.background.paper,
    "&:hover": {color: mainTheme.palette.secondary.main}
}
