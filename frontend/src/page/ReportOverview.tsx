import React, {useEffect, useState} from "react";
import FilterBox from "../components/FilterBox";
import localization from "../utilities/localization"
import {Box, Chip, createSvgIcon, Divider, Grid, Stack, Tooltip, Typography} from "@mui/material";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {getProjectReportsOverview} from "../queries/report-requests";
import DropDownMenu from "../components/DropdownMenu";
import {colors, mainTheme} from "../style/globalStyle";
import {DataGrid, GridColDef, GridRenderCellParams, GridToolbarContainer,} from '@mui/x-data-grid'
import {ReportSummary} from "../utilities/interfaces/ReportData";
import {urlAddress} from "../utilities/constants";
import {pageMotion} from "../style/animation";
import {motion} from "framer-motion";
import {useNotification} from "../context/NotificationContext";
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import {useConfig} from "../context/ConfigContext";

interface LocationState {
    status: string[]
    severity: string[]
}

/**
 * Fetches all reports of the corresponding project and displays them in a data grid.
 */
const ReportOverview: React.FunctionComponent = () => {
    const notification = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const {baseUrl} = useConfig()
    const {projectId, dependencyName} = useParams() as { projectId: string, dependencyName: string };
    document.title = projectId === undefined ? localization.pageTitles.error : projectId + " - Reports";

    let initialStatus = Object.keys(localization.misc.status).slice(0, 1)
    let initialSeverity = Object.keys(localization.misc.severity).slice(0, 3)
    if (location.state !== null) {
        let {status, severity} = location.state as LocationState
        if (severity !== undefined)
            initialSeverity = severity
        if (status !== undefined)
            initialStatus = status
    }

    const {
        isError,
        data,
        error,
        isSuccess,
    } = useQuery(["reportOverview", projectId], () => getProjectReportsOverview(projectId))
    const [selectedReports, setSelectedReports] = useState<ReportSummary[]>([])
    const [selectedStatus, setSelectedStatus] = useState<string[]>(initialStatus)
    const [selectedSeverity, setSelectedSeverity] = useState<string[]>(initialSeverity)
    const [dependency, setSelectedDependency] = useState<string>(localization.ReportPage.all)
    const [uniqueDependencies, setUniqueDependencies] = useState<Set<string>>(new Set([localization.ReportPage.all]))

    const sortReports = (array: ReportSummary[]) => {
        array.sort(function (firstElement: ReportSummary, secondElement: ReportSummary) {
            return secondElement.dependency.dependencyName.localeCompare(firstElement.dependency.dependencyName)
        })
    }

    /**
     * Counts the unique dependencies to define the possible values for the dropdown box.
     */
    useEffect(() => {
        if (isError) {
            // @ts-ignore
            if (error?.response?.status === 404) {
                navigate(baseUrl ? `/${baseUrl}${urlAddress.redirects.errorPage}` : urlAddress.redirects.errorPage, {replace: true})
            } else {
                notification.error(localization.notificationMessage.errorDataFetch)
            }

        }
        if (isSuccess) {
            const allDependencies = []
            allDependencies.push(localization.ReportPage.all)
            for (const reportKey in data?.data.vulnerabilities) {
                allDependencies.push(data?.data.vulnerabilities[reportKey].dependency.dependencyName)
            }
            setUniqueDependencies(new Set(allDependencies))
        }
    }, [data, isSuccess, isError])

    /**
     * Sets the dependency that is selected by the dropdown box.
     */
    useEffect(() => {
        if (dependencyName !== undefined && uniqueDependencies.has(dependencyName))
            setSelectedDependency(dependencyName)
        else
            setSelectedDependency(localization.ReportPage.all)
    }, [uniqueDependencies, dependencyName])

    /**
     * Checks all parameters {status, severity, selected dependency} and filters them.
     */
    useEffect(() => {
        const reportList = []
        for (const reportKey in data?.data.vulnerabilities) {
            const report = data?.data.vulnerabilities[reportKey]
            if (selectedSeverity.includes(report.cveObject.baseSeverity) &&
                selectedStatus.includes(report.status) &&
                (report.dependency.dependencyName === dependency || dependency === localization.ReportPage.all)) {
                if (!selectedStatus.includes("NO_THREAT") && !selectedStatus.includes("THREAT_FIXED") && report.dependency.dependencyInUse) {
                    reportList.push(report);
                }
                if (selectedStatus.includes("NO_THREAT") || selectedStatus.includes("THREAT_FIXED")) {
                    reportList.push(report);
                }
            }

        }
        sortReports(reportList)
        setSelectedReports(reportList)
    }, [selectedStatus, selectedSeverity, dependency, data])

    /**
     * The definition of the data grid columns.
     */
    const columns: GridColDef[] = [
        {
            field: "open",
            headerName: localization.ReportPage.open,
            disableColumnMenu: true,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <IconButton onClick={() => window.open("reports/" + params.row.id, "_blank")}>
                    <OpenInNewIcon color={"secondary"}></OpenInNewIcon>
                </IconButton>
            )
        },
        {
            field: 'cveId',
            headerName: 'CVE ID',
            valueGetter: params => params.row.cveObject.cveId,
            flex: 2
        },
        {
            field: 'dependencyName',
            headerName: 'Dependency',
            renderCell: (params: any) => (
                <Tooltip title={params.value}>
                    <Typography>{params.value}</Typography>
                </Tooltip>
            ),
            valueGetter: params => params.row.dependency.dependencyName,
            flex: 2
        },
        {
            field: "version",
            headerName: "Version",
            align: "center",
            valueGetter: params => params.row.dependency.version,
            flex: 1.5
        },
        {
            field: 'status',
            headerName: localization.ReportPage.statusHeader,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<string>) => {
                if (params.row.dependency.dependencyInUse) {
                    return (
                        <Chip label={localization.misc.status[params.value as keyof typeof localization.misc.status]}
                              sx={{backgroundColor: colors.status[params.value as keyof typeof colors.status]}}/>)
                } else {
                    return (<Chip label={localization.misc.status.REMOVED}
                                  sx={{backgroundColor: colors.status.NO_THREAT}}/>)
                }
            },
            flex: 1.5
        },
        {
            field: 'severity',
            headerName: localization.ReportPage.severityHeader,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<string>) => (
                <Chip label={localization.misc.severity[params.value as keyof typeof localization.misc.severity]}
                      sx={{backgroundColor: colors.severity[params.value as keyof typeof colors.severity]}}
                />
            ),
            valueGetter: params => params.row.cveObject.baseSeverity,
            flex: 1.5
        },
        {
            field: 'base',
            headerName: 'Base',
            align: "center",
            headerAlign: "center",
            valueGetter: params => params.row.cveObject.cvss,
            flex: 1
        },
        {
            field: 'overallCvss',
            headerName: 'CVSS',
            align: "center",
            headerAlign: "center",
            description: localization.ReportPage.toolTips.overallCvss,
            renderCell: (params: any) => (
                <Tooltip title={localization.ReportPage.toolTips.overallCvss}>
                    <Stack>{params.value !== null ? params.value : "-"}</Stack>
                </Tooltip>
            ),
            valueGetter: params => params.row.overallCvssScore,
            flex: 1
        },
        {
            field: "epss",
            headerName: "EPSS",
            align: "center",
            headerAlign: "center",
            description: localization.ReportPage.toolTips.epss,
            renderCell: (params: GridRenderCellParams<number>) => (
                <Tooltip title={localization.ReportPage.toolTips.epss}>
                    <Stack>{params.value === 0 ? "N/A" : (params.value * 100).toFixed(2) + "%"}</Stack>
                </Tooltip>
            ),
            valueGetter: params => params.row.cveObject.epss,
            flex: 1
        },
        {
            field: 'description',
            headerName: localization.ReportPage.descriptionHeader,
            sortable: false,
            renderCell: (params: any) => (
                <Tooltip placement={"left"} title={params.value}>
                    <Typography>{params.value}</Typography>
                </Tooltip>
            ),
            valueGetter: params => params.row.cveObject.description,
            flex: 10,
        }

    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer style={gridHeaderContainerStyle}>
                <Stack sx={gridHeaderElementsStyle}>
                    <Typography variant="h5"
                                sx={titlePropsStyle}>{localization.ReportPage.statusHeader}</Typography>
                    <FilterBox values={Object.keys(localization.misc.status)}
                               labelMap={localization.misc.status}
                               title={localization.ReportPage.statusHeader}
                               colors={Object.values(colors.status)}
                               selected={selectedStatus}
                               setSelected={setSelectedStatus}
                               arrowIcon={createSvgIcon(<KeyboardDoubleArrowDownRoundedIcon sx={{color: mainTheme.palette.primary.contrastText}}/>, 'DoubleArrowDownRounded')}
                    >
                    </FilterBox>
                </Stack>
                <Divider orientation="vertical" flexItem sx={dividerStyle}/>
                <Stack sx={gridHeaderElementsStyle}>
                    <Typography variant="h5" sx={titlePropsStyle}>{localization.ReportPage.severityHeader}</Typography>
                    <FilterBox values={Object.keys(localization.misc.severity)}
                               labelMap={localization.misc.severity}
                               title={localization.ReportPage.severityHeader}
                               colors={Object.values(colors.severity)}
                               selected={selectedSeverity}
                               setSelected={setSelectedSeverity}
                               arrowIcon={createSvgIcon(<KeyboardDoubleArrowDownRoundedIcon sx={{color: mainTheme.palette.primary.contrastText}}/>, 'DoubleArrowDownRounded')}
                               >
                    </FilterBox>
                </Stack>
                <Divider orientation="vertical" flexItem sx={dividerStyle}/>
                <Stack sx={gridHeaderElementsStyle}>
                    <Typography variant="h5" mb={"0.5rem"}
                                sx={titlePropsStyle}>{localization.ReportPage.dependencyHeader}</Typography>
                    <Stack width={"50%"}>
                        <DropDownMenu
                            state={{value: dependency, setValue: setSelectedDependency}}
                            choices={Array.from(uniqueDependencies)}
                            readOnly={false}
                            background={"#FFFFFF"}
                            arrowIcon={createSvgIcon(<KeyboardDoubleArrowDownRoundedIcon sx={{color: mainTheme.palette.primary.contrastText}}/>, 'DoubleArrowDownRounded')}
                        />
                    </Stack>
                </Stack>
            </GridToolbarContainer>
        );
    }

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageMotion}>
            <Box className={"page"}>
                <Grid container spacing={3}>
                    <Grid item md={12} display={"flex"} justifyContent={"center"}>
                        <Typography variant="h5"
                                    sx={titlePropsStyle}>{projectId}</Typography>
                    </Grid>
                    <Grid item md={12} height={"80vh"} marginBottom={"2rem"} sx={gridStylings}>
                        {isSuccess ? <DataGrid
                            sx={{
                                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                                    outline: "none !important",
                                },
                                "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
                                    outline: "none !important"
                                }
                            }}
                            components={{Toolbar: CustomToolbar}}
                            disableColumnFilter
                            rows={selectedReports}
                            columns={columns}
                            getRowId={(row) => row.cveObject.cveId + row.dependency.dependencyName + row.dependency.version}
                        /> : null}
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    )
}

/**************
 * Styles
 **************/

const gridStylings = {
    "& .MuiDataGrid-columnHeaders": {
        fontSize: "1.2rem",
        fontWeight: "500",
    },
    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
        outline: "none !important",
    }
}

const gridHeaderContainerStyle = {
    backgroundColor: mainTheme.palette.primary.main,
    padding: "1rem",
    borderRadius: "8px 8px 0 0"
}

const gridHeaderElementsStyle = {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap"
}

const dividerStyle = {
    backgroundColor: mainTheme.palette.background.paper,
    marginBottom: "1rem",
    marginTop: "1rem"
}

const titlePropsStyle = {
    color: mainTheme.palette.primary.contrastText,
}

export default ReportOverview
