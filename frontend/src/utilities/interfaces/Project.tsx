import {ProjectData} from "./ProjectData";
import {WaiverConfigData} from "./WaiverConfigData";

export interface Project {
    /**
     * The ID of the project.
     */
    projectId: string
    /**
     * The name of the project
     */
    projectName: string;
    /**
     * The found severity numbers.
     */
    projectData?: ProjectData;
    /**
     * Waiver configuration data
     */
    waiverConfigData?: WaiverConfigData;
}