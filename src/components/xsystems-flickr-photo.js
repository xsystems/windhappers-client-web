import { LitElement } from 'lit-element';
import { debounce } from 'throttle-debounce';

export class XsystemsFlickrPhoto extends LitElement {
  static get properties() {
    return {
      /**
       * Flickr API key.
       */
      key: {
        type: String
      },

      /**
       * Id of the photo for which to get data.
       */
      photoId: {
        type: String,
        attribute: 'photo-id'
      },

      /**
       * The secret for the photo.
       *
       * If the correct secret is passed then permissions checking is skipped.
       * This enables the 'sharing' of individual photos by passing around the id and secret.
       */
      secret: {
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
    this.debounceDuration = 500;
  }

  updated(changedProperties) {
    if (changedProperties.has('debounceDuration') 
        && this.debounceDuration !== changedProperties.debounceDuration) {
      this._performRequest = this.debounceDuration ? debounce(this.debounceDuration, this._performRequestImpl) : this._performRequestImpl;
    }

    if (this.key && this.photoId) {
      this._performRequest(this.key, this.photoId, this.secret);
    }
  }

  _performRequestImpl(key, photoId, secret) {
    const queryParams = {};
    queryParams.format = 'json';
    queryParams.nojsoncallback = 1;
    queryParams.method = 'flickr.photos.getInfo';
    queryParams.api_key = key;
    queryParams.photo_id = photoId

    if (secret != null) {
      queryParams.secret = secret;
    }

    const url = new URL('https://api.flickr.com/services/rest');
    url.search = new URLSearchParams(queryParams).toString();

    fetch(url).then(response => {
      return response.json();
    }).then(responseJson => {
      this.dispatchEvent( new CustomEvent('response', { 
        detail: responseJson.photo
      }));    
    });
  }
}

customElements.define('xsystems-flickr-photo', XsystemsFlickrPhoto);