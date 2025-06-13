import p from "./copy-button.js";
import { C as u, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { i as g, x as o } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { e as k } from "../chunks/class-map.Cn0czwWq.js";
import { n as b } from "../chunks/when.CDK1Tt5Y.js";
import { Variant as a, Alignment as x } from "./header.types.js";
const v = g`
  .column-resize-handle {
    background-color: var(--editor-table-resize-handle-color);
    bottom: -2px;
    height: unset !important;
    max-height: unset !important;
    pointer-event: none;
    position: absolute;
    right: -4px;
    top: -2px;
    width: 4px;
    z-index: 10000;
  }

  .column-resize-handle.bottom-handle {
    bottom: 0;
  }

  .column-resize-handle.top-handle {
    top: 0;
  }

  .row-resize-handle {
    background-color: var(--editor-table-resize-handle-color);
    bottom: -4px;
    height: 4px;
    left: -2px;
    max-width: unset !important;
    pointe-events: none;
    position: absolute;
    right: -2px;
    width: unset !important;
    z-index: 20, 10000;
  }

  .row-resize-handle.left-handle {
    left: 0;
  }

  .row-resize-handle.right-handle {
    right: 0;
  }

  .ProseMirror {
    --editor-table-resize-handle-color: #adf;
    outline: none;
  }

  .ProseMirror .tableWrapper .floating-button {
    opacity: 0;
    position: absolute;
    transition: opacity 0.2s ease-in-out;
  }

  .ProseMirror .code-block-wrapper {
    background-color: var(--cx-color-neutral-50);
    border-radius: var(--cx-border-radius-medium);
    color: var(--cx-color-neutral-700);
    min-height: 3rem;
    padding: var(--cx-spacing-x-small);
    position: relative;
    white-space: normal;
  }

  .ProseMirror .code-block-wrapper cx-rte-code-block-toolbar {
    display: flex;
    gap: var(--cx-spacing-small);
    position: absolute;
    right: var(--cx-spacing-2x-small);
    top: var(--cx-spacing-2x-small);
  }

  .ProseMirror .code-block-wrapper cx-rte-code-block-toolbar,
  .ProseMirror .code-block-wrapper cx-rte-code-block-toolbar.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .ProseMirror .code-block-wrapper:hover cx-rte-code-block-toolbar:not(.hidden),
  .ProseMirror .code-block-wrapper cx-rte-code-block-toolbar.open {
    opacity: 1;
    pointer-events: auto;
  }

  .ProseMirror .floating-button {
    position: absolute;
  }

  .ProseMirror .mce-item-anchor {
    position: relative;
    text-decoration: none !important;
  }

  .ProseMirror .mce-item-anchor::before {
    color: var(--cx-color-neutral-700);
    content: '\f02e';
    font-family: FontAwesome;
    font-size: 12px !important;
  }

  .ProseMirror .tableWrapper {
    position: relative;
  }

  .ProseMirror .tableWrapper:hover .floating-button,
  .ProseMirror .tableWrapper.ProseMirror-selectednode .floating-button {
    opacity: 1;
  }

  .ProseMirror blockquote {
    border-left: 3px solid var(--cx-color-neutral-300);
    display: block;
    margin-block-end: 1em;
    margin-block-start: 1em;
    margin-inline-end: 40px;
    margin-inline-start: 40px;
    padding-left: 1rem;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: var(--cx-color-neutral-1000);
    content: attr(data-placeholder);
    float: left;
    font-weight: 400;
    height: 0;
    opacity: 0.25;
    pointe-events: none;
  }

  .ProseMirror table .selectedCell:after {
    background: var(--cx-color-neutral-300);
    bottom: 0;
    content: '';
    height: 100%;
    left: 0;
    opacity: 0.4;
    pointer-event: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }

  .ProseMirror table td,
  .ProseMirror table th {
    border: 1px dashed var(--cx-color-neutral-400);
    min-width: 1rem;
    position: relative;
  }

  .ProseMirror table[data-align='center'] {
    margin-left: auto;
    margin-right: auto;
  }

  .ProseMirror table[data-align='right'] {
    margin-left: auto;
  }

  .ProseMirror.cursor-col-resize {
    cursor: col-resize;
  }

  .ProseMirror.cursor-row-resize {
    cursor: row-resize;
  }

  pre[class*='language-'],
  code[class*='language-'] {
    color: #d4d4d4;
    font-size: var(--cx-font-size-x-small);
    text-shadow: none;
    font-family: Menlo, Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono',
      'Courier New', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    line-height: 1.5;
    tab-size: 4;
    hyphens: none;
  }

  pre[class*='language-']::selection,
  code[class*='language-']::selection,
  pre[class*='language-'] *::selection,
  code[class*='language-'] *::selection {
    text-shadow: none;
    background: #75a7ca;
  }

  @media print {
    pre[class*='language-'],
    code[class*='language-'] {
      text-shadow: none;
    }
  }

  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    background: #1e1e1e;
  }

  :not(pre) > code[class*='language-'] {
    padding: 0.1em 0.3em;
    border-radius: 0.3em;
    color: #db4c69;
    background: #f9f2f4;
  }

  /*********************************************************
* Tokens
*/
  .namespace {
    opacity: 0.7;
  }

  .token.doctype .token.doctype-tag {
    color: #569cd6;
  }

  .token.doctype .token.name {
    color: #9cdcfe;
  }

  .token.comment,
  .token.prolog {
    color: #6a9955;
  }

  .token.punctuation,
  .language-html .language-css .token.punctuation,
  .language-html .language-javascript .token.punctuation {
    color: #d4d4d4;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted,
  .token.unit {
    color: #b5cea8;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #ce9178;
  }

  .language-css .token.string.url {
    text-decoration: underline;
  }

  .token.operator,
  .token.entity {
    color: #d4d4d4;
  }

  .token.operator.arrow {
    color: #569cd6;
  }

  .token.atrule {
    color: #ce9178;
  }

  .token.atrule .token.rule {
    color: #c586c0;
  }

  .token.atrule .token.url {
    color: #9cdcfe;
  }

  .token.atrule .token.url .token.function {
    color: #dcdcaa;
  }

  .token.atrule .token.url .token.punctuation {
    color: #d4d4d4;
  }

  .token.keyword {
    color: #569cd6;
  }

  .token.keyword.module,
  .token.keyword.control-flow {
    color: #c586c0;
  }

  .token.function,
  .token.function .token.maybe-class-name {
    color: #dcdcaa;
  }

  .token.regex {
    color: #d16969;
  }

  .token.important {
    color: #569cd6;
  }

  .token.italic {
    font-style: italic;
  }

  .token.constant {
    color: #9cdcfe;
  }

  .token.class-name,
  .token.maybe-class-name {
    color: #4ec9b0;
  }

  .token.console {
    color: #9cdcfe;
  }

  .token.parameter {
    color: #9cdcfe;
  }

  .token.interpolation {
    color: #9cdcfe;
  }

  .token.punctuation.interpolation-punctuation {
    color: #569cd6;
  }

  .token.boolean {
    color: #569cd6;
  }

  .token.property,
  .token.variable,
  .token.imports .token.maybe-class-name,
  .token.exports .token.maybe-class-name {
    color: #9cdcfe;
  }

  .token.selector {
    color: #d7ba7d;
  }

  .token.escape {
    color: #d7ba7d;
  }

  .token.tag {
    color: #569cd6;
  }

  .token.tag .token.punctuation {
    color: #808080;
  }

  .token.cdata {
    color: #808080;
  }

  .token.attr-name {
    color: #9cdcfe;
  }

  .token.attr-value,
  .token.attr-value .token.punctuation {
    color: #ce9178;
  }

  .token.attr-value .token.punctuation.attr-equals {
    color: #d4d4d4;
  }

  .token.entity {
    color: #569cd6;
  }

  .token.namespace {
    color: #4ec9b0;
  }

  /*********************************************************
* Language Specific
*/

  pre[class*='language-javascript'],
  code[class*='language-javascript'],
  pre[class*='language-jsx'],
  code[class*='language-jsx'],
  pre[class*='language-typescript'],
  code[class*='language-typescript'],
  pre[class*='language-tsx'],
  code[class*='language-tsx'] {
    color: #9cdcfe;
  }

  pre[class*='language-css'],
  code[class*='language-css'] {
    color: #ce9178;
  }

  pre[class*='language-html'],
  code[class*='language-html'] {
    color: #d4d4d4;
  }

  .language-regex .token.anchor {
    color: #dcdcaa;
  }

  .language-html .token.punctuation {
    color: #808080;
  }

  /*********************************************************
* Line highlighting
*/
  pre[data-line] {
    position: relative;
  }

  pre[class*='language-'] > code[class*='language-'] {
    position: relative;
    z-index: 1;
  }

  .line-highlight {
    position: absolute;
    left: 0;
    right: 0;
    padding: 0;
    margin-top: 1em;
    background: #f7ebc6;
    box-shadow: inset 5px 0 0 #f7d87c;
    z-index: 0;
    pointer-events: none;
    line-height: inherit;
    white-space: pre;
  }
`, y = g`
  :host {
    --color: inherit;
    --font-family: var(--cx-font-sans);
    --text-align: left;
    --line-height: 1;

    width: 100%;
    display: block;
  }

  :host([alignment='center']) .container {
    --text-align: center;
    justify-content: center;
  }

  :host([alignment='right']) .container {
    --text-align: right;
    flex-direction: row-reverse;
  }

  :host([alignment='left']) .container {
    --text-align: left;
    justify-content: flex-start;
  }

  :host([alignment='justify']) .container {
    --text-align: justify;
    justify-content: flex-start;
  }

  .container {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .heading {
    margin-block-start: 0;
    margin-block-end: 0;
    color: var(--color);
    font-family: var(--font-family);
    padding: var(--padding, 0px);
    text-align: var(--text-align, left);
    flex: 1 1 auto;
  }

  .container.container--has-copy-button .heading {
    flex: 0 0 auto;
  }

  .copy-button {
    opacity: 0;
    transition: opacity var(--cx-transition-fast);
    line-height: 0;
    color: var(--cx-color-neutral-600);
    pointer-events: none;
    user-select: none;
  }

  .container:hover .copy-button {
    opacity: 1;
    pointer-events: auto;
    user-select: auto;
  }

  .heading-1 {
    font-size: var(--cx-font-size-3x-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--line-height, var(--cx-line-height-3x-large));
  }

  .heading-2 {
    font-size: var(--cx-font-size-2x-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--line-height, var(--cx-line-height-3x-large));
  }

  .heading-3 {
    font-size: var(--cx-font-size-x-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--line-height, var(--cx-line-height-2x-large));
  }

  .heading-4 {
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--line-height, var(--cx-line-height-x-large));
  }

  .heading-5 {
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--line-height, var(--cx-line-height-large));
  }

  .heading-6 {
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--line-height, var(--cx-line-height-medium));
  }
`;
var w = Object.defineProperty, z = Object.getOwnPropertyDescriptor, i = (e, c, r, s) => {
  for (var n = s > 1 ? void 0 : s ? z(c, r) : c, d = e.length - 1, h; d >= 0; d--)
    (h = e[d]) && (n = (s ? h(c, r, n) : h(n)) || n);
  return s && n && w(c, r, n), n;
};
let t = class extends u {
  constructor() {
    super(...arguments), this.variant = a.H6, this.hasAnchorLink = !1, this.anchorLink = "", this.alignment = x.LEFT, this.disabledCopyButton = !1, this.scrollToAnchor = () => {
      const e = this.getAnchorID();
      !e || e !== this.anchorID || this.scrollIntoView({
        block: "start"
      });
    };
  }
  get ownerWindow() {
    return this.ownerDocument.defaultView || window;
  }
  /**
   * Get the anchor ID for the header.
   * If `hasAnchorLink` is false, it returns an empty string.
   * If `anchorLink` is provided, it returns that.
   * Otherwise, it generates an anchor based on the text content of the header,
   */
  get anchorID() {
    var e;
    return this.hasAnchorLink && (this.anchorLink || ((e = this.textContent) == null ? void 0 : e.trim().replace(/\s+/g, "-").toLowerCase())) || "";
  }
  firstUpdated() {
    setTimeout(() => {
      this.scrollToAnchor();
    }, 200);
  }
  connectedCallback() {
    super.connectedCallback(), !(!this.hasAnchorLink || !this.anchorID) && (this.ownerWindow.addEventListener("hashchange", this.scrollToAnchor), this.ownerWindow.addEventListener(
      "load",
      () => {
        setTimeout(() => {
          this.scrollToAnchor();
        }, 200);
      },
      { once: !0 }
    ));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.ownerWindow.removeEventListener("hashchange", this.scrollToAnchor);
  }
  getAnchorID() {
    let e = "";
    const r = this.ownerWindow.location.href.split("#");
    return r.length > 1 && (e = decodeURIComponent(r[1])), e;
  }
  renderHeading(e) {
    switch (this.variant) {
      case a.H1:
        return o`<h1 part="heading" class="heading heading-1">
          ${e}
        </h1>`;
      case a.H2:
        return o`<h2 part="heading" class="heading heading-2">
          ${e}
        </h2>`;
      case a.H3:
        return o`<h3 part="heading" class="heading heading-3">
          ${e}
        </h3>`;
      case a.H4:
        return o`<h4 part="heading" class="heading heading-4">
          ${e}
        </h4>`;
      case a.H5:
        return o`<h5 part="heading" class="heading heading-5">
          ${e}
        </h5>`;
      default:
        return o`<h6 part="heading" class="heading heading-6">
          ${e}
        </h6>`;
    }
  }
  render() {
    const e = this.hasAnchorLink ? `${this.ownerWindow.location.href.split("#")[0]}#${encodeURIComponent(this.anchorID)}` : "";
    return o`<div
      part="base"
      class=${k({
      container: !0,
      "container--has-copy-button": this.hasAnchorLink && !this.disabledCopyButton
    })}
    >
      ${this.renderHeading(o`<slot></slot>`)}${b(
      this.hasAnchorLink && !this.disabledCopyButton,
      () => o`<cx-copy-button
            part="copy-button"
            class="copy-button"
            value=${e}
            hoist=""
          >
            <cx-icon slot="copy-icon" name="attachment"></cx-icon>
          </cx-copy-button>`
    )}
    </div>`;
  }
};
t.styles = [f, y, v];
t.dependencies = {
  "cx-copy-button": p
};
i([
  l({ type: String })
], t.prototype, "variant", 2);
i([
  l({ attribute: "has-anchor-link", type: Boolean })
], t.prototype, "hasAnchorLink", 2);
i([
  l({ attribute: "anchor-link", type: String })
], t.prototype, "anchorLink", 2);
i([
  l({ type: String })
], t.prototype, "alignment", 2);
i([
  l({ attribute: "disabled-copy-button", type: Boolean })
], t.prototype, "disabledCopyButton", 2);
t = i([
  m("cx-header")
], t);
export {
  x as Alignment,
  a as Variant,
  t as default
};
