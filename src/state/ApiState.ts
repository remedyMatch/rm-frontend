import {ActionCreatorWithoutPayload, ActionCreatorWithPayload, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {apiGet} from "../util/ApiUtils";

/**
 * Base api url to use.
 */
const baseUrl = "/remedy";

/**
 * Creates the absolute url of the request. Adds the base url if necessary.
 *
 * @param url The relative or absolute url
 * @returns The absolute url to use
 */
const constructUrl = (url: string) => {
    if (url.startsWith("http")) {
        return url;
    }

    return baseUrl + (url.startsWith("/") ? url : "/" + url);
};

/**
 * The representation of a redux store state.
 *
 * @template T The type of the value in this state
 */
export interface ApiState<T> {
    /**
     * The actual value of the state.
     */
    value?: T;

    /**
     * The error that occurred during the most recently completed request. Will be reset on the next successful request.
     */
    error?: string;

    /**
     * The current loading state.
     */
    loading: boolean;

    /**
     * The time the most recent successful request completed.
     */
    loadTime?: number;

    /**
     * The status code of the most recently completed request.
     */
    statusCode?: number;
}

/**
 * The representation of the payload of a "load failed" action.
 */
export interface LoadFailedPayload {
    /**
     * The error that occurred.
     */
    error: string;

    /**
     * The status code of the request.
     */
    statusCode: number;
}

/**
 * The representation of the payload of a "load successful" action.
 *
 * @template T The type of the actual result
 */
export interface LoadSuccessfulPayload<T> {
    /**
     * The actual result of the request.
     */
    value: T;

    /**
     * The status code of the request.
     */
    statusCode: number;
}

/**
 * Constants used for creating the action names.
 */
const LoadStarted = "LoadStarted";
const LoadSucceeded = "LoadSucceeded";
const LoadFailed = "LoadFailed";

/**
 * Initial state for every api state.
 */
const InitialApiState = {
    loading: false
};

/**
 * Processes a started request and sets the loading state to true.
 *
 * @param state The current state
 */
const reduceLoadStarted = <T>(state: ApiState<T>) => {
    state.loading = true;
};

/**
 * Processes a failed request. Sets the loading state to false and saves error message and status code.
 *
 * @param state The current state
 * @param action The "load failed" action
 */
const reduceLoadFailed = <T>(state: ApiState<T>, action: PayloadAction<LoadFailedPayload>) => {
    state.loading = false;
    state.error = action.payload.error;
    state.statusCode = action.payload.statusCode;
};

/**
 * Processes a succeeded request. Sets the loading state to false and saves the value, status code and load time.
 *
 * @param state The current state
 * @param action The "load succeeded" action
 */
const reduceLoadSucceeded = <T>(state: ApiState<T>, action: PayloadAction<LoadSuccessfulPayload<T>>) => {
    state.loading = false;
    state.value = action.payload.value;
    state.statusCode = action.payload.statusCode;
    state.loadTime = new Date().getTime();
};

/**
 * Creates a new api state for usage with redux toolkit. Returns the slice and the action to start loading the content.
 *
 * @template T The type of the value of the state
 * @template R The type of the response of the api, defaults to T
 *
 * @param name The name of the state, must be unique
 * @param url The url of the api
 * @param extractor An optional function to extract the value out of the api response
 *
 * @return A tuple containing the redux slice and the action to trigger an api request
 */
const createApiState = <T, R = T>(name: string, url: string, extractor?: (response: R) => T) => {
    const loadStartedAction = name + LoadStarted;
    const loadFailedAction = name + LoadFailed;
    const loadSucceededAction = name + LoadSucceeded;

    const slice = createSlice({
        name: name,
        initialState: InitialApiState as ApiState<T>,
        reducers: {
            [loadStartedAction]: reduceLoadStarted,
            [loadFailedAction]: reduceLoadFailed,
            [loadSucceededAction]: reduceLoadSucceeded
        }
    });

    const loadStarted = slice.actions[loadStartedAction] as unknown as ActionCreatorWithoutPayload; // TODO
    const loadFailed = slice.actions[loadFailedAction] as ActionCreatorWithPayload<LoadFailedPayload>;
    const loadSucceeded = slice.actions[loadSucceededAction] as ActionCreatorWithPayload<LoadSuccessfulPayload<T>>;

    const load = () => async (dispatch: (arg: any) => void) => {
        dispatch(loadStarted());
        const result = await apiGet<R>(constructUrl(url));
        if (result.error) {
            dispatch(loadFailed({
                error: result.error,
                statusCode: result.status
            }));
        } else {
            dispatch(loadSucceeded({
                value: extractor ? extractor(result.result!) : result.result as unknown as T, // TODO
                statusCode: result.status
            }));
        }
    };

    return [slice, load] as [typeof slice, typeof load];
};

export default createApiState;