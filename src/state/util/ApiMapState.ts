import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { apiPost } from "../../util/ApiUtils";
import { ApiState } from "./ApiState";
import { Url } from "./Url";
import { constructUrl } from "./UrlUtils";

/**
 * The representation of a redux store state.
 *
 * @template T The type of the value in this state
 */
export interface ApiMapState<T> {
  /**
   * The map with the specified ids mapped to the api state.
   */
  value: { [key: string]: ApiState<T> };
}

/**
 * The representation of the payload of a "load failed" action.
 */
export interface LoadFailedPayloadWithIds {
  /**
   * The id that couldn't be loaded.
   */
  ids: string[];

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
export interface LoadSuccessfulPayloadWithIds<T> {
  /**
   * The results that were loaded.
   */
  results: { [key: string]: T };

  /**
   * The status code of the request.
   */
  statusCode: number;
}

/**
 * The representation of the payload of a "load started" action.
 */
export interface LoadStartedPayloadWithIds {
  /**
   * The id that is being loaded.
   */
  ids: string[];
}

/**
 * Constants used for creating the action names.
 */
const LoadStartedForIds = "LoadStartedForIds";
const LoadSucceededForIds = "LoadSucceededForIds";
const LoadFailedForIds = "LoadFailedForIds";

/**
 * Initial state for every api map state.
 */
const InitialApiMapState = {
  value: {},
};

/**
 * Processes a started request and sets the loading state to true.
 *
 * @param state The current state
 * @param action The "load started" action
 */
const reduceLoadStartedWithIds = <T>(
  state: ApiMapState<T>,
  action: PayloadAction<LoadStartedPayloadWithIds>
) => {
  for (const id of action.payload.ids) {
    const entry = state.value[id];
    if (entry) {
      entry.loading = true;
    } else {
      state.value[id] = {
        loading: true,
      };
    }
  }
};

/**
 * Processes a failed request. Sets the loading state to false and saves error message and status code.
 *
 * @param state The current state
 * @param action The "load failed" action
 */
const reduceLoadFailedWithIds = <T>(
  state: ApiMapState<T>,
  action: PayloadAction<LoadFailedPayloadWithIds>
) => {
  for (const id of action.payload.ids) {
    const entry = state.value[id];
    if (entry) {
      entry.loading = false;
      entry.error = action.payload.error;
      entry.statusCode = action.payload.statusCode;
    }
  }
};

/**
 * Processes a succeeded request. Sets the loading state to false and saves the value, status code and load time.
 *
 * @param state The current state
 * @param action The "load succeeded" action
 */
const reduceLoadSucceededWithIds = <T>(
  state: ApiMapState<T>,
  action: PayloadAction<LoadSuccessfulPayloadWithIds<T>>
) => {
  const now = new Date().getTime();
  for (const [id, value] of Object.entries(action.payload.results)) {
    const entry = state.value[id];
    if (entry) {
      entry.loading = false;
      entry.value = value;
      entry.statusCode = action.payload.statusCode;
      entry.loadTime = now;
    }
  }
};

/**
 * Creates a new api map state for usage with redux toolkit. Returns the slice and the action to start loading one or
 * several entries at once.
 *
 * @template T The type of a single entry of the state
 * @template R The type of the response of the api, defaults to Map<string, T>
 *
 * @param name The name of the state, must be unique
 * @param url The url of the api
 * @param extractor An optional function to extract the value out of the api response
 *
 * @return A tuple containing the redux slice and the action to trigger an api request
 */
const createApiMapState = <T, R = { [key: string]: T }>(
  name: string,
  url: string | Url,
  extractor?: (response: R) => { [key: string]: T }
) => {
  const loadStartedAction = name + LoadStartedForIds;
  const loadFailedAction = name + LoadFailedForIds;
  const loadSucceededAction = name + LoadSucceededForIds;

  const slice = createSlice({
    name: name,
    initialState: InitialApiMapState as ApiMapState<T>,
    reducers: {
      [loadStartedAction]: reduceLoadStartedWithIds,
      [loadFailedAction]: reduceLoadFailedWithIds,
      [loadSucceededAction]: reduceLoadSucceededWithIds,
    },
  });

  const loadStarted = (slice.actions[
    loadStartedAction
  ] as unknown) as ActionCreatorWithPayload<LoadStartedPayloadWithIds>;
  const loadFailed = slice.actions[
    loadFailedAction
  ] as ActionCreatorWithPayload<LoadFailedPayloadWithIds>;
  const loadSucceeded = slice.actions[
    loadSucceededAction
  ] as ActionCreatorWithPayload<LoadSuccessfulPayloadWithIds<T>>;

  const load = (...ids: string[]) => async (dispatch: (arg: any) => void) => {
    if (ids.length === 0) {
      return;
    }

    dispatch(loadStarted({ ids }));
    const result = await apiPost<R>(constructUrl(url), { ids });
    if (result.error) {
      dispatch(
        loadFailed({
          ids: ids,
          error: result.error,
          statusCode: result.status,
        })
      );
    } else {
      dispatch(
        loadSucceeded({
          results: extractor
            ? extractor(result.result!)
            : ((result.result as unknown) as { [key: string]: T }),
          statusCode: result.status,
        })
      );
    }
  };

  return [slice, load] as [typeof slice, typeof load];
};

export default createApiMapState;
