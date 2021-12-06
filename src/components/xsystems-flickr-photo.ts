import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { debounce } from 'throttle-debounce';

@customElement('xsystems-flickr-photo')
export class XsystemsFlickrPhoto extends LitElement {
  /**
   * Flickr API key.
   */
  @property({
    type: String,
  })
  key?: string;

  /**
   * Id of the photo for which to get data.
   */
  @property({
    type: String,
    attribute: 'photo-id',
  })
  photoId?: string;

  /**
   * The secret for the photo.
   *
   * If the correct secret is passed then permissions checking is skipped.
   * This enables the 'sharing' of individual photos by passing around the id and secret.
   */
  @property({
    type: String,
  })
  secret?: string;

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

    if (this.key && this.photoId) {
      this._performRequest(this.key, this.photoId, this.secret);
    }
  }

  private _performRequestImpl(key: string, photoId: string, secret?: string) {
    const queryParams = new URLSearchParams();
    queryParams.append('format', 'json');
    queryParams.append('nojsoncallback', '1');
    queryParams.append('method', 'flickr.photos.getInfo');
    queryParams.append('api_key', key);
    queryParams.append('photo_id', photoId);

    if (secret != null) {
      queryParams.append('secret', secret);
    }

    const url = new URL('https://api.flickr.com/services/rest');
    url.search = queryParams.toString();

    fetch(url.toString())
      .then(response => response.json())
      .then(responseJson => {
        this.dispatchEvent(
          new CustomEvent('response', {
            detail: responseJson.photo,
          })
        );
      });
  }
}
