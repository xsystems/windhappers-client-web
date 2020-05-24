import { css } from 'lit-element';

import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';

export const windhappersStyles = css`
  :host {
    --primary-color: #64dd17;
    --primary-text-color: black;
    --primary-background-color: #ededed;
    --secondary-text-color: #546e7a;
    --shadow-elevation-4dp: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                            0 1px 10px 0 rgba(0, 0, 0, 0.12),
                            0 2px 4px -1px rgba(0, 0, 0, 0.4)
  }

  /* General styles */
  dt {
    font-weight: bold;
  }

  p, dd, ul {
    text-align: justify;
  }

  p + p {
    margin-top: 0;
  }

  header > p {
    font-style: italic;
  }
`;