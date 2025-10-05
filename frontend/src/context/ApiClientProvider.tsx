import React, { useEffect } from "react";
import {useConfig} from "./ConfigContext";
import apiClient from "../queries/apiClient";

const ApiClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { baseUrl } = useConfig();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const envApiUrl = process.env.REACT_APP_API_URL;
        if (envApiUrl) {
            apiClient.defaults.baseURL = envApiUrl;
        } else {
            apiClient.defaults.baseURL = location.protocol + '//' + location.host + "/" + (baseUrl ? `${baseUrl}/api/` : "api/");
        }
        setLoading(false);
    }, [baseUrl]);

    if (loading) {
        return <div>Loading configuration...</div>;
    }

    return <>{children}</>
}

export default ApiClientProvider;