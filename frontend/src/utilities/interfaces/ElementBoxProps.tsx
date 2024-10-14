export interface ElementBoxProps {
    /**
     * The name of the severity.
     */
    severity: string
    /**
     * The number of found severities corresponding to the severity name.
     */
    projectSeverityData: number
    /**
     * Whether it is the last box to be created (useful for borderRadius).
     */
    isLast: boolean
}