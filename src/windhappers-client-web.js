import { LitElement, html, css } from 'lit-element';
import { windhappersStyles } from './windhappers-styles';

import '@polymer/app-layout/app-drawer-layout/app-drawer-layout'
import '@polymer/app-layout/app-drawer/app-drawer'
import '@polymer/app-layout/app-header-layout/app-header-layout'
import '@polymer/app-layout/app-header/app-header'
import '@polymer/app-layout/app-toolbar/app-toolbar'
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@material/mwc-icon-button'
import '@material/mwc-icon'

import './windhappers-home'
import './windhappers-contact'

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
      `
    ];
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      }
    };
  }

  render() {
    return html`
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

            <!-- <windhappers-home ?narrow=${this.narrow}></windhappers-home> -->
            <windhappers-contact ?narrow=${this.narrow}></windhappers-contact>
          </app-header-layout>
        </app-drawer-layout>
      </main>
    `;
  }

  _handleNarrow(event) {
    this.narrow = event.detail.value;
  }
}

customElements.define('windhappers-client-web', WindhappersClientWeb);