import { C } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as _ } from "../chunks/component.styles.BLcT4bOa.js";
import { c as y } from "../chunks/animate.c3HW4nwn.js";
import { w as x } from "../chunks/event.mFzZi4sr.js";
import { c as S } from "../chunks/math.DqTA6ya4.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as d } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { t as E } from "../chunks/event-options.CYHYGOd8.js";
import { e as P } from "../chunks/query.BNveAlQo.js";
import { e as p } from "../chunks/class-map.Cn0czwWq.js";
import { L as $ } from "../chunks/localize.DV9I313e.js";
import M from "./icon.component.js";
import { AutoplayController as A } from "./autoplay-controller.js";
import L from "./carousel.styles.js";
const T = (a, t) => {
  let o = 0;
  return function(...i) {
    window.clearTimeout(o), o = window.setTimeout(() => {
      a.call(this, ...i);
    }, t);
  };
}, b = (a, t, o) => {
  const i = a[t];
  a[t] = function(...e) {
    i.call(this, ...e), o.call(this, i, ...e);
  };
}, z = "onscrollend" in window;
if (!z) {
  const a = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new WeakMap(), o = (e) => {
    for (const s of e.changedTouches)
      a.add(s.identifier);
  }, i = (e) => {
    for (const s of e.changedTouches)
      a.delete(s.identifier);
  };
  document.addEventListener("touchstart", o, !0), document.addEventListener("touchend", i, !0), document.addEventListener("touchcancel", i, !0), b(
    EventTarget.prototype,
    "addEventListener",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    function(e, s) {
      if (s !== "scrollend") return;
      const r = T(() => {
        a.size ? r() : this.dispatchEvent(new Event("scrollend"));
      }, 100);
      e.call(this, "scroll", r, { passive: !0 }), t.set(this, r);
    }
  ), b(
    EventTarget.prototype,
    "removeEventListener",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    function(e, s) {
      if (s !== "scrollend") return;
      const r = t.get(this);
      r && e.call(this, "scroll", r, {
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
function* D(a, t) {
  if (a !== void 0) {
    let o = 0;
    for (const i of a) yield t(i, o++);
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* I(a, t, o = 1) {
  const i = t === void 0 ? 0 : a;
  t ?? (t = a);
  for (let e = i; o > 0 ? e < t : t < e; e += o) yield e;
}
var k = Object.defineProperty, N = Object.getOwnPropertyDescriptor, l = (a, t, o, i) => {
  for (var e = i > 1 ? void 0 : i ? N(t, o) : t, s = a.length - 1, r; s >= 0; s--)
    (r = a[s]) && (e = (i ? r(t, o, e) : r(e)) || e);
  return i && e && k(t, o, e), e;
};
const v = class v extends C {
  constructor() {
    super(...arguments), this.loop = !1, this.navigation = !1, this.pagination = !1, this.autoplay = !1, this.autoplayInterval = 3e3, this.slidesPerPage = 1, this.slidesPerMove = 1, this.orientation = "horizontal", this.mouseDragging = !1, this.activeSlide = 0, this.scrolling = !1, this.dragging = !1, this.autoplayController = new A(this, () => this.next()), this.localize = new $(this), this.handleMouseDrag = (t) => {
      this.dragging || (this.scrollContainer.style.setProperty("scroll-snap-type", "none"), this.dragging = !0), this.scrollContainer.scrollBy({
        behavior: "instant",
        left: -t.movementX,
        top: -t.movementY
      });
    }, this.handleMouseDragEnd = () => {
      const t = this.scrollContainer;
      document.removeEventListener("pointermove", this.handleMouseDrag, {
        capture: !0
      });
      const o = t.scrollLeft, i = t.scrollTop;
      t.style.removeProperty("scroll-snap-type"), t.style.setProperty("overflow", "hidden");
      const e = t.scrollLeft, s = t.scrollTop;
      t.style.removeProperty("overflow"), t.style.setProperty("scroll-snap-type", "none"), t.scrollTo({
        behavior: "instant",
        left: o,
        top: i
      }), requestAnimationFrame(async () => {
        (o !== e || i !== s) && (t.scrollTo({
          behavior: y() ? "auto" : "smooth",
          left: e,
          top: s
        }), await x(t, "scrollend")), t.style.removeProperty("scroll-snap-type"), this.dragging = !1, this.handleScrollEnd();
      });
    }, this.handleSlotChange = (t) => {
      t.some(
        (i) => [...i.addedNodes, ...i.removedNodes].some(
          (e) => this.isCarouselItem(e) && !e.hasAttribute("data-clone")
        )
      ) && this.initializeSlides(), this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "region"), this.setAttribute("aria-label", this.localize.term("carousel"));
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this.mutationObserver) == null || t.disconnect();
  }
  firstUpdated() {
    this.initializeSlides(), this.mutationObserver = new MutationObserver(this.handleSlotChange), this.mutationObserver.observe(this, {
      childList: !0,
      subtree: !0
    });
  }
  willUpdate(t) {
    (t.has("slidesPerMove") || t.has("slidesPerPage")) && (this.slidesPerMove = Math.min(this.slidesPerMove, this.slidesPerPage));
  }
  getPageCount() {
    const t = this.getSlides().length, { loop: o, slidesPerMove: i, slidesPerPage: e } = this, s = o ? t / i : (t - e) / i + 1;
    return Math.ceil(s);
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
    excludeClones: t = !0
  } = {}) {
    return [...this.children].filter(
      (o) => this.isCarouselItem(o) && (!t || !o.hasAttribute("data-clone"))
    );
  }
  handleKeyDown(t) {
    if ([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ].includes(t.key)) {
      const o = t.target, i = this.localize.dir() === "rtl", e = o.closest('[part~="pagination-item"]') !== null, s = t.key === "ArrowDown" || !i && t.key === "ArrowRight" || i && t.key === "ArrowLeft", r = t.key === "ArrowUp" || !i && t.key === "ArrowLeft" || i && t.key === "ArrowRight";
      t.preventDefault(), r && this.previous(), s && this.next(), t.key === "Home" && this.goToSlide(0), t.key === "End" && this.goToSlide(this.getSlides().length - 1), e && this.updateComplete.then(() => {
        var h;
        const c = (h = this.shadowRoot) == null ? void 0 : h.querySelector(
          '[part~="pagination-item--active"]'
        );
        c && c.focus();
      });
    }
  }
  handleMouseDragStart(t) {
    this.mouseDragging && t.button === 0 && (t.preventDefault(), document.addEventListener("pointermove", this.handleMouseDrag, {
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
    const t = new IntersectionObserver(
      (o) => {
        t.disconnect();
        for (const e of o) {
          const s = e.target;
          s.toggleAttribute("inert", !e.isIntersecting), s.classList.toggle("--in-view", e.isIntersecting), s.setAttribute(
            "aria-hidden",
            e.isIntersecting ? "false" : "true"
          );
        }
        const i = o.find((e) => e.isIntersecting);
        if (i)
          if (this.loop && i.target.hasAttribute("data-clone")) {
            const e = Number(
              i.target.getAttribute("data-clone")
            );
            this.goToSlide(e, "instant");
          } else {
            const s = this.getSlides().indexOf(
              i.target
            );
            this.activeSlide = Math.ceil(s / this.slidesPerMove) * this.slidesPerMove;
          }
      },
      {
        root: this.scrollContainer,
        threshold: 0.6
      }
    );
    this.getSlides({ excludeClones: !1 }).forEach((o) => {
      t.observe(o);
    });
  }
  handleScrollEnd() {
    !this.scrolling || this.dragging || (this.synchronizeSlides(), this.scrolling = !1);
  }
  isCarouselItem(t) {
    return t instanceof Element && t.tagName.toLowerCase() === "cx-carousel-item";
  }
  initializeSlides() {
    this.getSlides({ excludeClones: !1 }).forEach((t, o) => {
      t.classList.remove("--in-view"), t.classList.remove("--is-active"), t.setAttribute(
        "aria-label",
        this.localize.term("slideNum", o + 1)
      ), t.hasAttribute("data-clone") && t.remove();
    }), this.updateSlidesSnap(), this.loop && this.createClones(), this.synchronizeSlides(), this.goToSlide(this.activeSlide, "auto");
  }
  createClones() {
    const t = this.getSlides(), o = this.slidesPerPage, i = t.slice(-o), e = t.slice(0, o);
    i.reverse().forEach((s, r) => {
      const c = s.cloneNode(!0);
      c.setAttribute("data-clone", String(t.length - r - 1)), this.prepend(c);
    }), e.forEach((s, r) => {
      const c = s.cloneNode(!0);
      c.setAttribute("data-clone", String(r)), this.append(c);
    });
  }
  handelSlideChange() {
    const t = this.getSlides();
    t.forEach((o, i) => {
      o.classList.toggle("--is-active", i === this.activeSlide);
    }), this.hasUpdated && this.emit("cx-slide-change", {
      detail: {
        index: this.activeSlide,
        slide: t[this.activeSlide]
      }
    });
  }
  updateSlidesSnap() {
    const t = this.getSlides(), o = this.slidesPerMove;
    t.forEach((i, e) => {
      (e + o) % o === 0 ? i.style.removeProperty("scroll-snap-align") : i.style.setProperty("scroll-snap-align", "none");
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
  previous(t = "smooth") {
    this.goToSlide(this.activeSlide - this.slidesPerMove, t);
  }
  /**
   * Move the carousel forward by `slides-per-move` slides.
   *
   * @param behavior - The behavior used for scrolling.
   */
  next(t = "smooth") {
    this.goToSlide(this.activeSlide + this.slidesPerMove, t);
  }
  /**
   * Scrolls the carousel to the slide specified by `index`.
   *
   * @param index - The slide index.
   * @param behavior - The behavior used for scrolling.
   */
  goToSlide(t, o = "smooth") {
    const { loop: i, slidesPerPage: e } = this, s = this.getSlides(), r = this.getSlides({ excludeClones: !1 });
    if (!s.length)
      return;
    const c = i ? (t + s.length) % s.length : S(t, 0, s.length - e);
    this.activeSlide = c;
    const h = this.localize.dir() === "rtl", u = S(
      t + (i ? e : 0) + (h ? e - 1 : 0),
      0,
      r.length - 1
    ), w = r[u];
    this.scrollToSlide(w, y() ? "auto" : o);
  }
  scrollToSlide(t, o = "smooth") {
    const i = this.scrollContainer, e = i.getBoundingClientRect(), s = t.getBoundingClientRect(), r = s.left - e.left, c = s.top - e.top;
    i.scrollTo({
      behavior: o,
      left: r + i.scrollLeft,
      top: c + i.scrollTop
    });
  }
  render() {
    const { scrolling: t, slidesPerMove: o } = this, i = this.getPageCount(), e = this.getCurrentPage(), s = this.canScrollPrev(), r = this.canScrollNext(), c = this.localize.dir() === "ltr";
    return f`
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
          aria-busy="${t ? "true" : "false"}"
          aria-atomic="true"
          tabindex="0"
          @keydown=${this.handleKeyDown}
          @mousedown="${this.handleMouseDragStart}"
          @scroll="${this.handleScroll}"
          @scrollend=${this.handleScrollEnd}
        >
          <slot></slot>
        </div>

        ${this.navigation ? f`
              <div part="navigation" class="carousel__navigation">
                <button
                  part="navigation-button navigation-button--previous"
                  class="${p({
      "carousel__navigation-button": !0,
      "carousel__navigation-button--disabled": !s,
      "carousel__navigation-button--previous": !0
    })}"
                  aria-label="${this.localize.term("previousSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${s ? "false" : "true"}"
                  @click=${s ? () => this.previous() : null}
                >
                  <slot name="previous-icon">
                    <cx-icon
                      name="${c ? "chevron_left" : "chevron_right"}"
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
                      name="${c ? "chevron_right" : "chevron_left"}"
                    ></cx-icon>
                  </slot>
                </button>
              </div>
            ` : ""}
        ${this.pagination ? f`
              <div
                part="pagination"
                role="tablist"
                class="carousel__pagination"
                aria-controls="scroll-container"
              >
                ${D(I(i), (h) => {
      const u = h === e;
      return f`
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
        h + 1,
        i
      )}"
                      tabindex=${u ? "0" : "-1"}
                      @click=${() => this.goToSlide(h * o)}
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
v.styles = [_, L], v.dependencies = { "cx-icon": M };
let n = v;
l([
  d({ reflect: !0, type: Boolean })
], n.prototype, "loop", 2);
l([
  d({ reflect: !0, type: Boolean })
], n.prototype, "navigation", 2);
l([
  d({ reflect: !0, type: Boolean })
], n.prototype, "pagination", 2);
l([
  d({ reflect: !0, type: Boolean })
], n.prototype, "autoplay", 2);
l([
  d({ attribute: "autoplay-interval", type: Number })
], n.prototype, "autoplayInterval", 2);
l([
  d({ attribute: "slides-per-page", type: Number })
], n.prototype, "slidesPerPage", 2);
l([
  d({ attribute: "slides-per-move", type: Number })
], n.prototype, "slidesPerMove", 2);
l([
  d()
], n.prototype, "orientation", 2);
l([
  d({ attribute: "mouse-dragging", reflect: !0, type: Boolean })
], n.prototype, "mouseDragging", 2);
l([
  P(".carousel__slides")
], n.prototype, "scrollContainer", 2);
l([
  P(".carousel__pagination")
], n.prototype, "paginationContainer", 2);
l([
  m()
], n.prototype, "activeSlide", 2);
l([
  m()
], n.prototype, "scrolling", 2);
l([
  m()
], n.prototype, "dragging", 2);
l([
  E({ passive: !0 })
], n.prototype, "handleScroll", 1);
l([
  g("loop", { waitUntilFirstUpdate: !0 }),
  g("slidesPerPage", { waitUntilFirstUpdate: !0 })
], n.prototype, "initializeSlides", 1);
l([
  g("activeSlide")
], n.prototype, "handelSlideChange", 1);
l([
  g("slidesPerMove")
], n.prototype, "updateSlidesSnap", 1);
l([
  g("autoplay")
], n.prototype, "handleAutoplayChange", 1);
export {
  n as default
};
