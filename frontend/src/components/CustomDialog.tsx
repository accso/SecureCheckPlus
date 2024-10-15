import React, {Dispatch, SetStateAction} from "react";
import {Breakpoint, Button, Dialog, DialogContent, DialogTitle, Slide} from "@mui/material";

export interface DialogContentProps {
    setOpen: Dispatch<SetStateAction<boolean>>
}

export interface DialogProps {
    /**
     * The title of the dialog box.
     */
    title?: string
    /**
     * The content to be displayed on the dialog.
     */
    dialogContent: React.ReactElement<DialogContentProps>
    /**
     * The useState Hooks to open and close the dialog.
     */
    openState: {
        value: boolean
        setValue: Dispatch<SetStateAction<boolean>>
    }
    /**
     * Adds a padding to the DialogContent
     */
    padding?: string
    /**
     * Dialog uses full width
     */
    fullWidth?: boolean
    /**
     * Sets Dialogs max width
     */
    maxWidth?: Breakpoint
}

/**
 * A dialog used to create pop-ups to let the user interact with it (e.g. Usersettings)
 * @param {DialogProps} dialogProps
 */
export default function CustomDialog(dialogProps: DialogProps) {
    const handleClose = (event: any, reason: string) => {
        if (reason && reason == "backdropClick")
            return;
        dialogProps.openState.setValue(false)
    }

    return (
        <Dialog
            TransitionComponent={Slide}
            open={dialogProps.openState.value}
            keepMounted
            onClose={handleClose}
            fullWidth={!!dialogProps.fullWidth}
            maxWidth={dialogProps.maxWidth ? dialogProps.maxWidth : "sm"}
        >
            <Button style={{alignSelf:"end", position:"relative", zIndex: "9",}} onClick={() => dialogProps.openState.setValue(false)}>✖</Button>
            <DialogTitle style={{display: dialogProps.title ? "inline" : "none"}}>{dialogProps.title}</DialogTitle>
            <DialogContent sx={{padding: dialogProps.padding ? dialogProps.padding : "0 0 0 0"}}>
                {dialogProps.dialogContent}
            </DialogContent>
        </Dialog>
    )
}