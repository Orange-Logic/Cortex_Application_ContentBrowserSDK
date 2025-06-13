import { C as at, c as rt } from "../chunks/custom-element.X6y1saJZ.js";
import { c as ut } from "../chunks/component.styles.BLcT4bOa.js";
import { f as lt } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as ot } from "../chunks/default-value.BaUjiOTd.js";
import { F as ht } from "../chunks/form.CBFaCEBn.js";
import { H as pt } from "../chunks/slot.DJLm4Dig.js";
import { w as H } from "../chunks/watch.ChG-_stu.js";
import { i as dt, x as w } from "../chunks/lit-element.DRlPF2me.js";
import { n as f } from "../chunks/property.CtZ87in4.js";
import { r as j } from "../chunks/state.-o_YRGMi.js";
import { e as K } from "../chunks/query.BNveAlQo.js";
import { e as $ } from "../chunks/class-map.Cn0czwWq.js";
import { o as _ } from "../chunks/if-defined.D8U9hdvp.js";
import { l as ct } from "../chunks/live.C0NiCo2U.js";
import { L as ft } from "../chunks/localize.D5Yoww6T.js";
import mt from "./icon.js";
function F(n) {
  return typeof n == "string" || n instanceof String;
}
function Y(n) {
  var t;
  return typeof n == "object" && n != null && (n == null || (t = n.constructor) == null ? void 0 : t.name) === "Object";
}
function X(n, t) {
  return Array.isArray(t) ? X(n, (e, i) => t.includes(i)) : Object.entries(n).reduce((e, i) => {
    let [s, a] = i;
    return t(a, s) && (e[s] = a), e;
  }, {});
}
const o = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT"
};
function gt(n) {
  switch (n) {
    case o.LEFT:
      return o.FORCE_LEFT;
    case o.RIGHT:
      return o.FORCE_RIGHT;
    default:
      return n;
  }
}
function z(n) {
  return n.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function D(n, t) {
  if (t === n) return !0;
  const e = Array.isArray(t), i = Array.isArray(n);
  let s;
  if (e && i) {
    if (t.length != n.length) return !1;
    for (s = 0; s < t.length; s++) if (!D(t[s], n[s])) return !1;
    return !0;
  }
  if (e != i) return !1;
  if (t && n && typeof t == "object" && typeof n == "object") {
    const a = t instanceof Date, r = n instanceof Date;
    if (a && r) return t.getTime() == n.getTime();
    if (a != r) return !1;
    const u = t instanceof RegExp, l = n instanceof RegExp;
    if (u && l) return t.toString() == n.toString();
    if (u != l) return !1;
    const d = Object.keys(t);
    for (s = 0; s < d.length; s++) if (!Object.prototype.hasOwnProperty.call(n, d[s])) return !1;
    for (s = 0; s < d.length; s++) if (!D(n[d[s]], t[d[s]])) return !1;
    return !0;
  } else if (t && n && typeof t == "function" && typeof n == "function")
    return t.toString() === n.toString();
  return !1;
}
class _t {
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
function c(n, t) {
  return new c.InputMask(n, t);
}
function W(n) {
  if (n == null) throw new Error("mask property should be defined");
  return n instanceof RegExp ? c.MaskedRegExp : F(n) ? c.MaskedPattern : n === Date ? c.MaskedDate : n === Number ? c.MaskedNumber : Array.isArray(n) || n === Array ? c.MaskedDynamic : c.Masked && n.prototype instanceof c.Masked ? n : c.Masked && n instanceof c.Masked ? n.constructor : n instanceof Function ? c.MaskedFunction : (console.warn("Mask not found for mask", n), c.Masked);
}
function I(n) {
  if (!n) throw new Error("Options in not defined");
  if (c.Masked) {
    if (n.prototype instanceof c.Masked) return {
      mask: n
    };
    const {
      mask: t = void 0,
      ...e
    } = n instanceof c.Masked ? {
      mask: n
    } : Y(n) && n.mask instanceof c.Masked ? n : {};
    if (t) {
      const i = t.mask;
      return {
        ...X(t, (s, a) => !a.startsWith("_")),
        mask: t.constructor,
        _mask: i,
        ...e
      };
    }
  }
  return Y(n) ? {
    ...n
  } : {
    mask: n
  };
}
function A(n) {
  if (c.Masked && n instanceof c.Masked) return n;
  const t = I(n), e = W(t.mask);
  if (!e) throw new Error("Masked class is not found for provided mask " + t.mask + ", appropriate module needs to be imported manually before creating mask.");
  return t.mask === e && delete t.mask, t._mask && (t.mask = t._mask, delete t._mask), new e(t);
}
c.createMask = A;
class q {
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
c.MaskElement = q;
const Z = 90, kt = 89;
class M extends q {
  /** HTMLElement to use mask on */
  constructor(t) {
    super(), this.input = t, this._onKeydown = this._onKeydown.bind(this), this._onInput = this._onInput.bind(this), this._onBeforeinput = this._onBeforeinput.bind(this), this._onCompositionEnd = this._onCompositionEnd.bind(this);
  }
  get rootElement() {
    var t, e, i;
    return (t = (e = (i = this.input).getRootNode) == null ? void 0 : e.call(i)) != null ? t : document;
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
    if (this._handlers.redo && (t.keyCode === Z && t.shiftKey && (t.metaKey || t.ctrlKey) || t.keyCode === kt && t.ctrlKey))
      return t.preventDefault(), this._handlers.redo(t);
    if (this._handlers.undo && t.keyCode === Z && (t.metaKey || t.ctrlKey))
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
c.HTMLMaskElement = M;
class vt extends M {
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
c.HTMLMaskElement = M;
class J extends M {
  /** Returns HTMLElement selection start */
  get _unsafeSelectionStart() {
    const t = this.rootElement, e = t.getSelection && t.getSelection(), i = e && e.anchorOffset, s = e && e.focusOffset;
    return s == null || i == null || i < s ? i : s;
  }
  /** Returns HTMLElement selection end */
  get _unsafeSelectionEnd() {
    const t = this.rootElement, e = t.getSelection && t.getSelection(), i = e && e.anchorOffset, s = e && e.focusOffset;
    return s == null || i == null || i > s ? i : s;
  }
  /** Sets HTMLElement selection */
  _unsafeSelect(t, e) {
    if (!this.rootElement.createRange) return;
    const i = this.rootElement.createRange();
    i.setStart(this.input.firstChild || this.input, t), i.setEnd(this.input.lastChild || this.input, e);
    const s = this.rootElement, a = s.getSelection && s.getSelection();
    a && (a.removeAllRanges(), a.addRange(i));
  }
  /** HTMLElement value */
  get value() {
    return this.input.textContent || "";
  }
  set value(t) {
    this.input.textContent = t;
  }
}
c.HTMLContenteditableMaskElement = J;
class R {
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
    this.currentIndex < this.states.length - 1 && (this.states.length = this.currentIndex + 1), this.states.push(t), this.states.length > R.MAX_LENGTH && this.states.shift(), this.currentIndex = this.states.length - 1;
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
R.MAX_LENGTH = 100;
class xt {
  /**
    View element
  */
  /** Internal {@link Masked} model */
  constructor(t, e) {
    this.el = t instanceof q ? t : t.isContentEditable && t.tagName !== "INPUT" && t.tagName !== "TEXTAREA" ? new J(t) : new vt(t), this.masked = A(e), this._listeners = {}, this._value = "", this._unmaskedValue = "", this._rawInputValue = "", this.history = new R(), this._saveSelection = this._saveSelection.bind(this), this._onInput = this._onInput.bind(this), this._onChange = this._onChange.bind(this), this._onDrop = this._onDrop.bind(this), this._onFocus = this._onFocus.bind(this), this._onClick = this._onClick.bind(this), this._onUndo = this._onUndo.bind(this), this._onRedo = this._onRedo.bind(this), this.alignCursor = this.alignCursor.bind(this), this.alignCursorFriendly = this.alignCursorFriendly.bind(this), this._bindEvents(), this.updateValue(), this._onChange();
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
    if (!(t instanceof c.Masked) && this.masked.constructor === W(t)) {
      this.masked.updateOptions({
        mask: t
      });
      return;
    }
    const e = t instanceof c.Masked ? t : A({
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
    const i = this._listeners[t];
    i && i.forEach((s) => s(e));
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
    const e = this.masked.unmaskedValue, i = this.masked.value, s = this.masked.rawInputValue, a = this.displayValue, r = this.unmaskedValue !== e || this.value !== i || this._rawInputValue !== s;
    this._unmaskedValue = e, this._value = i, this._rawInputValue = s, this.el.value !== a && (this.el.value = a), t === "auto" ? this.alignCursor() : t != null && (this.cursorPos = t), r && this._fireChangeEvents(), !this._historyChanging && (r || this.history.isEmpty) && this.history.push({
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
      ...i
    } = t, s = !this.maskEquals(e), a = this.masked.optionsIsChanged(i);
    s && (this.mask = e), a && this.masked.updateOptions(i), (s || a) && this.updateControl();
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
    const i = this._listeners[t].indexOf(e);
    return i >= 0 && this._listeners[t].splice(i, 1), this;
  }
  /** Handles view input event */
  _onInput(t) {
    this._inputEvent = t, this._abortUpdateCursor();
    const e = new _t({
      // new state
      value: this.el.value,
      cursorPos: this.cursorPos,
      // old state
      oldValue: this.displayValue,
      oldSelection: this._selection
    }), i = this.masked.rawInputValue, s = this.masked.splice(e.startChangePos, e.removed.length, e.inserted, e.removeDirection, {
      input: !0,
      raw: !0
    }).offset, a = i === this.masked.rawInputValue ? e.removeDirection : o.NONE;
    let r = this.masked.nearestInputPos(e.startChangePos + s, a);
    a !== o.NONE && (r = this.masked.nearestInputPos(r, o.NONE)), this.updateControl(r), delete this._inputEvent;
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
c.InputMask = xt;
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
class y {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor(t, e, i) {
    t === void 0 && (t = ""), e === void 0 && (e = 0), this.value = t, this.from = e, this.stop = i;
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
  extractInput(t, e, i) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), this.displayValue.slice(t, e);
  }
  /** Extracts tail in range */
  extractTail(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), new y(this.extractInput(t, e), t);
  }
  /** Appends tail */
  appendTail(t) {
    return F(t) && (t = new y(String(t))), t.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(t, e) {
    return t ? (this._value += t, new m({
      inserted: t,
      rawInserted: t
    })) : new m();
  }
  /** Appends char */
  _appendChar(t, e, i) {
    e === void 0 && (e = {});
    const s = this.state;
    let a;
    if ([t, a] = this.doPrepareChar(t, e), t && (a = a.aggregate(this._appendCharRaw(t, e)), !a.rawInserted && this.autofix === "pad")) {
      const r = this.state;
      this.state = s;
      let u = this.pad(e);
      const l = this._appendCharRaw(t, e);
      u = u.aggregate(l), l.rawInserted || u.equals(a) ? a = u : this.state = r;
    }
    if (a.inserted) {
      let r, u = this.doValidate(e) !== !1;
      if (u && i != null) {
        const l = this.state;
        if (this.overwrite === !0) {
          r = i.state;
          for (let g = 0; g < a.rawInserted.length; ++g)
            i.unshift(this.displayValue.length - a.tailShift);
        }
        let d = this.appendTail(i);
        if (u = d.rawInserted.length === i.toString().length, !(u && d.inserted) && this.overwrite === "shift") {
          this.state = l, r = i.state;
          for (let g = 0; g < a.rawInserted.length; ++g)
            i.shift();
          d = this.appendTail(i), u = d.rawInserted.length === i.toString().length;
        }
        u && d.inserted && (this.state = l);
      }
      u || (a = new m(), this.state = s, i && r && (i.state = r));
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
  append(t, e, i) {
    if (!F(t)) throw new Error("value should be string");
    const s = F(i) ? new y(String(i)) : i;
    e != null && e.tail && (e._beforeTailState = this.state);
    let a;
    [t, a] = this.doPrepare(t, e);
    for (let r = 0; r < t.length; ++r) {
      const u = this._appendChar(t[r], e, s);
      if (!u.rawInserted && !this.doSkipInvalid(t[r], e, s)) break;
      a.aggregate(u);
    }
    return (this.eager === !0 || this.eager === "append") && e != null && e.input && t && a.aggregate(this._appendEager()), s != null && (a.tailShift += this.appendTail(s).tailShift), a;
  }
  remove(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), this._value = this.displayValue.slice(0, t) + this.displayValue.slice(e), new m();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(t) {
    if (this._refreshing || !this._initialized) return t();
    this._refreshing = !0;
    const e = this.rawInputValue, i = this.value, s = t();
    return this.rawInputValue = e, this.value && this.value !== i && i.indexOf(this.value) === 0 && (this.append(i.slice(this.displayValue.length), {}, ""), this.doCommit()), delete this._refreshing, s;
  }
  runIsolated(t) {
    if (this._isolated || !this._initialized) return t(this);
    this._isolated = !0;
    const e = this.state, i = t(this);
    return this.state = e, delete this._isolated, i;
  }
  doSkipInvalid(t, e, i) {
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
  splice(t, e, i, s, a) {
    i === void 0 && (i = ""), s === void 0 && (s = o.NONE), a === void 0 && (a = {
      input: !0
    });
    const r = t + e, u = this.extractTail(r), l = this.eager === !0 || this.eager === "remove";
    let d;
    l && (s = gt(s), d = this.extractInput(0, r, {
      raw: !0
    }));
    let g = t;
    const k = new m();
    if (s !== o.NONE && (g = this.nearestInputPos(t, e > 1 && t !== 0 && !l ? o.NONE : s), k.tailShift = g - t), k.aggregate(this.remove(g)), l && s !== o.NONE && d === this.rawInputValue)
      if (s === o.FORCE_LEFT) {
        let b;
        for (; d === this.rawInputValue && (b = this.displayValue.length); )
          k.aggregate(new m({
            tailShift: -1
          })).aggregate(this.remove(b - 1));
      } else s === o.FORCE_RIGHT && u.unshift();
    return k.aggregate(this.append(i, a, u));
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
class B {
  /** */
  constructor(t, e) {
    t === void 0 && (t = []), e === void 0 && (e = 0), this.chunks = t, this.from = e;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(t) {
    if (!String(t)) return;
    t = F(t) ? new y(String(t)) : t;
    const e = this.chunks[this.chunks.length - 1], i = e && // if stops are same or tail has no stop
    (e.stop === t.stop || t.stop == null) && // if tail chunk goes just after last chunk
    t.from === e.from + e.toString().length;
    if (t instanceof y)
      i ? e.extend(t.toString()) : this.chunks.push(t);
    else if (t instanceof B) {
      if (t.stop == null) {
        let s;
        for (; t.chunks.length && t.chunks[0].stop == null; )
          s = t.chunks.shift(), s.from += t.from, this.extend(s);
      }
      t.toString() && (t.stop = t.blockIndex, this.chunks.push(t));
    }
  }
  appendTo(t) {
    if (!(t instanceof c.MaskedPattern))
      return new y(this.toString()).appendTo(t);
    const e = new m();
    for (let i = 0; i < this.chunks.length; ++i) {
      const s = this.chunks[i], a = t._mapPosToBlock(t.displayValue.length), r = s.stop;
      let u;
      if (r != null && // if block not found or stop is behind lastBlock
      (!a || a.index <= r) && ((s instanceof B || // for continuous block also check if stop is exist
      t._stops.indexOf(r) >= 0) && e.aggregate(t._appendPlaceholder(r)), u = s instanceof B && t._blocks[r]), u) {
        const l = u.appendTail(s);
        e.aggregate(l);
        const d = s.toString().slice(l.rawInserted.length);
        d && e.aggregate(t.append(d, {
          tail: !0
        }));
      } else
        e.aggregate(t.append(s.toString(), {
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
      ...i
    } = t;
    Object.assign(this, i), this.chunks = e.map((s) => {
      const a = "chunks" in s ? new B() : new y();
      return a.state = s, a;
    });
  }
  unshift(t) {
    if (!this.chunks.length || t != null && this.from >= t) return "";
    const e = t != null ? t - this.from : t;
    let i = 0;
    for (; i < this.chunks.length; ) {
      const s = this.chunks[i], a = s.unshift(e);
      if (s.toString()) {
        if (!a) break;
        ++i;
      } else
        this.chunks.splice(i, 1);
      if (a) return a;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length) return "";
    let t = this.chunks.length - 1;
    for (; 0 <= t; ) {
      const e = this.chunks[t], i = e.shift();
      if (e.toString()) {
        if (!i) break;
        --t;
      } else
        this.chunks.splice(t, 1);
      if (i) return i;
    }
    return "";
  }
}
class bt {
  constructor(t, e) {
    this.masked = t, this._log = [];
    const {
      offset: i,
      index: s
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
    this.offset = i, this.index = s, this.ok = !1;
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
class Q {
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
    const i = 0, s = this._value.length;
    switch (e) {
      case o.LEFT:
      case o.FORCE_LEFT:
        return i;
      case o.NONE:
      case o.RIGHT:
      case o.FORCE_RIGHT:
      default:
        return s;
    }
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), this._isRawInput ? e - t : 0;
  }
  extractInput(t, e, i) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), i === void 0 && (i = {}), i.raw && this._isRawInput && this._value.slice(t, e) || "";
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return !!this._value;
  }
  _appendChar(t, e) {
    if (e === void 0 && (e = {}), this.isFilled) return new m();
    const i = this.eager === !0 || this.eager === "append", a = this.char === t && (this.isUnmasking || e.input || e.raw) && (!e.raw || !i) && !e.tail, r = new m({
      inserted: this.char,
      rawInserted: a ? this.char : ""
    });
    return this._value = this.char, this._isRawInput = a && (e.raw || e.input), r;
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
    return new y("");
  }
  appendTail(t) {
    return F(t) && (t = new y(String(t))), t.appendTo(this);
  }
  append(t, e, i) {
    const s = this._appendChar(t[0], e);
    return i != null && (s.tailShift += this.appendTail(i).tailShift), s;
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
class T {
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
      isOptional: i,
      placeholderChar: s,
      displayChar: a,
      lazy: r,
      eager: u,
      ...l
    } = t;
    this.masked = A(l), Object.assign(this, {
      parent: e,
      isOptional: i,
      placeholderChar: s,
      displayChar: a,
      lazy: r,
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
    const i = this.masked.state;
    let s = this.masked._appendChar(t, this.currentMaskFlags(e));
    return s.inserted && this.doValidate(e) === !1 && (s = new m(), this.masked.state = i), !s.inserted && !this.isOptional && !this.lazy && !e.input && (s.inserted = this.placeholderChar), s.skip = !s.inserted && !this.isOptional, this.isFilled = !!s.inserted, s;
  }
  append(t, e, i) {
    return this.masked.append(t, this.currentMaskFlags(e), i);
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
  extractInput(t, e, i) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.value.length), this.masked.extractInput(t, e, i);
  }
  nearestInputPos(t, e) {
    e === void 0 && (e = o.NONE);
    const i = 0, s = this.value.length, a = Math.min(Math.max(t, i), s);
    switch (e) {
      case o.LEFT:
      case o.FORCE_LEFT:
        return this.isComplete ? a : i;
      case o.RIGHT:
      case o.FORCE_RIGHT:
        return this.isComplete ? a : s;
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
T.DEFAULT_DEFINITIONS = {
  0: /\d/,
  a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./
};
class Ct extends v {
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
    e && (t.validate = (i) => i.search(e) >= 0), super._update(t);
  }
}
c.MaskedRegExp = Ct;
class x extends v {
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
      ...x.DEFAULTS,
      ...t,
      definitions: Object.assign({}, T.DEFAULT_DEFINITIONS, t == null ? void 0 : t.definitions)
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
    let i = !1, s = !1;
    for (let a = 0; a < e.length; ++a) {
      if (this.blocks) {
        const d = e.slice(a), g = Object.keys(this.blocks).filter((b) => d.indexOf(b) === 0);
        g.sort((b, S) => S.length - b.length);
        const k = g[0];
        if (k) {
          const {
            expose: b,
            repeat: S,
            ...nt
          } = I(this.blocks[k]), G = {
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite,
            autofix: this.autofix,
            ...nt,
            repeat: S,
            parent: this
          }, N = S != null ? new c.RepeatBlock(
            G
            /* TODO */
          ) : A(G);
          N && (this._blocks.push(N), b && (this.exposeBlock = N), this._maskedBlocks[k] || (this._maskedBlocks[k] = []), this._maskedBlocks[k].push(this._blocks.length - 1)), a += k.length - 1;
          continue;
        }
      }
      let r = e[a], u = r in t;
      if (r === x.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (r === "{" || r === "}") {
        i = !i;
        continue;
      }
      if (r === "[" || r === "]") {
        s = !s;
        continue;
      }
      if (r === x.ESCAPE_CHAR) {
        if (++a, r = e[a], !r) break;
        u = !1;
      }
      const l = u ? new T({
        isOptional: s,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar,
        ...I(t[r]),
        parent: this
      }) : new Q({
        char: r,
        eager: this.eager,
        isUnmasking: i
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
      ...i
    } = t;
    this._blocks.forEach((s, a) => s.state = e[a]), super.state = i;
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
    let i = (t = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : t.index;
    if (i == null) return e;
    this._blocks[i].isFilled && ++i;
    for (let s = i; s < this._blocks.length; ++s) {
      const a = this._blocks[s]._appendEager();
      if (!a.inserted) break;
      e.aggregate(a);
    }
    return e;
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = this._mapPosToBlock(this.displayValue.length), s = new m();
    if (!i) return s;
    for (let r = i.index, u; u = this._blocks[r]; ++r) {
      var a;
      const l = u._appendChar(t, {
        ...e,
        _beforeTailState: (a = e._beforeTailState) == null || (a = a._blocks) == null ? void 0 : a[r]
      });
      if (s.aggregate(l), l.consumed) break;
    }
    return s;
  }
  extractTail(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const i = new B();
    return t === e || this._forEachBlocksInRange(t, e, (s, a, r, u) => {
      const l = s.extractTail(r, u);
      l.stop = this._findStopBefore(a), l.from = this._blockStartPos(a), l instanceof B && (l.blockIndex = a), i.extend(l);
    }), i;
  }
  extractInput(t, e, i) {
    if (t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), i === void 0 && (i = {}), t === e) return "";
    let s = "";
    return this._forEachBlocksInRange(t, e, (a, r, u, l) => {
      s += a.extractInput(u, l, i);
    }), s;
  }
  _findStopBefore(t) {
    let e;
    for (let i = 0; i < this._stops.length; ++i) {
      const s = this._stops[i];
      if (s <= t) e = s;
      else break;
    }
    return e;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(t) {
    const e = new m();
    if (this.lazy && t == null) return e;
    const i = this._mapPosToBlock(this.displayValue.length);
    if (!i) return e;
    const s = i.index, a = t ?? this._blocks.length;
    return this._blocks.slice(s, a).forEach((r) => {
      if (!r.lazy || t != null) {
        var u;
        e.aggregate(r._appendPlaceholder((u = r._blocks) == null ? void 0 : u.length));
      }
    }), e;
  }
  /** Finds block in pos */
  _mapPosToBlock(t) {
    let e = "";
    for (let i = 0; i < this._blocks.length; ++i) {
      const s = this._blocks[i], a = e.length;
      if (e += s.displayValue, t <= e.length)
        return {
          index: i,
          offset: t - a
        };
    }
  }
  _blockStartPos(t) {
    return this._blocks.slice(0, t).reduce((e, i) => e += i.displayValue.length, 0);
  }
  _forEachBlocksInRange(t, e, i) {
    e === void 0 && (e = this.displayValue.length);
    const s = this._mapPosToBlock(t);
    if (s) {
      const a = this._mapPosToBlock(e), r = a && s.index === a.index, u = s.offset, l = a && r ? a.offset : this._blocks[s.index].displayValue.length;
      if (i(this._blocks[s.index], s.index, u, l), a && !r) {
        for (let d = s.index + 1; d < a.index; ++d)
          i(this._blocks[d], d, 0, this._blocks[d].displayValue.length);
        i(this._blocks[a.index], a.index, 0, a.offset);
      }
    }
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const i = super.remove(t, e);
    return this._forEachBlocksInRange(t, e, (s, a, r, u) => {
      i.aggregate(s.remove(r, u));
    }), i;
  }
  nearestInputPos(t, e) {
    if (e === void 0 && (e = o.NONE), !this._blocks.length) return 0;
    const i = new bt(this, t);
    if (e === o.NONE)
      return i.pushRightBeforeInput() || (i.popState(), i.pushLeftBeforeInput()) ? i.pos : this.displayValue.length;
    if (e === o.LEFT || e === o.FORCE_LEFT) {
      if (e === o.LEFT) {
        if (i.pushRightBeforeFilled(), i.ok && i.pos === t) return t;
        i.popState();
      }
      if (i.pushLeftBeforeInput(), i.pushLeftBeforeRequired(), i.pushLeftBeforeFilled(), e === o.LEFT) {
        if (i.pushRightBeforeInput(), i.pushRightBeforeRequired(), i.ok && i.pos <= t || (i.popState(), i.ok && i.pos <= t)) return i.pos;
        i.popState();
      }
      return i.ok ? i.pos : e === o.FORCE_LEFT ? 0 : (i.popState(), i.ok || (i.popState(), i.ok) ? i.pos : 0);
    }
    return e === o.RIGHT || e === o.FORCE_RIGHT ? (i.pushRightBeforeInput(), i.pushRightBeforeRequired(), i.pushRightBeforeFilled() ? i.pos : e === o.FORCE_RIGHT ? this.displayValue.length : (i.popState(), i.ok || (i.popState(), i.ok) ? i.pos : this.nearestInputPos(t, o.LEFT))) : t;
  }
  totalInputPositions(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    let i = 0;
    return this._forEachBlocksInRange(t, e, (s, a, r, u) => {
      i += s.totalInputPositions(r, u);
    }), i;
  }
  /** Get block by name */
  maskedBlock(t) {
    return this.maskedBlocks(t)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(t) {
    const e = this._maskedBlocks[t];
    return e ? e.map((i) => this._blocks[i]) : [];
  }
  pad(t) {
    const e = new m();
    return this._forEachBlocksInRange(0, this.displayValue.length, (i) => e.aggregate(i.pad(t))), e;
  }
}
x.DEFAULTS = {
  ...v.DEFAULTS,
  lazy: !0,
  placeholderChar: "_"
};
x.STOP_CHAR = "`";
x.ESCAPE_CHAR = "\\";
x.InputDefinition = T;
x.FixedDefinition = Q;
c.MaskedPattern = x;
class V extends x {
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
      from: i = this.from || 0,
      maxLength: s = this.maxLength || 0,
      autofix: a = this.autofix,
      ...r
    } = t;
    this.to = e, this.from = i, this.maxLength = Math.max(String(e).length, s), this.autofix = a;
    const u = String(this.from).padStart(this.maxLength, "0"), l = String(this.to).padStart(this.maxLength, "0");
    let d = 0;
    for (; d < l.length && l[d] === u[d]; ) ++d;
    r.mask = l.slice(0, d).replace(/0/g, "\\0") + "0".repeat(this.maxLength - d), super._update(r);
  }
  get isComplete() {
    return super.isComplete && !!this.value;
  }
  boundaries(t) {
    let e = "", i = "";
    const [, s, a] = t.match(/^(\D*)(\d*)(\D*)/) || [];
    return a && (e = "0".repeat(s.length) + a, i = "9".repeat(s.length) + a), e = e.padEnd(this.maxLength, "0"), i = i.padEnd(this.maxLength, "9"), [e, i];
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let i;
    return [t, i] = super.doPrepareChar(t.replace(/\D/g, ""), e), t || (i.skip = !this.isComplete), [t, i];
  }
  _appendCharRaw(t, e) {
    if (e === void 0 && (e = {}), !this.autofix || this.value.length + 1 > this.maxLength) return super._appendCharRaw(t, e);
    const i = String(this.from).padStart(this.maxLength, "0"), s = String(this.to).padStart(this.maxLength, "0"), [a, r] = this.boundaries(this.value + t);
    return Number(r) < this.from ? super._appendCharRaw(i[this.value.length], e) : Number(a) > this.to ? !e.tail && this.autofix === "pad" && this.value.length + 1 < this.maxLength ? super._appendCharRaw(i[this.value.length], e).aggregate(this._appendCharRaw(t, e)) : super._appendCharRaw(s[this.value.length], e) : super._appendCharRaw(t, e);
  }
  doValidate(t) {
    const e = this.value;
    if (e.search(/[^0]/) === -1 && e.length <= this._matchFrom) return !0;
    const [s, a] = this.boundaries(e);
    return this.from <= Number(a) && Number(s) <= this.to && super.doValidate(t);
  }
  pad(t) {
    const e = new m();
    if (this.value.length === this.maxLength) return e;
    const i = this.value, s = this.maxLength - this.value.length;
    if (s) {
      this.reset();
      for (let a = 0; a < s; ++a)
        e.aggregate(super._appendCharRaw("0", t));
      i.split("").forEach((a) => this._appendCharRaw(a));
    }
    return e;
  }
}
c.MaskedRange = V;
const yt = "d{.}`m{.}`Y";
class E extends x {
  static extractPatternOptions(t) {
    const {
      mask: e,
      pattern: i,
      ...s
    } = t;
    return {
      ...s,
      mask: F(e) ? e : i
    };
  }
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(t) {
    super(E.extractPatternOptions({
      ...E.DEFAULTS,
      ...t
    }));
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      mask: e,
      pattern: i,
      blocks: s,
      ...a
    } = {
      ...E.DEFAULTS,
      ...t
    }, r = Object.assign({}, E.GET_DEFAULT_BLOCKS());
    t.min && (r.Y.from = t.min.getFullYear()), t.max && (r.Y.to = t.max.getFullYear()), t.min && t.max && r.Y.from === r.Y.to && (r.m.from = t.min.getMonth() + 1, r.m.to = t.max.getMonth() + 1, r.m.from === r.m.to && (r.d.from = t.min.getDate(), r.d.to = t.max.getDate())), Object.assign(r, this.blocks, s), super._update({
      ...a,
      mask: F(e) ? e : i,
      blocks: r
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
    return super.optionsIsChanged(E.extractPatternOptions(t));
  }
}
E.GET_DEFAULT_BLOCKS = () => ({
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
E.DEFAULTS = {
  ...x.DEFAULTS,
  mask: Date,
  pattern: yt,
  format: (n, t) => {
    if (!n) return "";
    const e = String(n.getDate()).padStart(2, "0"), i = String(n.getMonth() + 1).padStart(2, "0"), s = n.getFullYear();
    return [e, i, s].join(".");
  },
  parse: (n, t) => {
    const [e, i, s] = n.split(".").map(Number);
    return new Date(s, i - 1, e);
  }
};
c.MaskedDate = E;
class O extends v {
  constructor(t) {
    super({
      ...O.DEFAULTS,
      ...t
    }), this.currentMask = void 0;
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update(t), "mask" in t && (this.exposeMask = void 0, this.compiledMasks = Array.isArray(t.mask) ? t.mask.map((e) => {
      const {
        expose: i,
        ...s
      } = I(e), a = A({
        overwrite: this._overwrite,
        eager: this._eager,
        skipInvalid: this._skipInvalid,
        ...s
      });
      return i && (this.exposeMask = a), a;
    }) : []);
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = this._applyDispatch(t, e);
    return this.currentMask && i.aggregate(this.currentMask._appendChar(t, this.currentMaskFlags(e))), i;
  }
  _applyDispatch(t, e, i) {
    t === void 0 && (t = ""), e === void 0 && (e = {}), i === void 0 && (i = "");
    const s = e.tail && e._beforeTailState != null ? e._beforeTailState._value : this.value, a = this.rawInputValue, r = e.tail && e._beforeTailState != null ? e._beforeTailState._rawInputValue : a, u = a.slice(r.length), l = this.currentMask, d = new m(), g = l == null ? void 0 : l.state;
    return this.currentMask = this.doDispatch(t, {
      ...e
    }, i), this.currentMask && (this.currentMask !== l ? (this.currentMask.reset(), r && (this.currentMask.append(r, {
      raw: !0
    }), d.tailShift = this.currentMask.value.length - s.length), u && (d.tailShift += this.currentMask.append(u, {
      raw: !0,
      tail: !0
    }).tailShift)) : g && (this.currentMask.state = g)), d;
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
    var e, i;
    return {
      ...t,
      _beforeTailState: ((e = t._beforeTailState) == null ? void 0 : e.currentMaskRef) === this.currentMask && ((i = t._beforeTailState) == null ? void 0 : i.currentMask) || t._beforeTailState
    };
  }
  doDispatch(t, e, i) {
    return e === void 0 && (e = {}), i === void 0 && (i = ""), this.dispatch(t, this, e, i);
  }
  doValidate(t) {
    return super.doValidate(t) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(t)));
  }
  doPrepare(t, e) {
    e === void 0 && (e = {});
    let [i, s] = super.doPrepare(t, e);
    if (this.currentMask) {
      let a;
      [i, a] = super.doPrepare(i, this.currentMaskFlags(e)), s = s.aggregate(a);
    }
    return [i, s];
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let [i, s] = super.doPrepareChar(t, e);
    if (this.currentMask) {
      let a;
      [i, a] = super.doPrepareChar(i, this.currentMaskFlags(e)), s = s.aggregate(a);
    }
    return [i, s];
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
    const i = new m();
    return this.currentMask && i.aggregate(this.currentMask.remove(t, e)).aggregate(this._applyDispatch()), i;
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
      currentMaskRef: i,
      currentMask: s,
      ...a
    } = t;
    e && this.compiledMasks.forEach((r, u) => r.state = e[u]), i != null && (this.currentMask = i, this.currentMask.state = s), super.state = a;
  }
  extractInput(t, e, i) {
    return this.currentMask ? this.currentMask.extractInput(t, e, i) : "";
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
    return Array.isArray(t) ? this.compiledMasks.every((e, i) => {
      if (!t[i]) return;
      const {
        mask: s,
        ...a
      } = t[i];
      return D(e, a) && e.maskEquals(s);
    }) : super.maskEquals(t);
  }
  typedValueEquals(t) {
    var e;
    return !!((e = this.currentMask) != null && e.typedValueEquals(t));
  }
}
O.DEFAULTS = {
  ...v.DEFAULTS,
  dispatch: (n, t, e, i) => {
    if (!t.compiledMasks.length) return;
    const s = t.rawInputValue, a = t.compiledMasks.map((r, u) => {
      const l = t.currentMask === r, d = l ? r.displayValue.length : r.nearestInputPos(r.displayValue.length, o.FORCE_LEFT);
      return r.rawInputValue !== s ? (r.reset(), r.append(s, {
        raw: !0
      })) : l || r.remove(d), r.append(n, t.currentMaskFlags(e)), r.appendTail(i), {
        index: u,
        weight: r.rawInputValue.length,
        totalInputPositions: r.totalInputPositions(0, Math.max(d, r.nearestInputPos(r.displayValue.length, o.FORCE_LEFT)))
      };
    });
    return a.sort((r, u) => u.weight - r.weight || u.totalInputPositions - r.totalInputPositions), t.compiledMasks[a[0].index];
  }
};
c.MaskedDynamic = O;
class L extends x {
  constructor(t) {
    super({
      ...L.DEFAULTS,
      ...t
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      enum: e,
      ...i
    } = t;
    if (e) {
      const s = e.map((u) => u.length), a = Math.min(...s), r = Math.max(...s) - a;
      i.mask = "*".repeat(a), r && (i.mask += "[" + "*".repeat(r) + "]"), this.enum = e;
    }
    super._update(i);
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = Math.min(this.nearestInputPos(0, o.FORCE_RIGHT), this.value.length), s = this.enum.filter((a) => this.matchValue(a, this.unmaskedValue + t, i));
    if (s.length) {
      s.length === 1 && this._forEachBlocksInRange(0, this.value.length, (r, u) => {
        const l = s[0][u];
        u >= this.value.length || l === r.value || (r.reset(), r._appendChar(l, e));
      });
      const a = super._appendCharRaw(s[0][this.value.length], e);
      return s.length === 1 && s[0].slice(this.unmaskedValue.length).split("").forEach((r) => a.aggregate(super._appendCharRaw(r))), a;
    }
    return new m({
      skip: !this.isComplete
    });
  }
  extractTail(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), new y("", t);
  }
  remove(t, e) {
    if (t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), t === e) return new m();
    const i = Math.min(super.nearestInputPos(0, o.FORCE_RIGHT), this.value.length);
    let s;
    for (s = t; s >= 0 && !(this.enum.filter((u) => this.matchValue(u, this.value.slice(i, s), i)).length > 1); --s)
      ;
    const a = super.remove(s, e);
    return a.tailShift += s - t, a;
  }
  get isComplete() {
    return this.enum.indexOf(this.value) >= 0;
  }
}
L.DEFAULTS = {
  ...x.DEFAULTS,
  matchValue: (n, t, e) => n.indexOf(t, e) === e
};
c.MaskedEnum = L;
class Et extends v {
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
c.MaskedFunction = Et;
var tt;
class C extends v {
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
      ...C.DEFAULTS,
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
    const t = "^" + (this.allowNegative ? "[+|\\-]?" : ""), e = "\\d*", i = (this.scale ? "(" + z(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
    this._numberRegExp = new RegExp(t + e + i), this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(z).join("") + "]", "g"), this._thousandsSeparatorRegExp = new RegExp(z(this.thousandsSeparator), "g");
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
    const [i, s] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    (e.input && e.raw || !e.input && !e.raw) ? t.replace(this._mapToRadixRegExp, this.radix) : t), e);
    return t && !i && (s.skip = !0), i && !this.allowPositive && !this.value && i !== "-" && s.aggregate(this._appendChar("-")), [i, s];
  }
  _separatorsCount(t, e) {
    e === void 0 && (e = !1);
    let i = 0;
    for (let s = 0; s < t; ++s)
      this._value.indexOf(this.thousandsSeparator, s) === s && (++i, e && (t += this.thousandsSeparator.length));
    return i;
  }
  _separatorsCountFromSlice(t) {
    return t === void 0 && (t = this._value), this._separatorsCount(this._removeThousandsSeparators(t).length, !0);
  }
  extractInput(t, e, i) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), [t, e] = this._adjustRangeWithSeparators(t, e), this._removeThousandsSeparators(super.extractInput(t, e, i));
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value, s = this._separatorsCountFromSlice(i);
    this._value = this._removeThousandsSeparators(this.value);
    const a = this._value;
    this._value += t;
    const r = this.number;
    let u = !isNaN(r), l = !1;
    if (u) {
      let b;
      this.min != null && this.min < 0 && this.number < this.min && (b = this.min), this.max != null && this.max > 0 && this.number > this.max && (b = this.max), b != null && (this.autofix ? (this._value = this.format(b, this).replace(C.UNMASKED_RADIX, this.radix), l || (l = a === this._value && !e.tail)) : u = !1), u && (u = !!this._value.match(this._numberRegExp));
    }
    let d;
    u ? d = new m({
      inserted: this._value.slice(a.length),
      rawInserted: l ? "" : t,
      skip: l
    }) : (this._value = a, d = new m()), this._value = this._insertThousandsSeparators(this._value);
    const g = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value, k = this._separatorsCountFromSlice(g);
    return d.tailShift += (k - s) * this.thousandsSeparator.length, d;
  }
  _findSeparatorAround(t) {
    if (this.thousandsSeparator) {
      const e = t - this.thousandsSeparator.length + 1, i = this.value.indexOf(this.thousandsSeparator, e);
      if (i <= t) return i;
    }
    return -1;
  }
  _adjustRangeWithSeparators(t, e) {
    const i = this._findSeparatorAround(t);
    i >= 0 && (t = i);
    const s = this._findSeparatorAround(e);
    return s >= 0 && (e = s + this.thousandsSeparator.length), [t, e];
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), [t, e] = this._adjustRangeWithSeparators(t, e);
    const i = this.value.slice(0, t), s = this.value.slice(e), a = this._separatorsCount(i.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(i + s));
    const r = this._separatorsCountFromSlice(i);
    return new m({
      tailShift: (r - a) * this.thousandsSeparator.length
    });
  }
  nearestInputPos(t, e) {
    if (!this.thousandsSeparator) return t;
    switch (e) {
      case o.NONE:
      case o.LEFT:
      case o.FORCE_LEFT: {
        const i = this._findSeparatorAround(t - 1);
        if (i >= 0) {
          const s = i + this.thousandsSeparator.length;
          if (t < s || this.value.length <= s || e === o.FORCE_LEFT)
            return i;
        }
        break;
      }
      case o.RIGHT:
      case o.FORCE_RIGHT: {
        const i = this._findSeparatorAround(t);
        if (i >= 0)
          return i + this.thousandsSeparator.length;
      }
    }
    return t;
  }
  doCommit() {
    if (this.value) {
      const t = this.number;
      let e = t;
      this.min != null && (e = Math.max(e, this.min)), this.max != null && (e = Math.min(e, this.max)), e !== t && (this.unmaskedValue = this.format(e, this));
      let i = this.value;
      this.normalizeZeros && (i = this._normalizeZeros(i)), this.padFractionalZeros && this.scale > 0 && (i = this._padFractionalZeros(i)), this._value = i;
    }
    super.doCommit();
  }
  _normalizeZeros(t) {
    const e = this._removeThousandsSeparators(t).split(this.radix);
    return e[0] = e[0].replace(/^(\D*)(0*)(\d*)/, (i, s, a, r) => s + r), t.length && !/\d$/.test(e[0]) && (e[0] = e[0] + "0"), e.length > 1 && (e[1] = e[1].replace(/0*$/, ""), e[1].length || (e.length = 1)), this._insertThousandsSeparators(e.join(this.radix));
  }
  _padFractionalZeros(t) {
    if (!t) return t;
    const e = t.split(this.radix);
    return e.length < 2 && e.push(""), e[1] = e[1].padEnd(this.scale, "0"), e.join(this.radix);
  }
  doSkipInvalid(t, e, i) {
    e === void 0 && (e = {});
    const s = this.scale === 0 && t !== this.thousandsSeparator && (t === this.radix || t === C.UNMASKED_RADIX || this.mapToRadix.includes(t));
    return super.doSkipInvalid(t, e, i) && !s;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, C.UNMASKED_RADIX);
  }
  set unmaskedValue(t) {
    super.unmaskedValue = t;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(t) {
    this.rawInputValue = this.format(t, this).replace(C.UNMASKED_RADIX, this.radix);
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
    return (super.typedValueEquals(t) || C.EMPTY_VALUES.includes(t) && C.EMPTY_VALUES.includes(this.typedValue)) && !(t === 0 && this.value === "");
  }
}
tt = C;
C.UNMASKED_RADIX = ".";
C.EMPTY_VALUES = [...v.EMPTY_VALUES, 0];
C.DEFAULTS = {
  ...v.DEFAULTS,
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [tt.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: !0,
  padFractionalZeros: !1,
  parse: Number,
  format: (n) => n.toLocaleString("en-US", {
    useGrouping: !1,
    maximumFractionDigits: 20
  })
};
c.MaskedNumber = C;
const U = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue"
};
function et(n, t, e) {
  t === void 0 && (t = U.MASKED), e === void 0 && (e = U.MASKED);
  const i = A(n);
  return (s) => i.runIsolated((a) => (a[t] = s, a[e]));
}
function At(n, t, e, i) {
  return et(t, e, i)(n);
}
c.PIPE_TYPE = U;
c.createPipe = et;
c.pipe = At;
class Ft extends x {
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
    var e, i, s;
    const {
      repeat: a,
      ...r
    } = I(t);
    this._blockOpts = Object.assign({}, this._blockOpts, r);
    const u = A(this._blockOpts);
    this.repeat = (e = (i = a ?? u.repeat) != null ? i : this.repeat) != null ? e : 1 / 0, super._update({
      mask: "m".repeat(Math.max(this.repeatTo === 1 / 0 && ((s = this._blocks) == null ? void 0 : s.length) || 0, this.repeatFrom)),
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
      return this._blocks.push(A(this._blockOpts)), this.mask += "m", this._blocks[this._blocks.length - 1];
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = new m();
    for (
      let l = (s = (a = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : a.index) != null ? s : Math.max(this._blocks.length - 1, 0), d, g;
      // try to get a block or
      // try to allocate a new block if not allocated already
      d = (r = this._blocks[l]) != null ? r : g = !g && this._allocateBlock(l);
      ++l
    ) {
      var s, a, r, u;
      const k = d._appendChar(t, {
        ...e,
        _beforeTailState: (u = e._beforeTailState) == null || (u = u._blocks) == null ? void 0 : u[l]
      });
      if (k.skip && g) {
        this._blocks.pop(), this.mask = this.mask.slice(1);
        break;
      }
      if (i.aggregate(k), k.consumed) break;
    }
    return i;
  }
  _trimEmptyTail(t, e) {
    var i, s;
    t === void 0 && (t = 0);
    const a = Math.max(((i = this._mapPosToBlock(t)) == null ? void 0 : i.index) || 0, this.repeatFrom, 0);
    let r;
    e != null && (r = (s = this._mapPosToBlock(e)) == null ? void 0 : s.index), r == null && (r = this._blocks.length - 1);
    let u = 0;
    for (let l = r; a <= l && !this._blocks[l].unmaskedValue; --l, ++u)
      ;
    u && (this._blocks.splice(r - u + 1, u), this.mask = this.mask.slice(u));
  }
  reset() {
    super.reset(), this._trimEmptyTail();
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const i = super.remove(t, e);
    return this._trimEmptyTail(t, e), i;
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
c.RepeatBlock = Ft;
try {
  globalThis.IMask = c;
} catch {
}
const wt = dt`
  :host {
    display: block;
    line-height: normal;
  }

  :host([data-user-invalid])::part(base) {
    border-color: var(--cx-input-invalid-border-color);
  }

  :host([data-user-invalid]:focus-within)::part(base) {
    border-color: var(--cx-input-invalid-border-color);
    box-shadow: var(--cx-input-invalid-shadow);
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-input-font-weight);
    letter-spacing: var(--cx-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) border,
      var(--cx-transition-fast) box-shadow,
      var(--cx-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--cx-input-background-color);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--cx-input-background-color-hover);
    border-color: var(--cx-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--cx-input-background-color-focus);
    border-color: var(--cx-input-border-color-focus);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--cx-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--cx-input-background-color-disabled);
    border-color: var(--cx-input-border-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .input--standard.input--disabled .input__control {
    color: var(--cx-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--cx-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--cx-input-filled-background-color);
    color: var(--cx-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--cx-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--cx-input-filled-background-color-focus);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--cx-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .input__control {
    font: inherit;
    min-width: 0;
    color: var(--cx-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
    line-height: var(--cx-line-height-medium);
  }

  .form-control--has-label .input__control {
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-2x-small);
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--cx-input-height-large)
      var(--cx-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--cx-color-primary-500);
    caret-color: var(--cx-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--cx-input-height-large)
      var(--cx-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--cx-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--cx-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(cx-icon),
  .input__suffix ::slotted(cx-icon) {
    color: var(--cx-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--cx-input-border-radius-small);
    font-size: var(--cx-input-font-size-small);
    min-height: var(--cx-input-height-small);
  }

  .input--small .input__control {
    padding-left: var(--cx-input-spacing-small);
    padding-right: var(--cx-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--cx-spacing-x-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .input--small .input__control--file {
    gap: calc(var(--cx-input-spacing-small) / 2);
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-x-small);
  }

  .input--medium {
    border-radius: var(--cx-input-border-radius-medium);
    font-size: var(--cx-input-font-size-medium);
    min-height: var(--cx-input-height-medium);
  }

  .input--medium .input__control {
    padding-left: var(--cx-input-spacing-medium);
    padding-right: var(--cx-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--cx-spacing-x-small) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .input--medium .input__control--file {
    gap: calc(var(--cx-input-spacing-medium) / 2);
  }

  .input--large {
    border-radius: var(--cx-input-border-radius-large);
    font-size: var(--cx-input-font-size-large);
    min-height: var(--cx-input-height-large);
  }

  .input--large .input__control {
    padding-left: var(--cx-input-spacing-large);
    padding-right: var(--cx-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--cx-input-spacing-small) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--cx-input-spacing-small);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--cx-input-spacing-small);
  }

  .input--large .input__control--file {
    gap: calc(var(--cx-input-spacing-large) / 2);
  }

  .input--button-only {
    padding: 0;
    border: 0;
    align-items: center;
  }

  .input--button-only .input__control--file {
    padding: 0;
    border: 0;
  }

  .input--button-only .input-container {
    display: none;
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--cx-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--cx-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--cx-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--cx-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--cx-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--cx-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='file'] {
    display: none;
  }

  /*
   * Adapt label to be inside input
   */

  .input-container {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    width: 0;
  }

  .form-control__label {
    position: relative;
    -webkit-transition: transform 0.2s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out;
    pointer-events: none;
    width: fit-content;
    line-height: 1; /* use line-height: 1 for easier transform calculation */
    text-transform: var(--cx-input-label-text-transform, none);
  }

  /* when empty with no placeholder (initial state), transform label to vertical center
    = (input height - label height) / 2
  */
  .form-control--has-label .input--small .form-control__label {
    padding: 0 var(--cx-input-spacing-small);
    transform: translateY(
      calc(
        (
            var(--cx-input-height-small) +
              1.25rem - var(--cx-input-font-size-small)
          ) /
          2
      )
    );
    margin: 0;
  }

  .form-control--has-label .input--medium .form-control__label {
    padding: 0 var(--cx-input-spacing-medium);
    transform: translateY(
      calc(
        (
            var(--cx-input-height-medium) +
              1rem - var(--cx-input-font-size-medium)
          ) /
          2
      )
    );
    margin: 0;
  }

  .form-control--has-label .input--large .form-control__label {
    padding: 0 var(--cx-input-spacing-large);
    transform: translateY(
      calc(
        (
            var(--cx-input-height-large) +
              1rem - var(--cx-input-font-size-large)
          ) /
          2
      )
    );
    margin: 0;
  }

  /* Increase input height if there's a label */
  .form-control--has-label .input--small,
  .form-control--file .input--small {
    min-height: calc(var(--cx-input-height-small) + 1rem);
  }
  .form-control--has-label .input--medium,
  .form-control--file .input--medium {
    min-height: calc(var(--cx-input-height-medium) + 1rem);
  }
  .form-control--has-label .input--large,
  .form-control--file .input--large {
    min-height: calc(var(--cx-input-height-large) + 1rem);
  }

  /* When focused or not empty, transform label to top
    Instead of 0, use var(--cx-spacing-2x-small) to have a distance from top
  */
  .form-control--has-label .input--focused .form-control__label,
  .form-control--has-label .input--has-placeholder .form-control__label,
  .form-control--has-label .input:not(.input--empty) .form-control__label {
    transform: translateY(
      calc(var(--cx-spacing-2x-small) + var(--cx-spacing-3x-small))
    ); /* distance from top */
  }

  .input__control--file {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-block: 0;
    text-align: start !important;
    width: 100%;
    height: 100%;
  }

  .input__control--file span {
    flex: 1 1 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  /*
   * Input groups support a variety of input types (e.g. inputs with tooltips, inputs as dropdown triggers, etc.).
   * This means inputs aren't always direct descendants of the input group, thus we can't target them with the
   * ::slotted selector. To work around this, the input group component does some magic to add these special classes to
   * inputs and we style them here instead.
   */

  :host(
      [data-cx-input-group__input--first]:not(
          [data-cx-input-group__input--last]
        )
    )
    .input {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-cx-input-group__input--inner]) .input {
    border-radius: 0;
  }

  :host(
      [data-cx-input-group__input--last]:not(
          [data-cx-input-group__input--first]
        )
    )
    .input {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-cx-input-group__input]:not([data-cx-input-group__input--first])) {
    margin-inline-start: calc(-1 * var(--cx-input-border-width));
  }

  /* Bump hovered, focused, and checked inputs up so their focus ring isn't clipped */
  :host([data-cx-input-group__input--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-cx-input-group__input--focus]),
  :host([data-cx-input-group__input][checked]) {
    z-index: 2;
  }
`;
var Bt = Object.defineProperty, It = Object.getOwnPropertyDescriptor, it = (n) => {
  throw TypeError(n);
}, p = (n, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? It(t, e) : t, a = n.length - 1, r; a >= 0; a--)
    (r = n[a]) && (s = (i ? r(t, e, s) : r(s)) || s);
  return i && s && Bt(t, e, s), s;
}, St = (n, t, e) => t.has(n) || it("Cannot " + e), Vt = (n, t, e) => (St(n, t, "read from private field"), e ? e.call(n) : t.get(n)), Dt = (n, t, e) => t.has(n) ? it("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(n) : t.set(n, e), P, st;
let h = class extends at {
  constructor() {
    super(...arguments), Dt(this, P), this.formControlController = new ht(this, {
      assumeInteractionOn: ["cx-blur", "cx-input"]
    }), this.hasSlotController = new pt(
      this,
      "help-text",
      "label"
    ), this.localize = new ft(this), this.hasFocus = !1, this.maskInstance = null, this.containerClicked = !1, this.title = "", this.__numberInput = Object.assign(document.createElement("input"), {
      type: "number"
    }), this.__dateInput = Object.assign(document.createElement("input"), {
      type: "date"
    }), this.type = "text", this.name = "", this.value = "", this.unmaskedValue = "", this.defaultValue = "", this.size = "medium", this.filled = !1, this.pill = !1, this.label = "", this.helpText = "", this.clearable = !1, this.disabled = !1, this.placeholder = "", this.readonly = !1, this.passwordToggle = !1, this.passwordVisible = !1, this.noSpinButtons = !1, this.form = "", this.required = !1, this.autocomplete = "off", this.spellcheck = !0, this.maskPlaceholder = "_", this.maskLazy = !1, this.maskOverwrite = !1, this.variant = "default", this.fileButtonLabel = "Choose file", this.buttonOnly = !1, this.fileResultLabel = (n) => {
      let t = "No file chosen";
      return n != null && n.length && (n.length === 1 ? t = n[0].name : n.length > 1 && (t = `${n.length} files`)), t;
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
    var n;
    return this.__dateInput.type = this.type, this.__dateInput.value = this.value, ((n = this.input) == null ? void 0 : n.valueAsDate) || this.__dateInput.valueAsDate;
  }
  set valueAsDate(n) {
    this.__dateInput.type = this.type, this.__dateInput.valueAsDate = n, this.value = this.__dateInput.value;
  }
  /** Gets or sets the current value as a number. Returns `NaN` if the value can't be converted. */
  get valueAsNumber() {
    var n;
    return this.__numberInput.value = this.value, ((n = this.input) == null ? void 0 : n.valueAsNumber) || this.__numberInput.valueAsNumber;
  }
  set valueAsNumber(n) {
    this.__numberInput.valueAsNumber = n, this.value = this.__numberInput.value;
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
      const n = {
        lazy: this.maskLazy,
        mask: this.mask,
        overwrite: this.maskOverwrite,
        placeholderChar: this.maskPlaceholder
      };
      this.maskInstance = c(this.input, n), this.value = this.maskInstance.value, this.unmaskedValue = this.maskInstance.unmaskedValue, this.maskInstance.on("accept", this.handleMaskAccept);
    }
  }
  connectedCallback() {
    super.connectedCallback(), this.initMaskInstance();
  }
  firstUpdated() {
    this.formControlController.updateValidity(), this.initMaskInstance();
  }
  disconnectedCallback() {
    var n, t;
    super.disconnectedCallback(), (n = this.maskInstance) == null || n.off("accept", this.handleMaskAccept), (t = this.maskInstance) == null || t.destroy();
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
  handleClearClick(n) {
    n.preventDefault(), this.value !== "" && (this.value = "", this.emit("cx-clear"), this.emit("cx-input"), this.emit("cx-change")), this.input.focus();
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  // handleInput is registered to the input element inside render()
  handleInput() {
    this.maskInstance || (this.value = this.input.value, this.unmaskedValue = this.input.value, this.formControlController.updateValidity(), this.emit("cx-input"));
  }
  handleInvalid(n) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(n);
  }
  handleKeyDown(n) {
    const t = n.metaKey || n.ctrlKey || n.shiftKey || n.altKey;
    n.key === "Enter" && !t && setTimeout(() => {
      !n.defaultPrevented && !n.isComposing && this.formControlController.submit();
    }), n.ctrlKey && n.key === "a" && this.input.select(), this.emit("cx-keydown", { detail: { event: n, value: this.value } });
  }
  handlePasswordToggle() {
    this.passwordVisible = !this.passwordVisible;
  }
  handleFileButtonClick() {
    this.input.click();
  }
  handleContainerMouseDown(n) {
    const t = n.composedPath();
    t.includes(this.inputContainer) && !t.includes(this.input) ? (this.containerClicked = !0, this.focus()) : this.containerClicked = !1;
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleStepChange() {
    this.input.step = String(this.step), this.formControlController.updateValidity();
  }
  async handleValueChange() {
    var n;
    await this.updateComplete, this.formControlController.updateValidity(), this.maskInstance && this.value !== ((n = this.maskInstance) == null ? void 0 : n.value) && this.maskInstance.updateValue();
  }
  /** Sets focus on the input. */
  focus(n) {
    this.input.focus(n);
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
  setSelectionRange(n, t, e = "none") {
    this.input.setSelectionRange(
      n,
      t,
      e
    );
  }
  /** Replaces a range of text with a new string. */
  setRangeText(n, t, e, i = "preserve") {
    const s = t ?? this.input.selectionStart, a = e ?? this.input.selectionEnd;
    this.input.setRangeText(
      n,
      s,
      a,
      i
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
  setCustomValidity(n) {
    this.input.setCustomValidity(n), this.formControlController.updateValidity();
  }
  render() {
    const n = this.hasSlotController.test("label"), t = this.hasSlotController.test("help-text"), e = this.label ? !0 : !!n, i = this.helpText ? !0 : !!t, a = this.clearable && !this.disabled && !this.readonly && (typeof this.value == "number" || this.value.length > 0), r = this.fileResultLabel(Vt(this, P, st));
    return w`
      <div
        part="form-control"
        class=${$({
      "form-control": !0,
      "form-control--file": this.type === "file",
      "form-control--has-help-text": i,
      "form-control--has-label": e,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${$({
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
                class="${$({
      "form-control__label": !0,
      "form-control__label--empty": !this.value
    })}"
                for="input"
                aria-hidden=${e ? "false" : "true"}
              >
                <slot name="label" part="label">${this.label}</slot>
              </label>
              <input
                part="input"
                id="input"
                class="input__control"
                type=${this.type === "password" && this.passwordVisible ? "text" : this.type}
                title=${this.title}
                aria-label=${_(this.ariaLabel)}
                name=${_(this.name)}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                placeholder=${_(this.placeholder)}
                minlength=${_(this.minlength)}
                maxlength=${_(this.maxlength)}
                min=${_(this.min)}
                max=${_(this.max)}
                step=${_(this.step)}
                .value=${ct(this.value)}
                autocapitalize=${_(this.autocapitalize)}
                autocomplete=${_(this.autocomplete)}
                autocorrect=${_(this.autocorrect)}
                ?autofocus=${this.autofocus}
                spellcheck=${this.spellcheck}
                pattern=${_(this.pattern)}
                enterkeyhint=${_(this.enterkeyhint)}
                inputmode=${_(this.inputmode)}
                aria-describedby="help-text"
                @change=${this.handleChange}
                @input=${this.handleInput}
                @invalid=${this.handleInvalid}
                @keydown=${this.handleKeyDown}
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
                accept=${_(this.accept)}
                ?multiple=${this.multiple}
              />
              ${this.type === "file" && !this.buttonOnly ? w`<div
                    class="input__control input__control--file"
                    part="file-control"
                    @click=${this.handleFileButtonClick}
                  >
                    <slot name="file-button">
                      <cx-button
                        part="file-button"
                        variant=${_(this.variant)}
                        size=${_(this.size)}
                        ?disabled=${this.disabled}
                        >${this.fileButtonLabel}</cx-button
                      >
                    </slot>
                    <span part="file-result">${r}</span>
                  </div>` : ""}
            </span>
            ${this.type === "file" && this.buttonOnly ? w` <div
                  class="input__control input__control--file"
                  part="file-control"
                  @click=${this.handleFileButtonClick}
                >
                  <slot name="file-button">
                    <cx-button
                      part="file-button"
                      variant=${_(this.variant)}
                      size=${_(this.size)}
                      ?disabled=${this.disabled}
                      >${this.fileButtonLabel}</cx-button
                    >
                  </slot>
                </div>` : ""}
            ${a ? w`
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
            ${this.passwordToggle && !this.disabled ? w`
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
                    ${this.passwordVisible ? w`
                          <slot name="show-password-icon">
                            <cx-icon
                              name="visibility_off"
                              library="system"
                            ></cx-icon>
                          </slot>
                        ` : w`
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
          aria-hidden=${i ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
P = /* @__PURE__ */ new WeakSet();
st = function() {
  var n;
  return (n = this.input) == null ? void 0 : n.files;
};
h.styles = [ut, lt, wt];
h.dependencies = { "cx-icon": mt };
p([
  K(".input__control")
], h.prototype, "input", 2);
p([
  K(".input-container")
], h.prototype, "inputContainer", 2);
p([
  K(".form-control__label")
], h.prototype, "labelElement", 2);
p([
  j()
], h.prototype, "hasFocus", 2);
p([
  j()
], h.prototype, "maskInstance", 2);
p([
  j()
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
  ot()
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
      fromAttribute: (n) => !(!n || n === "false"),
      toAttribute: (n) => n ? "true" : "false"
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
      fromAttribute: (n) => n === "shift" ? n : n !== void 0,
      toAttribute: (n) => n
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
  H("disabled", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleDisabledChange", 1);
p([
  H("step", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleStepChange", 1);
p([
  H("value", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleValueChange", 1);
h = p([
  rt("cx-input")
], h);
export {
  h as default
};
