import { C as o } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as r } from "../chunks/component.styles.BLcT4bOa.js";
import { x as s } from "../chunks/lit-element.DRlPF2me.js";
import l from "./carousel-item.styles.js";
const t = class t extends o {
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "group");
  }
  render() {
    return s` <slot></slot> `;
  }
};
t.styles = [r, l];
let e = t;
export {
  e as default
};
