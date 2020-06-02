/**
 * Base api url to use.
 */
import {Url} from "./Url";

const baseUrl = "/remedy";

/**
 * Prepends a slash to the passed path parameter, if not existing.
 *
 * @param path The path to prepend with a slash
 */
const prependSlash = (path: string) => {
    return path.startsWith("/") ? path : ("/" + path);
}

/**
 * Creates the absolute url of the request. Adds the base url if necessary.
 *
 * @param url The relative or absolute url
 * @returns The absolute url to use
 */
const constructUrl = (url: string | Url) => {
    if(typeof url === "string") {
        if (url.startsWith("http")) {
            return url;
        }

        return baseUrl + prependSlash(url);
    }

    return prependSlash(url.baseUrl) + prependSlash(url.url);
};

export {
    prependSlash,
    constructUrl
};