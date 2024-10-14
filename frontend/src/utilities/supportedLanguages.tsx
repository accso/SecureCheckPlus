import {urlAddress} from "./constants";

export const getSupportedLanguages = () => {
    const supportedLanguages = [
        // Add new languages here
        ["de", "Deutsch", urlAddress.media.flag_de],
        ["en", "English", urlAddress.media.flag_gb],
    ];

    let languageAbbreviation: string[] = [];
    let languageNames: string[] = [];
    let flagURLs: string[] = [];
    supportedLanguages.forEach((language) => {
        languageAbbreviation.push(language[0]), languageNames.push(language[1]), flagURLs.push(urlAddress.media.rootUrlWithBase + language[2])
    })

    return {
        abbreviations: languageAbbreviation,
        names: languageNames,
        flagURLs: flagURLs,
    };
}