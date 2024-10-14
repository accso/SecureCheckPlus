import React, {useEffect} from "react";
import {groups} from "../utilities/constants";
import {UserContextType} from "../utilities/interfaces/UserContextType";
import {useQuery} from "react-query";
import {useNotification} from "./NotificationContext";
import {getUserData} from "../queries/user-requests";
import localization from "../utilities/localization";

let UserContext = React.createContext<UserContextType>(null!);

function UserContextProvider({children}: { children: React.ReactNode }) {
    const notification = useNotification();

    const [userGroups, setUserGroups] = React.useState<string[]>([groups.basic.id]);
    const [username, setUsername] = React.useState<string>("");

    const {data: userData, isError, isSuccess} = useQuery("userData", getUserData)

    useEffect(() => {
        if (isSuccess) {
            setUsername(userData?.data.username);
            setUserGroups(userData?.data.groups);
        } else if (isError) {
            notification.error(localization.notificationMessage.errorUserDataFetch);
        }
    }, [userData])

    /**
     * Checks if the user has at least one of the given group
     */
    function hasGroups(groups: string[] | string) {
        if (typeof groups === "string") {
            return userGroups.includes(groups)
        } else {
            for (const group of groups) {
                if (userGroups.includes(group))
                    return true;
            }
        }
        return false
    }

    let value = {username, userGroups, hasGroups};

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
    return React.useContext<UserContextType>(UserContext);
}

export default UserContextProvider