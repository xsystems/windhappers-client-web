import { LitElement, html, css } from 'lit-element';
import { MD5 } from 'crypto-es/lib/md5';
import { windhappersStyles } from './windhappers-styles.js';

import '@material/mwc-icon';

export class WindhappersVolunteer extends LitElement {
  static get styles() {
    return [
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
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true,
      },
      name: {
        type: String,
      },
      role: {
        type: String,
      },
      email: {
        type: String,
      },
      emailPersonal: {
        type: String,
        attribute: 'email-personal',
      },
      phone: {
        type: String,
      },
    };
  }

  render() {
    return html`
      <img
        id="avatar"
        sizing="cover"
        src="${WindhappersVolunteer._computeGravatarUrl(
          this.emailPersonal,
          this.email
        )}"
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

  static _computeHiddenActions(email, phone) {
    return !(email || phone);
  }

  static _computeGravatarUrl(emailPrimary, emailSecondary) {
    const email = emailPrimary
      ? emailPrimary.toLowerCase()
      : emailSecondary.toLowerCase();
    return `https://secure.gravatar.com/avatar/${MD5(
      email
    )}?size=100&default=mm`;
  }
}

customElements.define('windhappers-volunteer', WindhappersVolunteer);
