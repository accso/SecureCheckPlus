import {useInfiniteQuery, useMutation} from "react-query";
import React, {useEffect, useState} from "react";
import {deleteProjects, getProjects} from "../queries/project-requests";
import {useNotification} from "../context/NotificationContext";
import {useInView} from "react-intersection-observer";
import ProjectCard from "../components/ProjectCard";
import {
    Button,
    createSvgIcon,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    Typography
} from "@mui/material";
import {pageMotion} from "../style/animation";
import {motion} from "framer-motion";
import localization from "../utilities/localization"
import DropdownBox from "../components/DropdownBox";
import {mainTheme} from "../style/globalStyle";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import BasicButton from "../components/BasicButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CustomDialog from "../components/CustomDialog";
import ProjectCreationContent from "../components/NavBar/ProjectCreationContent";
import {useUserContext} from "../context/UserContext";

/**
 * Displays an overview of the projects.
 */

export default function ProjectOverview() {
    const user = useUserContext();
    const {ref, inView} = useInView()
    const [queryKey, setQueryKey] = useState("allProjects");
    const notification = useNotification();
    const [projectCreationMenuIsOpen, setOpenProjectCreationMenu] = useState(false);
    const [deleteWindowIsOpen, setDeleteWindowIsOpen] = React.useState(false);
    const [anyProjectsSelected, setAnyProjectsSelected] = useState(false)
    const {
        hasNextPage,
        isError,
        data,
        fetchNextPage,
    } = useInfiniteQuery(
        queryKey,
        async ({pageParam = 0}) => {
            let res;
            res = await getProjects(pageParam, queryKey)
            return res.data
        },
        {
            getNextPageParam: lastPage => {
                if (lastPage.properties.last_page) {
                    return undefined
                } else {
                    return lastPage.properties.next_page
                }
            }
        }
    )

    /**
     * The button to create a new project.
     */
    const createProjectButton = (
        <BasicButton
            startIcon={<AddBoxIcon style={{fontSize: "25px"}}/>}
            label={localization.dialog.create}
            variant={"contained"}
            onClick={() => setOpenProjectCreationMenu(true)}
            sx={{marginLeft: "4rem", width:"10rem"}}
            invert={true}
        />
    )


    /**
     * The button to delete projects.
     */
    const deleteProjectsButton = (
        <BasicButton
            startIcon={<AddBoxIcon style={{fontSize: "25px"}}/>}
            label={localization.dialog.delete}
            variant={"contained"}
            onClick={() => setDeleteWindowIsOpen(true)}
            sx={{marginLeft: "4rem", width:"10rem"}}
            invert={true}
            bgcolor={"red"}
            disabled={!anyProjectsSelected}
        />
    )


    const handleDelete = useMutation(() => deleteProjects(JSON.parse(sessionStorage.getItem("selectedProjectsIds") || "[]")))

    const listProjects = data?.pages.map((page, index: number) => (
        <React.Fragment key={index}>
            {page.projects.map((project: any) =>
                <ProjectCard project={project}
                             showCheckboxes={user && user.hasGroups(["admin"])}
                             anyProjectSelected={{value: anyProjectsSelected,
                                                  setValue: setAnyProjectsSelected}}
                />)
            }
            <Stack ref={ref} height={"2rem"}/>
        </React.Fragment>));

    useEffect(() => {
        sessionStorage.setItem("selectedProjectsIds", "[]");
    }, []);

    useEffect(() => {
        if(isError) {
            notification.error(localization.notificationMessage.errorDataFetch);
        }
    }, [listProjects])

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView])

    return(
        <>
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageMotion}>
                    <Stack sx={containerStyle}>
                        <Typography sx={titleStyle}>{localization.pageTitles.projects}</Typography>
                        <Stack sx={{flexDirection:"row", marginBottom: "2rem", justifyContent:"flex-start"}}>
                            <Stack sx={{width: "11rem"}}>
                                <DropdownBox
                                    valueToLabelMap={
                                        {
                                            allProjects: localization.pageTitles.projects,
                                            favoriteProjects: localization.pageTitles.favorite,
                                            recentProjects: localization.pageTitles.recent
                                        }
                                }
                                    state={{value: queryKey, setValue: setQueryKey}}
                                    arrowIcon={createSvgIcon(<KeyboardDoubleArrowDownRoundedIcon sx={{color: mainTheme.palette.primary.contrastText}}/>, 'DoubleArrowDownRounded')}
                                />
                            </Stack>
                            {user.username && user.hasGroups(["admin"]) ? createProjectButton : null}
                            {user.username && user.hasGroups(["admin"]) ? deleteProjectsButton : null}
                            <CustomDialog
                                title={localization.dialog.createProject}
                                dialogContent={<ProjectCreationContent setOpen={setOpenProjectCreationMenu}/>}
                                openState={
                                    {
                                        value: projectCreationMenuIsOpen,
                                        setValue: setOpenProjectCreationMenu
                                    }
                                }/>
                            <Dialog
                                open={deleteWindowIsOpen}
                                onClose={() => setDeleteWindowIsOpen(false)}
                            >
                                <DialogTitle>
                                    {JSON.parse(sessionStorage.getItem("selectedProjectsIds") || "[]").length > 1 ? localization.dialog.deleteProjects : localization.dialog.deleteProject}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {localization.dialog.areYouSure}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setDeleteWindowIsOpen(false)}>{localization.misc.cancel}</Button>
                                    <Button onClick={() => {
                                        setDeleteWindowIsOpen(false);
                                        handleDelete.mutate();
                                        setTimeout(() => {window.location.reload()}, 1000);}}
                                        autoFocus>
                                        {localization.misc.confirm}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Stack>
                        {listProjects}
                    </Stack>
            </motion.div>
        </>
    )
}

const containerStyle = {
    width: "50%",
    minWidth: "1000px",
    margin: "0 auto",
    flexDirection: "column",
    textAlign: "center",
}

const titleStyle = {
    fontSize: "2rem"
}