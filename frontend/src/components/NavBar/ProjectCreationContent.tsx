import {Button, Stack, TextField, Typography} from "@mui/material";
import {DialogContentProps} from "../CustomDialog"
import React, {ChangeEvent, useEffect, useState} from "react"
import {useMutation, useQuery, useQueryClient} from "react-query";
import {createProject, getAllProjectsFlat} from "../../queries/project-requests";
import localization from "../../utilities/localization";
import DropdownMenu from "../DropdownMenu";
import {colors} from "../../style/globalStyle";
import {AxiosError} from "axios";
import {useNotification} from "../../context/NotificationContext";


const CreationContent: React.FunctionComponent<DialogContentProps> = (dialogContentProps: DialogContentProps) => {
    const notification = useNotification();
    const {data} = useQuery("allProjectsFlat", getAllProjectsFlat)
    const [isInvalid, setInvalid] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState("");
    const [threshold, setThreshold] = useState("HIGH");
    const queryClient = useQueryClient()
    const [helperText, setHelperText] = useState("")
    const handleSave = useMutation(() => createProject(projectId, {
        projectName: projectName,
        deploymentThreshold: threshold
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("allProjectsFlat");
            queryClient.invalidateQueries("all");
            notification.success(localization.notificationMessage.saveSuccessfully);
            dialogContentProps.setOpen(false);
            setProjectId("");
            setThreshold("HIGH");
            setProjectName("");
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 403) {
                notification.error(localization.notificationMessage.missingPermission);
            } else {
                notification.error(localization.notificationMessage.settingsSaveFailed);
            }
        }
    })
    const allProjectIds: string[] = []

    if(data?.data !== undefined){
        for (const project of data?.data){
            allProjectIds.push(project["projectId"].toLowerCase())
        }
    }

    useEffect(() => {
        if (projectId.length < 1){
            setInvalid(true);
            setHelperText(localization.dialog.projectIdHelperNotEmpty)
        }else if (projectId.includes(" ")){
            setInvalid(true);
            setHelperText(localization.dialog.projectIdHelperNoSpaces)
        }else if (projectId.length > 20){
            setInvalid(true);
            setHelperText(localization.dialog.projectIdHelperToLong)
        }else {
            if (data?.data !== undefined) {
                if (allProjectIds.includes(projectId.toLowerCase())) {
                    setInvalid(true);
                    setHelperText(localization.dialog.projectIdHelperIdAlreadyUsed)
                } else {
                    setInvalid(false);
                    setHelperText("")
                }
            }
        }
    }, [projectId])

    return(
        <Stack>
            <Stack direction={"column"} sx={{width: "20rem",  margin: "0px 25px 0px 25px"}}>
                <TextField
                    helperText={helperText}
                    error={isInvalid}
                    label={localization.dialog.projectId}
                    value={projectId}
                    variant="filled"
                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setProjectId(e.target.value)}
                />
                <TextField
                    style={{marginTop: "1rem"}}
                    helperText={"Optional"}
                    label={localization.dialog.projectName}
                    value={projectName}
                    variant="filled"
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
                <Stack sx={buttonContainerStyle}>
                    <Button color={"error"}
                            onClick={() => dialogContentProps.setOpen(false)}>{localization.misc.cancel}</Button>
                    <Button color={"success"}
                            disabled={isInvalid}
                            onClick={() => handleSave.mutate()}>{localization.misc.save}</Button>
                </Stack>
            </Stack>
        </Stack>
    )
}

const buttonContainerStyle = {
    flexDirection: "row",
    marginTop: "3rem",
    marginBottom: "1rem",
    justifyContent: "center"
}

export default CreationContent