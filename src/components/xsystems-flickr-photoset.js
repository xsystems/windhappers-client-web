import { LitElement } from 'lit-element';
import { debounce } from 'throttle-debounce';

export class XsystemsFlickrPhotoset extends LitElement {
  static get properties() {
    return {
      /**
       * Flickr API key.
       */
      key: {
        type: String
      },

      /**
       * Id of the user that owns the photo set corresponding to `photosetId`.
       *
       * This is optional, but passing this gives better performance.
       */
      userId: {
        type: String,
        attribute: 'user-id'
      },

      /**
      * Id of the photoset for which to get the photos.
      */
      photosetId: {
        type: String,
        attribute: 'photoset-id'
      },

      /**
       * The page of results to return.
       */
      page: {
        type: Number
      },

      /**
       * Number of photos to return per page.
       */
      resultsPerPage: {
        type: Number,
        attribute: 'results-per-page'
      },

      /**
       * Extra information to fetch for each returned record.
       *
       * See the <a href="https://www.flickr.com/services/api/flickr.photosets.getPhotos.html">Flickr API documentation</a> for the supported fields.
       */
      extras: {
        type: Array
      },

      /**
       * Return photos only matching a certain privacy level.
       *
       * This only applies when making an authenticated call to view a photoset you own.
       * See the <a href="https://www.flickr.com/services/api/flickr.photosets.getPhotos.html">Flickr API documentation</a> for the supported values.
       */
      privacyFilter: {
        type: Number,
        attribute: 'privacy-filter'
      },

      /**
       * Filter results by media type.
       *
       * Possible values are `all`, `photos` or `videos`.
       */
      media: {
        type: String
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
    this.media = 'all';
    this.debounceDuration = 500;
  }

  updated(changedProperties) {
    if (changedProperties.has('debounceDuration') 
        && this.debounceDuration !== changedProperties.debounceDuration) {
      this._performRequest = this.debounceDuration ? debounce(this.debounceDuration, this._performRequestImpl) : this._performRequestImpl;
    }

    if (this.key && this.userId && this.photosetId && this.page !== changedProperties.page) {
      this._performRequest(this.key, this.userId, this.photosetId, this.page, this.resultsPerPage, this.extras, this.privacyFilter, this.media);
    }
  }

  _performRequestImpl(key, userId, photosetId, page, resultsPerPage, extras, privacyFilter, media) {
    const queryParams = {};
    queryParams.format = 'json';
    queryParams.nojsoncallback = 1;
    queryParams.method = 'flickr.photosets.getPhotos';
    queryParams.api_key = key;
    queryParams.user_id = userId;
    queryParams.photoset_id = photosetId

    if (page != null) {
      queryParams.page = page;
    }

    if (resultsPerPage != null) {
      queryParams.per_page = resultsPerPage;
    }

    queryParams.extras = 'description,' + (Array.isArray(extras) && extras.length > 0 ? extras.join() : '');

    if (privacyFilter != null) {
      queryParams.privacy_filter = privacyFilter;
    }

    if (media != null) {
      queryParams.media = media;
    }

    const url = new URL('https://api.flickr.com/services/rest');
    url.search = new URLSearchParams(queryParams).toString();

    fetch(url).then(response => {
      return response.json();
    }).then(responseJson => {
      this.dispatchEvent( new CustomEvent('response', { 
        detail: responseJson.photoset
      }));    
    });
  }
}

customElements.define('xsystems-flickr-photoset', XsystemsFlickrPhotoset);