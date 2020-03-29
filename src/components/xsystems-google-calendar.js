import { LitElement, html, css } from 'lit-element';

import '@material/mwc-icon'; 
import '@material/mwc-icon-button'; 

export class XsystemsGoogleCalendar extends LitElement {
  static get styles() {
    return css`
      :host(:not([hidden])) {
        display: flex;
        flex-direction: column;
      }

      #calendar {
        width: 100%;
        height: 100%;
        border: none;
      }
    `;
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      },
      calendars: {
        type: Array
      },
      timeZone: {
        type: String
      },
      language: {
        type: String
      },
      backgroundColor: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.calendars = [];
  }

  render() {
    return html`
      <iframe id="calendar" 
              xmlns="https://www.w3.org/1999/xhtml" 
              src="${this._computeUrl(this.calendars, this.narrow, this.timeZone, this.language, this.backgroundColor)}">
      </iframe>
    `;
  }

  _computeUrl(calendars, narrow, timeZone, language, backgroundColor) {
    if (calendars.length <= 0) {
      return;
    }

    let calendarUrl = 'https://calendar.google.com/calendar/embed?showTitle=0&wkst=2';

    if (narrow) {
      calendarUrl += '&mode=AGENDA&showNav=0&showPrint=0';
    }

    if (timeZone) {
      calendarUrl += '&ctz=' + encodeURIComponent(timeZone);
    }

    if (language) {
      calendarUrl += '&hl=' + language;
    }

    if (backgroundColor) {
      calendarUrl += '&bgcolor=%23' + backgroundColor;
    }

    for (let i = 0; i < calendars.length; i++) {
      calendarUrl += '&src=' + encodeURIComponent(calendars[i]);
    }

    return calendarUrl;
  }
}

customElements.define('xsystems-google-calendar', XsystemsGoogleCalendar);