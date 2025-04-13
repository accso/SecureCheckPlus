import React, {useEffect, useState} from "react";
import {updateProject} from "../queries/project-requests";
import {IconButton} from "@mui/material";
import {Update, UpdateDisabled} from "@mui/icons-material";

interface Props {
    project: any
}

const UpdateButton: React.FunctionComponent<Props> = ({project}: Props) => {

    const [autoUpdate, setAutoUpdate] = useState(project.autoUpdate);

    const handleAutoUpdateToggle = async () => {
        const newAutoUpdateValue = !autoUpdate;
        setAutoUpdate(newAutoUpdateValue);
        await updateProjectAutoUpdate(project.projectId, newAutoUpdateValue);
    };

    const updateProjectAutoUpdate = async (projectId: string, autoUpdate: boolean) => {
        updateProject(projectId, { autoUpdate: autoUpdate });
    };

    useEffect(() => {
        setAutoUpdate(project.autoUpdate);
    }, [project.autoUpdate]);

    return (
        <IconButton onClick={handleAutoUpdateToggle}>
            {autoUpdate ? <Update/> :
                <UpdateDisabled/>}
        </IconButton>
    );
}
export default UpdateButton