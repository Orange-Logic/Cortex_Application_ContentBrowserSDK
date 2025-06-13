import { C as ir, c as lr } from "../chunks/custom-element.X6y1saJZ.js";
import { c as dr } from "../chunks/component.styles.BLcT4bOa.js";
import { i as zs, x as Ze } from "../chunks/lit-element.DRlPF2me.js";
import { a as ro, s as Do } from "../chunks/animate.c3HW4nwn.js";
import { w as Ge } from "../chunks/event.mFzZi4sr.js";
import { M as pr } from "../chunks/modal.OAmlKOKq.js";
import { l as Je, u as ts } from "../chunks/scroll.DwPiX2Ox.js";
import { H as ur } from "../chunks/slot.DJLm4Dig.js";
import { w as fr } from "../chunks/watch.ChG-_stu.js";
import { n as ho } from "../chunks/property.CtZ87in4.js";
import { e as bo } from "../chunks/query.BNveAlQo.js";
import { e as vr } from "../chunks/class-map.Cn0czwWq.js";
import { o as os } from "../chunks/if-defined.D8U9hdvp.js";
import { a as go, g as no } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as hr } from "../chunks/localize.D5Yoww6T.js";
import br from "./divider.js";
import gr from "./icon-button.js";
const yr = zs`
  .os-size-observer,
  .os-size-observer-listener {
    scroll-behavior: auto !important;
    direction: inherit;
    pointer-events: none;
    overflow: hidden;
    visibility: hidden;
    box-sizing: border-box;
  }

  .os-size-observer,
  .os-size-observer-listener,
  .os-size-observer-listener-item,
  .os-size-observer-listener-item-final {
    writing-mode: horizontal-tb;
    position: absolute;
    left: 0;
    top: 0;
  }

  .os-size-observer {
    z-index: -1;
    contain: strict;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: inherit;
    border: inherit;
    box-sizing: inherit;
    margin: -133px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale(0.1);
  }
  .os-size-observer::before {
    content: '';
    flex: none;
    box-sizing: inherit;
    padding: 10px;
    width: 10px;
    height: 10px;
  }

  .os-size-observer-appear {
    animation: os-size-observer-appear-animation 1ms forwards;
  }

  .os-size-observer-listener {
    box-sizing: border-box;
    position: relative;
    flex: auto;
    padding: inherit;
    border: inherit;
    margin: -133px;
    transform: scale(calc(1 / 0.1));
  }
  .os-size-observer-listener.ltr {
    margin-right: -266px;
    margin-left: 0;
  }
  .os-size-observer-listener.rtl {
    margin-left: -266px;
    margin-right: 0;
  }
  .os-size-observer-listener:empty::before {
    content: '';
    width: 100%;
    height: 100%;
  }
  .os-size-observer-listener:empty::before,
  .os-size-observer-listener > .os-size-observer-listener-item {
    display: block;
    position: relative;
    padding: inherit;
    border: inherit;
    box-sizing: content-box;
    flex: auto;
  }

  .os-size-observer-listener-scroll {
    box-sizing: border-box;
    display: flex;
  }

  .os-size-observer-listener-item {
    right: 0;
    bottom: 0;
    overflow: hidden;
    direction: ltr;
    flex: none;
  }

  .os-size-observer-listener-item-final {
    transition: none;
  }

  @keyframes os-size-observer-appear-animation {
    from {
      cursor: auto;
    }
    to {
      cursor: none;
    }
  }
  .os-trinsic-observer {
    flex: none;
    box-sizing: border-box;
    position: relative;
    max-width: 0px;
    max-height: 1px;
    padding: 0;
    margin: 0;
    border: none;
    overflow: hidden;
    z-index: -1;
    height: 0;
    top: calc(100% + 1px);
    contain: strict;
  }
  .os-trinsic-observer:not(:empty) {
    height: calc(100% + 1px);
    top: -1px;
  }
  .os-trinsic-observer:not(:empty) > .os-size-observer {
    width: 1000%;
    height: 1000%;
    min-height: 1px;
    min-width: 1px;
  }

  /**
 * hide native scrollbars
 * changes to this styles need to be reflected in the environment styles to correctly detect scrollbar hiding
 */
  [data-overlayscrollbars-initialize]:not([data-overlayscrollbars-viewport]),
  [data-overlayscrollbars-viewport~='scrollbarHidden'] {
    scrollbar-width: none !important;
  }

  [data-overlayscrollbars-initialize]:not(
      [data-overlayscrollbars-viewport]
    )::-webkit-scrollbar,
  [data-overlayscrollbars-initialize]:not(
      [data-overlayscrollbars-viewport]
    )::-webkit-scrollbar-corner,
  [data-overlayscrollbars-viewport~='scrollbarHidden']::-webkit-scrollbar,
  [data-overlayscrollbars-viewport~='scrollbarHidden']::-webkit-scrollbar-corner {
    -webkit-appearance: none !important;
    appearance: none !important;
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  [data-overlayscrollbars-initialize]:not([data-overlayscrollbars]):not(
      html
    ):not(body) {
    overflow: auto;
  }

  /**
 * body element
 */
  html[data-overlayscrollbars-body] {
    overflow: hidden;
  }

  html[data-overlayscrollbars-body],
  html[data-overlayscrollbars-body] > body {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  html[data-overlayscrollbars-body] > body {
    overflow: visible;
    margin: 0;
  }

  /**
 * structure setup
 */
  [data-overlayscrollbars] {
    position: relative;
  }

  [data-overlayscrollbars~='host'],
  [data-overlayscrollbars-padding] {
    display: flex;
    align-items: stretch !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    scroll-behavior: auto !important;
  }

  [data-overlayscrollbars-padding],
  [data-overlayscrollbars-viewport]:not([data-overlayscrollbars]) {
    box-sizing: inherit;
    position: relative;
    flex: auto;
    height: auto;
    width: 100%;
    min-width: 0;
    padding: 0;
    margin: 0;
    border: none;
    z-index: 0;
  }

  [data-overlayscrollbars-viewport]:not([data-overlayscrollbars]) {
    --os-vaw: 0;
    --os-vah: 0;
    outline: none;
  }
  [data-overlayscrollbars-viewport]:not([data-overlayscrollbars]):focus {
    outline: none;
  }
  [data-overlayscrollbars-viewport][data-overlayscrollbars-viewport~='arrange']::before {
    content: '';
    position: absolute;
    pointer-events: none;
    z-index: -1;
    min-width: 1px;
    min-height: 1px;
    width: var(--os-vaw);
    height: var(--os-vah);
  }

  /**
 * wrapper elements overflow:
 */
  [data-overlayscrollbars~='host'],
  [data-overlayscrollbars-padding] {
    overflow: hidden !important;
  }

  [data-overlayscrollbars~='host'][data-overlayscrollbars~='noClipping'],
  [data-overlayscrollbars-padding~='noClipping'] {
    overflow: visible !important;
  }

  /**
 * viewport overflow:
 */
  [data-overlayscrollbars-viewport] {
    --os-viewport-overflow-x: hidden;
    --os-viewport-overflow-y: hidden;
    overflow-x: var(--os-viewport-overflow-x);
    overflow-y: var(--os-viewport-overflow-y);
  }

  [data-overlayscrollbars-viewport~='overflowXVisible'] {
    --os-viewport-overflow-x: visible;
  }

  [data-overlayscrollbars-viewport~='overflowXHidden'] {
    --os-viewport-overflow-x: hidden;
  }

  [data-overlayscrollbars-viewport~='overflowXScroll'] {
    --os-viewport-overflow-x: scroll;
  }

  [data-overlayscrollbars-viewport~='overflowYVisible'] {
    --os-viewport-overflow-y: visible;
  }

  [data-overlayscrollbars-viewport~='overflowYHidden'] {
    --os-viewport-overflow-y: hidden;
  }

  [data-overlayscrollbars-viewport~='overflowYScroll'] {
    --os-viewport-overflow-y: scroll;
  }

  [data-overlayscrollbars-viewport~='overflowImportant'] {
    overflow-x: var(--os-viewport-overflow-x) !important;
    overflow-y: var(--os-viewport-overflow-y) !important;
  }

  /**
 * viewport state modifiers:
 */
  [data-overlayscrollbars-viewport~='noContent']:not(#osFakeId) {
    font-size: 0 !important;
    line-height: 0 !important;
  }

  [data-overlayscrollbars-viewport~='noContent']:not(#osFakeId)::before,
  [data-overlayscrollbars-viewport~='noContent']:not(#osFakeId)::after,
  [data-overlayscrollbars-viewport~='noContent']:not(#osFakeId) > * {
    display: none !important;
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border-width: 0 !important;
  }

  [data-overlayscrollbars-viewport~='measuring'],
  [data-overlayscrollbars-viewport~='scrolling'] {
    scroll-behavior: auto !important;
    scroll-snap-type: none !important;
  }

  [data-overlayscrollbars-viewport~='measuring'][data-overlayscrollbars-viewport~='overflowXVisible'] {
    overflow-x: hidden !important;
  }

  [data-overlayscrollbars-viewport~='measuring'][data-overlayscrollbars-viewport~='overflowYVisible'] {
    overflow-y: hidden !important;
  }

  /**
 * content element:
 */
  [data-overlayscrollbars-content] {
    box-sizing: inherit;
  }

  /**
 * Display contents to bridge any flickering during deferred initialization.
 */
  [data-overlayscrollbars-contents]:not(#osFakeId):not(
      [data-overlayscrollbars-padding]
    ):not([data-overlayscrollbars-viewport]):not(
      [data-overlayscrollbars-content]
    ) {
    display: contents;
  }

  /**
 * optional & experimental grid mode
 */
  [data-overlayscrollbars-grid],
  [data-overlayscrollbars-grid] [data-overlayscrollbars-padding] {
    display: grid;
    grid-template: 1fr/1fr;
  }

  [data-overlayscrollbars-grid] > [data-overlayscrollbars-padding],
  [data-overlayscrollbars-grid] > [data-overlayscrollbars-viewport],
  [data-overlayscrollbars-grid]
    > [data-overlayscrollbars-padding]
    > [data-overlayscrollbars-viewport] {
    height: auto !important;
    width: auto !important;
  }

  @property --os-scroll-percent {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }
  @property --os-viewport-percent {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }
  .os-scrollbar {
    --os-viewport-percent: 0;
    --os-scroll-percent: 0;
    --os-scroll-direction: 0;
    --os-scroll-percent-directional: calc(
      var(--os-scroll-percent) -
        (var(--os-scroll-percent) + (1 - var(--os-scroll-percent)) * -1) *
        var(--os-scroll-direction)
    );
  }

  .os-scrollbar {
    contain: size layout;
    contain: size layout style;
    transition:
      opacity 0.15s,
      visibility 0.15s,
      top 0.15s,
      right 0.15s,
      bottom 0.15s,
      left 0.15s;
    pointer-events: none;
    position: absolute;
    opacity: 0;
    visibility: hidden;
  }

  body > .os-scrollbar {
    position: fixed;
    z-index: 99999;
  }

  .os-scrollbar-transitionless {
    transition: none !important;
  }

  .os-scrollbar-track {
    position: relative;
    padding: 0 !important;
    border: none !important;
  }

  .os-scrollbar-handle {
    position: absolute;
  }

  .os-scrollbar-track,
  .os-scrollbar-handle {
    pointer-events: none;
    width: 100%;
    height: 100%;
  }

  .os-scrollbar.os-scrollbar-track-interactive .os-scrollbar-track,
  .os-scrollbar.os-scrollbar-handle-interactive .os-scrollbar-handle {
    pointer-events: auto;
    touch-action: none;
  }

  .os-scrollbar-horizontal {
    bottom: 0;
    left: 0;
  }

  .os-scrollbar-vertical {
    top: 0;
    right: 0;
  }

  .os-scrollbar-rtl.os-scrollbar-horizontal {
    right: 0;
  }

  .os-scrollbar-rtl.os-scrollbar-vertical {
    right: auto;
    left: 0;
  }

  .os-scrollbar-visible {
    opacity: 1;
    visibility: visible;
  }

  .os-scrollbar-auto-hide.os-scrollbar-auto-hide-hidden {
    opacity: 0;
    visibility: hidden;
  }

  .os-scrollbar-interaction.os-scrollbar-visible {
    opacity: 1;
    visibility: visible;
  }

  .os-scrollbar-unusable,
  .os-scrollbar-unusable *,
  .os-scrollbar-wheel,
  .os-scrollbar-wheel * {
    pointer-events: none !important;
  }

  .os-scrollbar-unusable .os-scrollbar-handle {
    opacity: 0 !important;
    transition: none !important;
  }

  .os-scrollbar-horizontal .os-scrollbar-handle {
    bottom: 0;
    left: calc(var(--os-scroll-percent-directional) * 100%);
    transform: translateX(calc(var(--os-scroll-percent-directional) * -100%));
    width: calc(var(--os-viewport-percent) * 100%);
  }

  .os-scrollbar-vertical .os-scrollbar-handle {
    right: 0;
    top: calc(var(--os-scroll-percent-directional) * 100%);
    transform: translateY(calc(var(--os-scroll-percent-directional) * -100%));
    height: calc(var(--os-viewport-percent) * 100%);
  }

  @supports (container-type: size) {
    .os-scrollbar-track {
      container-type: size;
    }
    .os-scrollbar-horizontal .os-scrollbar-handle {
      left: auto;
      transform: translateX(
        calc(
          var(--os-scroll-percent-directional) * 100cqw +
            var(--os-scroll-percent-directional) * -100%
        )
      );
    }
    .os-scrollbar-vertical .os-scrollbar-handle {
      top: auto;
      transform: translateY(
        calc(
          var(--os-scroll-percent-directional) * 100cqh +
            var(--os-scroll-percent-directional) * -100%
        )
      );
    }
    .os-scrollbar-rtl.os-scrollbar-horizontal .os-scrollbar-handle {
      right: auto;
      left: 0;
    }
  }
  .os-scrollbar-rtl.os-scrollbar-vertical .os-scrollbar-handle {
    right: auto;
    left: 0;
  }

  .os-scrollbar.os-scrollbar-horizontal.os-scrollbar-cornerless,
  .os-scrollbar.os-scrollbar-horizontal.os-scrollbar-cornerless.os-scrollbar-rtl {
    left: 0;
    right: 0;
  }

  .os-scrollbar.os-scrollbar-vertical.os-scrollbar-cornerless,
  .os-scrollbar.os-scrollbar-vertical.os-scrollbar-cornerless.os-scrollbar-rtl {
    top: 0;
    bottom: 0;
  }

  @media print {
    .os-scrollbar {
      display: none;
    }
  }
  .os-scrollbar {
    --os-size: 10px;
    --os-padding-perpendicular: 4px;
    --os-padding-axis: 2px;
    --os-track-border-radius: 10px;
    --os-track-bg: none;
    --os-track-bg-hover: none;
    --os-track-bg-active: none;
    --os-track-border: none;
    --os-track-border-hover: none;
    --os-track-border-active: none;
    --os-handle-border-radius: 13px;
    --os-handle-bg: var(--cx-color-neutral-400);
    --os-handle-bg-hover: var(--cx-color-neutral-500);
    --os-handle-bg-active: var(--cx-color-neutral-500);
    --os-handle-border: 4px solid rgba(0, 0, 0, 0);
    --os-handle-border-hover: 4px solid rgba(0, 0, 0, 0);
    --os-handle-border-active: 4px solid rgba(0, 0, 0, 0);
    --os-handle-min-size: 50px;
    --os-handle-max-size: none;
    --os-handle-perpendicular-size: 100%;
    --os-handle-perpendicular-size-hover: 100%;
    --os-handle-perpendicular-size-active: 100%;
    --os-handle-interactive-area-offset: 4px;
  }

  .os-scrollbar-track {
    border: var(--os-track-border);
    border-radius: var(--os-track-border-radius);
    background: var(--os-track-bg);
    transition:
      opacity 0.15s,
      background-color 0.15s,
      border-color 0.15s;
  }
  .os-scrollbar-track:hover {
    border: var(--os-track-border-hover);
    background: var(--os-track-bg-hover);
  }
  .os-scrollbar-track:active {
    border: var(--os-track-border-active);
    background: var(--os-track-bg-active);
  }

  .os-scrollbar-handle {
    border: var(--os-handle-border);
    border-radius: var(--os-handle-border-radius);
    background: var(--os-handle-bg);
  }
  .os-scrollbar-handle:hover {
    background: var(--os-handle-bg-hover);
    border: var(--os-handle-border-hover);
  }
  .os-scrollbar-handle:active {
    border: var(--os-handle-border-active);
    background: var(--os-handle-bg-active);
  }

  .os-scrollbar-track:before,
  .os-scrollbar-handle:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
  }

  .os-scrollbar-horizontal {
    padding: var(--os-padding-perpendicular) var(--os-padding-axis);
    right: var(--os-size);
    height: var(--os-size);
  }
  .os-scrollbar-horizontal.os-scrollbar-rtl {
    left: var(--os-size);
    right: 0;
  }
  .os-scrollbar-horizontal .os-scrollbar-track:before {
    top: calc(var(--os-padding-perpendicular) * -1);
    bottom: calc(var(--os-padding-perpendicular) * -1);
  }
  .os-scrollbar-horizontal .os-scrollbar-handle {
    min-width: var(--os-handle-min-size);
    max-width: var(--os-handle-max-size);
    height: var(--os-handle-perpendicular-size);
    transition:
      opacity 0.15s,
      background-color 0.15s,
      border-color 0.15s,
      height 0.15s;
  }
  .os-scrollbar-horizontal .os-scrollbar-handle:before {
    top: calc(
      (
          var(--os-padding-perpendicular) +
            var(--os-handle-interactive-area-offset)
        ) *
        -1
    );
    bottom: calc(var(--os-padding-perpendicular) * -1);
  }
  .os-scrollbar-horizontal:hover .os-scrollbar-handle {
    height: var(--os-handle-perpendicular-size-hover);
  }
  .os-scrollbar-horizontal:active .os-scrollbar-handle {
    height: var(--os-handle-perpendicular-size-active);
  }

  .os-scrollbar-vertical {
    padding: var(--os-padding-axis) var(--os-padding-perpendicular);
    bottom: var(--os-size);
    width: var(--os-size);
  }
  .os-scrollbar-vertical .os-scrollbar-track:before {
    left: calc(var(--os-padding-perpendicular) * -1);
    right: calc(var(--os-padding-perpendicular) * -1);
  }
  .os-scrollbar-vertical .os-scrollbar-handle {
    min-height: var(--os-handle-min-size);
    max-height: var(--os-handle-max-size);
    width: var(--os-handle-perpendicular-size);
    transition:
      opacity 0.15s,
      background-color 0.15s,
      border-color 0.15s,
      width 0.15s;
  }
  .os-scrollbar-vertical .os-scrollbar-handle:before {
    left: calc(
      (
          var(--os-padding-perpendicular) +
            var(--os-handle-interactive-area-offset)
        ) *
        -1
    );
    right: calc(var(--os-padding-perpendicular) * -1);
  }
  .os-scrollbar-vertical.os-scrollbar-rtl .os-scrollbar-handle:before {
    right: calc(
      (
          var(--os-padding-perpendicular) +
            var(--os-handle-interactive-area-offset)
        ) *
        -1
    );
    left: calc(var(--os-padding-perpendicular) * -1);
  }
  .os-scrollbar-vertical:hover .os-scrollbar-handle {
    width: var(--os-handle-perpendicular-size-hover);
  }
  .os-scrollbar-vertical:active .os-scrollbar-handle {
    width: var(--os-handle-perpendicular-size-active);
  }

  /* NONE THEME: */
  [data-overlayscrollbars-viewport~='measuring'] > .os-scrollbar,
  .os-theme-none.os-scrollbar {
    display: none !important;
  }

  /* DARK & LIGHT THEME: */
  .os-theme-dark,
  .os-theme-light {
    box-sizing: border-box;
    --os-size: 10px;
    --os-padding-perpendicular: 4px;
    --os-padding-axis: 2px;
    --os-track-border-radius: 10px;
    --os-handle-interactive-area-offset: 4px;
    --os-handle-border-radius: 10px;
  }
`;
/*!
 * OverlayScrollbars
 * Version: 2.11.4
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const ht = (t, o) => {
  const { o: e, i: s, u: r } = t;
  let n = e, a;
  const l = (c, p) => {
    const y = n, m = c, d = p || (s ? !s(y, m) : y !== m);
    return (d || r) && (n = m, a = y), [n, d, a];
  };
  return [o ? (c) => l(o(n, a), c) : l, (c) => [n, !!c, a]];
}, mr = typeof window < "u" && typeof HTMLElement < "u" && !!window.document, vt = mr ? window : {}, Ro = Math.max, wr = Math.min, ve = Math.round, No = Math.abs, es = Math.sign, Ko = vt.cancelAnimationFrame, Qt = vt.requestAnimationFrame, $e = vt.setTimeout, Cs = vt.clearTimeout, Qo = (t) => typeof vt[t] < "u" ? vt[t] : void 0, xr = Qo("MutationObserver"), ss = Qo("IntersectionObserver"), jt = Qo("ResizeObserver"), ao = Qo("ScrollTimeline"), Oe = (t) => t === void 0, Zo = (t) => t === null, Ht = (t) => typeof t == "number", yo = (t) => typeof t == "string", Go = (t) => typeof t == "boolean", xt = (t) => typeof t == "function", _t = (t) => Array.isArray(t), Bo = (t) => typeof t == "object" && !_t(t) && !Zo(t), Ae = (t) => {
  const o = !!t && t.length, e = Ht(o) && o > -1 && o % 1 == 0;
  return _t(t) || !xt(t) && e ? o > 0 && Bo(t) ? o - 1 in t : !0 : !1;
}, qo = (t) => !!t && t.constructor === Object, Uo = (t) => t instanceof HTMLElement, Jo = (t) => t instanceof Element, rs = () => performance.now(), ie = (t, o, e, s, r) => {
  let n = 0;
  const a = rs(), l = Ro(0, e), i = (u) => {
    const c = rs(), y = c - a >= l, m = u ? 1 : 1 - (Ro(0, a + l - c) / l || 0), d = (o - t) * (xt(r) ? r(m, m * l, 0, 1, l) : m) + t, $ = y || m === 1;
    s && s(d, m, $), n = $ ? 0 : Qt(() => i());
  };
  return i(), (u) => {
    Ko(n), u && i(u);
  };
};
function K(t, o) {
  if (Ae(t))
    for (let e = 0; e < t.length && o(t[e], e, t) !== !1; e++)
      ;
  else t && K(Object.keys(t), (e) => o(t[e], e, t));
  return t;
}
const _s = (t, o) => t.indexOf(o) >= 0, fo = (t, o) => t.concat(o), et = (t, o, e) => (!yo(o) && Ae(o) ? Array.prototype.push.apply(t, o) : t.push(o), t), Vt = (t) => Array.from(t || []), Ee = (t) => _t(t) ? t : !yo(t) && Ae(t) ? Vt(t) : [t], jo = (t) => !!t && !t.length, he = (t) => Vt(new Set(t)), gt = (t, o, e) => {
  K(t, (r) => r ? r.apply(void 0, o || []) : !0), e || (t.length = 0);
}, Te = "paddingTop", co = "paddingRight", io = "paddingLeft", lo = "paddingBottom", po = "marginLeft", uo = "marginRight", Wt = "marginBottom", He = "overflowX", De = "overflowY", Gt = "width", mo = "height", Tt = "visible", Ct = "hidden", Ft = "scroll", Sr = (t) => {
  const o = String(t || "");
  return o ? o[0].toUpperCase() + o.slice(1) : "";
}, te = (t, o, e, s) => {
  if (t && o) {
    let r = !0;
    return K(e, (n) => {
      const a = t[n], l = o[n];
      a !== l && (r = !1);
    }), r;
  }
  return !1;
}, Me = (t, o) => te(t, o, ["w", "h"]), Lo = (t, o) => te(t, o, ["x", "y"]), zr = (t, o) => te(t, o, ["t", "r", "b", "l"]), L = (t, ...o) => t.bind(0, ...o), Nt = (t) => {
  let o;
  const e = t ? $e : Qt, s = t ? Cs : Ko;
  return [(r) => {
    s(o), o = e(() => r(), xt(t) ? t() : t);
  }, () => s(o)];
}, ns = (t) => {
  const o = xt(t) ? t() : t;
  if (Ht(o)) {
    const e = o ? $e : Qt, s = o ? Cs : Ko;
    return (r) => {
      const n = e(() => r(), o);
      return () => {
        s(n);
      };
    };
  }
  return o && o._;
}, Wo = (t, o) => {
  const { p: e, v: s, S: r, m: n } = o || {};
  let a, l, i, u, c;
  const p = function(O) {
    l && l(), a && a(), c = l = a = i = void 0, t.apply(this, O);
  }, y = ($) => n && i ? n(i, $) : $, m = () => {
    l && p(y(u) || u);
  }, d = function() {
    const O = Vt(arguments), g = ns(e);
    if (g) {
      const S = ns(s), b = y(O) || O, A = p.bind(0, b);
      l && l(), r && !c ? (A(), c = !0, l = g(() => c = void 0)) : (l = g(A), S && !a && (a = S(m))), i = u = b;
    } else
      p(O);
  };
  return d.O = m, d;
}, ks = (t, o) => Object.prototype.hasOwnProperty.call(t, o), wt = (t) => t ? Object.keys(t) : [], j = (t, o, e, s, r, n, a) => {
  const l = [o, e, s, r, n, a];
  return (typeof t != "object" || Zo(t)) && !xt(t) && (t = {}), K(l, (i) => {
    K(i, (u, c) => {
      const p = i[c];
      if (t === p)
        return !0;
      const y = _t(p);
      if (p && qo(p)) {
        const m = t[c];
        let d = m;
        y && !_t(m) ? d = [] : !y && !qo(m) && (d = {}), t[c] = j(d, p);
      } else
        t[c] = y ? p.slice() : p;
    });
  }), t;
}, $s = (t, o) => K(j({}, t), (e, s, r) => {
  e === void 0 ? delete r[s] : e && qo(e) && (r[s] = $s(e));
}), Pe = (t) => !wt(t).length, qt = () => {
}, Os = (t, o, e) => Ro(t, wr(o, e)), Bt = (t) => he((_t(t) ? t : (t || "").split(" ")).filter((o) => o)), Le = (t, o) => t && t.getAttribute(o), as = (t, o) => t && t.hasAttribute(o), Et = (t, o, e) => {
  K(Bt(o), (s) => {
    t && t.setAttribute(s, String(e || ""));
  });
}, $t = (t, o) => {
  K(Bt(o), (e) => t && t.removeAttribute(e));
}, oe = (t, o) => {
  const e = Bt(Le(t, o)), s = L(Et, t, o), r = (n, a) => {
    const l = new Set(e);
    return K(Bt(n), (i) => {
      l[a](i);
    }), Vt(l).join(" ");
  };
  return {
    $: (n) => s(r(n, "delete")),
    C: (n) => s(r(n, "add")),
    H: (n) => {
      const a = Bt(n);
      return a.reduce((l, i) => l && e.includes(i), a.length > 0);
    }
  };
}, Ie = (t, o, e) => (oe(t, o).$(e), L(Fe, t, o, e)), Fe = (t, o, e) => (oe(t, o).C(e), L(Ie, t, o, e)), Yo = (t, o, e, s) => (s ? Fe : Ie)(t, o, e), Ve = (t, o, e) => oe(t, o).H(e), As = (t) => oe(t, "class"), Es = (t, o) => {
  As(t).$(o);
}, ee = (t, o) => (As(t).C(o), L(Es, t, o)), Ts = (t, o) => {
  const e = o ? Jo(o) && o : document;
  return e ? Vt(e.querySelectorAll(t)) : [];
}, Cr = (t, o) => {
  const e = o ? Jo(o) && o : document;
  return e && e.querySelector(t);
}, be = (t, o) => Jo(t) && t.matches(o), Hs = (t) => be(t, "body"), ge = (t) => t ? Vt(t.childNodes) : [], vo = (t) => t && t.parentElement, Yt = (t, o) => Jo(t) && t.closest(o), ye = (t) => document.activeElement, _r = (t, o, e) => {
  const s = Yt(t, o), r = t && Cr(e, s), n = Yt(r, o) === s;
  return s && r ? s === t || r === t || n && Yt(Yt(t, e), o) !== s : !1;
}, Zt = (t) => {
  K(Ee(t), (o) => {
    const e = vo(o);
    o && e && e.removeChild(o);
  });
}, ut = (t, o) => L(Zt, t && o && K(Ee(o), (e) => {
  e && t.appendChild(e);
}));
let Ds;
const kr = () => Ds, $r = (t) => {
  Ds = t;
}, Kt = (t) => {
  const o = document.createElement("div");
  return Et(o, "class", t), o;
}, Re = (t) => {
  const o = Kt(), e = kr(), s = t.trim();
  return o.innerHTML = e ? e.createHTML(s) : s, K(ge(o), (r) => Zt(r));
}, cs = (t, o) => t.getPropertyValue(o) || t[o] || "", Ms = (t) => {
  const o = t || 0;
  return isFinite(o) ? o : 0;
}, Mo = (t) => Ms(parseFloat(t || "")), me = (t) => Math.round(t * 1e4) / 1e4, Ps = (t) => `${me(Ms(t))}px`;
function Dt(t, o) {
  t && o && K(o, (e, s) => {
    try {
      const r = t.style, n = Zo(e) || Go(e) ? "" : Ht(e) ? Ps(e) : e;
      s.indexOf("--") === 0 ? r.setProperty(s, n) : r[s] = n;
    } catch {
    }
  });
}
function kt(t, o, e) {
  const s = yo(o);
  let r = s ? "" : {};
  if (t) {
    const n = vt.getComputedStyle(t, e) || t.style;
    r = s ? cs(n, o) : Vt(o).reduce((a, l) => (a[l] = cs(n, l), a), r);
  }
  return r;
}
const is = (t, o, e) => {
  const s = o ? `${o}-` : "", r = e ? `-${e}` : "", n = `${s}top${r}`, a = `${s}right${r}`, l = `${s}bottom${r}`, i = `${s}left${r}`, u = kt(t, [n, a, l, i]);
  return {
    t: Mo(u[n]),
    r: Mo(u[a]),
    b: Mo(u[l]),
    l: Mo(u[i])
  };
}, le = (t, o) => `translate${Bo(t) ? `(${t.x},${t.y})` : `${o ? "X" : "Y"}(${t})`}`, Or = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), Ar = {
  w: 0,
  h: 0
}, se = (t, o) => o ? {
  w: o[`${t}Width`],
  h: o[`${t}Height`]
} : Ar, Er = (t) => se("inner", t || vt), Lt = L(se, "offset"), Ls = L(se, "client"), Xo = L(se, "scroll"), Ne = (t) => {
  const o = parseFloat(kt(t, Gt)) || 0, e = parseFloat(kt(t, mo)) || 0;
  return {
    w: o - ve(o),
    h: e - ve(e)
  };
}, de = (t) => t.getBoundingClientRect(), Tr = (t) => !!t && Or(t), we = (t) => !!(t && (t[mo] || t[Gt])), Is = (t, o) => {
  const e = we(t);
  return !we(o) && e;
}, ls = (t, o, e, s) => {
  K(Bt(o), (r) => {
    t && t.removeEventListener(r, e, s);
  });
}, Z = (t, o, e, s) => {
  var r;
  const n = (r = s && s.T) != null ? r : !0, a = s && s.I || !1, l = s && s.A || !1, i = {
    passive: n,
    capture: a
  };
  return L(gt, Bt(o).map((u) => {
    const c = l ? (p) => {
      ls(t, u, c, a), e && e(p);
    } : e;
    return t && t.addEventListener(u, c, i), L(ls, t, u, c, a);
  }));
}, Be = (t) => t.stopPropagation(), xe = (t) => t.preventDefault(), Fs = (t) => Be(t) || xe(t), mt = (t, o) => {
  const { x: e, y: s } = Ht(o) ? {
    x: o,
    y: o
  } : o || {};
  Ht(e) && (t.scrollLeft = e), Ht(s) && (t.scrollTop = s);
}, bt = (t) => ({
  x: t.scrollLeft,
  y: t.scrollTop
}), Vs = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
}), Hr = (t, o) => {
  const { D: e, M: s } = t, { w: r, h: n } = o, a = (p, y, m) => {
    let d = es(p) * m, $ = es(y) * m;
    if (d === $) {
      const O = No(p), g = No(y);
      $ = O > g ? 0 : $, d = O < g ? 0 : d;
    }
    return d = d === $ ? 0 : d, [d + 0, $ + 0];
  }, [l, i] = a(e.x, s.x, r), [u, c] = a(e.y, s.y, n);
  return {
    D: {
      x: l,
      y: u
    },
    M: {
      x: i,
      y: c
    }
  };
}, pe = ({ D: t, M: o }) => {
  const e = (s, r) => s === 0 && s <= r;
  return {
    x: e(t.x, o.x),
    y: e(t.y, o.y)
  };
}, ds = ({ D: t, M: o }, e) => {
  const s = (r, n, a) => Os(0, 1, (r - a) / (r - n) || 0);
  return {
    x: s(t.x, o.x, e.x),
    y: s(t.y, o.y, e.y)
  };
}, Se = (t) => {
  t && t.focus && t.focus({
    preventScroll: !0
  });
}, ps = (t, o) => {
  K(Ee(o), t);
}, ze = (t) => {
  const o = /* @__PURE__ */ new Map(), e = (n, a) => {
    if (n) {
      const l = o.get(n);
      ps((i) => {
        l && l[i ? "delete" : "clear"](i);
      }, a);
    } else
      o.forEach((l) => {
        l.clear();
      }), o.clear();
  }, s = (n, a) => {
    if (yo(n)) {
      const u = o.get(n) || /* @__PURE__ */ new Set();
      return o.set(n, u), ps((c) => {
        xt(c) && u.add(c);
      }, a), L(e, n, a);
    }
    Go(a) && a && e();
    const l = wt(n), i = [];
    return K(l, (u) => {
      const c = n[u];
      c && et(i, s(u, c));
    }), L(gt, i);
  }, r = (n, a) => {
    K(Vt(o.get(n)), (l) => {
      a && !jo(a) ? l.apply(0, a) : l();
    });
  };
  return s(t || {}), [s, e, r];
}, Rs = {}, Ns = {}, Dr = (t) => {
  K(t, (o) => K(o, (e, s) => {
    Rs[s] = o[s];
  }));
}, Bs = (t, o, e) => wt(t).map((s) => {
  const { static: r, instance: n } = t[s], [a, l, i] = e || [], u = e ? n : r;
  if (u) {
    const c = e ? u(a, l, o) : u(o);
    return (i || Ns)[s] = c;
  }
}), wo = (t) => Ns[t], Mr = "__osOptionsValidationPlugin", Jt = "data-overlayscrollbars", Io = "os-environment", Po = `${Io}-scrollbar-hidden`, ue = `${Jt}-initialize`, Fo = "noClipping", us = `${Jt}-body`, It = Jt, Pr = "host", Ot = `${Jt}-viewport`, Lr = He, Ir = De, qs = "arrange", Us = "measuring", Fr = "scrolling", js = "scrollbarHidden", Vr = "noContent", Ce = `${Jt}-padding`, fs = `${Jt}-content`, qe = "os-size-observer", Rr = `${qe}-appear`, Ue = `${qe}-listener`, Nr = `${Ue}-scroll`, Vo = `${Ue}-item`, vs = `${Vo}-final`, Br = "os-trinsic-observer", qr = "os-theme-none", yt = "os-scrollbar", Ur = `${yt}-rtl`, jr = `${yt}-horizontal`, Wr = `${yt}-vertical`, Ws = `${yt}-track`, je = `${yt}-handle`, Yr = `${yt}-visible`, Xr = `${yt}-cornerless`, hs = `${yt}-interaction`, bs = `${yt}-unusable`, _e = `${yt}-auto-hide`, gs = `${_e}-hidden`, ys = `${yt}-wheel`, Kr = `${Ws}-interactive`, Qr = `${je}-interactive`, Ys = "__osSizeObserverPlugin", Zr = {
  [Ys]: {
    static: () => (t, o, e) => {
      const r = "scroll", n = Re(`<div class="${Vo}" dir="ltr"><div class="${Vo}"><div class="${vs}"></div></div><div class="${Vo}"><div class="${vs}" style="width: 200%; height: 200%"></div></div></div>`), a = n[0], l = a.lastChild, i = a.firstChild, u = i == null ? void 0 : i.firstChild;
      let c = Lt(a), p = c, y = !1, m;
      const d = () => {
        mt(i, 3333333), mt(l, 3333333);
      }, $ = (S) => {
        m = 0, y && (c = p, o(S === !0));
      }, O = (S) => {
        p = Lt(a), y = !S || !Me(p, c), S ? (Be(S), y && !m && (Ko(m), m = Qt($))) : $(S === !1), d();
      }, g = [ut(t, n), Z(i, r, O), Z(l, r, O)];
      return ee(t, Nr), Dt(u, {
        [Gt]: 3333333,
        [mo]: 3333333
      }), Qt(d), [e ? L(O, !1) : d, g];
    }
  }
}, Xs = (t, o) => {
  const { k: e } = o, [s, r] = t("showNativeOverlaidScrollbars");
  return [s && e.x && e.y, r];
}, Xt = (t) => t.indexOf(Tt) === 0, Gr = (t) => t.replace(`${Tt}-`, ""), ke = (t, o) => {
  if (t === "auto")
    return o ? Ft : Ct;
  const e = t || Ct;
  return [Ct, Ft, Tt].includes(e) ? e : Ct;
}, Ks = (t, o) => {
  const { overflowX: e, overflowY: s } = kt(t, [He, De]);
  return {
    x: ke(e, o.x),
    y: ke(s, o.y)
  };
}, We = "__osScrollbarsHidingPlugin", Jr = {
  [We]: {
    static: () => ({
      R: (t, o, e, s, r) => {
        const { V: n, L: a } = t, { U: l, k: i, P: u } = s, c = !n && !l && (i.x || i.y), [p] = Xs(r, s), y = (O) => {
          const g = l || p ? 0 : 42, S = (H, P, E) => [P && !l ? H ? g : E : 0, H && !!g], [V, b] = S(i.x, O.x === Ft, u.x), [A, T] = S(i.y, O.y === Ft, u.y);
          return {
            N: {
              x: V,
              y: A
            },
            q: {
              x: b,
              y: T
            }
          };
        }, m = (O) => {
          if (!n) {
            const { B: g } = e, S = j({}, {
              [uo]: 0,
              [Wt]: 0,
              [po]: 0
            }), { N: V, q: b } = y(O), { x: A, y: T } = b, { x: H, y: P } = V, { F: E } = o, w = g ? po : uo, C = g ? io : co, _ = E[w], I = E[Wt], R = E[C], B = E[lo];
            return S[Gt] = `calc(100% + ${P + _ * -1}px)`, S[w] = -P + _, S[Wt] = -H + I, c && (S[C] = R + (T ? P : 0), S[lo] = B + (A ? H : 0)), S;
          }
        };
        return {
          X: (O, g, S) => {
            if (c) {
              const { F: V } = o, { N: b, q: A } = y(O), { x: T, y: H } = A, { x: P, y: E } = b, { B: w } = e, _ = V[w ? co : io], I = V.paddingTop, R = g.w + S.w, B = g.h + S.h, U = {
                w: E && H ? `${E + R - _}px` : "",
                h: P && T ? `${P + B - I}px` : ""
              };
              Dt(a, {
                "--os-vaw": U.w,
                "--os-vah": U.h
              });
            }
            return c;
          },
          Y: () => {
            if (c) {
              const { j: O, F: g } = o, S = Ks(a, O), { q: V } = y(S), { x: b, y: A } = V, T = {}, H = (w) => K(w, (C) => {
                T[C] = g[C];
              });
              b && H([Wt, Te, lo]), A && H([po, uo, io, co]);
              const P = kt(a, wt(T)), E = Ie(a, Ot, qs);
              return Dt(a, T), () => {
                Dt(a, j({}, P, m(S))), E();
              };
            }
            return qt;
          },
          W: m
        };
      }
    })
  }
}, Qs = "__osClickScrollPlugin", tn = {
  [Qs]: {
    static: () => (t, o, e, s) => {
      let r = !1, n = qt;
      const a = 133, l = 222, [i, u] = Nt(a), c = Math.sign(o), p = e * c, y = p / 2, m = (g) => 1 - (1 - g) * (1 - g), d = (g, S) => ie(g, S, l, t, m), $ = (g, S) => ie(g, o - p, a * S, (V, b, A) => {
        t(V), A && (n = d(V, o));
      }), O = ie(0, p, l, (g, S, V) => {
        if (t(g), V && (s(r), !r)) {
          const b = o - g;
          Math.sign(b - y) === c && i(() => {
            const T = b - p;
            n = Math.sign(T) === c ? $(g, Math.abs(T) / e) : d(g, o);
          });
        }
      }, m);
      return (g) => {
        r = !0, g && O(), u(), n();
      };
    }
  }
}, ms = (t) => JSON.stringify(t, (o, e) => {
  if (xt(e))
    throw 0;
  return e;
}), ws = (t, o) => t ? `${o}`.split(".").reduce((e, s) => e && ks(e, s) ? e[s] : void 0, t) : void 0, on = {
  paddingAbsolute: !1,
  showNativeOverlaidScrollbars: !1,
  update: {
    elementEvents: [["img", "load"]],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
  scrollbars: {
    theme: "os-theme-dark",
    visibility: "auto",
    autoHide: "never",
    autoHideDelay: 1300,
    autoHideSuspend: !1,
    dragScroll: !0,
    clickScroll: !1,
    pointers: ["mouse", "touch", "pen"]
  }
}, Zs = (t, o) => {
  const e = {}, s = fo(wt(o), wt(t));
  return K(s, (r) => {
    const n = t[r], a = o[r];
    if (Bo(n) && Bo(a))
      j(e[r] = {}, Zs(n, a)), Pe(e[r]) && delete e[r];
    else if (ks(o, r) && a !== n) {
      let l = !0;
      if (_t(n) || _t(a))
        try {
          ms(n) === ms(a) && (l = !1);
        } catch {
        }
      l && (e[r] = a);
    }
  }), e;
}, xs = (t, o, e) => (s) => [ws(t, s), e || ws(o, s) !== void 0];
let Gs;
const en = () => Gs, sn = (t) => {
  Gs = t;
};
let fe;
const rn = () => {
  const t = (b, A, T) => {
    ut(document.body, b), ut(document.body, b);
    const H = Ls(b), P = Lt(b), E = Ne(A);
    return T && Zt(b), {
      x: P.h - H.h + E.h,
      y: P.w - H.w + E.w
    };
  }, o = (b) => {
    let A = !1;
    const T = ee(b, Po);
    try {
      A = kt(b, "scrollbar-width") === "none" || kt(b, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return T(), A;
  }, e = `.${Io}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Io} div{width:200%;height:200%;margin:10px 0}.${Po}{scrollbar-width:none!important}.${Po}::-webkit-scrollbar,.${Po}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, r = Re(`<div class="${Io}"><div></div><style>${e}</style></div>`)[0], n = r.firstChild, a = r.lastChild, l = en();
  l && (a.nonce = l);
  const [i, , u] = ze(), [c, p] = ht({
    o: t(r, n),
    i: Lo
  }, L(t, r, n, !0)), [y] = p(), m = o(r), d = {
    x: y.x === 0,
    y: y.y === 0
  }, $ = {
    elements: {
      host: null,
      padding: !m,
      viewport: (b) => m && Hs(b) && b,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, O = j({}, on), g = L(j, {}, O), S = L(j, {}, $), V = {
    P: y,
    k: d,
    U: m,
    J: !!ao,
    G: L(i, "r"),
    K: S,
    Z: (b) => j($, b) && S(),
    tt: g,
    nt: (b) => j(O, b) && g(),
    ot: j({}, $),
    st: j({}, O)
  };
  if ($t(r, "style"), Zt(r), Z(vt, "resize", () => {
    u("r", []);
  }), xt(vt.matchMedia) && !m && (!d.x || !d.y)) {
    const b = (A) => {
      const T = vt.matchMedia(`(resolution: ${vt.devicePixelRatio}dppx)`);
      Z(T, "change", () => {
        A(), b(A);
      }, {
        A: !0
      });
    };
    b(() => {
      const [A, T] = c();
      j(V.P, A), u("r", [T]);
    });
  }
  return V;
}, At = () => (fe || (fe = rn()), fe), nn = (t, o, e) => {
  let s = !1;
  const r = e ? /* @__PURE__ */ new WeakMap() : !1, n = () => {
    s = !0;
  }, a = (l) => {
    if (r && e) {
      const i = e.map((u) => {
        const [c, p] = u || [];
        return [p && c ? (l || Ts)(c, t) : [], p];
      });
      K(i, (u) => K(u[0], (c) => {
        const p = u[1], y = r.get(c) || [];
        if (t.contains(c) && p) {
          const d = Z(c, p, ($) => {
            s ? (d(), r.delete(c)) : o($);
          });
          r.set(c, et(y, d));
        } else
          gt(y), r.delete(c);
      }));
    }
  };
  return a(), [n, a];
}, Ss = (t, o, e, s) => {
  let r = !1;
  const { et: n, ct: a, rt: l, it: i, lt: u, ut: c } = s || {}, p = Wo(() => r && e(!0), {
    p: 33,
    v: 99
  }), [y, m] = nn(t, p, l), d = n || [], $ = a || [], O = fo(d, $), g = (V, b) => {
    if (!jo(b)) {
      const A = u || qt, T = c || qt, H = [], P = [];
      let E = !1, w = !1;
      if (K(b, (C) => {
        const { attributeName: _, target: I, type: R, oldValue: B, addedNodes: U, removedNodes: Y } = C, Q = R === "attributes", W = R === "childList", st = t === I, M = Q && _, x = M && Le(I, _ || ""), f = yo(x) ? x : null, z = M && B !== f, v = _s($, _) && z;
        if (o && (W || !st)) {
          const h = Q && z, k = h && i && be(I, i), F = (k ? !A(I, _, B, f) : !Q || h) && !T(C, !!k, t, s);
          K(U, (q) => et(H, q)), K(Y, (q) => et(H, q)), w = w || F;
        }
        !o && st && z && !A(I, _, B, f) && (et(P, _), E = E || v);
      }), m((C) => he(H).reduce((_, I) => (et(_, Ts(C, I)), be(I, C) ? et(_, I) : _), [])), o)
        return !V && w && e(!1), [!1];
      if (!jo(P) || E) {
        const C = [he(P), E];
        return V || e.apply(0, C), C;
      }
    }
  }, S = new xr(L(g, !1));
  return [() => (S.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: O,
    subtree: o,
    childList: o,
    characterData: o
  }), r = !0, () => {
    r && (y(), S.disconnect(), r = !1);
  }), () => {
    if (r)
      return p.O(), g(!0, S.takeRecords());
  }];
};
let Rt = null;
const Js = (t, o, e) => {
  const { ft: s } = e || {}, r = wo(Ys), [n] = ht({
    o: !1,
    u: !0
  });
  return () => {
    const a = [], i = Re(`<div class="${qe}"><div class="${Ue}"></div></div>`)[0], u = i.firstChild, c = (p) => {
      const y = _t(p) && !jo(p);
      let m = !1, d = !1;
      if (y) {
        const $ = p[0], [O, , g] = n($.contentRect), S = we(O);
        d = Is(O, g), m = !d && !S;
      } else
        d = p === !0;
      m || o({
        _t: !0,
        ft: d
      });
    };
    if (jt) {
      if (!Go(Rt)) {
        const d = new jt(qt);
        d.observe(t, {
          get box() {
            Rt = !0;
          }
        }), Rt = Rt || !1, d.disconnect();
      }
      const p = Wo(c, {
        p: 0,
        v: 0
      }), y = (d) => p(d), m = new jt(y);
      if (m.observe(Rt ? t : u), et(a, [() => {
        m.disconnect();
      }, !Rt && ut(t, i)]), Rt) {
        const d = new jt(y);
        d.observe(t, {
          box: "border-box"
        }), et(a, () => d.disconnect());
      }
    } else if (r) {
      const [p, y] = r(u, c, s);
      et(a, fo([ee(i, Rr), Z(i, "animationstart", p), ut(t, i)], y));
    } else
      return qt;
    return L(gt, a);
  };
}, an = (t, o) => {
  let e;
  const s = (i) => i.h === 0 || i.isIntersecting || i.intersectionRatio > 0, r = Kt(Br), [n] = ht({
    o: !1
  }), a = (i, u) => {
    if (i) {
      const c = n(s(i)), [, p] = c;
      return p && !u && o(c) && [c];
    }
  }, l = (i, u) => a(u.pop(), i);
  return [() => {
    const i = [];
    if (ss)
      e = new ss(L(l, !1), {
        root: t
      }), e.observe(r), et(i, () => {
        e.disconnect();
      });
    else {
      const u = () => {
        const c = Lt(r);
        a(c);
      };
      et(i, Js(r, u)()), u();
    }
    return L(gt, et(i, ut(t, r)));
  }, () => e && l(!0, e.takeRecords())];
}, cn = (t, o, e, s) => {
  let r, n, a, l, i, u;
  const c = `[${It}]`, p = `[${Ot}]`, y = ["id", "class", "style", "open", "wrap", "cols", "rows"], { dt: m, vt: d, L: $, gt: O, ht: g, V: S, bt: V, wt: b, yt: A, St: T } = t, H = (v) => kt(v, "direction") === "rtl", P = {
    Ot: !1,
    B: H(m)
  }, E = At(), w = wo(We), [C] = ht({
    i: Me,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const v = w && w.R(t, o, P, E, e).Y, k = !(V && S) && Ve(d, It, Fo), D = !S && b(qs), F = D && bt(O), q = F && T(), J = A(Us, k), X = D && v && v(), tt = Xo($), N = Ne($);
    return X && X(), mt(O, F), q && q(), k && J(), {
      w: tt.w + N.w,
      h: tt.h + N.h
    };
  }), _ = Wo(s, {
    p: () => r,
    v: () => n,
    m(v, h) {
      const [k] = v, [D] = h;
      return [fo(wt(k), wt(D)).reduce((F, q) => (F[q] = k[q] || D[q], F), {})];
    }
  }), I = (v) => {
    const h = H(m);
    j(v, {
      $t: u !== h
    }), j(P, {
      B: h
    }), u = h;
  }, R = (v, h) => {
    const [k, D] = v, F = {
      Ct: D
    };
    return j(P, {
      Ot: k
    }), h || s(F), F;
  }, B = ({ _t: v, ft: h }) => {
    const D = !(v && !h) && E.U ? _ : s, F = {
      _t: v || h,
      ft: h
    };
    I(F), D(F);
  }, U = (v, h) => {
    const [, k] = C(), D = {
      xt: k
    };
    return I(D), k && !h && (v ? s : _)(D), D;
  }, Y = (v, h, k) => {
    const D = {
      Ht: h
    };
    return I(D), h && !k && _(D), D;
  }, [Q, W] = g ? an(d, R) : [], st = !S && Js(d, B, {
    ft: !0
  }), [M, x] = Ss(d, !1, Y, {
    ct: y,
    et: y
  }), f = S && jt && new jt((v) => {
    const h = v[v.length - 1].contentRect;
    B({
      _t: !0,
      ft: Is(h, i)
    }), i = h;
  }), z = Wo(() => {
    const [, v] = C();
    s({
      xt: v
    });
  }, {
    p: 222,
    S: !0
  });
  return [() => {
    f && f.observe(d);
    const v = st && st(), h = Q && Q(), k = M(), D = E.G((F) => {
      F ? _({
        Et: F
      }) : z();
    });
    return () => {
      f && f.disconnect(), v && v(), h && h(), l && l(), k(), D();
    };
  }, ({ zt: v, Tt: h, It: k }) => {
    const D = {}, [F] = v("update.ignoreMutation"), [q, J] = v("update.attributes"), [X, tt] = v("update.elementEvents"), [N, at] = v("update.debounce"), dt = tt || J, ct = h || k, lt = (ot) => xt(F) && F(ot);
    if (dt) {
      a && a(), l && l();
      const [ot, rt] = Ss(g || $, !0, U, {
        et: fo(y, q || []),
        rt: X,
        it: c,
        ut: (nt, G) => {
          const { target: it, attributeName: pt } = nt;
          return (!G && pt && !S ? _r(it, c, p) : !1) || !!Yt(it, `.${yt}`) || !!lt(nt);
        }
      });
      l = ot(), a = rt;
    }
    if (at)
      if (_.O(), _t(N)) {
        const ot = N[0], rt = N[1];
        r = Ht(ot) && ot, n = Ht(rt) && rt;
      } else Ht(N) ? (r = N, n = !1) : (r = !1, n = !1);
    if (ct) {
      const ot = x(), rt = W && W(), nt = a && a();
      ot && j(D, Y(ot[0], ot[1], ct)), rt && j(D, R(rt[0], ct)), nt && j(D, U(nt[0], ct));
    }
    return I(D), D;
  }, P];
}, tr = (t, o) => xt(o) ? o.apply(0, t) : o, ln = (t, o, e, s) => {
  const r = Oe(s) ? e : s;
  return tr(t, r) || o.apply(0, t);
}, or = (t, o, e, s) => {
  const r = Oe(s) ? e : s, n = tr(t, r);
  return !!n && (Uo(n) ? n : o.apply(0, t));
}, dn = (t, o) => {
  const { nativeScrollbarsOverlaid: e, body: s } = o || {}, { k: r, U: n, K: a } = At(), { nativeScrollbarsOverlaid: l, body: i } = a().cancel, u = e ?? l, c = Oe(s) ? i : s, p = (r.x || r.y) && u, y = t && (Zo(c) ? !n : c);
  return !!p || !!y;
}, pn = (t, o, e, s) => {
  const r = "--os-viewport-percent", n = "--os-scroll-percent", a = "--os-scroll-direction", { K: l } = At(), { scrollbars: i } = l(), { slot: u } = i, { dt: c, vt: p, L: y, At: m, gt: d, bt: $, V: O } = o, { scrollbars: g } = m ? {} : t, { slot: S } = g || {}, V = [], b = [], A = [], T = or([c, p, y], () => O && $ ? c : p, u, S), H = (M) => {
    if (ao) {
      let x = null, f = [];
      const z = new ao({
        source: d,
        axis: M
      }), v = () => {
        x && x.cancel(), x = null;
      };
      return {
        kt: (k) => {
          const { Dt: D } = e, F = pe(D)[M], q = M === "x", J = [le(0, q), le(`calc(100cq${q ? "w" : "h"} + -100%)`, q)], X = F ? J : J.reverse();
          return f[0] === X[0] && f[1] === X[1] || (v(), f = X, x = k.Mt.animate({
            clear: ["left"],
            transform: X
          }, {
            timeline: z
          })), v;
        }
      };
    }
  }, P = {
    x: H("x"),
    y: H("y")
  }, E = () => {
    const { Rt: M, Vt: x } = e, f = (z, v) => Os(0, 1, z / (z + v) || 0);
    return {
      x: f(x.x, M.x),
      y: f(x.y, M.y)
    };
  }, w = (M, x, f) => {
    const z = f ? ee : Es;
    K(M, (v) => {
      z(v.Lt, x);
    });
  }, C = (M, x) => {
    K(M, (f) => {
      const [z, v] = x(f);
      Dt(z, v);
    });
  }, _ = (M, x, f) => {
    const z = Go(f), v = z ? f : !0, h = z ? !f : !0;
    v && w(b, M, x), h && w(A, M, x);
  }, I = () => {
    const M = E(), x = (f) => (z) => [z.Lt, {
      [r]: me(f) + ""
    }];
    C(b, x(M.x)), C(A, x(M.y));
  }, R = () => {
    if (!ao) {
      const { Dt: M } = e, x = ds(M, bt(d)), f = (z) => (v) => [v.Lt, {
        [n]: me(z) + ""
      }];
      C(b, f(x.x)), C(A, f(x.y));
    }
  }, B = () => {
    const { Dt: M } = e, x = pe(M), f = (z) => (v) => [v.Lt, {
      [a]: z ? "0" : "1"
    }];
    C(b, f(x.x)), C(A, f(x.y)), ao && (b.forEach(P.x.kt), A.forEach(P.y.kt));
  }, U = () => {
    if (O && !$) {
      const { Rt: M, Dt: x } = e, f = pe(x), z = ds(x, bt(d)), v = (h) => {
        const { Lt: k } = h, D = vo(k) === y && k, F = (q, J, X) => {
          const tt = J * q;
          return Ps(X ? tt : -tt);
        };
        return [D, D && {
          transform: le({
            x: F(z.x, M.x, f.x),
            y: F(z.y, M.y, f.y)
          })
        }];
      };
      C(b, v), C(A, v);
    }
  }, Y = (M) => {
    const x = M ? "x" : "y", z = Kt(`${yt} ${M ? jr : Wr}`), v = Kt(Ws), h = Kt(je), k = {
      Lt: z,
      Ut: v,
      Mt: h
    }, D = P[x];
    return et(M ? b : A, k), et(V, [ut(z, v), ut(v, h), L(Zt, z), D && D.kt(k), s(k, _, M)]), k;
  }, Q = L(Y, !0), W = L(Y, !1), st = () => (ut(T, b[0].Lt), ut(T, A[0].Lt), L(gt, V));
  return Q(), W(), [{
    Pt: I,
    Nt: R,
    qt: B,
    Bt: U,
    Ft: _,
    jt: {
      Xt: b,
      Yt: Q,
      Wt: L(C, b)
    },
    Jt: {
      Xt: A,
      Yt: W,
      Wt: L(C, A)
    }
  }, st];
}, un = (t, o, e, s) => (r, n, a) => {
  const { vt: l, L: i, V: u, gt: c, Gt: p, St: y } = o, { Lt: m, Ut: d, Mt: $ } = r, [O, g] = Nt(333), [S, V] = Nt(444), b = (H) => {
    xt(c.scrollBy) && c.scrollBy({
      behavior: "smooth",
      left: H.x,
      top: H.y
    });
  }, A = () => {
    const H = "pointerup pointercancel lostpointercapture", P = `client${a ? "X" : "Y"}`, E = a ? Gt : mo, w = a ? "left" : "top", C = a ? "w" : "h", _ = a ? "x" : "y", I = (B, U) => (Y) => {
      const { Rt: Q } = e, W = Lt(d)[C] - Lt($)[C], M = U * Y / W * Q[_];
      mt(c, {
        [_]: B + M
      });
    }, R = [];
    return Z(d, "pointerdown", (B) => {
      const U = Yt(B.target, `.${je}`) === $, Y = U ? $ : d, Q = t.scrollbars, W = Q[U ? "dragScroll" : "clickScroll"], { button: st, isPrimary: M, pointerType: x } = B, { pointers: f } = Q;
      if (st === 0 && M && W && (f || []).includes(x)) {
        gt(R), V();
        const v = !U && (B.shiftKey || W === "instant"), h = L(de, $), k = L(de, d), D = (G, it) => (G || h())[w] - (it || k())[w], F = ve(de(c)[E]) / Lt(c)[C] || 1, q = I(bt(c)[_], 1 / F), J = B[P], X = h(), tt = k(), N = X[E], at = D(X, tt) + N / 2, dt = J - tt[w], ct = U ? 0 : dt - at, lt = (G) => {
          gt(nt), Y.releasePointerCapture(G.pointerId);
        }, ot = U || v, rt = y(), nt = [Z(p, H, lt), Z(p, "selectstart", (G) => xe(G), {
          T: !1
        }), Z(d, H, lt), ot && Z(d, "pointermove", (G) => q(ct + (G[P] - J))), ot && (() => {
          const G = bt(c);
          rt();
          const it = bt(c), pt = {
            x: it.x - G.x,
            y: it.y - G.y
          };
          (No(pt.x) > 3 || No(pt.y) > 3) && (y(), mt(c, G), b(pt), S(rt));
        })];
        if (Y.setPointerCapture(B.pointerId), v)
          q(ct);
        else if (!U) {
          const G = wo(Qs);
          if (G) {
            const it = G(q, ct, N, (pt) => {
              pt ? rt() : et(nt, rt);
            });
            et(nt, it), et(R, L(it, !0));
          }
        }
      }
    });
  };
  let T = !0;
  return L(gt, [Z($, "pointermove pointerleave", s), Z(m, "pointerenter", () => {
    n(hs, !0);
  }), Z(m, "pointerleave pointercancel", () => {
    n(hs, !1);
  }), !u && Z(m, "mousedown", () => {
    const H = ye();
    (as(H, Ot) || as(H, It) || H === document.body) && $e(L(Se, i), 25);
  }), Z(m, "wheel", (H) => {
    const { deltaX: P, deltaY: E, deltaMode: w } = H;
    T && w === 0 && vo(m) === l && b({
      x: P,
      y: E
    }), T = !1, n(ys, !0), O(() => {
      T = !0, n(ys);
    }), xe(H);
  }, {
    T: !1,
    I: !0
  }), Z(m, "pointerdown", () => {
    const H = Z(p, "click", (E) => {
      P(), Fs(E);
    }, {
      A: !0,
      I: !0,
      T: !1
    }), P = Z(p, "pointerup pointercancel", () => {
      P(), setTimeout(H, 150);
    }, {
      I: !0,
      T: !0
    });
  }, {
    I: !0,
    T: !0
  }), A(), g, V]);
}, fn = (t, o, e, s, r, n) => {
  let a, l, i, u, c, p = qt, y = 0;
  const m = ["mouse", "pen"], d = (x) => m.includes(x.pointerType), [$, O] = Nt(), [g, S] = Nt(100), [V, b] = Nt(100), [A, T] = Nt(() => y), [H, P] = pn(t, r, s, un(o, r, s, (x) => d(x) && Q())), { vt: E, Kt: w, bt: C } = r, { Ft: _, Pt: I, Nt: R, qt: B, Bt: U } = H, Y = (x, f) => {
    if (T(), x)
      _(gs);
    else {
      const z = L(_, gs, !0);
      y > 0 && !f ? A(z) : z();
    }
  }, Q = () => {
    (i ? !a : !u) && (Y(!0), g(() => {
      Y(!1);
    }));
  }, W = (x) => {
    _(_e, x, !0), _(_e, x, !1);
  }, st = (x) => {
    d(x) && (a = i, i && Y(!0));
  }, M = [T, S, b, O, () => p(), Z(E, "pointerover", st, {
    A: !0
  }), Z(E, "pointerenter", st), Z(E, "pointerleave", (x) => {
    d(x) && (a = !1, i && Y(!1));
  }), Z(E, "pointermove", (x) => {
    d(x) && l && Q();
  }), Z(w, "scroll", (x) => {
    $(() => {
      R(), Q();
    }), n(x), U();
  })];
  return [() => L(gt, et(M, P())), ({ zt: x, It: f, Qt: z, Zt: v }) => {
    const { tn: h, nn: k, sn: D, en: F } = v || {}, { $t: q, ft: J } = z || {}, { B: X } = e, { k: tt } = At(), { cn: N, j: at } = s, [dt, ct] = x("showNativeOverlaidScrollbars"), [lt, ot] = x("scrollbars.theme"), [rt, nt] = x("scrollbars.visibility"), [G, it] = x("scrollbars.autoHide"), [pt, to] = x("scrollbars.autoHideSuspend"), [xo] = x("scrollbars.autoHideDelay"), [So, zo] = x("scrollbars.dragScroll"), [Co, _o] = x("scrollbars.clickScroll"), [Pt, oo] = x("overflow"), re = J && !f, ne = at.x || at.y, ae = h || k || F || q || f, ce = D || nt || oo, zt = dt && tt.x && tt.y, ko = (Ut, eo, $o) => {
      const Oo = Ut.includes(Ft) && (rt === Tt || rt === "auto" && eo === Ft);
      return _(Yr, Oo, $o), Oo;
    };
    if (y = xo, re && (pt && ne ? (W(!1), p(), V(() => {
      p = Z(w, "scroll", L(W, !0), {
        A: !0
      });
    })) : W(!0)), ct && _(qr, zt), ot && (_(c), _(lt, !0), c = lt), to && !pt && W(!0), it && (l = G === "move", i = G === "leave", u = G === "never", Y(u, !0)), zo && _(Qr, So), _o && _(Kr, !!Co), ce) {
      const Ut = ko(Pt.x, N.x, !0), eo = ko(Pt.y, N.y, !1);
      _(Xr, !(Ut && eo));
    }
    ae && (R(), I(), U(), F && B(), _(bs, !at.x, !0), _(bs, !at.y, !1), _(Ur, X && !C));
  }, {}, H];
}, vn = (t) => {
  const o = At(), { K: e, U: s } = o, { elements: r } = e(), { padding: n, viewport: a, content: l } = r, i = Uo(t), u = i ? {} : t, { elements: c } = u, { padding: p, viewport: y, content: m } = c || {}, d = i ? t : u.target, $ = Hs(d), O = d.ownerDocument, g = O.documentElement, S = () => O.defaultView || vt, V = L(ln, [d]), b = L(or, [d]), A = L(Kt, ""), T = L(V, A, a), H = L(b, A, l), P = (N) => {
    const at = Lt(N), dt = Xo(N), ct = kt(N, He), lt = kt(N, De);
    return dt.w - at.w > 0 && !Xt(ct) || dt.h - at.h > 0 && !Xt(lt);
  }, E = T(y), w = E === d, C = w && $, _ = !w && H(m), I = !w && E === _, R = C ? g : E, B = C ? R : d, U = !w && b(A, n, p), Y = !I && _, Q = [Y, R, U, B].map((N) => Uo(N) && !vo(N) && N), W = (N) => N && _s(Q, N), st = !W(R) && P(R) ? R : d, M = C ? g : R, f = {
    dt: d,
    vt: B,
    L: R,
    rn: U,
    ht: Y,
    gt: M,
    Kt: C ? O : R,
    ln: $ ? g : st,
    Gt: O,
    bt: $,
    At: i,
    V: w,
    an: S,
    wt: (N) => Ve(R, Ot, N),
    yt: (N, at) => Yo(R, Ot, N, at),
    St: () => Yo(M, Ot, Fr, !0)
  }, { dt: z, vt: v, rn: h, L: k, ht: D } = f, F = [() => {
    $t(v, [It, ue]), $t(z, ue), $ && $t(g, [ue, It]);
  }];
  let q = ge([D, k, h, v, z].find((N) => N && !W(N)));
  const J = C ? z : D || k, X = L(gt, F);
  return [f, () => {
    const N = S(), at = ye(), dt = (nt) => {
      ut(vo(nt), ge(nt)), Zt(nt);
    }, ct = (nt) => Z(nt, "focusin focusout focus blur", Fs, {
      I: !0,
      T: !1
    }), lt = "tabindex", ot = Le(k, lt), rt = ct(at);
    return Et(v, It, w ? "" : Pr), Et(h, Ce, ""), Et(k, Ot, ""), Et(D, fs, ""), w || (Et(k, lt, ot || "-1"), $ && Et(g, us, "")), ut(J, q), ut(v, h), ut(h || v, !w && k), ut(k, D), et(F, [rt, () => {
      const nt = ye(), G = W(k), it = G && nt === k ? z : nt, pt = ct(it);
      $t(h, Ce), $t(D, fs), $t(k, Ot), $ && $t(g, us), ot ? Et(k, lt, ot) : $t(k, lt), W(D) && dt(D), G && dt(k), W(h) && dt(h), Se(it), pt();
    }]), s && !w && (Fe(k, Ot, js), et(F, L($t, k, Ot))), Se(!w && $ && at === z && N.top === N ? k : at), rt(), q = 0, X;
  }, X];
}, hn = ({ ht: t }) => ({ Qt: o, un: e, It: s }) => {
  const { Ct: r } = o || {}, { Ot: n } = e;
  t && (r || s) && Dt(t, {
    [mo]: n && "100%"
  });
}, bn = ({ vt: t, rn: o, L: e, V: s }, r) => {
  const [n, a] = ht({
    i: zr,
    o: is()
  }, L(is, t, "padding", ""));
  return ({ zt: l, Qt: i, un: u, It: c }) => {
    let [p, y] = a(c);
    const { U: m } = At(), { _t: d, xt: $, $t: O } = i || {}, { B: g } = u, [S, V] = l("paddingAbsolute");
    (d || y || (c || $)) && ([p, y] = n(c));
    const A = !s && (V || O || y);
    if (A) {
      const T = !S || !o && !m, H = p.r + p.l, P = p.t + p.b, E = {
        [uo]: T && !g ? -H : 0,
        [Wt]: T ? -P : 0,
        [po]: T && g ? -H : 0,
        top: T ? -p.t : 0,
        right: T ? g ? -p.r : "auto" : 0,
        left: T ? g ? "auto" : -p.l : 0,
        [Gt]: T && `calc(100% + ${H}px)`
      }, w = {
        [Te]: T ? p.t : 0,
        [co]: T ? p.r : 0,
        [lo]: T ? p.b : 0,
        [io]: T ? p.l : 0
      };
      Dt(o || e, E), Dt(e, w), j(r, {
        rn: p,
        fn: !T,
        F: o ? w : j({}, E, w)
      });
    }
    return {
      _n: A
    };
  };
}, gn = (t, o) => {
  const e = At(), { vt: s, rn: r, L: n, V: a, Kt: l, gt: i, bt: u, yt: c, an: p } = t, { U: y } = e, m = u && a, d = L(Ro, 0), $ = {
    display: () => !1,
    direction: (f) => f !== "ltr",
    flexDirection: (f) => f.endsWith("-reverse"),
    writingMode: (f) => f !== "horizontal-tb"
  }, O = wt($), g = {
    i: Me,
    o: {
      w: 0,
      h: 0
    }
  }, S = {
    i: Lo,
    o: {}
  }, V = (f) => {
    c(Us, !m && f);
  }, b = (f) => {
    if (!O.some((X) => {
      const tt = f[X];
      return tt && $[X](tt);
    }))
      return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
    V(!0);
    const v = bt(i), h = c(Vr, !0), k = Z(l, Ft, (X) => {
      const tt = bt(i);
      X.isTrusted && tt.x === v.x && tt.y === v.y && Be(X);
    }, {
      I: !0,
      A: !0
    });
    mt(i, {
      x: 0,
      y: 0
    }), h();
    const D = bt(i), F = Xo(i);
    mt(i, {
      x: F.w,
      y: F.h
    });
    const q = bt(i);
    mt(i, {
      x: q.x - D.x < 1 && -F.w,
      y: q.y - D.y < 1 && -F.h
    });
    const J = bt(i);
    return mt(i, v), Qt(() => k()), {
      D,
      M: J
    };
  }, A = (f, z) => {
    const v = vt.devicePixelRatio % 1 !== 0 ? 1 : 0, h = {
      w: d(f.w - z.w),
      h: d(f.h - z.h)
    };
    return {
      w: h.w > v ? h.w : 0,
      h: h.h > v ? h.h : 0
    };
  }, T = (f, z) => {
    const v = (h, k, D, F) => {
      const q = h === Tt ? Ct : Gr(h), J = Xt(h), X = Xt(D);
      return !k && !F ? Ct : J && X ? Tt : J ? k && F ? q : k ? Tt : Ct : k ? q : X && F ? Tt : Ct;
    };
    return {
      x: v(z.x, f.x, z.y, f.y),
      y: v(z.y, f.y, z.x, f.x)
    };
  }, H = (f) => {
    const z = (h) => [Tt, Ct, Ft].map((k) => x(ke(k), h)), v = z(!0).concat(z()).join(" ");
    c(v), c(wt(f).map((h) => x(f[h], h === "x")).join(" "), !0);
  }, [P, E] = ht(g, L(Ne, n)), [w, C] = ht(g, L(Xo, n)), [_, I] = ht(g), [R] = ht(S), [B, U] = ht(g), [Y] = ht(S), [Q] = ht({
    i: (f, z) => te(f, z, O),
    o: {}
  }, () => Tr(n) ? kt(n, O) : {}), [W, st] = ht({
    i: (f, z) => Lo(f.D, z.D) && Lo(f.M, z.M),
    o: Vs()
  }), M = wo(We), x = (f, z) => `${z ? Lr : Ir}${Sr(f)}`;
  return ({ zt: f, Qt: z, un: v, It: h }, { _n: k }) => {
    const { _t: D, Ht: F, xt: q, $t: J, ft: X, Et: tt } = z || {}, N = M && M.R(t, o, v, e, f), { X: at, Y: dt, W: ct } = N || {}, [lt, ot] = Xs(f, e), [rt, nt] = f("overflow"), G = Xt(rt.x), it = Xt(rt.y), pt = D || k || q || J || tt || ot;
    let to = E(h), xo = C(h), So = I(h), zo = U(h);
    if (ot && y && c(js, !lt), pt) {
      Ve(s, It, Fo) && V(!0);
      const Ke = dt && dt(), [Ao] = to = P(h), [Eo] = xo = w(h), To = Ls(n), Ho = m && Er(p()), cr = {
        w: d(Eo.w + Ao.w),
        h: d(Eo.h + Ao.h)
      }, Qe = {
        w: d((Ho ? Ho.w : To.w + d(To.w - Eo.w)) + Ao.w),
        h: d((Ho ? Ho.h : To.h + d(To.h - Eo.h)) + Ao.h)
      };
      Ke && Ke(), zo = B(Qe), So = _(A(cr, Qe), h);
    }
    const [Co, _o] = zo, [Pt, oo] = So, [re, ne] = xo, [ae, ce] = to, [zt, ko] = R({
      x: Pt.w > 0,
      y: Pt.h > 0
    }), Ut = G && it && (zt.x || zt.y) || G && zt.x && !zt.y || it && zt.y && !zt.x, eo = k || J || tt || ce || ne || _o || oo || nt || ot || pt || F && m, [$o, Oo] = Q(h), Xe = J || X || Oo || ko || h, [sr, rr] = Xe ? W(b($o), h) : st();
    let so = T(zt, rt);
    V(!1), eo && (H(so), so = Ks(n, zt), ct && at && (at(so, re, ae), Dt(n, ct(so))));
    const [nr, ar] = Y(so);
    return Yo(s, It, Fo, Ut), Yo(r, Ce, Fo, Ut), j(o, {
      cn: nr,
      Vt: {
        x: Co.w,
        y: Co.h
      },
      Rt: {
        x: Pt.w,
        y: Pt.h
      },
      j: zt,
      Dt: Hr(sr, Pt)
    }), {
      sn: ar,
      tn: _o,
      nn: oo,
      en: rr || oo,
      dn: Xe
    };
  };
}, yn = (t) => {
  const [o, e, s] = vn(t), r = {
    rn: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    fn: !1,
    F: {
      [uo]: 0,
      [Wt]: 0,
      [po]: 0,
      [Te]: 0,
      [co]: 0,
      [lo]: 0,
      [io]: 0
    },
    Vt: {
      x: 0,
      y: 0
    },
    Rt: {
      x: 0,
      y: 0
    },
    cn: {
      x: Ct,
      y: Ct
    },
    j: {
      x: !1,
      y: !1
    },
    Dt: Vs()
  }, { dt: n, gt: a, V: l, St: i } = o, { U: u, k: c } = At(), p = !u && (c.x || c.y), y = [hn(o), bn(o, r), gn(o, r)];
  return [e, (m) => {
    const d = {}, O = p && bt(a), g = O && i();
    return K(y, (S) => {
      j(d, S(m, d) || {});
    }), mt(a, O), g && g(), l || mt(n, 0), d;
  }, r, o, s];
}, mn = (t, o, e, s, r) => {
  let n = !1;
  const a = xs(o, {}), [l, i, u, c, p] = yn(t), [y, m, d] = cn(c, u, a, (b) => {
    V({}, b);
  }), [$, O, , g] = fn(t, o, d, u, c, r), S = (b) => wt(b).some((A) => !!b[A]), V = (b, A) => {
    if (e())
      return !1;
    const { pn: T, It: H, Tt: P, vn: E } = b, w = T || {}, C = !!H || !n, _ = {
      zt: xs(o, w, C),
      pn: w,
      It: C
    };
    if (E)
      return O(_), !1;
    const I = A || m(j({}, _, {
      Tt: P
    })), R = i(j({}, _, {
      un: d,
      Qt: I
    }));
    O(j({}, _, {
      Qt: I,
      Zt: R
    }));
    const B = S(I), U = S(R), Y = B || U || !Pe(w) || C;
    return n = !0, Y && s(b, {
      Qt: I,
      Zt: R
    }), Y;
  };
  return [() => {
    const { ln: b, gt: A, St: T } = c, H = bt(b), P = [y(), l(), $()], E = T();
    return mt(A, H), E(), L(gt, P);
  }, V, () => ({
    gn: d,
    hn: u
  }), {
    bn: c,
    wn: g
  }, p];
}, Ye = /* @__PURE__ */ new WeakMap(), wn = (t, o) => {
  Ye.set(t, o);
}, xn = (t) => {
  Ye.delete(t);
}, er = (t) => Ye.get(t), Mt = (t, o, e) => {
  const { tt: s } = At(), r = Uo(t), n = r ? t : t.target, a = er(n);
  if (o && !a) {
    let l = !1;
    const i = [], u = {}, c = (w) => {
      const C = $s(w), _ = wo(Mr);
      return _ ? _(C, !0) : C;
    }, p = j({}, s(), c(o)), [y, m, d] = ze(), [$, O, g] = ze(e), S = (w, C) => {
      g(w, C), d(w, C);
    }, [V, b, A, T, H] = mn(t, p, () => l, ({ pn: w, It: C }, { Qt: _, Zt: I }) => {
      const { _t: R, $t: B, Ct: U, xt: Y, Ht: Q, ft: W } = _, { tn: st, nn: M, sn: x, en: f } = I;
      S("updated", [E, {
        updateHints: {
          sizeChanged: !!R,
          directionChanged: !!B,
          heightIntrinsicChanged: !!U,
          overflowEdgeChanged: !!st,
          overflowAmountChanged: !!M,
          overflowStyleChanged: !!x,
          scrollCoordinatesChanged: !!f,
          contentMutation: !!Y,
          hostMutation: !!Q,
          appear: !!W
        },
        changedOptions: w || {},
        force: !!C
      }]);
    }, (w) => S("scroll", [E, w])), P = (w) => {
      xn(n), gt(i), l = !0, S("destroyed", [E, w]), m(), O();
    }, E = {
      options(w, C) {
        if (w) {
          const _ = C ? s() : {}, I = Zs(p, j(_, c(w)));
          Pe(I) || (j(p, I), b({
            pn: I
          }));
        }
        return j({}, p);
      },
      on: $,
      off: (w, C) => {
        w && C && O(w, C);
      },
      state() {
        const { gn: w, hn: C } = A(), { B: _ } = w, { Vt: I, Rt: R, cn: B, j: U, rn: Y, fn: Q, Dt: W } = C;
        return j({}, {
          overflowEdge: I,
          overflowAmount: R,
          overflowStyle: B,
          hasOverflow: U,
          scrollCoordinates: {
            start: W.D,
            end: W.M
          },
          padding: Y,
          paddingAbsolute: Q,
          directionRTL: _,
          destroyed: l
        });
      },
      elements() {
        const { dt: w, vt: C, rn: _, L: I, ht: R, gt: B, Kt: U } = T.bn, { jt: Y, Jt: Q } = T.wn, W = (M) => {
          const { Mt: x, Ut: f, Lt: z } = M;
          return {
            scrollbar: z,
            track: f,
            handle: x
          };
        }, st = (M) => {
          const { Xt: x, Yt: f } = M, z = W(x[0]);
          return j({}, z, {
            clone: () => {
              const v = W(f());
              return b({
                vn: !0
              }), v;
            }
          });
        };
        return j({}, {
          target: w,
          host: C,
          padding: _ || I,
          viewport: I,
          content: R || I,
          scrollOffsetElement: B,
          scrollEventElement: U,
          scrollbarHorizontal: st(Y),
          scrollbarVertical: st(Q)
        });
      },
      update: (w) => b({
        It: w,
        Tt: !0
      }),
      destroy: L(P, !1),
      plugin: (w) => u[wt(w)[0]]
    };
    return et(i, [H]), wn(n, E), Bs(Rs, Mt, [E, y, u]), dn(T.bn.bt, !r && t.cancel) ? (P(!0), E) : (et(i, V()), S("initialized", [E]), E.update(), E);
  }
  return a;
};
Mt.plugin = (t) => {
  const o = _t(t), e = o ? t : [t], s = e.map((r) => Bs(r, Mt)[0]);
  return Dr(e), o ? s : s[0];
};
Mt.valid = (t) => {
  const o = t && t.elements, e = xt(o) && o();
  return qo(e) && !!er(e.target);
};
Mt.env = () => {
  const { P: t, k: o, U: e, J: s, ot: r, st: n, K: a, Z: l, tt: i, nt: u } = At();
  return j({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: o,
    scrollbarsHiding: e,
    scrollTimeline: s,
    staticDefaultInitialization: r,
    staticDefaultOptions: n,
    getDefaultInitialization: a,
    setDefaultInitialization: l,
    getDefaultOptions: i,
    setDefaultOptions: u
  });
};
Mt.nonce = sn;
Mt.trustedTypePolicy = $r;
const Sn = zs`
  :host {
    --width: 31rem;
    --header-spacing: var(--cx-spacing-small) var(--cx-spacing-large);
    --body-spacing: var(--cx-spacing-medium) var(--cx-spacing-large);
    --divider-spacing: 0 var(--cx-spacing-large);
    --footer-spacing: var(--cx-spacing-large);

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--cx-z-index-dialog);
  }

  .dialog--absolute {
    position: absolute;
  }

  .dialog__panel {
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--cx-spacing-2x-large));
    max-height: calc(100% - var(--cx-spacing-2x-large));
    background-color: var(--cx-panel-background-color);
    border-radius: var(--cx-border-radius-medium);
    box-shadow: var(--cx-shadow-x-large);
  }

  .dialog__panel:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog__panel {
      max-height: 80vh;
    }
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    display: flex;
    padding: var(--header-spacing);
  }

  .dialog__header-divider {
    --spacing: 0;
    padding: var(--divider-spacing);
  }

  .dialog__title {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    font: inherit;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-large);
    margin: 0;
  }

  .dialog__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--cx-spacing-2x-small);
  }

  .dialog__header-actions cx-icon-button,
  .dialog__header-actions ::slotted(cx-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-3x-large);
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-small);
    position: relative;
  }

  .dialog--overlay-scrollbar .dialog__body {
    display: flex;
    flex-direction: column;
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer ::slotted(cx-button:not(:first-of-type)) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--cx-overlay-background-color);
  }

  .dialog--absolute .dialog__overlay {
    position: absolute;
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--cx-color-neutral-0);
    }
  }
