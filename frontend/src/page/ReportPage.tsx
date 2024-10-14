import React, {ChangeEvent, useEffect, useState} from "react";
import {
    Box,
    Button,
    Grid,
    IconButton, Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import InfoBox from "../components/InfoBox";
import FavoriteButton from "../components/FavoriteButton";
import {urlAddress} from "../utilities/constants";
import localization from "../utilities/localization";
import DropDownMenu from "../components/DropdownMenu";
import VulnerabilityVector from "../components/VulnerabilityVector";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {getDetailedReport, updateReport} from "../queries/report-requests";
import {updateCve} from "../queries/misc-requests";
import {useNavigate, useParams} from "react-router-dom";
import {AxiosError, AxiosResponse} from "axios";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {colors, mainTheme} from "../style/globalStyle";
import {pageMotion} from "../style/animation";
import {motion} from "framer-motion";
import {useNotification} from "../context/NotificationContext";
import RefreshIcon from '@mui/icons-material/Refresh';
import {useUserContext} from "../context/UserContext";
import CustomDialog from "../components/CustomDialog";
import WaiverConfigContent from "../components/WaiverConfigContent";
import {severityRating} from "../utilities/calc_CVSS31_scores";
import {WaiverConfigData} from "../utilities/interfaces/WaiverConfigData";
import {CompressedScoreMetricCategoriesData} from "../utilities/ScoreMetricCategoriesData";
import {useConfig} from "../context/ConfigContext";

/**
 * Displays all data corresponding to a report. And allows to edit the status, comment and solution if
 * the user has enough permission.
 */
const ReportPage: React.FunctionComponent = () => {
    const {projectId, reportId} = useParams() as { projectId: string, reportId: string };
    const {
        isLoading,
        isError,
        isSuccess,
        data
    } = useQuery([projectId, reportId], () => getDetailedReport(projectId, reportId))
    const theme = useTheme();
    const notification = useNotification();
    const user = useUserContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {baseUrl} = useConfig();
    const [waiverDialogVisible, setWaiverDialogVisibility] = useState(false);

    document.title = projectId;
    const [status, setStatus] = useState<string>(Object.keys(localization.misc.status)[0])
    const [solution, setSolution] = useState<string>(Object.keys(localization.misc.solution)[0])
    const [comment, setComment] = useState<string>("")
    const [waiverConfigData, setWaiverConfigData] = useState<WaiverConfigData>({
        projectId: '',
        lastEdited: new Date(),
        author: '',
        scoreMetricCategoriesData: []
    })
    const [compressedScoreMetricCategoryData, setCompressedScoreMetricCategoryData] = useState([])
    const [calculatedCVSSScores, setCalculatedCVSSScores] = useState({} as { [key: string]: string | null })

    useEffect(() => {
        if (isSuccess) {
            setStatus(data?.data.report.status)
            setSolution(data?.data.report.solution)
            setComment(data?.data.report.comment)
            const compressedScoreMetricCategoryDataWithLineBreaks = data?.data.report.scoreMetricData.replace(/(\r\n|\n|\r)/gm, "\\n")
            const lastEdited = new Date(data?.data.report.updated)
            setWaiverConfigData({
                projectId: data?.data.projectId,
                lastEdited: lastEdited,
                author: data?.data.report.author,
                scoreMetricCategoriesData: []
            })
            setCompressedScoreMetricCategoryData(JSON.parse(compressedScoreMetricCategoryDataWithLineBreaks))
        }

        if (isError) {
            notification.error(localization.notificationMessage.errorDataFetch);
            navigate(baseUrl ? `/${baseUrl}${urlAddress.redirects.errorPage}` : urlAddress.redirects.errorPage, {replace: true})
        }
    }, [data, isError, isSuccess])

    const refreshCve = useMutation(() => updateCve(data?.data.report.cveObject.cveId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["reportOverview", projectId]);
            queryClient.invalidateQueries(["projectDetails", projectId]);
            queryClient.invalidateQueries([projectId, reportId]);
            notification.success(localization.notificationMessage.updateSuccessful);
        },
        onError: () => {
            notification.error(localization.notificationMessage.updateFailed);
        }
    })

    /**
     * Updates the changes to the server and invalidates old data.
     */
    const submitChange = useMutation(() => updateReport(projectId, reportId, {
        status: status,
        solution: solution,
        comment: comment,
        scoreMetricData: JSON.stringify(compressScoreMetricCategoriesData()),
        overallCvssScore: isScoreNumber(calculatedCVSSScores.overallMetricScore) ? Number(calculatedCVSSScores.overallMetricScore) : null,
        overallCvssSeverity: calculatedCVSSScores.overallSeverity ?? null,
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries([projectId, reportId]);
            queryClient.invalidateQueries(["projectDetails", projectId]);
            queryClient.invalidateQueries(["reportOverview", projectId]);
            queryClient.invalidateQueries("favoriteProjects")
            queryClient.invalidateQueries("recentProjects")
            queryClient.invalidateQueries("allProjects")
            notification.success(localization.notificationMessage.saveSuccessfully);
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 403) {
                notification.error(localization.notificationMessage.missingPermission);
            } else {
                notification.error(localization.notificationMessage.updateReportFailed);
            }
        }
    });

    const author = data?.data.report.author == null ? localization.ReportDetailPage.noAuthor : data?.data.report.author;

    const handleLinkButton = (url: string) => {
        window.open(url + data?.data.report.cveObject.cveId);
    }

    const getAquaSecUrl = () => {
        const year = data?.data.report.cveObject.cveId.split("-")[1]
        window.open(urlAddress.redirects.aquaSec + year + "/" + data?.data.report.cveObject.cveId.toLowerCase())
    }

    const openVendorLink = () => {
        if (data?.data.report.cveObject.recommendeUrl !== "")
            window.open(data?.data.report.cveObject.recommendeUrl)
    }

    const solutionTransition = () => {
        const solutionTransitionsDefinition = {
            NO_THREAT: ["NO_SOLUTION_NEEDED"],
            THREAT_FIXED: ["CHANGE_VERSION", "CHANGE_DEPENDENCY", "PROGRAMMING"],
            THREAT_WIP: ["CHANGE_VERSION", "CHANGE_DEPENDENCY", "PROGRAMMING", "NO_SOLUTION"],
            THREAT: ["CHANGE_VERSION", "CHANGE_DEPENDENCY", "PROGRAMMING", "NO_SOLUTION"],
            REVIEW: Object.keys(localization.misc.solution),
            REVIEW_AGAIN: Object.keys(localization.misc.solution)
        }
        const allowedTransition = solutionTransitionsDefinition[status as keyof typeof solutionTransitionsDefinition]
        if (!allowedTransition.includes(solution))
            setSolution(allowedTransition[0])
        return allowedTransition
    }

    const statusTransition = () => {
        const statusTransitionsDefinition = {
            REVIEW: ["REVIEW", "THREAT", "NO_THREAT"],
            THREAT: ["REVIEW", "THREAT", "THREAT_WIP"],
            THREAT_WIP: ["THREAT_WIP", "THREAT_FIXED"],
            THREAT_FIXED: ["THREAT_FIXED"],
            NO_THREAT: ["NO_THREAT"],
            REVIEW_AGAIN: ["THREAT", "THREAT_FIXED", "NO_THREAT"]
        }
        if (data?.data.report.status === undefined)
            return Object.keys(localization.misc.status)
        return statusTransitionsDefinition[data?.data.report.status as keyof typeof statusTransitionsDefinition]
    }

    function getVulVectorValues(data: AxiosResponse<any, any> | undefined) {
        if (!data) {
            return undefined
        }

        let cve = data.data.report.cveObject
        if (cve.attackVector && cve.attackComplexity && cve.privilegesRequired && cve.userInteraction
            && cve.scope && cve.confidentialityImpact && cve.integrityImpact && cve.availabilityImpact) {
            return {
                attackVector: String(cve.attackVector),
                attackComplexity: String(cve.attackComplexity),
                privilegesRequired: String(cve.privilegesRequired),
                userInteraction: String(cve.userInteraction),
                scope: String(cve.scope),
                confidentialityImpact: String(cve.confidentialityImpact),
                integrityImpact: String(cve.integrityImpact),
                availabilityImpact: String(cve.availabilityImpact),
            }
        } else {
            return undefined
        }
    }

    function compressScoreMetricCategoriesData(): CompressedScoreMetricCategoriesData[] {

        let dbData: CompressedScoreMetricCategoriesData[] = []
        waiverConfigData.scoreMetricCategoriesData.forEach((scoreMetricCategory) => {
            let scoreMetricsDb: {
                scoreMetricLabel: string;
                selectedScoreMetricValue: string;
                comment: string;
            }[] = []
            scoreMetricCategory.scoreMetrics.forEach((scoreMetric) => {
                scoreMetricsDb.push({
                    scoreMetricLabel: scoreMetric.scoreMetricLabel,
                    selectedScoreMetricValue: scoreMetric.selectedScoreMetricValue.value,
                    comment: scoreMetric.comment.value,
                })
            })
            dbData.push({
                scoreMetricCategoryLabel: scoreMetricCategory.scoreMetricCategoryLabel,
                scoreMetrics: scoreMetricsDb
            })
        })
        return dbData
    }

    function isScoreNumber(score: string | null | undefined) {
        if (score === null) return false
        const validate = Number(score)
        return !isNaN(validate)
    }

    function getSeverityOfScore(score: string | null) {
        if (!isScoreNumber(score)) return 'NA'

        const rating = severityRating(score!);

        if (rating === undefined || typeof rating === 'number') {
            return 'NA'
        }

        return rating
    }

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageMotion}>
            <Stack>
                {compressedScoreMetricCategoryData.length > 0 &&
                    (
                        <CustomDialog
                            dialogContent={
                                <WaiverConfigContent
                                    vulnerabilityVectorValues={getVulVectorValues(data)}
                                    waiverConfigData={waiverConfigData}
                                    setWaiverConfigData={setWaiverConfigData}
                                    compressedScoreMetricCategoryData={compressedScoreMetricCategoryData}
                                    setCalculatedCVSSScores={setCalculatedCVSSScores}
                                />}
                            padding={"50px 50px 0 50px"}
                            openState={{
                                value: waiverDialogVisible,
                                setValue: setWaiverDialogVisibility
                            }}
                            fullWidth={true}
                            maxWidth={"xl"}
                        />
                    )
                }
            </Stack>
            <Box className={"page"}>
                <Grid container spacing={3} sx={{"display": "flex", "justifyContent": "center"}}>
                    <Grid item md={3}>
                        <InfoBox
                            headerComponent={
                                <>
                                    <Stack direction={"row"} justifyContent={"space-between"}>
                                        {isLoading ? null :
                                            <FavoriteButton projectId={data?.data.projectId}/>}
                                    </Stack>
                                </>
                            }
                            component={
                                <>
                                    <Typography color={mainTheme.palette.primary.contrastText}
                                                variant="h4">{data?.data.projectId}</Typography>
                                    <Typography color={"white"}
                                                variant="h5">{data?.data.projectName === undefined ||
                                    data?.data.projectName === "" ? "-" : data?.data.projectName}</Typography>
                                    <Typography style={{paddingLeft: "1rem", paddingRight: "1rem"}} color={"white"}
                                                variant="h5" align={"center"}>{data?.data.dependencyName}</Typography>
                                    <Typography color={"white"} variant="h5">{data?.data.dependencyVersion}</Typography>
                                </>
                            }>
                        </InfoBox>
                    </Grid>
                    <Grid item md={3}>
                        <InfoBox component={
                            <>
                                <Typography sx={titleStyle} variant="h4"
                                            mb={"5rem"}>{data?.data.report.cveObject.cveId}</Typography>
                                <Box position="relative" top={-30} left={20} width={"100%"}>
                                    <Box position="absolute" width={"100%"}>
                                        <Stack direction={"row"} alignItems={"center"}>
                                            <Typography color={"white"}
                                                        variant="subtitle1">{localization.ReportDetailPage.lastUpdate + new Date(data?.data.report.cveObject.updated).toLocaleString("de-DE") + " UTC"}</Typography>
                                            <IconButton onClick={() => refreshCve.mutate()}>
                                                <RefreshIcon sx={{
                                                    color: theme.palette.secondary.main,
                                                    fontSize: "1.2rem",
                                                    marginLeft: "3px",
                                                    paddingBottom: "3px",
                                                    "&:hover": {cursor: "pointer"}
                                                }}></RefreshIcon>
                                            </IconButton>
                                        </Stack>
                                        <Typography color={"white"}
                                                    variant="subtitle1">{localization.ReportDetailPage.published + new Date(data?.data.report.cveObject.published).toLocaleString("de-DE") + " UTC"}</Typography>
                                    </Box>
                                </Box>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={6}>
                        <InfoBox
                            component={
                                <Stack sx={{
                                    'width': '100%',
                                    'display': 'flex',
                                    'flexFlow': 'row wrap',
                                    'justifyContent': 'space-evenly',
                                    'alignItems': 'center',
                                    'rowGap': '1.5rem',
                                }}>
                                    <Stack sx={cvssChipContainerStyle}>
                                        <Typography sx={titleStyle} variant="h5"
                                                    mb={"0.5rem"}>{"Base Score"}</Typography>
                                        <Box
                                            sx={cvssChipStyle(colors.severity[data?.data.report.cveObject.baseSeverity as keyof typeof colors.severity])}>
                                            <Typography color={mainTheme.palette.primary.main} fontSize={"1.5rem"}
                                                        variant="h4"
                                                        sx={{"fontWeight": "600"}}>{data?.data.report.cveObject.cvss}</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack sx={cvssChipContainerStyle}>
                                        <Tooltip title={<h2>{localization.ReportDetailPage.toolTips.epss}</h2>}>
                                            <Stack>
                                                <Typography sx={titleStyle} variant="h5"
                                                            mb={"0.5rem"}>{"EPSS"}</Typography>
                                                <Box
                                                    sx={cvssChipStyle(colors.severity[data?.data.report.cveObject.baseSeverity as keyof typeof colors.severity])}>
                                                    <Typography color={mainTheme.palette.primary.main}
                                                                fontSize={"1.5rem"}
                                                                variant="h4"
                                                                sx={{"fontWeight": "600"}}>{data?.data.report.cveObject.epss !== 0 ? (data?.data.report.cveObject.epss * 100).toFixed(2) + "%" : "N/A"}</Typography>
                                                </Box>
                                            </Stack>
                                        </Tooltip>
                                    </Stack>
                                    <Stack sx={cvssChipContainerStyle}>
                                        <Tooltip title={
                                            <h2>{user.hasGroups(["advanced", "admin"]) ? localization.ReportDetailPage.toolTips.waiverConfig : localization.toolTips.missingPermission}</h2>}
                                                 placement="bottom">
                                            <Stack>
                                                <Button style={cvssCalculatorButtonStyle(user.hasGroups(["advanced", "admin"]))}
                                                        disabled={!getVulVectorValues(data)}
                                                        onClick={() => user.hasGroups(["advanced", "admin"]) ? setWaiverDialogVisibility(true) : {}}>{localization.ReportDetailPage.waiverButton}</Button>
                                            </Stack>
                                        </Tooltip>
                                    </Stack>
                                    <Stack sx={cvssChipContainerStyle}>
                                        <Typography sx={titleStyle} variant="h5"
                                                    mb={"0.5rem"}>{"Temporal Score"}</Typography>
                                        <Box
                                            sx={cvssChipStyle(colors.severity[getSeverityOfScore(calculatedCVSSScores.temporalMetricScore) as keyof typeof colors.severity])}>
                                            <Typography color={mainTheme.palette.primary.main} fontSize={"1.5rem"}
                                                        variant="h4"
                                                        sx={{"fontWeight": "600"}}>{(calculatedCVSSScores.temporalMetricScore ?? "-")}</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack sx={cvssChipContainerStyle}>
                                        <Typography sx={titleStyle} variant="h5"
                                                    mb={"0.5rem"}>{"Environmental Score"}</Typography>
                                        <Box
                                            sx={cvssChipStyle(colors.severity[getSeverityOfScore(calculatedCVSSScores.environmentalMetricScore) as keyof typeof colors.severity])}>
                                            <Typography color={mainTheme.palette.primary.main} fontSize={"1.5rem"}
                                                        variant="h4"
                                                        sx={{"fontWeight": "600"}}>{(calculatedCVSSScores.environmentalMetricScore ?? "-")}</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack sx={cvssChipContainerStyle}>
                                        <Typography sx={titleStyle} variant="h5"
                                                    mb={"0.5rem"}>{"Overall Score"}</Typography>
                                        <Box
                                            sx={cvssChipStyle(colors.severity[getSeverityOfScore(calculatedCVSSScores.overallMetricScore) as keyof typeof colors.severity])}>
                                            <Typography color={mainTheme.palette.primary.main} fontSize={"1.5rem"}
                                                        variant="h4"
                                                        sx={{"fontWeight": "600"}}>{(calculatedCVSSScores.overallMetricScore ?? "-")}</Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            }/>
                    </Grid>
                    <Grid item md={3}>
                        <InfoBox component={
                            <>
                                <Typography color={mainTheme.palette.primary.contrastText}
                                            variant="h4">{localization.ReportDetailPage.statusTitle}</Typography>
                                <Tooltip
                                    title={
                                        !user.hasGroups(["advanced", "admin"]) ? <h2>{localization.toolTips.missingPermission}</h2> : ""}>
                                    <Stack mb={"4rem"} mt={"0.5rem"} width={"60%"}>
                                        <DropDownMenu labelValueMap={localization.misc.status}
                                                      colorValueMap={colors.status}
                                                      state={{value: status, setValue: setStatus}}
                                                      choices={statusTransition()}
                                                      readOnly={!user.hasGroups(["advanced", "admin"])}/>
                                    </Stack>
                                </Tooltip>
                                <Box position="relative" top={-40} left={20} width={"100%"}>
                                    <Box position="absolute" width={"100%"}>
                                        <Typography color={"white"}
                                                    variant="subtitle1">{localization.ReportDetailPage.lastUpdate + new Date(data?.data.report.updated).toLocaleString("de-DE") + " UTC"}</Typography>
                                        <Typography color={"white"}
                                                    variant="subtitle1">{localization.ReportDetailPage.author + author}</Typography>
                                    </Box>
                                </Box>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={4.5}>
                        <InfoBox component={
                            <>
                                <VulnerabilityVector
                                    label={localization.ReportDetailPage.vulnerabilityVector.attackVector}
                                    value={data?.data.report.cveObject.attackVector}
                                    valueColorMap={colors.vulnerabilityVector.attackVector}
                                    valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>

                                <VulnerabilityVector
                                    label={localization.ReportDetailPage.vulnerabilityVector.attackComplexity}
                                    value={data?.data.report.cveObject.attackComplexity}
                                    valueColorMap={colors.vulnerabilityVector.attackComplexity}
                                    valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>

                                <VulnerabilityVector
                                    label={localization.ReportDetailPage.vulnerabilityVector.privilegesRequired}
                                    value={data?.data.report.cveObject.privilegesRequired}
                                    valueColorMap={colors.vulnerabilityVector.privilegesRequired}
                                    valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>

                                <VulnerabilityVector
                                    label={localization.ReportDetailPage.vulnerabilityVector.userInteraction}
                                    value={data?.data.report.cveObject.userInteraction}
                                    valueColorMap={colors.vulnerabilityVector.userInteraction}
                                    valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={4.5}>
                        <InfoBox component={
                            <>
                                <VulnerabilityVector
                                    label={localization.ReportDetailPage.vulnerabilityVector.confidentialityImpact}
                                    value={data?.data.report.cveObject.confidentialityImpact}
                                    valueColorMap={colors.vulnerabilityVector.impactMetrics}
                                    valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>

                                <VulnerabilityVector
                                    label={localization.ReportDetailPage.vulnerabilityVector.integrityImpact}
                                    value={data?.data.report.cveObject.integrityImpact}
                                    valueColorMap={colors.vulnerabilityVector.impactMetrics}
                                    valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>

                                <VulnerabilityVector
                                    label={localization.ReportDetailPage.vulnerabilityVector.availabilityImpact}
                                    value={data?.data.report.cveObject.availabilityImpact}
                                    valueColorMap={colors.vulnerabilityVector.impactMetrics}
                                    valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>

                                <VulnerabilityVector label={localization.ReportDetailPage.vulnerabilityVector.scope}
                                                     value={data?.data.report.cveObject.scope}
                                                     valueColorMap={colors.vulnerabilityVector.scope}
                                                     valueLabelMap={localization.ReportDetailPage.vulnerabilityDomain}/>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={9}>
                        <InfoBox component={
                            <>
                                <Typography color={mainTheme.palette.primary.contrastText}
                                            variant="h4">{localization.ReportDetailPage.commentTitle}</Typography>
                                <Tooltip
                                    title={
                                        !user.hasGroups(["advanced", "admin"]) ? <h2>{localization.toolTips.missingPermission}</h2> : ""}>
                                    <Stack mb={"2rem"} mt={"0.5rem"} width={"70%"}>
                                        <DropDownMenu labelValueMap={localization.misc.solution}
                                                      colorValueMap={colors.solution}
                                                      state={{value: solution, setValue: setSolution}}
                                                      choices={solutionTransition()}
                                                      readOnly={!user.hasGroups(["advanced", "admin"])}/>
                                    </Stack>
                                </Tooltip>
                                <Grid container sx={{
                                    "width": "90%",
                                    "display": "flex",
                                    "flexWrap": "wrap",
                                    "justifyContent": "space-evenly"
                                }}>
                                    <Grid item md={8}>
                                        <Tooltip

                                            title={
                                                !user.hasGroups(["advanced", "admin"]) ? <h2>{localization.toolTips.missingPermission}</h2> : ""}
                                            followCursor={true}>
                                            <TextField
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    setComment(e.currentTarget.value)
                                                }}
                                                value={comment}
                                                style={textfieldStyle}
                                                rows={"6"}
                                                multiline
                                                placeholder={localization.ReportDetailPage.commentPlaceholder}
                                                variant="filled"
                                                InputProps={{
                                                    disableUnderline: true,
                                                    readOnly: !user.hasGroups(["advanced", "admin"])
                                                }}/>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item md={3} sx={{
                                        "display": "flex",
                                        "alignItems": "space-between",
                                        "height": "100%",
                                        "flexWrap": "wrap"
                                    }}>
                                        <Typography color={mainTheme.palette.primary.contrastText}
                                                    variant="h5"
                                                    width={"100%"}>{localization.ReportDetailPage.cvssVectorString}</Typography>
                                        <TextField
                                            style={textfieldStyle}
                                            variant="filled"
                                            value={calculatedCVSSScores.vectorString ?? localization.ReportDetailPage.cvssVectorStringNoChanges}
                                            rows={"4"}
                                            multiline
                                            InputProps={{
                                                disableUnderline: true,
                                                readOnly: true,
                                            }}>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </>
                        }/>
                    </Grid>
                    <Grid item md={3}>
                        <Box sx={{"height": "100%"}}>
                            <InfoBox component={
                                <>
                                    <Typography sx={titleStyle} variant="h4" mb={"1rem"}>
                                        {localization.ReportDetailPage.additionalLinksTitle}</Typography>
                                    <Grid container spacing={1} width={"70%"}>
                                        <Grid item md={12} sx={flexButtonContainer}>
                                            <Button style={linkButtonStyle}
                                                    onClick={() => handleLinkButton(urlAddress.redirects.openCVE)}>OpenCVE</Button>
                                        </Grid>
                                        <Grid item md={12} sx={flexButtonContainer}>
                                            <Button style={linkButtonStyle}
                                                    onClick={() => handleLinkButton(urlAddress.redirects.mendio)}>Mend.io</Button>
                                        </Grid>
                                        <Grid item md={12} sx={flexButtonContainer}>
                                            <Button style={linkButtonStyle}
                                                    onClick={() => getAquaSecUrl()}>AquaSec</Button>
                                        </Grid>
                                        <Grid item md={12} sx={flexButtonContainer}>
                                            <Tooltip
                                                sx={tooltipStyle}
                                                title={
                                                    data?.data.report.cveObject.recommendedUrl === "" ? <h2>{localization.toolTips.notAvailable}</h2> : ""}
                                                enterDelay={500} arrow>
                                                <Button
                                                    style={vendorButtonStyle(data?.data.report.cveObject.recommendedUrl)}
                                                    onClick={() => openVendorLink()}>Vendor</Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </>
                            }/>
                        </Box>
                    </Grid>
                    <Box sx={buttonContainerStyle}>
                        <Button style={saveButton}
                                variant="contained"
                                startIcon={<SaveRoundedIcon/>}
                                onClick={() => submitChange.mutate()}>{localization.misc.save}</Button>
                    </Box>
                </Grid>
            </Box>
        </motion.div>
    )
}

