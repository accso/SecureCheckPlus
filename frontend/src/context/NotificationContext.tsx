import React, {useState} from "react";
import {NotificationProperty} from "../utilities/interfaces/NotificationProperty";

const NotificationContext = React.createContext<NotificationProperty>(null!);

function NotificationProvider({children}: { children: React.ReactNode }) {
    let [open, setOpen] = useState(false);
    let [message, setMessage] = useState("");
    let [type, setType] = useState("error");
    let [duration, setDuration] = useState(5000);

    function info(message: string) {
        setMessage(message);
        setType("info");
        setOpen(true);
    }

    function warn(message: string) {
        setMessage(message);
        setType("warning");
        setOpen(true);
    }

    function success(message: string) {
        setMessage(message);
        setType("success");
        setOpen(true);
    }

    function error(message: string) {
        setMessage(message);
        setType("error");
        setOpen(true);
    }

    let values = {open, setOpen, message, setMessage, type, setType, duration, setDuration, info, warn, error, success};

    return <NotificationContext.Provider value={values}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
    return React.useContext<NotificationProperty>(NotificationContext);
}

export default NotificationProvider