import React, { useEffect } from "react";
import {useConfig} from "./ConfigContext";
import apiClient from "../queries/apiClient";

const ApiClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { baseUrl } = useConfig();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        apiClient.defaults.baseURL = location.protocol + '//' + location.host + "/" + (baseUrl ? `${baseUrl}/api/` : "api/");
        setLoading(false);
    }, [baseUrl]);

    if (loading) {
        return <div>Loading configuration...</div>;
    }

    return <>{children}</>
}

export default ApiClientProvider;