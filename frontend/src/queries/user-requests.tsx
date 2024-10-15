import {AxiosPromise} from "axios";
import apiClient from "./apiClient";
import {urlAddress} from "../utilities/constants";

export function login(credentials: { username: string, password: string, keepMeLoggedIn: boolean }): AxiosPromise {
    return apiClient.post(urlAddress.api.login, credentials)
}

export function logout(): AxiosPromise {
    return apiClient.post(urlAddress.api.logout);
}

export function getUserData(): AxiosPromise {
    return apiClient.get(urlAddress.api.me);
}

export function updateUserData(userData: {}): AxiosPromise {
    return apiClient.put(urlAddress.api.me, userData);
}

export function getFavorite(): AxiosPromise {
    return apiClient.get(urlAddress.api.myFavorite);
}

export function updateFavorite(projectId: string): AxiosPromise {
    return apiClient.put(urlAddress.api.myFavorite, {projectId: projectId});
}