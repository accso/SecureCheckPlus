import {Box, Grid, IconButton, Stack, Typography} from "@mui/material"
import React, {useEffect, useState} from "react";
import FavoriteButton from "../components/FavoriteButton";
import InfoBox from "../components/InfoBox";
import localization from "../utilities/localization";
import CustomDoughnut from "../components/CustomDoughnut";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {getProject} from "../queries/project-requests";
import CustomDialog from "../components/CustomDialog";
import ProjectSettingsContent from "../components/ProjectSettingsContent";
import {colors, mainTheme} from "../style/globalStyle";
import {urlAddress} from "../utilities/constants";
import {pageMotion} from "../style/animation";
import {motion} from "framer-motion";
import {useNotification} from "../context/NotificationContext";
import {useConfig} from "../context/ConfigContext";

/**
 * Displays the project page based on the project ID in the url. And fetches its data.
 */
const ProjectPage: React.FunctionComponent = () => {
    const notification = useNotification();
    const queryClient = useQueryClient()
    const {projectId} = useParams() as { projectId: string };
    const navigate = useNavigate();
    const {baseUrl} = useConfig()
    const {
        isLoading,
        isError,
        error,
        data
    } = useQuery(["projectDetails", projectId], () => getProject(projectId))
    const [projectDialogState, setProjectDialogState] = useState(false)

    const redirect = (status: string[], severity: string[] = []) => {
        navigate("reports", {
            state: {
                status: status,
                severity: severity.length === 0 ? undefined : severity
            }
        })
    }

    useEffect(() => {
        queryClient.invalidateQueries("recent")
    }, [])

    useEffect(() => {
        if (isError) {
            // @ts-ignore
            if (error?.response?.status === 404) {
                navigate(baseUrl ? `/${baseUrl}${urlAddress.redirects.errorPage}` : urlAddress.redirects.errorPage, {replace: true})
            } else {
                notification.error(localization.notificationMessage.errorDataFetch)
            }
        }
    }, [data, error])

    document.title = projectId === undefined ? localization.pageTitles.error : projectId;

    const plotStatusDefinition = {
        "REVIEW": ["REVIEW", "REVIEW_AGAIN"],
        "REVIEWED": ["THREAT", "THREAT_WIP"],
        "FIXED": ["THREAT_FIXED", "NO_THREAT"]
    }

    const processedStatus = {
        REVIEW: data?.data.statusDistribution["REVIEW"] + data?.data.statusDistribution["REVIEW_AGAIN"],
        REVIEWED: data?.data.statusDistribution["THREAT"] + data?.data.statusDistribution["THREAT_WIP"],
        FIXED: data?.data.statusDistribution["NO_THREAT"] + data?.data.statusDistribution["THREAT_FIXED"]
    }

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageMotion}>
            <Box className={"page"}>
                <Grid container columns={4} spacing={3}>
                    <Grid item md={1}>
                        <InfoBox
                            headerComponent={
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    {isLoading ? null : <FavoriteButton projectId={data?.data.projectId}/>}
                                    <IconButton onClick={() => setProjectDialogState(true)}>
                                        <SettingsRoundedIcon style={settingsIconStyle}/>
                                    </IconButton>
                                    <CustomDialog title={localization.dialog.projectSettingTitle}
                                                  dialogContent={<ProjectSettingsContent
                                                      setOpen={setProjectDialogState}/>}
                                                  openState={{
                                                      value: projectDialogState,
                                                      setValue: setProjectDialogState
                                                  }}/>
                                </Stack>
                            }
                            component={
                                <>
                                    <Typography variant="h5" sx={titleProps}>{data?.data.projectId}</Typography>
                                    <Typography
                                        sx={infoProps}>{data?.data.projectName === "" ? "-" : data?.data.projectName}</Typography>
                                </>
                            }/>
                    </Grid>
                    <Grid item md={1}>
                        <InfoBox component={
                            <>
                                <Typography variant="h5"
                                            sx={titleProps}>{localization.ProjectPage.updatedTitle}</Typography>
                                <Typography
                                    sx={infoProps}>{new Date(data?.data.updated).toLocaleString("de-DE")}</Typography>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={1} onClick={() => navigate("." + urlAddress.redirects.dependencies)}
                          sx={{"&:hover": {cursor: "pointer"}}}>
                        <InfoBox component={
                            <>
                                <Typography variant="h5"
                                            sx={titleProps}>{localization.ProjectPage.dependenciesTitle}</Typography>
                                <Typography sx={infoProps}>{data?.data.dependencyCount}</Typography>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={1} onClick={() => redirect(plotStatusDefinition["FIXED"])}
                          sx={{"&:hover": {cursor: "pointer"}}}>
                        <InfoBox component={
                            <>
                                <Typography variant="h5"
                                            sx={titleProps}>{localization.ProjectPage.resolvedReportsTitle}</Typography>
                                <Typography sx={infoProps}>{data?.data.resolvedReportCount}</Typography>
                            </>}/>
                    </Grid>
                    <Grid item md={1}>
                        <InfoBox component={
                            <>
                                <Typography onClick={() => redirect(plotStatusDefinition["REVIEW"])}
                                            marginBottom={"2rem"} variant="h5"
                                            sx={chartTitle}>{localization.ProjectPage.notEvaluatedTitle}</Typography>
                                <Box sx={chartBoxProps}>
                                    <CustomDoughnut data={data?.data.notEvaluated} options={
                                        {
                                            labels: Object.values(localization.misc.severity),
                                            colors: Object.values(colors.severity)
                                        }
                                    }
                                                    status={plotStatusDefinition["REVIEW"]}/>
                                </Box>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={1}>
                        <InfoBox component={
                            <>
                                <Typography
                                    onClick={() => redirect(plotStatusDefinition["REVIEWED"])}
                                    marginBottom={"2rem"} variant="h5"
                                    sx={chartTitle}>{localization.ProjectPage.evaluatedTitle}</Typography>
                                <Box sx={chartBoxProps}>
                                    <CustomDoughnut data={data?.data.evaluated} options={
                                        {
                                            labels: Object.values(localization.misc.severity),
                                            colors: Object.values(colors.severity)
                                        }
                                    }
                                                    status={plotStatusDefinition["REVIEWED"]}/>
                                </Box>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={1}>
                        <InfoBox component={
                            <>
                                <Typography onClick={() => redirect(plotStatusDefinition["FIXED"], Object.keys(localization.misc.severity))}
                                            marginBottom={"2rem"} variant="h5"
                                            sx={chartTitle}>{localization.ProjectPage.resolvedReportsTitle}</Typography>
                                <Box sx={chartBoxProps}>
                                    <CustomDoughnut data={data?.data.solutionDistribution}
                                                    options={
                                                        {
                                                            labels: Object.values(localization.misc.solution),
                                                            colors: Object.values(colors.solution)
                                                        }
                                                    }
                                                    status={plotStatusDefinition["FIXED"]}/>
                                </Box>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={1}>
                        <InfoBox component={
                            <>
                                <Typography
                                    onClick={() => redirect(Object.keys(localization.misc.status), Object.keys(localization.misc.severity))}
                                    marginBottom={"2rem"} variant="h5"
                                    sx={chartTitle}>{localization.ProjectPage.allReportsTitle}</Typography>
                                <Box sx={chartBoxProps}>
                                    <CustomDoughnut data={processedStatus} options={
                                        {
                                            labels: Object.values([localization.ProjectPage.notEvaluatedTitle, localization.ProjectPage.evaluatedTitle, localization.ProjectPage.resolvedReportsTitle]),
                                            colors: Object.values([colors.status.THREAT, colors.status.NO_THREAT, colors.status.REVIEW])
                                        }
                                    }
                                                    status={Object.keys(localization.misc.status)}/>
                                </Box>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={1}>
                        <InfoBox component={
                            <>
                                <Typography variant="h5"
                                            sx={titleProps}>{localization.ProjectPage.deploymentThresholdTitle}</Typography>
                                <Typography
                                    sx={infoProps}>{localization.misc.deploymentThreshold[data?.data.deploymentThreshold as keyof typeof localization.misc.deploymentThreshold]}</Typography>
                            </>
                        }/>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    )
}

/**************
 * Styles
 **************/

const chartBoxProps = {
    width: "95%"
}

const infoProps = {
    color: "white",
    fontSize: "1.5rem"
}

const titleProps = {
    color: mainTheme.palette.primary.contrastText,
}

const chartTitle = {
    color: mainTheme.palette.primary.contrastText,
    "&:hover": {
        cursor: "pointer"
    }
}

const settingsIconStyle = {
    color: "white",
    width: "20px"
}

export default ProjectPage

