import {Dispatch, SetStateAction} from "react";

export interface NotificationProperty {
    /**
     * The initial state of the notification. A hook state.
     */
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    /**
     * The message to be display in the notification.
     */
    message: string
    setMessage: Dispatch<SetStateAction<string>>
    /**
     * The color variant of the notification.
     */
    type: string
    setType: Dispatch<SetStateAction<string>>
    /**
     * The duration of the notification in ms. Default value is 5000ms.
     */
    duration: number
    setDuration: Dispatch<SetStateAction<number>>
    /**
     * Shortcut for the above functions. Allow for quick notification.
     */
    info: (message: string) => void
    warn: (message: string) => void
    success: (message: string) => void
    error: (message: string) => void
}