import { LitElement, html, css } from 'lit-element';
import { cache } from 'lit-html/directives/cache';
import { windhappersStyles } from './windhappers-styles';

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

export class WindhappersClientWeb extends LitElement {
  static get styles() {
    return [
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

        #windhappers-icon {
          width: 100%;
          cursor: pointer;
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
          background-color: var(--primary-color, red);
          color: white;
        }

        [hidden] {
          display: none;
        }
      `
    ];
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      },
      _route: {
        type: Object
      },
      page: {
        type: String
      },
      scrollThreshold: {
        type: Number
      },
      _scrollThresholdTriggered: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.page = 'home';
    this.scrollThreshold = 200;
  }

  firstUpdated() {
    let header = this.shadowRoot.querySelector('#header');
    header._scrollHandler = () => {
      this._handleScroll(header.scrollTarget.scrollHeight - header._scrollTargetHeight - header._scrollTop);
      header._scrollStateChanged();
    };
  }

  render() {
    return html`
      <app-location @route-changed="${event => this._route = event.detail.value}"></app-location>
      <app-route  .route="${this._route}"
                  pattern="/:page"
                  @data-changed="${event => this.page = event.detail.value.page}">
      </app-route>

      <main>
        <app-drawer-layout  fullbleed
                            @narrow-changed=${this._handleNarrow}
                            responsive-width="768px">
          <app-drawer id="drawer" slot="drawer" swipe-open>
            <div id="drawerContent">
              <img  id="windhappers-icon"
                    on-tap="_showPageHome"
                    src="../images/windhappers-icon_1024x1024.png"
                    alt="De Windhappers">
              <nav>
                <a href="home">Home</a>
                <a href="videos">Videos</a>
                <a href="contact">Contact</a>
              </nav>
            </div>
          </app-drawer>
          <app-header-layout fullbleed has-scrolling-region>
            <app-header id="header" 
                        slot="header"
                        fixed
                        condenses
                        effects="material"
                        threshold="50">
              <app-toolbar sticky>
                <mwc-icon-button icon="menu" drawer-toggle></mwc-icon-button>
                <h4 condensed-title>De Windhappers</h4>
                <a class="social-link" href="https://twitter.com/DeWindhappers" target="_blank" rel="noopener">
                  <mwc-icon>&#xf081;</mwc-icon>
                </a>
                <a class="social-link" href="https://www.facebook.com/Windhappers-227735227966870" target="_blank" rel="noopener">
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

  _pages(page) {
    switch (page) {
      case 'contact':
        import('./windhappers-contact');
        return html`<windhappers-contact ?narrow=${this.narrow}></windhappers-contact>`;
      case 'videos':
        import('./windhappers-videos');
        return html`<windhappers-videos ?narrow=${this.narrow} route-prefix="/videos"></windhappers-videos>`;
      case 'home':
      default:
        import('./windhappers-home');
        return html`<windhappers-home ?narrow=${this.narrow}></windhappers-home>`;
    }
  }

  _handleNarrow(event) {
    this.narrow = event.detail.value;
  }

  _handleScroll(distanceFromBottom) {
    if (distanceFromBottom < this.scrollThreshold && !this._scrollThresholdTriggered) {
      this._scrollThresholdTriggered = true;
      this._loadMore();
    } else if (distanceFromBottom >= this.scrollThreshold && this._scrollThresholdTriggered) {
      this._scrollThresholdTriggered = false;
    }
  }

  _loadMore() {
    let videoPage = this.shadowRoot.querySelector('windhappers-videos');
    if (videoPage) {
      videoPage.loadMore();
    }
  }
}

customElements.define('windhappers-client-web', WindhappersClientWeb);
