import React, {ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useEffect, useState} from "react";
import {Button, Icon, Popover, Stack, TextField, Tooltip, Typography} from "@mui/material";
import localization from "../utilities/localization"
import DropdownMenu from "./DropdownMenu";
import {useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {getApiKey, getProject, updateProject} from "../queries/project-requests";
import {colors} from "../style/globalStyle";
import {AxiosError} from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {groups} from "../utilities/constants";
import {useNotification} from "../context/NotificationContext";
import {useUserContext} from "../context/UserContext";

interface DialogProps {
    setOpen: Dispatch<SetStateAction<boolean>>
}

/**
 * The project settings which opens if you press on the gear icon. The settings can only be changed if required
 * permissions is met.
 * @param {DialogProps} dialogProps
 */
const ProjectSettingsContent: React.FunctionComponent<DialogProps> = ({setOpen}: DialogProps) => {
    const {projectId} = useParams() as { projectId: string }
    const queryClient = useQueryClient()
    const {isError, isSuccess, data} = useQuery(["projectDetails", projectId], () => getProject(projectId))
    const [projectName, setProjectName] = useState<string>("")
    const [threshold, setThreshold] = useState<string>("")
    const [apiKey, setApiKey] = useState("");
    const {data: fetchedApiKey, refetch} = useQuery("apiKey", () => getApiKey(projectId), {enabled: false})
    const user = useUserContext();
    const notification = useNotification();

    useEffect(() => {
        if (isSuccess) {
            setProjectName(data?.data.projectName);
            setThreshold(data?.data.deploymentThreshold);
        }

        if (isError) {
            notification.error(localization.notificationMessage.errorDataFetch);
        }
    }, [data, isError, isSuccess])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        if (apiKey === "" || apiKey === undefined){
            refetch().then(() => notification.warn(localization.notificationMessage.apiKeyCreationWarning));
        }
    };

    useEffect(() => {
        // @ts-ignore
        setApiKey(fetchedApiKey?.data);
    }, [fetchedApiKey?.data])

    const CopyIcon: FunctionComponent = () => {
        const handleClickCopy = () => {
            navigator.clipboard.writeText(apiKey)
            notification.success(localization.notificationMessage.saveToClipboardSuccess);
            handleClose();
        }
        return(
            <Icon onClick={handleClickCopy}
                  sx={{"&:hover": "pointer"}}>
                <ContentCopyIcon></ContentCopyIcon>
            </Icon>
        )
    }

    /**
     * Is called if the save button has been pressed. Saves the updated settings and invalidates old data.
     */
    const handleSave = useMutation(() => updateProject(projectId, {
        projectId: projectId,
        projectName: projectName,
        deploymentThreshold: threshold
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["projectDetails", projectId]);
            notification.success(localization.notificationMessage.saveSuccessfully);
            setOpen(false);
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 403) {
                notification.error(localization.notificationMessage.missingPermission);
            } else {
                notification.error(localization.notificationMessage.settingsSaveFailed);
            }
        }
    })

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClose = () => {
        setApiKey("");
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Stack>
            <Stack direction={"column"} sx={{margin: "0px 25px 0px 25px"}}>
                <TextField
                    label={localization.dialog.projectName}
                    value={projectName}
                    variant="filled"
                    error={projectName.length > 20}
                    helperText={projectName.length > 20 ? localization.dialog.projectNameHelperToLong : ""}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setProjectName(e.target.value)}
                />
                <Stack mt={"2rem"}>
                    <Typography variant={"body1"}>{localization.ProjectPage.deploymentThresholdTitle}</Typography>
                    <DropdownMenu readOnly={false}
                                  labelValueMap={localization.misc.deploymentThreshold}
                                  colorValueMap={colors.threshold}
                                  choices={Object.keys(localization.misc.deploymentThreshold)}
                                  state={{value: threshold, setValue: setThreshold}}/>
                </Stack>
                {user.hasGroups(groups.admin.id) ? <Stack sx={{
                    marginTop: "2rem",
                    marginBottom: "2rem"
                }}>
                  <Stack>
                    <Button variant="contained" onClick={handleClick}>
                      {localization.ProjectPage.apiKeyButtonText}
                    </Button>
                    <Stack sx={{flexDirection:"row", justifyContent:"flex-end"}}>
                      <Tooltip placement="bottom" title={localization.toolTips.overwritingAPIKey}>
                        <ErrorOutlineIcon sx={{ml: "70%", scale:"0.7", margin:"-0.2rem -0.2rem 0 0"}} color={"error"}/>
                      </Tooltip>
                    </Stack>
                  </Stack>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <TextField
                            value={apiKey}
                            variant="filled"
                            InputProps={{
                                readOnly: true,
                                endAdornment: <CopyIcon></CopyIcon>,
                                sx: {
                                    width: "25rem",
                                    cursor: "pointer"
                                }
                            }}
                        />
                    </Popover>
                </Stack> : null}
                <Stack sx={buttonContainerStyle}>
                    <Button color={"error"} onClick={() => setOpen(false)}>{localization.misc.cancel}</Button>
                    <Button color={"success"} onClick={() => handleSave.mutate()}>{localization.misc.save}</Button>
                </Stack>
            </Stack>
        </Stack>
    )
}

/**************
 * Styles
 **************/

const buttonContainerStyle = {
    flexDirection: "row",
    marginTop: "3rem",
    marginBottom: "1rem",
    justifyContent: "center"
}

export default ProjectSettingsContent