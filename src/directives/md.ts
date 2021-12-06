import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartInfo, PartType } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

class Markdown extends AsyncDirective {
  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.CHILD) {
      throw new Error(
        'The directive "md" only supports child expressions'
      );
    }
  }

  render(markdown?: string) {
    new Promise(resolve => {
      resolve(unsafeHTML(markdown ? DOMPurify.sanitize(marked(markdown)) : nothing));
    }).then(htmlSanitized => {
      this.setValue(htmlSanitized);
    });
  }
}

export const md = directive(Markdown);
