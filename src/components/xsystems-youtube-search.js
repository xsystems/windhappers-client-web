import { LitElement } from 'lit-element';
import { debounce } from 'throttle-debounce';

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
    if (changedProperties.has('debounceDuration') 
        && this.debounceDuration !== changedProperties.debounceDuration) {
      this._performRequest = this.debounceDuration ? debounce(this.debounceDuration, this._performRequestImpl) : this._performRequestImpl;
    }

    if (this.pageToken && this.pageToken === changedProperties.pageToken) {
      return;
    }

    if (this.key && (typeof this.query === 'string') && this.type && this.channel) {
      this._performRequest(this.key, this.query, this.type, this.channel, this.pageToken, this.resultsPerPage, this.params);
    }
  }

  _performRequestImpl(key, query, type, channel, pageToken, resultsPerPage, params) {
    const queryParams = {};
    queryParams.key = key;
    queryParams.part = 'snippet';
    queryParams.q = query;
    queryParams.maxResults = resultsPerPage;
    queryParams.type = type;

    if (channel != null) {
      queryParams.channelId  = channel;
    }

    if (pageToken != null) {
      queryParams.pageToken = pageToken;
    }

    for (const param in params) {
      queryParams[param] = params[param];
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
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