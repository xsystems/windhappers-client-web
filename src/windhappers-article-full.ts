import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { md } from './directives/md.js';
import { windhappersStyles } from './windhappers-styles.js';

import '@material/mwc-icon';
import { WindhappersArticle } from './entities/WindhappersArticle.js';

@customElement('windhappers-article-full')
export class WindhappersArticleFull extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        display: grid;
        grid-gap: 1vh;
        grid-template-columns: 1fr;
        grid-template-areas:
          'header'
          'main'
          'footer';
        padding: 2vh;
      }

      header {
        grid-area: header;
      }

      h3 {
        margin-bottom: 1vh;
      }

      #metadata {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--secondary-text-color, inherit);
        font-size: small;
      }

      #metadata > mwc-icon {
        margin-right: 2px;
      }

      #updatedTime {
        margin-right: 1vh;
      }

      main {
        grid-area: main;
      }

      #abstract {
        font-style: italic;
      }

      #abstract > *:first-child {
        margin-top: 0;
      }

      .content-section {
        display: grid;
        grid-gap: 2vh;
      }

      :host([narrow]) .content-section {
        grid-template-columns: 1fr;
        grid-template-areas:
          'heading'
          'media'
          'content';
      }

      :host(:not([narrow])) .content-section {
        grid-template-columns: 1fr auto;
        grid-template-rows: auto 1fr;
        grid-template-areas:
          'heading media'
          'content media';
      }

      h4 {
        grid-area: heading;
        margin: 0;
      }

      .content-section > div {
        grid-area: content;
      }

      .content-section p:first-child {
        margin-top: 0;
      }

      img {
        grid-area: media;
        border-radius: 2px;
      }

      :host([narrow]) img {
        width: 100%;
      }

      :host(:not([narrow])) img {
        align-self: center;
        width: 30vh;
      }

      footer {
        grid-area: footer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: var(--secondary-text-color, inherit);
      }

      a {
        color: var(--paper-blue-800, inherit);
      }
    `,
  ];

  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: Object,
  })
  article?: WindhappersArticle;

  @property({
    type: String,
    attribute: 'articles-url',
  })
  articlesUrl?: string;

  render() {
    return this.article ? html`
      <header>
        <h3>${this.article.title}</h3>
        <div id="metadata">
          <mwc-icon>event</mwc-icon>
          <span id="updatedTime"
            >${WindhappersArticleFull._getLocaleDate(
      this.article.updated_at
    )}</span
          >
          <mwc-icon>schedule</mwc-icon>
          <span
            >${WindhappersArticleFull._getLocaleTime(
      this.article.updated_at
    )}</span
          >
        </div>
      </header>
      <main>
        <section id="abstract">${md(this.article.abstract)}</section>

        ${this.article.sections.map(
      section => html`
            <section class="content-section">
              <h4>${section.title}</h4>
              ${section.media
                ? html`
                  <img
                    src="${section.media.formats.medium.url}"
                    alt="${section.media.formats.alternativeText}"
                    title="${section.media.formats.caption}"
                  />
                `
              : nothing}
              <div>${md(section.content)}</div>
            </section>
          `
    )}
      </main>
      <footer>
        <a href="${ifDefined(this.articlesUrl)}">Alle artikelen ...</a>
        <span
          >${this.article.created_by.firstname}
          ${this.article.created_by.lastname}</span
        >
      </footer>
    ` : nothing;
  }

  private static _getLocaleDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  private static _getLocaleTime(date: string) {
    return new Date(date).toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
