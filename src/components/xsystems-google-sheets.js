import { LitElement } from 'lit-element';

export class XsystemsGoogleSheets extends LitElement {
  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true,
      },
      key: {
        type: String,
      },
      spreadsheetId: {
        type: String,
      },
      range: {
        type: String,
      },
    };
  }

  updated() {
    if (this.key && this.spreadsheetId && this.range) {
      fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.key}`
      )
        .then(response => response.json())
        .then(spreadsheet => {
          const { values } = spreadsheet;
          const headers = values.shift(1);

          const rows = values.map(value =>
            Object.fromEntries(
              headers.map((header, index) => [header, value[index]])
            )
          );

          this.dispatchEvent(
            new CustomEvent('rows', {
              detail: { rows },
            })
          );
        });
    }
  }
}

customElements.define('xsystems-google-sheets', XsystemsGoogleSheets);
