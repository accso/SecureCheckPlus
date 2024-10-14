import React, {useEffect} from "react";
import localization from "../utilities/localization"
import {Box, Grid, Tooltip, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {getProjectDependencies} from "../queries/project-requests"
import {mainTheme} from "../style/globalStyle";
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {urlAddress} from "../utilities/constants";
import {pageMotion} from "../style/animation";
import {motion} from "framer-motion";
import {useNotification} from "../context/NotificationContext";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {useConfig} from "../context/ConfigContext";

/**
 * Fetches all reports of the corresponding project and displays them in a data grid.
 */
const DependencyOverview: React.FunctionComponent = () => {
    const notification = useNotification();
    const navigate = useNavigate()
    const {baseUrl} = useConfig();
    const {projectId} = useParams() as { projectId: string }
    document.title = projectId === undefined ? localization.pageTitles.error : projectId + " - " + localization.DependenciesPage.packages;
    const {
        isError,
        data,
        error,
        isSuccess,
    } = useQuery(["dependencyOverview", projectId], () => getProjectDependencies(projectId))

    useEffect(() => {
        if (isError) {
            // @ts-ignore
            if (error?.response?.status === 404) {
                navigate(baseUrl ? `/${baseUrl}${urlAddress.redirects.errorPage}` : urlAddress.redirects.errorPage, {replace: true})
            } else {
                notification.error(localization.notificationMessage.errorDataFetch)
            }
        }
    }, [data, isError])

    /**
     * The definition of the data grid columns.
     */
    const columns: GridColDef[] = [
        {
            field: "dependencyName",
            headerName: localization.DependenciesPage.packages,
            flex: 3,
            renderCell: (params: any) => (
                <Tooltip placement={"left"} title={params.value}>
                    <Typography>{params.value}</Typography>
                </Tooltip>)
        },
        {
            field: "dependencyInUse",
            headerName: localization.DependenciesPage.active,
            flex: 1,
            type: "boolean",
            filterable: true,
            description: localization.DependenciesPage.description,
            renderCell: (params) => {
                if (params.value) {
                    return <CheckIcon color={"success"}></CheckIcon>
                } else {
                    return <CloseIcon color={"error"}></CloseIcon>
                }
            }
        },
        {
            field: "version",
            headerName: localization.DependenciesPage.version,
            flex: 1,
            align: "center"
        },
        {
            field: "packageManager",
            headerName: localization.DependenciesPage.packageManager,
            flex: 2,
            align: "center"
        },
        {
            field: "license",
            headerName: localization.DependenciesPage.license,
            flex: 1,
            align: "center"
        },
        {
            field: "path",
            headerName: localization.DependenciesPage.path,
            flex: 10,
        }
    ];

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageMotion}>
            <Box className={"page"}>
                <Grid container spacing={3}>
                    <Grid item md={12} display={"flex"} justifyContent={"center"}>
                        <Typography variant="h5"
                                    sx={titlePropsStyle}>{projectId + " - " + localization.DependenciesPage.packages}</Typography>
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
                            rows={data?.data}
                            columns={columns}
                            getRowId={(row) => row.dependencyName + row.version}
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
    "& .MuiDataGrid-cell": {
        cursor: "pointer",
    },
}

const titlePropsStyle = {
    color: mainTheme.palette.primary.contrastText,
}

export default DependencyOverview;
