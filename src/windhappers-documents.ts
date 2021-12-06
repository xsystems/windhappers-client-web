import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { windhappersStyles } from './windhappers-styles.js';
import { XsystemsDocument } from './entities/XsystemsDocument.js';

import './components/xsystems-gcp-bucket.js';

@customElement('windhappers-documents')
export class WindhappersDocuments extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        display: grid;
        grid-gap: 1vh;
        padding: 1vh;
      }

      :host([narrow]) {
        grid-template-columns: 1fr;
      }

      :host(:not([narrow])) {
        grid-template-columns: 1fr 1fr 1fr;
      }

      article {
        background-color: white;
        box-shadow: var(--shadow-elevation-4dp);
        padding: 1vh;
      }

      a {
        color: var(--primary-color, inherit);
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
  private _responseAssociationDocuments: XsystemsDocument[] = [];

  @property({
    type: Array,
  })
  private _responseManuals: XsystemsDocument[] = [];

  @property({
    type: Array,
  })
  private _responseNewsletters: XsystemsDocument[] = [];

  render() {
    return html`
      <article>
        <h2>Verenigingsdocumenten</h2>
        <ul>
          ${this._responseAssociationDocuments
        .filter(item => item.isFile)
        .map(
          item => html`
            <li>
              <a href="${item.url}" target="_blank" rel="noopener"
                >${item.name}</a
              >
            </li>
          `)}
        </ul>
        <xsystems-gcp-bucket
          bucket="windhappers-site"
          object-prefix="association_documents/"
          desc
          @response=${(event: CustomEvent<XsystemsDocument[]>) => { this._responseAssociationDocuments = event.detail; }}
        ></xsystems-gcp-bucket>
      </article>

      <article>
        <h2>Handleidingen</h2>
        <ul>
          ${this._responseManuals
        .filter(item => item.isFile)
        .map(item => html`
          <li>
            <a href="${item.url}" target="_blank" rel="noopener"
              >${item.name}</a
            >
          </li>
        `)}
        </ul>
        <xsystems-gcp-bucket
          bucket="windhappers-site"
          object-prefix="manuals/"
          @response=${(event: CustomEvent<XsystemsDocument[]>) => { this._responseManuals = event.detail; }}
        ></xsystems-gcp-bucket>
      </article>

      <article>
        <h2>Handige links</h2>
        <ul>
          <li>
            <a href="https://tkbn.nl" target="_blank" rel="noopener"
              >Toeristische Kano Bond Nederland</a
            >
          </li>
          <li>
            <a href="https://nzkv.nl" target="_blank" rel="noopener"
              >Nederlandse Zeekajak Vaarders</a
            >
          </li>
          <li>
            <a href="https://www.zwemwater.nl/" target="_blank" rel="noopener"
              >zwemwater.nl</a
            >
          </li>
          <li>
            <a href="https://knrm.nl/helpt?a" target="_blank" rel="noopener"
              >KNRM App</a
            >
          </li>
          <li>
            <a
              href="https://www.rijksoverheid.nl/onderwerpen/coronavirus-covid-19/veelgestelde-vragen-per-onderwerp/sport"
              target="_blank"
              rel="noopener"
              >Richtlijnen van het RIVM</a
            >
          </li>
        </ul>
      </article>

      <article>
        <h2>Windvlagen</h2>
        Nieuwsbrieven die op regelmatige basis uitkomen.
        <ul>
          ${this._responseNewsletters
        .filter(item => item.isFile)
        .map(item => html`
          <li>
            <a href="${item.url}" target="_blank" rel="noopener"
              >${item.name}</a
            >
          </li>
        `)}
        </ul>
        <xsystems-gcp-bucket
          bucket="windhappers-site"
          object-prefix="newsletters/"
          desc
          @response=${(event: CustomEvent<XsystemsDocument[]>) => { this._responseNewsletters = event.detail; }}
        ></xsystems-gcp-bucket>
      </article>
    `;
  }
}
