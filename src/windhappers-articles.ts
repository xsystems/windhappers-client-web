import '@material/mwc-icon';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './windhappers-article-abstract.js';
import './windhappers-article-full.js';

import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';

import { WindhappersArticle } from './entities/WindhappersArticle.js';
import { windhappersStyles } from './windhappers-styles.js';

@customElement('windhappers-articles')
export class WindhappersArticles extends LitElement {
  static styles = [
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
    type: String,
    attribute: 'cms-url',
  })
  cmsUrl?: string;

  @property({
    type: Array,
  })
  articles: WindhappersArticle[] = [];

  @property({
    type: Boolean,
    reflect: true,
  })
  pinned = false;

  @property({
    type: Object,
  })
  private _route?: object;

  @property({
    type: Number,
  })
  private _articleId?: number;

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('cmsUrl') && this.cmsUrl) {
      this._fetchArticles(this.cmsUrl, this.pinned);
    }
  }

  render() {
    return html`
      <app-location
        @route-changed="${(event: CustomEvent<{ value: object }>) => {
          this._route = event.detail.value;
        }}"
      ></app-location>
      <app-route
        .route="${this._route}"
        pattern="${this.routePrefix}/:articleId"
        @data-changed="${(
          event: CustomEvent<{ value: { articleId: string } }>
        ) => {
          this._articleId = parseInt(event.detail.value.articleId, 10);
        }}"
        @active-changed="${(event: CustomEvent<{ value: boolean }>) => {
          if (!event.detail.value) {
            this._articleId = undefined;
          }
        }}"
      >
      </app-route>

      ${cache(this._pages(this.articles, this._articleId))}
    `;
  }

  private _pages(articles: WindhappersArticle[], articleId?: number) {
    if (articleId) {
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

  private _fetchArticles(cmsUrl: string, pinned: boolean) {
    const filter = `?_sort=created_at:DESC&hidden=false${
      pinned ? '&pinned=true' : ''
    }`;
    fetch(`${cmsUrl}/articles${filter}`)
      .then(async response => {
        const articles = (await response.json()) as WindhappersArticle[];
        if (response.ok) {
          this.articles = articles;
          this.dispatchEvent(new CustomEvent('loaded'));
        } else {
          this.dispatchEvent(new CustomEvent('error'));
        }
      })
      .catch(() => {
        throw new Error('Failed to fetch articles');
      });
  }
}
