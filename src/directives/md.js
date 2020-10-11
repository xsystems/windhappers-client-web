import { directive, NodePart } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import marked from 'marked/lib/marked.esm.js';
import DOMPurify from 'dompurify';

export const md = directive((markdown) => (part) => {
  if (!(part instanceof NodePart)) {
    throw new Error('The directive "md" can only be used in content bindings');
  }

  new Promise(resolve => {
    resolve(unsafeHTML(DOMPurify.sanitize(marked(markdown))));
  }).then(html => {
    part.setValue(html);
    part.commit();
  });
});
