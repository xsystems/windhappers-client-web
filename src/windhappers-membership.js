import { LitElement, html, css } from 'lit-element';
import { windhappersStyles } from './windhappers-styles';

import './windhappers-notification'
import './windhappers-volunteer'
import './components/xsystems-google-sheets'

export class WindhappersMembership extends LitElement {
  static get styles() {
    return [
      windhappersStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          padding: 1vh;
          height: 100%;
        }

        #volunteerContainer {
          display: grid;
          grid-gap: 1vh;
          margin-bottom: 1vh;
        }

        :host([narrow]) #volunteerContainer {
          grid-template-columns: 1fr;
        }

        :host(:not([narrow])) #volunteerContainer {
          grid-template-columns: 1fr 1fr;
        }

        windhappers-notification {
          box-shadow: var(--shadow-elevation-4dp);
          margin-bottom: 1vh;
        }

        windhappers-notification > ul {
          margin: 0;
        }

        article {
          background-color: white;
          box-shadow: var(--shadow-elevation-4dp);
          padding: 1vh;
          margin-bottom: 1vh;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }

        th {
          background-color: var(--primary-color);
          color: white;
        }

        th, td {
          text-align: left;
          padding: 1%;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2
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
      _rows: {
        type: Array
      },
      _volunteers: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this._rows = [];
    this._volunteers = [];
  }

  render() {
    return html`
      <article>
        <header>
          <h1>Inschrijven</h1>
          <p>
            Wil je iets aan je conditie doen? Denk dan eens aan de kanosport in plaats van aan de sportschool. Kanovaren is niet aan leeftijd gebonden en je bent lekker in de buitenlucht. Bij de Windhappers hebben we leden van 8 tot 80 jaar en ook ruimte voor nieuwe leden.
          </p>
        </header>
        <p>
          Elke woensdagavond is onze clubavond, kom gerust eens langs voor informatie of maak een afspraak voor een proefvaart met een clubboot. Onze leden helpen u graag op weg. Of kom eens kijken op onze Open Dag.
        </p>
        <p>
          Heb je geen eigen kano? Geen probleem! Wij beschikken over een aantal clubboten, deze boten zijn beschikbaar voor leden die (nog) geen eigen boot bezitten.
        </p>
        <p>
          Elk jaar worden regelmatig basiscursussen voor nieuwe leden georganiseerd. Hierbij worden de grondbeginselen van het kanovaren aangeleerd. Elk nieuw lid volgt deze basiscursus waar, naast zaken als techniek en veiligheid, ook materiaalkennis, keuze van kano of kajak aan bod komen.
        </p>
      </article>

      <xsystems-google-sheets hidden
                              key="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
                              worksheet="2"
                              @rows="${event => this._rows = event.detail.rows}"></xsystems-google-sheets>

      <article>
        <h2>Contributie</h2>
        <table>
          ${this._rows.slice(0, 1).map(row => html`
            <tr>
              <th>Omschrijving</th>
              <th>${row.period1}</th>
              <th>${row.period2}</th>
            </tr>
          `)}
          ${this._rows.slice(1).filter(row => row.type === 'contribution').map(row => html`
            <tr>
              <td>${row.description}</td>
              <td>${row.period1}</td>
              <td>${row.period2}</td>
            </tr>
          `)}
        </table>
      </article>

      <windhappers-notification type="info">
        <ul>
          <li>Het lidmaatschap van het Watersportverbond is in deze contributie begrepen.</li>
          <li>Indien meerdere personen uit één samenlevingsverband (wonende op hetzelfde adres) lid zijn, betalen het 4e en volgende lid geen contributie.</li>
        </ul>
      </windhappers-notification>

      <article>
        <h2>Stalling</h2>
        <table>
          ${this._rows.slice(0, 1).map(row => html`
            <tr>
              <th>Omschrijving</th>
              <th>${row.period1}</th>
              <th>${row.period2}</th>
            </tr>
          `)}
          ${this._rows.slice(1).filter(row => row.type === 'storage').map(row => html`
            <tr>
              <td>${row.description}</td>
              <td>${row.period1}</td>
              <td>${row.period2}</td>
            </tr>
          `)}
        </table>
      </article>

      <article>
        <h2>Overige</h2>
        <table>
          ${this._rows.slice(0, 1).map(row => html`
            <tr>
              <th>Omschrijving</th>
              <th>${row.period1}</th>
              <th>${row.period2}</th>
            </tr>
          `)}
          ${this._rows.slice(1).filter(row => row.type === 'other').map(row => html`
            <tr>
              <td>${row.description}</td>
              <td>${row.period1}</td>
              <td>${row.period2}</td>
            </tr>
          `)}
        </table>
      </article>

      <windhappers-notification type="warning">
        Een <em>opzegging</em> voor het volgende kalenderjaar, dient voor 31 December bekend te zijn bij de <a href="/contact">ledenadministrateur</a>.
      </windhappers-notification>

      <xsystems-google-sheets hidden
                              key="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
                              @rows="${event => this._volunteers = event.detail.rows}"></xsystems-google-sheets>

      <div id="volunteerContainer">
        ${this._volunteers.filter(volunteer => this._isRelatedVolunteer(volunteer)).map(volunteer => html`
          <windhappers-volunteer  ?narrow="${this.narrow}"
                                  name="${volunteer.name}"
                                  role="${volunteer.role}"
                                  email="${volunteer.email}"
                                  email-personal="${volunteer.emailpersonal}"
                                  phone="${volunteer.phone}"></windhappers-volunteer>
        `)}
      </div>
    `;
  }

  _isRelatedVolunteer(volunteer) {
    return [
      'Ledenadministratie',
      'Beheer stalling en stallingsleutel',
      'Introductiecursus',
      'Penningmeester'
    ].indexOf(volunteer.role) > -1;
  }
}

customElements.define('windhappers-membership', WindhappersMembership);