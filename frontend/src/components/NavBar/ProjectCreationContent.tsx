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
    const [isIdInvalid, setIdInvalid] = useState(true);
    const [isNameInvalid, setNameInvalid] = useState(false);
    const [isProjectIdTouched, setProjectIdTouched] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState("");
    const [threshold, setThreshold] = useState("HIGH");
    const queryClient = useQueryClient()
    const [projectIdHelperText, setProjectIdHelperText] = useState("")
    const [projectNameHelperText, setProjectNameHelperText] = useState("")
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
        if (!isProjectIdTouched) {
            return;
        }
        if (projectId.length < 1){
            setIdInvalid(true);
            setProjectIdHelperText(localization.dialog.projectIdHelperNotEmpty)
        }else if (projectId.includes(" ")){
            setIdInvalid(true);
            setProjectIdHelperText(localization.dialog.projectIdHelperNoSpaces)
        }else if (projectId.length > 20){
            setIdInvalid(true);
            setProjectIdHelperText(localization.dialog.projectIdHelperToLong)
        }else {
            if (data?.data !== undefined) {
                if (allProjectIds.includes(projectId.toLowerCase())) {
                    setIdInvalid(true);
                    setProjectIdHelperText(localization.dialog.projectIdHelperIdAlreadyUsed)
                } else {
                    setIdInvalid(false);
                    setProjectIdHelperText("")
                }
            }
        }
    }, [projectId, isProjectIdTouched, allProjectIds])

    useEffect(() => {
        if (projectName.length > 255) {
            setNameInvalid(true);
            setProjectNameHelperText(localization.dialog.projectNameHelperToLong);
        } else {
            setNameInvalid(false);
            setProjectNameHelperText("Optional");
        }
    }, [projectName]);

    return(
        <Stack>
            <Stack direction={"column"} sx={{width: "20rem",  margin: "0px 25px 0px 25px"}}>
                <TextField
                    helperText={projectIdHelperText}
                    error={isProjectIdTouched && isIdInvalid}
                    label={localization.dialog.projectId}
                    value={projectId}
                    variant="filled"
                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        setProjectId(e.target.value)
                        setProjectIdTouched(true)
                    }}
                />
                <TextField
                    style={{marginTop: "1rem"}}
                    helperText={projectNameHelperText}
                    error={isNameInvalid}
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
                            disabled={isIdInvalid || isNameInvalid}
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
