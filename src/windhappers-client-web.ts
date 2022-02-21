import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@material/mwc-icon-button';
import '@material/mwc-icon';

import { AppHeaderElement } from '@polymer/app-layout/app-header/app-header';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { WindhappersConfiguration } from './entities/WindhappersConfiguration.js';
import { WindhappersPhotos } from './windhappers-photos.js';
import { windhappersStyles } from './windhappers-styles.js';
import { WindhappersVideos } from './windhappers-videos.js';

@customElement('windhappers-client-web')
export class WindhappersClientWeb extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        --app-drawer-width: 140px;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

      app-header {
        background-color: var(--primary-color, black);
      }

      app-header:not([threshold-triggered]) {
        background-image: url('../images/header_default.jpg');
        background-position: center bottom;
        background-size: cover;
      }

      app-toolbar {
        height: 50px;
      }

      [main-title],
      [condensed-title],
      [drawer-toggle] {
        color: white;
      }

      .social-link {
        padding: 0.5vh;
        text-decoration: none;
        color: white;
        --mdc-icon-font: 'Font Awesome 5 Brands';
      }

      #windhappers-icon-link {
        text-decoration: none;
        color: inherit;
      }

      #windhappers-icon-link > img {
        width: 100%;
      }

      #drawerContent {
        height: 100%;
        overflow: auto;
      }

      nav > a {
        display: block;
        text-decoration: none;
        color: inherit;
        padding: 1vh 2vh 1vh 2vh;
        font-weight: bold;
      }

      nav > a:hover {
        background-color: var(--primary-color, black);
        color: white;
      }

      [hidden] {
        display: none;
      }

      windhappers-articles:not([narrow]) {
        margin: 1vh;
        max-width: 1024px;
        align-self: center;
      }
    `,
  ];

  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: Object,
  })
  _route?: object;

  @property({
    type: String,
  })
  page = 'home';

  @property({
    type: Number,
  })
  scrollThreshold = 200;

  @property({
    type: Boolean,
  })
  _scrollThresholdTriggered = false;

  @property({
    type: String,
  })
  _environment?: string;

  @property({
    type: Object,
  })
  _configuration?: WindhappersConfiguration;

  @property({
    type: String,
  })
  _cmsUrl?: string;

  firstUpdated() {
    const header = this.shadowRoot!.querySelector<AppHeaderElement>('#header')!;
    header._scrollHandler = () => {
      if (header.scrollTarget) {
        this._handleScroll(
          header.scrollTarget.scrollHeight -
            header._scrollTargetHeight -
            header._scrollTop
        );
        header._scrollStateChanged();
      }
    };

    fetch('environment', {
      headers: {
        Accept: 'text/plain',
      },
    })
      .then(response => response.text())
      .then(environment => {
        this._environment = environment;
      })
      .catch(() => {
        throw new Error('Failed to fetch environment');
      });
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('_environment') && this._environment) {
      this._loadConfiguration(this._environment);
    }
    if (changedProperties.has('_configuration') && this._configuration) {
      this._cmsUrl = this._configuration.cms.url;
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
        pattern="/:page"
        @data-changed="${(event: CustomEvent<{ value: { page: string } }>) => {
          this.page = event.detail.value.page;
        }}"
      >
      </app-route>

      <main>
        <app-drawer-layout
          fullbleed
          @narrow-changed=${(event: CustomEvent<{ value: boolean }>) => {
            this._handleNarrow(event);
          }}
          responsive-width="1024px"
        >
          <app-drawer id="drawer" slot="drawer" swipe-open>
            <div id="drawerContent">
              <a id="windhappers-icon-link" href="home">
                <img
                  src="../images/windhappers-icon_512x512.png"
                  alt="De Windhappers"
                />
              </a>
              <nav>
                <a href="home">Home</a>
                <a href="disciplines">Disciplines</a>
                <a href="articles">Archief</a>
                <a href="photos">Foto's</a>
                <a href="videos">Video's</a>
                <a href="membership">Lidmaatschap</a>
                <a href="calendar">Kalender</a>
                <a href="documents">Documenten</a>
                <a href="contact">Contact</a>
                <a href="location">Locatie</a>
              </nav>
            </div>
          </app-drawer>
          <app-header-layout fullbleed has-scrolling-region>
            <app-header
              id="header"
              slot="header"
              fixed
              condenses
              effects="material"
              threshold="50"
            >
              <app-toolbar sticky>
                <mwc-icon-button icon="menu" drawer-toggle></mwc-icon-button>
                <h4 condensed-title>De Windhappers</h4>
                <a
                  class="social-link"
                  href="https://twitter.com/DeWindhappers"
                  target="_blank"
                  rel="noopener"
                >
                  <mwc-icon>&#xf081;</mwc-icon>
                </a>
                <a
                  class="social-link"
                  href="https://www.facebook.com/Windhappers-227735227966870"
                  target="_blank"
                  rel="noopener"
                >
                  <mwc-icon>&#xf082;</mwc-icon>
                </a>
              </app-toolbar>
              <app-toolbar class="secondary">
                <h1 main-title>De Windhappers</h1>
              </app-toolbar>
            </app-header>

            ${cache(this._pages(this.page))}
          </app-header-layout>
        </app-drawer-layout>
      </main>
    `;
  }

  private _pages(page: string) {
    switch (page) {
      case 'contact':
        import('./windhappers-contact.js');
        return html`<windhappers-contact
          ?narrow=${this.narrow}
        ></windhappers-contact>`;
      case 'disciplines':
        import('./windhappers-disciplines.js');
        return html`<windhappers-disciplines
          ?narrow=${this.narrow}
          route-prefix="/disciplines"
        ></windhappers-disciplines>`;
      case 'photos':
        import('./windhappers-photos.js');
        return html`<windhappers-photos
          ?narrow=${this.narrow}
          route-prefix="/photos"
        ></windhappers-photos>`;
      case 'videos':
        import('./windhappers-videos.js');
        return html`<windhappers-videos
          ?narrow=${this.narrow}
          route-prefix="/videos"
        ></windhappers-videos>`;
      case 'membership':
        import('./windhappers-membership.js');
        return html`<windhappers-membership
          ?narrow=${this.narrow}
          route-prefix="/membership"
        ></windhappers-membership>`;
      case 'calendar':
        import('./windhappers-calendar.js');
        return html`<windhappers-calendar
          ?narrow=${this.narrow}
          route-prefix="/calendar"
        ></windhappers-calendar>`;
      case 'documents':
        import('./windhappers-documents.js');
        return html`<windhappers-documents
          ?narrow=${this.narrow}
          route-prefix="/documents"
        ></windhappers-documents>`;
      case 'location':
        import('./windhappers-location.js');
        return html`<windhappers-location
          ?narrow=${this.narrow}
          route-prefix="/location"
        ></windhappers-location>`;
      case 'articles':
        import('./windhappers-articles.js');
        return html`
          <windhappers-articles
            ?narrow=${this.narrow}
            route-prefix="/articles"
            cms-url="${ifDefined(this._cmsUrl)}"
          >
          </windhappers-articles>
        `;
      case 'home':
      default:
        import('./windhappers-home.js');
        return html`
          <windhappers-home
            ?narrow=${this.narrow}
            route-prefix="/home"
            cms-url="${ifDefined(this._cmsUrl)}"
          >
          </windhappers-home>
        `;
    }
  }

  private _loadConfiguration(environment: string) {
    fetch(`configuration/configuration.${environment}.json`)
      .then(response => response.json())
      .then((configuration: WindhappersConfiguration) => {
        this._configuration = configuration;
      })
      .catch(() => {
        throw new Error('Failed to fetch configuration');
      });
  }

  private _handleNarrow(event: CustomEvent<{ value: boolean }>) {
    this.narrow = event.detail.value;
  }

  private _handleScroll(distanceFromBottom: number) {
    if (
      distanceFromBottom < this.scrollThreshold &&
      !this._scrollThresholdTriggered
    ) {
      this._scrollThresholdTriggered = true;
      this._loadMore();
    } else if (
      distanceFromBottom >= this.scrollThreshold &&
      this._scrollThresholdTriggered
    ) {
      this._scrollThresholdTriggered = false;
    }
  }

  private _loadMore() {
    const mediaPage = this.shadowRoot!.querySelector<
      WindhappersPhotos | WindhappersVideos
    >('windhappers-photos,windhappers-videos');

    if (mediaPage) {
      mediaPage.loadMore();
    }
  }
}
