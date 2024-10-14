import * as React from 'react';
import Card from '@mui/material/Card';
import {
    Box,
    CardContent,
    Checkbox,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import FavoriteButton from "./FavoriteButton";
import VulnerabilityCircle from "./VulnerabilityCircle";
import {colors} from "../style/globalStyle"
import localization from "../utilities/localization"
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";

export interface Props {
    /**
     * project
     */
    project: any

    /**
     * whether the checkboxes for selecting a project will be shown or not
     */
    showCheckboxes: boolean

    /**
     * hook of any project being selected boolean
     */
    anyProjectSelected:
        {
            value: boolean
            setValue: React.Dispatch<React.SetStateAction<boolean>>
        }
}

export default function ProjectCard(props: Props) {
    const navigate = useNavigate()
    const location = useLocation()
    const [checked, setChecked] = useState(false);
    const sentToProject = () => {
        if (location.pathname.endsWith("projects")) {
            navigate(props.project.projectId)
        } else {
            navigate("projects/" + props.project.projectId)
        }
    }


    function handleCheckboxChangeAndReturnState(){
        let selectedProjectsIds = sessionStorage.getItem("selectedProjectsIds")
        let selectedProjectArray: string[] = selectedProjectsIds ? JSON.parse(selectedProjectsIds) : [];

        if (selectedProjectArray.includes(props.project.projectId))
        {
            selectedProjectArray = selectedProjectArray.filter(item => item !== props.project.projectId);
            sessionStorage.setItem("selectedProjectsIds", JSON.stringify(selectedProjectArray))
            return false
        }
        else
        {
            selectedProjectArray.push(props.project.projectId)
            sessionStorage.setItem("selectedProjectsIds", JSON.stringify(selectedProjectArray))
            return true
        }
    }


    return (
        <Card sx={{boxShadow: 1, margin: "10px"}}>
            <CardContent sx={noPadding}>
                <Stack direction={"row"} sx={{marginLeft:"0.5rem", alignSelf:"center", justifyContent:"space-between"}}>
                    <Stack position={"absolute"} direction={"row"} alignItems={"center"} alignSelf={"top"}>
                        <Stack>
                            <FavoriteButton projectId={props.project.projectId}/>
                        </Stack>
                        {/* TODO: For project groups feature */}
                        {/*<Stack marginLeft={"1rem"}>*/}
                        {/*    <Typography sx={{projectGroupStyle}}> {"Projektgruppen Name"}</Typography>*/}
                        {/*</Stack>*/}
                    </Stack>
                    <Stack sx={{alignSelf:"center", marginTop:"1rem"}}>
                        <Stack direction={"row"} alignItems={"center"}>
                            {props.showCheckboxes && (
                                <Checkbox
                                    defaultChecked={checked}
                                    checked={checked}
                                    onChange={() => {
                                        setChecked(handleCheckboxChangeAndReturnState())
                                        props.anyProjectSelected.setValue(JSON.parse(sessionStorage.getItem("selectedProjectsIds") || "[]").length > 0)
                                    }}
                                />
                            )}
                            <Stack marginLeft={"1rem"}>
                                <Typography onClick={sentToProject} sx={projectNameStyle}> {props.project.projectName ? props.project.projectName : props.project.projectId} </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} sx={projectCardStyle} onClick={sentToProject}>
                        <Stack onClick={sentToProject} sx={{marginLeft: "2rem", padding: "0.5rem"}} spacing={3} direction={"row"}>
                            <Tooltip title={localization.misc.severity.CRITICAL}>
                                <Box>
                                    <VulnerabilityCircle color={colors.severity.CRITICAL}
                                                         label={props.project.vulnerabilityCount.CRITICAL}
                                                         size={"4rem"}></VulnerabilityCircle>
                                </Box>
                            </Tooltip>
                            <Tooltip title={localization.misc.severity.HIGH}>
                                <Box>
                                    <VulnerabilityCircle color={colors.severity.HIGH}
                                                         label={props.project.vulnerabilityCount.HIGH}
                                                         size={"4rem"}></VulnerabilityCircle>
                                </Box>
                            </Tooltip>
                            <Tooltip title={localization.misc.severity.MEDIUM}>
                                <Box>
                                    <VulnerabilityCircle color={colors.severity.MEDIUM}
                                                         label={props.project.vulnerabilityCount.MEDIUM}
                                                         size={"4rem"}></VulnerabilityCircle>
                                </Box>
                            </Tooltip>
                            <Tooltip title={localization.misc.severity.LOW}>
                                <Box>
                                    <VulnerabilityCircle color={colors.severity.LOW}
                                                         label={props.project.vulnerabilityCount.LOW}
                                                         size={"4rem"}></VulnerabilityCircle>
                                </Box>
                            </Tooltip>
                            <Tooltip title={localization.misc.severity.NA}>
                                <Box>
                                    <VulnerabilityCircle color={colors.severity.NA}
                                                         label={props.project.vulnerabilityCount.NA}
                                                         size={"4rem"}></VulnerabilityCircle>
                                </Box>
                            </Tooltip>
                        </Stack>
                        {/*<Stack sx={{marginLeft: "2rem", marginRight: "2rem", padding: "0.5rem"}} spacing={5} direction={"row"}>*/}
                        {/*    <ProjectCardValue color={colors.severity.CRITICAL} label={project.misconfigurations}></ProjectCardValue>*/}
                        {/*    <ProjectCardValue color={colors.severity.LOW} label={project.riskValue}></ProjectCardValue>*/}
                        {/*</Stack>*/}
                        {/*{project.requirementsFulfilled ? <CheckCircleRoundedIcon sx={{fontSize:"50px", color: colors.severity.LOW}}/> : <CancelRoundedIcon sx={{fontSize: "50px", color: colors.severity.CRITICAL}}/>}*/}
                    </Stack>
                </Stack>
                </CardContent>
            </Card>
    );
}

const projectGroupStyle = {
    textAlign: "left",
    fontSize: "0.5rem",
}

const projectNameStyle = {
    textAlign: "left",
    fontSize: "1.5rem",
    "&:hover": {
        cursor: "pointer"
    },
}

const projectCardStyle = {
    padding: "0.5rem",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginRight: "7rem",
    "&:hover": {
        cursor: "pointer"
    },
}

const noPadding = {
    padding: "0",
    "&:last-child": {
        paddingBottom: 0
    }
}
