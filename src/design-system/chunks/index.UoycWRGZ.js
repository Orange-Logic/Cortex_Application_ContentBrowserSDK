const t = [
  {
    easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    offset: 0,
    transform: "translate3d(0, 0, 0)"
  },
  {
    easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    offset: 0.2,
    transform: "translate3d(0, 0, 0)"
  },
  {
    easing: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    offset: 0.4,
    transform: "translate3d(0, -30px, 0) scaleY(1.1)"
  },
  {
    easing: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    offset: 0.43,
    transform: "translate3d(0, -30px, 0) scaleY(1.1)"
  },
  {
    easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    offset: 0.53,
    transform: "translate3d(0, 0, 0)"
  },
  {
    easing: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    offset: 0.7,
    transform: "translate3d(0, -15px, 0) scaleY(1.05)"
  },
  {
    offset: 0.8,
    transform: "translate3d(0, 0, 0) scaleY(0.95)",
    "transition-timing-function": "cubic-bezier(0.215, 0.61, 0.355, 1)"
  },
  { offset: 0.9, transform: "translate3d(0, -4px, 0) scaleY(1.02)" },
  {
    easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    offset: 1,
    transform: "translate3d(0, 0, 0)"
  }
], e = [
  { offset: 0, opacity: "1" },
  { offset: 0.25, opacity: "0" },
  { offset: 0.5, opacity: "1" },
  { offset: 0.75, opacity: "0" },
  { offset: 1, opacity: "1" }
], s = [
  { offset: 0, transform: "translateX(0)" },
  { offset: 0.065, transform: "translateX(-6px) rotateY(-9deg)" },
  { offset: 0.185, transform: "translateX(5px) rotateY(7deg)" },
  { offset: 0.315, transform: "translateX(-3px) rotateY(-5deg)" },
  { offset: 0.435, transform: "translateX(2px) rotateY(3deg)" },
  { offset: 0.5, transform: "translateX(0)" }
], a = [
  { offset: 0, transform: "scale(1)" },
  { offset: 0.14, transform: "scale(1.3)" },
  { offset: 0.28, transform: "scale(1)" },
  { offset: 0.42, transform: "scale(1.3)" },
  { offset: 0.7, transform: "scale(1)" }
], o = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 0.111, transform: "translate3d(0, 0, 0)" },
  { offset: 0.222, transform: "skewX(-12.5deg) skewY(-12.5deg)" },
  { offset: 0.33299999999999996, transform: "skewX(6.25deg) skewY(6.25deg)" },
  { offset: 0.444, transform: "skewX(-3.125deg) skewY(-3.125deg)" },
  { offset: 0.555, transform: "skewX(1.5625deg) skewY(1.5625deg)" },
  {
    offset: 0.6659999999999999,
    transform: "skewX(-0.78125deg) skewY(-0.78125deg)"
  },
  { offset: 0.777, transform: "skewX(0.390625deg) skewY(0.390625deg)" },
  { offset: 0.888, transform: "skewX(-0.1953125deg) skewY(-0.1953125deg)" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], f = [
  { offset: 0, transform: "scale3d(1, 1, 1)" },
  { offset: 0.5, transform: "scale3d(1.05, 1.05, 1.05)" },
  { offset: 1, transform: "scale3d(1, 1, 1)" }
], r = [
  { offset: 0, transform: "scale3d(1, 1, 1)" },
  { offset: 0.3, transform: "scale3d(1.25, 0.75, 1)" },
  { offset: 0.4, transform: "scale3d(0.75, 1.25, 1)" },
  { offset: 0.5, transform: "scale3d(1.15, 0.85, 1)" },
  { offset: 0.65, transform: "scale3d(0.95, 1.05, 1)" },
  { offset: 0.75, transform: "scale3d(1.05, 0.95, 1)" },
  { offset: 1, transform: "scale3d(1, 1, 1)" }
], n = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 0.1, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.2, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.3, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.4, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.5, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.6, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.7, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.8, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.9, transform: "translate3d(-10px, 0, 0)" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], c = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 0.1, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.2, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.3, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.4, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.5, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.6, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.7, transform: "translate3d(-10px, 0, 0)" },
  { offset: 0.8, transform: "translate3d(10px, 0, 0)" },
  { offset: 0.9, transform: "translate3d(-10px, 0, 0)" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], i = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 0.1, transform: "translate3d(0, -10px, 0)" },
  { offset: 0.2, transform: "translate3d(0, 10px, 0)" },
  { offset: 0.3, transform: "translate3d(0, -10px, 0)" },
  { offset: 0.4, transform: "translate3d(0, 10px, 0)" },
  { offset: 0.5, transform: "translate3d(0, -10px, 0)" },
  { offset: 0.6, transform: "translate3d(0, 10px, 0)" },
  { offset: 0.7, transform: "translate3d(0, -10px, 0)" },
  { offset: 0.8, transform: "translate3d(0, 10px, 0)" },
  { offset: 0.9, transform: "translate3d(0, -10px, 0)" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], d = [
  { offset: 0.2, transform: "rotate3d(0, 0, 1, 15deg)" },
  { offset: 0.4, transform: "rotate3d(0, 0, 1, -10deg)" },
  { offset: 0.6, transform: "rotate3d(0, 0, 1, 5deg)" },
  { offset: 0.8, transform: "rotate3d(0, 0, 1, -5deg)" },
  { offset: 1, transform: "rotate3d(0, 0, 1, 0deg)" }
], p = [
  { offset: 0, transform: "scale3d(1, 1, 1)" },
  { offset: 0.1, transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)" },
  { offset: 0.2, transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)" },
  { offset: 0.3, transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" },
  { offset: 0.4, transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)" },
  { offset: 0.5, transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" },
  { offset: 0.6, transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)" },
  { offset: 0.7, transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" },
  { offset: 0.8, transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)" },
  { offset: 0.9, transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" },
  { offset: 1, transform: "scale3d(1, 1, 1)" }
], l = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  {
    offset: 0.15,
    transform: "translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)"
  },
  { offset: 0.3, transform: "translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)" },
  {
    offset: 0.45,
    transform: "translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)"
  },
  { offset: 0.6, transform: "translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)" },
  {
    offset: 0.75,
    transform: "translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)"
  },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], m = [
  { offset: 0, opacity: "0.7", transform: "translateY(-1200px) scale(0.7)" },
  { offset: 0.8, opacity: "0.7", transform: "translateY(0px) scale(0.7)" },
  { offset: 1, opacity: "1", transform: "scale(1)" }
], b = [
  { offset: 0, opacity: "0.7", transform: "translateX(-2000px) scale(0.7)" },
  { offset: 0.8, opacity: "0.7", transform: "translateX(0px) scale(0.7)" },
  { offset: 1, opacity: "1", transform: "scale(1)" }
], g = [
  { offset: 0, opacity: "0.7", transform: "translateX(2000px) scale(0.7)" },
  { offset: 0.8, opacity: "0.7", transform: "translateX(0px) scale(0.7)" },
  { offset: 1, opacity: "1", transform: "scale(1)" }
], y = [
  { offset: 0, opacity: "0.7", transform: "translateY(1200px) scale(0.7)" },
  { offset: 0.8, opacity: "0.7", transform: "translateY(0px) scale(0.7)" },
  { offset: 1, opacity: "1", transform: "scale(1)" }
], u = [
  { offset: 0, opacity: "1", transform: "scale(1)" },
  { offset: 0.2, opacity: "0.7", transform: "translateY(0px) scale(0.7)" },
  { offset: 1, opacity: "0.7", transform: "translateY(700px) scale(0.7)" }
], x = [
  { offset: 0, opacity: "1", transform: "scale(1)" },
  { offset: 0.2, opacity: "0.7", transform: "translateX(0px) scale(0.7)" },
  { offset: 1, opacity: "0.7", transform: "translateX(-2000px) scale(0.7)" }
], z = [
  { offset: 0, opacity: "1", transform: "scale(1)" },
  { offset: 0.2, opacity: "0.7", transform: "translateX(0px) scale(0.7)" },
  { offset: 1, opacity: "0.7", transform: "translateX(2000px) scale(0.7)" }
], O = [
  { offset: 0, opacity: "1", transform: "scale(1)" },
  { offset: 0.2, opacity: "0.7", transform: "translateY(0px) scale(0.7)" },
  { offset: 1, opacity: "0.7", transform: "translateY(-700px) scale(0.7)" }
], I = [
  { offset: 0, opacity: "0", transform: "scale3d(0.3, 0.3, 0.3)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0 },
  { offset: 0.2, transform: "scale3d(1.1, 1.1, 1.1)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.2 },
  { offset: 0.4, transform: "scale3d(0.9, 0.9, 0.9)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.4 },
  { offset: 0.6, opacity: "1", transform: "scale3d(1.03, 1.03, 1.03)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.6 },
  { offset: 0.8, transform: "scale3d(0.97, 0.97, 0.97)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.8 },
  { offset: 1, opacity: "1", transform: "scale3d(1, 1, 1)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 1 }
], X = [
  {
    offset: 0,
    opacity: "0",
    transform: "translate3d(0, -3000px, 0) scaleY(3)"
  },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0 },
  {
    offset: 0.6,
    opacity: "1",
    transform: "translate3d(0, 25px, 0) scaleY(0.9)"
  },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.6 },
  { offset: 0.75, transform: "translate3d(0, -10px, 0) scaleY(0.95)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.75 },
  { offset: 0.9, transform: "translate3d(0, 5px, 0) scaleY(0.985)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.9 },
  { offset: 1, transform: "translate3d(0, 0, 0)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 1 }
], Y = [
  {
    offset: 0,
    opacity: "0",
    transform: "translate3d(-3000px, 0, 0) scaleX(3)"
  },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0 },
  { offset: 0.6, opacity: "1", transform: "translate3d(25px, 0, 0) scaleX(1)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.6 },
  { offset: 0.75, transform: "translate3d(-10px, 0, 0) scaleX(0.98)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.75 },
  { offset: 0.9, transform: "translate3d(5px, 0, 0) scaleX(0.995)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.9 },
  { offset: 1, transform: "translate3d(0, 0, 0)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 1 }
], w = [
  { offset: 0, opacity: "0", transform: "translate3d(3000px, 0, 0) scaleX(3)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0 },
  {
    offset: 0.6,
    opacity: "1",
    transform: "translate3d(-25px, 0, 0) scaleX(1)"
  },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.6 },
  { offset: 0.75, transform: "translate3d(10px, 0, 0) scaleX(0.98)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.75 },
  { offset: 0.9, transform: "translate3d(-5px, 0, 0) scaleX(0.995)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.9 },
  { offset: 1, transform: "translate3d(0, 0, 0)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 1 }
], h = [
  { offset: 0, opacity: "0", transform: "translate3d(0, 3000px, 0) scaleY(5)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0 },
  {
    offset: 0.6,
    opacity: "1",
    transform: "translate3d(0, -20px, 0) scaleY(0.9)"
  },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.6 },
  { offset: 0.75, transform: "translate3d(0, 10px, 0) scaleY(0.95)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.75 },
  { offset: 0.9, transform: "translate3d(0, -5px, 0) scaleY(0.985)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 0.9 },
  { offset: 1, transform: "translate3d(0, 0, 0)" },
  { easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", offset: 1 }
], k = [
  { offset: 0.2, transform: "scale3d(0.9, 0.9, 0.9)" },
  { offset: 0.5, opacity: "1", transform: "scale3d(1.1, 1.1, 1.1)" },
  { offset: 0.55, opacity: "1", transform: "scale3d(1.1, 1.1, 1.1)" },
  { offset: 1, opacity: "0", transform: "scale3d(0.3, 0.3, 0.3)" }
], v = [
  { offset: 0.2, transform: "translate3d(0, 10px, 0) scaleY(0.985)" },
  {
    offset: 0.4,
    opacity: "1",
    transform: "translate3d(0, -20px, 0) scaleY(0.9)"
  },
  {
    offset: 0.45,
    opacity: "1",
    transform: "translate3d(0, -20px, 0) scaleY(0.9)"
  },
  { offset: 1, opacity: "0", transform: "translate3d(0, 2000px, 0) scaleY(3)" }
], L = [
  {
    offset: 0.2,
    opacity: "1",
    transform: "translate3d(20px, 0, 0) scaleX(0.9)"
  },
  {
    offset: 1,
    opacity: "0",
    transform: "translate3d(-2000px, 0, 0) scaleX(2)"
  }
], R = [
  {
    offset: 0.2,
    opacity: "1",
    transform: "translate3d(-20px, 0, 0) scaleX(0.9)"
  },
  { offset: 1, opacity: "0", transform: "translate3d(2000px, 0, 0) scaleX(2)" }
], B = [
  { offset: 0.2, transform: "translate3d(0, -10px, 0) scaleY(0.985)" },
  {
    offset: 0.4,
    opacity: "1",
    transform: "translate3d(0, 20px, 0) scaleY(0.9)"
  },
  {
    offset: 0.45,
    opacity: "1",
    transform: "translate3d(0, 20px, 0) scaleY(0.9)"
  },
  {
    offset: 1,
    opacity: "0",
    transform: "translate3d(0, -2000px, 0) scaleY(3)"
  }
], D = [
  { offset: 0, opacity: "0" },
  { offset: 1, opacity: "1" }
], U = [
  { offset: 0, opacity: "0", transform: "translate3d(-100%, 100%, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], S = [
  { offset: 0, opacity: "0", transform: "translate3d(100%, 100%, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], Q = [
  { offset: 0, opacity: "0", transform: "translate3d(0, -100%, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], C = [
  { offset: 0, opacity: "0", transform: "translate3d(0, -2000px, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], T = [
  { offset: 0, opacity: "0", transform: "translate3d(-100%, 0, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], j = [
  { offset: 0, opacity: "0", transform: "translate3d(-2000px, 0, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], _ = [
  { offset: 0, opacity: "0", transform: "translate3d(100%, 0, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], E = [
  { offset: 0, opacity: "0", transform: "translate3d(2000px, 0, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], M = [
  { offset: 0, opacity: "0", transform: "translate3d(-100%, -100%, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], P = [
  { offset: 0, opacity: "0", transform: "translate3d(100%, -100%, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], q = [
  { offset: 0, opacity: "0", transform: "translate3d(0, 100%, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], A = [
  { offset: 0, opacity: "0", transform: "translate3d(0, 2000px, 0)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], F = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0" }
], G = [
  { offset: 0, opacity: "1", transform: "translate3d(0, 0, 0)" },
  { offset: 1, opacity: "0", transform: "translate3d(-100%, 100%, 0)" }
], H = [
  { offset: 0, opacity: "1", transform: "translate3d(0, 0, 0)" },
  { offset: 1, opacity: "0", transform: "translate3d(100%, 100%, 0)" }
], J = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(0, 100%, 0)" }
], K = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(0, 2000px, 0)" }
], N = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(-100%, 0, 0)" }
], V = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(-2000px, 0, 0)" }
], W = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(100%, 0, 0)" }
], Z = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(2000px, 0, 0)" }
], $ = [
  { offset: 0, opacity: "1", transform: "translate3d(0, 0, 0)" },
  { offset: 1, opacity: "0", transform: "translate3d(-100%, -100%, 0)" }
], tt = [
  { offset: 0, opacity: "1", transform: "translate3d(0, 0, 0)" },
  { offset: 1, opacity: "0", transform: "translate3d(100%, -100%, 0)" }
], et = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(0, -100%, 0)" }
], st = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "translate3d(0, -2000px, 0)" }
], at = [
  {
    easing: "ease-out",
    offset: 0,
    transform: "perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg)"
  },
  {
    easing: "ease-out",
    offset: 0.4,
    transform: `perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -190deg)`
  },
  {
    easing: "ease-in",
    offset: 0.5,
    transform: `perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -170deg)`
  },
  {
    easing: "ease-in",
    offset: 0.8,
    transform: `perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg)`
  },
  {
    easing: "ease-in",
    offset: 1,
    transform: "perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)"
  }
], ot = [
  {
    easing: "ease-in",
    offset: 0,
    opacity: "0",
    transform: "perspective(400px) rotate3d(1, 0, 0, 90deg)"
  },
  {
    easing: "ease-in",
    offset: 0.4,
    transform: "perspective(400px) rotate3d(1, 0, 0, -20deg)"
  },
  {
    offset: 0.6,
    opacity: "1",
    transform: "perspective(400px) rotate3d(1, 0, 0, 10deg)"
  },
  { offset: 0.8, transform: "perspective(400px) rotate3d(1, 0, 0, -5deg)" },
  { offset: 1, transform: "perspective(400px)" }
], ft = [
  {
    easing: "ease-in",
    offset: 0,
    opacity: "0",
    transform: "perspective(400px) rotate3d(0, 1, 0, 90deg)"
  },
  {
    easing: "ease-in",
    offset: 0.4,
    transform: "perspective(400px) rotate3d(0, 1, 0, -20deg)"
  },
  {
    offset: 0.6,
    opacity: "1",
    transform: "perspective(400px) rotate3d(0, 1, 0, 10deg)"
  },
  { offset: 0.8, transform: "perspective(400px) rotate3d(0, 1, 0, -5deg)" },
  { offset: 1, transform: "perspective(400px)" }
], rt = [
  { offset: 0, transform: "perspective(400px)" },
  {
    offset: 0.3,
    opacity: "1",
    transform: "perspective(400px) rotate3d(1, 0, 0, -20deg)"
  },
  {
    offset: 1,
    opacity: "0",
    transform: "perspective(400px) rotate3d(1, 0, 0, 90deg)"
  }
], nt = [
  { offset: 0, transform: "perspective(400px)" },
  {
    offset: 0.3,
    opacity: "1",
    transform: "perspective(400px) rotate3d(0, 1, 0, -15deg)"
  },
  {
    offset: 1,
    opacity: "0",
    transform: "perspective(400px) rotate3d(0, 1, 0, 90deg)"
  }
], ct = [
  {
    offset: 0,
    opacity: "0",
    transform: "translate3d(-100%, 0, 0) skewX(30deg)"
  },
  { offset: 0.6, opacity: "1", transform: "skewX(-20deg)" },
  { offset: 0.8, transform: "skewX(5deg)" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], it = [
  {
    offset: 0,
    opacity: "0",
    transform: "translate3d(100%, 0, 0) skewX(-30deg)"
  },
  { offset: 0.6, opacity: "1", transform: "skewX(20deg)" },
  { offset: 0.8, transform: "skewX(-5deg)" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], dt = [
  { offset: 0, opacity: "1" },
  {
    offset: 1,
    opacity: "0",
    transform: "translate3d(-100%, 0, 0) skewX(-30deg)"
  }
], pt = [
  { offset: 0, opacity: "1" },
  {
    offset: 1,
    opacity: "0",
    transform: "translate3d(100%, 0, 0) skewX(30deg)"
  }
], lt = [
  { offset: 0, opacity: "0", transform: "rotate3d(0, 0, 1, -200deg)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], mt = [
  { offset: 0, opacity: "0", transform: "rotate3d(0, 0, 1, -45deg)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], bt = [
  { offset: 0, opacity: "0", transform: "rotate3d(0, 0, 1, 45deg)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], gt = [
  { offset: 0, opacity: "0", transform: "rotate3d(0, 0, 1, 45deg)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], yt = [
  { offset: 0, opacity: "0", transform: "rotate3d(0, 0, 1, -90deg)" },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], ut = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "rotate3d(0, 0, 1, 200deg)" }
], xt = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "rotate3d(0, 0, 1, 45deg)" }
], zt = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "rotate3d(0, 0, 1, -45deg)" }
], Ot = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "rotate3d(0, 0, 1, -45deg)" }
], It = [
  { offset: 0, opacity: "1" },
  { offset: 1, opacity: "0", transform: "rotate3d(0, 0, 1, 90deg)" }
], Xt = [
  { offset: 0, transform: "translate3d(0, -100%, 0)", visibility: "visible" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], Yt = [
  { offset: 0, transform: "translate3d(-100%, 0, 0)", visibility: "visible" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], wt = [
  { offset: 0, transform: "translate3d(100%, 0, 0)", visibility: "visible" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], ht = [
  { offset: 0, transform: "translate3d(0, 100%, 0)", visibility: "visible" },
  { offset: 1, transform: "translate3d(0, 0, 0)" }
], kt = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 1, transform: "translate3d(0, 100%, 0)", visibility: "hidden" }
], vt = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 1, transform: "translate3d(-100%, 0, 0)", visibility: "hidden" }
], Lt = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 1, transform: "translate3d(100%, 0, 0)", visibility: "hidden" }
], Rt = [
  { offset: 0, transform: "translate3d(0, 0, 0)" },
  { offset: 1, transform: "translate3d(0, -100%, 0)", visibility: "hidden" }
], Bt = [
  { easing: "ease-in-out", offset: 0 },
  { easing: "ease-in-out", offset: 0.2, transform: "rotate3d(0, 0, 1, 80deg)" },
  {
    easing: "ease-in-out",
    offset: 0.4,
    opacity: "1",
    transform: "rotate3d(0, 0, 1, 60deg)"
  },
  { easing: "ease-in-out", offset: 0.6, transform: "rotate3d(0, 0, 1, 80deg)" },
  {
    easing: "ease-in-out",
    offset: 0.8,
    opacity: "1",
    transform: "rotate3d(0, 0, 1, 60deg)"
  },
  { offset: 1, opacity: "0", transform: "translate3d(0, 700px, 0)" }
], Dt = [
  {
    offset: 0,
    opacity: "0",
    transform: "scale(0.1) rotate(30deg)",
    "transform-origin": "center bottom"
  },
  { offset: 0.5, transform: "rotate(-10deg)" },
  { offset: 0.7, transform: "rotate(3deg)" },
  { offset: 1, opacity: "1", transform: "scale(1)" }
], Ut = [
  {
    offset: 0,
    opacity: "0",
    transform: "translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)"
  },
  { offset: 1, opacity: "1", transform: "translate3d(0, 0, 0)" }
], St = [
  { offset: 0, opacity: "1" },
  {
    offset: 1,
    opacity: "0",
    transform: "translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)"
  }
], Qt = [
  { offset: 0, opacity: "0", transform: "scale3d(0.3, 0.3, 0.3)" },
  { offset: 0.5, opacity: "1" }
], Ct = [
  {
    easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    offset: 0,
    opacity: "0",
    transform: "scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)"
  },
  {
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
    offset: 0.6,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)"
  }
], Tt = [
  {
    easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    offset: 0,
    opacity: "0",
    transform: "scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0)"
  },
  {
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
    offset: 0.6,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0)"
  }
], jt = [
  {
    easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    offset: 0,
    opacity: "0",
    transform: "scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0)"
  },
  {
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
    offset: 0.6,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0)"
  }
], _t = [
  {
    easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    offset: 0,
    opacity: "0",
    transform: "scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0)"
  },
  {
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
    offset: 0.6,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)"
  }
], Et = [
  { offset: 0, opacity: "1" },
  { offset: 0.5, opacity: "0", transform: "scale3d(0.3, 0.3, 0.3)" },
  { offset: 1, opacity: "0" }
], Mt = [
  {
    easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    offset: 0.4,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)"
  },
  {
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
    offset: 1,
    opacity: "0",
    transform: "scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0)"
  }
], Pt = [
  {
    offset: 0.4,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0)"
  },
  {
    offset: 1,
    opacity: "0",
    transform: "scale(0.1) translate3d(-2000px, 0, 0)"
  }
], qt = [
  {
    offset: 0.4,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0)"
  },
  {
    offset: 1,
    opacity: "0",
    transform: "scale(0.1) translate3d(2000px, 0, 0)"
  }
], At = [
  {
    easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    offset: 0.4,
    opacity: "1",
    transform: "scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)"
  },
  {
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
    offset: 1,
    opacity: "0",
    transform: "scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0)"
  }
], Ft = {
  ease: "ease",
  easeIn: "ease-in",
  easeInBack: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
  easeInCirc: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
  easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
  easeInOut: "ease-in-out",
  easeInOutBack: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeInOutExpo: "cubic-bezier(1, 0, 0, 1)",
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
  easeInOutQuint: "cubic-bezier(0.86, 0, 0.07, 1)",
  easeInOutSine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
  easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  easeInQuart: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
  easeInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
  easeInSine: "cubic-bezier(0.47, 0, 0.745, 0.715)",
  easeOut: "ease-out",
  easeOutBack: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  easeOutCirc: "cubic-bezier(0.075, 0.82, 0.165, 1)",
  easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  easeOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
  easeOutSine: "cubic-bezier(0.39, 0.575, 0.565, 1)",
  linear: "linear"
}, Gt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  backInDown: m,
  backInLeft: b,
  backInRight: g,
  backInUp: y,
  backOutDown: u,
  backOutLeft: x,
  backOutRight: z,
  backOutUp: O,
  bounce: t,
  bounceIn: I,
  bounceInDown: X,
  bounceInLeft: Y,
  bounceInRight: w,
  bounceInUp: h,
  bounceOut: k,
  bounceOutDown: v,
  bounceOutLeft: L,
  bounceOutRight: R,
  bounceOutUp: B,
  easings: Ft,
  fadeIn: D,
  fadeInBottomLeft: U,
  fadeInBottomRight: S,
  fadeInDown: Q,
  fadeInDownBig: C,
  fadeInLeft: T,
  fadeInLeftBig: j,
  fadeInRight: _,
  fadeInRightBig: E,
  fadeInTopLeft: M,
  fadeInTopRight: P,
  fadeInUp: q,
  fadeInUpBig: A,
  fadeOut: F,
  fadeOutBottomLeft: G,
  fadeOutBottomRight: H,
  fadeOutDown: J,
  fadeOutDownBig: K,
  fadeOutLeft: N,
  fadeOutLeftBig: V,
  fadeOutRight: W,
  fadeOutRightBig: Z,
  fadeOutTopLeft: $,
  fadeOutTopRight: tt,
  fadeOutUp: et,
  fadeOutUpBig: st,
  flash: e,
  flip: at,
  flipInX: ot,
  flipInY: ft,
  flipOutX: rt,
  flipOutY: nt,
  headShake: s,
  heartBeat: a,
  hinge: Bt,
  jackInTheBox: Dt,
  jello: o,
  lightSpeedInLeft: ct,
  lightSpeedInRight: it,
  lightSpeedOutLeft: dt,
  lightSpeedOutRight: pt,
  pulse: f,
  rollIn: Ut,
  rollOut: St,
  rotateIn: lt,
  rotateInDownLeft: mt,
  rotateInDownRight: bt,
  rotateInUpLeft: gt,
  rotateInUpRight: yt,
  rotateOut: ut,
  rotateOutDownLeft: xt,
  rotateOutDownRight: zt,
  rotateOutUpLeft: Ot,
  rotateOutUpRight: It,
  rubberBand: r,
  shake: n,
  shakeX: c,
  shakeY: i,
  slideInDown: Xt,
  slideInLeft: Yt,
  slideInRight: wt,
  slideInUp: ht,
  slideOutDown: kt,
  slideOutLeft: vt,
  slideOutRight: Lt,
  slideOutUp: Rt,
  swing: d,
  tada: p,
  wobble: l,
  zoomIn: Qt,
  zoomInDown: Ct,
  zoomInLeft: Tt,
  zoomInRight: jt,
  zoomInUp: _t,
  zoomOut: Et,
  zoomOutDown: Mt,
  zoomOutLeft: Pt,
  zoomOutRight: qt,
  zoomOutUp: At
}, Symbol.toStringTag, { value: "Module" }));
export {
  Gt as a,
  Ft as e
};
