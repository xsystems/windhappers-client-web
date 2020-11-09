import { LitElement, html, css } from 'lit-element';
import { md } from './directives/md.js';
import { windhappersStyles } from './windhappers-styles.js';

export class WindhappersArticleAbstract extends LitElement {
  static get styles() {
    return [
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

        h3 {
          margin-bottom: 0vh;
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
          color: var(--primary-color, inherit);
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
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true,
      },
      article: {
        type: Object,
      },
      articleUrl: {
        type: String,
        attribute: 'article-url',
      },
    };
  }

  render() {
    return html`
      <header>
        <h3>${this.article.title}</h3>
      </header>
      <main>${md(this.article.abstract)}</main>
      <footer>
        <a href="${this.articleUrl}">Lees verder ...</a>
      </footer>
      <img
        src="${this.article.poster.formats.small.url}"
        alt="${this.article.poster.alternativeText}"
        title="${this.article.poster.caption}"
      />
    `;
  }
}

customElements.define(
  'windhappers-article-abstract',
  WindhappersArticleAbstract
);
