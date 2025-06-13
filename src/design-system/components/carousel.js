import { C as _, c as w } from "../chunks/custom-element.X6y1saJZ.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { c as f } from "../chunks/animate.c3HW4nwn.js";
import { w as P } from "../chunks/event.mFzZi4sr.js";
import { c as m } from "../chunks/math.DqTA6ya4.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { i as C, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { r as v } from "../chunks/state.-o_YRGMi.js";
import { t as E } from "../chunks/event-options.CYHYGOd8.js";
import { e as b } from "../chunks/query.BNveAlQo.js";
import { e as p } from "../chunks/class-map.Cn0czwWq.js";
import { L as z } from "../chunks/localize.D5Yoww6T.js";
import $ from "./icon.js";
import { AutoplayController as M } from "./autoplay-controller.js";
const A = (e, i) => {
  let o = 0;
  return function(...s) {
    window.clearTimeout(o), o = window.setTimeout(() => {
      e.call(this, ...s);
    }, i);
  };
}, y = (e, i, o) => {
  const s = e[i];
  e[i] = function(...t) {
    s.call(this, ...t), o.call(this, s, ...t);
  };
}, L = "onscrollend" in window;
if (!L) {
  const e = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new WeakMap(), o = (t) => {
    for (const r of t.changedTouches)
      e.add(r.identifier);
  }, s = (t) => {
    for (const r of t.changedTouches)
      e.delete(r.identifier);
  };
  document.addEventListener("touchstart", o, !0), document.addEventListener("touchend", s, !0), document.addEventListener("touchcancel", s, !0), y(
    EventTarget.prototype,
    "addEventListener",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    function(t, r) {
      if (r !== "scrollend") return;
      const a = A(() => {
        e.size ? a() : this.dispatchEvent(new Event("scrollend"));
      }, 100);
      t.call(this, "scroll", a, { passive: !0 }), i.set(this, a);
    }
  ), y(
    EventTarget.prototype,
    "removeEventListener",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    function(t, r) {
      if (r !== "scrollend") return;
      const a = i.get(this);
      a && t.call(this, "scroll", a, {
        passive: !0
      });
    }
  );
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* T(e, i) {
  if (e !== void 0) {
    let o = 0;
    for (const s of e) yield i(s, o++);
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* k(e, i, o = 1) {
  const s = i === void 0 ? 0 : e;
  i ?? (i = e);
  for (let t = s; o > 0 ? t < i : i < t; t += o) yield t;
}
const D = C`
  :host {
    --slide-gap: var(--cx-spacing-medium, 1rem);
    --aspect-ratio: 16 / 9;
    --scroll-hint: 0px;

    display: flex;
  }

  .carousel {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: 1fr min-content;
    grid-template-areas:
      '. slides .'
      '. pagination .';
    gap: var(--cx-spacing-medium);
    align-items: center;
    min-height: 100%;
    min-width: 100%;
    position: relative;
  }

  .carousel--vertical {
    grid-template-areas:
      '. slides pagination'
      '. slides pagination';
  }

  .carousel__pagination {
    grid-area: pagination;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--cx-spacing-small);
  }

  .carousel__slides {
    grid-area: slides;

    display: grid;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    aspect-ratio: calc(var(--aspect-ratio) * var(--slides-per-page));
    border-radius: var(--cx-border-radius-small);

    --slide-size: calc(
      (100% - (var(--slides-per-page) - 1) * var(--slide-gap)) /
        var(--slides-per-page)
    );
  }

  @media (prefers-reduced-motion) {
    :where(.carousel__slides) {
      scroll-behavior: auto;
    }
  }

  .carousel__slides--horizontal {
    grid-auto-flow: column;
    grid-auto-columns: var(--slide-size);
    grid-auto-rows: 100%;
    column-gap: var(--slide-gap);
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--scroll-hint);
    padding-inline: var(--scroll-hint);
    overflow-y: hidden;
  }

  .carousel__slides--vertical {
    grid-auto-flow: row;
    grid-auto-columns: 100%;
    grid-auto-rows: var(--slide-size);
    row-gap: var(--slide-gap);
    scroll-snap-type: y mandatory;
    scroll-padding-block: var(--scroll-hint);
    padding-block: var(--scroll-hint);
    overflow-x: hidden;
  }

  .carousel__slides--dragging {
  }

  :host([vertical]) ::slotted(cx-carousel-item) {
    height: 100%;
  }

  .carousel__slides::-webkit-scrollbar {
    display: none;
  }

  .carousel__navigation {
    grid-area: navigation;
    display: contents;
    font-size: var(--cx-font-size-x-large);
  }

  .carousel__navigation-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--cx-border-radius-small);
    font-size: inherit;
    color: var(--cx-color-neutral-600);
    padding: var(--cx-spacing-x-small);
    cursor: pointer;
    transition: var(--cx-transition-medium) color;
    appearance: none;
  }

  .carousel__navigation-button--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .carousel__navigation-button--disabled::part(base) {
    pointer-events: none;
  }

  .carousel__navigation-button--previous {
    grid-column: 1;
    grid-row: 1;
  }

  .carousel__navigation-button--next {
    grid-column: 3;
    grid-row: 1;
  }

  .carousel__pagination-item {
    display: block;
    cursor: pointer;
    background: none;
    border: 0;
    border-radius: var(--cx-border-radius-circle);
    width: var(--cx-spacing-small);
    height: var(--cx-spacing-small);
    background-color: var(--cx-color-neutral-300);
    padding: 0;
    margin: 0;
  }

  .carousel__pagination-item--active {
    background-color: var(--cx-color-neutral-700);
    transform: scale(1.2);
  }

  /* Focus styles */
  .carousel__slides:focus-visible,
  .carousel__navigation-button:focus-visible,
  .carousel__pagination-item:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }
`;
var I = Object.defineProperty, N = Object.getOwnPropertyDescriptor, n = (e, i, o, s) => {
  for (var t = s > 1 ? void 0 : s ? N(i, o) : i, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (t = (s ? a(i, o, t) : a(t)) || t);
  return s && t && I(i, o, t), t;
};
let l = class extends _ {
  constructor() {
    super(...arguments), this.loop = !1, this.navigation = !1, this.pagination = !1, this.autoplay = !1, this.autoplayInterval = 3e3, this.slidesPerPage = 1, this.slidesPerMove = 1, this.orientation = "horizontal", this.mouseDragging = !1, this.activeSlide = 0, this.scrolling = !1, this.dragging = !1, this.autoplayController = new M(this, () => this.next()), this.localize = new z(this), this.handleMouseDrag = (e) => {
      this.dragging || (this.scrollContainer.style.setProperty("scroll-snap-type", "none"), this.dragging = !0), this.scrollContainer.scrollBy({
        behavior: "instant",
        left: -e.movementX,
        top: -e.movementY
      });
    }, this.handleMouseDragEnd = () => {
      const e = this.scrollContainer;
      document.removeEventListener("pointermove", this.handleMouseDrag, {
        capture: !0
      });
      const i = e.scrollLeft, o = e.scrollTop;
      e.style.removeProperty("scroll-snap-type"), e.style.setProperty("overflow", "hidden");
      const s = e.scrollLeft, t = e.scrollTop;
      e.style.removeProperty("overflow"), e.style.setProperty("scroll-snap-type", "none"), e.scrollTo({
        behavior: "instant",
        left: i,
        top: o
      }), requestAnimationFrame(async () => {
        (i !== s || o !== t) && (e.scrollTo({
          behavior: f() ? "auto" : "smooth",
          left: s,
          top: t
        }), await P(e, "scrollend")), e.style.removeProperty("scroll-snap-type"), this.dragging = !1, this.handleScrollEnd();
      });
    }, this.handleSlotChange = (e) => {
      e.some(
        (o) => [...o.addedNodes, ...o.removedNodes].some(
          (s) => this.isCarouselItem(s) && !s.hasAttribute("data-clone")
        )
      ) && this.initializeSlides(), this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "region"), this.setAttribute("aria-label", this.localize.term("carousel"));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this.mutationObserver) == null || e.disconnect();
  }
  firstUpdated() {
    this.initializeSlides(), this.mutationObserver = new MutationObserver(this.handleSlotChange), this.mutationObserver.observe(this, {
      childList: !0,
      subtree: !0
    });
  }
  willUpdate(e) {
    (e.has("slidesPerMove") || e.has("slidesPerPage")) && (this.slidesPerMove = Math.min(this.slidesPerMove, this.slidesPerPage));
  }
  getPageCount() {
    const e = this.getSlides().length, { loop: i, slidesPerMove: o, slidesPerPage: s } = this, t = i ? e / o : (e - s) / o + 1;
    return Math.ceil(t);
  }
  getCurrentPage() {
    return Math.ceil(this.activeSlide / this.slidesPerMove);
  }
  canScrollNext() {
    return this.loop || this.getCurrentPage() < this.getPageCount() - 1;
  }
  canScrollPrev() {
    return this.loop || this.getCurrentPage() > 0;
  }
  /** @internal Gets all carousel items. */
  getSlides({
    excludeClones: e = !0
  } = {}) {
    return [...this.children].filter(
      (i) => this.isCarouselItem(i) && (!e || !i.hasAttribute("data-clone"))
    );
  }
  handleKeyDown(e) {
    if ([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ].includes(e.key)) {
      const i = e.target, o = this.localize.dir() === "rtl", s = i.closest('[part~="pagination-item"]') !== null, t = e.key === "ArrowDown" || !o && e.key === "ArrowRight" || o && e.key === "ArrowLeft", r = e.key === "ArrowUp" || !o && e.key === "ArrowLeft" || o && e.key === "ArrowRight";
      e.preventDefault(), r && this.previous(), t && this.next(), e.key === "Home" && this.goToSlide(0), e.key === "End" && this.goToSlide(this.getSlides().length - 1), s && this.updateComplete.then(() => {
        var d;
        const a = (d = this.shadowRoot) == null ? void 0 : d.querySelector(
          '[part~="pagination-item--active"]'
        );
        a && a.focus();
      });
    }
  }
  handleMouseDragStart(e) {
    this.mouseDragging && e.button === 0 && (e.preventDefault(), document.addEventListener("pointermove", this.handleMouseDrag, {
      capture: !0,
      passive: !0
    }), document.addEventListener("pointerup", this.handleMouseDragEnd, {
      capture: !0,
      once: !0
    }));
  }
  handleScroll() {
    this.scrolling = !0;
  }
  /** @internal Synchronizes the slides with the IntersectionObserver API. */
  synchronizeSlides() {
    const e = new IntersectionObserver(
      (i) => {
        e.disconnect();
        for (const s of i) {
          const t = s.target;
          t.toggleAttribute("inert", !s.isIntersecting), t.classList.toggle("--in-view", s.isIntersecting), t.setAttribute(
            "aria-hidden",
            s.isIntersecting ? "false" : "true"
          );
        }
        const o = i.find((s) => s.isIntersecting);
        if (o)
          if (this.loop && o.target.hasAttribute("data-clone")) {
            const s = Number(
              o.target.getAttribute("data-clone")
            );
            this.goToSlide(s, "instant");
          } else {
            const t = this.getSlides().indexOf(
              o.target
            );
            this.activeSlide = Math.ceil(t / this.slidesPerMove) * this.slidesPerMove;
          }
      },
      {
        root: this.scrollContainer,
        threshold: 0.6
      }
    );
    this.getSlides({ excludeClones: !1 }).forEach((i) => {
      e.observe(i);
    });
  }
  handleScrollEnd() {
    !this.scrolling || this.dragging || (this.synchronizeSlides(), this.scrolling = !1);
  }
  isCarouselItem(e) {
    return e instanceof Element && e.tagName.toLowerCase() === "cx-carousel-item";
  }
  initializeSlides() {
    this.getSlides({ excludeClones: !1 }).forEach((e, i) => {
      e.classList.remove("--in-view"), e.classList.remove("--is-active"), e.setAttribute(
        "aria-label",
        this.localize.term("slideNum", i + 1)
      ), e.hasAttribute("data-clone") && e.remove();
    }), this.updateSlidesSnap(), this.loop && this.createClones(), this.synchronizeSlides(), this.goToSlide(this.activeSlide, "auto");
  }
  createClones() {
    const e = this.getSlides(), i = this.slidesPerPage, o = e.slice(-i), s = e.slice(0, i);
    o.reverse().forEach((t, r) => {
      const a = t.cloneNode(!0);
      a.setAttribute("data-clone", String(e.length - r - 1)), this.prepend(a);
    }), s.forEach((t, r) => {
      const a = t.cloneNode(!0);
      a.setAttribute("data-clone", String(r)), this.append(a);
    });
  }
  handelSlideChange() {
    const e = this.getSlides();
    e.forEach((i, o) => {
      i.classList.toggle("--is-active", o === this.activeSlide);
    }), this.hasUpdated && this.emit("cx-slide-change", {
      detail: {
        index: this.activeSlide,
        slide: e[this.activeSlide]
      }
    });
  }
  updateSlidesSnap() {
    const e = this.getSlides(), i = this.slidesPerMove;
    e.forEach((o, s) => {
      (s + i) % i === 0 ? o.style.removeProperty("scroll-snap-align") : o.style.setProperty("scroll-snap-align", "none");
    });
  }
  handleAutoplayChange() {
    this.autoplayController.stop(), this.autoplay && this.autoplayController.start(this.autoplayInterval);
  }
  /**
   * Move the carousel backward by `slides-per-move` slides.
   *
   * @param behavior - The behavior used for scrolling.
   */
  previous(e = "smooth") {
    this.goToSlide(this.activeSlide - this.slidesPerMove, e);
  }
  /**
   * Move the carousel forward by `slides-per-move` slides.
   *
   * @param behavior - The behavior used for scrolling.
   */
  next(e = "smooth") {
    this.goToSlide(this.activeSlide + this.slidesPerMove, e);
  }
  /**
   * Scrolls the carousel to the slide specified by `index`.
   *
   * @param index - The slide index.
   * @param behavior - The behavior used for scrolling.
   */
  goToSlide(e, i = "smooth") {
    const { loop: o, slidesPerPage: s } = this, t = this.getSlides(), r = this.getSlides({ excludeClones: !1 });
    if (!t.length)
      return;
    const a = o ? (e + t.length) % t.length : m(e, 0, t.length - s);
    this.activeSlide = a;
    const d = this.localize.dir() === "rtl", u = m(
      e + (o ? s : 0) + (d ? s - 1 : 0),
      0,
      r.length - 1
    ), S = r[u];
    this.scrollToSlide(S, f() ? "auto" : i);
  }
  scrollToSlide(e, i = "smooth") {
    const o = this.scrollContainer, s = o.getBoundingClientRect(), t = e.getBoundingClientRect(), r = t.left - s.left, a = t.top - s.top;
    o.scrollTo({
      behavior: i,
      left: r + o.scrollLeft,
      top: a + o.scrollTop
    });
  }
  render() {
    const { scrolling: e, slidesPerMove: i } = this, o = this.getPageCount(), s = this.getCurrentPage(), t = this.canScrollPrev(), r = this.canScrollNext(), a = this.localize.dir() === "ltr";
    return g`
      <div
        part="base"
        class="${p({
      carousel: !0,
      "carousel--vertical": this.orientation === "vertical"
    })}"
      >
        <div
          id="scroll-container"
          part="scroll-container"
          class="${p({
      carousel__slides: !0,
      "carousel__slides--dragging": this.dragging,
      "carousel__slides--horizontal": this.orientation === "horizontal",
      "carousel__slides--vertical": this.orientation === "vertical"
    })}"
          style="--slides-per-page: ${this.slidesPerPage};"
          aria-busy="${e ? "true" : "false"}"
          aria-atomic="true"
          tabindex="0"
          @keydown=${this.handleKeyDown}
          @mousedown="${this.handleMouseDragStart}"
          @scroll="${this.handleScroll}"
          @scrollend=${this.handleScrollEnd}
        >
          <slot></slot>
        </div>

        ${this.navigation ? g`
              <div part="navigation" class="carousel__navigation">
                <button
                  part="navigation-button navigation-button--previous"
                  class="${p({
      "carousel__navigation-button": !0,
      "carousel__navigation-button--disabled": !t,
      "carousel__navigation-button--previous": !0
    })}"
                  aria-label="${this.localize.term("previousSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${t ? "false" : "true"}"
                  @click=${t ? () => this.previous() : null}
                >
                  <slot name="previous-icon">
                    <cx-icon
                      name="${a ? "chevron_left" : "chevron_right"}"
                    ></cx-icon>
                  </slot>
                </button>

                <button
                  part="navigation-button navigation-button--next"
                  class=${p({
      "carousel__navigation-button": !0,
      "carousel__navigation-button--disabled": !r,
      "carousel__navigation-button--next": !0
    })}
                  aria-label="${this.localize.term("nextSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${r ? "false" : "true"}"
                  @click=${r ? () => this.next() : null}
                >
                  <slot name="next-icon">
                    <cx-icon
                      name="${a ? "chevron_right" : "chevron_left"}"
                    ></cx-icon>
                  </slot>
                </button>
              </div>
            ` : ""}
        ${this.pagination ? g`
              <div
                part="pagination"
                role="tablist"
                class="carousel__pagination"
                aria-controls="scroll-container"
              >
                ${T(k(o), (d) => {
      const u = d === s;
      return g`
                    <button
                      part="pagination-item ${u ? "pagination-item--active" : ""}"
                      class="${p({
        "carousel__pagination-item": !0,
        "carousel__pagination-item--active": u
      })}"
                      role="tab"
                      aria-selected="${u ? "true" : "false"}"
                      aria-label="${this.localize.term(
        "goToSlide",
        d + 1,
        o
      )}"
                      tabindex=${u ? "0" : "-1"}
                      @click=${() => this.goToSlide(d * i)}
                      @keydown=${this.handleKeyDown}
                    ></button>
                  `;
    })}
              </div>
            ` : ""}
      </div>
    `;
  }
};
l.styles = [x, D];
l.dependencies = { "cx-icon": $ };
n([
  c({ reflect: !0, type: Boolean })
], l.prototype, "loop", 2);
n([
  c({ reflect: !0, type: Boolean })
], l.prototype, "navigation", 2);
n([
  c({ reflect: !0, type: Boolean })
], l.prototype, "pagination", 2);
n([
  c({ reflect: !0, type: Boolean })
], l.prototype, "autoplay", 2);
n([
  c({ attribute: "autoplay-interval", type: Number })
], l.prototype, "autoplayInterval", 2);
n([
  c({ attribute: "slides-per-page", type: Number })
], l.prototype, "slidesPerPage", 2);
n([
  c({ attribute: "slides-per-move", type: Number })
], l.prototype, "slidesPerMove", 2);
n([
  c()
], l.prototype, "orientation", 2);
n([
  c({ attribute: "mouse-dragging", reflect: !0, type: Boolean })
], l.prototype, "mouseDragging", 2);
n([
  b(".carousel__slides")
], l.prototype, "scrollContainer", 2);
n([
  b(".carousel__pagination")
], l.prototype, "paginationContainer", 2);
n([
  v()
], l.prototype, "activeSlide", 2);
n([
  v()
], l.prototype, "scrolling", 2);
n([
  v()
], l.prototype, "dragging", 2);
n([
  E({ passive: !0 })
], l.prototype, "handleScroll", 1);
n([
  h("loop", { waitUntilFirstUpdate: !0 }),
  h("slidesPerPage", { waitUntilFirstUpdate: !0 })
], l.prototype, "initializeSlides", 1);
n([
  h("activeSlide")
], l.prototype, "handelSlideChange", 1);
n([
  h("slidesPerMove")
], l.prototype, "updateSlidesSnap", 1);
n([
  h("autoplay")
], l.prototype, "handleAutoplayChange", 1);
l = n([
  w("cx-carousel")
], l);
export {
  l as default
};
