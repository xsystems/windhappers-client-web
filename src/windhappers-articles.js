import { LitElement, html, css } from 'lit-element';
import { noChange } from 'lit-html';
import { cache } from 'lit-html/directives/cache.js';
import { windhappersStyles } from './windhappers-styles.js';

import '@material/mwc-icon';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';

import './windhappers-article-abstract.js';
import './windhappers-article-full.js';

export class WindhappersArticles extends LitElement {
  static get styles() {
    return [
      windhappersStyles,
      css`
        windhappers-article-abstract,
        windhappers-article-full {
          background-color: white;
          border-radius: 2px;
          box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
            0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
        }

        windhappers-article-abstract:not(:last-child) {
          margin-bottom: 1vh;
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
      routePrefix: {
        type: String,
        attribute: 'route-prefix',
      },
      cmsUrl: {
        type: String,
        attribute: 'cms-url',
      },
      articles: {
        type: Array,
      },
      pinned: {
        type: Boolean,
        reflect: true,
      },
      _route: {
        type: Object,
      },
      _articleId: {
        type: Number,
      },
    };
  }

  updated(changedProperties) {
    if (changedProperties.has('cmsUrl')) {
      this._fetchArticles(this.cmsUrl, this.pinned);
    }
  }

  render() {
    return html`
      <app-location
        @route-changed="${event => {
          this._route = event.detail.value;
        }}"
      ></app-location>
      <app-route
        .route="${this._route}"
        pattern="${this.routePrefix}/:articleId"
        @data-changed="${event => {
          this._articleId = parseInt(event.detail.value.articleId, 10);
        }}"
        @active-changed="${event => {
          if (!event.detail.value) {
            this._articleId = null;
          }
        }}"
      >
      </app-route>

      ${cache(this._pages(this.articles, this._articleId))}
    `;
  }

  _pages(articles, articleId) {
    if (articles && articleId) {
      const article = articles.find(it => it.id === articleId);
      return html`
        <windhappers-article-full
          ?narrow=${this.narrow}
          .article=${article}
          articles-url="${this.routePrefix}"
        >
        </windhappers-article-full>
      `;
    }

    if (articles) {
      return html`
        ${this.articles.map(
          article => html`
            <windhappers-article-abstract
              ?narrow=${this.narrow}
              .article=${article}
              article-url="${this.routePrefix}/${article.id}"
            >
            </windhappers-article-abstract>
          `
        )}
      `;
    }

    return noChange;
  }

  async _fetchArticles(cmsUrl, pinned) {
    const filter = `?hidden=false${pinned ? '&pinned=true' : ''}`;
    fetch(`${cmsUrl}/articles${filter}`).then(async response => {
      const articles = await response.json();
      if (response.ok) {
        this.articles = articles;
        this.dispatchEvent(new CustomEvent('loaded'));
      } else {
        this.dispatchEvent(new CustomEvent('error'));
      }
    });
  }
}

customElements.define('windhappers-articles', WindhappersArticles);
