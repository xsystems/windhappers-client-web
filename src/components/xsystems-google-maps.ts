import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { GoogleMapsMarker } from '../entities/GoogleMapsMarker.js';

@customElement('xsystems-google-maps')
export class XsystemsGoogleMaps extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    #map {
      width: 100%;
      height: 100%;
    }
  `;

  @property({
    type: Boolean,
    reflect: true,
  })
  narrow = false;

  @property({
    type: String,
  })
  key?: string;

  @property({
    type: Number,
  })
  latitude?: number;

  @property({
    type: Number,
  })
  longitude?: number;

  @property({
    type: Number,
  })
  zoom = 10;

  @property({
    type: Array,
  })
  markers: Array<GoogleMapsMarker> = [];

  firstUpdated() {
    XsystemsGoogleMaps._loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${
        this.key ??
        (() => {
          throw new Error('Missing Google Maps API key');
        })()
      }`,
      this._initMap.bind(this)
    );
  }

  render() {
    return html` <div id="map"></div> `;
  }

  private _initMap() {
    const center =
      this.latitude && this.longitude
        ? { lat: this.latitude, lng: this.longitude }
        : undefined;
    const map = new google.maps.Map(
      this.shadowRoot?.querySelector('#map') ??
        (() => {
          throw new Error('Map element is missing');
        })(),
      {
        center,
        zoom: this.zoom,
      }
    );

    this.markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.latitude, lng: markerData.longitude },
        title: markerData.title,
        icon: markerData.icon,
      });

      const infowindow = new google.maps.InfoWindow({
        content: markerData.info.content,
      });

      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });

      marker.setMap(map);

      if (markerData.info.open) {
        infowindow.open(map, marker);
      }
    });
  }

  private static _loadScript(url: string, callback: () => void) {
    let script = document.querySelector<HTMLScriptElement>('#mapsScript');
    if (!script) {
      script = document.createElement('script');
      script.id = 'mapsScript';
      document.head.appendChild(script);
    }
    script.src = url;
    script.onload = callback;
  }
}
