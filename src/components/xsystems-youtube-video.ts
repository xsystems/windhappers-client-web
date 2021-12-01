import { LitElement, html, css, property, customElement } from 'lit-element';

@customElement('xsystems-youtube-video')
export class XsystemsYoutubeVideo extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

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
  `;

  @property({
    type: String,
    attribute: 'video-id',
  })
  videoId?: string;

  render() {
    return html`
      <div class="aspect-ratio-box">
        <iframe
          id="player"
          title="YouTube Video"
          type="text/html"
          src="https://www.youtube.com/embed/${this.videoId}?modestbranding=1&amp;rel=0&amp;iv_load_policy=3"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    `;
  }
}
