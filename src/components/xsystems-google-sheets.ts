import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SheetsApiValueRange } from '../entities/SheetsApiValueRange.js';

@customElement('xsystems-google-sheets')
export class XsystemsGoogleSheets extends LitElement {
  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: String,
  })
  key?: string;

  @property({
    type: String,
  })
  spreadsheetId?: string;

  @property({
    type: String,
  })
  range?: string;

  updated() {
    if (this.key && this.spreadsheetId && this.range) {
      fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.key}`
      )
        .then(response => response.json())
        .then((valueRange: SheetsApiValueRange) => {
          const { values } = valueRange;
          const headers = values.shift();

          const rows = headers
            ? values.map(value =>
                Object.fromEntries(
                  headers.map((header, index) => [header, value[index]])
                )
              )
            : [];

          this.dispatchEvent(
            new CustomEvent('rows', {
              detail: rows,
            })
          );
        })
        .catch(() => {
          throw new Error('Failed to fetch value range from sheet.');
        });
    }
  }
}
