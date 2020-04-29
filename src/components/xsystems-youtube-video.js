import { LitElement, html, css } from 'lit-element';

export class XsystemsYoutubeVideo extends LitElement {
  static get styles() {
    return css`
      .aspect-ratio-box {
        width: 100%;
        padding-bottom: 56.25%;
        position: relative;
      }

      #player {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    `
  }

  static get properties() {
    return {
      videoId: {
        type: String,
        attribute: 'video-id'
      }
    };
  }

  render() {
    return html`
      <div class="aspect-ratio-box">
        <iframe id="player"
                type="text/html"
                src="https://www.youtube.com/embed/${this.videoId}?modestbranding=1&rel=0&iv_load_policy=3"
                frameborder="0"
                allowfullscreen></iframe>
      </div>
    `;
  }
}

customElements.define('xsystems-youtube-video', XsystemsYoutubeVideo);