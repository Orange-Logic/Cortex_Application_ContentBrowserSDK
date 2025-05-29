var Z = (r) => {
  throw TypeError(r);
};
var lt = (r, t, e) => t.has(r) || Z("Cannot " + e);
var X = (r, t, e) => (lt(r, t, "read from private field"), e ? e.call(r) : t.get(r)), W = (r, t, e) => t.has(r) ? Z("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(r) : t.set(r, e);
import { C as ot } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as ht } from "../chunks/component.styles.BLcT4bOa.js";
import { f as pt } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as dt } from "../chunks/default-value.BaUjiOTd.js";
import { F as ct } from "../chunks/form.CBFaCEBn.js";
import { H as ft } from "../chunks/slot.DJLm4Dig.js";
import { w as j } from "../chunks/watch.ChG-_stu.js";
import { x as B } from "../chunks/lit-element.DRlPF2me.js";
import { n as f } from "../chunks/property.CtZ87in4.js";
import { r as K } from "../chunks/state.-o_YRGMi.js";
import { e as q } from "../chunks/query.BNveAlQo.js";
import { e as P } from "../chunks/class-map.Cn0czwWq.js";
import { o as g } from "../chunks/if-defined.D8U9hdvp.js";
import { l as mt } from "../chunks/live.C0NiCo2U.js";
import { L as kt } from "../chunks/localize.DV9I313e.js";
import gt from "./icon.component.js";
import _t from "./input.styles.js";
function x(r) {
  return typeof r == "string" || r instanceof String;
}
function J(r) {
  var t;
  return typeof r == "object" && r != null && (r == null || (t = r.constructor) == null ? void 0 : t.name) === "Object";
}
function tt(r, t) {
  return Array.isArray(t) ? tt(r, (e, s) => t.includes(s)) : Object.entries(r).reduce((e, s) => {
    let [i, a] = s;
    return t(a, i) && (e[i] = a), e;
  }, {});
}
const o = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT"
};
function vt(r) {
  switch (r) {
    case o.LEFT:
      return o.FORCE_LEFT;
    case o.RIGHT:
      return o.FORCE_RIGHT;
    default:
      return r;
  }
}
function z(r) {
  return r.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function D(r, t) {
  if (t === r) return !0;
  const e = Array.isArray(t), s = Array.isArray(r);
  let i;
  if (e && s) {
    if (t.length != r.length) return !1;
    for (i = 0; i < t.length; i++) if (!D(t[i], r[i])) return !1;
    return !0;
  }
  if (e != s) return !1;
  if (t && r && typeof t == "object" && typeof r == "object") {
    const a = t instanceof Date, n = r instanceof Date;
    if (a && n) return t.getTime() == r.getTime();
    if (a != n) return !1;
    const u = t instanceof RegExp, l = r instanceof RegExp;
    if (u && l) return t.toString() == r.toString();
    if (u != l) return !1;
    const d = Object.keys(t);
    for (i = 0; i < d.length; i++) if (!Object.prototype.hasOwnProperty.call(r, d[i])) return !1;
    for (i = 0; i < d.length; i++) if (!D(r[d[i]], t[d[i]])) return !1;
    return !0;
  } else if (t && r && typeof t == "function" && typeof r == "function")
    return t.toString() === r.toString();
  return !1;
}
class Ct {
  /** Current input value */
  /** Current cursor position */
  /** Old input value */
  /** Old selection */
  constructor(t) {
    for (Object.assign(this, t); this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos); )
      --this.oldSelection.start;
    if (this.insertedCount)
      for (; this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end); )
        this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end ? ++this.oldSelection.end : ++this.cursorPos;
  }
  /** Start changing position */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  /** Inserted symbols count */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  /** Inserted symbols */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  /** Removed symbols count */
  get removedCount() {
    return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
    this.oldValue.length - this.value.length, 0);
  }
  /** Removed symbols */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  /** Unchanged head symbols */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  /** Unchanged tail symbols */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  /** Remove direction */
  get removeDirection() {
    return !this.removedCount || this.insertedCount ? o.NONE : (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
    this.oldSelection.end === this.oldSelection.start ? o.RIGHT : o.LEFT;
  }
}
function c(r, t) {
  return new c.InputMask(r, t);
}
function et(r) {
  if (r == null) throw new Error("mask property should be defined");
  return r instanceof RegExp ? c.MaskedRegExp : x(r) ? c.MaskedPattern : r === Date ? c.MaskedDate : r === Number ? c.MaskedNumber : Array.isArray(r) || r === Array ? c.MaskedDynamic : c.Masked && r.prototype instanceof c.Masked ? r : c.Masked && r instanceof c.Masked ? r.constructor : r instanceof Function ? c.MaskedFunction : (console.warn("Mask not found for mask", r), c.Masked);
}
function I(r) {
  if (!r) throw new Error("Options in not defined");
  if (c.Masked) {
    if (r.prototype instanceof c.Masked) return {
      mask: r
    };
    const {
      mask: t = void 0,
      ...e
    } = r instanceof c.Masked ? {
      mask: r
    } : J(r) && r.mask instanceof c.Masked ? r : {};
    if (t) {
      const s = t.mask;
      return {
        ...tt(t, (i, a) => !a.startsWith("_")),
        mask: t.constructor,
        _mask: s,
        ...e
      };
    }
  }
  return J(r) ? {
    ...r
  } : {
    mask: r
  };
}
function b(r) {
  if (c.Masked && r instanceof c.Masked) return r;
  const t = I(r), e = et(t.mask);
  if (!e) throw new Error("Masked class is not found for provided mask " + t.mask + ", appropriate module needs to be imported manually before creating mask.");
  return t.mask === e && delete t.mask, t._mask && (t.mask = t._mask, delete t._mask), new e(t);
}
c.createMask = b;
class G {
  /** */
  /** */
  /** */
  /** Safely returns selection start */
  get selectionStart() {
    let t;
    try {
      t = this._unsafeSelectionStart;
    } catch {
    }
    return t ?? this.value.length;
  }
  /** Safely returns selection end */
  get selectionEnd() {
    let t;
    try {
      t = this._unsafeSelectionEnd;
    } catch {
    }
    return t ?? this.value.length;
  }
  /** Safely sets element selection */
  select(t, e) {
    if (!(t == null || e == null || t === this.selectionStart && e === this.selectionEnd))
      try {
        this._unsafeSelect(t, e);
      } catch {
      }
  }
  /** */
  get isActive() {
    return !1;
  }
  /** */
  /** */
  /** */
}
c.MaskElement = G;
const Q = 90, Et = 89;
class O extends G {
  /** HTMLElement to use mask on */
  constructor(t) {
    super(), this.input = t, this._onKeydown = this._onKeydown.bind(this), this._onInput = this._onInput.bind(this), this._onBeforeinput = this._onBeforeinput.bind(this), this._onCompositionEnd = this._onCompositionEnd.bind(this);
  }
  get rootElement() {
    var t, e, s;
    return (t = (e = (s = this.input).getRootNode) == null ? void 0 : e.call(s)) != null ? t : document;
  }
  /** Is element in focus */
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  /** Binds HTMLElement events to mask internal events */
  bindEvents(t) {
    this.input.addEventListener("keydown", this._onKeydown), this.input.addEventListener("input", this._onInput), this.input.addEventListener("beforeinput", this._onBeforeinput), this.input.addEventListener("compositionend", this._onCompositionEnd), this.input.addEventListener("drop", t.drop), this.input.addEventListener("click", t.click), this.input.addEventListener("focus", t.focus), this.input.addEventListener("blur", t.commit), this._handlers = t;
  }
  _onKeydown(t) {
    if (this._handlers.redo && (t.keyCode === Q && t.shiftKey && (t.metaKey || t.ctrlKey) || t.keyCode === Et && t.ctrlKey))
      return t.preventDefault(), this._handlers.redo(t);
    if (this._handlers.undo && t.keyCode === Q && (t.metaKey || t.ctrlKey))
      return t.preventDefault(), this._handlers.undo(t);
    t.isComposing || this._handlers.selectionChange(t);
  }
  _onBeforeinput(t) {
    if (t.inputType === "historyUndo" && this._handlers.undo)
      return t.preventDefault(), this._handlers.undo(t);
    if (t.inputType === "historyRedo" && this._handlers.redo)
      return t.preventDefault(), this._handlers.redo(t);
  }
  _onCompositionEnd(t) {
    this._handlers.input(t);
  }
  _onInput(t) {
    t.isComposing || this._handlers.input(t);
  }
  /** Unbinds HTMLElement events to mask internal events */
  unbindEvents() {
    this.input.removeEventListener("keydown", this._onKeydown), this.input.removeEventListener("input", this._onInput), this.input.removeEventListener("beforeinput", this._onBeforeinput), this.input.removeEventListener("compositionend", this._onCompositionEnd), this.input.removeEventListener("drop", this._handlers.drop), this.input.removeEventListener("click", this._handlers.click), this.input.removeEventListener("focus", this._handlers.focus), this.input.removeEventListener("blur", this._handlers.commit), this._handlers = {};
  }
}
c.HTMLMaskElement = O;
class yt extends O {
  /** InputElement to use mask on */
  constructor(t) {
    super(t), this.input = t;
  }
  /** Returns InputElement selection start */
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
  }
  /** Returns InputElement selection end */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  /** Sets InputElement selection */
  _unsafeSelect(t, e) {
    this.input.setSelectionRange(t, e);
  }
  get value() {
    return this.input.value;
  }
  set value(t) {
    this.input.value = t;
  }
}
c.HTMLMaskElement = O;
class st extends O {
  /** Returns HTMLElement selection start */
  get _unsafeSelectionStart() {
    const t = this.rootElement, e = t.getSelection && t.getSelection(), s = e && e.anchorOffset, i = e && e.focusOffset;
    return i == null || s == null || s < i ? s : i;
  }
  /** Returns HTMLElement selection end */
  get _unsafeSelectionEnd() {
    const t = this.rootElement, e = t.getSelection && t.getSelection(), s = e && e.anchorOffset, i = e && e.focusOffset;
    return i == null || s == null || s > i ? s : i;
  }
  /** Sets HTMLElement selection */
  _unsafeSelect(t, e) {
    if (!this.rootElement.createRange) return;
    const s = this.rootElement.createRange();
    s.setStart(this.input.firstChild || this.input, t), s.setEnd(this.input.lastChild || this.input, e);
    const i = this.rootElement, a = i.getSelection && i.getSelection();
    a && (a.removeAllRanges(), a.addRange(s));
  }
  /** HTMLElement value */
  get value() {
    return this.input.textContent || "";
  }
  set value(t) {
    this.input.textContent = t;
  }
}
c.HTMLContenteditableMaskElement = st;
class L {
  constructor() {
    this.states = [], this.currentIndex = 0;
  }
  get currentState() {
    return this.states[this.currentIndex];
  }
  get isEmpty() {
    return this.states.length === 0;
  }
  push(t) {
    this.currentIndex < this.states.length - 1 && (this.states.length = this.currentIndex + 1), this.states.push(t), this.states.length > L.MAX_LENGTH && this.states.shift(), this.currentIndex = this.states.length - 1;
  }
  go(t) {
    return this.currentIndex = Math.min(Math.max(this.currentIndex + t, 0), this.states.length - 1), this.currentState;
  }
  undo() {
    return this.go(-1);
  }
  redo() {
    return this.go(1);
  }
  clear() {
    this.states.length = 0, this.currentIndex = 0;
  }
}
L.MAX_LENGTH = 100;
class At {
  /**
    View element
  */
  /** Internal {@link Masked} model */
  constructor(t, e) {
    this.el = t instanceof G ? t : t.isContentEditable && t.tagName !== "INPUT" && t.tagName !== "TEXTAREA" ? new st(t) : new yt(t), this.masked = b(e), this._listeners = {}, this._value = "", this._unmaskedValue = "", this._rawInputValue = "", this.history = new L(), this._saveSelection = this._saveSelection.bind(this), this._onInput = this._onInput.bind(this), this._onChange = this._onChange.bind(this), this._onDrop = this._onDrop.bind(this), this._onFocus = this._onFocus.bind(this), this._onClick = this._onClick.bind(this), this._onUndo = this._onUndo.bind(this), this._onRedo = this._onRedo.bind(this), this.alignCursor = this.alignCursor.bind(this), this.alignCursorFriendly = this.alignCursorFriendly.bind(this), this._bindEvents(), this.updateValue(), this._onChange();
  }
  maskEquals(t) {
    var e;
    return t == null || ((e = this.masked) == null ? void 0 : e.maskEquals(t));
  }
  /** Masked */
  get mask() {
    return this.masked.mask;
  }
  set mask(t) {
    if (this.maskEquals(t)) return;
    if (!(t instanceof c.Masked) && this.masked.constructor === et(t)) {
      this.masked.updateOptions({
        mask: t
      });
      return;
    }
    const e = t instanceof c.Masked ? t : b({
      mask: t
    });
    e.unmaskedValue = this.masked.unmaskedValue, this.masked = e;
  }
  /** Raw value */
  get value() {
    return this._value;
  }
  set value(t) {
    this.value !== t && (this.masked.value = t, this.updateControl("auto"));
  }
  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(t) {
    this.unmaskedValue !== t && (this.masked.unmaskedValue = t, this.updateControl("auto"));
  }
  /** Raw input value */
  get rawInputValue() {
    return this._rawInputValue;
  }
  set rawInputValue(t) {
    this.rawInputValue !== t && (this.masked.rawInputValue = t, this.updateControl(), this.alignCursor());
  }
  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(t) {
    this.masked.typedValueEquals(t) || (this.masked.typedValue = t, this.updateControl("auto"));
  }
  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }
  /** Starts listening to element events */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange,
      undo: this._onUndo,
      redo: this._onRedo
    });
  }
  /** Stops listening to element events */
  _unbindEvents() {
    this.el && this.el.unbindEvents();
  }
  /** Fires custom event */
  _fireEvent(t, e) {
    const s = this._listeners[t];
    s && s.forEach((i) => i(e));
  }
  /** Current selection start */
  get selectionStart() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
  }
  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
  }
  set cursorPos(t) {
    !this.el || !this.el.isActive || (this.el.select(t, t), this._saveSelection());
  }
  /** Stores current selection */
  _saveSelection() {
    this.displayValue !== this.el.value && console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly."), this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  }
  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value, this._value = this.masked.value, this._unmaskedValue = this.masked.unmaskedValue, this._rawInputValue = this.masked.rawInputValue;
  }
  /** Syncronizes view from model value, fires change events */
  updateControl(t) {
    const e = this.masked.unmaskedValue, s = this.masked.value, i = this.masked.rawInputValue, a = this.displayValue, n = this.unmaskedValue !== e || this.value !== s || this._rawInputValue !== i;
    this._unmaskedValue = e, this._value = s, this._rawInputValue = i, this.el.value !== a && (this.el.value = a), t === "auto" ? this.alignCursor() : t != null && (this.cursorPos = t), n && this._fireChangeEvents(), !this._historyChanging && (n || this.history.isEmpty) && this.history.push({
      unmaskedValue: e,
      selection: {
        start: this.selectionStart,
        end: this.cursorPos
      }
    });
  }
  /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
  updateOptions(t) {
    const {
      mask: e,
      ...s
    } = t, i = !this.maskEquals(e), a = this.masked.optionsIsChanged(s);
    i && (this.mask = e), a && this.masked.updateOptions(s), (i || a) && this.updateControl();
  }
  /** Updates cursor */
  updateCursor(t) {
    t != null && (this.cursorPos = t, this._delayUpdateCursor(t));
  }
  /** Delays cursor update to support mobile browsers */
  _delayUpdateCursor(t) {
    this._abortUpdateCursor(), this._changingCursorPos = t, this._cursorChanging = setTimeout(() => {
      this.el && (this.cursorPos = this._changingCursorPos, this._abortUpdateCursor());
    }, 10);
  }
  /** Fires custom events */
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent), this.masked.isComplete && this._fireEvent("complete", this._inputEvent);
  }
  /** Aborts delayed cursor update */
  _abortUpdateCursor() {
    this._cursorChanging && (clearTimeout(this._cursorChanging), delete this._cursorChanging);
  }
  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, o.LEFT));
  }
  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    this.selectionStart === this.cursorPos && this.alignCursor();
  }
  /** Adds listener on custom event */
  on(t, e) {
    return this._listeners[t] || (this._listeners[t] = []), this._listeners[t].push(e), this;
  }
  /** Removes custom event listener */
  off(t, e) {
    if (!this._listeners[t]) return this;
    if (!e)
      return delete this._listeners[t], this;
    const s = this._listeners[t].indexOf(e);
    return s >= 0 && this._listeners[t].splice(s, 1), this;
  }
  /** Handles view input event */
  _onInput(t) {
    this._inputEvent = t, this._abortUpdateCursor();
    const e = new Ct({
      // new state
      value: this.el.value,
      cursorPos: this.cursorPos,
      // old state
      oldValue: this.displayValue,
      oldSelection: this._selection
    }), s = this.masked.rawInputValue, i = this.masked.splice(e.startChangePos, e.removed.length, e.inserted, e.removeDirection, {
      input: !0,
      raw: !0
    }).offset, a = s === this.masked.rawInputValue ? e.removeDirection : o.NONE;
    let n = this.masked.nearestInputPos(e.startChangePos + i, a);
    a !== o.NONE && (n = this.masked.nearestInputPos(n, o.NONE)), this.updateControl(n), delete this._inputEvent;
  }
  /** Handles view change event and commits model value */
  _onChange() {
    this.displayValue !== this.el.value && this.updateValue(), this.masked.doCommit(), this.updateControl(), this._saveSelection();
  }
  /** Handles view drop event, prevents by default */
  _onDrop(t) {
    t.preventDefault(), t.stopPropagation();
  }
  /** Restore last selection on focus */
  _onFocus(t) {
    this.alignCursorFriendly();
  }
  /** Restore last selection on focus */
  _onClick(t) {
    this.alignCursorFriendly();
  }
  _onUndo() {
    this._applyHistoryState(this.history.undo());
  }
  _onRedo() {
    this._applyHistoryState(this.history.redo());
  }
  _applyHistoryState(t) {
    t && (this._historyChanging = !0, this.unmaskedValue = t.unmaskedValue, this.el.select(t.selection.start, t.selection.end), this._saveSelection(), this._historyChanging = !1);
  }
  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents(), this._listeners.length = 0, delete this.el;
  }
}
c.InputMask = At;
class m {
  /** Inserted symbols */
  /** Additional offset if any changes occurred before tail */
  /** Raw inserted is used by dynamic mask */
  /** Can skip chars */
  static normalize(t) {
    return Array.isArray(t) ? t : [t, new m()];
  }
  constructor(t) {
    Object.assign(this, {
      inserted: "",
      rawInserted: "",
      tailShift: 0,
      skip: !1
    }, t);
  }
  /** Aggregate changes */
  aggregate(t) {
    return this.inserted += t.inserted, this.rawInserted += t.rawInserted, this.tailShift += t.tailShift, this.skip = this.skip || t.skip, this;
  }
  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
  get consumed() {
    return !!this.rawInserted || this.skip;
  }
  equals(t) {
    return this.inserted === t.inserted && this.tailShift === t.tailShift && this.rawInserted === t.rawInserted && this.skip === t.skip;
  }
}
c.ChangeDetails = m;
class A {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor(t, e, s) {
    t === void 0 && (t = ""), e === void 0 && (e = 0), this.value = t, this.from = e, this.stop = s;
  }
  toString() {
    return this.value;
  }
  extend(t) {
    this.value += String(t);
  }
  appendTo(t) {
    return t.append(this.toString(), {
      tail: !0
    }).aggregate(t._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop
    };
  }
  set state(t) {
    Object.assign(this, t);
  }
  unshift(t) {
    if (!this.value.length || t != null && this.from >= t) return "";
    const e = this.value[0];
    return this.value = this.value.slice(1), e;
  }
  shift() {
    if (!this.value.length) return "";
    const t = this.value[this.value.length - 1];
    return this.value = this.value.slice(0, -1), t;
  }
}
class v {
  /** */
  /** */
  /** Transforms value before mask processing */
  /** Transforms each char before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing at the end of editing */
  /** Format typed value to string */
  /** Parse string to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** */
  constructor(t) {
    this._value = "", this._update({
      ...v.DEFAULTS,
      ...t
    }), this._initialized = !0;
  }
  /** Sets and applies new options */
  updateOptions(t) {
    this.optionsIsChanged(t) && this.withValueRefresh(this._update.bind(this, t));
  }
  /** Sets new options */
  _update(t) {
    Object.assign(this, t);
  }
  /** Mask state */
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(t) {
    this._value = t._value;
  }
  /** Resets value */
  reset() {
    this._value = "";
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this.resolve(t, {
      input: !0
    });
  }
  /** Resolve new value */
  resolve(t, e) {
    e === void 0 && (e = {
      input: !0
    }), this.reset(), this.append(t, e, ""), this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(t) {
    this.resolve(t, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(t) {
    this.format ? this.value = this.format(t, this) : this.unmaskedValue = String(t);
  }
  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, {
      raw: !0
    });
  }
  set rawInputValue(t) {
    this.resolve(t, {
      raw: !0
    });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return this.isComplete;
  }
  /** Finds nearest input position in direction */
  nearestInputPos(t, e) {
    return t;
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), Math.min(this.displayValue.length, e - t);
  }
  /** Extracts value in range considering flags */
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), this.displayValue.slice(t, e);
  }
  /** Extracts tail in range */
  extractTail(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), new A(this.extractInput(t, e), t);
  }
  /** Appends tail */
  appendTail(t) {
    return x(t) && (t = new A(String(t))), t.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(t, e) {
    return t ? (this._value += t, new m({
      inserted: t,
      rawInserted: t
    })) : new m();
  }
  /** Appends char */
  _appendChar(t, e, s) {
    e === void 0 && (e = {});
    const i = this.state;
    let a;
    if ([t, a] = this.doPrepareChar(t, e), t && (a = a.aggregate(this._appendCharRaw(t, e)), !a.rawInserted && this.autofix === "pad")) {
      const n = this.state;
      this.state = i;
      let u = this.pad(e);
      const l = this._appendCharRaw(t, e);
      u = u.aggregate(l), l.rawInserted || u.equals(a) ? a = u : this.state = n;
    }
    if (a.inserted) {
      let n, u = this.doValidate(e) !== !1;
      if (u && s != null) {
        const l = this.state;
        if (this.overwrite === !0) {
          n = s.state;
          for (let k = 0; k < a.rawInserted.length; ++k)
            s.unshift(this.displayValue.length - a.tailShift);
        }
        let d = this.appendTail(s);
        if (u = d.rawInserted.length === s.toString().length, !(u && d.inserted) && this.overwrite === "shift") {
          this.state = l, n = s.state;
          for (let k = 0; k < a.rawInserted.length; ++k)
            s.shift();
          d = this.appendTail(s), u = d.rawInserted.length === s.toString().length;
        }
        u && d.inserted && (this.state = l);
      }
      u || (a = new m(), this.state = i, s && n && (s.state = n));
    }
    return a;
  }
  /** Appends optional placeholder at the end */
  _appendPlaceholder() {
    return new m();
  }
  /** Appends optional eager placeholder at the end */
  _appendEager() {
    return new m();
  }
  /** Appends symbols considering flags */
  append(t, e, s) {
    if (!x(t)) throw new Error("value should be string");
    const i = x(s) ? new A(String(s)) : s;
    e != null && e.tail && (e._beforeTailState = this.state);
    let a;
    [t, a] = this.doPrepare(t, e);
    for (let n = 0; n < t.length; ++n) {
      const u = this._appendChar(t[n], e, i);
      if (!u.rawInserted && !this.doSkipInvalid(t[n], e, i)) break;
      a.aggregate(u);
    }
    return (this.eager === !0 || this.eager === "append") && e != null && e.input && t && a.aggregate(this._appendEager()), i != null && (a.tailShift += this.appendTail(i).tailShift), a;
  }
  remove(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), this._value = this.displayValue.slice(0, t) + this.displayValue.slice(e), new m();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(t) {
    if (this._refreshing || !this._initialized) return t();
    this._refreshing = !0;
    const e = this.rawInputValue, s = this.value, i = t();
    return this.rawInputValue = e, this.value && this.value !== s && s.indexOf(this.value) === 0 && (this.append(s.slice(this.displayValue.length), {}, ""), this.doCommit()), delete this._refreshing, i;
  }
  runIsolated(t) {
    if (this._isolated || !this._initialized) return t(this);
    this._isolated = !0;
    const e = this.state, s = t(this);
    return this.state = e, delete this._isolated, s;
  }
  doSkipInvalid(t, e, s) {
    return !!this.skipInvalid;
  }
  /** Prepares string before mask processing */
  doPrepare(t, e) {
    return e === void 0 && (e = {}), m.normalize(this.prepare ? this.prepare(t, this, e) : t);
  }
  /** Prepares each char before mask processing */
  doPrepareChar(t, e) {
    return e === void 0 && (e = {}), m.normalize(this.prepareChar ? this.prepareChar(t, this, e) : t);
  }
  /** Validates if value is acceptable */
  doValidate(t) {
    return (!this.validate || this.validate(this.value, this, t)) && (!this.parent || this.parent.doValidate(t));
  }
  /** Does additional processing at the end of editing */
  doCommit() {
    this.commit && this.commit(this.value, this);
  }
  splice(t, e, s, i, a) {
    s === void 0 && (s = ""), i === void 0 && (i = o.NONE), a === void 0 && (a = {
      input: !0
    });
    const n = t + e, u = this.extractTail(n), l = this.eager === !0 || this.eager === "remove";
    let d;
    l && (i = vt(i), d = this.extractInput(0, n, {
      raw: !0
    }));
    let k = t;
    const _ = new m();
    if (i !== o.NONE && (k = this.nearestInputPos(t, e > 1 && t !== 0 && !l ? o.NONE : i), _.tailShift = k - t), _.aggregate(this.remove(k)), l && i !== o.NONE && d === this.rawInputValue)
      if (i === o.FORCE_LEFT) {
        let E;
        for (; d === this.rawInputValue && (E = this.displayValue.length); )
          _.aggregate(new m({
            tailShift: -1
          })).aggregate(this.remove(E - 1));
      } else i === o.FORCE_RIGHT && u.unshift();
    return _.aggregate(this.append(s, a, u));
  }
  maskEquals(t) {
    return this.mask === t;
  }
  optionsIsChanged(t) {
    return !D(this, t);
  }
  typedValueEquals(t) {
    const e = this.typedValue;
    return t === e || v.EMPTY_VALUES.includes(t) && v.EMPTY_VALUES.includes(e) || (this.format ? this.format(t, this) === this.format(this.typedValue, this) : !1);
  }
  pad(t) {
    return new m();
  }
}
v.DEFAULTS = {
  skipInvalid: !0
};
v.EMPTY_VALUES = [void 0, null, ""];
c.Masked = v;
class S {
  /** */
  constructor(t, e) {
    t === void 0 && (t = []), e === void 0 && (e = 0), this.chunks = t, this.from = e;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(t) {
    if (!String(t)) return;
    t = x(t) ? new A(String(t)) : t;
    const e = this.chunks[this.chunks.length - 1], s = e && // if stops are same or tail has no stop
    (e.stop === t.stop || t.stop == null) && // if tail chunk goes just after last chunk
    t.from === e.from + e.toString().length;
    if (t instanceof A)
      s ? e.extend(t.toString()) : this.chunks.push(t);
    else if (t instanceof S) {
      if (t.stop == null) {
        let i;
        for (; t.chunks.length && t.chunks[0].stop == null; )
          i = t.chunks.shift(), i.from += t.from, this.extend(i);
      }
      t.toString() && (t.stop = t.blockIndex, this.chunks.push(t));
    }
  }
  appendTo(t) {
    if (!(t instanceof c.MaskedPattern))
      return new A(this.toString()).appendTo(t);
    const e = new m();
    for (let s = 0; s < this.chunks.length; ++s) {
      const i = this.chunks[s], a = t._mapPosToBlock(t.displayValue.length), n = i.stop;
      let u;
      if (n != null && // if block not found or stop is behind lastBlock
      (!a || a.index <= n) && ((i instanceof S || // for continuous block also check if stop is exist
      t._stops.indexOf(n) >= 0) && e.aggregate(t._appendPlaceholder(n)), u = i instanceof S && t._blocks[n]), u) {
        const l = u.appendTail(i);
        e.aggregate(l);
        const d = i.toString().slice(l.rawInserted.length);
        d && e.aggregate(t.append(d, {
          tail: !0
        }));
      } else
        e.aggregate(t.append(i.toString(), {
          tail: !0
        }));
    }
    return e;
  }
  get state() {
    return {
      chunks: this.chunks.map((t) => t.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(t) {
    const {
      chunks: e,
      ...s
    } = t;
    Object.assign(this, s), this.chunks = e.map((i) => {
      const a = "chunks" in i ? new S() : new A();
      return a.state = i, a;
    });
  }
  unshift(t) {
    if (!this.chunks.length || t != null && this.from >= t) return "";
    const e = t != null ? t - this.from : t;
    let s = 0;
    for (; s < this.chunks.length; ) {
      const i = this.chunks[s], a = i.unshift(e);
      if (i.toString()) {
        if (!a) break;
        ++s;
      } else
        this.chunks.splice(s, 1);
      if (a) return a;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length) return "";
    let t = this.chunks.length - 1;
    for (; 0 <= t; ) {
      const e = this.chunks[t], s = e.shift();
      if (e.toString()) {
        if (!s) break;
        --t;
      } else
        this.chunks.splice(t, 1);
      if (s) return s;
    }
    return "";
  }
}
class Ft {
  constructor(t, e) {
    this.masked = t, this._log = [];
    const {
      offset: s,
      index: i
    } = t._mapPosToBlock(e) || (e < 0 ? (
      // first
      {
        index: 0,
        offset: 0
      }
    ) : (
      // last
      {
        index: this.masked._blocks.length,
        offset: 0
      }
    ));
    this.offset = s, this.index = i, this.ok = !1;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok
    };
  }
  set state(t) {
    Object.assign(this, t);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const t = this._log.pop();
    return t && (this.state = t), t;
  }
  bindBlock() {
    this.block || (this.index < 0 && (this.index = 0, this.offset = 0), this.index >= this.masked._blocks.length && (this.index = this.masked._blocks.length - 1, this.offset = this.block.displayValue.length));
  }
  _pushLeft(t) {
    for (this.pushState(), this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((e = this.block) == null ? void 0 : e.displayValue.length) || 0) {
      var e;
      if (t()) return this.ok = !0;
    }
    return this.ok = !1;
  }
  _pushRight(t) {
    for (this.pushState(), this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0)
      if (t()) return this.ok = !0;
    return this.ok = !1;
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (!(this.block.isFixed || !this.block.value) && (this.offset = this.block.nearestInputPos(this.offset, o.FORCE_LEFT), this.offset !== 0))
        return !0;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (!this.block.isFixed)
        return this.offset = this.block.nearestInputPos(this.offset, o.LEFT), !0;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (!(this.block.isFixed || this.block.isOptional && !this.block.value))
        return this.offset = this.block.nearestInputPos(this.offset, o.LEFT), !0;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (!(this.block.isFixed || !this.block.value) && (this.offset = this.block.nearestInputPos(this.offset, o.FORCE_RIGHT), this.offset !== this.block.value.length))
        return !0;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (!this.block.isFixed)
        return this.offset = this.block.nearestInputPos(this.offset, o.NONE), !0;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (!(this.block.isFixed || this.block.isOptional && !this.block.value))
        return this.offset = this.block.nearestInputPos(this.offset, o.NONE), !0;
    });
  }
}
class it {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(t) {
    Object.assign(this, t), this._value = "", this.isFixed = !0;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = !1, this._value = "";
  }
  remove(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), this._value = this._value.slice(0, t) + this._value.slice(e), this._value || (this._isRawInput = !1), new m();
  }
  nearestInputPos(t, e) {
    e === void 0 && (e = o.NONE);
    const s = 0, i = this._value.length;
    switch (e) {
      case o.LEFT:
      case o.FORCE_LEFT:
        return s;
      case o.NONE:
      case o.RIGHT:
      case o.FORCE_RIGHT:
      default:
        return i;
    }
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), this._isRawInput ? e - t : 0;
  }
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), s === void 0 && (s = {}), s.raw && this._isRawInput && this._value.slice(t, e) || "";
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return !!this._value;
  }
  _appendChar(t, e) {
    if (e === void 0 && (e = {}), this.isFilled) return new m();
    const s = this.eager === !0 || this.eager === "append", a = this.char === t && (this.isUnmasking || e.input || e.raw) && (!e.raw || !s) && !e.tail, n = new m({
      inserted: this.char,
      rawInserted: a ? this.char : ""
    });
    return this._value = this.char, this._isRawInput = a && (e.raw || e.input), n;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: !0
    });
  }
  _appendPlaceholder() {
    const t = new m();
    return this.isFilled || (this._value = t.inserted = this.char), t;
  }
  extractTail() {
    return new A("");
  }
  appendTail(t) {
    return x(t) && (t = new A(String(t))), t.appendTo(this);
  }
  append(t, e, s) {
    const i = this._appendChar(t[0], e);
    return s != null && (i.tailShift += this.appendTail(s).tailShift), i;
  }
  doCommit() {
  }
  get state() {
    return {
      _value: this._value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(t) {
    this._value = t._value, this._isRawInput = !!t._rawInputValue;
  }
  pad(t) {
    return this._appendPlaceholder();
  }
}
class M {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(t) {
    const {
      parent: e,
      isOptional: s,
      placeholderChar: i,
      displayChar: a,
      lazy: n,
      eager: u,
      ...l
    } = t;
    this.masked = b(l), Object.assign(this, {
      parent: e,
      isOptional: s,
      placeholderChar: i,
      displayChar: a,
      lazy: n,
      eager: u
    });
  }
  reset() {
    this.isFilled = !1, this.masked.reset();
  }
  remove(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.value.length), t === 0 && e >= 1 ? (this.isFilled = !1, this.masked.remove(t, e)) : new m();
  }
  get value() {
    return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return this.masked.value && this.displayChar || this.value;
  }
  get isComplete() {
    return !!this.masked.value || this.isOptional;
  }
  _appendChar(t, e) {
    if (e === void 0 && (e = {}), this.isFilled) return new m();
    const s = this.masked.state;
    let i = this.masked._appendChar(t, this.currentMaskFlags(e));
    return i.inserted && this.doValidate(e) === !1 && (i = new m(), this.masked.state = s), !i.inserted && !this.isOptional && !this.lazy && !e.input && (i.inserted = this.placeholderChar), i.skip = !i.inserted && !this.isOptional, this.isFilled = !!i.inserted, i;
  }
  append(t, e, s) {
    return this.masked.append(t, this.currentMaskFlags(e), s);
  }
  _appendPlaceholder() {
    return this.isFilled || this.isOptional ? new m() : (this.isFilled = !0, new m({
      inserted: this.placeholderChar
    }));
  }
  _appendEager() {
    return new m();
  }
  extractTail(t, e) {
    return this.masked.extractTail(t, e);
  }
  appendTail(t) {
    return this.masked.appendTail(t);
  }
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.value.length), this.masked.extractInput(t, e, s);
  }
  nearestInputPos(t, e) {
    e === void 0 && (e = o.NONE);
    const s = 0, i = this.value.length, a = Math.min(Math.max(t, s), i);
    switch (e) {
      case o.LEFT:
      case o.FORCE_LEFT:
        return this.isComplete ? a : s;
      case o.RIGHT:
      case o.FORCE_RIGHT:
        return this.isComplete ? a : i;
      case o.NONE:
      default:
        return a;
    }
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.value.length), this.value.slice(t, e).length;
  }
  doValidate(t) {
    return this.masked.doValidate(this.currentMaskFlags(t)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(t)));
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(t) {
    this.masked.state = t.masked, this.isFilled = t.isFilled;
  }
  currentMaskFlags(t) {
    var e;
    return {
      ...t,
      _beforeTailState: (t == null || (e = t._beforeTailState) == null ? void 0 : e.masked) || (t == null ? void 0 : t._beforeTailState)
    };
  }
  pad(t) {
    return new m();
  }
}
M.DEFAULT_DEFINITIONS = {
  0: /\d/,
  a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./
};
class bt extends v {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const e = t.mask;
    e && (t.validate = (s) => s.search(e) >= 0), super._update(t);
  }
}
c.MaskedRegExp = bt;
class C extends v {
  /** */
  /** */
  /** Single char for empty input */
  /** Single char for filled input */
  /** Show placeholder only when needed */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(t) {
    super({
      ...C.DEFAULTS,
      ...t,
      definitions: Object.assign({}, M.DEFAULT_DEFINITIONS, t == null ? void 0 : t.definitions)
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    t.definitions = Object.assign({}, this.definitions, t.definitions), super._update(t), this._rebuildMask();
  }
  _rebuildMask() {
    const t = this.definitions;
    this._blocks = [], this.exposeBlock = void 0, this._stops = [], this._maskedBlocks = {};
    const e = this.mask;
    if (!e || !t) return;
    let s = !1, i = !1;
    for (let a = 0; a < e.length; ++a) {
      if (this.blocks) {
        const d = e.slice(a), k = Object.keys(this.blocks).filter((E) => d.indexOf(E) === 0);
        k.sort((E, w) => w.length - E.length);
        const _ = k[0];
        if (_) {
          const {
            expose: E,
            repeat: w,
            ...ut
          } = I(this.blocks[_]), Y = {
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite,
            autofix: this.autofix,
            ...ut,
            repeat: w,
            parent: this
          }, U = w != null ? new c.RepeatBlock(
            Y
            /* TODO */
          ) : b(Y);
          U && (this._blocks.push(U), E && (this.exposeBlock = U), this._maskedBlocks[_] || (this._maskedBlocks[_] = []), this._maskedBlocks[_].push(this._blocks.length - 1)), a += _.length - 1;
          continue;
        }
      }
      let n = e[a], u = n in t;
      if (n === C.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (n === "{" || n === "}") {
        s = !s;
        continue;
      }
      if (n === "[" || n === "]") {
        i = !i;
        continue;
      }
      if (n === C.ESCAPE_CHAR) {
        if (++a, n = e[a], !n) break;
        u = !1;
      }
      const l = u ? new M({
        isOptional: i,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar,
        ...I(t[n]),
        parent: this
      }) : new it({
        char: n,
        eager: this.eager,
        isUnmasking: s
      });
      this._blocks.push(l);
    }
  }
  get state() {
    return {
      ...super.state,
      _blocks: this._blocks.map((t) => t.state)
    };
  }
  set state(t) {
    if (!t) {
      this.reset();
      return;
    }
    const {
      _blocks: e,
      ...s
    } = t;
    this._blocks.forEach((i, a) => i.state = e[a]), super.state = s;
  }
  reset() {
    super.reset(), this._blocks.forEach((t) => t.reset());
  }
  get isComplete() {
    return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every((t) => t.isComplete);
  }
  get isFilled() {
    return this._blocks.every((t) => t.isFilled);
  }
  get isFixed() {
    return this._blocks.every((t) => t.isFixed);
  }
  get isOptional() {
    return this._blocks.every((t) => t.isOptional);
  }
  doCommit() {
    this._blocks.forEach((t) => t.doCommit()), super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce((t, e) => t += e.unmaskedValue, "");
  }
  set unmaskedValue(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.unmaskedValue = t, this.appendTail(e), this.doCommit();
    } else super.unmaskedValue = t;
  }
  get value() {
    return this.exposeBlock ? this.exposeBlock.value : (
      // TODO return _value when not in change?
      this._blocks.reduce((t, e) => t += e.value, "")
    );
  }
  set value(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.value = t, this.appendTail(e), this.doCommit();
    } else super.value = t;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.typedValue = t, this.appendTail(e), this.doCommit();
    } else super.typedValue = t;
  }
  get displayValue() {
    return this._blocks.reduce((t, e) => t += e.displayValue, "");
  }
  appendTail(t) {
    return super.appendTail(t).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var t;
    const e = new m();
    let s = (t = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : t.index;
    if (s == null) return e;
    this._blocks[s].isFilled && ++s;
    for (let i = s; i < this._blocks.length; ++i) {
      const a = this._blocks[i]._appendEager();
      if (!a.inserted) break;
      e.aggregate(a);
    }
    return e;
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = this._mapPosToBlock(this.displayValue.length), i = new m();
    if (!s) return i;
    for (let n = s.index, u; u = this._blocks[n]; ++n) {
      var a;
      const l = u._appendChar(t, {
        ...e,
        _beforeTailState: (a = e._beforeTailState) == null || (a = a._blocks) == null ? void 0 : a[n]
      });
      if (i.aggregate(l), l.consumed) break;
    }
    return i;
  }
  extractTail(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const s = new S();
    return t === e || this._forEachBlocksInRange(t, e, (i, a, n, u) => {
      const l = i.extractTail(n, u);
      l.stop = this._findStopBefore(a), l.from = this._blockStartPos(a), l instanceof S && (l.blockIndex = a), s.extend(l);
    }), s;
  }
  extractInput(t, e, s) {
    if (t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), s === void 0 && (s = {}), t === e) return "";
    let i = "";
    return this._forEachBlocksInRange(t, e, (a, n, u, l) => {
      i += a.extractInput(u, l, s);
    }), i;
  }
  _findStopBefore(t) {
    let e;
    for (let s = 0; s < this._stops.length; ++s) {
      const i = this._stops[s];
      if (i <= t) e = i;
      else break;
    }
    return e;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(t) {
    const e = new m();
    if (this.lazy && t == null) return e;
    const s = this._mapPosToBlock(this.displayValue.length);
    if (!s) return e;
    const i = s.index, a = t ?? this._blocks.length;
    return this._blocks.slice(i, a).forEach((n) => {
      if (!n.lazy || t != null) {
        var u;
        e.aggregate(n._appendPlaceholder((u = n._blocks) == null ? void 0 : u.length));
      }
    }), e;
  }
  /** Finds block in pos */
  _mapPosToBlock(t) {
    let e = "";
    for (let s = 0; s < this._blocks.length; ++s) {
      const i = this._blocks[s], a = e.length;
      if (e += i.displayValue, t <= e.length)
        return {
          index: s,
          offset: t - a
        };
    }
  }
  _blockStartPos(t) {
    return this._blocks.slice(0, t).reduce((e, s) => e += s.displayValue.length, 0);
  }
  _forEachBlocksInRange(t, e, s) {
    e === void 0 && (e = this.displayValue.length);
    const i = this._mapPosToBlock(t);
    if (i) {
      const a = this._mapPosToBlock(e), n = a && i.index === a.index, u = i.offset, l = a && n ? a.offset : this._blocks[i.index].displayValue.length;
      if (s(this._blocks[i.index], i.index, u, l), a && !n) {
        for (let d = i.index + 1; d < a.index; ++d)
          s(this._blocks[d], d, 0, this._blocks[d].displayValue.length);
        s(this._blocks[a.index], a.index, 0, a.offset);
      }
    }
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const s = super.remove(t, e);
    return this._forEachBlocksInRange(t, e, (i, a, n, u) => {
      s.aggregate(i.remove(n, u));
    }), s;
  }
  nearestInputPos(t, e) {
    if (e === void 0 && (e = o.NONE), !this._blocks.length) return 0;
    const s = new Ft(this, t);
    if (e === o.NONE)
      return s.pushRightBeforeInput() || (s.popState(), s.pushLeftBeforeInput()) ? s.pos : this.displayValue.length;
    if (e === o.LEFT || e === o.FORCE_LEFT) {
      if (e === o.LEFT) {
        if (s.pushRightBeforeFilled(), s.ok && s.pos === t) return t;
        s.popState();
      }
      if (s.pushLeftBeforeInput(), s.pushLeftBeforeRequired(), s.pushLeftBeforeFilled(), e === o.LEFT) {
        if (s.pushRightBeforeInput(), s.pushRightBeforeRequired(), s.ok && s.pos <= t || (s.popState(), s.ok && s.pos <= t)) return s.pos;
        s.popState();
      }
      return s.ok ? s.pos : e === o.FORCE_LEFT ? 0 : (s.popState(), s.ok || (s.popState(), s.ok) ? s.pos : 0);
    }
    return e === o.RIGHT || e === o.FORCE_RIGHT ? (s.pushRightBeforeInput(), s.pushRightBeforeRequired(), s.pushRightBeforeFilled() ? s.pos : e === o.FORCE_RIGHT ? this.displayValue.length : (s.popState(), s.ok || (s.popState(), s.ok) ? s.pos : this.nearestInputPos(t, o.LEFT))) : t;
  }
  totalInputPositions(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    let s = 0;
    return this._forEachBlocksInRange(t, e, (i, a, n, u) => {
      s += i.totalInputPositions(n, u);
    }), s;
  }
  /** Get block by name */
  maskedBlock(t) {
    return this.maskedBlocks(t)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(t) {
    const e = this._maskedBlocks[t];
    return e ? e.map((s) => this._blocks[s]) : [];
  }
  pad(t) {
    const e = new m();
    return this._forEachBlocksInRange(0, this.displayValue.length, (s) => e.aggregate(s.pad(t))), e;
  }
}
C.DEFAULTS = {
  ...v.DEFAULTS,
  lazy: !0,
  placeholderChar: "_"
};
C.STOP_CHAR = "`";
C.ESCAPE_CHAR = "\\";
C.InputDefinition = M;
C.FixedDefinition = it;
c.MaskedPattern = C;
class V extends C {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */
  /** Min bound */
  /** Max bound */
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(t) {
    super(t);
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      to: e = this.to || 0,
      from: s = this.from || 0,
      maxLength: i = this.maxLength || 0,
      autofix: a = this.autofix,
      ...n
    } = t;
    this.to = e, this.from = s, this.maxLength = Math.max(String(e).length, i), this.autofix = a;
    const u = String(this.from).padStart(this.maxLength, "0"), l = String(this.to).padStart(this.maxLength, "0");
    let d = 0;
    for (; d < l.length && l[d] === u[d]; ) ++d;
    n.mask = l.slice(0, d).replace(/0/g, "\\0") + "0".repeat(this.maxLength - d), super._update(n);
  }
  get isComplete() {
    return super.isComplete && !!this.value;
  }
  boundaries(t) {
    let e = "", s = "";
    const [, i, a] = t.match(/^(\D*)(\d*)(\D*)/) || [];
    return a && (e = "0".repeat(i.length) + a, s = "9".repeat(i.length) + a), e = e.padEnd(this.maxLength, "0"), s = s.padEnd(this.maxLength, "9"), [e, s];
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let s;
    return [t, s] = super.doPrepareChar(t.replace(/\D/g, ""), e), t || (s.skip = !this.isComplete), [t, s];
  }
  _appendCharRaw(t, e) {
    if (e === void 0 && (e = {}), !this.autofix || this.value.length + 1 > this.maxLength) return super._appendCharRaw(t, e);
    const s = String(this.from).padStart(this.maxLength, "0"), i = String(this.to).padStart(this.maxLength, "0"), [a, n] = this.boundaries(this.value + t);
    return Number(n) < this.from ? super._appendCharRaw(s[this.value.length], e) : Number(a) > this.to ? !e.tail && this.autofix === "pad" && this.value.length + 1 < this.maxLength ? super._appendCharRaw(s[this.value.length], e).aggregate(this._appendCharRaw(t, e)) : super._appendCharRaw(i[this.value.length], e) : super._appendCharRaw(t, e);
  }
  doValidate(t) {
    const e = this.value;
    if (e.search(/[^0]/) === -1 && e.length <= this._matchFrom) return !0;
    const [i, a] = this.boundaries(e);
    return this.from <= Number(a) && Number(i) <= this.to && super.doValidate(t);
  }
  pad(t) {
    const e = new m();
    if (this.value.length === this.maxLength) return e;
    const s = this.value, i = this.maxLength - this.value.length;
    if (i) {
      this.reset();
      for (let a = 0; a < i; ++a)
        e.aggregate(super._appendCharRaw("0", t));
      s.split("").forEach((a) => this._appendCharRaw(a));
    }
    return e;
  }
}
c.MaskedRange = V;
const xt = "d{.}`m{.}`Y";
class F extends C {
  static extractPatternOptions(t) {
    const {
      mask: e,
      pattern: s,
      ...i
    } = t;
    return {
      ...i,
      mask: x(e) ? e : s
    };
  }
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(t) {
    super(F.extractPatternOptions({
      ...F.DEFAULTS,
      ...t
    }));
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      mask: e,
      pattern: s,
      blocks: i,
      ...a
    } = {
      ...F.DEFAULTS,
      ...t
    }, n = Object.assign({}, F.GET_DEFAULT_BLOCKS());
    t.min && (n.Y.from = t.min.getFullYear()), t.max && (n.Y.to = t.max.getFullYear()), t.min && t.max && n.Y.from === n.Y.to && (n.m.from = t.min.getMonth() + 1, n.m.to = t.max.getMonth() + 1, n.m.from === n.m.to && (n.d.from = t.min.getDate(), n.d.to = t.max.getDate())), Object.assign(n, this.blocks, i), super._update({
      ...a,
      mask: x(e) ? e : s,
      blocks: n
    });
  }
  doValidate(t) {
    const e = this.date;
    return super.doValidate(t) && (!this.isComplete || this.isDateExist(this.value) && e != null && (this.min == null || this.min <= e) && (this.max == null || e <= this.max));
  }
  /** Checks if date is exists */
  isDateExist(t) {
    return this.format(this.parse(t, this), this).indexOf(t) >= 0;
  }
  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(t) {
    this.typedValue = t;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(t) {
    super.typedValue = t;
  }
  maskEquals(t) {
    return t === Date || super.maskEquals(t);
  }
  optionsIsChanged(t) {
    return super.optionsIsChanged(F.extractPatternOptions(t));
  }
}
F.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: V,
    from: 1,
    to: 31,
    maxLength: 2
  },
  m: {
    mask: V,
    from: 1,
    to: 12,
    maxLength: 2
  },
  Y: {
    mask: V,
    from: 1900,
    to: 9999
  }
});
F.DEFAULTS = {
  ...C.DEFAULTS,
  mask: Date,
  pattern: xt,
  format: (r, t) => {
    if (!r) return "";
    const e = String(r.getDate()).padStart(2, "0"), s = String(r.getMonth() + 1).padStart(2, "0"), i = r.getFullYear();
    return [e, s, i].join(".");
  },
  parse: (r, t) => {
    const [e, s, i] = r.split(".").map(Number);
    return new Date(i, s - 1, e);
  }
};
c.MaskedDate = F;
class N extends v {
  constructor(t) {
    super({
      ...N.DEFAULTS,
      ...t
    }), this.currentMask = void 0;
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update(t), "mask" in t && (this.exposeMask = void 0, this.compiledMasks = Array.isArray(t.mask) ? t.mask.map((e) => {
      const {
        expose: s,
        ...i
      } = I(e), a = b({
        overwrite: this._overwrite,
        eager: this._eager,
        skipInvalid: this._skipInvalid,
        ...i
      });
      return s && (this.exposeMask = a), a;
    }) : []);
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = this._applyDispatch(t, e);
    return this.currentMask && s.aggregate(this.currentMask._appendChar(t, this.currentMaskFlags(e))), s;
  }
  _applyDispatch(t, e, s) {
    t === void 0 && (t = ""), e === void 0 && (e = {}), s === void 0 && (s = "");
    const i = e.tail && e._beforeTailState != null ? e._beforeTailState._value : this.value, a = this.rawInputValue, n = e.tail && e._beforeTailState != null ? e._beforeTailState._rawInputValue : a, u = a.slice(n.length), l = this.currentMask, d = new m(), k = l == null ? void 0 : l.state;
    return this.currentMask = this.doDispatch(t, {
      ...e
    }, s), this.currentMask && (this.currentMask !== l ? (this.currentMask.reset(), n && (this.currentMask.append(n, {
      raw: !0
    }), d.tailShift = this.currentMask.value.length - i.length), u && (d.tailShift += this.currentMask.append(u, {
      raw: !0,
      tail: !0
    }).tailShift)) : k && (this.currentMask.state = k)), d;
  }
  _appendPlaceholder() {
    const t = this._applyDispatch();
    return this.currentMask && t.aggregate(this.currentMask._appendPlaceholder()), t;
  }
  _appendEager() {
    const t = this._applyDispatch();
    return this.currentMask && t.aggregate(this.currentMask._appendEager()), t;
  }
  appendTail(t) {
    const e = new m();
    return t && e.aggregate(this._applyDispatch("", {}, t)), e.aggregate(this.currentMask ? this.currentMask.appendTail(t) : super.appendTail(t));
  }
  currentMaskFlags(t) {
    var e, s;
    return {
      ...t,
      _beforeTailState: ((e = t._beforeTailState) == null ? void 0 : e.currentMaskRef) === this.currentMask && ((s = t._beforeTailState) == null ? void 0 : s.currentMask) || t._beforeTailState
    };
  }
  doDispatch(t, e, s) {
    return e === void 0 && (e = {}), s === void 0 && (s = ""), this.dispatch(t, this, e, s);
  }
  doValidate(t) {
    return super.doValidate(t) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(t)));
  }
  doPrepare(t, e) {
    e === void 0 && (e = {});
    let [s, i] = super.doPrepare(t, e);
    if (this.currentMask) {
      let a;
      [s, a] = super.doPrepare(s, this.currentMaskFlags(e)), i = i.aggregate(a);
    }
    return [s, i];
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let [s, i] = super.doPrepareChar(t, e);
    if (this.currentMask) {
      let a;
      [s, a] = super.doPrepareChar(s, this.currentMaskFlags(e)), i = i.aggregate(a);
    }
    return [s, i];
  }
  reset() {
    var t;
    (t = this.currentMask) == null || t.reset(), this.compiledMasks.forEach((e) => e.reset());
  }
  get value() {
    return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : "";
  }
  set value(t) {
    this.exposeMask ? (this.exposeMask.value = t, this.currentMask = this.exposeMask, this._applyDispatch()) : super.value = t;
  }
  get unmaskedValue() {
    return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : "";
  }
  set unmaskedValue(t) {
    this.exposeMask ? (this.exposeMask.unmaskedValue = t, this.currentMask = this.exposeMask, this._applyDispatch()) : super.unmaskedValue = t;
  }
  get typedValue() {
    return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : "";
  }
  set typedValue(t) {
    if (this.exposeMask) {
      this.exposeMask.typedValue = t, this.currentMask = this.exposeMask, this._applyDispatch();
      return;
    }
    let e = String(t);
    this.currentMask && (this.currentMask.typedValue = t, e = this.currentMask.unmaskedValue), this.unmaskedValue = e;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  get isComplete() {
    var t;
    return !!((t = this.currentMask) != null && t.isComplete);
  }
  get isFilled() {
    var t;
    return !!((t = this.currentMask) != null && t.isFilled);
  }
  remove(t, e) {
    const s = new m();
    return this.currentMask && s.aggregate(this.currentMask.remove(t, e)).aggregate(this._applyDispatch()), s;
  }
  get state() {
    var t;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((e) => e.state),
      currentMaskRef: this.currentMask,
      currentMask: (t = this.currentMask) == null ? void 0 : t.state
    };
  }
  set state(t) {
    const {
      compiledMasks: e,
      currentMaskRef: s,
      currentMask: i,
      ...a
    } = t;
    e && this.compiledMasks.forEach((n, u) => n.state = e[u]), s != null && (this.currentMask = s, this.currentMask.state = i), super.state = a;
  }
  extractInput(t, e, s) {
    return this.currentMask ? this.currentMask.extractInput(t, e, s) : "";
  }
  extractTail(t, e) {
    return this.currentMask ? this.currentMask.extractTail(t, e) : super.extractTail(t, e);
  }
  doCommit() {
    this.currentMask && this.currentMask.doCommit(), super.doCommit();
  }
  nearestInputPos(t, e) {
    return this.currentMask ? this.currentMask.nearestInputPos(t, e) : super.nearestInputPos(t, e);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(t) {
    this._overwrite = t;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(t) {
    this._eager = t;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(t) {
    this._skipInvalid = t;
  }
  get autofix() {
    return this.currentMask ? this.currentMask.autofix : this._autofix;
  }
  set autofix(t) {
    this._autofix = t;
  }
  maskEquals(t) {
    return Array.isArray(t) ? this.compiledMasks.every((e, s) => {
      if (!t[s]) return;
      const {
        mask: i,
        ...a
      } = t[s];
      return D(e, a) && e.maskEquals(i);
    }) : super.maskEquals(t);
  }
  typedValueEquals(t) {
    var e;
    return !!((e = this.currentMask) != null && e.typedValueEquals(t));
  }
}
N.DEFAULTS = {
  ...v.DEFAULTS,
  dispatch: (r, t, e, s) => {
    if (!t.compiledMasks.length) return;
    const i = t.rawInputValue, a = t.compiledMasks.map((n, u) => {
      const l = t.currentMask === n, d = l ? n.displayValue.length : n.nearestInputPos(n.displayValue.length, o.FORCE_LEFT);
      return n.rawInputValue !== i ? (n.reset(), n.append(i, {
        raw: !0
      })) : l || n.remove(d), n.append(r, t.currentMaskFlags(e)), n.appendTail(s), {
        index: u,
        weight: n.rawInputValue.length,
        totalInputPositions: n.totalInputPositions(0, Math.max(d, n.nearestInputPos(n.displayValue.length, o.FORCE_LEFT)))
      };
    });
    return a.sort((n, u) => u.weight - n.weight || u.totalInputPositions - n.totalInputPositions), t.compiledMasks[a[0].index];
  }
};
c.MaskedDynamic = N;
class $ extends C {
  constructor(t) {
    super({
      ...$.DEFAULTS,
      ...t
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      enum: e,
      ...s
    } = t;
    if (e) {
      const i = e.map((u) => u.length), a = Math.min(...i), n = Math.max(...i) - a;
      s.mask = "*".repeat(a), n && (s.mask += "[" + "*".repeat(n) + "]"), this.enum = e;
    }
    super._update(s);
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = Math.min(this.nearestInputPos(0, o.FORCE_RIGHT), this.value.length), i = this.enum.filter((a) => this.matchValue(a, this.unmaskedValue + t, s));
    if (i.length) {
      i.length === 1 && this._forEachBlocksInRange(0, this.value.length, (n, u) => {
        const l = i[0][u];
        u >= this.value.length || l === n.value || (n.reset(), n._appendChar(l, e));
      });
      const a = super._appendCharRaw(i[0][this.value.length], e);
      return i.length === 1 && i[0].slice(this.unmaskedValue.length).split("").forEach((n) => a.aggregate(super._appendCharRaw(n))), a;
    }
    return new m({
      skip: !this.isComplete
    });
  }
  extractTail(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), new A("", t);
  }
  remove(t, e) {
    if (t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), t === e) return new m();
    const s = Math.min(super.nearestInputPos(0, o.FORCE_RIGHT), this.value.length);
    let i;
    for (i = t; i >= 0 && !(this.enum.filter((u) => this.matchValue(u, this.value.slice(s, i), s)).length > 1); --i)
      ;
    const a = super.remove(i, e);
    return a.tailShift += i - t, a;
  }
  get isComplete() {
    return this.enum.indexOf(this.value) >= 0;
  }
}
$.DEFAULTS = {
  ...C.DEFAULTS,
  matchValue: (r, t, e) => r.indexOf(t, e) === e
};
c.MaskedEnum = $;
class Bt extends v {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update({
      ...t,
      validate: t.mask
    });
  }
}
c.MaskedFunction = Bt;
var at;
class y extends v {
  /** Single char */
  /** Single char */
  /** Array of single chars */
  /** */
  /** */
  /** Digits after point */
  /** Flag to remove leading and trailing zeros in the end of editing */
  /** Flag to pad trailing zeros after point in the end of editing */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(t) {
    super({
      ...y.DEFAULTS,
      ...t
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update(t), this._updateRegExps();
  }
  _updateRegExps() {
    const t = "^" + (this.allowNegative ? "[+|\\-]?" : ""), e = "\\d*", s = (this.scale ? "(" + z(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
    this._numberRegExp = new RegExp(t + e + s), this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(z).join("") + "]", "g"), this._thousandsSeparatorRegExp = new RegExp(z(this.thousandsSeparator), "g");
  }
  _removeThousandsSeparators(t) {
    return t.replace(this._thousandsSeparatorRegExp, "");
  }
  _insertThousandsSeparators(t) {
    const e = t.split(this.radix);
    return e[0] = e[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator), e.join(this.radix);
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    const [s, i] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    (e.input && e.raw || !e.input && !e.raw) ? t.replace(this._mapToRadixRegExp, this.radix) : t), e);
    return t && !s && (i.skip = !0), s && !this.allowPositive && !this.value && s !== "-" && i.aggregate(this._appendChar("-")), [s, i];
  }
  _separatorsCount(t, e) {
    e === void 0 && (e = !1);
    let s = 0;
    for (let i = 0; i < t; ++i)
      this._value.indexOf(this.thousandsSeparator, i) === i && (++s, e && (t += this.thousandsSeparator.length));
    return s;
  }
  _separatorsCountFromSlice(t) {
    return t === void 0 && (t = this._value), this._separatorsCount(this._removeThousandsSeparators(t).length, !0);
  }
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), [t, e] = this._adjustRangeWithSeparators(t, e), this._removeThousandsSeparators(super.extractInput(t, e, s));
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value, i = this._separatorsCountFromSlice(s);
    this._value = this._removeThousandsSeparators(this.value);
    const a = this._value;
    this._value += t;
    const n = this.number;
    let u = !isNaN(n), l = !1;
    if (u) {
      let E;
      this.min != null && this.min < 0 && this.number < this.min && (E = this.min), this.max != null && this.max > 0 && this.number > this.max && (E = this.max), E != null && (this.autofix ? (this._value = this.format(E, this).replace(y.UNMASKED_RADIX, this.radix), l || (l = a === this._value && !e.tail)) : u = !1), u && (u = !!this._value.match(this._numberRegExp));
    }
    let d;
    u ? d = new m({
      inserted: this._value.slice(a.length),
      rawInserted: l ? "" : t,
      skip: l
    }) : (this._value = a, d = new m()), this._value = this._insertThousandsSeparators(this._value);
    const k = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value, _ = this._separatorsCountFromSlice(k);
    return d.tailShift += (_ - i) * this.thousandsSeparator.length, d;
  }
  _findSeparatorAround(t) {
    if (this.thousandsSeparator) {
      const e = t - this.thousandsSeparator.length + 1, s = this.value.indexOf(this.thousandsSeparator, e);
      if (s <= t) return s;
    }
    return -1;
  }
  _adjustRangeWithSeparators(t, e) {
    const s = this._findSeparatorAround(t);
    s >= 0 && (t = s);
    const i = this._findSeparatorAround(e);
    return i >= 0 && (e = i + this.thousandsSeparator.length), [t, e];
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), [t, e] = this._adjustRangeWithSeparators(t, e);
    const s = this.value.slice(0, t), i = this.value.slice(e), a = this._separatorsCount(s.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(s + i));
    const n = this._separatorsCountFromSlice(s);
    return new m({
      tailShift: (n - a) * this.thousandsSeparator.length
    });
  }
  nearestInputPos(t, e) {
    if (!this.thousandsSeparator) return t;
    switch (e) {
      case o.NONE:
      case o.LEFT:
      case o.FORCE_LEFT: {
        const s = this._findSeparatorAround(t - 1);
        if (s >= 0) {
          const i = s + this.thousandsSeparator.length;
          if (t < i || this.value.length <= i || e === o.FORCE_LEFT)
            return s;
        }
        break;
      }
      case o.RIGHT:
      case o.FORCE_RIGHT: {
        const s = this._findSeparatorAround(t);
        if (s >= 0)
          return s + this.thousandsSeparator.length;
      }
    }
    return t;
  }
  doCommit() {
    if (this.value) {
      const t = this.number;
      let e = t;
      this.min != null && (e = Math.max(e, this.min)), this.max != null && (e = Math.min(e, this.max)), e !== t && (this.unmaskedValue = this.format(e, this));
      let s = this.value;
      this.normalizeZeros && (s = this._normalizeZeros(s)), this.padFractionalZeros && this.scale > 0 && (s = this._padFractionalZeros(s)), this._value = s;
    }
    super.doCommit();
  }
  _normalizeZeros(t) {
    const e = this._removeThousandsSeparators(t).split(this.radix);
    return e[0] = e[0].replace(/^(\D*)(0*)(\d*)/, (s, i, a, n) => i + n), t.length && !/\d$/.test(e[0]) && (e[0] = e[0] + "0"), e.length > 1 && (e[1] = e[1].replace(/0*$/, ""), e[1].length || (e.length = 1)), this._insertThousandsSeparators(e.join(this.radix));
  }
  _padFractionalZeros(t) {
    if (!t) return t;
    const e = t.split(this.radix);
    return e.length < 2 && e.push(""), e[1] = e[1].padEnd(this.scale, "0"), e.join(this.radix);
  }
  doSkipInvalid(t, e, s) {
    e === void 0 && (e = {});
    const i = this.scale === 0 && t !== this.thousandsSeparator && (t === this.radix || t === y.UNMASKED_RADIX || this.mapToRadix.includes(t));
    return super.doSkipInvalid(t, e, s) && !i;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, y.UNMASKED_RADIX);
  }
  set unmaskedValue(t) {
    super.unmaskedValue = t;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(t) {
    this.rawInputValue = this.format(t, this).replace(y.UNMASKED_RADIX, this.radix);
  }
  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(t) {
    this.typedValue = t;
  }
  get allowNegative() {
    return this.min != null && this.min < 0 || this.max != null && this.max < 0;
  }
  get allowPositive() {
    return this.min != null && this.min > 0 || this.max != null && this.max > 0;
  }
  typedValueEquals(t) {
    return (super.typedValueEquals(t) || y.EMPTY_VALUES.includes(t) && y.EMPTY_VALUES.includes(this.typedValue)) && !(t === 0 && this.value === "");
  }
}
at = y;
y.UNMASKED_RADIX = ".";
y.EMPTY_VALUES = [...v.EMPTY_VALUES, 0];
y.DEFAULTS = {
  ...v.DEFAULTS,
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [at.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: !0,
  padFractionalZeros: !1,
  parse: Number,
  format: (r) => r.toLocaleString("en-US", {
    useGrouping: !1,
    maximumFractionDigits: 20
  })
};
c.MaskedNumber = y;
const H = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue"
};
function nt(r, t, e) {
  t === void 0 && (t = H.MASKED), e === void 0 && (e = H.MASKED);
  const s = b(r);
  return (i) => s.runIsolated((a) => (a[t] = i, a[e]));
}
function St(r, t, e, s) {
  return nt(t, e, s)(r);
}
c.PIPE_TYPE = H;
c.createPipe = nt;
c.pipe = St;
class It extends C {
  get repeatFrom() {
    var t;
    return (t = Array.isArray(this.repeat) ? this.repeat[0] : this.repeat === 1 / 0 ? 0 : this.repeat) != null ? t : 0;
  }
  get repeatTo() {
    var t;
    return (t = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) != null ? t : 1 / 0;
  }
  constructor(t) {
    super(t);
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    var e, s, i;
    const {
      repeat: a,
      ...n
    } = I(t);
    this._blockOpts = Object.assign({}, this._blockOpts, n);
    const u = b(this._blockOpts);
    this.repeat = (e = (s = a ?? u.repeat) != null ? s : this.repeat) != null ? e : 1 / 0, super._update({
      mask: "m".repeat(Math.max(this.repeatTo === 1 / 0 && ((i = this._blocks) == null ? void 0 : i.length) || 0, this.repeatFrom)),
      blocks: {
        m: u
      },
      eager: u.eager,
      overwrite: u.overwrite,
      skipInvalid: u.skipInvalid,
      lazy: u.lazy,
      placeholderChar: u.placeholderChar,
      displayChar: u.displayChar
    });
  }
  _allocateBlock(t) {
    if (t < this._blocks.length) return this._blocks[t];
    if (this.repeatTo === 1 / 0 || this._blocks.length < this.repeatTo)
      return this._blocks.push(b(this._blockOpts)), this.mask += "m", this._blocks[this._blocks.length - 1];
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = new m();
    for (
      let l = (i = (a = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : a.index) != null ? i : Math.max(this._blocks.length - 1, 0), d, k;
      // try to get a block or
      // try to allocate a new block if not allocated already
      d = (n = this._blocks[l]) != null ? n : k = !k && this._allocateBlock(l);
      ++l
    ) {
      var i, a, n, u;
      const _ = d._appendChar(t, {
        ...e,
        _beforeTailState: (u = e._beforeTailState) == null || (u = u._blocks) == null ? void 0 : u[l]
      });
      if (_.skip && k) {
        this._blocks.pop(), this.mask = this.mask.slice(1);
        break;
      }
      if (s.aggregate(_), _.consumed) break;
    }
    return s;
  }
  _trimEmptyTail(t, e) {
    var s, i;
    t === void 0 && (t = 0);
    const a = Math.max(((s = this._mapPosToBlock(t)) == null ? void 0 : s.index) || 0, this.repeatFrom, 0);
    let n;
    e != null && (n = (i = this._mapPosToBlock(e)) == null ? void 0 : i.index), n == null && (n = this._blocks.length - 1);
    let u = 0;
    for (let l = n; a <= l && !this._blocks[l].unmaskedValue; --l, ++u)
      ;
    u && (this._blocks.splice(n - u + 1, u), this.mask = this.mask.slice(u));
  }
  reset() {
    super.reset(), this._trimEmptyTail();
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const s = super.remove(t, e);
    return this._trimEmptyTail(t, e), s;
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e == null && this.repeatTo === 1 / 0 ? 1 / 0 : super.totalInputPositions(t, e);
  }
  get state() {
    return super.state;
  }
  set state(t) {
    this._blocks.length = t._blocks.length, this.mask = this.mask.slice(0, this._blocks.length), super.state = t;
  }
}
c.RepeatBlock = It;
try {
  globalThis.IMask = c;
} catch {
}
var wt = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, p = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Vt(t, e) : t, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && wt(t, e, i), i;
}, T, rt;
const R = class R extends ot {
  constructor() {
    super(...arguments);
    W(this, T);
    this.formControlController = new ct(this, {
      assumeInteractionOn: ["cx-blur", "cx-input"]
    }), this.hasSlotController = new ft(
      this,
      "help-text",
      "label"
    ), this.localize = new kt(this), this.hasFocus = !1, this.maskInstance = null, this.containerClicked = !1, this.title = "", this.__numberInput = Object.assign(document.createElement("input"), {
      type: "number"
    }), this.__dateInput = Object.assign(document.createElement("input"), {
      type: "date"
    }), this.type = "text", this.name = "", this.value = "", this.unmaskedValue = "", this.defaultValue = "", this.size = "medium", this.filled = !1, this.pill = !1, this.label = "", this.helpText = "", this.clearable = !1, this.disabled = !1, this.placeholder = "", this.readonly = !1, this.passwordToggle = !1, this.passwordVisible = !1, this.noSpinButtons = !1, this.form = "", this.required = !1, this.autocomplete = "off", this.spellcheck = !0, this.maskPlaceholder = "_", this.maskLazy = !1, this.maskOverwrite = !1, this.variant = "default", this.fileButtonLabel = "Choose file", this.buttonOnly = !1, this.fileResultLabel = (e) => {
      let s = "No file chosen";
      return e != null && e.length && (e.length === 1 ? s = e[0].name : e.length > 1 && (s = `${e.length} files`)), s;
    }, this.handleMaskAccept = () => {
      this.maskInstance && (this.value = this.maskInstance.value, this.unmaskedValue = this.maskInstance.unmaskedValue, this.formControlController.updateValidity(), this.emit("cx-input"));
    };
  }
  // #endregion
  //
  // NOTE: We use an in-memory input for these getters/setters instead of the one in the template because the properties
  // can be set before the component is rendered.
  //
  /**
   * Gets or sets the current value as a `Date` object. Returns `null` if the value can't be converted. This will use the native `<input type="{{type}}">` implementation and may result in an error.
   */
  get valueAsDate() {
    var e;
    return this.__dateInput.type = this.type, this.__dateInput.value = this.value, ((e = this.input) == null ? void 0 : e.valueAsDate) || this.__dateInput.valueAsDate;
  }
  set valueAsDate(e) {
    this.__dateInput.type = this.type, this.__dateInput.valueAsDate = e, this.value = this.__dateInput.value;
  }
  /** Gets or sets the current value as a number. Returns `NaN` if the value can't be converted. */
  get valueAsNumber() {
    var e;
    return this.__numberInput.value = this.value, ((e = this.input) == null ? void 0 : e.valueAsNumber) || this.__numberInput.valueAsNumber;
  }
  set valueAsNumber(e) {
    this.__numberInput.valueAsNumber = e, this.value = this.__numberInput.value;
  }
  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }
  initMaskInstance() {
    if (this.mask && this.input) {
      const e = {
        lazy: this.maskLazy,
        mask: this.mask,
        overwrite: this.maskOverwrite,
        placeholderChar: this.maskPlaceholder
      };
      this.maskInstance = c(this.input, e), this.value = this.maskInstance.value, this.unmaskedValue = this.maskInstance.unmaskedValue, this.maskInstance.on("accept", this.handleMaskAccept.bind(this));
    }
  }
  connectedCallback() {
    super.connectedCallback(), this.initMaskInstance();
  }
  firstUpdated() {
    this.formControlController.updateValidity(), this.initMaskInstance();
  }
  disconnectedCallback() {
    var e, s;
    super.disconnectedCallback(), (e = this.maskInstance) == null || e.off("accept", this.handleMaskAccept.bind(this)), (s = this.maskInstance) == null || s.destroy();
  }
  handleBlur() {
    if (this.containerClicked) {
      this.containerClicked = !1, this.focus();
      return;
    }
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleChange() {
    this.value = this.input.value, this.emit("cx-change");
  }
  handleClearClick(e) {
    e.preventDefault(), this.value !== "" && (this.value = "", this.emit("cx-clear"), this.emit("cx-input"), this.emit("cx-change")), this.input.focus();
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  // handleInput is registered to the input element inside render()
  handleInput() {
    this.maskInstance || (this.value = this.input.value, this.unmaskedValue = this.input.value, this.formControlController.updateValidity(), this.emit("cx-input"));
  }
  handleInvalid(e) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(e);
  }
  handleKeyDown(e) {
    const s = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    e.key === "Enter" && !s && setTimeout(() => {
      !e.defaultPrevented && !e.isComposing && this.formControlController.submit();
    }), e.ctrlKey && e.key === "a" && this.input.select(), this.emit("cx-keydown", { detail: { event: e, value: this.value } });
  }
  handlePasswordToggle() {
    this.passwordVisible = !this.passwordVisible;
  }
  handleFileButtonClick() {
    this.input.click();
  }
  handleContainerMouseDown(e) {
    const s = e.composedPath();
    s.includes(this.inputContainer) && !s.includes(this.input) ? (this.containerClicked = !0, this.focus()) : this.containerClicked = !1;
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleStepChange() {
    this.input.step = String(this.step), this.formControlController.updateValidity();
  }
  async handleValueChange() {
    var e;
    await this.updateComplete, this.formControlController.updateValidity(), this.maskInstance && this.value !== ((e = this.maskInstance) == null ? void 0 : e.value) && this.maskInstance.updateValue();
  }
  /** Sets focus on the input. */
  focus(e) {
    this.input.focus(e);
  }
  /** Removes focus from the input. */
  blur() {
    this.input.blur();
  }
  /** Selects all the text in the input. */
  select() {
    this.input.select();
  }
  /** Sets the start and end positions of the text selection (0-based). */
  setSelectionRange(e, s, i = "none") {
    this.input.setSelectionRange(
      e,
      s,
      i
    );
  }
  /** Replaces a range of text with a new string. */
  setRangeText(e, s, i, a = "preserve") {
    const n = s ?? this.input.selectionStart, u = i ?? this.input.selectionEnd;
    this.input.setRangeText(
      e,
      n,
      u,
      a
    ), this.value !== this.input.value && (this.value = this.input.value);
  }
  /** Displays the browser picker for an input element (only works if the browser supports it for the input type). */
  showPicker() {
    "showPicker" in HTMLInputElement.prototype && this.input.showPicker();
  }
  /** Increments the value of a numeric input type by the value of the step attribute. */
  stepUp() {
    this.input.stepUp(), this.value !== this.input.value && (this.value = this.input.value);
  }
  /** Decrements the value of a numeric input type by the value of the step attribute. */
  stepDown() {
    this.input.stepDown(), this.value !== this.input.value && (this.value = this.input.value);
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(e) {
    this.input.setCustomValidity(e), this.formControlController.updateValidity();
  }
  render() {
    const e = this.hasSlotController.test("label"), s = this.hasSlotController.test("help-text"), i = this.label ? !0 : !!e, a = this.helpText ? !0 : !!s, u = this.clearable && !this.disabled && !this.readonly && (typeof this.value == "number" || this.value.length > 0), l = this.fileResultLabel(X(this, T, rt));
    return B`
      <div
        part="form-control"
        class=${P({
      "form-control": !0,
      "form-control--file": this.type === "file",
      "form-control--has-help-text": a,
      "form-control--has-label": i,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${P({
      input: !0,
      "input--button-only": this.buttonOnly,
      "input--disabled": this.disabled,
      "input--empty": !this.value,
      "input--filled": this.filled,
      "input--focused": this.hasFocus,
      "input--has-placeholder": !!this.placeholder,
      "input--large": this.size === "large",
      "input--medium": this.size === "medium",
      "input--no-spin-buttons": this.noSpinButtons,
      // States
      "input--pill": this.pill,
      "input--small": this.size === "small",
      "input--standard": !this.filled
    })}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <span
              class="input-container"
              @mousedown=${this.handleContainerMouseDown}
            >
              <label
                part="form-control-label"
                class="${P({
      "form-control__label": !0,
      "form-control__label--empty": !this.value
    })}"
                for="input"
                aria-hidden=${i ? "false" : "true"}
              >
                <slot name="label" part="label">${this.label}</slot>
              </label>
              <input
                part="input"
                id="input"
                class="input__control"
                type=${this.type === "password" && this.passwordVisible ? "text" : this.type}
                title=${this.title}
                aria-label=${g(this.ariaLabel)}
                name=${g(this.name)}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                placeholder=${g(this.placeholder)}
                minlength=${g(this.minlength)}
                maxlength=${g(this.maxlength)}
                min=${g(this.min)}
                max=${g(this.max)}
                step=${g(this.step)}
                .value=${mt(this.value)}
                autocapitalize=${g(this.autocapitalize)}
                autocomplete=${g(this.autocomplete)}
                autocorrect=${g(this.autocorrect)}
                ?autofocus=${this.autofocus}
                spellcheck=${this.spellcheck}
                pattern=${g(this.pattern)}
                enterkeyhint=${g(this.enterkeyhint)}
                inputmode=${g(this.inputmode)}
                aria-describedby="help-text"
                @change=${this.handleChange}
                @input=${this.handleInput}
                @invalid=${this.handleInvalid}
                @keydown=${this.handleKeyDown}
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
                accept=${g(this.accept)}
                ?multiple=${this.multiple}
              />
              ${this.type === "file" && !this.buttonOnly ? B`<div
                    class="input__control input__control--file"
                    part="file-control"
                    @click=${this.handleFileButtonClick}
                  >
                    <slot name="file-button">
                      <cx-button
                        part="file-button"
                        variant=${g(this.variant)}
                        size=${g(this.size)}
                        ?disabled=${this.disabled}
                        >${this.fileButtonLabel}</cx-button
                      >
                    </slot>
                    <span part="file-result">${l}</span>
                  </div>` : ""}
            </span>
            ${this.type === "file" && this.buttonOnly ? B` <div
                  class="input__control input__control--file"
                  part="file-control"
                  @click=${this.handleFileButtonClick}
                >
                  <slot name="file-button">
                    <cx-button
                      part="file-button"
                      variant=${g(this.variant)}
                      size=${g(this.size)}
                      ?disabled=${this.disabled}
                      >${this.fileButtonLabel}</cx-button
                    >
                  </slot>
                </div>` : ""}
            ${u ? B`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <cx-icon name="close"></cx-icon>
                    </slot>
                  </button>
                ` : ""}
            ${this.passwordToggle && !this.disabled ? B`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(
      this.passwordVisible ? "hidePassword" : "showPassword"
    )}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible ? B`
                          <slot name="show-password-icon">
                            <cx-icon
                              name="visibility_off"
                              library="system"
                            ></cx-icon>
                          </slot>
                        ` : B`
                          <slot name="hide-password-icon">
                            <cx-icon
                              name="visibility"
                              library="system"
                            ></cx-icon>
                          </slot>
                        `}
                  </button>
                ` : ""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${a ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
T = new WeakSet(), rt = function() {
  var e;
  return (e = this.input) == null ? void 0 : e.files;
}, R.styles = [ht, pt, _t], R.dependencies = { "cx-icon": gt };
let h = R;
p([
  q(".input__control")
], h.prototype, "input", 2);
p([
  q(".input-container")
], h.prototype, "inputContainer", 2);
p([
  q(".form-control__label")
], h.prototype, "labelElement", 2);
p([
  K()
], h.prototype, "hasFocus", 2);
p([
  K()
], h.prototype, "maskInstance", 2);
p([
  K()
], h.prototype, "containerClicked", 2);
p([
  f()
], h.prototype, "title", 2);
p([
  f({ reflect: !0 })
], h.prototype, "type", 2);
p([
  f()
], h.prototype, "name", 2);
p([
  f()
], h.prototype, "value", 2);
p([
  f()
], h.prototype, "unmaskedValue", 2);
p([
  dt()
], h.prototype, "defaultValue", 2);
p([
  f({ reflect: !0 })
], h.prototype, "size", 2);
p([
  f({ reflect: !0, type: Boolean })
], h.prototype, "filled", 2);
p([
  f({ reflect: !0, type: Boolean })
], h.prototype, "pill", 2);
p([
  f()
], h.prototype, "label", 2);
p([
  f({ attribute: "help-text" })
], h.prototype, "helpText", 2);
p([
  f({ type: Boolean })
], h.prototype, "clearable", 2);
p([
  f({ reflect: !0, type: Boolean })
], h.prototype, "disabled", 2);
p([
  f()
], h.prototype, "placeholder", 2);
p([
  f({ reflect: !0, type: Boolean })
], h.prototype, "readonly", 2);
p([
  f({ attribute: "password-toggle", type: Boolean })
], h.prototype, "passwordToggle", 2);
p([
  f({ attribute: "password-visible", type: Boolean })
], h.prototype, "passwordVisible", 2);
p([
  f({ attribute: "no-spin-buttons", type: Boolean })
], h.prototype, "noSpinButtons", 2);
p([
  f({ reflect: !0 })
], h.prototype, "form", 2);
p([
  f({ reflect: !0, type: Boolean })
], h.prototype, "required", 2);
p([
  f()
], h.prototype, "pattern", 2);
p([
  f({ type: Number })
], h.prototype, "minlength", 2);
p([
  f({ type: Number })
], h.prototype, "maxlength", 2);
p([
  f()
], h.prototype, "min", 2);
p([
  f()
], h.prototype, "max", 2);
p([
  f()
], h.prototype, "step", 2);
p([
  f()
], h.prototype, "autocapitalize", 2);
p([
  f()
], h.prototype, "autocorrect", 2);
p([
  f()
], h.prototype, "autocomplete", 2);
p([
  f({ type: Boolean })
], h.prototype, "autofocus", 2);
p([
  f()
], h.prototype, "enterkeyhint", 2);
p([
  f({
    converter: {
      // Allow "true|false" attribute values but keep the property boolean
      fromAttribute: (r) => !(!r || r === "false"),
      toAttribute: (r) => r ? "true" : "false"
    },
    type: Boolean
  })
], h.prototype, "spellcheck", 2);
p([
  f()
], h.prototype, "inputmode", 2);
p([
  f()
], h.prototype, "mask", 2);
p([
  f({ attribute: "mask-placeholder" })
], h.prototype, "maskPlaceholder", 2);
p([
  f({ attribute: "mask-lazy", type: Boolean })
], h.prototype, "maskLazy", 2);
p([
  f({
    attribute: "mask-overwrite",
    converter: {
      fromAttribute: (r) => r === "shift" ? r : r !== void 0,
      toAttribute: (r) => r
    }
  })
], h.prototype, "maskOverwrite", 2);
p([
  f()
], h.prototype, "accept", 2);
p([
  f({ type: Boolean })
], h.prototype, "multiple", 2);
p([
  f({ reflect: !0 })
], h.prototype, "variant", 2);
p([
  f({ attribute: "file-button-label" })
], h.prototype, "fileButtonLabel", 2);
p([
  f({ attribute: "button-only", type: Boolean })
], h.prototype, "buttonOnly", 2);
p([
  f({ attribute: !1 })
], h.prototype, "fileResultLabel", 2);
p([
  j("disabled", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleDisabledChange", 1);
p([
  j("step", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleStepChange", 1);
p([
  j("value", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleValueChange", 1);
export {
  h as default
};
