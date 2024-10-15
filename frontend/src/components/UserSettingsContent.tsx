import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {Avatar, Button, Stack, TextField, Typography} from "@mui/material";
import localization from "../utilities/localization"
import DropdownMenu from "./DropdownMenu";
import {urlAddress} from "../utilities/constants"
import {useMutation, useQuery, useQueryClient} from "react-query";
import {getUserData, updateUserData} from "../queries/user-requests";
import {colors} from "../style/globalStyle";
import {useNotification} from "../context/NotificationContext";

interface DialogProps {
    setOpen: Dispatch<SetStateAction<boolean>>
}


/**
 * The dialog of the user settings.
 * @param {DialogProps} dialogProps
 */
const UserSettingsContent: React.FunctionComponent<DialogProps> = (dialogProps: DialogProps) => {
    const notification = useNotification();
    const queryClient = useQueryClient();
    const {isError, isSuccess, data} = useQuery("userData", getUserData);
    const [notificationThreshold, setNotificationThreshold] = useState<string>("")
    const [imageHash, setImageHash] = useState<string>("")

    useEffect(() => {
        if (isSuccess) {
            setNotificationThreshold(data.data.notificationThreshold)
            setImageHash(data.data.imageHash)
        }
        if (isError) {
            notification.error(localization.notificationMessage.errorUserDataFetch)
        }
    }, [data])

    /**
     * Updates on save button and invalidates old data.
     */
    const handleSave = useMutation(() => updateUserData({
        notificationThreshold: notificationThreshold,
        imageHash: imageHash
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("userData");
            notification.success(localization.notificationMessage.saveSuccessfully);
            dialogProps.setOpen(false);
        },
        onError: () => {
            notification.error(localization.notificationMessage.settingsSaveFailed);
        }
    })

    return (
        <Stack>
            <Stack sx={mainContainerStyle}>
                <Avatar sx={avatarStyle} src={urlAddress.media.avatar + imageHash}/>
                <TextField
                    label={localization.dialog.imageHash}
                    value={imageHash}
                    variant="filled"
                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setImageHash(e.target.value)}
                />
                <Stack sx={dropdownContainerStyle}>
                    <Typography variant={"body1"}>{localization.dialog.notificationThreshold}</Typography>
                    <DropdownMenu labelValueMap={localization.misc.notificationThreshold}
                                  colorValueMap={colors.threshold}
                                  choices={Object.keys(localization.misc.notificationThreshold)}
                                  state={{value: notificationThreshold, setValue: setNotificationThreshold}}/>
                </Stack>
                <Stack sx={buttonContainerStyle}>
                    <Button color={"error"} onClick={() => dialogProps.setOpen(false)}>{localization.misc.cancel}</Button>
                    <Button color={"success"} onClick={() => handleSave.mutate()}>{localization.misc.save}</Button>
                </Stack>
            </Stack>
        </Stack>
    )
}


/**************
 * Styles
 **************/

const mainContainerStyle = {
    direction: "column",
    alignItems: "center",
    margin: "0px 25px 0px 25px",
}

const dropdownContainerStyle = {
    marginTop: "2rem",
    width: "15rem"
}

const buttonContainerStyle = {
    flexDirection: "row",
    marginTop: "3rem",
    marginBottom: "1rem",
    justifyContent: "center"
}

const avatarStyle = {
    width: "128px",
    height: "128px",
    marginBottom: "3rem"
}


export default UserSettingsContent