export interface ProjectData {
    /**
     * Number of vulnerabilities classified as critical.
     */
    CRITICAL: number;
    /**
     * Number of vulnerabilities classified as high.
     */
    HIGH: number;
    /**
     * Number of vulnerabilities classified as medium.
     */
    MEDIUM: number;
    /**
     * Number of vulnerabilities classified as low.
     */
    LOW: number;
    /**
     * Number of vulnerabilities classified as none.
     */
    NONE: number;
    /**
     * Number of vulnerabilities where no classification was available.
     */
    NA: number;
}

