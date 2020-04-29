import { LitElement } from 'lit-element';
import { debounce } from 'throttle-debounce';

export class XsystemsGcpBucket extends LitElement {
  static get properties() {
    return {
      bucket: {
        type: String
      },

      prefix: {
        type: String
      },

      delimeter: {
        type: String
      },

      desc: {
        type: Boolean
      },

      /**
       * Length of time in milliseconds to debounce multiple automatically generated requests.
       */
      debounceDuration: {
        type: Number,
        attribute: 'debounce-duration'
      },

      _response: {
        type: Object
      }
    };
  }

  constructor() {
    super();
    this.delimeter = '/';
    this.debounceDuration = 500;
  }

  updated(changedProperties) {
    if (changedProperties.has('debounceDuration') 
        && this.debounceDuration !== changedProperties.debounceDuration) {
      this._performRequest = this.debounceDuration ? debounce(this.debounceDuration, this._performRequestImpl) : this._performRequestImpl;
    }

    if (this.bucket) {
      this._performRequest(this.bucket, this.prefix, this.delimeter);
    }
  }

  _performRequestImpl(bucket, prefix, delimeter) {
    const url = new URL(bucket + '/o', 'https://www.googleapis.com/storage/v1/b/');

    const searchParams = url.searchParams;

    if (prefix) {
      searchParams.set('prefix', prefix);
    }

    if (delimeter) {
      searchParams.set('delimeter', delimeter);
    }

    fetch(url).then(response => {
      return response.json();
    }).then(responseJson => {
      this.dispatchEvent( new CustomEvent('response', { 
        detail: responseJson.items.sort(this._sort.bind(this))
                                  .map(this._wrapWithMetadata.bind(this))
      }));    
    });
  }

  _sort(item1, item2) {
    if (item1.name === item2.name) {
      return 0;
    } else if (this.desc != (item1.name > item2.name)) {
      return 1;
    } else {
      return -1;
    }
  }

  _wrapWithMetadata(item) {
    return {
      isFile: this._computeIsFile(item),
      name: this._computeFilename(item),
      url: this._computeFileUrl(this.bucket, item),
      item: item
    }
  }

  _computeFilename(item) {
    const name = item.name;
    if (this.prefix && this._computeIsFile(item)) {
      const regex = new RegExp('^' + this.prefix);
      return name.replace(regex, '');
    } else {
      return name;
    }
  }

  _computeFileUrl(bucket, item) {
    return 'https://storage.googleapis.com/' + bucket + '/' + item.name;
  }

  _computeIsFile(item) {
    return !item.name.endsWith('/');
  }
}

customElements.define('xsystems-gcp-bucket', XsystemsGcpBucket);