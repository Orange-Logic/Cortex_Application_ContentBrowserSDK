import { C as d, c as x } from "../chunks/custom-element.X6y1saJZ.js";
import { c as l } from "../chunks/math.DqTA6ya4.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { L as P } from "../chunks/localize.D5Yoww6T.js";
import u from "./icon-button.js";
import _ from "./option.js";
import w from "./select.js";
import b from "./tooltip.js";
import f from "./typography.js";
import y from "./pagination.style.js";
var C = Object.defineProperty, I = Object.getOwnPropertyDescriptor, r = (t, o, s, i) => {
  for (var a = i > 1 ? void 0 : i ? I(o, s) : o, p = t.length - 1, c; p >= 0; p--)
    (c = t[p]) && (a = (i ? c(o, s, a) : c(a)) || a);
  return i && a && C(o, s, a), a;
};
let e = class extends d {
  constructor() {
    super(...arguments), this.localize = new P(this), this.count = 0, this.rowsPerPageOptions = [10, 20, 50, 100], this.rowsPerPage = this.rowsPerPageOptions[0], this.label = this.localize.term("rowsPerPage"), this._pageIndex = 0;
  }
  get pageIndex() {
    return this._pageIndex;
  }
  set pageIndex(t) {
    this._pageIndex = l(
      t,
      0,
      Math.ceil(this.count / this.rowsPerPage) - 1
    );
  }
  handleRowsPerPageChange(t) {
    const o = t.target;
    o && (this.rowsPerPage = Number(o.value), this._pageIndex = 0);
  }
  handleBack() {
    this._pageIndex -= 1;
  }
  handleForward() {
    this._pageIndex += 1;
  }
  async handleCountChange() {
    this.count < this._pageIndex * this.rowsPerPage - 1 && (await this.updateComplete, this._pageIndex = Math.ceil(this.count / this.rowsPerPage) - 1);
  }
  handlePageChange() {
    this.emit("cx-page-change", {
      detail: {
        pageIndex: this._pageIndex,
        rowsPerPage: this.rowsPerPage
      }
    });
  }
  render() {
    const t = l(this._pageIndex * this.rowsPerPage + 1, 0, this.count), o = l((this._pageIndex + 1) * this.rowsPerPage, 0, this.count), s = this._pageIndex === 0, i = this._pageIndex + 1 >= Math.ceil(this.count / this.rowsPerPage);
    return h`
      <div class="pagination">
        <label class="pagination__label__container">
          <cx-typography variant="body3" class="pagination__label"
            >${this.label}</cx-typography
          >
          <cx-select
            class="pagination__select"
            size="small"
            hoist
            .value=${this.rowsPerPage.toString()}
            @cx-change=${this.handleRowsPerPageChange}
          >
            ${this.rowsPerPageOptions.map(
      (a) => h`<cx-option value=${a}>${a}</cx-option>`
    )}
          </cx-select>
        </label>
        <cx-typography variant="body3" class="pagination__item-range"
          >${this.localize.term("itemRangeOfTotal", t, o, this.count)}
        </cx-typography>
        <div class="pagination__navigation-buttons">
          <cx-tooltip hoist content=${this.localize.term("back")}>
            <cx-icon-button
              class="pagination__back"
              label=${this.localize.term("back")}
              name="arrow_back"
              ?disabled=${s}
              @click=${this.handleBack}
            ></cx-icon-button>
          </cx-tooltip>
          <cx-tooltip hoist content=${this.localize.term("forward")}>
            <cx-icon-button
              class="pagination__forward"
              label=${this.localize.term("forward")}
              name="arrow_forward"
              ?disabled=${i}
              @click=${this.handleForward}
            ></cx-icon-button>
          </cx-tooltip>
        </div>
      </div>
    `;
  }
};
e.styles = y;
e.dependencies = {
  "cx-icon-button": u,
  "cx-option": _,
  "cx-select": w,
  "cx-tooltip": b,
  "cx-typography": f
};
r([
  n({ type: Number })
], e.prototype, "count", 2);
r([
  n({
    attribute: "rows-per-page-options",
    converter: {
      fromAttribute: (t) => t.split(" ").map(Number),
      toAttribute: (t) => t.join(" ")
    },
    type: String
  })
], e.prototype, "rowsPerPageOptions", 2);
r([
  n({ attribute: "rows-per-page", type: Number })
], e.prototype, "rowsPerPage", 2);
r([
  n({ type: String })
], e.prototype, "label", 2);
r([
  m()
], e.prototype, "_pageIndex", 2);
r([
  g("count")
], e.prototype, "handleCountChange", 1);
r([
  g(["_pageIndex", "rowsPerPage"])
], e.prototype, "handlePageChange", 1);
e = r([
  x("cx-pagination")
], e);
export {
  e as default
};
