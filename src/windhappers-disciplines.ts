import { LitElement, html, css, property, PropertyValues, customElement } from 'lit-element';
import { cache } from 'lit-html/directives/cache';
import { windhappersStyles } from './windhappers-styles.js';

import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@material/mwc-icon';
import './components/xsystems-gallery.js';
import './components/xsystems-google-sheets.js';
import './windhappers-notification.js';
import './windhappers-volunteer.js';
import { Volunteer } from './entities/Volunteer.js';
import { Discipline } from './entities/Discipline.js';
import { XsystemsGallerry } from './components/xsystems-gallery.js';

@customElement('windhappers-disciplines')
export class WindhappersDisciplines extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        padding-left: 1vh;
        padding-right: 1vh;
      }

      #volunteerContainer {
        display: grid;
        grid-gap: 1vh;
        margin-top: 1vh;
        margin-bottom: 1vh;
      }

      :host([narrow]) #volunteerContainer {
        grid-template-columns: 1fr;
      }

      :host(:not([narrow])) #volunteerContainer {
        grid-template-columns: 1fr 1fr;
      }

      article {
        display: flex;
        flex-direction: column;
        background-color: white;
        padding-left: 1vh;
        padding-right: 1vh;
        box-shadow: var(--shadow-elevation-4dp);
      }

      .photo,
      #disciplineGallery,
      windhappers-notification {
        margin-top: 1vh;
      }

      .photo {
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-elevation-4dp);
      }

      :host([narrow]) .photo {
        max-width: 100%;
      }

      :host(:not([narrow])) .photo {
        max-width: 40vw;
        align-self: center;
      }

      .photo > img {
        width: 100%;
      }

      .photo > span {
        font-weight: bold;
        padding: 1vh;
      }

      .navigation {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        padding: 1vh;
      }
    `,
  ];

  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: String,
    attribute: 'route-prefix',
  })
  routePrefix = '';

  @property({
    type: Array,
  })
  volunteers: Volunteer[] = [];

  @property({
    type: Object,
  })
  _route?: object;

  @property({
    type: Array,
  })
  _response = WindhappersDisciplines._getDisciplines();

  @property({
    type: Number,
  })
  _disciplineId?: number;

  constructor() {
    super();
    this.volunteers = [];
    this._response = WindhappersDisciplines._getDisciplines();
  }

  updated(changedProperties: PropertyValues) {
    const disciplineGallery = this.shadowRoot!.querySelector<XsystemsGallerry>('#disciplineGallery');

    if (
      disciplineGallery &&
      this._response &&
      changedProperties.has('_response') &&
      this._response !== changedProperties.get('_response')
    ) {
      WindhappersDisciplines._addItems(disciplineGallery, this._response);
    }
  }

  render() {
    return html`
      <app-location
        @route-changed="${(event: CustomEvent) => {
        this._route = event.detail.value;
      }}"
      ></app-location>
      <app-route
        .route="${this._route}"
        pattern="${this.routePrefix}/:disciplineId"
        @data-changed="${(event: CustomEvent) => {
        this._disciplineId = event.detail.value.disciplineId;
      }}"
        @active-changed="${(event: CustomEvent) => {
        if (!event.detail.value) {
          this._disciplineId = undefined;
        }
      }}"
      ></app-route>

      ${cache(
        this._pages(this.routePrefix, this._response, this._disciplineId)
      )}
    `;
  }

  _pages(routePrefix: string, response: Discipline[], disciplineId?: number) {
    if (disciplineId) {
      return html`
        <a class="navigation" href="${routePrefix}" title="Back">
          <mwc-icon>arrow_back</mwc-icon> Terug
        </a>

        <article>
          <h2>${response[disciplineId].title}</h2>

          <em>${response[disciplineId].abstract}</em>

          ${response[disciplineId].content}
        </article>

        <xsystems-google-sheets
          hidden
          key="AIzaSyDTj9__sWn_MKroJ6vlad1pCCidRBi6a5g"
          spreadsheetId="17WpTzAng1WyamrsJR40S2yECPQJGENhPaM4S0zeSdEY"
          range="Vrijwilligers"
          @rows="${(event: CustomEvent<Volunteer[]>) => {
          this.volunteers = event.detail;
        }}"
        ></xsystems-google-sheets>

        <div id="volunteerContainer">
          ${this.volunteers
          .filter(volunteer => response[disciplineId].role === volunteer.role)
          .map(
            volunteer => html`
                <windhappers-volunteer
                  ?narrow="${this.narrow}"
                  name="${volunteer.name}"
                  role="${volunteer.role}"
                  email="${volunteer.email}"
                  email-personal="${volunteer.emailPersonal}"
                  phone="${volunteer.phone}"
                ></windhappers-volunteer>
              `
          )}
        </div>
      `;
    }

    return html`
      <xsystems-gallery
        id="disciplineGallery"
        ?narrow="${this.narrow}"
        route-prefix="${routePrefix}"
      ></xsystems-gallery>
    `;
  }

  static _addItems(disciplineGallery: XsystemsGallerry, disciplines: Discipline[]) {
    disciplineGallery.addItems(
      disciplines.map(discipline => ({
        id: discipline.id,
        title: discipline.title,
        description: discipline.abstract,
        thumbnail: discipline.image,
      }))
    );
  }

  private static _getDisciplines(): Discipline[] {
    return [
      {
        id: 0,
        title: 'Kanopolo',
        abstract:
          'Kanopolo is een spectaculaire maar helaas nog redelijk onbekende sport. Kanopolo is te vergelijken met waterpolo maar dan in een kano.',
        image: '/images/canoe-polo-1.jpg',
        role: 'Kanopolo',
        content: html`
          <p>
            Kanopolo is een teamsport waarbij de teams uit minimaal 5 en
            maximaal 8 spelers bestaan. Hiervan zijn er 5 in het veld en drie
            achter de lijn als wissel. Er is geen wissel limiet waardoor de
            sport erg intensief is, een beetje te vergelijken met ijshockey. Het
            doel is zoals met alle balsporten om meer doelpunten te scoren dan
            de tegenstander. Kanopolo wordt gespeeld in meerdere klassen. Van
            hoog naar laag is dit; de Hoofdklasse, 1e klasse, 2e klasse, 3e
            klasse, jeugdklasse en seniorenklasse. Een kanopolo wedstrijd
            bestaat uit twee helften van 10 minuten. Tussen de twee helften is
            er 3 minuten rust.
          </p>

          <p>
            Kanopolo wordt zowel op buitenwateren als in zwembaden gespeeld. Het
            veld waar kanopolo op gespeeld wordt is 35 meter lang en 23 meter
            breed. Het goal waar de bal zowel met de hand als met de peddel
            ingegooid mag worden is 1,5 meter breed en 1 meter hoog en hangt op
            2 meter boven het wateroppervlak.
          </p>

          <div class="photo">
            <img src="/images/canoe-polo-1.jpg" alt="Afbeelding kanopolo" />
          </div>

          <section>
            <h3>Benodigdheden</h3>
            <dl>
              <dt>Boot</dt>
              <dd>
                Om kanopolo te spelen heeft men een kanopoloboot nodig. Dus is
                een speciale kano waarbij de stompe punten met foam afgewerkt
                zijn zodat een speler, omdat het een contactsport is, de andere
                boten niet beschadigd. Een boot mag niet langer zijn dan 3 meter
                en niet breder dan 60 centimeter.
              </dd>
              <dt>Peddel</dt>
              <dd>
                De peddel mag geen scherpe randen hebben en het blad mag, vanaf
                de steel, niet langer zijn dan 60 centimeter en niet breder dan
                25 centimeter. De peddel wordt zowel gebruikt om het goal te
                verdedigen als om te scoren.
              </dd>
              <dt>Helm</dt>
              <dd>
                De helm moet het gehele hoofd beschermen. Hiervoor zit er een
                gezichtsbeschermer (rekje) op de helm bevestigd zodat het hoofd
                vanaf de kin wordt beschermd. Op de helm dienen aan weerzijden
                duidelijk zichtbaar nummers te worden geplaatst.
              </dd>
              <dt>Zwemvest</dt>
              <dd>
                Om de torso te beschermen dient een kanopolospeler een zwemvest
                te dragen. Dit zwemvest moet minimaal 1,5 centimeter dik zijn.
                Op het zwemvest moeten aan de voor- en achterkant nummers worden
                geplaatst die overeenkomen met de nummers op de helm.
              </dd>
              <dt>Bal</dt>
              <dd>
                Bij kanopolo wordt eenzelfde bal gebruikt als bij waterpolo. Ook
                al wordt de sport gemengd gespeeld bestaat er wel een aparte
                heren en dames klasse waarbij de omvang van de bal verschilt.
              </dd>
            </dl>
          </section>
        `,
      },
      {
        id: 1,
        title: 'Toervaren',
        abstract:
          'Toervaren is een fantastische en ontspannende vrijetijdsbesteding. Je geniet van plekken waar je normaal gesproken niet snel komt. Wil je liever niet alleen varen? Bij onze club kan je aansluiten bij diverse groepen voor beginners of gevorderde kanoërs.',
        image: '/images/cruising-1.jpg',
        role: 'Secretaris',
        content: html`
          <p>
            Elke woensdagavond om 18.00 uur vaart een trainingsgroep een rondje
            in de omgeving (20 km) en om 19.00 uur wordt een kortere tocht door
            het Westland gevaren in rustig tempo. Elke vrijdagochtend vanaf 10
            uur varen de Vrije Vrijdagvaarders (een groepje enthousiaste wat
            oudere kanoërs) een paar uurtjes door het Westland om hun conditie
            op peil te houden en te genieten van de prachtige en rustige
            omgeving. Elke zondagochtend vanaf 8.30 uur wordt er ook een rustige
            tocht gevaren.
          </p>
          <div class="photo">
            <img src="/images/cruising-1.jpg" alt="Afbeelding toervaren" />
          </div>
          <p>
            Regelmatig leggen we de boten op de auto of verenigingstrailer om
            ergens in het land een tocht te maken. Bijvoorbeeld naar de
            Nieuwkoopse- of Reeuwijkse plassen; naar Leiden en omgeving; de
            Haagse Grachtentocht; naar de Rottemeren; door de Delftse grachten,
            etc. Deze tochten worden door ervaren leden georganiseerd en
            begeleid. Zie hiervoor de agenda.
          </p>
        `,
      },
      {
        id: 2,
        title: 'Zeevaren',
        abstract:
          'Varen op zee is het mooiste dat er is, volgens onze zoutwatervaarders. De golven, de branding, het heldere, zoute water en het avontuur maken het de ultieme kano-ervaring.',
        image: 'images/sea-kayaking-1.jpg',
        role: 'Secretaris',
        content: html`
          <windhappers-notification type="warning">
            Er zijn echter ook gevaren aan verbonden. Daarom hebben het
            Watersportverbond, en landelijke kanoverenigingen Peddelpraat en
            TKBN een opleidingsprogramma voor zeevaren ontwikkeld.
          </windhappers-notification>
          <p>
            Om op een verantwoorde manier op zee plezierig te kunnen varen,
            biedt de landelijke commissie NZKV (nederlandse zeekajakvaarders)
            opleidingen, tochten en clinic’s aan. Zie daarvoor
            <a href="https://nzkv.nl" target="_blank" rel="noopener">nzkv.nl</a
            >. Sinds kort hebben we een eigen zeekajak instructeur in ons
            midden, waardoor alle ondersteuning van het watersportverbond en de
            NZKV voor activiteiten en kennismakingscursussen mogelijk geworden
            is.
          </p>
          <div class="photo">
            <img src="images/sea-kayaking-2.jpg" alt="Afbeedling zeevaren" />
          </div>
          <p>
            Binnen onze vereniging is een groep zeevaarders actief, die samen
            met leden van andere verenigingen, tochten organiseert op
            Haringvliet, Grevelingen en Oosterschelde. Ook wordt er geoefend
            voor de kust bij Ter Heide en Hoek van Holland (<a href="/calendar"
              >zie kalender</a
            >).
          </p>
          <p>
            Een geoefende vlakwatervaarder(-ster) met een goed ontwikkelde lage
            steun kan de stap naar zout water gaan maken.
          </p>
        `,
      },
      {
        id: 3,
        title: 'Brandingvaren',
        abstract:
          'Als de golfvoorspellingen gunstig zijn, wordt er rondgemaild. De brandingkajaks worden op de auto geladen en we gaan op weg naar het Noorderstrand van Scheveningen.',
        image: '/images/surf-kayaking-1.jpg',
        role: 'Branding en wildwatervaren',
        content: html`
          <div class="photo">
            <img
              src="/images/surf-kayaking-1.jpg"
              alt="Afbeelding brandingvaren"
            />
          </div>
          <p>
            De langste en snelste surf, zonder om te gaan, dat is de uitdaging.
            Veel oefenen en doorzetten is nodig om dat te bereiken. Maar het is
            echt kicken om de golven te bedwingen.
          </p>
        `,
      },
      {
        id: 4,
        title: 'Wildwatervaren',
        abstract:
          'Als de golfvoorspellingen gunstig zijn, wordt er rondgemaild. De brandingkajaks worden op de auto geladen en we gaan op weg naar het Noorderstrand van Scheveningen.',
        image: '/images/wildwater-canoeing-1.jpg',
        role: 'Branding en wildwatervaren',
        content: html`
          <p>
            Er zijn verschillende moeilijkheidsgradaties. Voor deze gradaties
            bestaat een internationale klasse-indeling van rivieren. Deze
            classificatie loopt van gemakkelijk tot buitengewoon moeilijk te
            bevaren. De moeilijkheidsgraad is o.a. afhankelijk van de
            waterstanden. De klasse-indeling is:
          </p>
          <dt>Klasse 1</dt>
          <dd>
            Zeer kleine ruwe gebieden, vereist geen manoeuvreren.
            (Vaardigheidsniveau: geen)
          </dd>
          <dt>Klasse 2</dt>
          <dd>
            Hier en daar wat ruw water, misschien wat rotsen, kleine vallen, kan
            manoeuvreren vereisen. (Vaardigheidsniveau: Basis kano vaardigheden)
          </dd>
          <dt>Klasse 3</dt>
          <dd>
            Wildwater, middelmatige golfen, misschien een 1 tot 1.5 meter val,
            maar niet veel groot gevaar. Kan aanzienlijk manoeuvreren vereisen.
            (Vaardigheidsniveau: Ervaren kano vaardigheden)
          </dd>
          <dt>Klasse 4</dt>
          <dd>
            Wildwater, grote golven, lange stroomversnellingen, rotsen,
            misschien een aanzienlijke daling, scherpe manoeuvres zijn nodig.
            (Vaardigheidsniveau: Gevorderde wildwater kano ervaring)
          </dd>
          <dt>Klasse 5</dt>
          <dd>
            Wildwater, grote golven, continue stroomversnellingen, grote rotsen
            en gevaren, misschien een grote val, nauwkeurig manoeuvreren. Vaak
            gekenmerkt door "moet uitvoeren" bewegingen, dat wil zeggen het niet
            uitvoeren van een specifieke manoeuvre op een specifiek punt kan
            leiden tot ernstig letsel of de dood. Klasse 5 wordt soms uitgebreid
            naar klasse 5+ dat de meest extreme, uitvoerbare stroomversnelling
            beschrijft. (Vaardigheidsniveau: Expert)
          </dd>
          <dt>Klasse 6</dt>
          <dd>
            Hoewel er enige discussie bestaat over de term "klasse 6", verwijst
            het in de praktijk naar een stroomversnellingen die niet begaanbaar
            is en elke poging om dit te doen zal leiden tot ernstig letsel,
            bijna-verdrinking of overlijden (bijv. Murchison Falls). Als een
            stroomversnelling wordt bedwongen waarvan men dacht dat het niet
            mogelijk was, is hij meestal heringedeeld als Klasse 5.
          </dd>
          <div class="photo">
            <img
              src="/images/wildwater-canoeing-1.jpg"
              alt="Afbeelding wildwatervaren"
            />
          </div>
          <p>
            Het wildwatervaren is in het begin van de vorige eeuw ontstaan. De
            eerste wilde rivieren werden bedwongen door middel van Rafts
            (vlotten). De toenmalige ontdekkingsreizigers riskeerden bij elke
            Rapid (stroomversnelling) weer hun leven, niet wetende wat hen nu
            weer te wachten stond.
          </p>
          <p>
            Tegenwoordig zijn de meeste rivieren wel bekend en staan ze
            beschreven in kanoboeken. Tevens is nu het materiaal waarmee gevaren
            wordt vele malen verbeterd. Ging men eerst met een canvas opvouwkano
            de rivier te lijf, al snel werd dat polyester en daarna polyethyleen
            (emmertjes plastic). Ook zijn de bootjes totaal anders, eerst waren
            ze lang ( meer dan 3m) nu zijn er bootjes van nog geen twee meter:
            zogenaamde Rodeobootjes, deze zijn speciaal ontworpen om op golven
            trucjes uit te halen.
          </p>
          <p>
            Er worden ook wedstrijden in wildwater georganiseerd. Slalom is één
            van die disciplines. Tijdens de Olympische Spelen is deze te
            bewonderen, meestal op een speciale wildwaterbaan. Het rodeovaren
            beleeft een geweldige opmars in de hele wereld. Het is dan ook
            ongelofelijk om te zien wat sommigen kunnen doen met hun kajaks. Met
            bepaalde "moves" is een bepaald aantal punten te verdienen. Hoe
            moeilijker des te meer punten en wie dus de meest moeilijke "moves"
            maakt wint.
          </p>
        `,
      },
      {
        id: 5,
        title: 'Freestylekajakken',
        abstract:
          'Wildwater Freestyle is een sport waarbij in een wals of op een golf figuren worden gemaakt.',
        image: '/images/playboating-1.jpg',
        role: 'Branding en wildwatervaren',
        content: html`
          <windhappers-notification type="info">
            Deze discipline wordt bij De Windhappers niet (meer) actief
            beoefend. Echter, als er genoeg animo voor blijkt te zijn dan blazen
            we het graag nieuw leven in.
          </windhappers-notification>
          <p>
            De figuren worden door een jury beoordeeld. De figuren (moves)
            worden afhankelijk van de moeilijkheidsgraad met een verschillend
            aantal punten beloond. De atleten proberen in runs van 45 seconden
            zoveel mogelijk punten te scoren.
          </p>
          <div class="photo">
            <img
              src="/images/playboating-1.jpg"
              alt="Afbeelding freestylekajakken"
            />
          </div>
          <p>
            Wildwater Freestyle is een nog betrekkelijk jonge sport. Eind jaren
            negentig van de vorige eeuw waaide de sport vanuit de VS over naar
            Europa. Sinds 2002 is WW Freestyle opgenomen in de wedstrijdkalender
            van de International Canoe Federation. Aan de wereldkampioenschappen
            die in 2007 in Ottawa (Canada) werden gehouden, namen meer dan
            dertig landen deel, waaronder Nederland. Op Europees vlak behoort
            Nederland tot de subtop. Op Europese Kampioenschappen en bij
            Eurocupwedstrijden worden door onze landgenoten regelmatig medailles
            gewonnen.
          </p>
        `,
      },
    ];
  }
}
