import { a as n, e as t } from "../chunks/index.UoycWRGZ.js";
function i() {
  return Object.entries(n).filter(([e]) => e !== "easings").map(([e]) => e);
}
function s() {
  return Object.entries(t).map(([e]) => e);
}
export {
  n as animations,
  i as getAnimationNames,
  s as getEasingNames
};
