export interface ReportSummary {
    /**
     * An dependency object
     */
    dependency: Dependency
    /**
     * The status of the report.
     */
    status: string
    /**
     * An cve object
     */
    cveObject: CVEObject
}

export interface Dependency {
    dependencyName: string
    dependencyInUse: boolean
    version: string
    packageManager: string
}

export interface CVEObject {
    cveId: string
    severity: string
    cvss: number
    epss: number
}

