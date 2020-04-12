import { LitElement, html, css } from 'lit-element';
import { cache } from 'lit-html/directives/cache';
import { windhappersStyles } from './windhappers-styles';
import { debounce } from 'throttle-debounce';

import '@material/mwc-textfield'
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './components/xsystems-gallery'
import './components/xsystems-google-sheets'
import './components/xsystems-youtube-search'
import './components/xsystems-youtube-video'
import './windhappers-volunteer'

export class WindhappersVideos extends LitElement {
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
        }

        :host([narrow]) #volunteerContainer {
          grid-template-columns: 1fr;
        }

        :host(:not([narrow])) #volunteerContainer {
          grid-template-columns: 1fr 1fr;
        }

        #queryInput,
        xsystems-gallery,
        xsystems-youtube-video {
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
      `
    ]
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      },
      routePrefix: {
        type: String,
        attribute: 'route-prefix'
      },
      query: {
        type: String
      },
      volunteers: {
        type: Array
      },
      _route: {
        type: Object
      },
      _response: {
        type: Object
      },
      _videoId: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.query = '';
    this.volunteers = [];
    this._setQuery = debounce(300, (query) => this.query = query);
  }

  updated(changedProperties) {
    let videoGallery = this.shadowRoot.querySelector('#videoGallery');

    if (!videoGallery) {
      return;
    }

    if (changedProperties.has('query') 
        && this.query !== changedProperties.query) {  
      videoGallery.reset();
    }

    if (this._response 
        && changedProperties.has('_response') 
        && this._response !== changedProperties._response) {      
      this._addItems(videoGallery, this._response.items);
    }

    if (videoGallery.isEmpty()
        && !this._videoId 
        && changedProperties.has('_videoId') 
        && this._videoId !== changedProperties._videoId) { 
      this._addItems(videoGallery, this._response.items);
    }
  }

  render() {
    return html`
      <app-location @route-changed="${event => this._route = event.detail.value}"></app-location>
      <app-route  .route="${this._route}"
                  pattern="${this.routePrefix}/:videoId"
                  @data-changed="${event => this._videoId = event.detail.value.videoId}"
                  @active-changed="${event => { if (!event.detail.value) { this._videoId = null; } }}">
      </app-route>

      ${cache(this._pages(this.routePrefix, this._videoId))}

      <xsystems-google-sheets hidden
                              key="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
                              @rows="${event => this.volunteers = event.detail.rows}"></xsystems-google-sheets>

      <div id="volunteerContainer">
        ${this.volunteers.filter(volunteer => this._isRelatedVolunteer(volunteer)).map(volunteer => html`
          <windhappers-volunteer  ?narrow="${this.narrow}"
                                  name="${volunteer.name}"
                                  role="${volunteer.role}"
                                  email="${volunteer.email}"
                                  email-personal="${volunteer.emailpersonal}"
                                  phone="${volunteer.phone}"></windhappers-volunteer>
        `)}
      </div>
    `;
  }

  loadMore() {
    this.shadowRoot.querySelector('#youtubeSearch').pageToken = this._response.nextPageToken;
  }

  _pages(routePrefix, videoId) {
    if (videoId) {
      return html`
        <a href="${routePrefix}" title="Back">
          <mwc-icon>arrow_back</mwc-icon> Terug
        </a>

        <xsystems-youtube-video id="videoPlayer" video-id="${videoId}"></xsystems-youtube-video>
      `;
    } else {
      return html`
        <mwc-textfield  id="queryInput"
                        icontrailing="search"
                        fullwidth
                        placeholder="Welke video zoek je?"
                        @input="${event => this._setQuery(event.target.value)}"></mwc-textfield>

        <xsystems-youtube-search  id="youtubeSearch"
                                  key="AIzaSyDTj9__sWn_MKroJ6vlad1pCCidRBi6a5g"
                                  query=${this.query}
                                  channel="UC_x5XG1OV2P6uZZ5FSM9Ttw"
                                  type="video"
                                  @response="${event => this._response = event.detail}"></xsystems-youtube-search>

        <xsystems-gallery id="videoGallery"
                          ?narrow="${this.narrow}"
                          route-prefix="${routePrefix}"></xsystems-gallery>
      `;
    }
  }

  _isRelatedVolunteer(volunteer) {
    return ['Redacteur video\'s'].indexOf(volunteer.role) > -1;
  }

  _addItems(videoGallery, items) {
    videoGallery.addItems(items.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url
    })));
  }
}

customElements.define('windhappers-videos', WindhappersVideos);