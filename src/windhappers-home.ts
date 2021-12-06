import './windhappers-articles.js';
import './windhappers-notification.js';
import './components/xsystems-google-calendar.js';

import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { md } from './directives/md.js';
import { WindhappersNotification } from './entities/WindhappersNotification.js';
import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-home')
export class WindhappersHome extends LitElement {
  static styles = [
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
    attribute: 'cms-url',
  })
  cmsUrl?: string;

  @property({
    type: Array,
  })
  private _calendars = [
    'windhappers.nl_djorriihnjatt2p3it67t8v2bo@group.calendar.google.com',
    'nl.dutch#holiday@group.v.calendar.google.com',
  ];

  @property({
    type: Array,
  })
  private _notifications: WindhappersNotification[] = [];

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('cmsUrl') && this.cmsUrl) {
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
        cms-url="${ifDefined(this.cmsUrl)}"
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

  private async _fetchNotifications(cmsUrl: string) {
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
