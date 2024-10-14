import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Alert, {AlertColor} from "@mui/material/Alert";
import {Portal} from "@mui/material";
import {useNotification} from "../context/NotificationContext";


export default function Notification() {
    const notificationContext = useNotification();
    return (
        <Portal>
            <Snackbar open={notificationContext.open}
                      onClose={() => notificationContext.setOpen(false)}
                      autoHideDuration={notificationContext.duration}
                      anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                      TransitionComponent={Slide}>
                <Alert variant="filled"
                       severity={notificationContext.type as AlertColor}
                >
                    {notificationContext.message}
                </Alert>
            </Snackbar>
        </Portal>
    )
}


