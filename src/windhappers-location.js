import { LitElement, html, css } from 'lit-element';
import { windhappersStyles } from './windhappers-styles.js';

import './components/xsystems-google-maps.js';
import './windhappers-notification.js';

export class WindhappersLocation extends LitElement {
  static get styles() {
    return [
      windhappersStyles,
      css`
        :host {
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: 1fr auto auto;
          height: 100%;
          grid-gap: 1vh;
        }

        windhappers-notification {
          margin-left: 1vh;
          margin-right: 1vh;
          box-shadow: var(--shadow-elevation-4dp);
        }

        windhappers-notification:last-child {
          margin-bottom: 1vh;
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
      _markers: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this._markers = [
      {
        title: 'Kanovereniging De Windhappers',
        latitude: 52.039119,
        longitude: 4.236241,
        info: {
          content: `
            <b>Kanovereniging De Windhappers</b><br/>
            Nieuweweg 75, 2544NG Den Haag<br/>
            <i>52.039124, 4.236238</i>
          `,
          open: true,
        },
        icon: '/images/windhappers-icon_64x64.png',
      },
    ];
  }

  render() {
    return html`
      <xsystems-google-maps
        key="AIzaSyDTj9__sWn_MKroJ6vlad1pCCidRBi6a5g"
        latitude="52.079124"
        longitude="4.236238"
        .markers=${this._markers}
      ></xsystems-google-maps>

      <windhappers-notification type="info" removable>
        De Windhappers is een Haagse kanovereniging die zich bevindt achter de
        bekende Haagse Kunstijsbaan "De Uithof". Ons botenhuis met stalling en
        kantine is herkenbaar aan ons logo. Het water waar het botenhuis aan
        ligt heet De Wennetjessloot.
      </windhappers-notification>
      <windhappers-notification type="warning" removable>
        Houd rekening met de volgende aanrijroute: Vanaf de Lozerlaan neem de
        afslag Uithof en Jaap Edenweg, deze weg afrijden tot het achterste deel
        van de parkeerplaats. Loop vanaf hier naar het verenigings-gebouw.
      </windhappers-notification>
    `;
  }
}

customElements.define('windhappers-location', WindhappersLocation);
