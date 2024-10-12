import localization from "./localization"
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import ShieldIcon from '@mui/icons-material/Shield';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import GitHubIcon from "../components/Icons/GitHubIcon";

export const localStorageItemKeys = {
    selectedLanguage: "language",
    defaultLanguage: "defaultLanguage",
}

export const urlAddress = {
    api: {
        login: "login",
        logout: "logout",
        me: "me",
        myFavorite: "myFavorites",
        projectsFlat: "projectsFlat",
        projects: "projects",
        deleteProjects: "deleteProjects",
        projectGroups: "projectGroups",
        createProject: (projectId: string) => "projects/" + projectId,
        project: (projectId: string) => "projects/" + projectId,
        projectAPIKey: (projectId: string) => "projects/" + projectId + "/apiKey",
        projectDependencies: (projectId: string) => "projects/" + projectId + "/dependencies",
        projectReports: (projectId: string) => "projects/" + projectId + "/reports",
        projectUpdateCVEs: (projectId: string) => "projects/" + projectId + "/updateCVE",
        report: (projectId: string,
                 reportId: string) => "projects/" + projectId + "/reports/" + reportId,
        updateCVE: (cveId: string) => "cveObject/" + cveId + "/update",
        updateAllCVEs: "cveObjects/update",
        unknownPage: "error404"
    },
    media: {
        rootUrlWithBase: "", // gets set by ConfigContext Provider
        loginPageBackground: "static/images/SecureCheckPlusLogoVertical.svg",
        searching: "static/images/Searching.gif",
        logoHorizontal: "static/images/SecureCheckPlusLogoHorizontal.png",
        gitHubIcon: "static/icons/GitHubIcon.svg",
        error404: "static/images/error404.gif",
        avatar: "https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=",
        flag_de: "static/icons/flag_de.svg",
        flag_gb: "static/icons/flag_gb.svg",
        eye: "static/icons/eye.svg",
        eyeCrossed: "static/icons/eyeCrossed.svg",
        arrowDoubleDownIcon: "static/icons/arrowDoubleDownIcon.svg"
    },
    redirects: {
        standardAfterLogin: "/",
        allProjects: "/projects",
        allProjectGroups: "/projectgroups/",
        loginPage: "/login",
        projectBaseUrl: "projects/",
        mendio: "https://mend.io/vulnerability-database/",
        openCVE: "https://www.opencve.io/cve/",
        aquaSec: "https://avd.aquasec.com/nvd/",
        errorPage: "/error404",
        dependencies: "/dependencies",
        privacy: "/privacy",
        contact: "/contact"
    }
}

// Allows the rootUrlWithBase variable to be set dynamically by the ConfigContext Provider after loading the baseUrl
export const setRootUrlWithBase = (rootUrlWithBase: string) => {
    urlAddress.media.rootUrlWithBase = rootUrlWithBase;
}

export const groups = {
    basic: {
        id: "basic",
        name: "Standard",
        permissions: []
    },
    advanced: {
        id: "advanced",
        name: "Software Architekt"
    },
    admin: {
        id: "admin",
        name: "Admin"
    }
}

export const sideBarUpper = [[
    // localization.sidebar.upperMenu.projectGroups, // TODO: upcoming feature
    localization.sidebar.upperMenu.projects,
    localization.sidebar.upperMenu.privacy,
    localization.sidebar.upperMenu.contact
],
    [
        // <AppsIcon/>,
        <StorageRoundedIcon/>,
        <ShieldIcon/>,
        <RecentActorsIcon/>
    ],
    [
        // urlAddress.redirects.allProjectGroups,
        urlAddress.redirects.allProjects,
        urlAddress.redirects.privacy,
        urlAddress.redirects.contact
    ]
]

export const sideBarLower = [[
    localization.sidebar.lowerMenu.github,

],
    [
        <GitHubIcon/>,
    ],
    [
        "https://github.com/accso/SecureCheckPlus",
    ]
]