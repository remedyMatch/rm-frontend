/**
 * The representation of an url, that does not use the default base url.
 */
export interface Url {
  /**
   * The base url to use.
   */
  baseUrl: string;

  /**
   * The url to use.
   */
  url: string;
}