/**************
 * Styles
 **************/

const titleStyle = {
    color: mainTheme.palette.primary.contrastText,
}

const cvssChipContainerStyle = {
    'width': '30%',
    'textAlign': 'center'
}

const cvssChipStyle = (color: string) => {
    return {
        backgroundColor: color,
        height: "2rem",
        width: "8rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        textAlign: "center",
        margin: "0 auto",
    }
}

const flexButtonContainer = {
    display: "flex"
}

const linkButtonStyle = {
    margin: "auto",
    height: "3rem",
    width: "7rem",
    fontSize: "1rem",
    color: mainTheme.palette.primary.main,
    backgroundColor: mainTheme.palette.secondary.main
}

const cvssCalculatorButtonStyle = (hasPermission: boolean) => {
    return {
        "height": "3rem",
        "padding": "0 1rem",
        "color": hasPermission ? mainTheme.palette.primary.main : "white",
        "backgroundColor": hasPermission ? mainTheme.palette.secondary.main : "grey",
        "margin": "auto auto",
        "fontSize": "1rem",
        "fontWeight": "600"
    }
}

const vendorButtonStyle = (vendorLink: string) => {
    const vendorColor = {
        color: vendorLink === "" ? "white" : mainTheme.palette.primary.main,
        backgroundColor: vendorLink === "" ? "grey" : mainTheme.palette.primary.main
    }
    return {...linkButtonStyle, ...vendorColor}
}

const textfieldStyle = {
    width: "100%",
    backgroundColor: "white",
    color: "black",
    borderRadius: "8px",
    marginBottom: "10px",
}

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50%",
}

const saveButton = {
    width: "10rem",
    height: "3rem",
    marginTop: "2rem"
}

const waiverConfigButton = {
    width: "1.5em",
    height: "1.5em",
    borderRadius: "50%",
    margin: "10px 5px 0 0",
}

const tooltipStyle = {
    fontSize: "8em",
}

export default ReportPage





