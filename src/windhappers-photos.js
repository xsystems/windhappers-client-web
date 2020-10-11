import { LitElement, html, css } from 'lit-element';
import { cache } from 'lit-html/directives/cache';
import { windhappersStyles } from './windhappers-styles.js';

import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './components/xsystems-flickr-photo.js';
import './components/xsystems-flickr-photoset.js';
import './components/xsystems-flickr-photosets.js';
import './components/xsystems-gallery.js';
import './components/xsystems-google-sheets.js';
import './windhappers-volunteer.js';

export class WindhappersPhotos extends LitElement {
  static get styles() {
    return [
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
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true,
      },
      routePrefix: {
        type: String,
        attribute: 'route-prefix',
      },
      volunteers: {
        type: Array,
      },
      _route: {
        type: Object,
      },
      _routeTail: {
        type: Object,
      },
      _responsePhotosets: {
        type: Object,
      },
      _responsePhotoset: {
        type: Object,
      },
      _responsePhoto: {
        type: Object,
      },
      _photosetId: {
        type: String,
      },
      _photosetIdPrevious: {
        type: String,
      },
      _photoId: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.volunteers = [];
  }

  updated(changedProperties) {
    const photosetGallery = this.shadowRoot.querySelector('#photosetGallery');
    const photoGallery = this.shadowRoot.querySelector('#photoGallery');

    if (photosetGallery && this._responsePhotosets) {
      if (
        changedProperties.has('_responsePhotosets') &&
        this._responsePhotosets !== changedProperties._responsePhotosets
      ) {
        WindhappersPhotos._addPhotosets(
          photosetGallery,
          this._responsePhotosets.photoset
        );
      }

      if (
        photosetGallery.isEmpty() &&
        !this._photosetId &&
        changedProperties.has('_photosetId') &&
        this._photosetId !== changedProperties._photosetId
      ) {
        WindhappersPhotos._addPhotosets(
          photosetGallery,
          this._responsePhotosets.photoset
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
          this._responsePhotoset !== changedProperties._responsePhotoset
        ) {
          WindhappersPhotos._addPhotos(
            photoGallery,
            this._responsePhotoset.photo
          );
        } else if (photoGallery.isEmpty()) {
          WindhappersPhotos._addPhotos(
            photoGallery,
            this._responsePhotoset.photo
          );
        }
      }
    }
  }

  render() {
    return html`
      <app-location
        @route-changed="${event => {
          this._route = event.detail.value;
        }}"
      ></app-location>
      <app-route
        .route="${this._route}"
        pattern="${this.routePrefix}/:photosetId"
        @data-changed="${event => {
          this._photosetId = event.detail.value.photosetId;
        }}"
        @active-changed="${event => {
          if (!event.detail.value) {
            this._responsePhotoset = null;
            this._photosetIdPrevious = this._photosetId;
            this._photosetId = null;
            this._photoId = null;
          }
        }}"
        @tail-changed="${event => {
          this._routeTail = event.detail.value;
        }}"
      ></app-route>
      <app-route
        .route="${this._routeTail}"
        pattern="/:photoId"
        @data-changed="${event => {
          this._photoId = event.detail.value.photoId;
        }}"
        @active-changed="${event => {
          if (!event.detail.value) {
            this._photoId = null;
          }
        }}"
      ></app-route>

      ${cache(this._pages(this.routePrefix, this._photosetId, this._photoId))}

      <xsystems-google-sheets
        hidden
        key="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
        @rows="${event => {
          this.volunteers = event.detail.rows;
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
                email-personal="${volunteer.emailpersonal}"
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
    const response = this._photosetId
      ? this._responsePhotoset
      : this._responsePhotosets;
    const page = parseInt(response.page, 10);
    const pages = parseInt(response.pages, 10);
    if (page < pages) {
      this.shadowRoot.querySelector(elementName).page = page + 1;
    }
  }

  _pages(routePrefix, photosetId, photoId) {
    if (photoId) {
      return html`
        <a href="${routePrefix}/${photosetId}" title="Back" class="navigation">
          <mwc-icon>arrow_back</mwc-icon> Terug
        </a>

        <xsystems-flickr-photo
          key="757b4474c3d5653a8958a33d9cf647a2"
          photo-id="${photoId}"
          @response="${event => {
            this._responsePhoto = event.detail;
          }}"
        ></xsystems-flickr-photo>

        <a
          id="photo"
          href="${WindhappersPhotos._photoToUrl(this._responsePhoto, 'o')}"
          download
        >
          <img
            src="${WindhappersPhotos._photoToUrl(this._responsePhoto, 'b')}"
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
          @response="${event => {
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
        @response="${event => {
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

  static _isRelatedVolunteer(volunteer) {
    return ["Redacteur foto's"].indexOf(volunteer.role) > -1;
  }

  static _addPhotosets(photosetGallery, photosets) {
    photosetGallery.addItems(
      photosets.map(photoset => ({
        id: photoset.id,
        title: photoset.title._content,
        description: photoset.description._content,
        thumbnail: `https://farm${photoset.farm}.staticflickr.com/${photoset.server}/${photoset.primary}_${photoset.secret}_n.jpg`,
      }))
    );
  }

  static _addPhotos(photoGallery, photos) {
    photoGallery.addItems(
      photos.map(photo => ({
        id: photo.id,
        title: photo.title,
        description: photo.description._content,
        thumbnail: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_n.jpg`,
      }))
    );
  }

  static _photoToUrl(photo, size) {
    if (!photo || !size) {
      return '';
    }

    const secret = size === 'o' ? photo.originalsecret : photo.secret;
    const format = size === 'o' ? photo.originalformat : 'png';

    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${secret}_${size}.${format}`;
  }
}

customElements.define('windhappers-photos', WindhappersPhotos);
