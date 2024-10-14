import React from "react"
import Login from "./page/Login";
import "./style/global.css"
import "./style/animation"
import {AnimatePresence} from "framer-motion";
import {QueryClient, QueryClientProvider} from "react-query";
import ReactDOM from "react-dom";
import {mainTheme} from "./style/globalStyle";
import {ReactQueryDevtools} from "react-query/devtools";
import NotificationProvider from "./context/NotificationContext";
import {ThemeProvider} from "@emotion/react";
import {BrowserRouter} from "react-router-dom";
import Notification from "./components/Notification";
import {ConfigProvider, useConfig} from "./context/ConfigContext";
import ApiClientProvider from "./context/ApiClientProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            retry: false,
            staleTime: 1000 * 60 * 20 // 20min
        }
    }
});

const LoginContent: React.FC = () => {
    const {baseUrl, loading} = useConfig();

    if (loading) {
        return <div>Loading configuration...</div>;
    }

    return (
        <ApiClientProvider>
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                    <ThemeProvider theme={mainTheme}>
                        <BrowserRouter basename={baseUrl}>
                            <Notification/>
                            <AnimatePresence exitBeforeEnter>
                                <Login></Login>
                            </AnimatePresence>
                            <ReactQueryDevtools initialIsOpen={false}/>
                        </BrowserRouter>
                    </ThemeProvider>
                </NotificationProvider>
            </QueryClientProvider>
        </ApiClientProvider>
    )
}

const renderLogin = () => {
    ReactDOM.render(
        <React.StrictMode>
            <ConfigProvider>
                <LoginContent/>
            </ConfigProvider>
        </React.StrictMode>
        , document.getElementById("root")
    );
};

document.addEventListener('DOMContentLoaded', () => {
    renderLogin();
})

renderLogin();
