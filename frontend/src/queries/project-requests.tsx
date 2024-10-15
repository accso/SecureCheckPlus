import {AxiosPromise} from "axios";
import apiClient from "./apiClient";
import {urlAddress} from "../utilities/constants";

const pageSize = 10

export function getProjects(pageIndex: number, filterType: string): AxiosPromise {
    return apiClient.get(urlAddress.api.projects, {
        params: {
            pageSize: pageSize,
            pageIndex: pageIndex,
            filter: filterType
        }
    })
}

export function getAllProjectsFlat(): AxiosPromise {
    return apiClient.get(urlAddress.api.projectsFlat)
}

export function getProject(projectId: string): AxiosPromise {
    return apiClient.get(urlAddress.api.project(projectId))
}

export function updateProject(projectId: string, projectData: {}): AxiosPromise {
    return apiClient.put(urlAddress.api.project(projectId), projectData)
}

export function createProject(projectId: string, projectData: {}): AxiosPromise {
    return apiClient.post(urlAddress.api.createProject(projectId), projectData)
}

export function getProjectDependencies(projectId: string): AxiosPromise {
    return apiClient.get(urlAddress.api.projectDependencies(projectId))
}

export function getApiKey(projectId: string): AxiosPromise {
    return apiClient.post(urlAddress.api.projectAPIKey(projectId))
}

export function updateProjectCves(projectId: string): AxiosPromise {
    return apiClient.put(urlAddress.api.projectUpdateCVEs(projectId))
}

export function deleteProjects(projectIds: string[]): AxiosPromise {
    let data = {projectIds: projectIds}
    return apiClient.post(urlAddress.api.deleteProjects, data)
}