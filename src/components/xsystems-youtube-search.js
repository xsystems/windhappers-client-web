import { LitElement } from 'lit-element';


export class XsystemsYoutubeSearch extends LitElement {
  static get properties() {
    return {
      /**
       * YouTube Data API key.
       */
      key: {
        type: String
      },
      /**
       * Query term to search for.
       */
      query: {
        type: String
      },
      /**
       * Channel id, which indicates that the result set should only contain resources created by the channel.
       */
      channel: {
        type: String
      },
      /**
       * Identifies a specific page in the result set that should be returned.
       */
      pageToken: {
        type: String,
        attribute: 'page-token'
      },
      /**
       * Specifies the maximum number of items that should be returned per page of the result set.
       */
      resultsPerPage: {
        type: Number,
        attribute: 'results-per-page'
      },
      /**
       * Restricts a search query to only retrieve a particular type of resource.
       * The value is a comma-separated list of resource types.
       * Acceptable values are: `video`, `channel`, `playlist`.
       */
      type: {
        type: String
      },
      /**
       * Parameters the <a href="https://developers.google.com/youtube/v3/docs/search/list">YouTube Data API Search resource</a> allows.
       */
      params: {
        type: Object
      },
      /**
       * Length of time in milliseconds to debounce multiple automatically generated requests.
       */
      debounceDuration: {
        type: Number,
        attribute: 'debounce-duration'
      },
      /**
       * The total number of results in the result set.
       * Please note that the value is an approximation and may not represent an exact value.
       * In addition, the maximum value is 1,000,000.
       *
       * You should not use this value to create pagination links.
       * Instead, use the `pageTokenNext` and `pageTokenPrev` property values to determine whether to show pagination links.
       */
      resultsTotal: {
        type: Number,
        attribute: 'results-total'
      },
      /**
       * List of results that match the search criteria.
       */
      items: {
        type: Object
      }
    };
  }

  constructor() {
    super();
    this.type = 'video,channel,playlist';
    this.resultsPerPage = 9;
    this.debounceDuration = 500;
  }

  updated(changedProperties) {
    if (this.pageToken && this.pageToken === changedProperties.pageToken) {
      return;
    }

    if (this.key && (typeof this.query === 'string') && this.type && this.channel) {
      this._performRequest(this.key, this.query, this.type, this.channel, this.pageToken, this.params);
    }
  }

  _performRequest(key, query, type, channel, pageToken, params) {
    let queryParams = {};
    queryParams.key = key;
    queryParams.part = 'snippet';
    queryParams.q = query;
    queryParams.maxResults = this.resultsPerPage;
    queryParams.type = type;

    if (channel != null) {
      queryParams.channelId  = channel;
    }

    if (pageToken != null) {
      queryParams.pageToken = pageToken;
    }

    for (let param in params) {
      queryParams[param] = params[param];
    }

    let url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.search = new URLSearchParams(queryParams).toString();

    fetch(url).then(response => {
      return response.json();
    }).then(responseJson => {
      this.dispatchEvent( new CustomEvent('response', { 
        detail: responseJson
      }));    
    });
  }
}

customElements.define('xsystems-youtube-search', XsystemsYoutubeSearch);