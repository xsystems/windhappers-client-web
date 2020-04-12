import { LitElement, html, css } from 'lit-element';
import { windhappersStyles } from './windhappers-styles';

import './components/xsystems-google-sheets'
import './windhappers-volunteer'

export class WindhappersContact extends LitElement {
  static get styles() {
    return [
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
      `
    ]
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      },
      contacts: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this.contacts = [];
  }

  render() {
    return html`
      <xsystems-google-sheets hidden
                              key="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
                              @rows="${event => this.contacts = event.detail.rows}">
      </xsystems-google-sheets>

      ${this.contacts.map(contact => html`
        <windhappers-volunteer  ?narrow="${this.narrow}"
                                name="${contact.name}"
                                role="${contact.role}"
                                email="${contact.email}"
                                email-personal="${contact.emailpersonal}"
                                phone="${contact.phone}"></windhappers-volunteer>
      `)}
    `;
  }
}

customElements.define('windhappers-contact', WindhappersContact);