import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {ThemeProvider} from "@mui/material";
import UserContextProvider from "./context/UserContext";
import "./style/global.css";
import {mainTheme} from "./style/globalStyle";
import NotificationProvider from "./context/NotificationContext";
import ProjectOverview from "./page/ProjectOverview";
import Notification from "./components/Notification";
import Navbar from "./components/NavBar/Navbar";
import {AnimatePresence} from "framer-motion";
import ProjectPage from "./page/ProjectPage";
import DependencyOverview from "./page/DependencyOverview";
import ReportOverview from "./page/ReportOverview";
import ReportPage from "./page/ReportPage";
import Error404Page from "./page/Error404Page";
import Privacy from "./page/Privacy";
import Contact from "./page/Contact";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
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

const locales = ['en', 'en-gb', 'zh-cn', 'de'];

const AppContent: React.FC = () => {
    const {baseUrl, loading} = useConfig();

    if (loading) {
        return <div>Loading configuration...</div>;
    }

    return (
        <ApiClientProvider>
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                    <UserContextProvider>
                        <ThemeProvider theme={mainTheme}>
                            <BrowserRouter>
                                <Notification/>
                                <Navbar/>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales[1]}>
                                    <AnimatePresence exitBeforeEnter>
                                        <Routes location={location} key={location.pathname}>
                                            <Route path={baseUrl} element={<ProjectOverview/>}/>
                                            <Route path={baseUrl + "/projects"} element={<ProjectOverview/>}/>
                                            <Route path={baseUrl + "/projects/:projectId"}
                                                   element={<ProjectPage/>}/>
                                            <Route path={baseUrl + "/projects/:projectId/dependencies"}
                                                   element={<DependencyOverview/>}/>
                                            <Route path={baseUrl + "/projects/:projectId/reports"}
                                                   element={<ReportOverview/>}/>
                                            <Route path={baseUrl + "/projects/:projectId/reports/:reportId"}
                                                   element={<ReportPage/>}/>
                                            <Route path={baseUrl + "/privacy"} element={<Privacy/>}/>
                                            <Route path={baseUrl + "/contact"} element={<Contact/>}></Route>
                                            <Route path="*" element={<Error404Page/>}/>
                                        </Routes>
                                    </AnimatePresence>
                                </LocalizationProvider>
                            </BrowserRouter>
                            <ReactQueryDevtools initialIsOpen={false}/>
                        </ThemeProvider>
                    </UserContextProvider>
                </NotificationProvider>
            </QueryClientProvider>
        </ApiClientProvider>
    )
}

const renderApp = () => {

    ReactDOM.render(
        <React.StrictMode>
            <ConfigProvider>
                <AppContent/>
            </ConfigProvider>
        </React.StrictMode>,
        document.getElementById('root')
    );
};

document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});

renderApp();
