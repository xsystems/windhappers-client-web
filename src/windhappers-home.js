import { LitElement, html, css } from 'lit-element';
import { md } from './directives/md.js';
import { windhappersStyles } from './windhappers-styles.js';

import './windhappers-articles.js';
import './windhappers-notification.js';
import './components/xsystems-google-calendar.js';

export class WindhappersHome extends LitElement {
  static get styles() {
    return [
      windhappersStyles,
      css`
        :host {
          flex: 1;
          grid-gap: 1vh;
          grid-template-rows: auto 1fr;
          padding: 1vh;
        }

        :host([narrow]) {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-areas:
            'notifications'
            'articles';
        }

        :host(:not([narrow])) {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-areas:
            'notifications notifications'
            'articles      calendar';
        }

        #notifications {
          grid-area: notifications;
        }

        #notifications > *:not(:last-child) {
          margin-bottom: 1vh;
        }

        windhappers-articles {
          grid-area: articles;
          max-width: 1024px;
          justify-self: center;
        }

        xsystems-google-calendar {
          grid-area: calendar;
          box-shadow: var(--shadow-elevation-4dp);
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
      _calendars: {
        type: Array,
      },
      _notifications: {
        type: Array,
      },
      cmsUrl: {
        type: String,
        attribute: 'cms-url',
      },
    };
  }

  constructor() {
    super();
    this._calendars = [
      'windhappers.nl_djorriihnjatt2p3it67t8v2bo@group.calendar.google.com',
      'nl.dutch#holiday@group.v.calendar.google.com',
    ];
    this._notifications = [];
  }

  updated(changedProperties) {
    if (changedProperties.has('cmsUrl')) {
      this._fetchNotifications(this.cmsUrl);
    }
  }

  render() {
    return html`
      <div id="notifications">
        ${this._notifications.map(
          notification => html`
            <windhappers-notification
              type="${notification.type}"
              ?removable="${notification.removable}"
            >
              ${md(notification.content)}
            </windhappers-notification>
          `
        )}
      </div>

      <windhappers-articles
        ?narrow=${this.narrow}
        route-prefix="/articles"
        cms-url="${this.cmsUrl}"
        pinned
      >
      </windhappers-articles>

      <xsystems-google-calendar
        narrow
        ?hidden=${this.narrow}
        .calendars=${this._calendars}
        time-zone="Europe/Amsterdam"
        language="nl"
      >
      </xsystems-google-calendar>
    `;
  }

  async _fetchNotifications(cmsUrl) {
    fetch(`${cmsUrl}/notifications?hidden=false`).then(async response => {
      const notifications = await response.json();
      if (response.ok) {
        this._notifications = notifications;
        this.dispatchEvent(new CustomEvent('loaded'));
      } else {
        this.dispatchEvent(new CustomEvent('error'));
      }
    });
  }
}

customElements.define('windhappers-home', WindhappersHome);
