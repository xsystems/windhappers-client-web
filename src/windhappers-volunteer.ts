import '@material/mwc-icon';

import CryptoES from 'crypto-es';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-volunteer')
export default class WindhappersVolunteer extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        display: grid;
        grid-template-columns: 100px auto;
        grid-column-gap: 1vh;
        padding: 1vh;
        background-color: white;
        box-shadow: var(--shadow-elevation-4dp);
      }

      #avatar {
        grid-row: 1 / span 5;
        height: 100px;
        width: 100px;
        border-radius: 1vh;
        align-self: center;
      }

      #name {
        font-weight: bold;
      }

      #role {
        color: var(--secondary-text-color);
      }

      hr {
        height: 1px;
        border: 0;
        border-top: 1px solid var(--secondary-text-color);
        margin: 1vh 0;
        padding: 0;
        opacity: 0.3;
      }

      hr [hidden] {
        display: none;
      }

      hr:not([hidden]) {
        display: block;
      }

      a {
        text-decoration: none;
        color: inherit;
        word-break: break-all;
      }

      a [hidden] {
        display: none;
      }

      a:not([hidden]) {
        display: block;
      }

      a > * {
        vertical-align: middle;
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
  })
  name?: string;

  @property({
    type: String,
  })
  role?: string;

  @property({
    type: String,
  })
  email?: string;

  @property({
    type: String,
    attribute: 'email-personal',
  })
  emailPersonal?: string;

  @property({
    type: String,
  })
  phone?: string;

  render() {
    return html`
      <img
        id="avatar"
        sizing="cover"
        src="${WindhappersVolunteer._computeGravatarUrl(
          this.emailPersonal,
          this.email
        )}"
        alt="Avatar"
      />
      <div id="name">${this.name}</div>
      <div id="role">${this.role}</div>
      <hr
        ?hidden="${WindhappersVolunteer._computeHiddenActions(
          this.email,
          this.phone
        )}"
      />
      <a ?hidden="${!this.email}" href="mailto:${this.email}">
        <mwc-icon>email</mwc-icon>
        <span>${this.email}</span>
      </a>
      <a ?hidden="${!this.phone}" href="tel:${this.phone}">
        <mwc-icon>phone</mwc-icon>
        <span>${this.phone}</span>
      </a>
    `;
  }

  private static _computeHiddenActions(email?: string, phone?: string) {
    return !(email || phone);
  }

  private static _computeGravatarUrl(
    emailPrimary?: string,
    emailSecondary?: string
  ) {
    const email = emailPrimary ?? emailSecondary;
    const emailHash = email
      ? CryptoES.MD5(email.toLocaleLowerCase()).toString()
      : '';
    return `https://secure.gravatar.com/avatar/${emailHash}?size=100&default=mm`;
  }
}
