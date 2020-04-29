import { LitElement, html, css } from 'lit-element';
import { windhappersStyles } from './windhappers-styles';

import './windhappers-notification'
import './components/xsystems-google-calendar'

export class WindhappersCalendar extends LitElement {
  static get styles() {
    return [
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
      `
    ]
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      },
      _calendars: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this._calendars = ['windhappers.nl_djorriihnjatt2p3it67t8v2bo@group.calendar.google.com', 'nl.dutch#holiday@group.v.calendar.google.com'];
  }

  render() {
    return html`
      <windhappers-notification type="info" removable>
        Om evenementen aan uw eigen Google Agenda toe te voegen, klik op een evenement en vervolgens op "kopieren naar mijn agenda". Om alle evenementen naar uw eigen Google Agenda te kopieren, klik op de "+ Google Agenda" knop, rechts onderaan de kalender, en volg de stappen op uw scherm.
      </windhappers-notification>
      <xsystems-google-calendar ?narrow=${this.narrow}
                                .calendars=${this._calendars}
                                time-zone="Europe/Amsterdam"
                                language="nl">
      </xsystems-google-calendar>
    `;
  }
}

customElements.define('windhappers-calendar', WindhappersCalendar);