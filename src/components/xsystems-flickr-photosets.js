import { LitElement } from 'lit-element';
import { debounce } from 'throttle-debounce';

export class XsystemsFlickrPhotosets extends LitElement {
  static get properties() {
    return {
      /**
       * Flickr API key.
       */
      key: {
        type: String
      },

      /**
       * Id of the user to get a photoset list for.
       */
      userId: {
        type: String,
        attribute: 'user-id'
      },

      /**
       * The page of results to return.
       */
      page: {
        type: Number
      },

      /**
       * Number of photosets to return per page.
       */
      resultsPerPage: {
        type: Number,
        attribute: 'results-per-page'
      },

      /**
       * Extra information to fetch for the primary photo.
       *
       * See the <a href="https://www.flickr.com/services/api/flickr.photosets.getList.html">Flickr API documentation</a> for the supported fields.
       */
      primaryPhotoExtras: {
        type: Array,
        attribute: 'primary-photo-extras'
      },

      /**
       * Length of time in milliseconds to debounce multiple automatically generated requests.
       */
      debounceDuration: {
        type: Number,
        attribute: 'debounce-duration'
      },

      _response: {
        type: Object
      }
    };
  }

  constructor() {
    super();
    this.page = 1;
    this.resultsPerPage = 9;
    this.debounceDuration = 500;
  }

  updated(changedProperties) {
    if (changedProperties.has('debounceDuration') 
        && this.debounceDuration !== changedProperties.debounceDuration) {
      this._performRequest = this.debounceDuration ? debounce(this.debounceDuration, this._performRequestImpl) : this._performRequestImpl;
    }

    if (this.key && this.userId && this.page !== changedProperties.page) {
      this._performRequest(this.key, this.userId, this.page, this.resultsPerPage, this.primaryPhotoExtras);
    }
  }

  _performRequestImpl(key, userId, page, resultsPerPage, primaryPhotoExtras) {
    const queryParams = {};
    queryParams.format = 'json';
    queryParams.nojsoncallback = 1;
    queryParams.method = 'flickr.photosets.getList';
    queryParams.api_key = key;
    queryParams.user_id = userId;

    if (page != null) {
      queryParams.page = page;
    }

    if (resultsPerPage != null) {
      queryParams.per_page = resultsPerPage;
    }

    if (Array.isArray(primaryPhotoExtras) && primaryPhotoExtras.length > 0) {
      queryParams.primary_photo_extras = primaryPhotoExtras.join();
    }

    const url = new URL('https://api.flickr.com/services/rest');
    url.search = new URLSearchParams(queryParams).toString();

    fetch(url).then(response => {
      return response.json();
    }).then(responseJson => {
      this.dispatchEvent( new CustomEvent('response', { 
        detail: responseJson.photosets
      }));    
    });
  }
}

customElements.define('xsystems-flickr-photosets', XsystemsFlickrPhotosets);