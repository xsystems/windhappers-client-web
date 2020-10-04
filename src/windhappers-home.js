import { LitElement, html, css } from 'lit-element';
import { windhappersStyles } from './windhappers-styles.js';

import './windhappers-notification.js';
import './components/xsystems-google-calendar.js';
import './components/xsystems-youtube-video.js';

export class WindhappersHome extends LitElement {
  static get styles() {
    return [
      windhappersStyles,
      css`
        :host([narrow]) {
          display: grid;
          grid-template-columns: auto;
          grid-gap: 1vh;
          padding: 1vh;
        }

        :host(:not([narrow])) {
          display: grid;
          grid-template-columns: 37% 37% auto;
          grid-auto-flow: column;
          grid-gap: 3vh;
          padding: 3vh;
        }

        :host(:not([narrow])) #covid19 {
          grid-column: span 2;
        }

        #nk {
          grid-row: span 3;
        }

        article {
          background-color: white;
          padding: 2vh;
          box-shadow: var(--shadow-elevation-4dp);
        }

        img,
        xsystems-youtube-video {
          width: 100%;
          box-shadow: var(--shadow-elevation-4dp);
        }

        :host([narrow]) p {
          text-align: left;
        }

        xsystems-google-calendar {
          grid-row: span 4;
          box-shadow: var(--shadow-elevation-4dp);
        }

        #club-magazine {
          background-color: var(--primary-color, inherit);
        }

        table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 1em;
        }

        th {
          background-color: var(--primary-color);
        }

        th,
        td {
          text-align: left;
          padding: 1%;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
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
      _calendars: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this._calendars = [
      'windhappers.nl_djorriihnjatt2p3it67t8v2bo@group.calendar.google.com',
      'nl.dutch#holiday@group.v.calendar.google.com',
    ];
  }

  render() {
    return html`
      <windhappers-notification id="covid19" type="warning">
        In verband met de aanscherping van de <b>COVID-19</b> richtlijnen is onze kantine per
        <b>29 september 2020</b> tot nader order gesloten. De kleedkamers, douches en toiletten
        blijven wel open voor gebruik. Neem te allen tijde
        <a
          target="_blank"
          rel="noopener"
          title="De richtlijnen van het RIVM"
          href="https://www.rijksoverheid.nl/onderwerpen/coronavirus-covid-19/veelgestelde-vragen-per-onderwerp/sport"
          >de richtlijnen van het RIVM</a
        >
        in acht! Ons
        <b
          ><a
            href="https://storage.googleapis.com/windhappers-site/association_documents/coronaprotocol_2020-05-12_v4.pdf"
            title="Coronaprotocol"
            target="_blank"
            rel="noopener"
            >coronaprotocol is hier</a
          ></b
        >
        te vinden of kijk onder <a href="/documents" title="Documenten">Documenten</a>.
      </windhappers-notification>

      <article id="club-magazine">
        <b
          >Op zoek naar ons clubblad "De Windvlaag"? Kijk onder
          <a href="/documents" title="Documenten">Documenten</a>.</b
        >
      </article>

      <article id="who">
        <header>
          <h1>Welkom!</h1>
          <p>
            Kanovereniging De Windhappers is dé Haagse kanovereniging, gelegen in het
            recreatiegebied De Uithof in Den Haag.
          </p>
        </header>
        <section>
          <p>
            Wij zijn een actieve kanovereniging met ongeveer 200 leden, van jong tot oud. We
            beschikken over een prachtig verenigingsgebouw voorzien van een gezellige kantine, een
            scala aan faciliteiten, een eigen haven, en botenloodsen. Onze leden doen aan (bijna)
            alle <a href="/disciplines" title="Disciplines">vormen van kanosport</a>: toervaren
            (zowel in kajak als Canadese kano); kanopolo; zeevaren; brandingvaren; en
            wildwatervaren.
          </p>

          <p>
            Elke woensdagavond is onze clubavond, kom gerust eens langs voor
            <a href="/membership">informatie</a> of maak een afspraak voor een proefvaart met een
            clubboot, geheel gratis en vrijblijvend.
          </p>

          <p>
            We verzorgen cursussen in kajakvaren, kanovaren, kanopolo, en zeevaren. Ook geven we
            lessen in eskimoteren in een verwarmd zwembad.
          </p>

          <p>
            We organiseren regelmatig, uitdagende en gezellige
            <a href="/calendar" title="Kalendar">activiteiten</a>, toertochten op vlakwater en op
            zee; kano kampeerweekenden; kanopolo competitie; en wildwatervaren in het buitenland.
          </p>
        </section>
      </article>

      <article id="nk">
        <header>
          <h1>NK Kanopolo</h1>
          <p>
            Het Weekend van 7 en 8 september 2019 werd er bij Kanovereniging De Windhappers weer het
            Nederlands Kampioenschap kanopolo gespeeld. Nadat eerder in het seizoen al was gespeeld
            streden tientalle teams, op 4 velden voor het clubgebouw en op de Wen, om de fel
            begeerde titel van Nederlands kampioen. Het was weer een geslaagd evenement!
          </p>
        </header>

        <xsystems-youtube-video video-id="JIRRUBh4hrM"></xsystems-youtube-video>

        <p>
          <a
            href="https://www.omroepwest.nl/nieuws/amp/3897931/Spetters-vliegen-in-het-rond-tijdens-finaleweekend-NK-Kanopolo-Den-Haag"
            target="_blank"
            rel="noopener"
            >Zie hier het volledige Omroep West artikel.</a
          >
        </p>

        <xsystems-youtube-video video-id="g_JLCOqdJ8A"></xsystems-youtube-video>

        <p>
          <a
            href="https://www.wos.nl/nk-kanopolo-op-de-wen-heel-fysiek-je-mag-heel-veel/nieuws/item?1142346"
            target="_blank"
            rel="noopener"
            >Zie hier het volledige WOS artikel.</a
          >
        </p>
      </article>

      <xsystems-google-calendar
        narrow
        ?hidden=${this.narrow}
        .calendars=${this._calendars}
        time-zone="Europe/Amsterdam"
        language="nl"
      >
      </xsystems-google-calendar>
    `;
  }
}

customElements.define('windhappers-home', WindhappersHome);
