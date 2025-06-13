import { C as c, c as n } from "../chunks/custom-element.X6y1saJZ.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { H as p } from "../chunks/slot.DJLm4Dig.js";
import { i as m, x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n as v } from "../chunks/property.CtZ87in4.js";
import { e as g } from "../chunks/class-map.Cn0czwWq.js";
const _ = m`
  :host {
    --border-color: var(--cx-color-neutral-200);
    --border-radius: var(--cx-border-radius-x-large);
    --box-shadow: var(--cx-shadow-x-small);
    --image-border-radius: var(--cx-border-radius-x-large);
    --border-width: 1px;
    --padding: var(--cx-spacing-large);

    display: inline-block;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--cx-panel-background-color);
    box-shadow: var(--box-shadow);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
    padding: var(--padding);
  }

  .card--interactive {
    --border-color: var(--cx-color-primary-300);
    box-shadow: none;
    cursor: pointer;
  }

  .card--interactive:hover {
    box-shadow: var(--cx-shadow-medium);
  }

  .card__image {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--cx-color-neutral-100);
    border-radius: var(--image-border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
    margin-bottom: var(--padding);
  }

  .card__image::slotted(img) {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    border-bottom: solid var(--header-border-width, var(--border-width))
      var(--border-color);
    padding-bottom: var(--padding);
    margin-bottom: var(--padding);
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card__title {
    display: block;
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-bold);
  }

  .card__body {
    display: block;
    width: 100%;
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding-top: var(--padding);
    margin-top: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }
`;
var f = Object.defineProperty, x = Object.getOwnPropertyDescriptor, l = (s, a, t, o) => {
  for (var r = o > 1 ? void 0 : o ? x(a, t) : a, d = s.length - 1, i; d >= 0; d--)
    (i = s[d]) && (r = (o ? i(a, t, r) : i(r)) || r);
  return o && r && f(a, t, r), r;
};
let e = class extends c {
  constructor() {
    super(...arguments), this.interactive = !1, this.hasSlotController = new p(
      this,
      "footer",
      "header",
      "image"
    );
  }
  render() {
    return b`
      <div
        part="base"
        class=${g({
      card: !0,
      "card--has-footer": this.hasSlotController.test("footer"),
      "card--has-header": this.hasSlotController.test("header"),
      "card--has-image": this.hasSlotController.test("image"),
      "card--interactive": this.interactive
    })}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot name="title" part="title" class="card__title"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `;
  }
};
e.styles = [h, _];
l([
  v({ reflect: !0, type: Boolean })
], e.prototype, "interactive", 2);
e = l([
  n("cx-card")
], e);
export {
  e as default
};
