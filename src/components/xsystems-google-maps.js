import { LitElement, html, css } from 'lit-element';

export class XsystemsGoogleMaps extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      #map {
        width: 100%;
        height: 100%;
      }
    `
  }

  static get properties() {
    return {
      narrow: {
        type: Boolean,
        reflect: true
      },
      key: {
        type: String
      },
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
      },
      zoom: {
        type: Number
      },
      markers: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this.zoom = 10;
    this.markers = [];
  }

  firstUpdated(changedProperties) {
    this._loadScript(`https://maps.googleapis.com/maps/api/js?key=${this.key}`, this._initMap.bind(this));
  }

  render() {
    return html`
      <div id="map"></div>
    `;
  }

  _initMap() {
    const map = new google.maps.Map(this.shadowRoot.querySelector('#map'), {
      center: {lat: this.latitude, lng: this.longitude},
      zoom: this.zoom
    });

    this.markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: {lat: markerData.latitude, lng: markerData.longitude},
        title: markerData.title,
        icon: markerData.icon
      });
  
      const infowindow = new google.maps.InfoWindow({
        content: markerData.info.content
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

  _loadScript(url, callback) {
    let script = document.querySelector('#mapsScript');
    if (!script) {
      script = document.createElement('script');
      script.id = 'mapsScript';
      document.head.appendChild(script);
    }
    script.src = url;
    script.onload = callback;
  }
}

customElements.define('xsystems-google-maps', XsystemsGoogleMaps);