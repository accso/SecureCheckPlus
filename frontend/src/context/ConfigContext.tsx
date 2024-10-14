import React, {createContext, useContext, useState, ReactNode, useEffect} from "react";
import {setRootUrlWithBase} from "../utilities/constants";

interface ConfigContextType {
    baseUrl: string;
    loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be within a ConfigProvider");
    }
    return context;
}

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [baseUrl, setBaseUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Load BASE_URL set by login.html and app.html template
        const BASE_URL = window.BASE_URL;
        setBaseUrl(BASE_URL || "");

        const rootUrl = location.protocol + '//' + location.host + "/";
        const rootUrlWithBase = BASE_URL ? rootUrl + BASE_URL + "/" : rootUrl;
        setRootUrlWithBase(rootUrlWithBase);

        setLoading(false);
    }, []);

    return (
        <ConfigContext.Provider value={{baseUrl, loading}}>
            {children}
        </ConfigContext.Provider>
    )
}
