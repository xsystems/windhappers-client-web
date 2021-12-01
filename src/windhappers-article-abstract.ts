import { LitElement, html, css, property, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { md } from './directives/md.js';
import { WindhappersArticle } from './entities/WindhappersArticle.js';
import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-article-abstract')
export class WindhappersArticleAbstract extends LitElement {
  static styles = [
    windhappersStyles,
    css`
      :host {
        display: grid;
        grid-gap: 2vh;
        padding: 2vh;
      }

      :host([narrow]) {
        grid-template-columns: 1fr;
        grid-template-areas:
          'header'
          'poster'
          'main'
          'footer';
      }

      :host(:not([narrow])) {
        grid-template-columns: 1fr auto;
        grid-template-areas:
          'header poster'
          'main poster'
          'footer poster';
      }

      header {
        grid-area: header;
      }

      h2 {
        margin-bottom: 0vh;
        font-size: larger;
      }

      main {
        grid-area: main;
      }

      main > p:first-child {
        margin-top: 0;
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

      img {
        grid-area: poster;
        border-radius: 2px;
      }

      :host([narrow]) img {
        width: 100%;
      }

      :host(:not([narrow])) img {
        align-self: center;
        width: 30vh;
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
    attribute: 'article-url',
  })
  articleUrl?: string;

  render() {
    return this.article ? html`
      <header>
        <h2>${this.article.title}</h2>
      </header>
      <main>${md(this.article.abstract)}</main>
      <footer>
        <a href="${ifDefined(this.articleUrl)}">Lees verder ...</a>
      </footer>
      <img
        src="${this.article.poster.formats.medium.url}"
        alt="${this.article.poster.alternativeText}"
        title="${this.article.poster.caption}"
      />
    ` : nothing;
  }
}
