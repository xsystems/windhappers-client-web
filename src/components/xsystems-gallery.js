import { LitElement, html, css } from 'lit-element';

export class XsystemsGallerry extends LitElement {
  static get styles() {
    return css`
      :host {
        display: grid;
        grid-gap: 1vh;
      }

      :host([narrow]) {
        grid-template-columns: 1fr;
      }

      :host(:not([narrow])) {
        grid-template-columns: 1fr 1fr 1fr;
      }

      .item {
        background-color: white;
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                    0 1px 10px 0 rgba(0, 0, 0, 0.12),
                    0 2px 4px -1px rgba(0, 0, 0, 0.4)
      }

      a {
        display: block;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }

      .thumbnail-link {
        width: 100%;
        padding-bottom: 55%;
        position: relative;
      }

      .thumbnail {
        position: absolute;
        object-fit: cover;
        width: 100%;
        height: 100%;
      }

      .title,
      .description {
        margin: 1vh;
      }
    `
  }

  static get properties() {
    return {
      /**
       * Use a layout that accommodates narrow devices.
       */
      narrow: {
        type: Boolean
      },
      routePrefix: {
        type: String,
        attribute: 'route-prefix'
      },
      _items: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this.reset();
  }

  render() {
    return html`
      ${this._items.map(item => html`
        <div class="item">
          <a class="thumbnail-link" href="${this.routePrefix}/${item.id}">
            <img  class="thumbnail"
                  src="${item.thumbnail}">
          </a>
          <a class="title-link" href="${this.routePrefix}/${item.id}">
            <h2 class="title">${item.title}</h2>
          </a>
          <div class="description">${item.description}</div>
        </div>
      `)}
    `;
  }

  reset() {
    this._items = [];
  }

  addItems(items) {
    this._items = this._items.concat(items);
  }

  isEmpty() {
    return !Array.isArray(this._items) || !this._items.length;
  }
}

customElements.define('xsystems-gallery', XsystemsGallerry);