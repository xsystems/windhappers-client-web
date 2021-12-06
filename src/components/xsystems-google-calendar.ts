import '@material/mwc-icon';
import '@material/mwc-icon-button';

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('xsystems-google-calendar')
export class XsystemsGoogleCalendar extends LitElement {
  static styles = css`
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

  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: Array,
  })
  calendars: string[] = [];

  @property({
    type: String,
  })
  timeZone?: string;

  @property({
    type: String,
  })
  language?: string;

  @property({
    type: String,
  })
  backgroundColor?: string;

  render() {
    return html`
      <iframe
        id="calendar"
        xmlns="https://www.w3.org/1999/xhtml"
        src="${XsystemsGoogleCalendar._computeUrl(
          this.calendars,
          this.narrow,
          this.timeZone,
          this.language,
          this.backgroundColor
        )}"
      >
      </iframe>
    `;
  }

  private static _computeUrl(
    calendars: string[],
    narrow: boolean,
    timeZone?: string,
    language?: string,
    backgroundColor?: string
  ) {
    if (calendars.length <= 0) {
      return '';
    }

    let calendarUrl =
      'https://calendar.google.com/calendar/embed?showTitle=0&wkst=2';

    if (narrow) {
      calendarUrl += '&mode=AGENDA&showNav=0&showPrint=0';
    }

    if (timeZone) {
      calendarUrl += `&ctz=${encodeURIComponent(timeZone)}`;
    }

    if (language) {
      calendarUrl += `&hl=${language}`;
    }

    if (backgroundColor) {
      calendarUrl += `&bgcolor=%23${backgroundColor}`;
    }

    for (let i = 0; i < calendars.length; i += 1) {
      calendarUrl += `&src=${encodeURIComponent(calendars[i])}`;
    }

    return calendarUrl;
  }
}
