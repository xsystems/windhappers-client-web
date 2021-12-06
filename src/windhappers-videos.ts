import '@material/mwc-textfield';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './components/xsystems-gallery.js';
import './components/xsystems-google-sheets.js';
import './components/xsystems-youtube-search.js';
import './components/xsystems-youtube-video.js';
import './windhappers-volunteer.js';

import { TextField } from '@material/mwc-textfield';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { debounce } from 'throttle-debounce';

import { XsystemsGallerry } from './components/xsystems-gallery.js';
import { Volunteer } from './entities/Volunteer.js';
import { YoutubeSearchListResponse } from './entities/YoutubeSearchListResponse.js';
import { YoutubeSearchResult } from './entities/YoutubeSearchResult.js';
import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-videos')
export class WindhappersVideos extends LitElement {
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
      }

      :host([narrow]) #volunteerContainer {
        grid-template-columns: 1fr;
      }

      :host(:not([narrow])) #volunteerContainer {
        grid-template-columns: 1fr 1fr;
      }

      #queryInput,
      #videoPlayer,
      #videoGallery {
        margin-bottom: 1vh;
      }

      #videoPlayer {
        box-shadow: var(--shadow-elevation-4dp);
      }

      :host([narrow]) #videoPlayer {
        width: 100%;
      }

      :host(:not([narrow])) #videoPlayer {
        width: 60vw;
        justify-self: center;
      }

      a {
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
    type: String,
  })
  query = '';

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
  private _response?: YoutubeSearchListResponse;

  @property({
    type: String,
  })
  private _videoId?: string;

  @property({
    type: Object,
  })
  private _params = {
    order: 'date',
  };

  @property({
    type: String,
  })
  private _pageToken?: string;

  private _setQuery = debounce(300, query => {
    this.query = query;
  });

  updated(changedProperties: PropertyValues) {
    const videoGallery =
      this.shadowRoot?.querySelector<XsystemsGallerry>('#videoGallery');

    if (!videoGallery) {
      return;
    }

    if (
      changedProperties.has('query') &&
      this.query !== changedProperties.get('query')
    ) {
      videoGallery.reset();
      this._pageToken = undefined;
    }

    if (this._response) {
      if (
        changedProperties.has('_response') &&
        this._response !== changedProperties.get('_response')
      ) {
        WindhappersVideos._addItems(videoGallery, this._response.items);
      }

      if (
        videoGallery.isEmpty() &&
        !this._videoId &&
        changedProperties.has('_videoId') &&
        this._videoId !== changedProperties.get('_videoId')
      ) {
        WindhappersVideos._addItems(videoGallery, this._response.items);
      }
    }
  }

  render() {
    return html`
      <app-location
        @route-changed="${(event: CustomEvent) => {
          this._route = event.detail.value;
        }}"
      ></app-location>
      <app-route
        .route="${this._route}"
        pattern="${this.routePrefix}/:videoId"
        @data-changed="${(event: CustomEvent) => {
          this._videoId = event.detail.value.videoId;
        }}"
        @active-changed="${(event: CustomEvent) => {
          if (!event.detail.value) {
            this._videoId = undefined;
          }
        }}"
      ></app-route>

      ${cache(this._pages(this.routePrefix, this._videoId))}

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
          .filter(volunteer => WindhappersVideos._isRelatedVolunteer(volunteer))
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
    if (this._response?.nextPageToken) {
      this._pageToken = this._response.nextPageToken;
    }
  }

  private _pages(routePrefix: string, videoId?: string) {
    if (videoId) {
      return html`
        <a href="${routePrefix}" title="Back">
          <mwc-icon>arrow_back</mwc-icon> Terug
        </a>

        <xsystems-youtube-video
          id="videoPlayer"
          video-id="${videoId}"
        ></xsystems-youtube-video>
      `;
    }

    return html`
      <mwc-textfield
        id="queryInput"
        icontrailing="search"
        fullwidth
        placeholder="Welke video zoek je?"
        @input="${(event: Event) => {
          this._setQuery((event.target as TextField).value);
        }}"
      ></mwc-textfield>

      <xsystems-youtube-search
        id="youtubeSearch"
        key="AIzaSyDTj9__sWn_MKroJ6vlad1pCCidRBi6a5g"
        query=${this.query}
        channel="UCWBof-CO7GALxQfbO6z9c8A"
        type="video"
        .pageToken=${this._pageToken}
        .params=${this._params}
        @response="${(event: CustomEvent) => {
          this._response = event.detail;
        }}"
      ></xsystems-youtube-search>

      <xsystems-gallery
        id="videoGallery"
        ?narrow="${this.narrow}"
        route-prefix="${routePrefix}"
      ></xsystems-gallery>
    `;
  }

  private static _isRelatedVolunteer(volunteer: Volunteer) {
    return ["Redacteur video's"].indexOf(volunteer.role) > -1;
  }

  private static _addItems(
    videoGallery: XsystemsGallerry,
    results: YoutubeSearchResult[]
  ) {
    videoGallery.addItems(
      results.map(result => ({
        id: result.id.videoId,
        title: result.snippet.title,
        description: result.snippet.description,
        thumbnail: result.snippet.thumbnails.high.url,
      }))
    );
  }
}
