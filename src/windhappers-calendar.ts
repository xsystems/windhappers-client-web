import './windhappers-notification.js';
import './components/xsystems-google-calendar.js';

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-calendar')
export class WindhappersCalendar extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        padding: 1vh;
        height: 100%;
      }

      windhappers-notification,
      xsystems-google-calendar {
        box-shadow: var(--shadow-elevation-4dp);
      }

      windhappers-notification {
        margin-bottom: 1vh;
      }

      xsystems-google-calendar {
        flex: 1;
      }
    `,
  ];

  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: Array,
  })
  _calendars = [
    'windhappers.nl_djorriihnjatt2p3it67t8v2bo@group.calendar.google.com',
    'nl.dutch#holiday@group.v.calendar.google.com',
  ];

  render() {
    return html`
      <windhappers-notification type="info" removable>
        Om evenementen aan uw eigen Google Agenda toe te voegen, klik op een
        evenement en vervolgens op "kopieren naar mijn agenda". Om alle
        evenementen naar uw eigen Google Agenda te kopieren, klik op de "+
        Google Agenda" knop, rechts onderaan de kalender, en volg de stappen op
        uw scherm.
      </windhappers-notification>
      <xsystems-google-calendar
        ?narrow=${this.narrow}
        .calendars=${this._calendars}
        time-zone="Europe/Amsterdam"
        language="nl"
      >
      </xsystems-google-calendar>
    `;
  }
}
