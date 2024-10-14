import React, {useEffect} from "react";
import {IconButton} from "@mui/material";
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {getFavorite, updateFavorite} from "../queries/user-requests";
import localization from "../utilities/localization";
import {useNotification} from "../context/NotificationContext";

interface Project {
    projectId: string
}

/**
 * A favorite button with toggle function. Automatically synchronizes with the server.
 * @param {Project} project
 */
const FavoriteButton: React.FunctionComponent<Project> = ({projectId}: Project) => {
    const notification = useNotification();

    const {isError, data} = useQuery("favorites", () => getFavorite())
    const queryClient = useQueryClient()

    /**
     * Toggles whether the project is a favorite or not. And invalidates old data linked to favorites.
     */
    const requestChangeFavorite = useMutation(() => updateFavorite(projectId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["favorites"]);
            queryClient.invalidateQueries("favorite");
        },
    })

    useEffect(() => {
        if (isError) {
            notification.error(localization.notificationMessage.errorUserDataFetch)
        }
    }, [isError])

    return (
        <IconButton onClick={() => requestChangeFavorite.mutate()} sx={{color: "#FAE266"}}>
            {data?.data.favoriteProjects.includes(projectId) ? <StarRateRoundedIcon sx={{color: "#FAE266"}}/> :
                <StarBorderRoundedIcon/>}
        </IconButton>
    );
}

export default FavoriteButton