import { LitElement, html, css } from 'lit-element';
import { nothing } from 'lit-html';
import { windhappersStyles } from './windhappers-styles';

import '@material/mwc-icon'; 
import '@material/mwc-icon-button'; 

export class WindhappersNotification extends LitElement {
  static get styles() {
    return [
      windhappersStyles,
      css`
        #bar {
          width: 0.25em;
        }

        #main {
          display: flex;
          align-items: center;
          flex: 1;
          padding: 1%;
        }

        #content {
          display: block;
          flex: 1;
          margin-left: 1%;
          margin-right: 1%;
        }

        :host {
          display: flex;
          background-color: white;
          box-shadow: var(--shadow-elevation-4dp);
        }

        :host([type="info"]) #bar {
          background-color: var(--paper-blue-500);
        }

        :host([type="warning"]) #bar {
          background-color: var(--paper-amber-500);
        }

        :host([type="error"]) #bar {
          background-color: var(--paper-red-500);
        }

        :host([type="info"]) #icon-notification {
          color: var(--paper-blue-500);
        }

        :host([type="warning"]) #icon-notification {
          color: var(--paper-amber-500);
        }

        :host([type="error"]) #icon-notification {
          color: var(--paper-red-500);
        }
      `
    ]
  }

  static get properties() {
    return {
      type: {
        type: String
      },
      removable: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.type = 'info';
  }

  render() {
    return html`
      <div id="bar"></div>
      <div id="main">
        <mwc-icon id="icon-notification">${this._computeIcon(this.type)}</mwc-icon>
        <div id="content">
          <slot></slot>
        </div>
        ${this.removable
          ? html`<mwc-icon-button icon="close" @click=${this.remove}></mwc-icon-button>`
          : nothing
        }
      </div>
    `;
  }

  remove() {
    this.parentNode.removeChild(this);
  }

  _computeIcon(type) {
    if (type == "warning") {
      return "warning";
    } else if (type == "error") {
      return "error"
    } else {
      return "info"
    }
  }
}

customElements.define('windhappers-notification', WindhappersNotification);