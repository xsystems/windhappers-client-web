import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './components/xsystems-flickr-photo.js';
import './components/xsystems-flickr-photoset.js';
import './components/xsystems-flickr-photosets.js';
import './components/xsystems-gallery.js';
import './components/xsystems-google-sheets.js';
import './windhappers-volunteer.js';

import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { XsystemsFlickrPhotoset } from './components/xsystems-flickr-photoset.js';
import { XsystemsFlickrPhotosets } from './components/xsystems-flickr-photosets.js';
import { XsystemsGallerry } from './components/xsystems-gallery.js';
import { FlickrPhoto } from './entities/FlickrPhoto.js';
import { FlickrPhotoset } from './entities/FlickrPhotoset.js';
import { FlickrPhotosets } from './entities/FlickrPhotosets.js';
import { Volunteer } from './entities/Volunteer.js';
import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-photos')
export class WindhappersPhotos extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        display: grid;
        padding-left: 1vh;
        padding-right: 1vh;
      }

      #volunteerContainer {
        display: grid;
        grid-gap: 1vh;
        margin-top: 1vh;
        margin-bottom: 1vh;
      }

      :host([narrow]) #volunteerContainer {
        grid-template-columns: 1fr;
      }

      :host(:not([narrow])) #volunteerContainer {
        grid-template-columns: 1fr 1fr;
      }

      #photosetGallery,
      #photoGallery {
        margin-top: 1vh;
      }

      #photo {
        display: flex;
        box-shadow: var(--shadow-elevation-4dp);
      }

      :host(:not([narrow])) #photo {
        justify-self: center;
      }

      :host([narrow]) #photo > img {
        width: 100%;
      }

      :host(:not([narrow])) #photo > img {
        height: 65vh;
      }

      .navigation {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        padding: 1vh;
      }
    `,
  ];

  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: String,
    attribute: 'route-prefix',
  })
  routePrefix = '';

  @property({
    type: Array,
  })
  volunteers: Volunteer[] = [];

  @property({
    type: Object,
  })
  private _route?: object;

  @property({
    type: Object,
  })
  private _routeTail?: object;

  @property({
    type: Object,
  })
  private _responsePhotosets?: FlickrPhotosets;

  @property({
    type: Object,
  })
  private _responsePhotoset?: FlickrPhotoset;

  @property({
    type: Object,
  })
  private _responsePhoto?: FlickrPhoto;

  @property({
    type: String,
  })
  private _photosetId?: string;

  @property({
    type: String,
  })
  private _photosetIdPrevious?: string;

  @property({
    type: String,
  })
  private _photoId?: string;

  updated(changedProperties: PropertyValues) {
    const photosetGallery =
      this.shadowRoot!.querySelector<XsystemsGallerry>('#photosetGallery');
    const photoGallery =
      this.shadowRoot!.querySelector<XsystemsGallerry>('#photoGallery');

    if (photosetGallery && this._responsePhotosets) {
      if (
        changedProperties.has('_responsePhotosets') &&
        this._responsePhotosets !== changedProperties.get('_responsePhotosets')
      ) {
        WindhappersPhotos._addPhotosets(
          photosetGallery,
          this._responsePhotosets
        );
      }

      if (
        photosetGallery.isEmpty() &&
        !this._photosetId &&
        changedProperties.has('_photosetId') &&
        this._photosetId !== changedProperties.get('_photosetId')
      ) {
        WindhappersPhotos._addPhotosets(
          photosetGallery,
          this._responsePhotosets
        );
      }
    }

    if (photoGallery && !this._photoId) {
      if (
        changedProperties.has('_photosetId') &&
        this._photosetId &&
        this._photosetId !== this._photosetIdPrevious
      ) {
        photoGallery.reset();
      }

      if (this._responsePhotoset) {
        if (
          changedProperties.has('_responsePhotoset') &&
          this._responsePhotoset !== changedProperties.get('_responsePhotoset')
        ) {
          WindhappersPhotos._addPhotoset(photoGallery, this._responsePhotoset);
        } else if (photoGallery.isEmpty()) {
          WindhappersPhotos._addPhotoset(photoGallery, this._responsePhotoset);
        }
      }
    }
  }

  render() {
    return html`
      <app-location
        @route-changed="${(event: CustomEvent<{ value: object }>) => {
          this._route = event.detail.value;
        }}"
      ></app-location>
      <app-route
        .route="${this._route}"
        pattern="${this.routePrefix}/:photosetId"
        @data-changed="${(
          event: CustomEvent<{ value: { photosetId: string } }>
        ) => {
          this._photosetId = event.detail.value.photosetId;
        }}"
        @active-changed="${(event: CustomEvent<{ value: boolean }>) => {
          if (!event.detail.value) {
            this._responsePhotoset = undefined;
            this._photosetIdPrevious = this._photosetId;
            this._photosetId = undefined;
            this._photoId = undefined;
          }
        }}"
        @tail-changed="${(event: CustomEvent<{ value: object }>) => {
          this._routeTail = event.detail.value;
        }}"
      ></app-route>
      <app-route
        .route="${this._routeTail}"
        pattern="/:photoId"
        @data-changed="${(
          event: CustomEvent<{ value: { photoId: string } }>
        ) => {
          this._photoId = event.detail.value.photoId;
        }}"
        @active-changed="${(event: CustomEvent<{ value: boolean }>) => {
          if (!event.detail.value) {
            this._photoId = undefined;
          }
        }}"
      ></app-route>

      ${cache(this._pages(this.routePrefix, this._photosetId, this._photoId))}

      <xsystems-google-sheets
        hidden
        key="AIzaSyDTj9__sWn_MKroJ6vlad1pCCidRBi6a5g"
        spreadsheetId="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
        range="Vrijwilligers"
        @rows="${(event: CustomEvent<Volunteer[]>) => {
          this.volunteers = event.detail;
        }}"
      ></xsystems-google-sheets>

      <div id="volunteerContainer">
        ${this.volunteers
          .filter(volunteer => WindhappersPhotos._isRelatedVolunteer(volunteer))
          .map(
            volunteer => html`
              <windhappers-volunteer
                ?narrow="${this.narrow}"
                name="${volunteer.name}"
                role="${volunteer.role}"
                email="${volunteer.email}"
                email-personal="${volunteer.emailPersonal}"
                phone="${volunteer.phone}"
              ></windhappers-volunteer>
            `
          )}
      </div>
    `;
  }

  loadMore() {
    const elementName = this._photosetId
      ? 'xsystems-flickr-photoset'
      : 'xsystems-flickr-photosets';

    const element = this.shadowRoot!.querySelector<
      XsystemsFlickrPhotoset | XsystemsFlickrPhotosets
    >(elementName);

    const response = this._photosetId
      ? this._responsePhotoset
      : this._responsePhotosets;

    if (element && response) {
      if (response.page < response.pages) {
        element.page = response.page + 1;
      }
    }
  }

  private _pages(routePrefix: string, photosetId?: string, photoId?: string) {
    if (photoId) {
      return html`
        <a href="${routePrefix}/${photosetId}" title="Back" class="navigation">
          <mwc-icon>arrow_back</mwc-icon> Terug
        </a>

        <xsystems-flickr-photo
          key="757b4474c3d5653a8958a33d9cf647a2"
          photo-id="${photoId}"
          @response="${(event: CustomEvent<FlickrPhoto>) => {
            this._responsePhoto = event.detail;
          }}"
        ></xsystems-flickr-photo>

        <a
          id="photo"
          href="${ifDefined(
            WindhappersPhotos._photoToUrl(this._responsePhoto, 'o')
          )}"
          download
        >
          <img
            src="${ifDefined(
              WindhappersPhotos._photoToUrl(this._responsePhoto, 'b')
            )}"
            alt="${this._responsePhoto?.title?._content || 'Foto zonder titel'}"
          />
        </a>
      `;
    }

    if (photosetId) {
      return html`
        <a href="${routePrefix}" title="Back" class="navigation">
          <mwc-icon>arrow_back</mwc-icon> Terug
        </a>

        <xsystems-flickr-photoset
          key="757b4474c3d5653a8958a33d9cf647a2"
          user-id="143394479@N04"
          photoset-id="${photosetId}"
          @response="${(event: CustomEvent<FlickrPhotoset>) => {
            this._responsePhotoset = event.detail;
          }}"
        ></xsystems-flickr-photoset>

        <xsystems-gallery
          id="photoGallery"
          ?narrow="${this.narrow}"
          route-prefix="${routePrefix}/${photosetId}"
        ></xsystems-gallery>
      `;
    }

    return html`
      <xsystems-flickr-photosets
        key="757b4474c3d5653a8958a33d9cf647a2"
        user-id="143394479@N04"
        @response="${(event: CustomEvent<FlickrPhotosets>) => {
          this._responsePhotosets = event.detail;
        }}"
      ></xsystems-flickr-photosets>

      <xsystems-gallery
        id="photosetGallery"
        ?narrow="${this.narrow}"
        route-prefix="${routePrefix}"
      ></xsystems-gallery>
    `;
  }

  private static _isRelatedVolunteer(volunteer: Volunteer) {
    return ["Redacteur foto's"].indexOf(volunteer.role) > -1;
  }

  private static _addPhotosets(
    photosetGallery: XsystemsGallerry,
    photosets: FlickrPhotosets
  ) {
    photosetGallery.addItems(
      photosets.photoset.map(photoset => ({
        id: photoset.id,
        title: photoset.title._content,
        description: photoset.description._content,
        thumbnail: `https://farm${photoset.farm}.staticflickr.com/${photoset.server}/${photoset.primary}_${photoset.secret}_n.jpg`,
      }))
    );
  }

  private static _addPhotoset(
    photoGallery: XsystemsGallerry,
    photoset: FlickrPhotoset
  ) {
    photoGallery.addItems(
      photoset.photo.map(photo => ({
        id: photo.id,
        title: photo.title,
        description: photo.description._content,
        thumbnail: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_n.jpg`,
      }))
    );
  }

  private static _photoToUrl(photo?: FlickrPhoto, size?: string) {
    if (!photo || !size) {
      return undefined;
    }

    const secret = size === 'o' ? photo.originalsecret : photo.secret;
    const format = size === 'o' ? photo.originalformat : 'png';

    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${secret}_${size}.${format}`;
  }
}
