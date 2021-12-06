import './components/xsystems-google-sheets.js';
import './windhappers-volunteer.js';

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { Volunteer } from './entities/Volunteer.js';
import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-contact')
export class WindhappersContact extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        display: grid;
        grid-gap: 1vh;
        padding: 1vh;
      }

      :host(:not([narrow])) {
        grid-template-columns: auto auto;
      }

      :host([narrow]) {
        grid-template-columns: auto;
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
  contacts: Volunteer[] = [];

  render() {
    return html`
      <xsystems-google-sheets
        hidden
        key="AIzaSyDTj9__sWn_MKroJ6vlad1pCCidRBi6a5g"
        spreadsheetId="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
        range="Vrijwilligers"
        @rows="${(event: CustomEvent<Volunteer[]>) => {
          this.contacts = event.detail;
        }}"
      >
      </xsystems-google-sheets>

      ${this.contacts.map(
        contact => html`
          <windhappers-volunteer
            ?narrow="${this.narrow}"
            name="${ifDefined(contact.name)}"
            role="${ifDefined(contact.role)}"
            email="${ifDefined(contact.email)}"
            email-personal="${ifDefined(contact.emailPersonal)}"
            phone="${ifDefined(contact.phone)}"
          ></windhappers-volunteer>
        `
      )}
    `;
  }
}
