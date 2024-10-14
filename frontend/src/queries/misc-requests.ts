import {AxiosPromise} from "axios";
import apiClient from "./apiClient";
import {urlAddress} from "../utilities/constants";

export function updateCve(cveId: string): AxiosPromise {
    return apiClient.put(urlAddress.api.updateCVE(cveId))
}

export function updateAllCves(): AxiosPromise {
    return apiClient.put(urlAddress.api.updateAllCVEs)
}

export function unknownPage(): AxiosPromise {
    return apiClient.get(urlAddress.api.unknownPage)
}