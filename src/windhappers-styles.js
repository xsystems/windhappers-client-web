import { css } from 'lit-element';

import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';

export const windhappersStyles = css`
  :host {
    /* Application theme */

    /*
      * You can use these generic variables in your elements for easy theming.
      * For example, if all your elements use '--primary-text-color' as its main
      * color, then switching from a light to a dark theme is just a matter of
      * changing the value of '--primary-text-color' in your application.
      */
    --primary-text-color: var(--light-theme-text-color);
    --primary-background-color: var(--light-theme-background-color);
    --secondary-text-color: var(--light-theme-secondary-color);
    --disabled-text-color: var(--light-theme-disabled-color);
    --divider-color: var(--light-theme-divider-color);
    --error-color: var(--paper-deep-orange-a700);

    /*
      * Primary and accent colors. Also see color.html for more colors.
      */
    --primary-color: var(--light-theme-base-color);
    --light-primary-color: var(--paper-indigo-100);
    --dark-primary-color: var(--paper-indigo-700);
    --accent-color: var(--paper-grey-200);
    --light-accent-color: var(--paper-grey-100);
    --dark-accent-color: var(--paper-grey-400);

    /*
      * Light background theme
      */
    --light-theme-background-color: #ffffff;
    --light-theme-base-color: var(--paper-light-green-a700);
    --light-theme-text-color: var(--paper-grey-900);
    --light-theme-secondary-color: var(--paper-blue-grey-600); /*#737373;  /* for secondary text and icons */
    --light-theme-disabled-color: #9b9b9b;  /* disabled/hint text */
    --light-theme-divider-color: #dbdbdb;

    /*
      * Dark background theme
      */
    --dark-theme-background-color: var(--paper-grey-900);
    --dark-theme-base-color: #ffffff;
    --dark-theme-text-color: #ffffff;
    --dark-theme-secondary-color: #bcbcbc;  /* for secondary text and icons */
    --dark-theme-disabled-color: #646464;  /* disabled/hint text */
    --dark-theme-divider-color: #3c3c3c;


    /* Components */

    /* paper-drawer-panel */
    --drawer-menu-color: #ffffff;
    --drawer-border-color: 1px solid #ccc;
    --drawer-toolbar-border-color: 1px solid rgba(0, 0, 0, 0.22);

    /* paper-menu */
    --paper-menu-background-color: #fff;
    --menu-link-color: #111111;

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

  h1 {
    color: var(--primary-color);
  }
`;