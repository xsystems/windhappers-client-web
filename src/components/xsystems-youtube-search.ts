import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { debounce } from 'throttle-debounce';

@customElement('xsystems-youtube-search')
export default class XsystemsYoutubeSearch extends LitElement {
  /**
   * YouTube Data API key.
   */
  @property({
    type: String,
  })
  key?: string;

  /**
   * Query term to search for.
   */
  @property({
    type: String,
  })
  query?: string;

  /**
   * Channel id, which indicates that the result set should only contain resources created by the channel.
   */
  @property({
    type: String,
  })
  channel?: string;

  /**
   * Identifies a specific page in the result set that should be returned.
   */
  @property({
    type: String,
    attribute: 'page-token',
  })
  pageToken?: string;

  /**
   * Specifies the maximum number of items that should be returned per page of the result set.
   */
  @property({
    type: Number,
    attribute: 'results-per-page',
  })
  resultsPerPage = 9;

  /**
   * Restricts a search query to only retrieve a particular type of resource.
   * The value is a comma-separated list of resource types.
   * Acceptable values are: `video`, `channel`, `playlist`.
   */
  @property({
    type: String,
  })
  type = 'video,channel,playlist';

  /**
   * Parameters the <a href="https://developers.google.com/youtube/v3/docs/search/list">YouTube Data API Search resource</a> allows.
   */
  @property({
    type: Object,
  })
  params?: object;

  /**
   * Length of time in milliseconds to debounce multiple automatically generated requests.
   */
  @property({
    type: Number,
    attribute: 'debounce-duration',
  })
  debounceDuration = 500;

  private _performRequest = this.debounceDuration
    ? debounce(this.debounceDuration, this._performRequestImpl)
    : this._performRequestImpl;

  updated(changedProperties: PropertyValues) {
    if (
      changedProperties.has('debounceDuration') &&
      this.debounceDuration !== changedProperties.get('debounceDuration')
    ) {
      this._performRequest = this.debounceDuration
        ? debounce(this.debounceDuration, this._performRequestImpl)
        : this._performRequestImpl;
    }

    if (
      this.pageToken &&
      this.pageToken === changedProperties.get('pageToken')
    ) {
      return;
    }

    if (
      this.key &&
      typeof this.query === 'string' &&
      this.type &&
      this.channel
    ) {
      this._performRequest(
        this.key,
        this.query,
        this.type,
        this.resultsPerPage,
        this.params,
        this.channel,
        this.pageToken
      );
    }
  }

  private _performRequestImpl(
    key: string,
    query: string,
    type: string,
    resultsPerPage: number,
    params?: object,
    channel?: string,
    pageToken?: string
  ) {
    const queryParams = {} as any;
    queryParams.key = key;
    queryParams.part = 'snippet';
    queryParams.q = query;
    queryParams.maxResults = resultsPerPage;
    queryParams.type = type;

    if (channel != null) {
      queryParams.channelId = channel;
    }

    if (pageToken != null) {
      queryParams.pageToken = pageToken;
    }

    for (const [paramKey, paramValue] of Object.entries(params ?? {})) {
      queryParams[paramKey] = paramValue;
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.search = new URLSearchParams(queryParams).toString();

    fetch(url.toString())
      .then(response => response.json())
      .then(responseJson => {
        this.dispatchEvent(
          new CustomEvent('response', {
            detail: responseJson,
          })
        );
      });
  }
}
