import { LitElement } from 'lit-element';


export class XsystemsGoogleSheets extends LitElement {
  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      },
      key: {
        type: String
      },
      worksheet: {
        type: Number
      }
    };
  }

  constructor() {
    super();
    this.worksheet = 1;
  }

  updated() {
    if (!(this.key && this.worksheet)) {
      return;
    } else {
      fetch(`https://spreadsheets.google.com/feeds/list/${this.key}/${this.worksheet}/public/values?alt=json`).then(response => {
        return response.json();
      }).then(spreadsheet => {
        let rows = spreadsheet.feed.entry.map(row => {
          return Object.fromEntries(
            Object.entries(row)
                  .filter(([key]) => key.startsWith('gsx$'))
                  .map(([key, value]) => [key.slice(4), value.$t]));
        });
        this.dispatchEvent( new CustomEvent('rows', { 
          detail: { rows: rows }
        }));
      });
    }
  }
}

customElements.define('xsystems-google-sheets', XsystemsGoogleSheets);