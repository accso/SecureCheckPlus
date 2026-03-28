import React, { useEffect } from "react";
import {useConfig} from "./ConfigContext";
import apiClient from "../queries/apiClient";

const ApiClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { baseUrl } = useConfig();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const envApiUrlRaw = process.env.REACT_APP_API_URL || '';
        // Normalize env var: remove any trailing /api or /api/ and ensure trailing slash
        const envApiUrl = envApiUrlRaw.replace(/\/api\/?$/,'').trim();
        if (envApiUrl) {
            apiClient.defaults.baseURL = envApiUrl.endsWith('/') ? envApiUrl : envApiUrl + '/';
        } else {
            // Use origin (with optional baseUrl) but DO NOT include the 'api' segment here —
            // endpoints defined in urlAddress already include the 'api/' prefix.
            apiClient.defaults.baseURL = location.protocol + '//' + location.host + "/" + (baseUrl ? `${baseUrl}/` : "");
        }
        // Expose for debugging in browser devtools
        try { (window as any).__API_BASE__ = apiClient.defaults.baseURL } catch (e) { /* ignore in non-browser env */ }
        console.debug && console.debug("ApiClientProvider: resolved api base url:", apiClient.defaults.baseURL);
        setLoading(false);
    }, [baseUrl]);

    if (loading) {
        return <div>Loading configuration...</div>;
    }

    return <>{children}</>
}

export default ApiClientProvider;