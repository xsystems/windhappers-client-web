import '@material/mwc-icon';
import '@material/mwc-icon-button';

import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-notification')
export class WindhappersNotification extends LitElement {
  static styles = [
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

      :host([type='info']) #bar {
        background-color: var(--paper-blue-800);
      }

      :host([type='warning']) #bar {
        background-color: var(--paper-orange-800);
      }

      :host([type='error']) #bar {
        background-color: var(--paper-red-800);
      }

      :host([type='info']) #icon-notification {
        color: var(--paper-blue-800);
      }

      :host([type='warning']) #icon-notification {
        color: var(--paper-orange-800);
      }

      :host([type='error']) #icon-notification {
        color: var(--paper-red-800);
      }

      mwc-icon-button {
        --mdc-icon-button-size: 24px;
        --mdc-icon-size: 24px;
      }

      ::slotted(p:first-child) {
        margin-top: 0;
      }

      ::slotted(p:last-child) {
        margin-bottom: 0;
      }
    `,
  ];

  @property({
    type: String,
  })
  type = 'info';

  @property({
    type: Boolean,
  })
  removable = false;

  render() {
    return html`
      <div id="bar"></div>
      <div id="main">
        <mwc-icon id="icon-notification"
          >${WindhappersNotification._computeIcon(this.type)}</mwc-icon
        >
        <div id="content">
          <slot></slot>
        </div>
        ${this.removable
          ? html`
              <mwc-icon-button
                icon="close"
                @click=${() => this.remove()}
              ></mwc-icon-button>
            `
          : nothing}
      </div>
    `;
  }

  remove() {
    this.parentNode?.removeChild(this);
  }

  static _computeIcon(type: string) {
    if (type === 'warning' || type === 'error') {
      return type;
    }

    return 'info';
  }
}
