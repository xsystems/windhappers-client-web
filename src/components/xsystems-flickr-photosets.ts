import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { debounce } from 'throttle-debounce';

@customElement('xsystems-flickr-photosets')
export class XsystemsFlickrPhotosets extends LitElement {
  /**
   * Flickr API key.
   */
  @property({
    type: String,
  })
  key?: string;

  /**
   * Id of the user to get a photoset list for.
   */
  @property({
    type: String,
    attribute: 'user-id',
  })
  userId?: string;

  /**
   * The page of results to return.
   */
  @property({
    type: Number,
  })
  page = 1;

  /**
   * Number of photosets to return per page.
   */
  @property({
    type: Number,
    attribute: 'results-per-page',
  })
  resultsPerPage = 9;

  /**
   * Extra information to fetch for the primary photo.
   *
   * See the <a href="https://www.flickr.com/services/api/flickr.photosets.getList.html">Flickr API documentation</a> for the supported fields.
   */
  @property({
    type: Array,
    attribute: 'primary-photo-extras',
  })
  primaryPhotoExtras?: string[];

  /**
   * Length of time in milliseconds to debounce multiple automatically generated requests.
   */
  @property({
    type: Number,
    attribute: 'debounce-duration',
  })
  debounceDuration = 100;

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

    if (this.key && this.userId && this.page !== changedProperties.get('page')) {
      this._performRequest(
        this.key,
        this.userId,
        this.page,
        this.resultsPerPage,
        this.primaryPhotoExtras
      );
    }
  }

  private _performRequestImpl(key: string, userId: string, page: number, resultsPerPage: number, primaryPhotoExtras?: string[]) {
    const queryParams = new URLSearchParams();
    queryParams.append('format', 'json');
    queryParams.append('nojsoncallback', '1');
    queryParams.append('method', 'flickr.photosets.getList');
    queryParams.append('api_key', key);
    queryParams.append('user_id', userId);
    queryParams.append('page', `${page}`);
    queryParams.append('per_page', `${resultsPerPage}`);

    if (Array.isArray(primaryPhotoExtras) && primaryPhotoExtras.length > 0) {
      queryParams.append('primary_photo_extras', `${primaryPhotoExtras.join()}`);
    }

    const url = new URL('https://api.flickr.com/services/rest');
    url.search = queryParams.toString();

    fetch(url.toString())
      .then(response => response.json())
      .then(responseJson => {
        this.dispatchEvent(
          new CustomEvent('response', {
            detail: responseJson.photosets,
          })
        );
      });
  }
}
