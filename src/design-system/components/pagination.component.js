import { C as x } from "../chunks/cortex-element.v9MiwbrF.js";
import { c } from "../chunks/math.DqTA6ya4.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { i as d, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { t as m } from "../chunks/custom-element.ttkHUa8w.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { r as P } from "../chunks/state.-o_YRGMi.js";
import { L as _ } from "../chunks/localize.DV9I313e.js";
import b from "./icon-button.component.js";
import u from "./option.component.js";
import w from "./select.component.js";
import y from "./tooltip.component.js";
import f from "./typography.component.js";
import { c as v } from "../chunks/component.styles.BLcT4bOa.js";
const C = d`
  ${v}

  :host {
    --width: 100px;
    display: block;
  }

  cx-typography::part(base) {
    margin-block: 0;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: var(--cx-spacing-small);
    font-size: var(--cx-font-size-small);
  }

  .pagination .pagination__label__container {
    display: inline-flex;
    gap: var(--cx-spacing-small);
    align-items: center;
  }

  .pagination .pagination__select::part(combobox) {
    width: var(--width);
  }

  .pagination .pagination__navigation-buttons {
    display: flex;
    align-items: center;
    gap: 0;
  }
`;
var I = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, i = (t, o, n, r) => {
  for (var a = r > 1 ? void 0 : r ? $(o, n) : o, p = t.length - 1, l; p >= 0; p--)
    (l = t[p]) && (a = (r ? l(o, n, a) : l(a)) || a);
  return r && a && I(o, n, a), a;
};
let e = class extends x {
  constructor() {
    super(...arguments), this.localize = new _(this), this.count = 0, this.rowsPerPageOptions = [10, 20, 50, 100], this.rowsPerPage = this.rowsPerPageOptions[0], this.label = this.localize.term("rowsPerPage"), this._pageIndex = 0;
  }
  get pageIndex() {
    return this._pageIndex;
  }
  set pageIndex(t) {
    this._pageIndex = c(
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
    const t = c(this._pageIndex * this.rowsPerPage + 1, 0, this.count), o = c((this._pageIndex + 1) * this.rowsPerPage, 0, this.count), n = this._pageIndex === 0, r = this._pageIndex + 1 >= Math.ceil(this.count / this.rowsPerPage);
    return g`
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
      (a) => g`<cx-option value=${a}>${a}</cx-option>`
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
              ?disabled=${n}
              @click=${this.handleBack}
            ></cx-icon-button>
          </cx-tooltip>
          <cx-tooltip hoist content=${this.localize.term("forward")}>
            <cx-icon-button
              class="pagination__forward"
              label=${this.localize.term("forward")}
              name="arrow_forward"
              ?disabled=${r}
              @click=${this.handleForward}
            ></cx-icon-button>
          </cx-tooltip>
        </div>
      </div>
    `;
  }
};
e.styles = C;
e.dependencies = {
  "cx-icon-button": b,
  "cx-option": u,
  "cx-select": w,
  "cx-tooltip": y,
  "cx-typography": f
};
i([
  s({ type: Number })
], e.prototype, "count", 2);
i([
  s({
    attribute: "rows-per-page-options",
    converter: {
      fromAttribute: (t) => t.split(" ").map(Number),
      toAttribute: (t) => t.join(" ")
    },
    type: String
  })
], e.prototype, "rowsPerPageOptions", 2);
i([
  s({ attribute: "rows-per-page", type: Number })
], e.prototype, "rowsPerPage", 2);
i([
  s({ type: String })
], e.prototype, "label", 2);
i([
  P()
], e.prototype, "_pageIndex", 2);
i([
  h("count")
], e.prototype, "handleCountChange", 1);
i([
  h(["_pageIndex", "rowsPerPage"])
], e.prototype, "handlePageChange", 1);
e = i([
  m("cx-pagination")
], e);
export {
  e as default
};