`;
var zn = Object.defineProperty, Cn = Object.getOwnPropertyDescriptor, St = (t, o, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Cn(o, e) : o, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(o, e, r) : a(r)) || r);
  return s && r && zn(o, e, r), r;
};
Mt.plugin({
  ClickScroll: tn,
  ScrollbarsHiding: Jr,
  SizeObserver: Zr
});
let ft = class extends ir {
  constructor() {
    super(...arguments), this.hasSlotController = new ur(this, "footer"), this.localize = new hr(this), this.modal = new pr(this), this.open = !1, this.label = "", this.noHeader = !1, this.strategy = "fixed", this.useOverlayScrollbar = !1, this.osInstance = null, this.handleDocumentKeyDown = (t) => {
      t.key === "Escape" && this.modal.isActive() && this.open && (t.stopPropagation(), this.requestClose("keyboard"));
    };
  }
  firstUpdated() {
    this.dialog.hidden = !this.open, this.open && (this.addOpenListeners(), this.modal.activate(), Je(this));
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.modal.deactivate(), ts(this), (t = this.closeWatcher) == null || t.destroy();
  }
  requestClose(t) {
    if (this.emit("cx-request-close", {
      cancelable: !0,
      detail: { source: t }
    }).defaultPrevented) {
      const e = no(this, "dialog.denyClose", {
        dir: this.localize.dir()
      });
      ro(this.panel, e.keyframes, e.options);
      return;
    }
    this.hide();
  }
  addOpenListeners() {
    var t;
    "CloseWatcher" in window ? ((t = this.closeWatcher) == null || t.destroy(), this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => this.requestClose("keyboard")) : document.addEventListener("keydown", this.handleDocumentKeyDown);
  }
  removeOpenListeners() {
    var t;
    (t = this.closeWatcher) == null || t.destroy(), document.removeEventListener("keydown", this.handleDocumentKeyDown);
  }
  async handleOpenChange() {
    var t;
    if (this.open) {
      this.emit("cx-show"), this.addOpenListeners(), this.originalTrigger = document.activeElement, this.modal.activate(), this.useOverlayScrollbar && (this.osInstance = Mt(this.body, {
        scrollbars: {
          autoHide: "scroll",
          autoHideDelay: 1e3
        }
      })), Je(this);
      const o = this.querySelector("[autofocus]");
      o && o.removeAttribute("autofocus"), await Promise.all([
        Do(this.dialog),
        Do(this.overlay)
      ]), this.dialog.hidden = !1, requestAnimationFrame(() => {
        this.emit("cx-initial-focus", {
          cancelable: !0
        }).defaultPrevented || (o ? o.focus({
          preventScroll: !0
        }) : this.panel.focus({ preventScroll: !0 })), o && o.setAttribute("autofocus", "");
      });
      const e = no(this, "dialog.show", {
        dir: this.localize.dir()
      }), s = no(this, "dialog.overlay.show", {
        dir: this.localize.dir()
      });
      await Promise.all([
        ro(this.panel, e.keyframes, e.options),
        ro(
          this.overlay,
          s.keyframes,
          s.options
        )
      ]), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), this.modal.deactivate(), (t = this.osInstance) == null || t.destroy(), await Promise.all([
        Do(this.dialog),
        Do(this.overlay)
      ]);
      const o = no(this, "dialog.hide", {
        dir: this.localize.dir()
      }), e = no(this, "dialog.overlay.hide", {
        dir: this.localize.dir()
      });
      await Promise.all([
        ro(
          this.overlay,
          e.keyframes,
          e.options
        ).then(() => {
          this.overlay.hidden = !0;
        }),
        ro(
          this.panel,
          o.keyframes,
          o.options
        ).then(() => {
          this.panel.hidden = !0;
        })
      ]), this.dialog.hidden = !0, this.overlay.hidden = !1, this.panel.hidden = !1, ts(this);
      const s = this.originalTrigger;
      typeof (s == null ? void 0 : s.focus) == "function" && setTimeout(() => s.focus()), this.emit("cx-after-hide");
    }
  }
  /** Shows the dialog. */
  async show() {
    if (!this.open)
      return this.open = !0, Ge(this, "cx-after-show");
  }
  /** Hides the dialog */
  async hide() {
    if (this.open)
      return this.open = !1, Ge(this, "cx-after-hide");
  }
  render() {
    return Ze`
      <div
        part="base"
        class=${vr({
      dialog: !0,
      "dialog--absolute": this.strategy === "absolute",
      "dialog--has-footer": this.hasSlotController.test("footer"),
      "dialog--open": this.open,
      "dialog--overlay-scrollbar": this.useOverlayScrollbar
    })}
      >
        <div
          part="overlay"
          class="dialog__overlay"
          @click=${() => this.requestClose("overlay")}
          tabindex="-1"
        ></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${os(this.noHeader ? this.label : void 0)}
          aria-labelledby=${os(this.noHeader ? void 0 : "title")}
          tabindex="-1"
        >
          ${this.noHeader ? "" : Ze`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label">
                      ${this.label.length > 0 ? this.label : "\uFEFF"}
                    </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <cx-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="close"
                      label=${this.localize.term("close")}
                      @click="${() => this.requestClose("close-button")}"
                    ></cx-icon-button>
                  </div>
                </header>
                <cx-divider class="dialog__header-divider"></cx-divider>
              `}
          ${""}
          <div part="body" class="dialog__body" tabindex="-1">
            <slot></slot>
          </div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `;
  }
};
ft.styles = [
  dr,
  yr,
  Sn
];
ft.dependencies = {
  "cx-divider": br,
  "cx-icon-button": gr
};
St([
  bo(".dialog")
], ft.prototype, "dialog", 2);
St([
  bo(".dialog__panel")
], ft.prototype, "panel", 2);
St([
  bo(".dialog__overlay")
], ft.prototype, "overlay", 2);
St([
  bo(".dialog__body")
], ft.prototype, "body", 2);
St([
  bo('slot[name="footer"]')
], ft.prototype, "footerSlot", 2);
St([
  ho({ reflect: !0, type: Boolean })
], ft.prototype, "open", 2);
St([
  ho({ reflect: !0 })
], ft.prototype, "label", 2);
St([
  ho({ attribute: "no-header", reflect: !0, type: Boolean })
], ft.prototype, "noHeader", 2);
St([
  ho({ reflect: !0 })
], ft.prototype, "strategy", 2);
St([
  ho({
    attribute: "use-overlay-scrollbar",
    reflect: !0,
    type: Boolean
  })
], ft.prototype, "useOverlayScrollbar", 2);
St([
  fr("open", { waitUntilFirstUpdate: !0 })
], ft.prototype, "handleOpenChange", 1);
ft = St([
  lr("cx-dialog")
], ft);
go("dialog.show", {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 250, easing: "ease" }
});
go("dialog.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 }
  ],
  options: { duration: 250, easing: "ease" }
});
go("dialog.denyClose", {
  keyframes: [{ scale: 1 }, { scale: 1.02 }, { scale: 1 }],
  options: { duration: 250 }
});
go("dialog.overlay.show", {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 }
});
go("dialog.overlay.hide", {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 }
});
export {
  ft as default
};
