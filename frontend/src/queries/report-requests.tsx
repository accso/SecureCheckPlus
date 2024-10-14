import {AxiosPromise} from "axios";
import apiClient from "./apiClient";
import {urlAddress} from "../utilities/constants";

export function getProjectReportsOverview(projectId: string): AxiosPromise {
    return apiClient.get(urlAddress.api.projectReports(projectId))
}

export function getDetailedReport(projectId: string, reportId: string): AxiosPromise {
    return apiClient.get(urlAddress.api.report(projectId, reportId))
}

export function updateReport(projectId: string, reportId: string, reportData: {}): AxiosPromise {
    return apiClient.put(urlAddress.api.report(projectId, reportId), reportData)
}