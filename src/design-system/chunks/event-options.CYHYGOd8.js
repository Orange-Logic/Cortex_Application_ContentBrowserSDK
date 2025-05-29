/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e(c) {
  return (t, n) => {
    const o = typeof t == "function" ? t : t[n];
    Object.assign(o, c);
  };
}
export {
  e as t
};
