import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { debounce } from 'throttle-debounce';

import { GcpStorageObject } from '../entities/GcpStorageObject.js';
import { GcpStorageObjects } from '../entities/GcpStorageObjects.js';

@customElement('xsystems-gcp-bucket')
export class XsystemsGcpBucket extends LitElement {
  @property({
    type: String,
  })
  bucket?: string;

  @property({
    type: String,
    attribute: 'object-prefix',
  })
  objectPrefix?: string;

  @property({
    type: String,
  })
  delimeter = '/';

  @property({
    type: Boolean,
  })
  desc = false;

  /**
   * Length of time in milliseconds to debounce multiple automatically generated requests.
   */
  @property({
    type: Number,
    attribute: 'debounce-duration',
  })
  debounceDuration = 500;

  private _performRequest = this.debounceDuration
    ? debounce(this.debounceDuration, this._performRequestImpl.bind(this))
    : this._performRequestImpl.bind(this);

  updated(changedProperties: PropertyValues) {
    if (
      changedProperties.has('debounceDuration') &&
      this.debounceDuration !== changedProperties.get('debounceDuration')
    ) {
      this._performRequest = this.debounceDuration
        ? debounce(this.debounceDuration, this._performRequestImpl.bind(this))
        : this._performRequestImpl.bind(this);
    }

    if (this.bucket) {
      this._performRequest(this.bucket, this.objectPrefix, this.delimeter);
    }
  }

  private _performRequestImpl(
    bucket: string,
    objectPrefix?: string,
    delimeter?: string
  ) {
    const url = new URL(
      `${bucket}/o`,
      'https://www.googleapis.com/storage/v1/b/'
    );

    const { searchParams } = url;

    if (objectPrefix) {
      searchParams.set('prefix', objectPrefix);
    }

    if (delimeter) {
      searchParams.set('delimeter', delimeter);
    }

    fetch(url.toString())
      .then(response => response.json())
      .then((responseJson: GcpStorageObjects) => {
        this.dispatchEvent(
          new CustomEvent('response', {
            detail: responseJson.items
              .sort(this._sort.bind(this))
              .map(this._wrapWithMetadataFunction(bucket)),
          })
        );
      })
      .catch(() => {
        throw new Error('Failed to fetch GCP Storage Objects');
      });
  }

  private _sort(item1: GcpStorageObject, item2: GcpStorageObject) {
    if (item1.name === item2.name) {
      return 0;
    }

    if (this.desc !== item1.name > item2.name) {
      return 1;
    }

    return -1;
  }

  private _wrapWithMetadataFunction(bucket: string) {
    return (item: GcpStorageObject) => {
      return {
        isFile: XsystemsGcpBucket._computeIsFile(item),
        name: this._computeFilename(item),
        url: XsystemsGcpBucket._computeFileUrl(bucket, item),
      };
    };
  }

  private _computeFilename(item: GcpStorageObject) {
    const { name } = item;

    if (this.objectPrefix && XsystemsGcpBucket._computeIsFile(item)) {
      const regex = new RegExp(`^${this.objectPrefix}`);
      return name.replace(regex, '');
    }

    return name;
  }

  private static _computeFileUrl(bucket: string, item: GcpStorageObject) {
    return `https://storage.googleapis.com/${bucket}/${item.name}`;
  }

  private static _computeIsFile(item: GcpStorageObject) {
    return !item.name.endsWith('/');
  }
}
