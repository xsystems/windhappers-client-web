import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { debounce } from 'throttle-debounce';

@customElement('xsystems-flickr-photoset')
export class XsystemsFlickrPhotoset extends LitElement {
  /**
   * Flickr API key.
   */
  @property({
    type: String,
  })
  key?: string;

  /**
   * Id of the user that owns the photo set corresponding to `photosetId`.
   *
   * This is optional, but passing this gives better performance.
   */
  @property({
    type: String,
    attribute: 'user-id',
  })
  userId?: string;

  /**
   * Id of the photoset for which to get the photos.
   */
  @property({
    type: String,
    attribute: 'photoset-id',
  })
  photosetId?: string;

  /**
   * The page of results to return.
   */
  @property({
    type: Number,
  })
  page = 1;

  /**
   * Number of photos to return per page.
   */
  @property({
    type: Number,
    attribute: 'results-per-page',
  })
  resultsPerPage = 9;

  /**
   * Extra information to fetch for each returned record.
   *
   * See the <a href="https://www.flickr.com/services/api/flickr.photosets.getPhotos.html">Flickr API documentation</a> for the supported fields.
   */
  @property({
    type: Array,
  })
  extras: string[] = [];

  /**
   * Return photos only matching a certain privacy level.
   *
   * This only applies when making an authenticated call to view a photoset you own.
   * See the <a href="https://www.flickr.com/services/api/flickr.photosets.getPhotos.html">Flickr API documentation</a> for the supported values.
   */
  @property({
    type: Number,
    attribute: 'privacy-filter',
  })
  privacyFilter?: number;

  /**
   * Filter results by media type.
   *
   * Possible values are `all`, `photos` or `videos`.
   */
  @property({
    type: String,
  })
  media = 'all';

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
      this.key &&
      this.userId &&
      this.photosetId &&
      this.page !== changedProperties.get('page')
    ) {
      this._performRequest(
        this.key,
        this.userId,
        this.photosetId,
        this.page,
        this.resultsPerPage,
        this.extras,
        this.media,
        this.privacyFilter,
      );
    }
  }

  private _performRequestImpl(
    key: string,
    userId: string,
    photosetId: string,
    page: number,
    resultsPerPage: number,
    extras: string[],
    media: string,
    privacyFilter?: number,
  ) {
    const queryParams = new URLSearchParams();
    queryParams.append('format', 'json');
    queryParams.append('nojsoncallback', '1');
    queryParams.append('method', 'flickr.photosets.getPhotos');
    queryParams.append('api_key', key);
    queryParams.append('user_id', userId);
    queryParams.append('photoset_id', photosetId);
    queryParams.append('page', `${page}`);
    queryParams.append('per_page', `${resultsPerPage}`);
    queryParams.append('extras', `description,${Array.isArray(extras) && extras.length > 0 ? extras.join() : ''}`);
    queryParams.append('media', media);

    if (privacyFilter != null) {
      queryParams.append('privacy_filter', `${privacyFilter}`);
    }

    const url = new URL('https://api.flickr.com/services/rest');
    url.search = queryParams.toString();

    fetch(url.toString())
      .then(response => response.json())
      .then(responseJson => {
        this.dispatchEvent(
          new CustomEvent('response', {
            detail: responseJson.photoset,
          })
        );
      });
  }
}
