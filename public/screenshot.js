// x _ x md
(function(t, e, i, r, n, o) {
    function s(t, e, i, r, n) {
        return g(t, t, i, r, e, t.defaultView.pageXOffset, t.defaultView.pageYOffset).then(function(o) {
            D("Document cloned");
            var s = Ut + n,
            h = "[" + s + "='" + n + "']";
            t.querySelector(h) && t.querySelector(h).removeAttribute(s);
            var c = o.contentWindow,
            l = c.document.querySelector(h);
            return ("function" == typeof e.onclone ? Promise.resolve(e.onclone(c.document)) : Promise.resolve(!0)).then(function() {
                return a(l, o, e, i, r)
            })
        })
    }
    function a(t, i, r, n, o) {
        var s = i.contentWindow,
        a = new Bt(s.document),
        f = new P(r, a),
        d = z(t),
        p = "view" === r.type ? n: l(s.document),
        g = "view" === r.type ? o: u(s.document),
        m = new r.renderer(p, g, f, r, e);
        return new W(t, m, a, f, r).ready.then(function() {
            D("Finished rendering");
            var e;
            return e = "view" === r.type ? c(m.canvas, {
                width: m.canvas.width,
                height: m.canvas.height,
                top: 0,
                left: 0,
                x: 0,
                y: 0
            }) : t === s.document.body || t === s.document.documentElement || null != r.canvas ? m.canvas: c(m.canvas, {
                width: null != r.width ? r.width: d.width,
                height: null != r.height ? r.height: d.height,
                top: d.top,
                left: d.left,
                x: s.pageXOffset,
                y: s.pageYOffset
            }),
            h(i, r),
            e
        })
    }
    function h(t, e) {
        e.removeContainer && (t.parentNode.removeChild(t), D("Cleaned up container"))
    }
    function c(t, i) {
        // !!!!!! its important
        var r = e.createElement("canvas"),
        n = Math.min(t.width - 1, Math.max(0, i.left)),
        o = Math.min(t.width, Math.max(1, i.left + i.width)),
        s = Math.min(t.height - 1, Math.max(0, i.top)),
        a = Math.min(t.height, Math.max(1, i.top + i.height));
        return r.width = i.width,
        r.height = i.height,
        D("Cropping canvas at:", "left:", i.left, "top:", i.top, "width:", o - n, "height:", a - s),
        D("Resulting crop with width", i.width, "and height", i.height, " with x", n, "and y", s),
        r.getContext("2d").drawImage(t, n, s, o - n, a - s, i.x, i.y, o - n, a - s),
        r
    }
    function l(t) {
        return Math.max(Math.max(t.body.scrollWidth, t.documentElement.scrollWidth), Math.max(t.body.offsetWidth, t.documentElement.offsetWidth), Math.max(t.body.clientWidth, t.documentElement.clientWidth))
    }
    function u(t) {
        return Math.max(Math.max(t.body.scrollHeight, t.documentElement.scrollHeight), Math.max(t.body.offsetHeight, t.documentElement.offsetHeight), Math.max(t.body.clientHeight, t.documentElement.clientHeight))
    }
    function f() {
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    }
    function d() {
        return e.documentMode && e.documentMode <= 9
    }
    function p(t, i) {
        for (var r = 3 === t.nodeType ? e.createTextNode(t.nodeValue) : t.cloneNode(!1), n = t.firstChild; n;) ! 0 !== i && 1 === n.nodeType && "SCRIPT" === n.nodeName || r.appendChild(p(n, i)),
        n = n.nextSibling;
        return r
    }
    function g(t, e, i, r, n, o, s) {
        x(t);
        var a = d() ? p(t.documentElement, n.javascriptEnabled) : t.documentElement.cloneNode(!0),
        h = e.createElement("iframe");
        return h.className = "html2canvas-container",
        h.style.visibility = "hidden",
        h.style.position = "fixed",
        h.style.left = "-10000px",
        h.style.top = "0px",
        h.style.border = "0",
        h.width = i,
        h.height = r,
        h.scrolling = "no",
        e.body.appendChild(h),
        new Promise(function(e) {
            var i = h.contentWindow.document;
            m(t.documentElement, a, "textarea"),
            m(t.documentElement, a, "select"),
            h.contentWindow.onload = h.onload = function() {
                var r = setInterval(function() {
                    i.body.childNodes.length > 0 && (w(t, i), clearInterval(r), "view" === n.type && h.contentWindow.scrollTo(o, s), e(h))
                },
                50)
            },
            i.open(),
            i.write("<!DOCTYPE html><html></html>"),
            v(t, o, s),
            i.replaceChild(!0 === n.javascriptEnabled ? i.adoptNode(a) : S(i.adoptNode(a)), i.documentElement),
            i.close()
        })
    }
    function m(t, e, i) {
        for (var r = t.getElementsByTagName(i), n = e.getElementsByTagName(i), o = r.length, s = 0; s < o; s++) n[s].value = r[s].value
    }
    function v(t, e, i) { ! t.defaultView || e === t.defaultView.pageXOffset && i === t.defaultView.pageYOffset || t.defaultView.scrollTo(e, i)
    }
    function b(e, i, r, n, o, s) {
        return new Et(e, i, t.document).then(y(e)).then(function(t) {
            return g(t, r, n, o, s, 0, 0)
        })
    }
    function y(t) {
        return function(i) {
            var r, n = new DOMParser;
            try {
                r = n.parseFromString(i, "text/html")
            } catch(t) {
                D("DOMParser not supported, falling back to createHTMLDocument"),
                r = e.implementation.createHTMLDocument("");
                try {
                    r.open(),
                    r.write(i),
                    r.close()
                } catch(t) {
                    D("createHTMLDocument write not supported, falling back to document.body.innerHTML"),
                    r.body.innerHTML = i
                }
            }
            var o = r.querySelector("base");
            if (!o || !o.href.host) {
                var s = r.createElement("base");
                s.href = t,
                r.head.insertBefore(s, r.head.firstChild)
            }
            return r
        }
    }
    function x(t) { [].slice.call(t.querySelectorAll("canvas"), 0).forEach(function(t) {
            t.setAttribute(qt, "canvas-" + Jt++)
        })
    }
    function w(t, e) { [].slice.call(t.querySelectorAll("[" + qt + "]"), 0).forEach(function(t) {
            try {
                var i = e.querySelector("[" + qt + '="' + t.getAttribute(qt) + '"]');
                i && (i.width = t.width, i.height = t.height, i.getContext("2d").putImageData(t.getContext("2d").getImageData(0, 0, t.width, t.height), 0, 0))
            } catch(e) {
                D("Unable to copy canvas content from", t, e)
            }
            t.removeAttribute(qt)
        })
    }
    function S(t) {
        return [].slice.call(t.childNodes, 0).filter(C).forEach(function(e) {
            "SCRIPT" === e.tagName ? t.removeChild(e) : S(e)
        }),
        t
    }
    function C(t) {
        return t.nodeType === Node.ELEMENT_NODE
    }
    function _(t) {
        var i = e.createElement("a");
        return i.href = t,
        i.href = i.href,
        i
    }
    function T(t) {
        this.r = 0,
        this.g = 0,
        this.b = 0,
        this.a = null;
        this.fromArray(t) || this.namedColor(t) || this.rgb(t) || this.rgba(t) || this.hex6(t) || this.hex3(t)
    }
    function O(t) {
        if (this.src = t, D("DummyImageContainer for", t), !this.promise || !this.image) {
            D("Initiating DummyImageContainer"),
            O.prototype.image = new Image;
            var e = this.image;
            O.prototype.promise = new Promise(function(t, i) {
                e.onload = t,
                e.onerror = i,
                e.src = f(),
                !0 === e.complete && t(e)
            })
        }
    }
    function k(t, i) {
        var r, n, o = e.createElement("div"),
        s = e.createElement("img"),
        a = e.createElement("span");
        o.style.visibility = "hidden",
        o.style.fontFamily = t,
        o.style.fontSize = i,
        o.style.margin = 0,
        o.style.padding = 0,
        e.body.appendChild(o),
        s.src = f(),
        s.width = 1,
        s.height = 1,
        s.style.margin = 0,
        s.style.padding = 0,
        s.style.verticalAlign = "baseline",
        a.style.fontFamily = t,
        a.style.fontSize = i,
        a.style.margin = 0,
        a.style.padding = 0,
        a.appendChild(e.createTextNode("Hidden Text")),
        o.appendChild(a),
        o.appendChild(s),
        r = s.offsetTop - a.offsetTop + 1,
        o.removeChild(a),
        o.appendChild(e.createTextNode("Hidden Text")),
        o.style.lineHeight = "normal",
        s.style.verticalAlign = "super",
        n = s.offsetTop - o.offsetTop + 1,
        e.body.removeChild(o),
        this.baseline = r,
        this.lineWidth = 1,
        this.middle = n
    }
    function E() {
        this.data = {}
    }
    function A(t, e, i) {
        this.image = null,
        this.src = t;
        var r = this,
        n = z(t);
        this.promise = (e ? new Promise(function(e) {
            "about:blank" === t.contentWindow.document.URL || null == t.contentWindow.document.documentElement ? t.contentWindow.onload = t.onload = function() {
                e(t)
            }: e(t)
        }) : this.proxyLoad(i.proxy, n, i)).then(function(t) {
            return html2canvas(t.contentWindow.document.documentElement, {
                type: "view",
                width: t.width,
                height: t.height,
                proxy: i.proxy,
                javascriptEnabled: i.javascriptEnabled,
                removeContainer: i.removeContainer,
                allowTaint: i.allowTaint,
                imageTimeout: i.imageTimeout / 2
            })
        }).then(function(t) {
            return r.image = t
        })
    }
    function j(t) {
        this.src = t.value,
        this.colorStops = [],
        this.type = null,
        this.x0 = .5,
        this.y0 = .5,
        this.x1 = .5,
        this.y1 = .5,
        this.promise = Promise.resolve(!0)
    }
    function I(t, e) {
        this.src = t,
        this.image = new Image;
        var i = this;
        this.tainted = null,
        this.promise = new Promise(function(r, n) {
            i.image.onload = r,
            i.image.onerror = n,
            e && (i.image.crossOrigin = "anonymous"),
            i.image.src = t,
            !0 === i.image.complete && r(i.image)
        })
    }
    function P(e, i) {
        this.link = null,
        this.options = e,
        this.support = i,
        this.origin = this.getOrigin(t.location.href)
    }
    function M(t) {
        j.apply(this, arguments),
        this.type = this.TYPES.LINEAR;
        var e = null === t.args[0].match(this.stepRegExp);
        e ? t.args[0].split(" ").reverse().forEach(function(t) {
            switch (t) {
            case "left":
                this.x0 = 0,
                this.x1 = 1;
                break;
            case "top":
                this.y0 = 0,
                this.y1 = 1;
                break;
            case "right":
                this.x0 = 1,
                this.x1 = 0;
                break;
            case "bottom":
                this.y0 = 1,
                this.y1 = 0;
                break;
            case "to":
                var e = this.y0,
                i = this.x0;
                this.y0 = this.y1,
                this.x0 = this.x1,
                this.x1 = i,
                this.y1 = e
            }
        },
        this) : (this.y0 = 0, this.y1 = 1),
        this.colorStops = t.args.slice(e ? 1 : 0).map(function(t) {
            var e = t.match(this.stepRegExp);
            return {
                color: new T(e[1]),
                stop: "%" === e[3] ? e[2] / 100 : null
            }
        },
        this),
        null === this.colorStops[0].stop && (this.colorStops[0].stop = 0),
        null === this.colorStops[this.colorStops.length - 1].stop && (this.colorStops[this.colorStops.length - 1].stop = 1),
        this.colorStops.forEach(function(t, e) {
            null === t.stop && this.colorStops.slice(e).some(function(i, r) {
                return null !== i.stop && (t.stop = (i.stop - this.colorStops[e - 1].stop) / (r + 1) + this.colorStops[e - 1].stop, !0)
            },
            this)
        },
        this)
    }
    function D() {
        t.html2canvas.logging && t.console && t.console.log && Function.prototype.bind.call(t.console.log, t.console).apply(t.console, [Date.now() - t.html2canvas.start + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)))
    }
    function L(t, e) {
        this.node = t,
        this.parent = e,
        this.stack = null,
        this.bounds = null,
        this.borders = null,
        this.clip = [],
        this.backgroundClip = [],
        this.offsetBounds = null,
        this.visible = null,
        this.computedStyles = null,
        this.colors = {},
        this.styles = {},
        this.backgroundImages = null,
        this.transformData = null,
        this.transformMatrix = null,
        this.isPseudoElement = !1,
        this.opacity = null
    }
    function R(t) {
        var e = t.options[t.selectedIndex || 0];
        return e ? e.text || "": ""
    }
    function B(t) {
        if (t && "matrix" === t[1]) return t[2].split(",").map(function(t) {
            return parseFloat(t.trim())
        })
    }
    function F(t) {
        return - 1 !== t.toString().indexOf("%")
    }
    function N(t) {
        var e, i, r, n, o, s, a, h = [],
        c = 0,
        l = 0,
        u = function() {
            e && ('"' === i.substr(0, 1) && (i = i.substr(1, i.length - 2)), i && a.push(i), "-" === e.substr(0, 1) && (n = e.indexOf("-", 1) + 1) > 0 && (r = e.substr(0, n), e = e.substr(n)), h.push({
                prefix: r,
                method: e.toLowerCase(),
                value: o,
                args: a,
                image: null
            })),
            a = [],
            e = r = i = o = ""
        };
        return a = [],
        e = r = i = o = "",
        t.split("").forEach(function(t) {
            if (! (0 === c && " \r\n\t".indexOf(t) > -1)) {
                switch (t) {
                case '"':
                    s ? s === t && (s = null) : s = t;
                    break;
                case "(":
                    if (s) break;
                    if (0 === c) return c = 1,
                    void(o += t);
                    l++;
                    break;
                case ")":
                    if (s) break;
                    if (1 === c) {
                        if (0 === l) return c = 0,
                        o += t,
                        void u();
                        l--
                    }
                    break;
                case ",":
                    if (s) break;
                    if (0 === c) return void u();
                    if (1 === c && 0 === l && !e.match(/^url$/i)) return a.push(i),
                    i = "",
                    void(o += t)
                }
                o += t,
                0 === c ? e += t: i += t
            }
        }),
        u(),
        h
    }
    function G(t) {
        return t.replace("px", "")
    }
    function X(t) {
        return parseFloat(t)
    }
    function z(t) {
        if (t.getBoundingClientRect) {
            var e = t.getBoundingClientRect(),
            i = null == t.offsetWidth ? e.width: t.offsetWidth;
            return {
                top: e.top,
                bottom: e.bottom || e.top + e.height,
                right: e.left + i,
                left: e.left,
                width: i,
                height: null == t.offsetHeight ? e.height: t.offsetHeight
            }
        }
        return {}
    }
    function V(t) {
        var e = t.offsetParent ? V(t.offsetParent) : {
            top: 0,
            left: 0
        };
        return {
            top: t.offsetTop + e.top,
            bottom: t.offsetTop + t.offsetHeight + e.top,
            right: t.offsetLeft + e.left + t.offsetWidth,
            left: t.offsetLeft + e.left,
            width: t.offsetWidth,
            height: t.offsetHeight
        }
    }
    function W(t, e, i, r, n) {
        D("Starting NodeParser"),
        this.renderer = e,
        this.options = n,
        this.range = null,
        this.support = i,
        this.renderQueue = [],
        this.stack = new Rt(!0, 1, t.ownerDocument, null);
        var o = new L(t, null);
        if (n.background && e.rectangle(0, 0, e.width, e.height, new T(n.background)), t === t.ownerDocument.documentElement) {
            var s = new L(o.color("backgroundColor").isTransparent() ? t.ownerDocument.body: t.ownerDocument.documentElement, null);
            e.rectangle(0, 0, e.width, e.height, s.color("backgroundColor"))
        }
        o.visibile = o.isElementVisible(),
        this.createPseudoHideStyles(t.ownerDocument),
        this.disableAnimations(t.ownerDocument),
        this.nodes = Ct([o].concat(this.getChildren(o)).filter(function(t) {
            return t.visible = t.isElementVisible()
        }).map(this.getPseudoElements, this)),
        this.fontMetrics = new E,
        D("Fetched nodes, total:", this.nodes.length),
        D("Calculate overflow clips"),
        this.calculateOverflowClips(),
        D("Start fetching images"),
        this.images = r.fetch(this.nodes.filter(pt)),
        this.ready = this.images.ready.then(yt(function() {
            return D("Images loaded, starting parsing"),
            D("Creating stacking contexts"),
            this.createStackingContexts(),
            D("Sorting stacking contexts"),
            this.sortStackingContexts(this.stack),
            this.parse(this.stack),
            D("Render queue created with " + this.renderQueue.length + " items"),
            new Promise(yt(function(t) {
                n.async ? "function" == typeof n.async ? n.async.call(this, this.renderQueue, t) : this.renderQueue.length > 0 ? (this.renderIndex = 0, this.asyncRenderer(this.renderQueue, t)) : t() : (this.renderQueue.forEach(this.paint, this), t())
            },
            this))
        },
        this))
    }
    function Y(t) {
        return t.parent && t.parent.clip.length
    }
    function H(t) {
        return t.replace(/(\-[a-z])/g,
        function(t) {
            return t.toUpperCase().replace("-", "")
        })
    }
    function U() {}
    function q(t, e, i, r) {
        return t.map(function(n, o) {
            if (n.width > 0) {
                var s = e.left,
                a = e.top,
                h = e.width,
                c = e.height - t[2].width;
                switch (o) {
                case 0:
                    c = t[0].width,
                    n.args = K({
                        c1: [s, a],
                        c2: [s + h, a],
                        c3: [s + h - t[1].width, a + c],
                        c4: [s + t[3].width, a + c]
                    },
                    r[0], r[1], i.topLeftOuter, i.topLeftInner, i.topRightOuter, i.topRightInner);
                    break;
                case 1:
                    s = e.left + e.width - t[1].width,
                    h = t[1].width,
                    n.args = K({
                        c1: [s + h, a],
                        c2: [s + h, a + c + t[2].width],
                        c3: [s, a + c],
                        c4: [s, a + t[0].width]
                    },
                    r[1], r[2], i.topRightOuter, i.topRightInner, i.bottomRightOuter, i.bottomRightInner);
                    break;
                case 2:
                    a = a + e.height - t[2].width,
                    c = t[2].width,
                    n.args = K({
                        c1: [s + h, a + c],
                        c2: [s, a + c],
                        c3: [s + t[3].width, a],
                        c4: [s + h - t[3].width, a]
                    },
                    r[2], r[3], i.bottomRightOuter, i.bottomRightInner, i.bottomLeftOuter, i.bottomLeftInner);
                    break;
                case 3:
                    h = t[3].width,
                    n.args = K({
                        c1: [s, a + c + t[2].width],
                        c2: [s, a],
                        c3: [s + h, a + t[0].width],
                        c4: [s + h, a + c]
                    },
                    r[3], r[0], i.bottomLeftOuter, i.bottomLeftInner, i.topLeftOuter, i.topLeftInner)
                }
            }
            return n
        })
    }
    function J(t, e, i, r) {
        var n = (Math.sqrt(2) - 1) / 3 * 4,
        o = i * n,
        s = r * n,
        a = t + i,
        h = e + r;
        return {
            topLeft: Q({
                x: t,
                y: h
            },
            {
                x: t,
                y: h - s
            },
            {
                x: a - o,
                y: e
            },
            {
                x: a,
                y: e
            }),
            topRight: Q({
                x: t,
                y: e
            },
            {
                x: t + o,
                y: e
            },
            {
                x: a,
                y: h - s
            },
            {
                x: a,
                y: h
            }),
            bottomRight: Q({
                x: a,
                y: e
            },
            {
                x: a,
                y: e + s
            },
            {
                x: t + o,
                y: h
            },
            {
                x: t,
                y: h
            }),
            bottomLeft: Q({
                x: a,
                y: h
            },
            {
                x: a - o,
                y: h
            },
            {
                x: t,
                y: e + s
            },
            {
                x: t,
                y: e
            })
        }
    }
    function $(t, e, i) {
        var r = t.left,
        n = t.top,
        o = t.width,
        s = t.height,
        a = e[0][0],
        h = e[0][1],
        c = e[1][0],
        l = e[1][1],
        u = e[2][0],
        f = e[2][1],
        d = e[3][0],
        p = e[3][1],
        g = o - c,
        m = s - f,
        v = o - u,
        b = s - p;
        return {
            topLeftOuter: J(r, n, a, h).topLeft.subdivide(.5),
            topLeftInner: J(r + i[3].width, n + i[0].width, Math.max(0, a - i[3].width), Math.max(0, h - i[0].width)).topLeft.subdivide(.5),
            topRightOuter: J(r + g, n, c, l).topRight.subdivide(.5),
            topRightInner: J(r + Math.min(g, o + i[3].width), n + i[0].width, g > o + i[3].width ? 0 : c - i[3].width, l - i[0].width).topRight.subdivide(.5),
            bottomRightOuter: J(r + v, n + m, u, f).bottomRight.subdivide(.5),
            bottomRightInner: J(r + Math.min(v, o - i[3].width), n + Math.min(m, s + i[0].width), Math.max(0, u - i[1].width), f - i[2].width).bottomRight.subdivide(.5),
            bottomLeftOuter: J(r, n + b, d, p).bottomLeft.subdivide(.5),
            bottomLeftInner: J(r + i[3].width, n + b, Math.max(0, d - i[3].width), p - i[2].width).bottomLeft.subdivide(.5)
        }
    }
    function Q(t, e, i, r) {
        var n = function(t, e, i) {
            return {
                x: t.x + (e.x - t.x) * i,
                y: t.y + (e.y - t.y) * i
            }
        };
        return {
            start: t,
            startControl: e,
            endControl: i,
            end: r,
            subdivide: function(o) {
                var s = n(t, e, o),
                a = n(e, i, o),
                h = n(i, r, o),
                c = n(s, a, o),
                l = n(a, h, o),
                u = n(c, l, o);
                return [Q(t, s, c, u), Q(u, l, h, r)]
            },
            curveTo: function(t) {
                t.push(["bezierCurve", e.x, e.y, i.x, i.y, r.x, r.y])
            },
            curveToReversed: function(r) {
                r.push(["bezierCurve", i.x, i.y, e.x, e.y, t.x, t.y])
            }
        }
    }
    function K(t, e, i, r, n, o, s) {
        var a = [];
        return e[0] > 0 || e[1] > 0 ? (a.push(["line", r[1].start.x, r[1].start.y]), r[1].curveTo(a)) : a.push(["line", t.c1[0], t.c1[1]]),
        i[0] > 0 || i[1] > 0 ? (a.push(["line", o[0].start.x, o[0].start.y]), o[0].curveTo(a), a.push(["line", s[0].end.x, s[0].end.y]), s[0].curveToReversed(a)) : (a.push(["line", t.c2[0], t.c2[1]]), a.push(["line", t.c3[0], t.c3[1]])),
        e[0] > 0 || e[1] > 0 ? (a.push(["line", n[1].end.x, n[1].end.y]), n[1].curveToReversed(a)) : a.push(["line", t.c4[0], t.c4[1]]),
        a
    }
    function Z(t, e, i, r, n, o, s) {
        e[0] > 0 || e[1] > 0 ? (t.push(["line", r[0].start.x, r[0].start.y]), r[0].curveTo(t), r[1].curveTo(t)) : t.push(["line", o, s]),
        (i[0] > 0 || i[1] > 0) && t.push(["line", n[0].start.x, n[0].start.y])
    }
    function tt(t) {
        return t.cssInt("zIndex") < 0
    }
    function et(t) {
        return t.cssInt("zIndex") > 0
    }
    function it(t) {
        return 0 === t.cssInt("zIndex")
    }
    function rt(t) {
        return - 1 !== ["inline", "inline-block", "inline-table"].indexOf(t.css("display"))
    }
    function nt(t) {
        return t instanceof Rt
    }
    function ot(t) {
        return t.node.data.trim().length > 0
    }
    function st(t) {
        return /^(normal|none|0px)$/.test(t.parent.css("letterSpacing"))
    }
    function at(t) {
        return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(e) {
            var i = t.css("border" + e + "Radius").split(" ");
            return i.length <= 1 && (i[1] = i[0]),
            i.map(xt)
        })
    }
    function ht(t) {
        return t.nodeType === Node.TEXT_NODE || t.nodeType === Node.ELEMENT_NODE
    }
    function ct(t) {
        var e = t.css("position");
        return "auto" !== ( - 1 !== ["absolute", "relative", "fixed"].indexOf(e) ? t.css("zIndex") : "auto")
    }
    function lt(t) {
        return "static" !== t.css("position")
    }
    function ut(t) {
        return "none" !== t.css("float")
    }
    function ft(t) {
        return - 1 !== ["inline-block", "inline-table"].indexOf(t.css("display"))
    }
    function dt(t) {
        var e = this;
        return function() {
            return ! t.apply(e, arguments)
        }
    }
    function pt(t) {
        return t.node.nodeType === Node.ELEMENT_NODE
    }
    function gt(t) {
        return ! 0 === t.isPseudoElement
    }
    function mt(t) {
        return t.node.nodeType === Node.TEXT_NODE
    }
    function vt(t) {
        return function(e, i) {
            return e.cssInt("zIndex") + t.indexOf(e) / t.length - (i.cssInt("zIndex") + t.indexOf(i) / t.length)
        }
    }
    function bt(t) {
        return t.getOpacity() < 1
    }
    function yt(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    }
    function xt(t) {
        return parseInt(t, 10)
    }
    function wt(t) {
        return t.width
    }
    function St(t) {
        return t.node.nodeType !== Node.ELEMENT_NODE || -1 === ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(t.node.nodeName)
    }
    function Ct(t) {
        return [].concat.apply([], t)
    }
    function _t(t) {
        var e = t.substr(0, 1);
        return e === t.substr(t.length - 1) && e.match(/'|"/) ? t.substr(1, t.length - 2) : t
    }
    function Tt(e) {
        for (var i, r = [], n = 0, o = !1; e.length;) Ot(e[n]) === o ? ((i = e.splice(0, n)).length && r.push(t.html2canvas.punycode.ucs2.encode(i)), o = !o, n = 0) : n++,
        n >= e.length && (i = e.splice(0, n)).length && r.push(t.html2canvas.punycode.ucs2.encode(i));
        return r
    }
    function Ot(t) {
        return - 1 !== [32, 13, 10, 9, 45].indexOf(t)
    }
    function kt(t) {
        return /[^\u0000-\u00ff]/.test(t)
    }
    function Et(t, e, i) {
        if (!e) return Promise.reject("No proxy configured");
        var r = It(ne),
        n = Pt(e, t, r);
        return ne ? Wt(n) : jt(i, n, r).then(function(t) {
            return Nt(t.content)
        })
    }
    function At(t, e, i) {
        var r = It(oe),
        n = Pt(e, t, r);
        return oe ? Promise.resolve(n) : jt(i, n, r).then(function(t) {
            return "data:" + t.type + ";base64," + t.content
        })
    }
    function jt(e, i, r) {
        return new Promise(function(n, o) {
            var s = e.createElement("script"),
            a = function() {
                delete t.html2canvas.proxy[r],
                e.body.removeChild(s)
            };
            t.html2canvas.proxy[r] = function(t) {
                a(),
                n(t)
            },
            s.src = i,
            s.onerror = function(t) {
                a(),
                o(t)
            },
            e.body.appendChild(s)
        })
    }
    function It(t) {
        return t ? "": "html2canvas_" + Date.now() + "_" + ++re + "_" + Math.round(1e5 * Math.random())
    }
    function Pt(t, e, i) {
        return t + "?url=" + encodeURIComponent(e) + (i.length ? "&callback=html2canvas.proxy." + i: "")
    }
    function Mt(t, i) {
        e.createElement("script");
        var r = e.createElement("a");
        r.href = t,
        t = r.href,
        this.src = t,
        this.image = new Image;
        var n = this;
        this.promise = new Promise(function(r, o) {
            n.image.crossOrigin = "Anonymous",
            n.image.onload = r,
            n.image.onerror = o,
            new At(t, i, e).then(function(t) {
                n.image.src = t
            }).
            catch(o)
        })
    }
    function Dt(t, e, i) {
        L.call(this, t, e),
        this.isPseudoElement = !0,
        this.before = ":before" === i
    }
    function Lt(t, e, i, r, n) {
        this.width = t,
        this.height = e,
        this.images = i,
        this.options = r,
        this.document = n
    }
    function Rt(t, e, i, r) {
        L.call(this, i, r),
        this.ownStacking = t,
        this.contexts = [],
        this.children = [],
        this.opacity = (this.parent ? this.parent.stack.opacity: 1) * e
    }
    function Bt(t) {
        this.rangeBounds = this.testRangeBounds(t),
        this.cors = this.testCORS(),
        this.svg = this.testSVG()
    }
    function Ft(t) {
        this.src = t,
        this.image = null;
        var e = this;
        this.promise = this.hasFabric().then(function() {
            return e.isInline(t) ? Promise.resolve(e.inlineFormatting(t)) : Wt(t)
        }).then(function(t) {
            return new Promise(function(i) {
                html2canvas.fabric.loadSVGFromString(t, e.createCanvas.call(e, i))
            })
        })
    }
    function Nt(t) {
        var e, i, r, n, o, s, a, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        c = t.length,
        l = "";
        for (e = 0; e < c; e += 4) o = h.indexOf(t[e]) << 2 | (i = h.indexOf(t[e + 1])) >> 4,
        s = (15 & i) << 4 | (r = h.indexOf(t[e + 2])) >> 2,
        a = (3 & r) << 6 | (n = h.indexOf(t[e + 3])),
        l += 64 === r ? String.fromCharCode(o) : 64 === n || -1 === n ? String.fromCharCode(o, s) : String.fromCharCode(o, s, a);
        return l
    }
    function Gt(t, e) {
        this.src = t,
        this.image = null;
        var i = this;
        this.promise = e ? new Promise(function(e, r) {
            i.image = new Image,
            i.image.onload = e,
            i.image.onerror = r,
            i.image.src = "data:image/svg+xml," + (new XMLSerializer).serializeToString(t),
            !0 === i.image.complete && e(i.image)
        }) : this.hasFabric().then(function() {
            return new Promise(function(e) {
                html2canvas.fabric.parseSVGDocument(t, i.createCanvas.call(i, e))
            })
        })
    }
    function Xt(t, e) {
        L.call(this, t, e)
    }
    function zt(t, e, i) {
        if (t.length > 0) return e + i.toUpperCase()
    }
    function Vt(t) {
        j.apply(this, arguments),
        this.type = "linear" === t.args[0] ? this.TYPES.LINEAR: this.TYPES.RADIAL
    }
    function Wt(t) {
        return new Promise(function(e, i) {
            var r = new XMLHttpRequest;
            r.open("GET", t),
            r.onload = function() {
                200 === r.status ? e(r.responseText) : i(new Error(r.statusText))
            },
            r.onerror = function() {
                i(new Error("Network Error"))
            },
            r.send()
        })
    }
    function Yt(t, e) {
        Lt.apply(this, arguments),
        this.canvas = this.options.canvas || this.document.createElement("canvas"),
        this.options.canvas || (this.canvas.width = t, this.canvas.height = e),
        this.ctx = this.canvas.getContext("2d"),
        this.taintCtx = this.document.createElement("canvas").getContext("2d"),
        this.ctx.textBaseline = "bottom",
        this.variables = {},
        D("Initialized CanvasRenderer with size", t, "x", e)
    }
    function Ht(t) {
        return t.length > 0
    }
    if (function() {
        function i(t, e) {
            k[_] = t,
            k[_ + 1] = e,
            2 === (_ += 2) && S()
        }
        function o(t) {
            return "function" == typeof t
        }
        function s() {
            for (var t = 0; t < _; t += 2)(0, k[t])(k[t + 1]),
            k[t] = void 0,
            k[t + 1] = void 0;
            _ = 0
        }
        function a() {}
        function h(t, e, i, r) {
            try {
                t.call(e, i, r)
            } catch(t) {
                return t
            }
        }
        function c(t, e, r) {
            i(function(t) {
                var i = !1,
                n = h(r, e,
                function(r) {
                    i || (i = !0, e !== r ? u(t, r) : d(t, r))
                },
                function(e) {
                    i || (i = !0, p(t, e))
                }); ! i && n && (i = !0, p(t, n))
            },
            t)
        }
        function l(t, e) {
            1 === e.a ? d(t, e.b) : 2 === t.a ? p(t, e.b) : g(e, void 0,
            function(e) {
                u(t, e)
            },
            function(e) {
                p(t, e)
            })
        }
        function u(t, e) {
            if (t === e) p(t, new TypeError("You cannot resolve a promise with itself"));
            else if ("function" == typeof e || "object" == typeof e && null !== e) if (e.constructor === t.constructor) l(t, e);
            else {
                var i;
                try {
                    i = e.then
                } catch(t) {
                    E.error = t,
                    i = E
                }
                i === E ? p(t, E.error) : void 0 === i ? d(t, e) : o(i) ? c(t, e, i) : d(t, e)
            } else d(t, e)
        }
        function f(t) {
            t.f && t.f(t.b),
            m(t)
        }
        function d(t, e) {
            void 0 === t.a && (t.b = e, t.a = 1, 0 !== t.e.length && i(m, t))
        }
        function p(t, e) {
            void 0 === t.a && (t.a = 2, t.b = e, i(f, t))
        }
        function g(t, e, r, n) {
            var o = t.e,
            s = o.length;
            t.f = null,
            o[s] = e,
            o[s + 1] = r,
            o[s + 2] = n,
            0 === s && t.a && i(m, t)
        }
        function m(t) {
            var e = t.e,
            i = t.a;
            if (0 !== e.length) {
                for (var r, n, o = t.b,
                s = 0; s < e.length; s += 3) r = e[s],
                n = e[s + i],
                r ? b(i, r, n, o) : n(o);
                t.e.length = 0
            }
        }
        function v() {
            this.error = null
        }
        function b(t, e, i, r) {
            var n, s, a, h, c = o(i);
            if (c) {
                try {
                    n = i(r)
                } catch(t) {
                    A.error = t,
                    n = A
                }
                if (n === A ? (h = !0, s = n.error, n = null) : a = !0, e === n) return void p(e, new TypeError("A promises callback cannot return that same promise."))
            } else n = r,
            a = !0;
            void 0 === e.a && (c && a ? u(e, n) : h ? p(e, s) : 1 === t ? d(e, n) : 2 === t && p(e, n))
        }
        function y(t, e) {
            try {
                e(function(e) {
                    u(t, e)
                },
                function(e) {
                    p(t, e)
                })
            } catch(e) {
                p(t, e)
            }
        }
        function x(t, e, i, r) {
            this.n = t,
            this.c = new t(a, r),
            this.i = i,
            this.o(e) ? (this.m = e, this.d = this.length = e.length, this.l(), 0 === this.length ? d(this.c, this.b) : (this.length = this.length || 0, this.k(), 0 === this.d && d(this.c, this.b))) : p(this.c, this.p())
        }
        function w(t) {
            if (j++, this.b = this.a = void 0, this.e = [], a !== t) {
                if (!o(t)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                if (! (this instanceof w)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                y(this, t)
            }
        }
        var S, C = Array.isArray ? Array.isArray: function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        },
        _ = 0,
        T = (O = void 0 !== t ? t: {}).MutationObserver || O.WebKitMutationObserver,
        O = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
        k = Array(1e3);
        S = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ?
        function() {
            process.nextTick(s)
        }: T ?
        function() {
            var t = 0,
            i = new T(s),
            r = e.createTextNode("");
            return i.observe(r, {
                characterData: !0
            }),
            function() {
                r.data = t = ++t % 2
            }
        } () : O ?
        function() {
            var t = new MessageChannel;
            return t.port1.onmessage = s,
            function() {
                t.port2.postMessage(0)
            }
        } () : function() {
            setTimeout(s, 1)
        };
        var E = new v,
        A = new v;
        x.prototype.o = function(t) {
            return C(t)
        },
        x.prototype.p = function() {
            return Error("Array Methods must be provided an Array")
        },
        x.prototype.l = function() {
            this.b = Array(this.length)
        },
        x.prototype.k = function() {
            for (var t = this.length,
            e = this.c,
            i = this.m,
            r = 0; void 0 === e.a && r < t; r++) this.j(i[r], r)
        },
        x.prototype.j = function(t, e) {
            var i = this.n;
            "object" == typeof t && null !== t ? t.constructor === i && void 0 !== t.a ? (t.f = null, this.g(t.a, e, t.b)) : this.q(i.resolve(t), e) : (this.d--, this.b[e] = this.h(t))
        },
        x.prototype.g = function(t, e, i) {
            var r = this.c;
            void 0 === r.a && (this.d--, this.i && 2 === t ? p(r, i) : this.b[e] = this.h(i)),
            0 === this.d && d(r, this.b)
        },
        x.prototype.h = function(t) {
            return t
        },
        x.prototype.q = function(t, e) {
            var i = this;
            g(t, void 0,
            function(t) {
                i.g(1, e, t)
            },
            function(t) {
                i.g(2, e, t)
            })
        };
        var j = 0;
        w.all = function(t, e) {
            return new x(this, t, !0, e).c
        },
        w.race = function(t, e) {
            var i = new this(a, e);
            if (!C(t)) return p(i, new TypeError("You must pass an array to race.")),
            i;
            for (var r = t.length,
            n = 0; void 0 === i.a && n < r; n++) g(this.resolve(t[n]), void 0,
            function(t) {
                u(i, t)
            },
            function(t) {
                p(i, t)
            });
            return i
        },
        w.resolve = function(t, e) {
            if (t && "object" == typeof t && t.constructor === this) return t;
            var i = new this(a, e);
            return u(i, t),
            i
        },
        w.reject = function(t, e) {
            var i = new this(a, e);
            return p(i, t),
            i
        },
        w.prototype = {
            constructor: w,
            then: function(t, e) {
                var r = this.a;
                if (1 === r && !t || 2 === r && !e) return this;
                var n = new this.constructor(a),
                o = this.b;
                if (r) {
                    var s = arguments[r - 1];
                    i(function() {
                        b(r, n, s, o)
                    })
                } else g(this, n, t, e);
                return n
            },
            catch: function(t) {
                return this.then(null, t)
            }
        };
        var I = {
            Promise: w,
            polyfill: function() {
                var e;
                "Promise" in (e = void 0 !== r ? r: void 0 !== t && t.document ? t: self) && "resolve" in e.Promise && "reject" in e.Promise && "all" in e.Promise && "race" in e.Promise &&
                function() {
                    var t;
                    return new e.Promise(function(e) {
                        t = e
                    }),
                    o(t)
                } () || (e.Promise = w)
            }
        };
        "function" == typeof n && n.amd ? n(function() {
            return I
        }) : "undefined" != typeof module && module.exports ? module.exports = I: void 0 !== this && (this.ES6Promise = I)
    }.call(t), t && t.ES6Promise.polyfill(), void 0 !== e && "function" == typeof Object.create && "function" == typeof e.createElement("canvas").getContext) { !
        function(t) {
            function e(t) {
                throw RangeError(I[t])
            }
            function o(t, e) {
                for (var i = t.length,
                r = []; i--;) r[i] = e(t[i]);
                return r
            }
            function s(t, e) {
                var i = t.split("@"),
                r = "";
                return i.length > 1 && (r = i[0] + "@", t = i[1]),
                r + o(t.split(j), e).join(".")
            }
            function a(t) {
                for (var e, i, r = [], n = 0, o = t.length; n < o;)(e = t.charCodeAt(n++)) >= 55296 && e <= 56319 && n < o ? 56320 == (64512 & (i = t.charCodeAt(n++))) ? r.push(((1023 & e) << 10) + (1023 & i) + 65536) : (r.push(e), n--) : r.push(e);
                return r
            }
            function h(t) {
                return o(t,
                function(t) {
                    var e = "";
                    return t > 65535 && (e += D((t -= 65536) >>> 10 & 1023 | 55296), t = 56320 | 1023 & t),
                    e += D(t)
                }).join("")
            }
            function c(t) {
                return t - 48 < 10 ? t - 22 : t - 65 < 26 ? t - 65 : t - 97 < 26 ? t - 97 : x
            }
            function l(t, e) {
                return t + 22 + 75 * (t < 26) - ((0 != e) << 5)
            }
            function u(t, e, i) {
                var r = 0;
                for (t = i ? M(t / _) : t >> 1, t += M(t / e); t > P * S >> 1; r += x) t = M(t / P);
                return M(r + (P + 1) * t / (t + C))
            }
            function f(t) {
                var i, r, n, o, s, a, l, f, d, p, g = [],
                m = t.length,
                v = 0,
                b = O,
                C = T;
                for ((r = t.lastIndexOf(k)) < 0 && (r = 0), n = 0; n < r; ++n) t.charCodeAt(n) >= 128 && e("not-basic"),
                g.push(t.charCodeAt(n));
                for (o = r > 0 ? r + 1 : 0; o < m;) {
                    for (s = v, a = 1, l = x; o >= m && e("invalid-input"), ((f = c(t.charCodeAt(o++))) >= x || f > M((y - v) / a)) && e("overflow"), v += f * a, d = l <= C ? w: l >= C + S ? S: l - C, !(f < d); l += x) a > M(y / (p = x - d)) && e("overflow"),
                    a *= p;
                    C = u(v - s, i = g.length + 1, 0 == s),
                    M(v / i) > y - b && e("overflow"),
                    b += M(v / i),
                    v %= i,
                    g.splice(v++, 0, b)
                }
                return h(g)
            }
            function d(t) {
                var i, r, n, o, s, h, c, f, d, p, g, m, v, b, C, _ = [];
                for (m = (t = a(t)).length, i = O, r = 0, s = T, h = 0; h < m; ++h)(g = t[h]) < 128 && _.push(D(g));
                for (n = o = _.length, o && _.push(k); n < m;) {
                    for (c = y, h = 0; h < m; ++h)(g = t[h]) >= i && g < c && (c = g);
                    for (c - i > M((y - r) / (v = n + 1)) && e("overflow"), r += (c - i) * v, i = c, h = 0; h < m; ++h) if ((g = t[h]) < i && ++r > y && e("overflow"), g == i) {
                        for (f = r, d = x; p = d <= s ? w: d >= s + S ? S: d - s, !(f < p); d += x) C = f - p,
                        b = x - p,
                        _.push(D(l(p + C % b, 0))),
                        f = M(C / b);
                        _.push(D(l(f, 0))),
                        s = u(r, v, n == o),
                        r = 0,
                        ++n
                    }++r,
                    ++i
                }
                return _.join("")
            }
            var p = "object" == typeof i && i && !i.nodeType && i,
            g = "object" == typeof module && module && !module.nodeType && module,
            m = "object" == typeof r && r;
            m.global !== m && m.window !== m && m.self !== m || (t = m);
            var v, b, y = 2147483647,
            x = 36,
            w = 1,
            S = 26,
            C = 38,
            _ = 700,
            T = 72,
            O = 128,
            k = "-",
            E = /^xn--/,
            A = /[^\x20-\x7E]/,
            j = /[\x2E\u3002\uFF0E\uFF61]/g,
            I = {
                overflow: "Overflow: input needs wider integers to process",
                "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                "invalid-input": "Invalid input"
            },
            P = x - w,
            M = Math.floor,
            D = String.fromCharCode;
            if (v = {
                version: "1.3.1",
                ucs2: {
                    decode: a,
                    encode: h
                },
                decode: f,
                encode: d,
                toASCII: function(t) {
                    return s(t,
                    function(t) {
                        return A.test(t) ? "xn--" + d(t) : t
                    })
                },
                toUnicode: function(t) {
                    return s(t,
                    function(t) {
                        return E.test(t) ? f(t.slice(4).toLowerCase()) : t
                    })
                }
            },
            "function" == typeof n && "object" == typeof n.amd && n.amd) n("punycode",
            function() {
                return v
            });
            else if (p && g) if (module.exports == p) g.exports = v;
            else for (b in v) v.hasOwnProperty(b) && (p[b] = v[b]);
            else t.punycode = v
        } (this);
        var Ut = "data-html2canvas-node",
        qt = "data-html2canvas-canvas-clone",
        Jt = 0,
        $t = 0;
        t.html2canvas = function(i, r) {
            var n = $t++;
            if ((r = r || {}).logging && (t.html2canvas.logging = !0, t.html2canvas.start = Date.now()), r.async = void 0 === r.async || r.async, r.allowTaint = void 0 !== r.allowTaint && r.allowTaint, r.removeContainer = void 0 === r.removeContainer || r.removeContainer, r.javascriptEnabled = void 0 !== r.javascriptEnabled && r.javascriptEnabled, r.imageTimeout = void 0 === r.imageTimeout ? 1e4: r.imageTimeout, r.renderer = "function" == typeof r.renderer ? r.renderer: Yt, r.strict = !!r.strict, "string" == typeof i) {
                if ("string" != typeof r.proxy) return Promise.reject("Proxy must be used when rendering url");
                var h = null != r.width ? r.width: t.innerWidth,
                c = null != r.height ? r.height: t.innerHeight;
                return b(_(i), r.proxy, e, h, c, r).then(function(t) {
                    return a(t.contentWindow.document.documentElement, t, r, h, c)
                })
            }
            var l = (i === o ? [e.documentElement] : i.length ? i: [i])[0];
            return l.setAttribute(Ut + n, n),
            s(l.ownerDocument, r, l.ownerDocument.defaultView.innerWidth, l.ownerDocument.defaultView.innerHeight, n).then(function(t) {
                if ("function" == typeof r.onrendered) if (D("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas"), void 0 === r.grabMouse || r.grabMouse) {
                    var e = new Image(25, 25);
                    e.onload = function() {
                        t.getContext("2d").drawImage(e, ae, he, 25, 25),
                        r.onrendered(t)
                    },
                    e.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAYAAAAxFw7TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAzZJREFUSEut1EtME1EUANBiTTFaivRDKbaFFgiILgxx0bQllYItYKFIgEYoC2oEwqeCC4gG1xg2dmEwEQMJujIxwQ24wA2uCFAB3SBBfqWuyqd/CuV634QSPgOFxElu+mZye+a++948BgAw/mccYAwGIyY7O1vR3NzSiuMLX5GiDoO8tLQ0QzAYDLW1tT2/qEgHJslk8rKtLU9odzcMTU3N7RdB6UBhRkZG6fz8QrCuzgJutwfq6xtazovSgunp6SUOhzPI5XJBr9fD9nYojHjDeVA6MJH0EMGARCIBRKC8vJygO2ZzrSUaSgumpqY+cDjWAlJpCgWSMJlMiO6EqqpMtWehtKBUKi1eXV3zI3wAEhQrJJUGseJHp6G0IE61CKfsl8lkR0CCWiyPAXeU32AwVNChdKAAwUIEfXK5/ARI0IaGRkS3vXp9ofE4SguKxWL92tpfH642LUjQ1lYr+P0Bt1abX3wYPQv04n48FSRoe/sz8Pn8G7m5uboISgfyk5OT72OF3szMzBMgk8k88qyjowPW1zddCoVCS1BaUCQSEdCTlZV18GcOh0ONq6trYGbmJ0xMTO3Z7dMwPj4B4XAYXC7XhkqlKqAFBQJBAS6KB08dClEqlTA8/JUak5cEAkHo6nppMxqN7ZWVVZ0GQ0lnRUXlC6VSVXoamI+gm/RQKEyChYU/u5gYUqvVFDo09AVsNttrHMdh3MAQYyRhxNIeX3y+QLu0tLKlVufC5OQU9Pa+/TgwMPCpv7+fAouKigG/pFX81qV4H4PBwrh8Wg95eOUtLi5vLi+v4FSHRzExRafTNZJ7NptNobOzs2C1Wp+eZx/yEhIS8jwer99ut//icOJvk+mwWCzF3NzvebPZTIF4+ILd/mMcx1ei7UOeUCjUjY19n8YvRYPJVzG4GGk9PT3vRkZGKJDH44PT6STTfxgNjGez4+4idg8Tr+8nx+KvNCcnx4y926mpMUNf33vY2wPo7n71JhpImszer4x5KFmE4zujo98m3W6ve3Dww2eNRvMEW3GLrG4kj26Vj/c5ch+Pg5t4ApXhopFWSDASMcjzg+siIKmWVJm839Nr+Hvp+Nsj4D+5Hdf43ZzjNQAAAABJRU5ErkJggg=="
                } else r.onrendered(t);
                return t
            })
        },
        t.html2canvas.punycode = this.punycode,
        t.html2canvas.proxy = {},
        T.prototype.darken = function(t) {
            var e = 1 - t;
            return new T([Math.round(this.r * e), Math.round(this.g * e), Math.round(this.b * e), this.a])
        },
        T.prototype.isTransparent = function() {
            return 0 === this.a
        },
        T.prototype.isBlack = function() {
            return 0 === this.r && 0 === this.g && 0 === this.b
        },
        T.prototype.fromArray = function(t) {
            return Array.isArray(t) && (this.r = Math.min(t[0], 255), this.g = Math.min(t[1], 255), this.b = Math.min(t[2], 255), t.length > 3 && (this.a = t[3])),
            Array.isArray(t)
        };
        var Qt = /^#([a-f0-9]{3})$/i;
        T.prototype.hex3 = function(t) {
            var e = null;
            return null !== (e = t.match(Qt)) && (this.r = parseInt(e[1][0] + e[1][0], 16), this.g = parseInt(e[1][1] + e[1][1], 16), this.b = parseInt(e[1][2] + e[1][2], 16)),
            null !== e
        };
        var Kt = /^#([a-f0-9]{6})$/i;
        T.prototype.hex6 = function(t) {
            var e = null;
            return null !== (e = t.match(Kt)) && (this.r = parseInt(e[1].substring(0, 2), 16), this.g = parseInt(e[1].substring(2, 4), 16), this.b = parseInt(e[1].substring(4, 6), 16)),
            null !== e
        };
        var Zt = /^rgb\((\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3})\)$/;
        T.prototype.rgb = function(t) {
            var e = null;
            return null !== (e = t.match(Zt)) && (this.r = Number(e[1]), this.g = Number(e[2]), this.b = Number(e[3])),
            null !== e
        };
        var te = /^rgba\((\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3}) *, *(\d+\.?\d*)\)$/;
        T.prototype.rgba = function(t) {
            var e = null;
            return null !== (e = t.match(te)) && (this.r = Number(e[1]), this.g = Number(e[2]), this.b = Number(e[3]), this.a = Number(e[4])),
            null !== e
        },
        T.prototype.toString = function() {
            return null !== this.a && 1 !== this.a ? "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")": "rgb(" + [this.r, this.g, this.b].join(",") + ")"
        },
        T.prototype.namedColor = function(t) {
            var e = ee[t.toLowerCase()];
            if (e) this.r = e[0],
            this.g = e[1],
            this.b = e[2];
            else if ("transparent" === t.toLowerCase()) return this.r = this.g = this.b = this.a = 0,
            !0;
            return !! e
        },
        T.prototype.isColor = !0;
        var ee = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 134, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 250, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 221],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [112, 128, 144],
            slategrey: [112, 128, 144],
            snow: [255, 250, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 50]
        };
        E.prototype.getMetrics = function(t, e) {
            return this.data[t + "-" + e] === o && (this.data[t + "-" + e] = new k(t, e)),
            this.data[t + "-" + e]
        },
        A.prototype.proxyLoad = function(t, e, i) {
            var r = this.src;
            return b(r.src, t, r.ownerDocument, e.width, e.height, i)
        },
        j.prototype.TYPES = {
            LINEAR: 1,
            RADIAL: 2
        },
        P.prototype.findImages = function(t) {
            var e = [];
            return t.reduce(function(t, e) {
                switch (e.node.nodeName) {
                case "IMG":
                    return t.concat([{
                        args:
                        [e.node.src],
                        method: "url"
                    }]);
                case "svg":
                case "IFRAME":
                    return t.concat([{
                        args:
                        [e.node],
                        method: e.node.nodeName
                    }])
                }
                return t
            },
            []).forEach(this.addImage(e, this.loadImage), this),
            e
        },
        P.prototype.findBackgroundImage = function(t, e) {
            return e.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(t, this.loadImage), this),
            t
        },
        P.prototype.addImage = function(t, e) {
            return function(i) {
                i.args.forEach(function(r) {
                    this.imageExists(t, r) || (t.splice(0, 0, e.call(this, i)), D("Added image #" + t.length, "string" == typeof r ? r.substring(0, 100) : r))
                },
                this)
            }
        },
        P.prototype.hasImageBackground = function(t) {
            return "none" !== t.method
        },
        P.prototype.loadImage = function(t) {
            if ("url" === t.method) {
                var e = t.args[0];
                return ! this.isSVG(e) || this.support.svg || this.options.allowTaint ? e.match(/data:image\/.*;base64,/i) ? new I(e.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ""), !1) : this.isSameOrigin(e) || !0 === this.options.allowTaint || this.isSVG(e) ? new I(e, !1) : this.support.cors && !this.options.allowTaint && this.options.useCORS ? new I(e, !0) : this.options.proxy ? new Mt(e, this.options.proxy) : new O(e) : new Ft(e)
            }
            return "linear-gradient" === t.method ? new M(t) : "gradient" === t.method ? new Vt(t) : "svg" === t.method ? new Gt(t.args[0], this.support.svg) : "IFRAME" === t.method ? new A(t.args[0], this.isSameOrigin(t.args[0].src), this.options) : new O(t)
        },
        P.prototype.isSVG = function(t) {
            return "svg" === t.substring(t.length - 3).toLowerCase() || Ft.prototype.isInline(t)
        },
        P.prototype.imageExists = function(t, e) {
            return t.some(function(t) {
                return t.src === e
            })
        },
        P.prototype.isSameOrigin = function(t) {
            return this.getOrigin(t) === this.origin
        },
        P.prototype.getOrigin = function(t) {
            var i = this.link || (this.link = e.createElement("a"));
            return i.href = t,
            i.href = i.href,
            i.protocol + i.hostname + i.port
        },
        P.prototype.getPromise = function(t) {
            return this.timeout(t, this.options.imageTimeout).
            catch(function() {
                return new O(t.src).promise.then(function(e) {
                    t.image = e
                })
            })
        },
        P.prototype.get = function(t) {
            var e = null;
            return this.images.some(function(i) {
                return (e = i).src === t
            }) ? e: null
        },
        P.prototype.fetch = function(t) {
            return this.images = t.reduce(yt(this.findBackgroundImage, this), this.findImages(t)),
            this.images.forEach(function(t, e) {
                t.promise.then(function() {
                    D("Succesfully loaded image #" + (e + 1), t)
                },
                function(i) {
                    D("Failed loading image #" + (e + 1), t, i)
                })
            }),
            this.ready = Promise.all(this.images.map(this.getPromise, this)),
            D("Finished searching images"),
            this
        },
        P.prototype.timeout = function(t, e) {
            var i, r = Promise.race([t.promise, new Promise(function(r, n) {
                i = setTimeout(function() {
                    D("Timed out loading image", t),
                    n(t)
                },
                e)
            })]).then(function(t) {
                return clearTimeout(i),
                t
            });
            return r.
            catch(function() {
                clearTimeout(i)
            }),
            r
        },
        (M.prototype = Object.create(j.prototype)).stepRegExp = /((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/,
        L.prototype.cloneTo = function(t) {
            t.visible = this.visible,
            t.borders = this.borders,
            t.bounds = this.bounds,
            t.clip = this.clip,
            t.backgroundClip = this.backgroundClip,
            t.computedStyles = this.computedStyles,
            t.styles = this.styles,
            t.backgroundImages = this.backgroundImages,
            t.opacity = this.opacity
        },
        L.prototype.getOpacity = function() {
            return null === this.opacity ? this.opacity = this.cssFloat("opacity") : this.opacity
        },
        L.prototype.assignStack = function(t) {
            this.stack = t,
            t.children.push(this)
        },
        L.prototype.isElementVisible = function() {
            return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible: "none" !== this.css("display") && "hidden" !== this.css("visibility") && !this.node.hasAttribute("data-html2canvas-ignore") && ("INPUT" !== this.node.nodeName || "hidden" !== this.node.getAttribute("type"))
        },
        L.prototype.css = function(t) {
            return this.computedStyles || (this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before": ":after") : this.computedStyle(null)),
            this.styles[t] || (this.styles[t] = this.computedStyles[t])
        },
        L.prototype.prefixedCss = function(t) {
            var e = ["webkit", "moz", "ms", "o"],
            i = this.css(t);
            return i === o && e.some(function(e) {
                return (i = this.css(e + t.substr(0, 1).toUpperCase() + t.substr(1))) !== o
            },
            this),
            i === o ? null: i
        },
        L.prototype.computedStyle = function(t) {
            return this.node.ownerDocument.defaultView.getComputedStyle(this.node, t)
        },
        L.prototype.cssInt = function(t) {
            var e = parseInt(this.css(t), 10);
            return isNaN(e) ? 0 : e
        },
        L.prototype.color = function(t) {
            return this.colors[t] || (this.colors[t] = new T(this.css(t)))
        },
        L.prototype.cssFloat = function(t) {
            var e = parseFloat(this.css(t));
            return isNaN(e) ? 0 : e
        },
        L.prototype.fontWeight = function() {
            var t = this.css("fontWeight");
            switch (parseInt(t, 10)) {
            case 401:
                t = "bold";
                break;
            case 400:
                t = "normal"
            }
            return t
        },
        L.prototype.parseClip = function() {
            var t = this.css("clip").match(this.CLIP);
            return t ? {
                top: parseInt(t[1], 10),
                right: parseInt(t[2], 10),
                bottom: parseInt(t[3], 10),
                left: parseInt(t[4], 10)
            }: null
        },
        L.prototype.parseBackgroundImages = function() {
            return this.backgroundImages || (this.backgroundImages = N(this.css("backgroundImage")))
        },
        L.prototype.cssList = function(t, e) {
            var i = (this.css(t) || "").split(",");
            return i = i[e || 0] || i[0] || "auto",
            1 === (i = i.trim().split(" ")).length && (i = [i[0], i[0]]),
            i
        },
        L.prototype.parseBackgroundSize = function(t, e, i) {
            var r, n, o = this.cssList("backgroundSize", i);
            if (F(o[0])) r = t.width * parseFloat(o[0]) / 100;
            else {
                if (/contain|cover/.test(o[0])) {
                    var s = t.width / t.height,
                    a = e.width / e.height;
                    return s < a ^ "contain" === o[0] ? {
                        width: t.height * a,
                        height: t.height
                    }: {
                        width: t.width,
                        height: t.width / a
                    }
                }
                r = parseInt(o[0], 10)
            }
            return n = "auto" === o[0] && "auto" === o[1] ? e.height: "auto" === o[1] ? r / e.width * e.height: F(o[1]) ? t.height * parseFloat(o[1]) / 100 : parseInt(o[1], 10),
            "auto" === o[0] && (r = n / e.height * e.width),
            {
                width: r,
                height: n
            }
        },
        L.prototype.parseBackgroundPosition = function(t, e, i, r) {
            var n, o, s = this.cssList("backgroundPosition", i);
            return n = F(s[0]) ? (t.width - (r || e).width) * (parseFloat(s[0]) / 100) : parseInt(s[0], 10),
            o = "auto" === s[1] ? n / e.width * e.height: F(s[1]) ? (t.height - (r || e).height) * parseFloat(s[1]) / 100 : parseInt(s[1], 10),
            "auto" === s[0] && (n = o / e.height * e.width),
            {
                left: n,
                top: o
            }
        },
        L.prototype.parseBackgroundRepeat = function(t) {
            return this.cssList("backgroundRepeat", t)[0]
        },
        L.prototype.parseTextShadows = function() {
            var t = this.css("textShadow"),
            e = [];
            if (t && "none" !== t) for (var i = t.match(this.TEXT_SHADOW_PROPERTY), r = 0; i && r < i.length; r++) {
                var n = i[r].match(this.TEXT_SHADOW_VALUES);
                e.push({
                    color: new T(n[0]),
                    offsetX: n[1] ? parseFloat(n[1].replace("px", "")) : 0,
                    offsetY: n[2] ? parseFloat(n[2].replace("px", "")) : 0,
                    blur: n[3] ? n[3].replace("px", "") : 0
                })
            }
            return e
        },
        L.prototype.parseTransform = function() {
            if (!this.transformData) if (this.hasTransform()) {
                var t = this.parseBounds(),
                e = this.prefixedCss("transformOrigin").split(" ").map(G).map(X);
                e[0] += t.left,
                e[1] += t.top,
                this.transformData = {
                    origin: e,
                    matrix: this.parseTransformMatrix()
                }
            } else this.transformData = {
                origin: [0, 0],
                matrix: [1, 0, 0, 1, 0, 0]
            };
            return this.transformData
        },
        L.prototype.parseTransformMatrix = function() {
            if (!this.transformMatrix) {
                var t = this.prefixedCss("transform"),
                e = t ? B(t.match(this.MATRIX_PROPERTY)) : null;
                this.transformMatrix = e || [1, 0, 0, 1, 0, 0]
            }
            return this.transformMatrix
        },
        L.prototype.parseBounds = function() {
            return this.bounds = this.hasTransform() ? V(this.node) : z(this.node)
        },
        L.prototype.hasTransform = function() {
            return "1,0,0,1,0,0" !== this.parseTransformMatrix().join(",") || this.parent && this.parent.hasTransform()
        },
        L.prototype.getValue = function() {
            var t = this.node.value || "";
            return "SELECT" === this.node.tagName ? t = R(this.node) : "password" === this.node.type && (t = Array(t.length + 1).join("•")),
            0 === t.length ? this.node.placeholder || "": t
        },
        L.prototype.MATRIX_PROPERTY = /(matrix)\((.+)\)/,
        L.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g,
        L.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g,
        L.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/,
        W.prototype.calculateOverflowClips = function() {
            this.nodes.forEach(function(t) {
                if (pt(t)) {
                    gt(t) && t.appendToDOM(),
                    t.borders = this.parseBorders(t);
                    var e = "hidden" === t.css("overflow") ? [t.borders.clip] : [],
                    i = t.parseClip();
                    i && -1 !== ["absolute", "fixed"].indexOf(t.css("position")) && e.push([["rect", t.bounds.left + i.left, t.bounds.top + i.top, i.right - i.left, i.bottom - i.top]]),
                    t.clip = Y(t) ? t.parent.clip.concat(e) : e,
                    t.backgroundClip = "hidden" !== t.css("overflow") ? t.clip.concat([t.borders.clip]) : t.clip,
                    gt(t) && t.cleanDOM()
                } else mt(t) && (t.clip = Y(t) ? t.parent.clip: []);
                gt(t) || (t.bounds = null)
            },
            this)
        },
        W.prototype.asyncRenderer = function(t, e, i) {
            i = i || Date.now(),
            this.paint(t[this.renderIndex++]),
            t.length === this.renderIndex ? e() : i + 20 > Date.now() ? this.asyncRenderer(t, e, i) : setTimeout(yt(function() {
                this.asyncRenderer(t, e)
            },
            this), 0)
        },
        W.prototype.createPseudoHideStyles = function(t) {
            this.createStyles(t, "." + Dt.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }.' + Dt.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }')
        },
        W.prototype.disableAnimations = function(t) {
            this.createStyles(t, "* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}")
        },
        W.prototype.createStyles = function(t, e) {
            var i = t.createElement("style");
            i.innerHTML = e,
            t.body.appendChild(i)
        },
        W.prototype.getPseudoElements = function(t) {
            var e = [[t]];
            if (t.node.nodeType === Node.ELEMENT_NODE) {
                var i = this.getPseudoElement(t, ":before"),
                r = this.getPseudoElement(t, ":after");
                i && e.push(i),
                r && e.push(r)
            }
            return Ct(e)
        },
        W.prototype.getPseudoElement = function(t, i) {
            var r = t.computedStyle(i);
            if (!r || !r.content || "none" === r.content || "-moz-alt-content" === r.content || "none" === r.display) return null;
            for (var n = _t(r.content), o = "url" === n.substr(0, 3), s = e.createElement(o ? "img": "html2canvaspseudoelement"), a = new Dt(s, t, i), h = r.length - 1; h >= 0; h--) {
                var c = H(r.item(h));
                s.style[c] = r[c]
            }
            if (s.className = Dt.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + Dt.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER, o) return s.src = N(n)[0].args[0],
            [a];
            var l = e.createTextNode(n);
            return s.appendChild(l),
            [a, new Xt(l, a)]
        },
        W.prototype.getChildren = function(t) {
            return Ct([].filter.call(t.node.childNodes, ht).map(function(e) {
                var i = [e.nodeType === Node.TEXT_NODE ? new Xt(e, t) : new L(e, t)].filter(St);
                return e.nodeType === Node.ELEMENT_NODE && i.length && "TEXTAREA" !== e.tagName ? i[0].isElementVisible() ? i.concat(this.getChildren(i[0])) : [] : i
            },
            this))
        },
        W.prototype.newStackingContext = function(t, e) {
            var i = new Rt(e, t.getOpacity(), t.node, t.parent);
            t.cloneTo(i),
            (e ? i.getParentStack(this) : i.parent.stack).contexts.push(i),
            t.stack = i
        },
        W.prototype.createStackingContexts = function() {
            this.nodes.forEach(function(t) {
                pt(t) && (this.isRootElement(t) || bt(t) || ct(t) || this.isBodyWithTransparentRoot(t) || t.hasTransform()) ? this.newStackingContext(t, !0) : pt(t) && (lt(t) && it(t) || ft(t) || ut(t)) ? this.newStackingContext(t, !1) : t.assignStack(t.parent.stack)
            },
            this)
        },
        W.prototype.isBodyWithTransparentRoot = function(t) {
            return "BODY" === t.node.nodeName && t.parent.color("backgroundColor").isTransparent()
        },
        W.prototype.isRootElement = function(t) {
            return null === t.parent
        },
        W.prototype.sortStackingContexts = function(t) {
            t.contexts.sort(vt(t.contexts.slice(0))),
            t.contexts.forEach(this.sortStackingContexts, this)
        },
        W.prototype.parseTextBounds = function(t) {
            return function(e, i, r) {
                if ("none" !== t.parent.css("textDecoration").substr(0, 4) || 0 !== e.trim().length) {
                    if (this.support.rangeBounds && !t.parent.hasTransform()) {
                        var n = r.slice(0, i).join("").length;
                        return this.getRangeBounds(t.node, n, e.length)
                    }
                    if (t.node && "string" == typeof t.node.data) {
                        var o = t.node.splitText(e.length),
                        s = this.getWrapperBounds(t.node, t.parent.hasTransform());
                        return t.node = o,
                        s
                    }
                } else this.support.rangeBounds && !t.parent.hasTransform() || (t.node = t.node.splitText(e.length));
                return {}
            }
        },
        W.prototype.getWrapperBounds = function(t, e) {
            var i = t.ownerDocument.createElement("html2canvaswrapper"),
            r = t.parentNode,
            n = t.cloneNode(!0);
            i.appendChild(t.cloneNode(!0)),
            r.replaceChild(i, t);
            var o = e ? V(i) : z(i);
            return r.replaceChild(n, i),
            o
        },
        W.prototype.getRangeBounds = function(t, e, i) {
            var r = this.range || (this.range = t.ownerDocument.createRange());
            return r.setStart(t, e),
            r.setEnd(t, e + i),
            r.getBoundingClientRect()
        },
        W.prototype.parse = function(t) {
            var e = t.contexts.filter(tt),
            i = t.children.filter(pt),
            r = i.filter(dt(ut)),
            n = r.filter(dt(lt)).filter(dt(rt)),
            o = i.filter(dt(lt)).filter(ut),
            s = r.filter(dt(lt)).filter(rt),
            a = t.contexts.concat(r.filter(lt)).filter(it),
            h = t.children.filter(mt).filter(ot),
            c = t.contexts.filter(et);
            e.concat(n).concat(o).concat(s).concat(a).concat(h).concat(c).forEach(function(t) {
                this.renderQueue.push(t),
                nt(t) && (this.parse(t), this.renderQueue.push(new U))
            },
            this)
        },
        W.prototype.paint = function(t) {
            try {
                t instanceof U ? this.renderer.ctx.restore() : mt(t) ? (gt(t.parent) && t.parent.appendToDOM(), this.paintText(t), gt(t.parent) && t.parent.cleanDOM()) : this.paintNode(t)
            } catch(t) {
                if (D(t), this.options.strict) throw t
            }
        },
        W.prototype.paintNode = function(t) {
            nt(t) && (this.renderer.setOpacity(t.opacity), this.renderer.ctx.save(), t.hasTransform() && this.renderer.setTransform(t.parseTransform())),
            "INPUT" === t.node.nodeName && "checkbox" === t.node.type ? this.paintCheckbox(t) : "INPUT" === t.node.nodeName && "radio" === t.node.type ? this.paintRadio(t) : this.paintElement(t)
        },
        W.prototype.paintElement = function(t) {
            var e = t.parseBounds();
            this.renderer.clip(t.backgroundClip,
            function() {
                this.renderer.renderBackground(t, e, t.borders.borders.map(wt))
            },
            this),
            this.renderer.clip(t.clip,
            function() {
                this.renderer.renderBorders(t.borders.borders)
            },
            this),
            this.renderer.clip(t.backgroundClip,
            function() {
                switch (t.node.nodeName) {
                case "svg":
                case "IFRAME":
                    var i = this.images.get(t.node);
                    i ? this.renderer.renderImage(t, e, t.borders, i) : D("Error loading <" + t.node.nodeName + ">", t.node);
                    break;
                case "VIDEO":
                    var r = {
                        image: t.node,
                        src: t.node.src || "",
                        tainted: !1,
                        promise: function() {}
                    };
                    this.renderer.renderImage(t, e, t.borders, r);
                    break;
                case "IMG":
                    (r = this.images.get(t.node.src)) ? this.renderer.renderImage(t, e, t.borders, r) : D("Error loading <img>", t.node.src);
                    break;
                case "CANVAS":
                    this.renderer.renderImage(t, e, t.borders, {
                        image: t.node
                    });
                    break;
                case "SELECT":
                case "INPUT":
                case "TEXTAREA":
                    this.paintFormValue(t)
                }
            },
            this)
        },
        W.prototype.paintCheckbox = function(t) {
            var e = t.parseBounds(),
            i = Math.min(e.width, e.height),
            r = {
                width: i - 1,
                height: i - 1,
                top: e.top,
                left: e.left
            },
            n = [3, 3],
            o = [n, n, n, n],
            s = [1, 1, 1, 1].map(function(t) {
                return {
                    color: new T("#A5A5A5"),
                    width: t
                }
            }),
            a = $(r, o, s);
            this.renderer.clip(t.backgroundClip,
            function() {
                this.renderer.rectangle(r.left + 1, r.top + 1, r.width - 2, r.height - 2, new T("#DEDEDE")),
                this.renderer.renderBorders(q(s, r, a, o)),
                t.node.checked && (this.renderer.font(new T("#424242"), "normal", "normal", "bold", i - 3 + "px", "arial"), this.renderer.text("✔", r.left + i / 6, r.top + i - 1))
            },
            this)
        },
        W.prototype.paintRadio = function(t) {
            var e = t.parseBounds(),
            i = Math.min(e.width, e.height) - 2;
            this.renderer.clip(t.backgroundClip,
            function() {
                this.renderer.circleStroke(e.left + 1, e.top + 1, i, new T("#DEDEDE"), 1, new T("#A5A5A5")),
                t.node.checked && this.renderer.circle(Math.ceil(e.left + i / 4) + 1, Math.ceil(e.top + i / 4) + 1, Math.floor(i / 2), new T("#424242"))
            },
            this)
        },
        W.prototype.paintFormValue = function(t) {
            var e = t.getValue();
            if (e.length > 0) {
                var i = t.node.ownerDocument,
                r = i.createElement("html2canvaswrapper"); ["lineHeight", "textAlign", "fontFamily", "fontWeight", "fontSize", "color", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom", "width", "height", "borderLeftStyle", "borderTopStyle", "borderLeftWidth", "borderTopWidth", "boxSizing", "whiteSpace", "wordWrap"].forEach(function(e) {
                    try {
                        r.style[e] = t.css(e)
                    } catch(t) {
                        D("html2canvas: Parse: Exception caught in renderFormValue: " + t.message)
                    }
                });
                var n = t.parseBounds();
                r.style.position = "fixed",
                r.style.left = n.left + "px",
                r.style.top = n.top + "px",
                r.textContent = e,
                i.body.appendChild(r),
                this.paintText(new Xt(r.firstChild, t)),
                i.body.removeChild(r)
            }
        },
        W.prototype.paintText = function(e) {
            e.applyTextTransform();
            var i = t.html2canvas.punycode.ucs2.decode(e.node.data),
            r = this.options.letterRendering && !st(e) || kt(e.node.data) ? i.map(function(e) {
                return t.html2canvas.punycode.ucs2.encode([e])
            }) : Tt(i),
            n = e.parent.fontWeight(),
            o = e.parent.css("fontSize"),
            s = e.parent.css("fontFamily"),
            a = e.parent.parseTextShadows();
            this.renderer.font(e.parent.color("color"), e.parent.css("fontStyle"), e.parent.css("fontVariant"), n, o, s),
            a.length ? this.renderer.fontShadow(a[0].color, a[0].offsetX, a[0].offsetY, a[0].blur) : this.renderer.clearShadow(),
            this.renderer.clip(e.parent.clip,
            function() {
                r.map(this.parseTextBounds(e), this).forEach(function(t, i) {
                    t && (this.renderer.text(r[i], t.left, t.bottom), this.renderTextDecoration(e.parent, t, this.fontMetrics.getMetrics(s, o)))
                },
                this)
            },
            this)
        },
        W.prototype.renderTextDecoration = function(t, e, i) {
            switch (t.css("textDecoration").split(" ")[0]) {
            case "underline":
                this.renderer.rectangle(e.left, Math.round(e.top + i.baseline + i.lineWidth), e.width, 1, t.color("color"));
                break;
            case "overline":
                this.renderer.rectangle(e.left, Math.round(e.top), e.width, 1, t.color("color"));
                break;
            case "line-through":
                this.renderer.rectangle(e.left, Math.ceil(e.top + i.middle + i.lineWidth), e.width, 1, t.color("color"))
            }
        };
        var ie = {
            inset: [["darken", .6], ["darken", .1], ["darken", .1], ["darken", .6]]
        };
        W.prototype.parseBorders = function(t) {
            var e = t.parseBounds(),
            i = at(t),
            r = ["Top", "Right", "Bottom", "Left"].map(function(e, i) {
                var r = t.css("border" + e + "Style"),
                n = t.color("border" + e + "Color");
                "inset" === r && n.isBlack() && (n = new T([255, 255, 255, n.a]));
                var o = ie[r] ? ie[r][i] : null;
                return {
                    width: t.cssInt("border" + e + "Width"),
                    color: o ? n[o[0]](o[1]) : n,
                    args: null
                }
            }),
            n = $(e, i, r);
            return {
                clip: this.parseBackgroundClip(t, n, r, i, e),
                borders: q(r, e, n, i)
            }
        },
        W.prototype.parseBackgroundClip = function(t, e, i, r, n) {
            var o = [];
            switch (t.css("backgroundClip")) {
            case "content-box":
            case "padding-box":
                Z(o, r[0], r[1], e.topLeftInner, e.topRightInner, n.left + i[3].width, n.top + i[0].width),
                Z(o, r[1], r[2], e.topRightInner, e.bottomRightInner, n.left + n.width - i[1].width, n.top + i[0].width),
                Z(o, r[2], r[3], e.bottomRightInner, e.bottomLeftInner, n.left + n.width - i[1].width, n.top + n.height - i[2].width),
                Z(o, r[3], r[0], e.bottomLeftInner, e.topLeftInner, n.left + i[3].width, n.top + n.height - i[2].width);
                break;
            default:
                Z(o, r[0], r[1], e.topLeftOuter, e.topRightOuter, n.left, n.top),
                Z(o, r[1], r[2], e.topRightOuter, e.bottomRightOuter, n.left + n.width, n.top),
                Z(o, r[2], r[3], e.bottomRightOuter, e.bottomLeftOuter, n.left + n.width, n.top + n.height),
                Z(o, r[3], r[0], e.bottomLeftOuter, e.topLeftOuter, n.left, n.top + n.height)
            }
            return o
        };
        var re = 0,
        ne = "withCredentials" in new XMLHttpRequest,
        oe = "crossOrigin" in new Image;
        Dt.prototype.cloneTo = function(t) {
            Dt.prototype.cloneTo.call(this, t),
            t.isPseudoElement = !0,
            t.before = this.before
        },
        (Dt.prototype = Object.create(L.prototype)).appendToDOM = function() {
            this.before ? this.parent.node.insertBefore(this.node, this.parent.node.firstChild) : this.parent.node.appendChild(this.node),
            this.parent.node.className += " " + this.getHideClass()
        },
        Dt.prototype.cleanDOM = function() {
            this.node.parentNode.removeChild(this.node),
            this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "")
        },
        Dt.prototype.getHideClass = function() {
            return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE": "AFTER")]
        },
        Dt.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before",
        Dt.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after",
        Lt.prototype.renderImage = function(t, e, i, r) {
            var n = t.cssInt("paddingLeft"),
            o = t.cssInt("paddingTop"),
            s = t.cssInt("paddingRight"),
            a = t.cssInt("paddingBottom"),
            h = i.borders,
            c = e.width - (h[1].width + h[3].width + n + s),
            l = e.height - (h[0].width + h[2].width + o + a);
            this.drawImage(r, 0, 0, r.image.width || r.image.clientWidth || c, r.image.height || r.image.clientHeight || l, e.left + n + h[3].width, e.top + o + h[0].width, c, l)
        },
        Lt.prototype.renderBackground = function(t, e, i) {
            e.height > 0 && e.width > 0 && (this.renderBackgroundColor(t, e), this.renderBackgroundImage(t, e, i))
        },
        Lt.prototype.renderBackgroundColor = function(t, e) {
            var i = t.color("backgroundColor");
            i.isTransparent() || this.rectangle(e.left, e.top, e.width, e.height, i)
        },
        Lt.prototype.renderBorders = function(t) {
            t.forEach(this.renderBorder, this)
        },
        Lt.prototype.renderBorder = function(t) {
            t.color.isTransparent() || null === t.args || this.drawShape(t.args, t.color)
        },
        Lt.prototype.renderBackgroundImage = function(t, e, i) {
            t.parseBackgroundImages().reverse().forEach(function(r, n, o) {
                switch (r.method) {
                case "url":
                    var s = this.images.get(r.args[0]);
                    s ? this.renderBackgroundRepeating(t, e, s, o.length - (n + 1), i) : D("Error loading background-image", r.args[0]);
                    break;
                case "linear-gradient":
                case "gradient":
                    var a = this.images.get(r.value);
                    a ? this.renderBackgroundGradient(a, e, i) : D("Error loading background-image", r.args[0]);
                    break;
                case "none":
                    break;
                default:
                    D("Unknown background-image type", r.args[0])
                }
            },
            this)
        },
        Lt.prototype.renderBackgroundRepeating = function(t, e, i, r, n) {
            var o = t.parseBackgroundSize(e, i.image, r),
            s = t.parseBackgroundPosition(e, i.image, r, o);
            switch (t.parseBackgroundRepeat(r)) {
            case "repeat-x":
            case "repeat no-repeat":
                this.backgroundRepeatShape(i, s, o, e, e.left + n[3], e.top + s.top + n[0], 99999, o.height, n);
                break;
            case "repeat-y":
            case "no-repeat repeat":
                this.backgroundRepeatShape(i, s, o, e, e.left + s.left + n[3], e.top + n[0], o.width, 99999, n);
                break;
            case "no-repeat":
                this.backgroundRepeatShape(i, s, o, e, e.left + s.left + n[3], e.top + s.top + n[0], o.width, o.height, n);
                break;
            default:
                this.renderBackgroundRepeat(i, s, o, {
                    top: e.top,
                    left: e.left
                },
                n[3], n[0])
            }
        },
        (Rt.prototype = Object.create(L.prototype)).getParentStack = function(t) {
            var e = this.parent ? this.parent.stack: null;
            return e ? e.ownStacking ? e: e.getParentStack(t) : t.stack
        },
        Bt.prototype.testRangeBounds = function(t) {
            var e, i, r = !1;
            return t.createRange && (e = t.createRange()).getBoundingClientRect && ((i = t.createElement("boundtest")).style.height = "123px", i.style.display = "block", t.body.appendChild(i), e.selectNode(i), 123 === e.getBoundingClientRect().height && (r = !0), t.body.removeChild(i)),
            r
        },
        Bt.prototype.testCORS = function() {
            return void 0 !== (new Image).crossOrigin
        },
        Bt.prototype.testSVG = function() {
            var t = new Image,
            i = e.createElement("canvas"),
            r = i.getContext("2d");
            t.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
            try {
                r.drawImage(t, 0, 0),
                i.toDataURL()
            } catch(t) {
                return ! 1
            }
            return ! 0
        },
        Ft.prototype.hasFabric = function() {
            return html2canvas.fabric ? Promise.resolve() : Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg"))
        },
        Ft.prototype.inlineFormatting = function(t) {
            return /^data:image\/svg\+xml;base64,/.test(t) ? this.decode64(this.removeContentType(t)) : this.removeContentType(t)
        },
        Ft.prototype.removeContentType = function(t) {
            return t.replace(/^data:image\/svg\+xml(;base64)?,/, "")
        },
        Ft.prototype.isInline = function(t) {
            return /^data:image\/svg\+xml/i.test(t)
        },
        Ft.prototype.createCanvas = function(t) {
            var e = this;
            return function(i, r) {
                var n = new html2canvas.fabric.StaticCanvas("c");
                e.image = n.lowerCanvasEl,
                n.setWidth(r.width).setHeight(r.height).add(html2canvas.fabric.util.groupSVGElements(i, r)).renderAll(),
                t(n.lowerCanvasEl)
            }
        },
        Ft.prototype.decode64 = function(e) {
            return "function" == typeof t.atob ? t.atob(e) : Nt(e)
        },
        Gt.prototype = Object.create(Ft.prototype),
        (Xt.prototype = Object.create(L.prototype)).applyTextTransform = function() {
            this.node.data = this.transform(this.parent.css("textTransform"))
        },
        Xt.prototype.transform = function(t) {
            var e = this.node.data;
            switch (t) {
            case "lowercase":
                return e.toLowerCase();
            case "capitalize":
                return e.replace(/(^|\s|:|-|\(|\))([a-z])/g, zt);
            case "uppercase":
                return e.toUpperCase();
            default:
                return e
            }
        },
        Vt.prototype = Object.create(j.prototype),
        (Yt.prototype = Object.create(Lt.prototype)).setFillStyle = function(t) {
            return this.ctx.fillStyle = "object" == typeof t && t.isColor ? t.toString() : t,
            this.ctx
        },
        Yt.prototype.rectangle = function(t, e, i, r, n) {
            this.setFillStyle(n).fillRect(t, e, i, r)
        },
        Yt.prototype.circle = function(t, e, i, r) {
            this.setFillStyle(r),
            this.ctx.beginPath(),
            this.ctx.arc(t + i / 2, e + i / 2, i / 2, 0, 2 * Math.PI, !0),
            this.ctx.closePath(),
            this.ctx.fill()
        },
        Yt.prototype.circleStroke = function(t, e, i, r, n, o) {
            this.circle(t, e, i, r),
            this.ctx.strokeStyle = o.toString(),
            this.ctx.stroke()
        },
        Yt.prototype.drawShape = function(t, e) {
            this.shape(t),
            this.setFillStyle(e).fill()
        },
        Yt.prototype.taints = function(t) {
            if (null === t.tainted) {
                this.taintCtx.drawImage(t.image, 0, 0);
                try {
                    this.taintCtx.getImageData(0, 0, 1, 1),
                    t.tainted = !1
                } catch(i) {
                    this.taintCtx = e.createElement("canvas").getContext("2d"),
                    t.tainted = !0
                }
            }
            return t.tainted
        },
        Yt.prototype.drawImage = function(t, e, i, r, n, o, s, a, h) {
            "VIDEO" !== t.image.nodeName.toUpperCase() ? this.taints(t) && !this.options.allowTaint || this.ctx.drawImage(t.image, e, i, r, n, o, s, a, h) : this.ctx.drawImage(t.image, e, i, r, n, o, s, a, h)
        },
        Yt.prototype.clip = function(t, e, i) {
            this.ctx.save(),
            t.filter(Ht).forEach(function(t) {
                this.shape(t).clip()
            },
            this),
            e.call(i),
            this.ctx.restore()
        },
        Yt.prototype.shape = function(t) {
            return this.ctx.beginPath(),
            t.forEach(function(t, e) {
                "rect" === t[0] ? this.ctx.rect.apply(this.ctx, t.slice(1)) : this.ctx[0 === e ? "moveTo": t[0] + "To"].apply(this.ctx, t.slice(1))
            },
            this),
            this.ctx.closePath(),
            this.ctx
        },
        Yt.prototype.font = function(t, e, i, r, n, o) {
            this.setFillStyle(t).font = [e, i, r, n, o].join(" ").split(",")[0]
        },
        Yt.prototype.fontShadow = function(t, e, i, r) {
            this.setVariable("shadowColor", t.toString()).setVariable("shadowOffsetY", e).setVariable("shadowOffsetX", i).setVariable("shadowBlur", r)
        },
        Yt.prototype.clearShadow = function() {
            this.setVariable("shadowColor", "rgba(0,0,0,0)")
        },
        Yt.prototype.setOpacity = function(t) {
            this.ctx.globalAlpha = t
        },
        Yt.prototype.setTransform = function(t) {
            this.ctx.translate(t.origin[0], t.origin[1]),
            this.ctx.transform.apply(this.ctx, t.matrix),
            this.ctx.translate( - t.origin[0], -t.origin[1])
        },
        Yt.prototype.setVariable = function(t, e) {
            return this.variables[t] !== e && (this.variables[t] = this.ctx[t] = e),
            this
        },
        Yt.prototype.text = function(t, e, i) {
            this.ctx.fillText(t, e, i)
        },
        Yt.prototype.backgroundRepeatShape = function(t, e, i, r, n, o, s, a, h) {
            var c = [["line", Math.round(n), Math.round(o)], ["line", Math.round(n + s), Math.round(o)], ["line", Math.round(n + s), Math.round(a + o)], ["line", Math.round(n), Math.round(a + o)]];
            this.clip([c],
            function() {
                this.renderBackgroundRepeat(t, e, i, r, h[3], h[0])
            },
            this)
        },
        Yt.prototype.renderBackgroundRepeat = function(t, e, i, r, n, o) {
            var s = Math.round(r.left + e.left + n),
            a = Math.round(r.top + e.top + o);
            this.setFillStyle(this.ctx.createPattern(this.resizeImage(t, i), "repeat")),
            this.ctx.translate(s, a),
            this.ctx.fill(),
            this.ctx.translate( - s, -a)
        },
        Yt.prototype.renderBackgroundGradient = function(t, e) {
            if (t instanceof M) {
                var i = this.ctx.createLinearGradient(e.left + e.width * t.x0, e.top + e.height * t.y0, e.left + e.width * t.x1, e.top + e.height * t.y1);
                t.colorStops.forEach(function(t) {
                    i.addColorStop(t.stop, t.color.toString())
                }),
                this.rectangle(e.left, e.top, e.width, e.height, i)
            }
        },
        Yt.prototype.resizeImage = function(t, i) {
            var r = t.image;
            if (r.width === i.width && r.height === i.height) return r;
            var n = e.createElement("canvas");
            return n.width = i.width,
            n.height = i.height,
            n.getContext("2d").drawImage(r, 0, 0, r.width, r.height, 0, 0, i.width, i.height),
            n
        };
        var se = !!e.all;
        se || e.captureEvents(Event.MOUSEMOVE),
        e.addEventListener("mousemove",
        function(t) {
            return se ? (ae = event.clientX + e.body.scrollLeft, he = event.clientY + e.body.scrollTop) : (ae = t.pageX, he = t.pageY),
            ae < 0 && (ae = 0),
            he < 0 && (he = 0),
            !0
        },
        !1);
        var ae = 0,
        he = 0
    } else(t || module.exports).html2canvas = function() {
        return Promise.reject("No canvas support")
    }
}).call({},
"undefined" != typeof window ? window: void 0, "undefined" != typeof document ? document: void 0),
function(window, document, exports, undefined) {
    var fabric = fabric || {
        version: "1.4.11"
    };
    void 0 !== exports && (exports.fabric = fabric),
    void 0 !== document && void 0 !== window ? (fabric.document = document, fabric.window = window) : (fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>"), fabric.window = fabric.document.createWindow()),
    fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement,
    fabric.isLikelyNode = "undefined" != typeof Buffer && void 0 === window,
    fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width"],
    fabric.DPI = 96;
    var Cufon = function() {
        function t(t) {
            var e = this.face = t.face;
            this.glyphs = t.glyphs,
            this.w = t.w,
            this.baseSize = parseInt(e["units-per-em"], 10),
            this.family = e["font-family"].toLowerCase(),
            this.weight = e["font-weight"],
            this.style = e["font-style"] || "normal",
            this.viewBox = function() {
                var t = e.bbox.split(/\s+/),
                i = {
                    minX: parseInt(t[0], 10),
                    minY: parseInt(t[1], 10),
                    maxX: parseInt(t[2], 10),
                    maxY: parseInt(t[3], 10)
                };
                return i.width = i.maxX - i.minX,
                i.height = i.maxY - i.minY,
                i.toString = function() {
                    return [this.minX, this.minY, this.width, this.height].join(" ")
                },
                i
            } (),
            this.ascent = -parseInt(e.ascent, 10),
            this.descent = -parseInt(e.descent, 10),
            this.height = -this.ascent + this.descent
        }
        function e() {
            var t = {},
            e = {
                oblique: "italic",
                italic: "oblique"
            };
            this.add = function(e) { (t[e.style] || (t[e.style] = {}))[e.weight] = e
            },
            this.get = function(i, r) {
                var n = t[i] || t[e[i]] || t.normal || t.italic || t.oblique;
                if (!n) return null;
                if (r = {
                    normal: 400,
                    bold: 700
                } [r] || parseInt(r, 10), n[r]) return n[r];
                var o, s, a = {
                    1 : 1,
                    99 : 0
                } [r % 100],
                h = [];
                a === undefined && (a = r > 400),
                500 == r && (r = 400);
                for (var c in n) c = parseInt(c, 10),
                (!o || c < o) && (o = c),
                (!s || c > s) && (s = c),
                h.push(c);
                return r < o && (r = o),
                r > s && (r = s),
                h.sort(function(t, e) {
                    return (a ? t > r && e > r ? t < e: t > e: t < r && e < r ? t > e: t < e) ? -1 : 1
                }),
                n[h[0]]
            }
        }
        function i(t) {
            var e = {},
            i = {};
            this.get = function(i) {
                return e[i] != undefined ? e[i] : t[i]
            },
            this.getSize = function(t, e) {
                return i[t] || (i[t] = new d.Size(this.get(t), e))
            },
            this.extend = function(t) {
                for (var i in t) e[i] = t[i];
                return this
            }
        }
        function r(t, e, i) {
            t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent && t.attachEvent("on" + e,
            function() {
                return i.call(t, fabric.window.event)
            })
        }
        function n(t, e) {
            var i = g.get(t);
            return i.options ? t: (e.hover && e.hoverables[t.nodeName.toLowerCase()] && m.attach(t), i.options = e, t)
        }
        function o(t) {
            var e = {};
            return function(i) {
                return e.hasOwnProperty(i) || (e[i] = t.apply(null, arguments)),
                e[i]
            }
        }
        function s(t, e) {
            e || (e = d.getStyle(t));
            for (var i, r = d.quotedList(e.get("fontFamily").toLowerCase()), n = 0, o = r.length; n < o; ++n) if (i = r[n], y[i]) return y[i].get(e.get("fontStyle"), e.get("fontWeight"));
            return null
        }
        function a(t) {
            return fabric.document.getElementsByTagName(t)
        }
        function h() {
            for (var t, e = {},
            i = 0,
            r = arguments.length; i < r; ++i) for (t in arguments[i]) e[t] = arguments[i][t];
            return e
        }
        function c(t, e, i, r, n, o) {
            var s = r.separate;
            if ("none" == s) return b[r.engine].apply(null, arguments);
            var a, h = fabric.document.createDocumentFragment(),
            c = e.split(w[s]),
            l = "words" == s;
            l && p && (/^\s/.test(e) && c.unshift(""), /\s$/.test(e) && c.push(""));
            for (var u = 0,
            f = c.length; u < f; ++u)(a = b[r.engine](t, l ? d.textAlign(c[u], i, u, f) : c[u], i, r, n, o, u < f - 1)) && h.appendChild(a);
            return h
        }
        function l(t, e) {
            for (var i, r, o, a, h = n(t, e).firstChild; h; h = o) {
                if (o = h.nextSibling, a = !1, 1 == h.nodeType) {
                    if (!h.firstChild) continue;
                    if (!/cufon/.test(h.className)) {
                        arguments.callee(h, e);
                        continue
                    }
                    a = !0
                }
                if (r || (r = d.getStyle(t).extend(e)), i || (i = s(t, r)), i) if (a) b[e.engine](i, null, r, e, h, t);
                else {
                    var l = h.data;
                    if ("undefined" != typeof G_vmlCanvasManager && (l = l.replace(/\r/g, "\n")), "" !== l) {
                        var u = c(i, l, r, e, h, t);
                        u ? h.parentNode.replaceChild(u, h) : h.parentNode.removeChild(h)
                    }
                }
            }
        }
        var u = function() {
            return u.replace.apply(null, arguments)
        },
        f = u.DOM = {
            ready: function() {
                var t = !1,
                e = {
                    loaded: 1,
                    complete: 1
                },
                i = [],
                n = function() {
                    if (!t) {
                        t = !0;
                        for (var e; e = i.shift(); e());
                    }
                };
                return fabric.document.addEventListener && (fabric.document.addEventListener("DOMContentLoaded", n, !1), fabric.window.addEventListener("pageshow", n, !1)),
                !fabric.window.opera && fabric.document.readyState &&
                function() {
                    e[fabric.document.readyState] ? n() : setTimeout(arguments.callee, 10)
                } (),
                fabric.document.readyState && fabric.document.createStyleSheet &&
                function() {
                    try {
                        fabric.document.body.doScroll("left"),
                        n()
                    } catch(t) {
                        setTimeout(arguments.callee, 1)
                    }
                } (),
                r(fabric.window, "load", n),
                function(e) {
                    arguments.length ? t ? e() : i.push(e) : n()
                }
            } ()
        },
        d = u.CSS = {
            Size: function(t, e) {
                this.value = parseFloat(t),
                this.unit = String(t).match(/[a-z%]*$/)[0] || "px",
                this.convert = function(t) {
                    return t / e * this.value
                },
                this.convertFrom = function(t) {
                    return t / this.value * e
                },
                this.toString = function() {
                    return this.value + this.unit
                }
            },
            getStyle: function(t) {
                return new i(t.style)
            },
            quotedList: o(function(t) {
                for (var e, i = [], r = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g; e = r.exec(t);) i.push(e[3] || e[1]);
                return i
            }),
            ready: function() {
                var t = !1,
                e = [],
                i = function() {
                    t = !0;
                    for (var i; i = e.shift(); i());
                },
                r = Object.prototype.propertyIsEnumerable ? a("style") : {
                    length: 0
                },
                n = a("link");
                return f.ready(function() {
                    for (var t, e = 0,
                    o = 0,
                    s = n.length; t = n[o], o < s; ++o) t.disabled || "stylesheet" != t.rel.toLowerCase() || ++e;
                    fabric.document.styleSheets.length >= r.length + e ? i() : setTimeout(arguments.callee, 10)
                }),
                function(i) {
                    t ? i() : e.push(i)
                }
            } (),
            supports: function(t, e) {
                var i = fabric.document.createElement("span").style;
                return i[t] !== undefined && (i[t] = e, i[t] === e)
            },
            textAlign: function(t, e, i, r) {
                return "right" == e.get("textAlign") ? i > 0 && (t = " " + t) : i < r - 1 && (t += " "),
                t
            },
            textDecoration: function(t, e) {
                e || (e = this.getStyle(t));
                for (var i = {
                    underline: null,
                    overline: null,
                    "line-through": null
                },
                r = t; r.parentNode && 1 == r.parentNode.nodeType;) {
                    var n = !0;
                    for (var o in i) i[o] || ( - 1 != e.get("textDecoration").indexOf(o) && (i[o] = e.get("color")), n = !1);
                    if (n) break;
                    e = this.getStyle(r = r.parentNode)
                }
                return i
            },
            textShadow: o(function(t) {
                if ("none" == t) return null;
                for (var e, i = [], r = {},
                n = 0, o = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/gi; e = o.exec(t);)"," == e[0] ? (i.push(r), r = {},
                n = 0) : e[1] ? r.color = e[1] : r[["offX", "offY", "blur"][n++]] = e[2];
                return i.push(r),
                i
            }),
            color: o(function(t) {
                var e = {};
                return e.color = t.replace(/^rgba\((.*?),\s*([\d.]+)\)/,
                function(t, i, r) {
                    return e.opacity = parseFloat(r),
                    "rgb(" + i + ")"
                }),
                e
            }),
            textTransform: function(t, e) {
                return t[{
                    uppercase: "toUpperCase",
                    lowercase: "toLowerCase"
                } [e.get("textTransform")] || "toString"]()
            }
        },
        p = 0 == " ".split(/\s+/).length,
        g = new
        function() {
            function t(t) {
                return t.cufid || (t.cufid = ++i)
            }
            var e = {},
            i = 0;
            this.get = function(i) {
                var r = t(i);
                return e[r] || (e[r] = {})
            }
        },
        m = new
        function() {
            function t(t, e) {
                return t.contains ? t.contains(e) : 16 & t.compareDocumentPosition(e)
            }
            function e(e) {
                var i = e.relatedTarget;
                i && !t(this, i) && n(this)
            }
            function i(t) {
                n(this)
            }
            function n(t) {
                setTimeout(function() {
                    u.replace(t, g.get(t).options, !0)
                },
                10)
            }
            this.attach = function(t) {
                t.onmouseenter === undefined ? (r(t, "mouseover", e), r(t, "mouseout", e)) : (r(t, "mouseenter", i), r(t, "mouseleave", i))
            }
        },
        v = [],
        b = {},
        y = {},
        x = {
            engine: null,
            hover: !1,
            hoverables: {
                a: !0
            },
            printable: !0,
            selector: fabric.window.Sizzle || fabric.window.jQuery &&
            function(t) {
                return jQuery(t)
            } || fabric.window.dojo && dojo.query || fabric.window.$$ &&
            function(t) {
                return $$(t)
            } || fabric.window.$ &&
            function(t) {
                return $(t)
            } || fabric.document.querySelectorAll &&
            function(t) {
                return fabric.document.querySelectorAll(t)
            } || a,
            separate: "words",
            textShadow: "none"
        },
        w = {
            words: /\s+/,
            characters: ""
        };
        return u.now = function() {
            return f.ready(),
            u
        },
        u.refresh = function() {
            for (var t = v.splice(0, v.length), e = 0, i = t.length; e < i; ++e) u.replace.apply(null, t[e]);
            return u
        },
        u.registerEngine = function(t, e) {
            return e ? (b[t] = e, u.set("engine", t)) : u
        },
        u.registerFont = function(i) {
            var r = new t(i),
            n = r.family;
            return y[n] || (y[n] = new e),
            y[n].add(r),
            u.set("fontFamily", '"' + n + '"')
        },
        u.replace = function(t, e, i) {
            return (e = h(x, e)).engine ? ("string" == typeof e.textShadow && e.textShadow && (e.textShadow = d.textShadow(e.textShadow)), i || v.push(arguments), (t.nodeType || "string" == typeof t) && (t = [t]), d.ready(function() {
                for (var i = 0,
                r = t.length; i < r; ++i) {
                    var n = t[i];
                    "string" == typeof n ? u.replace(e.selector(n), e, !0) : l(n, e)
                }
            }), u) : u
        },
        u.replaceElement = function(t, e) {
            return "string" == typeof(e = h(x, e)).textShadow && e.textShadow && (e.textShadow = d.textShadow(e.textShadow)),
            l(t, e)
        },
        u.engines = b,
        u.fonts = y,
        u.getOptions = function() {
            return h(x)
        },
        u.set = function(t, e) {
            return x[t] = e,
            u
        },
        u
    } ();
    Cufon.registerEngine("canvas",
    function() {
        function t(t, e) {
            var i, r = 0,
            n = 0,
            o = [],
            s = /([mrvxe])([^a-z]*)/g;
            t: for (var a = 0; i = s.exec(t); ++a) {
                var h = i[2].split(",");
                switch (i[1]) {
                case "v":
                    o[a] = {
                        m: "bezierCurveTo",
                        a: [r + ~~h[0], n + ~~h[1], r + ~~h[2], n + ~~h[3], r += ~~h[4], n += ~~h[5]]
                    };
                    break;
                case "r":
                    o[a] = {
                        m: "lineTo",
                        a: [r += ~~h[0], n += ~~h[1]]
                    };
                    break;
                case "m":
                    o[a] = {
                        m: "moveTo",
                        a: [r = ~~h[0], n = ~~h[1]]
                    };
                    break;
                case "x":
                    o[a] = {
                        m: "closePath",
                        a: []
                    };
                    break;
                case "e":
                    break t
                }
                e[o[a].m].apply(e, o[a].a)
            }
            return o
        }
        function e(t, e) {
            for (var i = 0,
            r = t.length; i < r; ++i) {
                var n = t[i];
                e[n.m].apply(e, n.a)
            }
        }
        var i = Cufon.CSS.supports("display", "inline-block"),
        r = !i && ("BackCompat" == fabric.document.compatMode || /frameset|transitional/i.test(fabric.document.doctype.publicId)),
        n = fabric.document.createElement("style");
        n.type = "text/css";
        var o = fabric.document.createTextNode(".cufon-canvas{text-indent:0}@media screen,projection{.cufon-canvas{display:inline;display:inline-block;position:relative;vertical-align:middle" + (r ? "": ";font-size:1px;line-height:1px") + "}.cufon-canvas .cufon-alt{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden}" + (i ? ".cufon-canvas canvas{position:relative}": ".cufon-canvas canvas{position:absolute}") + "}@media print{.cufon-canvas{padding:0 !important}.cufon-canvas canvas{display:none}.cufon-canvas .cufon-alt{display:inline}}");
        try {
            n.appendChild(o)
        } catch(t) {
            n.setAttribute("type", "text/css"),
            n.styleSheet.cssText = o.data
        }
        return fabric.document.getElementsByTagName("head")[0].appendChild(n),
        function(r, n, o, s, a, h) {
            function c(i) {
                W.fillStyle = i || Cufon.textOptions.color || o.get("color");
                var n = 0,
                a = 0;
                "right" === s.textAlign ? W.translate(I[a], 0) : "center" === s.textAlign && W.translate(I[a] / 2, 0);
                for (var h = 0,
                c = _.length; h < c; ++h) if ("\n" !== _[h]) {
                    var l = r.glyphs[_[h]] || r.missingGlyph;
                    if (l) {
                        var u = Number(l.w || r.w) + d;
                        U && (W.save(), W.strokeStyle = W.fillStyle, W.lineWidth += W.lineWidth, W.beginPath(), U.underline && (W.moveTo(0, .5 - r.face["underline-position"]), W.lineTo(u, .5 - r.face["underline-position"])), U.overline && (W.moveTo(0, r.ascent + .5), W.lineTo(u, r.ascent + .5)), U["line-through"] && (W.moveTo(0, .5 - r.descent), W.lineTo(u, .5 - r.descent)), W.stroke(), W.restore()),
                        q && (W.save(), W.transform(1, 0, -.25, 1, 0, 0)),
                        W.beginPath(),
                        l.d && (l.code ? e(l.code, W) : l.code = t("m" + l.d, W)),
                        W.fill(),
                        s.strokeStyle && (W.closePath(), W.save(), W.lineWidth = s.strokeWidth, W.strokeStyle = s.strokeStyle, W.stroke(), W.restore()),
                        q && W.restore(),
                        W.translate(u, 0),
                        n += u
                    }
                } else {
                    a++;
                    var f = -r.ascent - r.ascent / 5 * s.lineHeight;
                    "right" === s.textAlign ? (W.translate( - T, f), W.translate(I[a], 0)) : "center" === s.textAlign ? (W.translate( - n - I[a - 1] / 2, f), W.translate(I[a] / 2, 0)) : W.translate( - n, f),
                    n = 0
                }
            }
            var l = null === n,
            u = r.viewBox,
            f = o.getSize("fontSize", r.baseSize),
            d = o.get("letterSpacing");
            d = "normal" == d ? 0 : f.convertFrom(parseInt(d, 10));
            var p = 0,
            g = 0,
            m = 0,
            v = s.textShadow,
            b = [];
            if (Cufon.textOptions.shadowOffsets = [], Cufon.textOptions.shadows = null, v) {
                Cufon.textOptions.shadows = v;
                for (var y = 0,
                x = v.length; y < x; ++y) {
                    var w = v[y],
                    S = f.convertFrom(parseFloat(w.offX)),
                    C = f.convertFrom(parseFloat(w.offY));
                    b[y] = [S, C]
                }
            }
            for (var _ = Cufon.CSS.textTransform(l ? a.alt: n, o).split(""), T = 0, O = null, k = 0, E = 1, A = [], y = 0, x = _.length; y < x; ++y) if ("\n" !== _[y]) {
                var j = r.glyphs[_[y]] || r.missingGlyph;
                j && (T += O = Number(j.w || r.w) + d)
            } else E++,
            T > k && (k = T),
            A.push(T),
            T = 0;
            A.push(T),
            T = Math.max(k, T);
            for (var I = [], y = A.length; y--;) I[y] = T - A[y];
            if (null === O) return null;
            g += u.width - O,
            m += u.minX;
            var P, M;
            if (l) P = a,
            M = a.firstChild;
            else if (P = fabric.document.createElement("span"), P.className = "cufon cufon-canvas", P.alt = n, M = fabric.document.createElement("canvas"), P.appendChild(M), s.printable) {
                var D = fabric.document.createElement("span");
                D.className = "cufon-alt",
                D.appendChild(fabric.document.createTextNode(n)),
                P.appendChild(D)
            }
            var L = P.style,
            R = M.style || {},
            B = f.convert(u.height - p + 0),
            F = Math.ceil(B),
            N = F / B;
            M.width = Math.ceil(f.convert(T + g - m) * N),
            M.height = F,
            p += u.minY,
            R.top = Math.round(f.convert(p - r.ascent)) + "px",
            R.left = Math.round(f.convert(m)) + "px";
            var G = Math.ceil(f.convert(T * N)),
            X = G + "px",
            z = f.convert(r.height),
            V = (s.lineHeight - 1) * f.convert( - r.ascent / 5) * (E - 1);
            Cufon.textOptions.width = G,
            Cufon.textOptions.height = z * E + V,
            Cufon.textOptions.lines = E,
            Cufon.textOptions.totalLineHeight = V,
            i ? (L.width = X, L.height = z + "px") : (L.paddingLeft = X, L.paddingBottom = z - 1 + "px");
            var W = Cufon.textOptions.context || M.getContext("2d"),
            Y = F / u.height;
            Cufon.textOptions.fontAscent = r.ascent * Y,
            Cufon.textOptions.boundaries = null;
            for (var H = Cufon.textOptions.shadowOffsets,
            y = b.length; y--;) H[y] = [b[y][0] * Y, b[y][1] * Y];
            W.save(),
            W.scale(Y, Y),
            W.translate( - m - 1 / Y * M.width / 2 + (Cufon.fonts[r.family].offsetLeft || 0), -p - Cufon.textOptions.height / Y / 2 + (Cufon.fonts[r.family].offsetTop || 0)),
            W.lineWidth = r.face["underline-thickness"],
            W.save();
            var U = Cufon.getTextDecoration(s),
            q = "italic" === s.fontStyle;
            if (W.save(),
            function() {
                W.save();
                var t = 0,
                e = 0,
                i = [{
                    left: 0
                }];
                s.backgroundColor && (W.save(), W.fillStyle = s.backgroundColor, W.translate(0, r.ascent), W.fillRect(0, 0, T + 10, ( - r.ascent + r.descent) * E), W.restore()),
                "right" === s.textAlign ? (W.translate(I[e], 0), i[0].left = I[e] * Y) : "center" === s.textAlign && (W.translate(I[e] / 2, 0), i[0].left = I[e] / 2 * Y);
                for (var n = 0,
                o = _.length; n < o; ++n) if ("\n" !== _[n]) {
                    var a = r.glyphs[_[n]] || r.missingGlyph;
                    if (a) {
                        var h = Number(a.w || r.w) + d;
                        s.textBackgroundColor && (W.save(), W.fillStyle = s.textBackgroundColor, W.translate(0, r.ascent), W.fillRect(0, 0, h + 10, -r.ascent + r.descent), W.restore()),
                        W.translate(h, 0),
                        t += h,
                        n == o - 1 && (i[i.length - 1].width = t * Y, i[i.length - 1].height = ( - r.ascent + r.descent) * Y)
                    }
                } else {
                    e++;
                    var c = -r.ascent - r.ascent / 5 * s.lineHeight,
                    l = i[i.length - 1],
                    u = {
                        left: 0
                    };
                    l.width = t * Y,
                    l.height = ( - r.ascent + r.descent) * Y,
                    "right" === s.textAlign ? (W.translate( - T, c), W.translate(I[e], 0), u.left = I[e] * Y) : "center" === s.textAlign ? (W.translate( - t - I[e - 1] / 2, c), W.translate(I[e] / 2, 0), u.left = I[e] / 2 * Y) : W.translate( - t, c),
                    i.push(u),
                    t = 0
                }
                W.restore(),
                Cufon.textOptions.boundaries = i
            } (), v) for (var y = 0,
            x = v.length; y < x; ++y) {
                w = v[y];
                W.save(),
                W.translate.apply(W, b[y]),
                c(w.color),
                W.restore()
            }
            return c(),
            W.restore(),
            W.restore(),
            W.restore(),
            P
        }
    } ()),
    Cufon.registerEngine("vml",
    function() {
        function t(t, i) {
            return e(t, /(?:em|ex|%)$/i.test(i) ? "1em": i)
        }
        function e(t, e) {
            if (/px$/i.test(e)) return parseFloat(e);
            var i = t.style.left,
            r = t.runtimeStyle.left;
            t.runtimeStyle.left = t.currentStyle.left,
            t.style.left = e;
            var n = t.style.pixelLeft;
            return t.style.left = i,
            t.runtimeStyle.left = r,
            n
        }
        if (fabric.document.namespaces) {
            var i = fabric.document.createElement("canvas");
            if (! (i && i.getContext && i.getContext.apply)) {
                null == fabric.document.namespaces.cvml && fabric.document.namespaces.add("cvml", "urn:schemas-microsoft-com:vml");
                var r = fabric.document.createElement("cvml:shape");
                if (r.style.behavior = "url(#default#VML)", r.coordsize) return r = null,
                fabric.document.write('<style type="text/css">.cufon-vml-canvas{text-indent:0}@media screen{cvml\\:shape,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute}.cufon-vml-canvas{position:absolute;text-align:left}.cufon-vml{display:inline-block;position:relative;vertical-align:middle}.cufon-vml .cufon-alt{position:absolute;left:-10000in;font-size:1px}a .cufon-vml{cursor:pointer}}@media print{.cufon-vml *{display:none}.cufon-vml .cufon-alt{display:inline}}</style>'),
                function(i, r, n, o, s, a, h) {
                    var c = null === r;
                    c && (r = s.alt);
                    var l = i.viewBox,
                    u = n.computedFontSize || (n.computedFontSize = new Cufon.CSS.Size(t(a, n.get("fontSize")) + "px", i.baseSize)),
                    f = n.computedLSpacing;
                    f == undefined && (f = n.get("letterSpacing"), n.computedLSpacing = f = "normal" == f ? 0 : ~~u.convertFrom(e(a, f)));
                    var d, p;
                    if (c) d = s,
                    p = s.firstChild;
                    else {
                        if (d = fabric.document.createElement("span"), d.className = "cufon cufon-vml", d.alt = r, p = fabric.document.createElement("span"), p.className = "cufon-vml-canvas", d.appendChild(p), o.printable) {
                            var g = fabric.document.createElement("span");
                            g.className = "cufon-alt",
                            g.appendChild(fabric.document.createTextNode(r)),
                            d.appendChild(g)
                        }
                        h || d.appendChild(fabric.document.createElement("cvml:shape"))
                    }
                    var m = d.style,
                    v = p.style,
                    b = u.convert(l.height),
                    y = Math.ceil(b),
                    x = y / b,
                    w = l.minX,
                    S = l.minY;
                    v.height = y,
                    v.top = Math.round(u.convert(S - i.ascent)),
                    v.left = Math.round(u.convert(w)),
                    m.height = u.convert(i.height) + "px";
                    Cufon.getTextDecoration(o);
                    for (var C, _, T = n.get("color"), O = Cufon.CSS.textTransform(r, n).split(""), k = 0, E = 0, A = null, j = o.textShadow, I = 0, P = 0, M = O.length; I < M; ++I)(C = i.glyphs[O[I]] || i.missingGlyph) && (k += A = ~~ (C.w || i.w) + f);
                    if (null === A) return null;
                    var D, L = -w + k + (l.width - A),
                    R = u.convert(L * x),
                    B = Math.round(R),
                    F = L + "," + l.height,
                    N = "r" + F + "nsnf";
                    for (I = 0; I < M; ++I) if (C = i.glyphs[O[I]] || i.missingGlyph) {
                        c ? (_ = p.childNodes[P]).firstChild && _.removeChild(_.firstChild) : (_ = fabric.document.createElement("cvml:shape"), p.appendChild(_)),
                        _.stroked = "f",
                        _.coordsize = F,
                        _.coordorigin = D = w - E + "," + S,
                        _.path = (C.d ? "m" + C.d + "xe": "") + "m" + D + N,
                        _.fillcolor = T;
                        var G = _.style;
                        if (G.width = B, G.height = y, j) {
                            var X, z = j[0],
                            V = j[1],
                            W = Cufon.CSS.color(z.color),
                            Y = fabric.document.createElement("cvml:shadow");
                            Y.on = "t",
                            Y.color = W.color,
                            Y.offset = z.offX + "," + z.offY,
                            V && (X = Cufon.CSS.color(V.color), Y.type = "double", Y.color2 = X.color, Y.offset2 = V.offX + "," + V.offY),
                            Y.opacity = W.opacity || X && X.opacity || 1,
                            _.appendChild(Y)
                        }
                        E += ~~ (C.w || i.w) + f,
                        ++P
                    }
                    return m.width = Math.max(Math.ceil(u.convert(k * x)), 0),
                    d
                }
            }
        }
    } ()),
    Cufon.getTextDecoration = function(t) {
        return {
            underline: "underline" === t.textDecoration,
            overline: "overline" === t.textDecoration,
            "line-through": "line-through" === t.textDecoration
        }
    },
    void 0 !== exports && (exports.Cufon = Cufon),
    "object" != typeof JSON && (JSON = {}),
    function() {
        "use strict";
        function f(t) {
            return t < 10 ? "0" + t: t
        }
        function quote(t) {
            return escapable.lastIndex = 0,
            escapable.test(t) ? '"' + t.replace(escapable,
            function(t) {
                var e = meta[t];
                return "string" == typeof e ? e: "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice( - 4)
            }) + '"': '"' + t + '"'
        }
        function str(t, e) {
            var i, r, n, o, s, a = gap,
            h = e[t];
            switch (h && "object" == typeof h && "function" == typeof h.toJSON && (h = h.toJSON(t)), "function" == typeof rep && (h = rep.call(e, t, h)), typeof h) {
            case "string":
                return quote(h);
            case "number":
                return isFinite(h) ? String(h) : "null";
            case "boolean":
            case "null":
                return String(h);
            case "object":
                if (!h) return "null";
                if (gap += indent, s = [], "[object Array]" === Object.prototype.toString.apply(h)) {
                    for (o = h.length, i = 0; i < o; i += 1) s[i] = str(i, h) || "null";
                    return n = 0 === s.length ? "[]": gap ? "[\n" + gap + s.join(",\n" + gap) + "\n" + a + "]": "[" + s.join(",") + "]",
                    gap = a,
                    n
                }
                if (rep && "object" == typeof rep) for (o = rep.length, i = 0; i < o; i += 1)"string" == typeof rep[i] && (n = str(r = rep[i], h)) && s.push(quote(r) + (gap ? ": ": ":") + n);
                else for (r in h) Object.prototype.hasOwnProperty.call(h, r) && (n = str(r, h)) && s.push(quote(r) + (gap ? ": ": ":") + n);
                return n = 0 === s.length ? "{}": gap ? "{\n" + gap + s.join(",\n" + gap) + "\n" + a + "}": "{" + s.join(",") + "}",
                gap = a,
                n
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z": null
        },
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        });
        var cx, escapable, gap, indent, meta, rep;
        "function" != typeof JSON.stringify && (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        JSON.stringify = function(t, e, i) {
            var r;
            if (gap = "", indent = "", "number" == typeof i) for (r = 0; r < i; r += 1) indent += " ";
            else "string" == typeof i && (indent = i);
            if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
            return str("", {
                "": t
            })
        }),
        "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function(text, reviver) {
            function walk(t, e) {
                var i, r, n = t[e];
                if (n && "object" == typeof n) for (i in n) Object.prototype.hasOwnProperty.call(n, i) && ((r = walk(n, i)) !== undefined ? n[i] = r: delete n[i]);
                return reviver.call(t, e, n)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx,
            function(t) {
                return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice( - 4)
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"),
            "function" == typeof reviver ? walk({
                "": j
            },
            "") : j;
            throw new SyntaxError("JSON.parse")
        })
    } (),
    function() {
        function t(t, e) {
            this.__eventListeners[t] && (e ? fabric.util.removeFromArray(this.__eventListeners[t], e) : this.__eventListeners[t].length = 0)
        }
        function e(t, e) {
            if (this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length) for (var i in t) this.on(i, t[i]);
            else this.__eventListeners[t] || (this.__eventListeners[t] = []),
            this.__eventListeners[t].push(e);
            return this
        }
        function i(e, i) {
            if (this.__eventListeners) {
                if (0 === arguments.length) this.__eventListeners = {};
                else if (1 === arguments.length && "object" == typeof arguments[0]) for (var r in e) t.call(this, r, e[r]);
                else t.call(this, e, i);
                return this
            }
        }
        function r(t, e) {
            if (this.__eventListeners) {
                var i = this.__eventListeners[t];
                if (i) {
                    for (var r = 0,
                    n = i.length; r < n; r++) i[r].call(this, e || {});
                    return this
                }
            }
        }
        fabric.Observable = {
            observe: e,
            stopObserving: i,
            fire: r,
            on: e,
            off: i,
            trigger: r
        }
    } (),
    fabric.Collection = {
        add: function() {
            this._objects.push.apply(this._objects, arguments);
            for (var t = 0,
            e = arguments.length; t < e; t++) this._onObjectAdded(arguments[t]);
            return this.renderOnAddRemove && this.renderAll(),
            this
        },
        insertAt: function(t, e, i) {
            var r = this.getObjects();
            return i ? r[e] = t: r.splice(e, 0, t),
            this._onObjectAdded(t),
            this.renderOnAddRemove && this.renderAll(),
            this
        },
        remove: function() {
            for (var t, e = this.getObjects(), i = 0, r = arguments.length; i < r; i++) - 1 !== (t = e.indexOf(arguments[i])) && (e.splice(t, 1), this._onObjectRemoved(arguments[i]));
            return this.renderOnAddRemove && this.renderAll(),
            this
        },
        forEachObject: function(t, e) {
            for (var i = this.getObjects(), r = i.length; r--;) t.call(e, i[r], r, i);
            return this
        },
        getObjects: function(t) {
            return void 0 === t ? this._objects: this._objects.filter(function(e) {
                return e.type === t
            })
        },
        item: function(t) {
            return this.getObjects()[t]
        },
        isEmpty: function() {
            return 0 === this.getObjects().length
        },
        size: function() {
            return this.getObjects().length
        },
        contains: function(t) {
            return this.getObjects().indexOf(t) > -1
        },
        complexity: function() {
            return this.getObjects().reduce(function(t, e) {
                return t += e.complexity ? e.complexity() : 0
            },
            0)
        }
    },
    function(t) {
        var e = Math.sqrt,
        i = Math.atan2,
        r = Math.PI / 180;
        fabric.util = {
            removeFromArray: function(t, e) {
                var i = t.indexOf(e);
                return - 1 !== i && t.splice(i, 1),
                t
            },
            getRandomInt: function(t, e) {
                return Math.floor(Math.random() * (e - t + 1)) + t
            },
            degreesToRadians: function(t) {
                return t * r
            },
            radiansToDegrees: function(t) {
                return t / r
            },
            rotatePoint: function(t, e, i) {
                var r = Math.sin(i),
                n = Math.cos(i);
                t.subtractEquals(e);
                var o = t.x * n - t.y * r,
                s = t.x * r + t.y * n;
                return new fabric.Point(o, s).addEquals(e)
            },
            transformPoint: function(t, e, i) {
                return i ? new fabric.Point(e[0] * t.x + e[1] * t.y, e[2] * t.x + e[3] * t.y) : new fabric.Point(e[0] * t.x + e[1] * t.y + e[4], e[2] * t.x + e[3] * t.y + e[5])
            },
            invertTransform: function(t) {
                var e = t.slice(),
                i = 1 / (t[0] * t[3] - t[1] * t[2]);
                e = [i * t[3], -i * t[1], -i * t[2], i * t[0], 0, 0];
                var r = fabric.util.transformPoint({
                    x: t[4],
                    y: t[5]
                },
                e);
                return e[4] = -r.x,
                e[5] = -r.y,
                e
            },
            toFixed: function(t, e) {
                return parseFloat(Number(t).toFixed(e))
            },
            parseUnit: function(t) {
                var e = /\D{0,2}$/.exec(t),
                i = parseFloat(t);
                switch (e[0]) {
                case "mm":
                    return i * fabric.DPI / 25.4;
                case "cm":
                    return i * fabric.DPI / 2.54;
                case "in":
                    return i * fabric.DPI;
                case "pt":
                    return i * fabric.DPI / 72;
                case "pc":
                    return i * fabric.DPI / 72 * 12;
                default:
                    return i
                }
            },
            falseFunction: function() {
                return ! 1
            },
            getKlass: function(t, e) {
                return t = fabric.util.string.camelize(t.charAt(0).toUpperCase() + t.slice(1)),
                fabric.util.resolveNamespace(e)[t]
            },
            resolveNamespace: function(e) {
                if (!e) return fabric;
                for (var i = e.split("."), r = i.length, n = t || fabric.window, o = 0; o < r; ++o) n = n[i[o]];
                return n
            },
            loadImage: function(t, e, i, r) {
                if (t) {
                    var n = fabric.util.createImage();
                    n.onload = function() {
                        e && e.call(i, n),
                        n = n.onload = n.onerror = null
                    },
                    n.onerror = function() {
                        fabric.log("Error loading " + n.src),
                        e && e.call(i, null, !0),
                        n = n.onload = n.onerror = null
                    },
                    0 !== t.indexOf("data") && void 0 !== r && (n.crossOrigin = r),
                    n.src = t
                } else e && e.call(i, t)
            },
            enlivenObjects: function(t, e, i, r) {
                function n() {++s === a && e && e(o)
                }
                var o = [],
                s = 0,
                a = (t = t || []).length;
                a ? t.forEach(function(t, e) {
                    if (t && t.type) {
                        var s = fabric.util.getKlass(t.type, i);
                        s.async ? s.fromObject(t,
                        function(i, s) {
                            s || (o[e] = i, r && r(t, o[e])),
                            n()
                        }) : (o[e] = s.fromObject(t), r && r(t, o[e]), n())
                    } else n()
                }) : e && e(o)
            },
            groupSVGElements: function(t, e, i) {
                var r;
                return r = new fabric.PathGroup(t, e),
                void 0 !== i && r.setSourcePath(i),
                r
            },
            populateWithProperties: function(t, e, i) {
                if (i && "[object Array]" === Object.prototype.toString.call(i)) for (var r = 0,
                n = i.length; r < n; r++) i[r] in t && (e[i[r]] = t[i[r]])
            },
            drawDashedLine: function(t, r, n, o, s, a) {
                var h = o - r,
                c = s - n,
                l = e(h * h + c * c),
                u = i(c, h),
                f = a.length,
                d = 0,
                p = !0;
                for (t.save(), t.translate(r, n), t.moveTo(0, 0), t.rotate(u), r = 0; l > r;)(r += a[d++%f]) > l && (r = l),
                t[p ? "lineTo": "moveTo"](r, 0),
                p = !p;
                t.restore()
            },
            createCanvasElement: function(t) {
                return t || (t = fabric.document.createElement("canvas")),
                t.getContext || "undefined" == typeof G_vmlCanvasManager || G_vmlCanvasManager.initElement(t),
                t
            },
            createImage: function() {
                return fabric.isLikelyNode ? new(require("canvas").Image) : fabric.document.createElement("img")
            },
            createAccessors: function(t) {
                for (var e = t.prototype,
                i = e.stateProperties.length; i--;) {
                    var r = e.stateProperties[i],
                    n = r.charAt(0).toUpperCase() + r.slice(1),
                    o = "set" + n,
                    s = "get" + n;
                    e[s] || (e[s] = function(t) {
                        return new Function('return this.get("' + t + '")')
                    } (r)),
                    e[o] || (e[o] = function(t) {
                        return new Function("value", 'return this.set("' + t + '", value)')
                    } (r))
                }
            },
            clipContext: function(t, e) {
                e.save(),
                e.beginPath(),
                t.clipTo(e),
                e.clip()
            },
            multiplyTransformMatrices: function(t, e) {
                for (var i = [[t[0], t[2], t[4]], [t[1], t[3], t[5]], [0, 0, 1]], r = [[e[0], e[2], e[4]], [e[1], e[3], e[5]], [0, 0, 1]], n = [], o = 0; o < 3; o++) {
                    n[o] = [];
                    for (var s = 0; s < 3; s++) {
                        for (var a = 0,
                        h = 0; h < 3; h++) a += i[o][h] * r[h][s];
                        n[o][s] = a
                    }
                }
                return [n[0][0], n[1][0], n[0][1], n[1][1], n[0][2], n[1][2]]
            },
            getFunctionBody: function(t) {
                return (String(t).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
            },
            isTransparent: function(t, e, i, r) {
                r > 0 && (e > r ? e -= r: e = 0, i > r ? i -= r: i = 0);
                for (var n = !0,
                o = t.getImageData(e, i, 2 * r || 1, 2 * r || 1), s = 3, a = o.data.length; s < a && !1 != (n = o.data[s] <= 0); s += 4);
                return o = null,
                n
            }
        }
    } (void 0 !== exports ? exports: this),
    function() {
        function t(t, n, s, a, h, c, l) {
            var u = o.call(arguments);
            if (r[u]) return r[u];
            var f = Math.PI,
            d = l * (f / 180),
            p = Math.sin(d),
            g = Math.cos(d),
            m = 0,
            v = 0,
            b = -g * t - p * n,
            y = -g * n + p * t,
            x = (s = Math.abs(s)) * s,
            w = (a = Math.abs(a)) * a,
            S = y * y,
            C = b * b,
            _ = 4 * x * w - x * S - w * C,
            T = 0;
            if (_ < 0) {
                var O = Math.sqrt(1 - .25 * _ / (x * w));
                s *= O,
                a *= O
            } else T = (h === c ? -.5 : .5) * Math.sqrt(_ / (x * S + w * C));
            var k = T * s * y / a,
            E = -T * a * b / s,
            A = g * k - p * E + t / 2,
            j = p * k + g * E + n / 2,
            I = i(1, 0, (b - k) / s, (y - E) / a),
            P = i((b - k) / s, (y - E) / a, ( - b - k) / s, ( - y - E) / a);
            0 === c && P > 0 ? P -= 2 * f: 1 === c && P < 0 && (P += 2 * f);
            for (var M = Math.ceil(Math.abs(P / (.5 * f))), D = [], L = P / M, R = 8 / 3 * Math.sin(L / 4) * Math.sin(L / 4) / Math.sin(L / 2), B = I + L, F = 0; F < M; F++) D[F] = e(I, B, g, p, s, a, A, j, R, m, v),
            m = D[F][4],
            v = D[F][5],
            I += L,
            B += L;
            return r[u] = D,
            D
        }
        function e(t, e, i, r, s, a, h, c, l, u, f) {
            var d = o.call(arguments);
            if (n[d]) return n[d];
            var p = Math.cos(t),
            g = Math.sin(t),
            m = Math.cos(e),
            v = Math.sin(e),
            b = i * s * m - r * a * v + h,
            y = r * s * m + i * a * v + c,
            x = u + l * ( - i * s * g - r * a * p),
            w = f + l * ( - r * s * g + i * a * p),
            S = b + l * (i * s * v + r * a * m),
            C = y + l * (r * s * v - i * a * m);
            return n[d] = [x, w, S, C, b, y],
            n[d]
        }
        function i(t, e, i, r) {
            var n = Math.atan2(e, t),
            o = Math.atan2(r, i);
            return o >= n ? o - n: 2 * Math.PI - (n - o)
        }
        var r = {},
        n = {},
        o = Array.prototype.join;
        fabric.util.drawArc = function(e, i, r, n) {
            for (var o = n[0], s = n[1], a = n[2], h = n[3], c = n[4], l = [[], [], [], []], u = t(n[5] - i, n[6] - r, o, s, h, c, a), f = 0, d = u.length; f < d; f++) l[f][0] = u[f][0] + i,
            l[f][1] = u[f][1] + r,
            l[f][2] = u[f][2] + i,
            l[f][3] = u[f][3] + r,
            l[f][4] = u[f][4] + i,
            l[f][5] = u[f][5] + r,
            e.bezierCurveTo.apply(e, l[f])
        }
    } (),
    function() {
        function t(t, e, i) {
            if (t && 0 !== t.length) {
                var r = t.length - 1,
                n = e ? t[r][e] : t[r];
                if (e) for (; r--;) i(t[r][e], n) && (n = t[r][e]);
                else for (; r--;) i(t[r], n) && (n = t[r]);
                return n
            }
        }
        var e = Array.prototype.slice;
        fabric.util.array = {
            invoke: function(t, i) {
                for (var r = e.call(arguments, 2), n = [], o = 0, s = t.length; o < s; o++) n[o] = r.length ? t[o][i].apply(t[o], r) : t[o][i].call(t[o]);
                return n
            },
            min: function(e, i) {
                return t(e, i,
                function(t, e) {
                    return t < e
                })
            },
            max: function(e, i) {
                return t(e, i,
                function(t, e) {
                    return t >= e
                })
            }
        }
    } (),
    function() {
        function t(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }
        fabric.util.object = {
            extend: t,
            clone: function(e) {
                return t({},
                e)
            }
        }
    } (),
    function() {
        fabric.util.string = {
            camelize: function(t) {
                return t.replace(/-+(.)?/g,
                function(t, e) {
                    return e ? e.toUpperCase() : ""
                })
            },
            capitalize: function(t, e) {
                return t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase())
            },
            escapeXml: function(t) {
                return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }
        }
    } (),
    function() {
        function t() {}
        function e(t) {
            var e = this.constructor.superclass.prototype[t];
            return arguments.length > 1 ? e.apply(this, i.call(arguments, 1)) : e.call(this)
        }
        var i = Array.prototype.slice,
        r = function() {},
        n = function() {
            for (var t in {
                toString: 1
            }) if ("toString" === t) return ! 1;
            return ! 0
        } (),
        o = function(t, e, i) {
            for (var r in e) r in t.prototype && "function" == typeof t.prototype[r] && (e[r] + "").indexOf("callSuper") > -1 ? t.prototype[r] = function(t) {
                return function() {
                    var r = this.constructor.superclass;
                    this.constructor.superclass = i;
                    var n = e[t].apply(this, arguments);
                    if (this.constructor.superclass = r, "initialize" !== t) return n
                }
            } (r) : t.prototype[r] = e[r],
            n && (e.toString !== Object.prototype.toString && (t.prototype.toString = e.toString), e.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = e.valueOf))
        };
        fabric.util.createClass = function() {
            function n() {
                this.initialize.apply(this, arguments)
            }
            var s = null,
            a = i.call(arguments, 0);
            "function" == typeof a[0] && (s = a.shift()),
            n.superclass = s,
            n.subclasses = [],
            s && (t.prototype = s.prototype, n.prototype = new t, s.subclasses.push(n));
            for (var h = 0,
            c = a.length; h < c; h++) o(n, a[h], s);
            return n.prototype.initialize || (n.prototype.initialize = r),
            n.prototype.constructor = n,
            n.prototype.callSuper = e,
            n
        }
    } (),
    function() {
        function t(t) {
            var e, i, r = Array.prototype.slice.call(arguments, 1),
            n = r.length;
            for (i = 0; i < n; i++) if (e = typeof t[r[i]], !/^(?:function|object|unknown)$/.test(e)) return ! 1;
            return ! 0
        }
        function e(t, e) {
            return {
                handler: e,
                wrappedHandler: i(t, e)
            }
        }
        function i(t, e) {
            return function(i) {
                e.call(o(t), i || fabric.window.event)
            }
        }
        function r(t, e) {
            return function(i) {
                if (p[t] && p[t][e]) for (var r = p[t][e], n = 0, o = r.length; n < o; n++) r[n].call(this, i || fabric.window.event)
            }
        }
        function n(t, e, i) {
            var r = "touchend" === t.type ? "changedTouches": "touches";
            return t[r] && t[r][0] ? t[r][0][e] - (t[r][0][e] - t[r][0][i]) || t[i] : t[i]
        }
        var o, s, a = "unknown",
        h = function() {
            var t = 0;
            return function(e) {
                return e.__uniqueID || (e.__uniqueID = "uniqueID__" + t++)
            }
        } (); !
        function() {
            var t = {};
            o = function(e) {
                return t[e]
            },
            s = function(e, i) {
                t[e] = i
            }
        } ();
        var c, l, u = t(fabric.document.documentElement, "addEventListener", "removeEventListener") && t(fabric.window, "addEventListener", "removeEventListener"),
        f = t(fabric.document.documentElement, "attachEvent", "detachEvent") && t(fabric.window, "attachEvent", "detachEvent"),
        d = {},
        p = {};
        u ? (c = function(t, e, i) {
            t.addEventListener(e, i, !1)
        },
        l = function(t, e, i) {
            t.removeEventListener(e, i, !1)
        }) : f ? (c = function(t, i, r) {
            var n = h(t);
            s(n, t),
            d[n] || (d[n] = {}),
            d[n][i] || (d[n][i] = []);
            var o = e(n, r);
            d[n][i].push(o),
            t.attachEvent("on" + i, o.wrappedHandler)
        },
        l = function(t, e, i) {
            var r, n = h(t);
            if (d[n] && d[n][e]) for (var o = 0,
            s = d[n][e].length; o < s; o++)(r = d[n][e][o]) && r.handler === i && (t.detachEvent("on" + e, r.wrappedHandler), d[n][e][o] = null)
        }) : (c = function(t, e, i) {
            var n = h(t);
            if (p[n] || (p[n] = {}), !p[n][e]) {
                p[n][e] = [];
                var o = t["on" + e];
                o && p[n][e].push(o),
                t["on" + e] = r(n, e)
            }
            p[n][e].push(i)
        },
        l = function(t, e, i) {
            var r = h(t);
            if (p[r] && p[r][e]) for (var n = p[r][e], o = 0, s = n.length; o < s; o++) n[o] === i && n.splice(o, 1)
        }),
        fabric.util.addListener = c,
        fabric.util.removeListener = l;
        var g = function(t) {
            return typeof t.clientX !== a ? t.clientX: 0
        },
        m = function(t) {
            return typeof t.clientY !== a ? t.clientY: 0
        };
        fabric.isTouchSupported && (g = function(t) {
            return n(t, "pageX", "clientX")
        },
        m = function(t) {
            return n(t, "pageY", "clientY")
        }),
        fabric.util.getPointer = function(t, e) {
            t || (t = fabric.window.event);
            var i = t.target || (typeof t.srcElement !== a ? t.srcElement: null),
            r = fabric.util.getScrollLeftTop(i, e);
            return {
                x: g(t) + r.left,
                y: m(t) + r.top
            }
        },
        fabric.util.object.extend(fabric.util, fabric.Observable)
    } (),
    function() {
        var t = fabric.document.createElement("div"),
        e = "string" == typeof t.style.opacity,
        i = "string" == typeof t.style.filter,
        r = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
        n = function(t) {
            return t
        };
        e ? n = function(t, e) {
            return t.style.opacity = e,
            t
        }: i && (n = function(t, e) {
            var i = t.style;
            return t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1),
            r.test(i.filter) ? (e = e >= .9999 ? "": "alpha(opacity=" + 100 * e + ")", i.filter = i.filter.replace(r, e)) : i.filter += " alpha(opacity=" + 100 * e + ")",
            t
        }),
        fabric.util.setStyle = function(t, e) {
            var i = t.style;
            if (!i) return t;
            if ("string" == typeof e) return t.style.cssText += ";" + e,
            e.indexOf("opacity") > -1 ? n(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t;
            for (var r in e)"opacity" === r ? n(t, e[r]) : i["float" === r || "cssFloat" === r ? void 0 === i.styleFloat ? "cssFloat": "styleFloat": r] = e[r];
            return t
        }
    } (),
    function() {
        function t(t, e) {
            var i = fabric.document.createElement(t);
            for (var r in e)"class" === r ? i.className = e[r] : "for" === r ? i.htmlFor = e[r] : i.setAttribute(r, e[r]);
            return i
        }
        var e, i = Array.prototype.slice,
        r = function(t) {
            return i.call(t, 0)
        };
        try {
            e = r(fabric.document.childNodes) instanceof Array
        } catch(t) {}
        e || (r = function(t) {
            for (var e = new Array(t.length), i = t.length; i--;) e[i] = t[i];
            return e
        });
        var n;
        n = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ?
        function(t, e) {
            return fabric.document.defaultView.getComputedStyle(t, null)[e]
        }: function(t, e) {
            var i = t.style[e];
            return ! i && t.currentStyle && (i = t.currentStyle[e]),
            i
        },
        function() {
            var t = fabric.document.documentElement.style,
            e = "userSelect" in t ? "userSelect": "MozUserSelect" in t ? "MozUserSelect": "WebkitUserSelect" in t ? "WebkitUserSelect": "KhtmlUserSelect" in t ? "KhtmlUserSelect": "";
            fabric.util.makeElementUnselectable = function(t) {
                return void 0 !== t.onselectstart && (t.onselectstart = fabric.util.falseFunction),
                e ? t.style[e] = "none": "string" == typeof t.unselectable && (t.unselectable = "on"),
                t
            },
            fabric.util.makeElementSelectable = function(t) {
                return void 0 !== t.onselectstart && (t.onselectstart = null),
                e ? t.style[e] = "": "string" == typeof t.unselectable && (t.unselectable = ""),
                t
            }
        } (),
        function() {
            fabric.util.getScript = function(t, e) {
                var i = fabric.document.getElementsByTagName("head")[0],
                r = fabric.document.createElement("script"),
                n = !0;
                r.onload = r.onreadystatechange = function(t) {
                    if (n) {
                        if ("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) return;
                        n = !1,
                        e(t || fabric.window.event),
                        r = r.onload = r.onreadystatechange = null
                    }
                },
                r.src = t,
                i.appendChild(r)
            }
        } (),
        fabric.util.getById = function(t) {
            return "string" == typeof t ? fabric.document.getElementById(t) : t
        },
        fabric.util.toArray = r,
        fabric.util.makeElement = t,
        fabric.util.addClass = function(t, e) {
            t && -1 === (" " + t.className + " ").indexOf(" " + e + " ") && (t.className += (t.className ? " ": "") + e)
        },
        fabric.util.wrapElement = function(e, i, r) {
            return "string" == typeof i && (i = t(i, r)),
            e.parentNode && e.parentNode.replaceChild(i, e),
            i.appendChild(e),
            i
        },
        fabric.util.getScrollLeftTop = function(t, e) {
            var i, r, n = 0,
            o = 0,
            s = fabric.document.documentElement,
            a = fabric.document.body || {
                scrollLeft: 0,
                scrollTop: 0
            };
            for (r = t; t && t.parentNode && !i;)(t = t.parentNode) !== fabric.document && "fixed" === fabric.util.getElementStyle(t, "position") && (i = t),
            t !== fabric.document && r !== e && "absolute" === fabric.util.getElementStyle(t, "position") ? (n = 0, o = 0) : t === fabric.document ? (n = a.scrollLeft || s.scrollLeft || 0, o = a.scrollTop || s.scrollTop || 0) : (n += t.scrollLeft || 0, o += t.scrollTop || 0);
            return {
                left: n,
                top: o
            }
        },
        fabric.util.getElementOffset = function(t) {
            var e, i, r = t && t.ownerDocument,
            o = {
                left: 0,
                top: 0
            },
            s = {
                left: 0,
                top: 0
            },
            a = {
                borderLeftWidth: "left",
                borderTopWidth: "top",
                paddingLeft: "left",
                paddingTop: "top"
            };
            if (!r) return {
                left: 0,
                top: 0
            };
            for (var h in a) s[a[h]] += parseInt(n(t, h), 10) || 0;
            return e = r.documentElement,
            void 0 !== t.getBoundingClientRect && (o = t.getBoundingClientRect()),
            i = fabric.util.getScrollLeftTop(t, null),
            {
                left: o.left + i.left - (e.clientLeft || 0) + s.left,
                top: o.top + i.top - (e.clientTop || 0) + s.top
            }
        },
        fabric.util.getElementStyle = n
    } (),
    function() {
        function t(t, e) {
            return t + (/\?/.test(t) ? "&": "?") + e
        }
        function e() {}
        var i = function() {
            for (var t = [function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            },
            function() {
                return new ActiveXObject("Msxml2.XMLHTTP")
            },
            function() {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0")
            },
            function() {
                return new XMLHttpRequest
            }], e = t.length; e--;) try {
                if (t[e]()) return t[e]
            } catch(t) {}
        } ();
        fabric.util.request = function(r, n) {
            n || (n = {});
            var o, s = n.method ? n.method.toUpperCase() : "GET",
            a = n.onComplete ||
            function() {},
            h = i();
            return h.onreadystatechange = function() {
                4 === h.readyState && (a(h), h.onreadystatechange = e)
            },
            "GET" === s && (o = null, "string" == typeof n.parameters && (r = t(r, n.parameters))),
            h.open(s, r, !0),
            "POST" !== s && "PUT" !== s || h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
            h.send(o),
            h
        }
    } (),
    fabric.log = function() {},
    fabric.warn = function() {},
    "undefined" != typeof console && ["log", "warn"].forEach(function(t) {
        void 0 !== console[t] && console[t].apply && (fabric[t] = function() {
            return console[t].apply(console, arguments)
        })
    }),
    function(t) {
        "use strict";
        function e(t) {
            return t in S ? S[t] : t
        }
        function i(t, e, i) {
            var r, n = "[object Array]" === Object.prototype.toString.call(e);
            return "fill" !== t && "stroke" !== t || "none" !== e ? "fillRule" === t ? e = "evenodd" === e ? "destination-over": e: "strokeDashArray" === t ? e = e.replace(/,/g, " ").split(/\s+/).map(function(t) {
                return parseInt(t)
            }) : "transformMatrix" === t ? e = i && i.transformMatrix ? w(i.transformMatrix, g.parseTransformAttribute(e)) : g.parseTransformAttribute(e) : "visible" === t ? (e = "none" !== e && "hidden" !== e, i && !1 === i.visible && (e = !1)) : "originX" === t ? e = "start" === e ? "left": "end" === e ? "right": "center": r = n ? e.map(x) : x(e) : e = "",
            !n && isNaN(r) ? e: r
        }
        function r(t) {
            for (var e in C) if (t[e] && void 0 !== t[C[e]] && 0 !== t[e].indexOf("url(")) {
                var i = new g.Color(t[e]);
                t[e] = i.setAlpha(y(i.getAlpha() * t[C[e]], 2)).toRgba()
            }
            return t
        }
        function n(t, e) {
            var i = t.match(/(normal|italic)?\s*(normal|small-caps)?\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\s*(\d+)px(?:\/(normal|[\d\.]+))?\s+(.*)/);
            if (i) {
                var r = i[1],
                n = i[3],
                o = i[4],
                s = i[5],
                a = i[6];
                r && (e.fontStyle = r),
                n && (e.fontWeight = isNaN(parseFloat(n)) ? n: parseFloat(n)),
                o && (e.fontSize = parseFloat(o)),
                a && (e.fontFamily = a),
                s && (e.lineHeight = "normal" === s ? 1 : s)
            }
        }
        function o(t, r) {
            var o, s;
            t.replace(/;$/, "").split(";").forEach(function(t) {
                var a = t.split(":");
                o = e(a[0].trim().toLowerCase()),
                s = i(o, a[1].trim()),
                "font" === o ? n(s, r) : r[o] = s
            })
        }
        function s(t, r) {
            var o, s;
            for (var a in t) void 0 !== t[a] && (s = i(o = e(a.toLowerCase()), t[a]), "font" === o ? n(s, r) : r[o] = s)
        }
        function a(t) {
            var e = {};
            for (var i in g.cssRules) if (h(t, i.split(" "))) for (var r in g.cssRules[i]) e[r] = g.cssRules[i][r];
            return e
        }
        function h(t, e) {
            var i, r = !0;
            return (i = l(t, e.pop())) && e.length && (r = c(t, e)),
            i && r && 0 === e.length
        }
        function c(t, e) {
            for (var i, r = !0; t.parentNode && 1 === t.parentNode.nodeType && e.length;) r && (i = e.pop()),
            r = l(t = t.parentNode, i);
            return 0 === e.length
        }
        function l(t, e) {
            var i, r = t.nodeName,
            n = t.getAttribute("class"),
            o = t.getAttribute("id");
            if (i = new RegExp("^" + r, "i"), e = e.replace(i, ""), o && e.length && (i = new RegExp("#" + o + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")), n && e.length) for (var s = (n = n.split(" ")).length; s--;) i = new RegExp("\\." + n[s] + "(?![a-zA-Z\\-]+)", "i"),
            e = e.replace(i, "");
            return 0 === e.length
        }
        function u(t) {
            for (var e = t.getElementsByTagName("use"); e.length;) {
                for (var i = e[0], r = i.getAttribute("xlink:href").substr(1), n = i.getAttribute("x") || 0, o = i.getAttribute("y") || 0, s = t.getElementById(r).cloneNode(!0), a = (i.getAttribute("transform") || "") + " translate(" + n + ", " + o + ")", h = 0, c = i.attributes, l = c.length; h < l; h++) {
                    var u = c.item(h);
                    "x" !== u.nodeName && "y" !== u.nodeName && "xlink:href" !== u.nodeName && ("transform" === u.nodeName ? a = a + " " + u.nodeValue: s.setAttribute(u.nodeName, u.nodeValue))
                }
                s.setAttribute("transform", a),
                s.removeAttribute("id"),
                i.parentNode.replaceChild(s, i)
            }
        }
        function f(t, e) {
            if (e[3] = e[0] = e[0] > e[3] ? e[3] : e[0], 1 !== e[0] || 1 !== e[3] || 0 !== e[4] || 0 !== e[5]) {
                for (var i = t.ownerDocument.createElement("g"); null != t.firstChild;) i.appendChild(t.firstChild);
                i.setAttribute("transform", "matrix(" + e[0] + " " + e[1] + " " + e[2] + " " + e[3] + " " + e[4] + " " + e[5] + ")"),
                t.appendChild(i)
            }
        }
        function d(t) {
            var e = t.objects,
            i = t.options;
            return e = e.map(function(t) {
                return g[v(t.type)].fromObject(t)
            }),
            {
                objects: e,
                options: i
            }
        }
        function p(t, e, i) {
            e[i] && e[i].toSVG && t.push('<pattern x="0" y="0" id="', i, 'Pattern" ', 'width="', e[i].source.width, '" height="', e[i].source.height, '" patternUnits="userSpaceOnUse">', '<image x="0" y="0" ', 'width="', e[i].source.width, '" height="', e[i].source.height, '" xlink:href="', e[i].source.src, '"></image></pattern>')
        }
        var g = t.fabric || (t.fabric = {}),
        m = g.util.object.extend,
        v = g.util.string.capitalize,
        b = g.util.object.clone,
        y = g.util.toFixed,
        x = g.util.parseUnit,
        w = g.util.multiplyTransformMatrices,
        S = {
            cx: "left",
            x: "left",
            r: "radius",
            cy: "top",
            y: "top",
            display: "visible",
            visibility: "visible",
            transform: "transformMatrix",
            "fill-opacity": "fillOpacity",
            "fill-rule": "fillRule",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-style": "fontStyle",
            "font-weight": "fontWeight",
            "stroke-dasharray": "strokeDashArray",
            "stroke-linecap": "strokeLineCap",
            "stroke-linejoin": "strokeLineJoin",
            "stroke-miterlimit": "strokeMiterLimit",
            "stroke-opacity": "strokeOpacity",
            "stroke-width": "strokeWidth",
            "text-decoration": "textDecoration",
            "text-anchor": "originX"
        },
        C = {
            stroke: "strokeOpacity",
            fill: "fillOpacity"
        };
        g.parseTransformAttribute = function() {
            function t(t, e) {
                var i = e[0];
                t[0] = Math.cos(i),
                t[1] = Math.sin(i),
                t[2] = -Math.sin(i),
                t[3] = Math.cos(i)
            }
            function e(t, e) {
                var i = e[0],
                r = 2 === e.length ? e[1] : e[0];
                t[0] = i,
                t[3] = r
            }
            function i(t, e) {
                t[2] = e[0]
            }
            function r(t, e) {
                t[1] = e[0]
            }
            function n(t, e) {
                t[4] = e[0],
                2 === e.length && (t[5] = e[1])
            }
            var o = [1, 0, 0, 1, 0, 0],
            s = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)",
            a = "(?:\\s+,?\\s*|,\\s*)",
            h = "(?:(?:(matrix)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\))|(?:(translate)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(scale)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(rotate)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(skewX)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\))|(?:(skewY)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\)))",
            c = new RegExp("^\\s*(?:(?:(?:(?:(matrix)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\))|(?:(translate)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(scale)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(rotate)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(skewX)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\))|(?:(skewY)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\)))(?:(?:\\s+,?\\s*|,\\s*)(?:(?:(matrix)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\))|(?:(translate)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(scale)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(rotate)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))(?:\\s+,?\\s*|,\\s*)((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)))?\\s*\\))|(?:(skewX)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\))|(?:(skewY)\\s*\\(\\s*((?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?))\\s*\\))))*)?)\\s*$"),
            l = new RegExp(h, "g");
            return function(s) {
                var a = o.concat(),
                u = [];
                if (!s || s && !c.test(s)) return a;
                s.replace(l,
                function(s) {
                    var c = new RegExp(h).exec(s).filter(function(t) {
                        return "" !== t && null != t
                    }),
                    l = c[1],
                    f = c.slice(2).map(parseFloat);
                    switch (l) {
                    case "translate":
                        n(a, f);
                        break;
                    case "rotate":
                        f[0] = g.util.degreesToRadians(f[0]),
                        t(a, f);
                        break;
                    case "scale":
                        e(a, f);
                        break;
                    case "skewX":
                        i(a, f);
                        break;
                    case "skewY":
                        r(a, f);
                        break;
                    case "matrix":
                        a = f
                    }
                    u.push(a.concat()),
                    a = o.concat()
                });
                for (var f = u[0]; u.length > 1;) u.shift(),
                f = g.util.multiplyTransformMatrices(f, u[0]);
                return f
            }
        } (),
        g.parseSVGDocument = function() {
            function t(t, e) {
                for (; t && (t = t.parentNode);) if (e.test(t.nodeName)) return ! 0;
                return ! 1
            }
            var e = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/,
            i = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)",
            r = new RegExp("^\\s*(" + i + "+)\\s*,?\\s*(" + i + "+)\\s*,?\\s*(" + i + "+)\\s*,?\\s*(" + i + "+)\\s*$");
            return function(i, n, o) {
                if (i) {
                    var s = new Date;
                    u(i);
                    var a, h, c = i.getAttribute("viewBox"),
                    l = x(i.getAttribute("width") || "100%"),
                    d = x(i.getAttribute("height") || "100%");
                    if (c && (c = c.match(r))) {
                        var p = parseFloat(c[1]),
                        m = parseFloat(c[2]),
                        v = 1,
                        y = 1;
                        a = parseFloat(c[3]),
                        h = parseFloat(c[4]),
                        l && l !== a && (v = l / a),
                        d && d !== h && (y = d / h),
                        f(i, [v, 0, 0, y, v * -p, y * -m])
                    }
                    var w = g.util.toArray(i.getElementsByTagName("*"));
                    if (0 === w.length && g.isLikelyNode) {
                        for (var S = [], C = 0, _ = (w = i.selectNodes('//*[name(.)!="svg"]')).length; C < _; C++) S[C] = w[C];
                        w = S
                    }
                    var T = w.filter(function(i) {
                        return e.test(i.tagName) && !t(i, /^(?:pattern|defs)$/)
                    });
                    if (!T || T && !T.length) n && n([], {});
                    else {
                        var O = {
                            width: l || a,
                            height: d || h,
                            widthAttr: l,
                            heightAttr: d
                        };
                        g.gradientDefs = g.getGradientDefs(i),
                        g.cssRules = g.getCSSRules(i),
                        g.parseElements(T,
                        function(t) {
                            g.documentParsingTime = new Date - s,
                            n && n(t, O)
                        },
                        b(O), o)
                    }
                }
            }
        } ();
        var _ = {
            has: function(t, e) {
                e(!1)
            },
            get: function() {},
            set: function() {}
        };
        m(g, {
            getGradientDefs: function(t) {
                var e, i, r, n, o = t.getElementsByTagName("linearGradient"),
                s = t.getElementsByTagName("radialGradient"),
                a = 0,
                h = [],
                c = {},
                l = {};
                for (h.length = o.length + s.length, i = o.length; i--;) h[a++] = o[i];
                for (i = s.length; i--;) h[a++] = s[i];
                for (; a--;) n = (e = h[a]).getAttribute("xlink:href"),
                r = e.getAttribute("id"),
                n && (l[r] = n.substr(1)),
                c[r] = e;
                for (r in l) {
                    var u = c[l[r]].cloneNode(!0);
                    for (e = c[r]; u.firstChild;) e.appendChild(u.firstChild)
                }
                return c
            },
            parseAttributes: function(t, n) {
                if (t) {
                    var o, s = {};
                    t.parentNode && /^symbol|[g|a]$/i.test(t.parentNode.nodeName) && (s = g.parseAttributes(t.parentNode, n));
                    var h = n.reduce(function(r, n) {
                        return (o = t.getAttribute(n)) && (n = e(n), o = i(n, o, s), r[n] = o),
                        r
                    },
                    {});
                    return h = m(h, m(a(t), g.parseStyleAttribute(t))),
                    r(m(s, h))
                }
            },
            parseElements: function(t, e, i, r) {
                new g.ElementsParser(t, e, i, r).parse()
            },
            parseStyleAttribute: function(t) {
                var e = {},
                i = t.getAttribute("style");
                return i ? ("string" == typeof i ? o(i, e) : s(i, e), e) : e
            },
            parsePointsAttribute: function(t) {
                if (!t) return null;
                var e, i, r = [];
                for (e = 0, i = (t = (t = t.replace(/,/g, " ").trim()).split(/\s+/)).length; e < i; e += 2) r.push({
                    x: parseFloat(t[e]),
                    y: parseFloat(t[e + 1])
                });
                return r
            },
            getCSSRules: function(t) {
                for (var r = t.getElementsByTagName("style"), n = {},
                o = 0, s = r.length; o < s; o++) {
                    var a = r[0].textContent; (a = a.replace(/\/\*[\s\S]*?\*\//g, "")).match(/[^{]*\{[\s\S]*?\}/g).map(function(t) {
                        return t.trim()
                    }).forEach(function(t) {
                        for (var r = t.match(/([\s\S]*?)\s*\{([^}]*)\}/), o = {},
                        s = r[2].trim().replace(/;$/, "").split(/\s*;\s*/), a = 0, h = s.length; a < h; a++) {
                            var c = s[a].split(/\s*:\s*/),
                            l = e(c[0]),
                            u = i(l, c[1], c[0]);
                            o[l] = u
                        } (t = r[1]).split(",").forEach(function(t) {
                            n[t.trim()] = g.util.object.clone(o)
                        })
                    })
                }
                return n
            },
            loadSVGFromURL: function(t, e, i) {
                function r(r) {
                    var n = r.responseXML;
                    n && !n.documentElement && g.window.ActiveXObject && r.responseText && ((n = new ActiveXObject("Microsoft.XMLDOM")).async = "false", n.loadXML(r.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))),
                    n && n.documentElement && g.parseSVGDocument(n.documentElement,
                    function(i, r) {
                        _.set(t, {
                            objects: g.util.array.invoke(i, "toObject"),
                            options: r
                        }),
                        e(i, r)
                    },
                    i)
                }
                t = t.replace(/^\n\s*/, "").trim(),
                _.has(t,
                function(i) {
                    i ? _.get(t,
                    function(t) {
                        var i = d(t);
                        e(i.objects, i.options)
                    }) : new g.util.request(t, {
                        method: "get",
                        onComplete: r
                    })
                })
            },
            loadSVGFromString: function(t, e, i) {
                t = t.trim();
                var r;
                if ("undefined" != typeof DOMParser) {
                    var n = new DOMParser;
                    n && n.parseFromString && (r = n.parseFromString(t, "text/xml"))
                } else g.window.ActiveXObject && ((r = new ActiveXObject("Microsoft.XMLDOM")).async = "false", r.loadXML(t.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                g.parseSVGDocument(r.documentElement,
                function(t, i) {
                    e(t, i)
                },
                i)
            },
            createSVGFontFacesMarkup: function(t) {
                for (var e = "",
                i = 0,
                r = t.length; i < r; i++)"text" === t[i].type && t[i].path && (e += ["@font-face {", "font-family: ", t[i].fontFamily, "; ", "src: url('", t[i].path, "')", "}"].join(""));
                return e && (e = ['<style type="text/css">', "<![CDATA[", e, "]]>", "</style>"].join("")),
                e
            },
            createSVGRefElementsMarkup: function(t) {
                var e = [];
                return p(e, t, "backgroundColor"),
                p(e, t, "overlayColor"),
                e.join("")
            }
        })
    } (void 0 !== exports ? exports: this),
    fabric.ElementsParser = function(t, e, i, r) {
        this.elements = t,
        this.callback = e,
        this.options = i,
        this.reviver = r
    },
    fabric.ElementsParser.prototype.parse = function() {
        this.instances = new Array(this.elements.length),
        this.numElements = this.elements.length,
        this.createObjects()
    },
    fabric.ElementsParser.prototype.createObjects = function() {
        for (var t = 0,
        e = this.elements.length; t < e; t++) !
        function(t, e) {
            setTimeout(function() {
                t.createObject(t.elements[e], e)
            },
            0)
        } (this, t)
    },
    fabric.ElementsParser.prototype.createObject = function(t, e) {
        var i = fabric[fabric.util.string.capitalize(t.tagName)];
        if (i && i.fromElement) try {
            this._createObject(i, t, e)
        } catch(t) {
            fabric.log(t)
        } else this.checkIfDone()
    },
    fabric.ElementsParser.prototype._createObject = function(t, e, i) {
        if (t.async) t.fromElement(e, this.createCallback(i, e), this.options);
        else {
            var r = t.fromElement(e, this.options);
            this.resolveGradient(r, "fill"),
            this.resolveGradient(r, "stroke"),
            this.reviver && this.reviver(e, r),
            this.instances[i] = r,
            this.checkIfDone()
        }
    },
    fabric.ElementsParser.prototype.createCallback = function(t, e) {
        var i = this;
        return function(r) {
            i.resolveGradient(r, "fill"),
            i.resolveGradient(r, "stroke"),
            i.reviver && i.reviver(e, r),
            i.instances[t] = r,
            i.checkIfDone()
        }
    },
    fabric.ElementsParser.prototype.resolveGradient = function(t, e) {
        var i = t.get(e);
        if (/^url\(/.test(i)) {
            var r = i.slice(5, i.length - 1);
            fabric.gradientDefs[r] && t.set(e, fabric.Gradient.fromElement(fabric.gradientDefs[r], t))
        }
    },
    fabric.ElementsParser.prototype.checkIfDone = function() {
        0 == --this.numElements && (this.instances = this.instances.filter(function(t) {
            return null != t
        }), this.callback(this.instances))
    },
    function(t) {
        "use strict";
        function e(t, e) {
            this.x = t,
            this.y = e
        }
        var i = t.fabric || (t.fabric = {});
        i.Point ? i.warn("fabric.Point is already defined") : (i.Point = e, e.prototype = {
            constructor: e,
            add: function(t) {
                return new e(this.x + t.x, this.y + t.y)
            },
            addEquals: function(t) {
                return this.x += t.x,
                this.y += t.y,
                this
            },
            scalarAdd: function(t) {
                return new e(this.x + t, this.y + t)
            },
            scalarAddEquals: function(t) {
                return this.x += t,
                this.y += t,
                this
            },
            subtract: function(t) {
                return new e(this.x - t.x, this.y - t.y)
            },
            subtractEquals: function(t) {
                return this.x -= t.x,
                this.y -= t.y,
                this
            },
            scalarSubtract: function(t) {
                return new e(this.x - t, this.y - t)
            },
            scalarSubtractEquals: function(t) {
                return this.x -= t,
                this.y -= t,
                this
            },
            multiply: function(t) {
                return new e(this.x * t, this.y * t)
            },
            multiplyEquals: function(t) {
                return this.x *= t,
                this.y *= t,
                this
            },
            divide: function(t) {
                return new e(this.x / t, this.y / t)
            },
            divideEquals: function(t) {
                return this.x /= t,
                this.y /= t,
                this
            },
            eq: function(t) {
                return this.x === t.x && this.y === t.y
            },
            lt: function(t) {
                return this.x < t.x && this.y < t.y
            },
            lte: function(t) {
                return this.x <= t.x && this.y <= t.y
            },
            gt: function(t) {
                return this.x > t.x && this.y > t.y
            },
            gte: function(t) {
                return this.x >= t.x && this.y >= t.y
            },
            lerp: function(t, i) {
                return new e(this.x + (t.x - this.x) * i, this.y + (t.y - this.y) * i)
            },
            distanceFrom: function(t) {
                var e = this.x - t.x,
                i = this.y - t.y;
                return Math.sqrt(e * e + i * i)
            },
            midPointFrom: function(t) {
                return new e(this.x + (t.x - this.x) / 2, this.y + (t.y - this.y) / 2)
            },
            min: function(t) {
                return new e(Math.min(this.x, t.x), Math.min(this.y, t.y))
            },
            max: function(t) {
                return new e(Math.max(this.x, t.x), Math.max(this.y, t.y))
            },
            toString: function() {
                return this.x + "," + this.y
            },
            setXY: function(t, e) {
                this.x = t,
                this.y = e
            },
            setFromPoint: function(t) {
                this.x = t.x,
                this.y = t.y
            },
            swap: function(t) {
                var e = this.x,
                i = this.y;
                this.x = t.x,
                this.y = t.y,
                t.x = e,
                t.y = i
            }
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        function e(t) {
            this.status = t,
            this.points = []
        }
        var i = t.fabric || (t.fabric = {});
        i.Intersection ? i.warn("fabric.Intersection is already defined") : (i.Intersection = e, i.Intersection.prototype = {
            appendPoint: function(t) {
                this.points.push(t)
            },
            appendPoints: function(t) {
                this.points = this.points.concat(t)
            }
        },
        i.Intersection.intersectLineLine = function(t, r, n, o) {
            var s, a = (o.x - n.x) * (t.y - n.y) - (o.y - n.y) * (t.x - n.x),
            h = (r.x - t.x) * (t.y - n.y) - (r.y - t.y) * (t.x - n.x),
            c = (o.y - n.y) * (r.x - t.x) - (o.x - n.x) * (r.y - t.y);
            if (0 !== c) {
                var l = a / c,
                u = h / c;
                0 <= l && l <= 1 && 0 <= u && u <= 1 ? (s = new e("Intersection")).points.push(new i.Point(t.x + l * (r.x - t.x), t.y + l * (r.y - t.y))) : s = new e
            } else s = new e(0 === a || 0 === h ? "Coincident": "Parallel");
            return s
        },
        i.Intersection.intersectLinePolygon = function(t, i, r) {
            for (var n = new e,
            o = r.length,
            s = 0; s < o; s++) {
                var a = r[s],
                h = r[(s + 1) % o],
                c = e.intersectLineLine(t, i, a, h);
                n.appendPoints(c.points)
            }
            return n.points.length > 0 && (n.status = "Intersection"),
            n
        },
        i.Intersection.intersectPolygonPolygon = function(t, i) {
            for (var r = new e,
            n = t.length,
            o = 0; o < n; o++) {
                var s = t[o],
                a = t[(o + 1) % n],
                h = e.intersectLinePolygon(s, a, i);
                r.appendPoints(h.points)
            }
            return r.points.length > 0 && (r.status = "Intersection"),
            r
        },
        i.Intersection.intersectPolygonRectangle = function(t, r, n) {
            var o = r.min(n),
            s = r.max(n),
            a = new i.Point(s.x, o.y),
            h = new i.Point(o.x, s.y),
            c = e.intersectLinePolygon(o, a, t),
            l = e.intersectLinePolygon(a, s, t),
            u = e.intersectLinePolygon(s, h, t),
            f = e.intersectLinePolygon(h, o, t),
            d = new e;
            return d.appendPoints(c.points),
            d.appendPoints(l.points),
            d.appendPoints(u.points),
            d.appendPoints(f.points),
            d.points.length > 0 && (d.status = "Intersection"),
            d
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        function e(t) {
            t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
        }
        function i(t, e, i) {
            return i < 0 && (i += 1),
            i > 1 && (i -= 1),
            i < 1 / 6 ? t + 6 * (e - t) * i: i < .5 ? e: i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
        }
        var r = t.fabric || (t.fabric = {});
        r.Color ? r.warn("fabric.Color is already defined.") : (r.Color = e, r.Color.prototype = {
            _tryParsingColor: function(t) {
                var i;
                t in e.colorNameMap && (t = e.colorNameMap[t]),
                "transparent" !== t ? ((i = e.sourceFromHex(t)) || (i = e.sourceFromRgb(t)), i || (i = e.sourceFromHsl(t)), i && this.setSource(i)) : this.setSource([255, 255, 255, 0])
            },
            _rgbToHsl: function(t, e, i) {
                t /= 255,
                e /= 255,
                i /= 255;
                var n, o, s, a = r.util.array.max([t, e, i]),
                h = r.util.array.min([t, e, i]);
                if (s = (a + h) / 2, a === h) n = o = 0;
                else {
                    var c = a - h;
                    switch (o = s > .5 ? c / (2 - a - h) : c / (a + h), a) {
                    case t:
                        n = (e - i) / c + (e < i ? 6 : 0);
                        break;
                    case e:
                        n = (i - t) / c + 2;
                        break;
                    case i:
                        n = (t - e) / c + 4
                    }
                    n /= 6
                }
                return [Math.round(360 * n), Math.round(100 * o), Math.round(100 * s)]
            },
            getSource: function() {
                return this._source
            },
            setSource: function(t) {
                this._source = t
            },
            toRgb: function() {
                var t = this.getSource();
                return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
            },
            toRgba: function() {
                var t = this.getSource();
                return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
            },
            toHsl: function() {
                var t = this.getSource(),
                e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
            },
            toHsla: function() {
                var t = this.getSource(),
                e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
            },
            toHex: function() {
                var t, e, i, r = this.getSource();
                return t = r[0].toString(16),
                t = 1 === t.length ? "0" + t: t,
                e = r[1].toString(16),
                e = 1 === e.length ? "0" + e: e,
                i = r[2].toString(16),
                i = 1 === i.length ? "0" + i: i,
                t.toUpperCase() + e.toUpperCase() + i.toUpperCase()
            },
            getAlpha: function() {
                return this.getSource()[3]
            },
            setAlpha: function(t) {
                var e = this.getSource();
                return e[3] = t,
                this.setSource(e),
                this
            },
            toGrayscale: function() {
                var t = this.getSource(),
                e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10),
                i = t[3];
                return this.setSource([e, e, e, i]),
                this
            },
            toBlackWhite: function(t) {
                var e = this.getSource(),
                i = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0),
                r = e[3];
                return t = t || 127,
                i = Number(i) < Number(t) ? 0 : 255,
                this.setSource([i, i, i, r]),
                this
            },
            overlayWith: function(t) {
                t instanceof e || (t = new e(t));
                for (var i = [], r = this.getAlpha(), n = this.getSource(), o = t.getSource(), s = 0; s < 3; s++) i.push(Math.round(.5 * n[s] + .5 * o[s]));
                return i[3] = r,
                this.setSource(i),
                this
            }
        },
        r.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, r.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, r.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i, r.Color.colorNameMap = {
            aqua: "#00FFFF",
            black: "#000000",
            blue: "#0000FF",
            fuchsia: "#FF00FF",
            gray: "#808080",
            green: "#008000",
            lime: "#00FF00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            orange: "#FFA500",
            purple: "#800080",
            red: "#FF0000",
            silver: "#C0C0C0",
            teal: "#008080",
            white: "#FFFFFF",
            yellow: "#FFFF00"
        },
        r.Color.fromRgb = function(t) {
            return e.fromSource(e.sourceFromRgb(t))
        },
        r.Color.sourceFromRgb = function(t) {
            var i = t.match(e.reRGBa);
            if (i) {
                var r = parseInt(i[1], 10) / (/%$/.test(i[1]) ? 100 : 1) * (/%$/.test(i[1]) ? 255 : 1),
                n = parseInt(i[2], 10) / (/%$/.test(i[2]) ? 100 : 1) * (/%$/.test(i[2]) ? 255 : 1),
                o = parseInt(i[3], 10) / (/%$/.test(i[3]) ? 100 : 1) * (/%$/.test(i[3]) ? 255 : 1);
                return [parseInt(r, 10), parseInt(n, 10), parseInt(o, 10), i[4] ? parseFloat(i[4]) : 1]
            }
        },
        r.Color.fromRgba = e.fromRgb, r.Color.fromHsl = function(t) {
            return e.fromSource(e.sourceFromHsl(t))
        },
        r.Color.sourceFromHsl = function(t) {
            var r = t.match(e.reHSLa);
            if (r) {
                var n, o, s, a = (parseFloat(r[1]) % 360 + 360) % 360 / 360,
                h = parseFloat(r[2]) / (/%$/.test(r[2]) ? 100 : 1),
                c = parseFloat(r[3]) / (/%$/.test(r[3]) ? 100 : 1);
                if (0 === h) n = o = s = c;
                else {
                    var l = c <= .5 ? c * (h + 1) : c + h - c * h,
                    u = 2 * c - l;
                    n = i(u, l, a + 1 / 3),
                    o = i(u, l, a),
                    s = i(u, l, a - 1 / 3)
                }
                return [Math.round(255 * n), Math.round(255 * o), Math.round(255 * s), r[4] ? parseFloat(r[4]) : 1]
            }
        },
        r.Color.fromHsla = e.fromHsl, r.Color.fromHex = function(t) {
            return e.fromSource(e.sourceFromHex(t))
        },
        r.Color.sourceFromHex = function(t) {
            if (t.match(e.reHex)) {
                var i = t.slice(t.indexOf("#") + 1),
                r = 3 === i.length,
                n = r ? i.charAt(0) + i.charAt(0) : i.substring(0, 2),
                o = r ? i.charAt(1) + i.charAt(1) : i.substring(2, 4),
                s = r ? i.charAt(2) + i.charAt(2) : i.substring(4, 6);
                return [parseInt(n, 16), parseInt(o, 16), parseInt(s, 16), 1]
            }
        },
        r.Color.fromSource = function(t) {
            var i = new e;
            return i.setSource(t),
            i
        })
    } (void 0 !== exports ? exports: this),
    function() {
        function t(t) {
            var e, i, r, n = t.getAttribute("style"),
            o = t.getAttribute("offset");
            if (o = parseFloat(o) / (/%$/.test(o) ? 100 : 1), o = o < 0 ? 0 : o > 1 ? 1 : o, n) {
                var s = n.split(/\s*;\s*/);
                "" === s[s.length - 1] && s.pop();
                for (var a = s.length; a--;) {
                    var h = s[a].split(/\s*:\s*/),
                    c = h[0].trim(),
                    l = h[1].trim();
                    "stop-color" === c ? e = l: "stop-opacity" === c && (r = l)
                }
            }
            return e || (e = t.getAttribute("stop-color") || "rgb(0,0,0)"),
            r || (r = t.getAttribute("stop-opacity")),
            e = new fabric.Color(e),
            i = e.getAlpha(),
            r = isNaN(parseFloat(r)) ? 1 : parseFloat(r),
            r *= i,
            {
                offset: o,
                color: e.toRgb(),
                opacity: r
            }
        }
        function e(t) {
            return {
                x1: t.getAttribute("x1") || 0,
                y1: t.getAttribute("y1") || 0,
                x2: t.getAttribute("x2") || "100%",
                y2: t.getAttribute("y2") || 0
            }
        }
        function i(t) {
            return {
                x1: t.getAttribute("fx") || t.getAttribute("cx") || "50%",
                y1: t.getAttribute("fy") || t.getAttribute("cy") || "50%",
                r1: 0,
                x2: t.getAttribute("cx") || "50%",
                y2: t.getAttribute("cy") || "50%",
                r2: t.getAttribute("r") || "50%"
            }
        }
        function r(t, e, i) {
            var r, n = 0,
            o = 1,
            s = "";
            for (var a in e) r = parseFloat(e[a], 10),
            o = "string" == typeof e[a] && /^\d+%$/.test(e[a]) ? .01 : 1,
            "x1" === a || "x2" === a || "r2" === a ? (o *= "objectBoundingBox" === i ? t.width: 1, n = "objectBoundingBox" === i ? t.left || 0 : 0) : "y1" !== a && "y2" !== a || (o *= "objectBoundingBox" === i ? t.height: 1, n = "objectBoundingBox" === i ? t.top || 0 : 0),
            e[a] = r * o + n;
            if ("ellipse" === t.type && null !== e.r2 && "objectBoundingBox" === i && t.rx !== t.ry) {
                var h = t.ry / t.rx;
                s = " scale(1, " + h + ")",
                e.y1 && (e.y1 /= h),
                e.y2 && (e.y2 /= h)
            }
            return s
        }
        fabric.Gradient = fabric.util.createClass({
            offsetX: 0,
            offsetY: 0,
            initialize: function(t) {
                t || (t = {});
                var e = {};
                this.id = fabric.Object.__uid++,
                this.type = t.type || "linear",
                e = {
                    x1: t.coords.x1 || 0,
                    y1: t.coords.y1 || 0,
                    x2: t.coords.x2 || 0,
                    y2: t.coords.y2 || 0
                },
                "radial" === this.type && (e.r1 = t.coords.r1 || 0, e.r2 = t.coords.r2 || 0),
                this.coords = e,
                this.colorStops = t.colorStops.slice(),
                t.gradientTransform && (this.gradientTransform = t.gradientTransform),
                this.offsetX = t.offsetX || this.offsetX,
                this.offsetY = t.offsetY || this.offsetY
            },
            addColorStop: function(t) {
                for (var e in t) {
                    var i = new fabric.Color(t[e]);
                    this.colorStops.push({
                        offset: e,
                        color: i.toRgb(),
                        opacity: i.getAlpha()
                    })
                }
                return this
            },
            toObject: function() {
                return {
                    type: this.type,
                    coords: this.coords,
                    colorStops: this.colorStops,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY
                }
            },
            toSVG: function(t) {
                var e, i, r = fabric.util.object.clone(this.coords);
                if (this.colorStops.sort(function(t, e) {
                    return t.offset - e.offset
                }), !t.group || "path-group" !== t.group.type) for (var n in r)"x1" === n || "x2" === n || "r2" === n ? r[n] += this.offsetX - t.width / 2 : "y1" !== n && "y2" !== n || (r[n] += this.offsetY - t.height / 2);
                i = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"',
                this.gradientTransform && (i += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" '),
                "linear" === this.type ? e = ["<linearGradient ", i, ' x1="', r.x1, '" y1="', r.y1, '" x2="', r.x2, '" y2="', r.y2, '">\n'] : "radial" === this.type && (e = ["<radialGradient ", i, ' cx="', r.x2, '" cy="', r.y2, '" r="', r.r2, '" fx="', r.x1, '" fy="', r.y1, '">\n']);
                for (var o = 0; o < this.colorStops.length; o++) e.push("<stop ", 'offset="', 100 * this.colorStops[o].offset + "%", '" style="stop-color:', this.colorStops[o].color, null != this.colorStops[o].opacity ? ";stop-opacity: " + this.colorStops[o].opacity: ";", '"/>\n');
                return e.push("linear" === this.type ? "</linearGradient>\n": "</radialGradient>\n"),
                e.join("")
            },
            toLive: function(t) {
                var e;
                if (this.type) {
                    "linear" === this.type ? e = t.createLinearGradient(this.coords.x1, this.coords.y1, this.coords.x2, this.coords.y2) : "radial" === this.type && (e = t.createRadialGradient(this.coords.x1, this.coords.y1, this.coords.r1, this.coords.x2, this.coords.y2, this.coords.r2));
                    for (var i = 0,
                    r = this.colorStops.length; i < r; i++) {
                        var n = this.colorStops[i].color,
                        o = this.colorStops[i].opacity,
                        s = this.colorStops[i].offset;
                        void 0 !== o && (n = new fabric.Color(n).setAlpha(o).toRgba()),
                        e.addColorStop(parseFloat(s), n)
                    }
                    return e
                }
            }
        }),
        fabric.util.object.extend(fabric.Gradient, {
            fromElement: function(n, o) {
                var s, a = n.getElementsByTagName("stop"),
                h = "linearGradient" === n.nodeName ? "linear": "radial",
                c = n.getAttribute("gradientUnits") || "objectBoundingBox",
                l = n.getAttribute("gradientTransform"),
                u = [],
                f = {};
                "linear" === h ? f = e(n) : "radial" === h && (f = i(n));
                for (var d = a.length; d--;) u.push(t(a[d]));
                s = r(o, f, c);
                var p = new fabric.Gradient({
                    type: h,
                    coords: f,
                    colorStops: u,
                    offsetX: -o.left,
                    offsetY: -o.top
                });
                return (l || "" !== s) && (p.gradientTransform = fabric.parseTransformAttribute((l || "") + s)),
                p
            },
            forObject: function(t, e) {
                return e || (e = {}),
                r(t, e.coords, "userSpaceOnUse"),
                new fabric.Gradient(e)
            }
        })
    } (),
    fabric.Pattern = fabric.util.createClass({
        repeat: "repeat",
        offsetX: 0,
        offsetY: 0,
        initialize: function(t) {
            if (t || (t = {}), this.id = fabric.Object.__uid++, t.source) if ("string" == typeof t.source) if (void 0 !== fabric.util.getFunctionBody(t.source)) this.source = new Function(fabric.util.getFunctionBody(t.source));
            else {
                var e = this;
                this.source = fabric.util.createImage(),
                fabric.util.loadImage(t.source,
                function(t) {
                    e.source = t
                })
            } else this.source = t.source;
            t.repeat && (this.repeat = t.repeat),
            t.offsetX && (this.offsetX = t.offsetX),
            t.offsetY && (this.offsetY = t.offsetY)
        },
        toObject: function() {
            var t;
            return "function" == typeof this.source ? t = String(this.source) : "string" == typeof this.source.src && (t = this.source.src),
            {
                source: t,
                repeat: this.repeat,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            }
        },
        toSVG: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source,
            i = e.width / t.getWidth(),
            r = e.height / t.getHeight(),
            n = "";
            return e.src ? n = e.src: e.toDataURL && (n = e.toDataURL()),
            '<pattern id="SVGID_' + this.id + '" x="' + this.offsetX + '" y="' + this.offsetY + '" width="' + i + '" height="' + r + '"><image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + n + '"></image></pattern>'
        },
        toLive: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source;
            if (!e) return "";
            if (void 0 !== e.src) {
                if (!e.complete) return "";
                if (0 === e.naturalWidth || 0 === e.naturalHeight) return ""
            }
            return t.createPattern(e, this.repeat)
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Shadow ? e.warn("fabric.Shadow is already defined.") : (e.Shadow = e.util.createClass({
            color: "rgb(0,0,0)",
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: !1,
            includeDefaultValues: !0,
            initialize: function(t) {
                "string" == typeof t && (t = this._parseShadow(t));
                for (var i in t) this[i] = t[i];
                this.id = e.Object.__uid++
            },
            _parseShadow: function(t) {
                var i = t.trim(),
                r = e.Shadow.reOffsetsAndBlur.exec(i) || [];
                return {
                    color: (i.replace(e.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)").trim(),
                    offsetX: parseInt(r[1], 10) || 0,
                    offsetY: parseInt(r[2], 10) || 0,
                    blur: parseInt(r[3], 10) || 0
                }
            },
            toString: function() {
                return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
            },
            toSVG: function(t) {
                var e = "SourceAlpha";
                return ! t || t.fill !== this.color && t.stroke !== this.color || (e = "SourceGraphic"),
                '<filter id="SVGID_' + this.id + '" y="-40%" height="180%"><feGaussianBlur in="' + e + '" stdDeviation="' + (this.blur ? this.blur / 3 : 0) + '"></feGaussianBlur><feOffset dx="' + this.offsetX + '" dy="' + this.offsetY + '"></feOffset><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>'
            },
            toObject: function() {
                if (this.includeDefaultValues) return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY
                };
                var t = {},
                i = e.Shadow.prototype;
                return this.color !== i.color && (t.color = this.color),
                this.blur !== i.blur && (t.blur = this.blur),
                this.offsetX !== i.offsetX && (t.offsetX = this.offsetX),
                this.offsetY !== i.offsetY && (t.offsetY = this.offsetY),
                t
            }
        }), e.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/)
    } (void 0 !== exports ? exports: this),
    function() {
        "use strict";
        if (fabric.StaticCanvas) fabric.warn("fabric.StaticCanvas is already defined.");
        else {
            var t = fabric.util.object.extend,
            e = fabric.util.getElementOffset,
            i = fabric.util.removeFromArray,
            r = new Error("Could not initialize `canvas` element");
            fabric.StaticCanvas = fabric.util.createClass({
                initialize: function(t, e) {
                    e || (e = {}),
                    this._initStatic(t, e),
                    fabric.StaticCanvas.activeInstance = this
                },
                backgroundColor: "",
                backgroundImage: null,
                overlayColor: "",
                overlayImage: null,
                includeDefaultValues: !0,
                stateful: !0,
                renderOnAddRemove: !0,
                clipTo: null,
                controlsAboveOverlay: !1,
                allowTouchScrolling: !1,
                imageSmoothingEnabled: !0,
                viewportTransform: [1, 0, 0, 1, 0, 0],
                onBeforeScaleRotate: function() {},
                _initStatic: function(t, e) {
                    this._objects = [],
                    this._createLowerCanvas(t),
                    this._initOptions(e),
                    this._setImageSmoothing(),
                    e.overlayImage && this.setOverlayImage(e.overlayImage, this.renderAll.bind(this)),
                    e.backgroundImage && this.setBackgroundImage(e.backgroundImage, this.renderAll.bind(this)),
                    e.backgroundColor && this.setBackgroundColor(e.backgroundColor, this.renderAll.bind(this)),
                    e.overlayColor && this.setOverlayColor(e.overlayColor, this.renderAll.bind(this)),
                    this.calcOffset()
                },
                calcOffset: function() {
                    return this._offset = e(this.lowerCanvasEl),
                    this
                },
                setOverlayImage: function(t, e, i) {
                    return this.__setBgOverlayImage("overlayImage", t, e, i)
                },
                setBackgroundImage: function(t, e, i) {
                    return this.__setBgOverlayImage("backgroundImage", t, e, i)
                },
                setOverlayColor: function(t, e) {
                    return this.__setBgOverlayColor("overlayColor", t, e)
                },
                setBackgroundColor: function(t, e) {
                    return this.__setBgOverlayColor("backgroundColor", t, e)
                },
                _setImageSmoothing: function() {
                    var t = this.getContext();
                    t.imageSmoothingEnabled = this.imageSmoothingEnabled,
                    t.webkitImageSmoothingEnabled = this.imageSmoothingEnabled,
                    t.mozImageSmoothingEnabled = this.imageSmoothingEnabled,
                    t.msImageSmoothingEnabled = this.imageSmoothingEnabled,
                    t.oImageSmoothingEnabled = this.imageSmoothingEnabled
                },
                __setBgOverlayImage: function(t, e, i, r) {
                    return "string" == typeof e ? fabric.util.loadImage(e,
                    function(e) {
                        this[t] = new fabric.Image(e, r),
                        i && i()
                    },
                    this) : (this[t] = e, i && i()),
                    this
                },
                __setBgOverlayColor: function(t, e, i) {
                    if (e && e.source) {
                        var r = this;
                        fabric.util.loadImage(e.source,
                        function(n) {
                            r[t] = new fabric.Pattern({
                                source: n,
                                repeat: e.repeat,
                                offsetX: e.offsetX,
                                offsetY: e.offsetY
                            }),
                            i && i()
                        })
                    } else this[t] = e,
                    i && i();
                    return this
                },
                _createCanvasElement: function() {
                    var t = fabric.document.createElement("canvas");
                    if (t.style || (t.style = {}), !t) throw r;
                    return this._initCanvasElement(t),
                    t
                },
                _initCanvasElement: function(t) {
                    if (fabric.util.createCanvasElement(t), void 0 === t.getContext) throw r
                },
                _initOptions: function(t) {
                    for (var e in t) this[e] = t[e];
                    this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0,
                    this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0,
                    this.lowerCanvasEl.style && (this.lowerCanvasEl.width = this.width, this.lowerCanvasEl.height = this.height, this.lowerCanvasEl.style.width = this.width + "px", this.lowerCanvasEl.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
                },
                _createLowerCanvas: function(t) {
                    this.lowerCanvasEl = fabric.util.getById(t) || this._createCanvasElement(),
                    this._initCanvasElement(this.lowerCanvasEl),
                    fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"),
                    this.interactive && this._applyCanvasStyle(this.lowerCanvasEl),
                    this.contextContainer = this.lowerCanvasEl.getContext("2d")
                },
                getWidth: function() {
                    return this.width
                },
                getHeight: function() {
                    return this.height
                },
                setWidth: function(t, e) {
                    return this.setDimensions({
                        width: t
                    },
                    e)
                },
                setHeight: function(t, e) {
                    return this.setDimensions({
                        height: t
                    },
                    e)
                },
                setDimensions: function(t, e) {
                    var i;
                    e = e || {};
                    for (var r in t) i = t[r],
                    e.cssOnly || (this._setBackstoreDimension(r, t[r]), i += "px"),
                    e.backstoreOnly || this._setCssDimension(r, i);
                    return e.cssOnly || this.renderAll(),
                    this.calcOffset(),
                    this
                },
                _setBackstoreDimension: function(t, e) {
                    return this.lowerCanvasEl[t] = e,
                    this.upperCanvasEl && (this.upperCanvasEl[t] = e),
                    this.cacheCanvasEl && (this.cacheCanvasEl[t] = e),
                    this[t] = e,
                    this
                },
                _setCssDimension: function(t, e) {
                    return this.lowerCanvasEl.style[t] = e,
                    this.upperCanvasEl && (this.upperCanvasEl.style[t] = e),
                    this.wrapperEl && (this.wrapperEl.style[t] = e),
                    this
                },
                getZoom: function() {
                    return Math.sqrt(this.viewportTransform[0] * this.viewportTransform[3])
                },
                setViewportTransform: function(t) {
                    this.viewportTransform = t,
                    this.renderAll();
                    for (var e = 0,
                    i = this._objects.length; e < i; e++) this._objects[e].setCoords();
                    return this
                },
                zoomToPoint: function(t, e) {
                    var i = t;
                    t = fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform)),
                    this.viewportTransform[0] = e,
                    this.viewportTransform[3] = e;
                    var r = fabric.util.transformPoint(t, this.viewportTransform);
                    this.viewportTransform[4] += i.x - r.x,
                    this.viewportTransform[5] += i.y - r.y,
                    this.renderAll();
                    for (var n = 0,
                    o = this._objects.length; n < o; n++) this._objects[n].setCoords();
                    return this
                },
                setZoom: function(t) {
                    return this.zoomToPoint(new fabric.Point(0, 0), t),
                    this
                },
                absolutePan: function(t) {
                    this.viewportTransform[4] = -t.x,
                    this.viewportTransform[5] = -t.y,
                    this.renderAll();
                    for (var e = 0,
                    i = this._objects.length; e < i; e++) this._objects[e].setCoords();
                    return this
                },
                relativePan: function(t) {
                    return this.absolutePan(new fabric.Point( - t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5]))
                },
                getElement: function() {
                    return this.lowerCanvasEl
                },
                getActiveObject: function() {
                    return null
                },
                getActiveGroup: function() {
                    return null
                },
                _draw: function(t, e) {
                    if (e) {
                        t.save();
                        var i = this.viewportTransform;
                        t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                        e.render(t),
                        t.restore(),
                        this.controlsAboveOverlay || e._renderControls(t)
                    }
                },
                _onObjectAdded: function(t) {
                    this.stateful && t.setupState(),
                    t.canvas = this,
                    t.setCoords(),
                    this.fire("object:added", {
                        target: t
                    }),
                    t.fire("added")
                },
                _onObjectRemoved: function(t) {
                    this.getActiveObject() === t && (this.fire("before:selection:cleared", {
                        target: t
                    }), this._discardActiveObject(), this.fire("selection:cleared")),
                    this.fire("object:removed", {
                        target: t
                    }),
                    t.fire("removed")
                },
                clearContext: function(t) {
                    return t.clearRect(0, 0, this.width, this.height),
                    this
                },
                getContext: function() {
                    return this.contextContainer
                },
                clear: function() {
                    return this._objects.length = 0,
                    this.discardActiveGroup && this.discardActiveGroup(),
                    this.discardActiveObject && this.discardActiveObject(),
                    this.clearContext(this.contextContainer),
                    this.contextTop && this.clearContext(this.contextTop),
                    this.fire("canvas:cleared"),
                    this.renderAll(),
                    this
                },
                renderAll: function(t) {
                    var e = this[!0 === t && this.interactive ? "contextTop": "contextContainer"],
                    i = this.getActiveGroup();
                    return this.contextTop && this.selection && !this._groupSelector && this.clearContext(this.contextTop),
                    t || this.clearContext(e),
                    this.fire("before:render"),
                    this.clipTo && fabric.util.clipContext(this, e),
                    this._renderBackground(e),
                    this._renderObjects(e, i),
                    this._renderActiveGroup(e, i),
                    this.clipTo && e.restore(),
                    this._renderOverlay(e),
                    this.controlsAboveOverlay && this.interactive && this.drawControls(e),
                    this.fire("after:render"),
                    this
                },
                _renderObjects: function(t, e) {
                    var i, r;
                    if (e) for (i = 0, r = this._objects.length; i < r; ++i) this._objects[i] && !e.contains(this._objects[i]) && this._draw(t, this._objects[i]);
                    else for (i = 0, r = this._objects.length; i < r; ++i) this._draw(t, this._objects[i])
                },
                _renderActiveGroup: function(t, e) {
                    if (e) {
                        var i = [];
                        this.forEachObject(function(t) {
                            e.contains(t) && i.push(t)
                        }),
                        e._set("objects", i),
                        this._draw(t, e)
                    }
                },
                _renderBackground: function(t) {
                    this.backgroundColor && (t.fillStyle = this.backgroundColor.toLive ? this.backgroundColor.toLive(t) : this.backgroundColor, t.fillRect(this.backgroundColor.offsetX || 0, this.backgroundColor.offsetY || 0, this.width, this.height)),
                    this.backgroundImage && this._draw(t, this.backgroundImage)
                },
                _renderOverlay: function(t) {
                    this.overlayColor && (t.fillStyle = this.overlayColor.toLive ? this.overlayColor.toLive(t) : this.overlayColor, t.fillRect(this.overlayColor.offsetX || 0, this.overlayColor.offsetY || 0, this.width, this.height)),
                    this.overlayImage && this._draw(t, this.overlayImage)
                },
                renderTop: function() {
                    var t = this.contextTop || this.contextContainer;
                    this.clearContext(t),
                    this.selection && this._groupSelector && this._drawSelection();
                    var e = this.getActiveGroup();
                    return e && e.render(t),
                    this._renderOverlay(t),
                    this.fire("after:render"),
                    this
                },
                getCenter: function() {
                    return {
                        top: this.getHeight() / 2,
                        left: this.getWidth() / 2
                    }
                },
                centerObjectH: function(t) {
                    return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y)),
                    this.renderAll(),
                    this
                },
                centerObjectV: function(t) {
                    return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top)),
                    this.renderAll(),
                    this
                },
                centerObject: function(t) {
                    var e = this.getCenter();
                    return this._centerObject(t, new fabric.Point(e.left, e.top)),
                    this.renderAll(),
                    this
                },
                _centerObject: function(t, e) {
                    return t.setPositionByOrigin(e, "center", "center"),
                    this
                },
                toDatalessJSON: function(t) {
                    return this.toDatalessObject(t)
                },
                toObject: function(t) {
                    return this._toObjectMethod("toObject", t)
                },
                toDatalessObject: function(t) {
                    return this._toObjectMethod("toDatalessObject", t)
                },
                _toObjectMethod: function(e, i) {
                    var r = this.getActiveGroup();
                    r && this.discardActiveGroup();
                    var n = {
                        objects: this._toObjects(e, i)
                    };
                    return t(n, this.__serializeBgOverlay()),
                    fabric.util.populateWithProperties(this, n, i),
                    r && (this.setActiveGroup(new fabric.Group(r.getObjects(), {
                        originX: "center",
                        originY: "center"
                    })), r.forEachObject(function(t) {
                        t.set("active", !0)
                    }), this._currentTransform && (this._currentTransform.target = this.getActiveGroup())),
                    n
                },
                _toObjects: function(t, e) {
                    return this.getObjects().map(function(i) {
                        return this._toObject(i, t, e)
                    },
                    this)
                },
                _toObject: function(t, e, i) {
                    var r;
                    this.includeDefaultValues || (r = t.includeDefaultValues, t.includeDefaultValues = !1);
                    var n = t[e](i);
                    return this.includeDefaultValues || (t.includeDefaultValues = r),
                    n
                },
                __serializeBgOverlay: function() {
                    var t = {
                        background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject() : this.backgroundColor
                    };
                    return this.overlayColor && (t.overlay = this.overlayColor.toObject ? this.overlayColor.toObject() : this.overlayColor),
                    this.backgroundImage && (t.backgroundImage = this.backgroundImage.toObject()),
                    this.overlayImage && (t.overlayImage = this.overlayImage.toObject()),
                    t
                },
                svgViewportTransformation: !0,
                toSVG: function(t, e) {
                    t || (t = {});
                    var i = [];
                    return this._setSVGPreamble(i, t),
                    this._setSVGHeader(i, t),
                    this._setSVGBgOverlayColor(i, "backgroundColor"),
                    this._setSVGBgOverlayImage(i, "backgroundImage"),
                    this._setSVGObjects(i, e),
                    this._setSVGBgOverlayColor(i, "overlayColor"),
                    this._setSVGBgOverlayImage(i, "overlayImage"),
                    i.push("</svg>"),
                    i.join("")
                },
                _setSVGPreamble: function(t, e) {
                    e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
                },
                _setSVGHeader: function(t, e) {
                    var i, r, n;
                    e.viewBox ? (i = e.viewBox.width, r = e.viewBox.height) : (i = this.width, r = this.height, this.svgViewportTransformation || (i /= (n = this.viewportTransform)[0], r /= n[3])),
                    t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', i, '" ', 'height="', r, '" ', this.backgroundColor && !this.backgroundColor.toLive ? 'style="background-color: ' + this.backgroundColor + '" ': null, e.viewBox ? 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ': null, 'xml:space="preserve">', "<desc>Created with Fabric.js ", fabric.version, "</desc>", "<defs>", fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), "</defs>")
                },
                _setSVGObjects: function(t, e) {
                    var i = this.getActiveGroup();
                    i && this.discardActiveGroup();
                    for (var r = 0,
                    n = this.getObjects(), o = n.length; r < o; r++) t.push(n[r].toSVG(e));
                    i && (this.setActiveGroup(new fabric.Group(i.getObjects())), i.forEachObject(function(t) {
                        t.set("active", !0)
                    }))
                },
                _setSVGBgOverlayImage: function(t, e) {
                    this[e] && this[e].toSVG && t.push(this[e].toSVG())
                },
                _setSVGBgOverlayColor: function(t, e) {
                    this[e] && this[e].source ? t.push('<rect x="', this[e].offsetX, '" y="', this[e].offsetY, '" ', 'width="', "repeat-y" === this[e].repeat || "no-repeat" === this[e].repeat ? this[e].source.width: this.width, '" height="', "repeat-x" === this[e].repeat || "no-repeat" === this[e].repeat ? this[e].source.height: this.height, '" fill="url(#' + e + 'Pattern)"', "></rect>") : this[e] && "overlayColor" === e && t.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[e], '"', "></rect>")
                },
                sendToBack: function(t) {
                    return i(this._objects, t),
                    this._objects.unshift(t),
                    this.renderAll && this.renderAll()
                },
                bringToFront: function(t) {
                    return i(this._objects, t),
                    this._objects.push(t),
                    this.renderAll && this.renderAll()
                },
                sendBackwards: function(t, e) {
                    var r = this._objects.indexOf(t);
                    if (0 !== r) {
                        var n = this._findNewLowerIndex(t, r, e);
                        i(this._objects, t),
                        this._objects.splice(n, 0, t),
                        this.renderAll && this.renderAll()
                    }
                    return this
                },
                _findNewLowerIndex: function(t, e, i) {
                    var r;
                    if (i) {
                        r = e;
                        for (var n = e - 1; n >= 0; --n) if (t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) {
                            r = n;
                            break
                        }
                    } else r = e - 1;
                    return r
                },
                bringForward: function(t, e) {
                    var r = this._objects.indexOf(t);
                    if (r !== this._objects.length - 1) {
                        var n = this._findNewUpperIndex(t, r, e);
                        i(this._objects, t),
                        this._objects.splice(n, 0, t),
                        this.renderAll && this.renderAll()
                    }
                    return this
                },
                _findNewUpperIndex: function(t, e, i) {
                    var r;
                    if (i) {
                        r = e;
                        for (var n = e + 1; n < this._objects.length; ++n) if (t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) {
                            r = n;
                            break
                        }
                    } else r = e + 1;
                    return r
                },
                moveTo: function(t, e) {
                    return i(this._objects, t),
                    this._objects.splice(e, 0, t),
                    this.renderAll && this.renderAll()
                },
                dispose: function() {
                    return this.clear(),
                    this.interactive && this.removeListeners(),
                    this
                },
                toString: function() {
                    return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
                }
            }),
            t(fabric.StaticCanvas.prototype, fabric.Observable),
            t(fabric.StaticCanvas.prototype, fabric.Collection),
            t(fabric.StaticCanvas.prototype, fabric.DataURLExporter),
            t(fabric.StaticCanvas, {
                EMPTY_JSON: '{"objects": [], "background": "white"}',
                supports: function(t) {
                    var e = fabric.util.createCanvasElement();
                    if (!e || !e.getContext) return null;
                    var i = e.getContext("2d");
                    if (!i) return null;
                    switch (t) {
                    case "getImageData":
                        return void 0 !== i.getImageData;
                    case "setLineDash":
                        return void 0 !== i.setLineDash;
                    case "toDataURL":
                        return void 0 !== e.toDataURL;
                    case "toDataURLWithQuality":
                        try {
                            return e.toDataURL("image/jpeg", 0),
                            !0
                        } catch(t) {}
                        return ! 1;
                    default:
                        return null
                    }
                }
            }),
            fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
        }
    } (),
    fabric.BaseBrush = fabric.util.createClass({
        color: "rgb(0, 0, 0)",
        width: 1,
        shadow: null,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        setShadow: function(t) {
            return this.shadow = new fabric.Shadow(t),
            this
        },
        _setBrushStyles: function() {
            var t = this.canvas.contextTop;
            t.strokeStyle = this.color,
            t.lineWidth = this.width,
            t.lineCap = this.strokeLineCap,
            t.lineJoin = this.strokeLineJoin
        },
        _setShadow: function() {
            if (this.shadow) {
                var t = this.canvas.contextTop;
                t.shadowColor = this.shadow.color,
                t.shadowBlur = this.shadow.blur,
                t.shadowOffsetX = this.shadow.offsetX,
                t.shadowOffsetY = this.shadow.offsetY
            }
        },
        _resetShadow: function() {
            var t = this.canvas.contextTop;
            t.shadowColor = "",
            t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
        }
    }),
    function() {
        var t = fabric.util.array.min,
        e = fabric.util.array.max;
        fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
            initialize: function(t) {
                this.canvas = t,
                this._points = []
            },
            onMouseDown: function(t) {
                this._prepareForDrawing(t),
                this._captureDrawingPath(t),
                this._render()
            },
            onMouseMove: function(t) {
                this._captureDrawingPath(t),
                this.canvas.clearContext(this.canvas.contextTop),
                this._render()
            },
            onMouseUp: function() {
                this._finalizeAndAddPath()
            },
            _prepareForDrawing: function(t) {
                var e = new fabric.Point(t.x, t.y);
                this._reset(),
                this._addPoint(e),
                this.canvas.contextTop.moveTo(e.x, e.y)
            },
            _addPoint: function(t) {
                this._points.push(t)
            },
            _reset: function() {
                this._points.length = 0,
                this._setBrushStyles(),
                this._setShadow()
            },
            _captureDrawingPath: function(t) {
                var e = new fabric.Point(t.x, t.y);
                this._addPoint(e)
            },
            _render: function() {
                var t = this.canvas.contextTop,
                e = this.canvas.viewportTransform,
                i = this._points[0],
                r = this._points[1];
                t.save(),
                t.transform(e[0], e[1], e[2], e[3], e[4], e[5]),
                t.beginPath(),
                2 === this._points.length && i.x === r.x && i.y === r.y && (i.x -= .5, r.x += .5),
                t.moveTo(i.x, i.y);
                for (var n = 1,
                o = this._points.length; n < o; n++) {
                    var s = i.midPointFrom(r);
                    t.quadraticCurveTo(i.x, i.y, s.x, s.y),
                    i = this._points[n],
                    r = this._points[n + 1]
                }
                t.lineTo(i.x, i.y),
                t.stroke(),
                t.restore()
            },
            _getSVGPathData: function() {
                return this.box = this.getPathBoundingBox(this._points),
                this.convertPointsToSVGPath(this._points, this.box.minX, this.box.minY)
            },
            getPathBoundingBox: function(i) {
                for (var r = [], n = [], o = i[0], s = i[1], a = o, h = 1, c = i.length; h < c; h++) {
                    var l = o.midPointFrom(s);
                    r.push(a.x),
                    r.push(l.x),
                    n.push(a.y),
                    n.push(l.y),
                    o = i[h],
                    s = i[h + 1],
                    a = l
                }
                return r.push(o.x),
                n.push(o.y),
                {
                    minX: t(r),
                    minY: t(n),
                    maxX: e(r),
                    maxY: e(n)
                }
            },
            convertPointsToSVGPath: function(t, e, i) {
                var r = [],
                n = new fabric.Point(t[0].x - e, t[0].y - i),
                o = new fabric.Point(t[1].x - e, t[1].y - i);
                r.push("M ", t[0].x - e, " ", t[0].y - i, " ");
                for (var s = 1,
                a = t.length; s < a; s++) {
                    var h = n.midPointFrom(o);
                    r.push("Q ", n.x, " ", n.y, " ", h.x, " ", h.y, " "),
                    n = new fabric.Point(t[s].x - e, t[s].y - i),
                    s + 1 < t.length && (o = new fabric.Point(t[s + 1].x - e, t[s + 1].y - i))
                }
                return r.push("L ", n.x, " ", n.y, " "),
                r
            },
            createPath: function(t) {
                var e = new fabric.Path(t);
                return e.fill = null,
                e.stroke = this.color,
                e.strokeWidth = this.width,
                e.strokeLineCap = this.strokeLineCap,
                e.strokeLineJoin = this.strokeLineJoin,
                this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)),
                e
            },
            _finalizeAndAddPath: function() {
                this.canvas.contextTop.closePath();
                var t = this._getSVGPathData().join("");
                if ("M 0 0 Q 0 0 0 0 L 0 0" !== t) {
                    var e = this.box.minX + (this.box.maxX - this.box.minX) / 2,
                    i = this.box.minY + (this.box.maxY - this.box.minY) / 2;
                    this.canvas.contextTop.arc(e, i, 3, 0, 2 * Math.PI, !1);
                    var r = this.createPath(t);
                    r.set({
                        left: e,
                        top: i,
                        originX: "center",
                        originY: "center"
                    }),
                    this.canvas.add(r),
                    r.setCoords(),
                    this.canvas.clearContext(this.canvas.contextTop),
                    this._resetShadow(),
                    this.canvas.renderAll(),
                    this.canvas.fire("path:created", {
                        path: r
                    })
                } else this.canvas.renderAll()
            }
        })
    } (),
    fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        initialize: function(t) {
            this.canvas = t,
            this.points = []
        },
        drawDot: function(t) {
            var e = this.addPoint(t),
            i = this.canvas.contextTop,
            r = this.canvas.viewportTransform;
            i.save(),
            i.transform(r[0], r[1], r[2], r[3], r[4], r[5]),
            i.fillStyle = e.fill,
            i.beginPath(),
            i.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1),
            i.closePath(),
            i.fill(),
            i.restore()
        },
        onMouseDown: function(t) {
            this.points.length = 0,
            this.canvas.clearContext(this.canvas.contextTop),
            this._setShadow(),
            this.drawDot(t)
        },
        onMouseMove: function(t) {
            this.drawDot(t)
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for (var e = [], i = 0, r = this.points.length; i < r; i++) {
                var n = this.points[i],
                o = new fabric.Circle({
                    radius: n.radius,
                    left: n.x,
                    top: n.y,
                    originX: "center",
                    originY: "center",
                    fill: n.fill
                });
                this.shadow && o.setShadow(this.shadow),
                e.push(o)
            }
            var s = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            s.canvas = this.canvas,
            this.canvas.add(s),
            this.canvas.fire("path:created", {
                path: s
            }),
            this.canvas.clearContext(this.canvas.contextTop),
            this._resetShadow(),
            this.canvas.renderOnAddRemove = t,
            this.canvas.renderAll()
        },
        addPoint: function(t) {
            var e = new fabric.Point(t.x, t.y),
            i = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
            r = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
            return e.radius = i,
            e.fill = r,
            this.points.push(e),
            e
        }
    }),
    fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        density: 20,
        dotWidth: 1,
        dotWidthVariance: 1,
        randomOpacity: !1,
        optimizeOverlapping: !0,
        initialize: function(t) {
            this.canvas = t,
            this.sprayChunks = []
        },
        onMouseDown: function(t) {
            this.sprayChunks.length = 0,
            this.canvas.clearContext(this.canvas.contextTop),
            this._setShadow(),
            this.addSprayChunk(t),
            this.render()
        },
        onMouseMove: function(t) {
            this.addSprayChunk(t),
            this.render()
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for (var e = [], i = 0, r = this.sprayChunks.length; i < r; i++) for (var n = this.sprayChunks[i], o = 0, s = n.length; o < s; o++) {
                var a = new fabric.Rect({
                    width: n[o].width,
                    height: n[o].width,
                    left: n[o].x + 1,
                    top: n[o].y + 1,
                    originX: "center",
                    originY: "center",
                    fill: this.color
                });
                this.shadow && a.setShadow(this.shadow),
                e.push(a)
            }
            this.optimizeOverlapping && (e = this._getOptimizedRects(e));
            var h = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            h.canvas = this.canvas,
            this.canvas.add(h),
            this.canvas.fire("path:created", {
                path: h
            }),
            this.canvas.clearContext(this.canvas.contextTop),
            this._resetShadow(),
            this.canvas.renderOnAddRemove = t,
            this.canvas.renderAll()
        },
        _getOptimizedRects: function(t) {
            for (var e, i = {},
            r = 0,
            n = t.length; r < n; r++) i[e = t[r].left + "" + t[r].top] || (i[e] = t[r]);
            var o = [];
            for (e in i) o.push(i[e]);
            return o
        },
        render: function() {
            var t = this.canvas.contextTop;
            t.fillStyle = this.color;
            var e = this.canvas.viewportTransform;
            t.save(),
            t.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
            for (var i = 0,
            r = this.sprayChunkPoints.length; i < r; i++) {
                var n = this.sprayChunkPoints[i];
                void 0 !== n.opacity && (t.globalAlpha = n.opacity),
                t.fillRect(n.x, n.y, n.width, n.width)
            }
            t.restore()
        },
        addSprayChunk: function(t) {
            this.sprayChunkPoints = [];
            for (var e, i, r, n = this.width / 2,
            o = 0; o < this.density; o++) {
                e = fabric.util.getRandomInt(t.x - n, t.x + n),
                i = fabric.util.getRandomInt(t.y - n, t.y + n),
                r = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
                var s = new fabric.Point(e, i);
                s.width = r,
                this.randomOpacity && (s.opacity = fabric.util.getRandomInt(0, 100) / 100),
                this.sprayChunkPoints.push(s)
            }
            this.sprayChunks.push(this.sprayChunkPoints)
        }
    }),
    fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
        getPatternSrc: function() {
            var t = fabric.document.createElement("canvas"),
            e = t.getContext("2d");
            return t.width = t.height = 25,
            e.fillStyle = this.color,
            e.beginPath(),
            e.arc(10, 10, 10, 0, 2 * Math.PI, !1),
            e.closePath(),
            e.fill(),
            t
        },
        getPatternSrcFunction: function() {
            return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
        },
        getPattern: function() {
            return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
        },
        _setBrushStyles: function() {
            this.callSuper("_setBrushStyles"),
            this.canvas.contextTop.strokeStyle = this.getPattern()
        },
        createPath: function(t) {
            var e = this.callSuper("createPath", t);
            return e.stroke = new fabric.Pattern({
                source: this.source || this.getPatternSrcFunction()
            }),
            e
        }
    }),
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(t) {
            t || (t = {});
            var e = t.format || "png",
            i = t.quality || 1,
            r = t.multiplier || 1,
            n = {
                left: t.left,
                top: t.top,
                width: t.width,
                height: t.height
            };
            return 1 !== r ? this.__toDataURLWithMultiplier(e, i, n, r) : this.__toDataURL(e, i, n)
        },
        __toDataURL: function(t, e, i) {
            this.renderAll(!0);
            var r = this.upperCanvasEl || this.lowerCanvasEl,
            n = this.__getCroppedCanvas(r, i);
            "jpg" === t && (t = "jpeg");
            var o = fabric.StaticCanvas.supports("toDataURLWithQuality") ? (n || r).toDataURL("image/" + t, e) : (n || r).toDataURL("image/" + t);
            return this.contextTop && this.clearContext(this.contextTop),
            this.renderAll(),
            n && (n = null),
            o
        },
        __getCroppedCanvas: function(t, e) {
            var i, r;
            return ("left" in e || "top" in e || "width" in e || "height" in e) && (r = (i = fabric.util.createCanvasElement()).getContext("2d"), i.width = e.width || this.width, i.height = e.height || this.height, r.drawImage(t, -e.left || 0, -e.top || 0)),
            i
        },
        __toDataURLWithMultiplier: function(t, e, i, r) {
            var n = this.getWidth(),
            o = this.getHeight(),
            s = n * r,
            a = o * r,
            h = this.getActiveObject(),
            c = this.getActiveGroup(),
            l = this.contextTop || this.contextContainer;
            r > 1 && this.setWidth(s).setHeight(a),
            l.scale(r, r),
            i.left && (i.left *= r),
            i.top && (i.top *= r),
            i.width ? i.width *= r: r < 1 && (i.width = s),
            i.height ? i.height *= r: r < 1 && (i.height = a),
            c ? this._tempRemoveBordersControlsFromGroup(c) : h && this.deactivateAll && this.deactivateAll(),
            this.renderAll(!0);
            var u = this.__toDataURL(t, e, i);
            return this.width = n,
            this.height = o,
            l.scale(1 / r, 1 / r),
            this.setWidth(n).setHeight(o),
            c ? this._restoreBordersControlsOnGroup(c) : h && this.setActiveObject && this.setActiveObject(h),
            this.contextTop && this.clearContext(this.contextTop),
            this.renderAll(),
            u
        },
        toDataURLWithMultiplier: function(t, e, i) {
            return this.toDataURL({
                format: t,
                multiplier: e,
                quality: i
            })
        },
        _tempRemoveBordersControlsFromGroup: function(t) {
            t.origHasControls = t.hasControls,
            t.origBorderColor = t.borderColor,
            t.hasControls = !0,
            t.borderColor = "rgba(0,0,0,0)",
            t.forEachObject(function(t) {
                t.origBorderColor = t.borderColor,
                t.borderColor = "rgba(0,0,0,0)"
            })
        },
        _restoreBordersControlsOnGroup: function(t) {
            t.hideControls = t.origHideControls,
            t.borderColor = t.origBorderColor,
            t.forEachObject(function(t) {
                t.borderColor = t.origBorderColor,
                delete t.origBorderColor
            })
        }
    }),
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        loadFromDatalessJSON: function(t, e, i) {
            return this.loadFromJSON(t, e, i)
        },
        loadFromJSON: function(t, e, i) {
            if (t) {
                var r = "string" == typeof t ? JSON.parse(t) : t;
                this.clear();
                var n = this;
                return this._enlivenObjects(r.objects,
                function() {
                    n._setBgOverlay(r, e)
                },
                i),
                this
            }
        },
        _setBgOverlay: function(t, e) {
            var i = this,
            r = {
                backgroundColor: !1,
                overlayColor: !1,
                backgroundImage: !1,
                overlayImage: !1
            };
            if (t.backgroundImage || t.overlayImage || t.background || t.overlay) {
                var n = function() {
                    r.backgroundImage && r.overlayImage && r.backgroundColor && r.overlayColor && (i.renderAll(), e && e())
                };
                this.__setBgOverlay("backgroundImage", t.backgroundImage, r, n),
                this.__setBgOverlay("overlayImage", t.overlayImage, r, n),
                this.__setBgOverlay("backgroundColor", t.background, r, n),
                this.__setBgOverlay("overlayColor", t.overlay, r, n),
                n()
            } else e && e()
        },
        __setBgOverlay: function(t, e, i, r) {
            var n = this;
            e ? "backgroundImage" === t || "overlayImage" === t ? fabric.Image.fromObject(e,
            function(e) {
                n[t] = e,
                i[t] = !0,
                r && r()
            }) : this["set" + fabric.util.string.capitalize(t, !0)](e,
            function() {
                i[t] = !0,
                r && r()
            }) : i[t] = !0
        },
        _enlivenObjects: function(t, e, i) {
            var r = this;
            if (t && 0 !== t.length) {
                var n = this.renderOnAddRemove;
                this.renderOnAddRemove = !1,
                fabric.util.enlivenObjects(t,
                function(t) {
                    t.forEach(function(t, e) {
                        r.insertAt(t, e, !0)
                    }),
                    r.renderOnAddRemove = n,
                    e && e()
                },
                null, i)
            } else e && e()
        },
        _toDataURL: function(t, e) {
            this.clone(function(i) {
                e(i.toDataURL(t))
            })
        },
        _toDataURLWithMultiplier: function(t, e, i) {
            this.clone(function(r) {
                i(r.toDataURLWithMultiplier(t, e))
            })
        },
        clone: function(t, e) {
            var i = JSON.stringify(this.toJSON(e));
            this.cloneWithoutData(function(e) {
                e.loadFromJSON(i,
                function() {
                    t && t(e)
                })
            })
        },
        cloneWithoutData: function(t) {
            var e = fabric.document.createElement("canvas");
            e.width = this.getWidth(),
            e.height = this.getHeight();
            var i = new fabric.Canvas(e);
            i.clipTo = this.clipTo,
            this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src,
            function() {
                i.renderAll(),
                t && t(i)
            }), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend,
        r = e.util.toFixed,
        n = e.util.string.capitalize,
        o = e.util.degreesToRadians,
        s = e.StaticCanvas.supports("setLineDash");
        e.Object || (e.Object = e.util.createClass({
            type: "object",
            originX: "left",
            originY: "top",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            scaleX: 1,
            scaleY: 1,
            flipX: !1,
            flipY: !1,
            opacity: 1,
            angle: 0,
            cornerSize: 12,
            transparentCorners: !0,
            hoverCursor: null,
            padding: 0,
            borderColor: "rgba(102,153,255,0.75)",
            cornerColor: "rgba(102,153,255,0.5)",
            centeredScaling: !1,
            centeredRotation: !0,
            fill: "rgb(0,0,0)",
            fillRule: "source-over",
            backgroundColor: "",
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeLineJoin: "miter",
            strokeMiterLimit: 10,
            shadow: null,
            borderOpacityWhenMoving: .4,
            borderScaleFactor: 1,
            transformMatrix: null,
            minScaleLimit: .01,
            selectable: !0,
            evented: !0,
            visible: !0,
            hasControls: !0,
            hasBorders: !0,
            hasRotatingPoint: !0,
            rotatingPointOffset: 40,
            perPixelTargetFind: !1,
            includeDefaultValues: !0,
            clipTo: null,
            lockMovementX: !1,
            lockMovementY: !1,
            lockRotation: !1,
            lockScalingX: !1,
            lockScalingY: !1,
            lockUniScaling: !1,
            lockScalingFlip: !1,
            stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule shadow clipTo visible backgroundColor".split(" "),
            initialize: function(t) {
                t && this.setOptions(t)
            },
            _initGradient: function(t) { ! t.fill || !t.fill.colorStops || t.fill instanceof e.Gradient || this.set("fill", new e.Gradient(t.fill))
            },
            _initPattern: function(t) { ! t.fill || !t.fill.source || t.fill instanceof e.Pattern || this.set("fill", new e.Pattern(t.fill)),
                !t.stroke || !t.stroke.source || t.stroke instanceof e.Pattern || this.set("stroke", new e.Pattern(t.stroke))
            },
            _initClipping: function(t) {
                if (t.clipTo && "string" == typeof t.clipTo) {
                    var i = e.util.getFunctionBody(t.clipTo);
                    void 0 !== i && (this.clipTo = new Function("ctx", i))
                }
            },
            setOptions: function(t) {
                for (var e in t) this.set(e, t[e]);
                this._initGradient(t),
                this._initPattern(t),
                this._initClipping(t)
            },
            transform: function(t, e) {
                this.group && this.group.transform(t, e),
                t.globalAlpha = this.opacity;
                var i = e ? this._getLeftTopCoords() : this.getCenterPoint();
                t.translate(i.x, i.y),
                t.rotate(o(this.angle)),
                t.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1))
            },
            toObject: function(t) {
                var i = e.Object.NUM_FRACTION_DIGITS,
                n = {
                    type: this.type,
                    originX: this.originX,
                    originY: this.originY,
                    left: r(this.left, i),
                    top: r(this.top, i),
                    width: r(this.width, i),
                    height: r(this.height, i),
                    fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                    stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                    strokeWidth: r(this.strokeWidth, i),
                    strokeDashArray: this.strokeDashArray,
                    strokeLineCap: this.strokeLineCap,
                    strokeLineJoin: this.strokeLineJoin,
                    strokeMiterLimit: r(this.strokeMiterLimit, i),
                    scaleX: r(this.scaleX, i),
                    scaleY: r(this.scaleY, i),
                    angle: r(this.getAngle(), i),
                    flipX: this.flipX,
                    flipY: this.flipY,
                    opacity: r(this.opacity, i),
                    shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                    visible: this.visible,
                    clipTo: this.clipTo && String(this.clipTo),
                    backgroundColor: this.backgroundColor
                };
                return this.includeDefaultValues || (n = this._removeDefaultValues(n)),
                e.util.populateWithProperties(this, n, t),
                n
            },
            toDatalessObject: function(t) {
                return this.toObject(t)
            },
            _removeDefaultValues: function(t) {
                var i = e.util.getKlass(t.type).prototype;
                return i.stateProperties.forEach(function(e) {
                    t[e] === i[e] && delete t[e]
                }),
                t
            },
            toString: function() {
                return "#<fabric." + n(this.type) + ">"
            },
            get: function(t) {
                return this[t]
            },
            _setObject: function(t) {
                for (var e in t) this._set(e, t[e])
            },
            set: function(t, e) {
                return "object" == typeof t ? this._setObject(t) : "function" == typeof e && "clipTo" !== t ? this._set(t, e(this.get(t))) : this._set(t, e),
                this
            },
            _set: function(t, i) {
                return ("scaleX" === t || "scaleY" === t) && (i = this._constrainScale(i)),
                "scaleX" === t && i < 0 ? (this.flipX = !this.flipX, i *= -1) : "scaleY" === t && i < 0 ? (this.flipY = !this.flipY, i *= -1) : "width" === t || "height" === t ? this.minScaleLimit = r(Math.min(.1, 1 / Math.max(this.width, this.height)), 2) : "shadow" !== t || !i || i instanceof e.Shadow || (i = new e.Shadow(i)),
                this[t] = i,
                this
            },
            toggle: function(t) {
                var e = this.get(t);
                return "boolean" == typeof e && this.set(t, !e),
                this
            },
            setSourcePath: function(t) {
                return this.sourcePath = t,
                this
            },
            getViewportTransform: function() {
                return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform: [1, 0, 0, 1, 0, 0]
            },
            render: function(t, i) {
                if (0 !== this.width && 0 !== this.height && this.visible) {
                    if (t.save(), this._setupFillRule(t), this._transform(t, i), this._setStrokeStyles(t), this._setFillStyles(t), this.group && "path-group" === this.group.type) {
                        t.translate( - this.group.width / 2, -this.group.height / 2);
                        var r = this.transformMatrix;
                        r && t.transform.apply(t, r)
                    }
                    t.globalAlpha = this.group ? t.globalAlpha * this.opacity: this.opacity,
                    this._setShadow(t),
                    this.clipTo && e.util.clipContext(this, t),
                    this._render(t, i),
                    this.clipTo && t.restore(),
                    this._removeShadow(t),
                    this._restoreFillRule(t),
                    t.restore()
                }
            },
            _transform: function(t, e) {
                var i = this.transformMatrix;
                i && !this.group && t.setTransform.apply(t, i),
                e || this.transform(t)
            },
            _setStrokeStyles: function(t) {
                this.stroke && (t.lineWidth = this.strokeWidth, t.lineCap = this.strokeLineCap, t.lineJoin = this.strokeLineJoin, t.miterLimit = this.strokeMiterLimit, t.strokeStyle = this.stroke.toLive ? this.stroke.toLive(t) : this.stroke)
            },
            _setFillStyles: function(t) {
                this.fill && (t.fillStyle = this.fill.toLive ? this.fill.toLive(t) : this.fill)
            },
            _renderControls: function(t, i) {
                var r = this.getViewportTransform();
                if (t.save(), this.active && !i) {
                    var n;
                    this.group && (n = e.util.transformPoint(this.group.getCenterPoint(), r), t.translate(n.x, n.y), t.rotate(o(this.group.angle))),
                    n = e.util.transformPoint(this.getCenterPoint(), r, null != this.group),
                    this.group && (n.x *= this.group.scaleX, n.y *= this.group.scaleY),
                    t.translate(n.x, n.y),
                    t.rotate(o(this.angle)),
                    this.drawBorders(t),
                    this.drawControls(t)
                }
                t.restore()
            },
            _setShadow: function(t) {
                this.shadow && (t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur, t.shadowOffsetX = this.shadow.offsetX, t.shadowOffsetY = this.shadow.offsetY)
            },
            _removeShadow: function(t) {
                this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
            },
            _renderFill: function(t) {
                if (this.fill) {
                    if (t.save(), this.fill.toLive && t.translate( - this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0), this.fill.gradientTransform) {
                        var e = this.fill.gradientTransform;
                        t.transform.apply(t, e)
                    }
                    "destination-over" === this.fillRule ? t.fill("evenodd") : t.fill(),
                    t.restore(),
                    this.shadow && !this.shadow.affectStroke && this._removeShadow(t)
                }
            },
            _renderStroke: function(t) {
                if (this.stroke && 0 !== this.strokeWidth) {
                    if (t.save(), this.strokeDashArray) 1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray),
                    s ? (t.setLineDash(this.strokeDashArray), this._stroke && this._stroke(t)) : this._renderDashedStroke && this._renderDashedStroke(t),
                    t.stroke();
                    else {
                        if (this.stroke.gradientTransform) {
                            var e = this.stroke.gradientTransform;
                            t.transform.apply(t, e)
                        }
                        this._stroke ? this._stroke(t) : t.stroke()
                    }
                    this._removeShadow(t),
                    t.restore()
                }
            },
            clone: function(t, i) {
                return this.constructor.fromObject ? this.constructor.fromObject(this.toObject(i), t) : new e.Object(this.toObject(i))
            },
            cloneAsImage: function(t) {
                var i = this.toDataURL();
                return e.util.loadImage(i,
                function(i) {
                    t && t(new e.Image(i))
                }),
                this
            },
            toDataURL: function(t) {
                t || (t = {});
                var i = e.util.createCanvasElement(),
                r = this.getBoundingRect();
                i.width = r.width,
                i.height = r.height,
                e.util.wrapElement(i, "div");
                var n = new e.Canvas(i);
                "jpg" === t.format && (t.format = "jpeg"),
                "jpeg" === t.format && (n.backgroundColor = "#fff");
                var o = {
                    active: this.get("active"),
                    left: this.getLeft(),
                    top: this.getTop()
                };
                this.set("active", !1),
                this.setPositionByOrigin(new e.Point(i.width / 2, i.height / 2), "center", "center");
                var s = this.canvas;
                n.add(this);
                var a = n.toDataURL(t);
                return this.set(o).setCoords(),
                this.canvas = s,
                n.dispose(),
                n = null,
                a
            },
            isType: function(t) {
                return this.type === t
            },
            complexity: function() {
                return 0
            },
            toJSON: function(t) {
                return this.toObject(t)
            },
            setGradient: function(t, i) {
                i || (i = {});
                var r = {
                    colorStops: []
                };
                r.type = i.type || (i.r1 || i.r2 ? "radial": "linear"),
                r.coords = {
                    x1: i.x1,
                    y1: i.y1,
                    x2: i.x2,
                    y2: i.y2
                },
                (i.r1 || i.r2) && (r.coords.r1 = i.r1, r.coords.r2 = i.r2);
                for (var n in i.colorStops) {
                    var o = new e.Color(i.colorStops[n]);
                    r.colorStops.push({
                        offset: n,
                        color: o.toRgb(),
                        opacity: o.getAlpha()
                    })
                }
                return this.set(t, e.Gradient.forObject(this, r))
            },
            setPatternFill: function(t) {
                return this.set("fill", new e.Pattern(t))
            },
            setShadow: function(t) {
                return this.set("shadow", t ? new e.Shadow(t) : null)
            },
            setColor: function(t) {
                return this.set("fill", t),
                this
            },
            setAngle: function(t) {
                var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
                return e && this._setOriginToCenter(),
                this.set("angle", t),
                e && this._resetOrigin(),
                this
            },
            centerH: function() {
                return this.canvas.centerObjectH(this),
                this
            },
            centerV: function() {
                return this.canvas.centerObjectV(this),
                this
            },
            center: function() {
                return this.canvas.centerObject(this),
                this
            },
            remove: function() {
                return this.canvas.remove(this),
                this
            },
            getLocalPointer: function(t, e) {
                e = e || this.canvas.getPointer(t);
                var i = this.translateToOriginPoint(this.getCenterPoint(), "left", "top");
                return {
                    x: e.x - i.x,
                    y: e.y - i.y
                }
            },
            _setupFillRule: function(t) {
                this.fillRule && (this._prevFillRule = t.globalCompositeOperation, t.globalCompositeOperation = this.fillRule)
            },
            _restoreFillRule: function(t) {
                this.fillRule && this._prevFillRule && (t.globalCompositeOperation = this._prevFillRule)
            }
        }), e.util.createAccessors(e.Object), e.Object.prototype.rotate = e.Object.prototype.setAngle, i(e.Object.prototype, e.Observable), e.Object.NUM_FRACTION_DIGITS = 2, e.Object.__uid = 0)
    } (void 0 !== exports ? exports: this),
    function() {
        var t = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            translateToCenterPoint: function(e, i, r) {
                var n = e.x,
                o = e.y,
                s = this.stroke ? this.strokeWidth: 0;
                return "left" === i ? n = e.x + (this.getWidth() + s * this.scaleX) / 2 : "right" === i && (n = e.x - (this.getWidth() + s * this.scaleX) / 2),
                "top" === r ? o = e.y + (this.getHeight() + s * this.scaleY) / 2 : "bottom" === r && (o = e.y - (this.getHeight() + s * this.scaleY) / 2),
                fabric.util.rotatePoint(new fabric.Point(n, o), e, t(this.angle))
            },
            translateToOriginPoint: function(e, i, r) {
                var n = e.x,
                o = e.y,
                s = this.stroke ? this.strokeWidth: 0;
                return "left" === i ? n = e.x - (this.getWidth() + s * this.scaleX) / 2 : "right" === i && (n = e.x + (this.getWidth() + s * this.scaleX) / 2),
                "top" === r ? o = e.y - (this.getHeight() + s * this.scaleY) / 2 : "bottom" === r && (o = e.y + (this.getHeight() + s * this.scaleY) / 2),
                fabric.util.rotatePoint(new fabric.Point(n, o), e, t(this.angle))
            },
            getCenterPoint: function() {
                var t = new fabric.Point(this.left, this.top);
                return this.translateToCenterPoint(t, this.originX, this.originY)
            },
            getPointByOrigin: function(t, e) {
                var i = this.getCenterPoint();
                return this.translateToOriginPoint(i, t, e)
            },
            toLocalPoint: function(e, i, r) {
                var n, o, s = this.getCenterPoint(),
                a = this.stroke ? this.strokeWidth: 0;
                return i && r ? (n = "left" === i ? s.x - (this.getWidth() + a * this.scaleX) / 2 : "right" === i ? s.x + (this.getWidth() + a * this.scaleX) / 2 : s.x, o = "top" === r ? s.y - (this.getHeight() + a * this.scaleY) / 2 : "bottom" === r ? s.y + (this.getHeight() + a * this.scaleY) / 2 : s.y) : (n = this.left, o = this.top),
                fabric.util.rotatePoint(new fabric.Point(e.x, e.y), s, -t(this.angle)).subtractEquals(new fabric.Point(n, o))
            },
            setPositionByOrigin: function(t, e, i) {
                var r = this.translateToCenterPoint(t, e, i),
                n = this.translateToOriginPoint(r, this.originX, this.originY);
                this.set("left", n.x),
                this.set("top", n.y)
            },
            adjustPosition: function(e) {
                var i = t(this.angle),
                r = this.getWidth() / 2,
                n = Math.cos(i) * r,
                o = Math.sin(i) * r,
                s = this.getWidth(),
                a = Math.cos(i) * s,
                h = Math.sin(i) * s;
                "center" === this.originX && "left" === e || "right" === this.originX && "center" === e ? (this.left -= n, this.top -= o) : "left" === this.originX && "center" === e || "center" === this.originX && "right" === e ? (this.left += n, this.top += o) : "left" === this.originX && "right" === e ? (this.left += a, this.top += h) : "right" === this.originX && "left" === e && (this.left -= a, this.top -= h),
                this.setCoords(),
                this.originX = e
            },
            _setOriginToCenter: function() {
                this._originalOriginX = this.originX,
                this._originalOriginY = this.originY;
                var t = this.getCenterPoint();
                this.originX = "center",
                this.originY = "center",
                this.left = t.x,
                this.top = t.y
            },
            _resetOrigin: function() {
                var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
                this.originX = this._originalOriginX,
                this.originY = this._originalOriginY,
                this.left = t.x,
                this.top = t.y,
                this._originalOriginX = null,
                this._originalOriginY = null
            },
            _getLeftTopCoords: function() {
                return this.translateToOriginPoint(this.getCenterPoint(), "left", "center")
            }
        })
    } (),
    function() {
        var t = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            oCoords: null,
            intersectsWithRect: function(t, e) {
                var i = this.oCoords,
                r = new fabric.Point(i.tl.x, i.tl.y),
                n = new fabric.Point(i.tr.x, i.tr.y),
                o = new fabric.Point(i.bl.x, i.bl.y),
                s = new fabric.Point(i.br.x, i.br.y);
                return "Intersection" === fabric.Intersection.intersectPolygonRectangle([r, n, s, o], t, e).status
            },
            intersectsWithObject: function(t) {
                function e(t) {
                    return {
                        tl: new fabric.Point(t.tl.x, t.tl.y),
                        tr: new fabric.Point(t.tr.x, t.tr.y),
                        bl: new fabric.Point(t.bl.x, t.bl.y),
                        br: new fabric.Point(t.br.x, t.br.y)
                    }
                }
                var i = e(this.oCoords),
                r = e(t.oCoords);
                return "Intersection" === fabric.Intersection.intersectPolygonPolygon([i.tl, i.tr, i.br, i.bl], [r.tl, r.tr, r.br, r.bl]).status
            },
            isContainedWithinObject: function(t) {
                var e = t.getBoundingRect(),
                i = new fabric.Point(e.left, e.top),
                r = new fabric.Point(e.left + e.width, e.top + e.height);
                return this.isContainedWithinRect(i, r)
            },
            isContainedWithinRect: function(t, e) {
                var i = this.getBoundingRect();
                return i.left >= t.x && i.left + i.width <= e.x && i.top >= t.y && i.top + i.height <= e.y
            },
            containsPoint: function(t) {
                var e = this._getImageLines(this.oCoords),
                i = this._findCrossPoints(t, e);
                return 0 !== i && i % 2 == 1
            },
            _getImageLines: function(t) {
                return {
                    topline: {
                        o: t.tl,
                        d: t.tr
                    },
                    rightline: {
                        o: t.tr,
                        d: t.br
                    },
                    bottomline: {
                        o: t.br,
                        d: t.bl
                    },
                    leftline: {
                        o: t.bl,
                        d: t.tl
                    }
                }
            },
            _findCrossPoints: function(t, e) {
                var i, r, n, o, s, a = 0;
                for (var h in e) if (! ((s = e[h]).o.y < t.y && s.d.y < t.y || s.o.y >= t.y && s.d.y >= t.y || (s.o.x === s.d.x && s.o.x >= t.x ? (o = s.o.x, t.y) : (i = 0, r = (s.d.y - s.o.y) / (s.d.x - s.o.x), (n = t.y - i * t.x) + i * (o = -(n - (s.o.y - r * s.o.x)) / (i - r))), o >= t.x && (a += 1), 2 !== a))) break;
                return a
            },
            getBoundingRectWidth: function() {
                return this.getBoundingRect().width
            },
            getBoundingRectHeight: function() {
                return this.getBoundingRect().height
            },
            getBoundingRect: function() {
                this.oCoords || this.setCoords();
                var t = [this.oCoords.tl.x, this.oCoords.tr.x, this.oCoords.br.x, this.oCoords.bl.x],
                e = fabric.util.array.min(t),
                i = fabric.util.array.max(t),
                r = Math.abs(e - i),
                n = [this.oCoords.tl.y, this.oCoords.tr.y, this.oCoords.br.y, this.oCoords.bl.y],
                o = fabric.util.array.min(n),
                s = fabric.util.array.max(n);
                return {
                    left: e,
                    top: o,
                    width: r,
                    height: Math.abs(o - s)
                }
            },
            getWidth: function() {
                return this.width * this.scaleX
            },
            getHeight: function() {
                return this.height * this.scaleY
            },
            _constrainScale: function(t) {
                return Math.abs(t) < this.minScaleLimit ? t < 0 ? -this.minScaleLimit: this.minScaleLimit: t
            },
            scale: function(t) {
                return (t = this._constrainScale(t)) < 0 && (this.flipX = !this.flipX, this.flipY = !this.flipY, t *= -1),
                this.scaleX = t,
                this.scaleY = t,
                this.setCoords(),
                this
            },
            scaleToWidth: function(t) {
                var e = this.getBoundingRectWidth() / this.getWidth();
                return this.scale(t / this.width / e)
            },
            scaleToHeight: function(t) {
                var e = this.getBoundingRectHeight() / this.getHeight();
                return this.scale(t / this.height / e)
            },
            setCoords: function() {
                var e = this.strokeWidth > 1 ? this.strokeWidth: 0,
                i = t(this.angle),
                r = this.getViewportTransform(),
                n = function(t) {
                    return fabric.util.transformPoint(t, r)
                },
                o = this.width,
                s = this.height,
                a = "round" === this.strokeLineCap || "square" === this.strokeLineCap,
                h = "line" === this.type && 1 === this.width,
                c = "line" === this.type && 1 === this.height,
                l = a && c || "line" !== this.type,
                u = a && h || "line" !== this.type;
                h ? o = e: c && (s = e),
                l && (o += e),
                u && (s += e),
                this.currentWidth = o * this.scaleX,
                this.currentHeight = s * this.scaleY,
                this.currentWidth < 0 && (this.currentWidth = Math.abs(this.currentWidth));
                var f = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2)),
                d = Math.atan(isFinite(this.currentHeight / this.currentWidth) ? this.currentHeight / this.currentWidth: 0),
                p = Math.cos(d + i) * f,
                g = Math.sin(d + i) * f,
                m = Math.sin(i),
                v = Math.cos(i),
                b = this.getCenterPoint(),
                y = new fabric.Point(this.currentWidth, this.currentHeight),
                x = new fabric.Point(b.x - p, b.y - g),
                w = new fabric.Point(x.x + y.x * v, x.y + y.x * m),
                S = new fabric.Point(x.x - y.y * m, x.y + y.y * v),
                C = new fabric.Point(x.x + y.x / 2 * v, x.y + y.x / 2 * m),
                _ = n(x),
                T = n(w),
                O = n(new fabric.Point(w.x - y.y * m, w.y + y.y * v)),
                k = n(S),
                E = n(new fabric.Point(x.x - y.y / 2 * m, x.y + y.y / 2 * v)),
                A = n(C),
                j = n(new fabric.Point(w.x - y.y / 2 * m, w.y + y.y / 2 * v)),
                I = n(new fabric.Point(S.x + y.x / 2 * v, S.y + y.x / 2 * m)),
                P = n(new fabric.Point(C.x, C.y)),
                M = Math.cos(d + i) * this.padding * Math.sqrt(2),
                D = Math.sin(d + i) * this.padding * Math.sqrt(2);
                return _ = _.add(new fabric.Point( - M, -D)),
                T = T.add(new fabric.Point(D, -M)),
                O = O.add(new fabric.Point(M, D)),
                k = k.add(new fabric.Point( - D, M)),
                E = E.add(new fabric.Point(( - M - D) / 2, ( - D + M) / 2)),
                A = A.add(new fabric.Point((D - M) / 2, -(D + M) / 2)),
                j = j.add(new fabric.Point((D + M) / 2, (D - M) / 2)),
                I = I.add(new fabric.Point((M - D) / 2, (M + D) / 2)),
                P = P.add(new fabric.Point((D - M) / 2, -(D + M) / 2)),
                this.oCoords = {
                    tl: _,
                    tr: T,
                    br: O,
                    bl: k,
                    ml: E,
                    mt: A,
                    mr: j,
                    mb: I,
                    mtr: P
                },
                this._setCornerCoords && this._setCornerCoords(),
                this
            }
        })
    } (),
    fabric.util.object.extend(fabric.Object.prototype, {
        sendToBack: function() {
            return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this),
            this
        },
        bringToFront: function() {
            return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this),
            this
        },
        sendBackwards: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t),
            this
        },
        bringForward: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t),
            this
        },
        moveTo: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t),
            this
        }
    }),
    fabric.util.object.extend(fabric.Object.prototype, {
        getSvgStyles: function() {
            var t = this.fill ? this.fill.toLive ? "url(#SVGID_" + this.fill.id + ")": this.fill: "none",
            e = "destination-over" === this.fillRule ? "evenodd": this.fillRule,
            i = this.stroke ? this.stroke.toLive ? "url(#SVGID_" + this.stroke.id + ")": this.stroke: "none",
            r = this.strokeWidth ? this.strokeWidth: "0",
            n = this.strokeDashArray ? this.strokeDashArray.join(" ") : "",
            o = this.strokeLineCap ? this.strokeLineCap: "butt",
            s = this.strokeLineJoin ? this.strokeLineJoin: "miter",
            a = this.strokeMiterLimit ? this.strokeMiterLimit: "4",
            h = void 0 !== this.opacity ? this.opacity: "1",
            c = this.visible ? "": " visibility: hidden;";
            return ["stroke: ", i, "; ", "stroke-width: ", r, "; ", "stroke-dasharray: ", n, "; ", "stroke-linecap: ", o, "; ", "stroke-linejoin: ", s, "; ", "stroke-miterlimit: ", a, "; ", "fill: ", t, "; ", "fill-rule: ", e, "; ", "opacity: ", h, ";", this.shadow && "text" !== this.type ? "filter: url(#SVGID_" + this.shadow.id + ");": "", c].join("")
        },
        getSvgTransform: function() {
            if (this.group) return "";
            var t = fabric.util.toFixed,
            e = this.getAngle(),
            i = !this.canvas || this.canvas.svgViewportTransformation ? this.getViewportTransform() : [1, 0, 0, 1, 0, 0],
            r = fabric.util.transformPoint(this.getCenterPoint(), i),
            n = fabric.Object.NUM_FRACTION_DIGITS,
            o = "path-group" === this.type ? "": "translate(" + t(r.x, n) + " " + t(r.y, n) + ")",
            s = 0 !== e ? " rotate(" + t(e, n) + ")": "",
            a = 1 === this.scaleX && 1 === this.scaleY && 1 === i[0] && 1 === i[3] ? "": " scale(" + t(this.scaleX * i[0], n) + " " + t(this.scaleY * i[3], n) + ")",
            h = "path-group" === this.type ? this.width * i[0] : 0,
            c = this.flipX ? " matrix(-1 0 0 1 " + h + " 0) ": "",
            l = "path-group" === this.type ? this.height * i[3] : 0;
            return [o, s, a, c, this.flipY ? " matrix(1 0 0 -1 0 " + l + ")": ""].join("")
        },
        getSvgTransformMatrix: function() {
            return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ")": ""
        },
        _createBaseSVGMarkup: function() {
            var t = [];
            return this.fill && this.fill.toLive && t.push(this.fill.toSVG(this, !1)),
            this.stroke && this.stroke.toLive && t.push(this.stroke.toSVG(this, !1)),
            this.shadow && t.push(this.shadow.toSVG(this)),
            t
        }
    }),
    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function() {
            return this.stateProperties.some(function(t) {
                return this.get(t) !== this.originalState[t]
            },
            this)
        },
        saveState: function(t) {
            return this.stateProperties.forEach(function(t) {
                this.originalState[t] = this.get(t)
            },
            this),
            t && t.stateProperties && t.stateProperties.forEach(function(t) {
                this.originalState[t] = this.get(t)
            },
            this),
            this
        },
        setupState: function() {
            return this.originalState = {},
            this.saveState(),
            this
        }
    }),
    function(t) {
        "use strict";
        function e(t, e) {
            var i = t.origin,
            r = t.axis1,
            n = t.axis2,
            o = t.dimension,
            s = e.nearest,
            a = e.center,
            h = e.farthest;
            return function() {
                switch (this.get(i)) {
                case s:
                    return Math.min(this.get(r), this.get(n));
                case a:
                    return Math.min(this.get(r), this.get(n)) + .5 * this.get(o);
                case h:
                    return Math.max(this.get(r), this.get(n))
                }
            }
        }
        var i = t.fabric || (t.fabric = {}),
        r = i.util.object.extend,
        n = {
            x1: 1,
            x2: 1,
            y1: 1,
            y2: 1
        },
        o = i.StaticCanvas.supports("setLineDash");
        i.Line ? i.warn("fabric.Line is already defined") : (i.Line = i.util.createClass(i.Object, {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            initialize: function(t, e) {
                e = e || {},
                t || (t = [0, 0, 0, 0]),
                this.callSuper("initialize", e),
                this.set("x1", t[0]),
                this.set("y1", t[1]),
                this.set("x2", t[2]),
                this.set("y2", t[3]),
                this._setWidthHeight(e)
            },
            _setWidthHeight: function(t) {
                t || (t = {}),
                this.width = Math.abs(this.x2 - this.x1) || 1,
                this.height = Math.abs(this.y2 - this.y1) || 1,
                this.left = "left" in t ? t.left: this._getLeftToOriginX(),
                this.top = "top" in t ? t.top: this._getTopToOriginY()
            },
            _set: function(t, e) {
                return this[t] = e,
                void 0 !== n[t] && this._setWidthHeight(),
                this
            },
            _getLeftToOriginX: e({
                origin: "originX",
                axis1: "x1",
                axis2: "x2",
                dimension: "width"
            },
            {
                nearest: "left",
                center: "center",
                farthest: "right"
            }),
            _getTopToOriginY: e({
                origin: "originY",
                axis1: "y1",
                axis2: "y2",
                dimension: "height"
            },
            {
                nearest: "top",
                center: "center",
                farthest: "bottom"
            }),
            _render: function(t, e) {
                if (t.beginPath(), e) {
                    var i = this.getCenterPoint();
                    t.translate(i.x, i.y)
                }
                if (!this.strokeDashArray || this.strokeDashArray && o) {
                    var r = this.x1 <= this.x2 ? -1 : 1,
                    n = this.y1 <= this.y2 ? -1 : 1;
                    t.moveTo(1 === this.width ? 0 : r * this.width / 2, 1 === this.height ? 0 : n * this.height / 2),
                    t.lineTo(1 === this.width ? 0 : -1 * r * this.width / 2, 1 === this.height ? 0 : -1 * n * this.height / 2)
                }
                t.lineWidth = this.strokeWidth;
                var s = t.strokeStyle;
                t.strokeStyle = this.stroke || t.fillStyle,
                this.stroke && this._renderStroke(t),
                t.strokeStyle = s
            },
            _renderDashedStroke: function(t) {
                var e = this.x1 <= this.x2 ? -1 : 1,
                r = this.y1 <= this.y2 ? -1 : 1,
                n = 1 === this.width ? 0 : e * this.width / 2,
                o = 1 === this.height ? 0 : r * this.height / 2;
                t.beginPath(),
                i.util.drawDashedLine(t, n, o, -n, -o, this.strokeDashArray),
                t.closePath()
            },
            toObject: function(t) {
                return r(this.callSuper("toObject", t), {
                    x1: this.get("x1"),
                    y1: this.get("y1"),
                    x2: this.get("x2"),
                    y2: this.get("y2")
                })
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                i = "";
                return this.group || (i = "translate(" + ( - this.width / 2 - (this.x1 > this.x2 ? this.x2: this.x1)) + ", " + ( - this.height / 2 - (this.y1 > this.y2 ? this.y2: this.y1)) + ") "),
                e.push("<line ", 'x1="', this.x1, '" y1="', this.y1, '" x2="', this.x2, '" y2="', this.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), i, this.getSvgTransformMatrix(), '"/>\n'),
                t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), i.Line.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), i.Line.fromElement = function(t, e) {
            var n = i.parseAttributes(t, i.Line.ATTRIBUTE_NAMES),
            o = [n.x1 || 0, n.y1 || 0, n.x2 || 0, n.y2 || 0];
            return new i.Line(o, r(n, e))
        },
        i.Line.fromObject = function(t) {
            var e = [t.x1, t.y1, t.x2, t.y2];
            return new i.Line(e, t)
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        function e(t) {
            return "radius" in t && t.radius > 0
        }
        var i = t.fabric || (t.fabric = {}),
        r = 2 * Math.PI,
        n = i.util.object.extend;
        i.Circle ? i.warn("fabric.Circle is already defined.") : (i.Circle = i.util.createClass(i.Object, {
            type: "circle",
            radius: 0,
            initialize: function(t) {
                t = t || {},
                this.callSuper("initialize", t),
                this.set("radius", t.radius || 0)
            },
            _set: function(t, e) {
                return this.callSuper("_set", t, e),
                "radius" === t && this.setRadius(e),
                this
            },
            toObject: function(t) {
                return n(this.callSuper("toObject", t), {
                    radius: this.get("radius")
                })
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                i = 0,
                r = 0;
                return this.group && (i = this.left + this.radius, r = this.top + this.radius),
                e.push("<circle ", 'cx="' + i + '" cy="' + r + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n'),
                t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(),
                t.arc(e ? this.left + this.radius: 0, e ? this.top + this.radius: 0, this.radius, 0, r, !1),
                this._renderFill(t),
                this._renderStroke(t)
            },
            getRadiusX: function() {
                return this.get("radius") * this.get("scaleX")
            },
            getRadiusY: function() {
                return this.get("radius") * this.get("scaleY")
            },
            setRadius: function(t) {
                this.radius = t,
                this.set("width", 2 * t).set("height", 2 * t)
            },
            complexity: function() {
                return 1
            }
        }), i.Circle.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), i.Circle.fromElement = function(t, r) {
            r || (r = {});
            var o = i.parseAttributes(t, i.Circle.ATTRIBUTE_NAMES);
            if (!e(o)) throw new Error("value of `r` attribute is required and can not be negative");
            o.left = o.left || 0,
            o.top = o.top || 0;
            var s = new i.Circle(n(o, r));
            return s.left -= s.radius,
            s.top -= s.radius,
            s
        },
        i.Circle.fromObject = function(t) {
            return new i.Circle(t)
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Triangle ? e.warn("fabric.Triangle is already defined") : (e.Triangle = e.util.createClass(e.Object, {
            type: "triangle",
            initialize: function(t) {
                t = t || {},
                this.callSuper("initialize", t),
                this.set("width", t.width || 100).set("height", t.height || 100)
            },
            _render: function(t) {
                var e = this.width / 2,
                i = this.height / 2;
                t.beginPath(),
                t.moveTo( - e, i),
                t.lineTo(0, -i),
                t.lineTo(e, i),
                t.closePath(),
                this._renderFill(t),
                this._renderStroke(t)
            },
            _renderDashedStroke: function(t) {
                var i = this.width / 2,
                r = this.height / 2;
                t.beginPath(),
                e.util.drawDashedLine(t, -i, r, 0, -r, this.strokeDashArray),
                e.util.drawDashedLine(t, 0, -r, i, r, this.strokeDashArray),
                e.util.drawDashedLine(t, i, r, -i, r, this.strokeDashArray),
                t.closePath()
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                i = this.width / 2,
                r = this.height / 2,
                n = [ - i + " " + r, "0 " + -r, i + " " + r].join(",");
                return e.push("<polygon ", 'points="', n, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>'),
                t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), e.Triangle.fromObject = function(t) {
            return new e.Triangle(t)
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = 2 * Math.PI,
        r = e.util.object.extend;
        e.Ellipse ? e.warn("fabric.Ellipse is already defined.") : (e.Ellipse = e.util.createClass(e.Object, {
            type: "ellipse",
            rx: 0,
            ry: 0,
            initialize: function(t) {
                t = t || {},
                this.callSuper("initialize", t),
                this.set("rx", t.rx || 0),
                this.set("ry", t.ry || 0),
                this.set("width", 2 * this.get("rx")),
                this.set("height", 2 * this.get("ry"))
            },
            toObject: function(t) {
                return r(this.callSuper("toObject", t), {
                    rx: this.get("rx"),
                    ry: this.get("ry")
                })
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                i = 0,
                r = 0;
                return this.group && (i = this.left + this.rx, r = this.top + this.ry),
                e.push("<ellipse ", 'cx="', i, '" cy="', r, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'),
                t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(),
                t.save(),
                t.transform(1, 0, 0, this.ry / this.rx, 0, 0),
                t.arc(e ? this.left + this.rx: 0, e ? (this.top + this.ry) * this.rx / this.ry: 0, this.rx, 0, i, !1),
                t.restore(),
                this._renderFill(t),
                this._renderStroke(t)
            },
            complexity: function() {
                return 1
            }
        }), e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), e.Ellipse.fromElement = function(t, i) {
            i || (i = {});
            var n = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES);
            n.left = n.left || 0,
            n.top = n.top || 0;
            var o = new e.Ellipse(r(n, i));
            return o.top -= o.ry,
            o.left -= o.rx,
            o
        },
        e.Ellipse.fromObject = function(t) {
            return new e.Ellipse(t)
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        if (e.Rect) console.warn("fabric.Rect is already defined");
        else {
            var r = e.Object.prototype.stateProperties.concat();
            r.push("rx", "ry", "x", "y"),
            e.Rect = e.util.createClass(e.Object, {
                stateProperties: r,
                type: "rect",
                rx: 0,
                ry: 0,
                strokeDashArray: null,
                initialize: function(t) {
                    t = t || {},
                    this.callSuper("initialize", t),
                    this._initRxRy()
                },
                _initRxRy: function() {
                    this.rx && !this.ry ? this.ry = this.rx: this.ry && !this.rx && (this.rx = this.ry)
                },
                _render: function(t, e) {
                    if (1 !== this.width || 1 !== this.height) {
                        var i = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                        r = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                        n = this.width,
                        o = this.height,
                        s = e ? this.left: -this.width / 2,
                        a = e ? this.top: -this.height / 2,
                        h = 0 !== i || 0 !== r,
                        c = .4477152502;
                        t.beginPath(),
                        t.moveTo(s + i, a),
                        t.lineTo(s + n - i, a),
                        h && t.bezierCurveTo(s + n - c * i, a, s + n, a + c * r, s + n, a + r),
                        t.lineTo(s + n, a + o - r),
                        h && t.bezierCurveTo(s + n, a + o - c * r, s + n - c * i, a + o, s + n - i, a + o),
                        t.lineTo(s + i, a + o),
                        h && t.bezierCurveTo(s + c * i, a + o, s, a + o - c * r, s, a + o - r),
                        t.lineTo(s, a + r),
                        h && t.bezierCurveTo(s, a + c * r, s + c * i, a, s + i, a),
                        t.closePath(),
                        this._renderFill(t),
                        this._renderStroke(t)
                    } else t.fillRect(0, 0, 1, 1)
                },
                _renderDashedStroke: function(t) {
                    var i = -this.width / 2,
                    r = -this.height / 2,
                    n = this.width,
                    o = this.height;
                    t.beginPath(),
                    e.util.drawDashedLine(t, i, r, i + n, r, this.strokeDashArray),
                    e.util.drawDashedLine(t, i + n, r, i + n, r + o, this.strokeDashArray),
                    e.util.drawDashedLine(t, i + n, r + o, i, r + o, this.strokeDashArray),
                    e.util.drawDashedLine(t, i, r + o, i, r, this.strokeDashArray),
                    t.closePath()
                },
                toObject: function(t) {
                    var e = i(this.callSuper("toObject", t), {
                        rx: this.get("rx") || 0,
                        ry: this.get("ry") || 0
                    });
                    return this.includeDefaultValues || this._removeDefaultValues(e),
                    e
                },
                toSVG: function(t) {
                    var e = this._createBaseSVGMarkup(),
                    i = this.left,
                    r = this.top;
                    return this.group || (i = -this.width / 2, r = -this.height / 2),
                    e.push("<rect ", 'x="', i, '" y="', r, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'),
                    t ? t(e.join("")) : e.join("")
                },
                complexity: function() {
                    return 1
                }
            }),
            e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")),
            e.Rect.fromElement = function(t, r) {
                if (!t) return null;
                r = r || {};
                var n = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES);
                return n.left = n.left || 0,
                n.top = n.top || 0,
                new e.Rect(i(r ? e.util.object.clone(r) : {},
                n))
            },
            e.Rect.fromObject = function(t) {
                return new e.Rect(t)
            }
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.toFixed;
        e.Polyline ? e.warn("fabric.Polyline is already defined") : (e.Polyline = e.util.createClass(e.Object, {
            type: "polyline",
            points: null,
            initialize: function(t, e) {
                e = e || {},
                this.set("points", t),
                this.callSuper("initialize", e),
                this._calcDimensions()
            },
            _calcDimensions: function() {
                return e.Polygon.prototype._calcDimensions.call(this)
            },
            _applyPointOffset: function() {
                return e.Polygon.prototype._applyPointOffset.call(this)
            },
            toObject: function(t) {
                return e.Polygon.prototype.toObject.call(this, t)
            },
            toSVG: function(t) {
                for (var e = [], r = this._createBaseSVGMarkup(), n = 0, o = this.points.length; n < o; n++) e.push(i(this.points[n].x, 2), ",", i(this.points[n].y, 2), " ");
                return r.push("<polyline ", 'points="', e.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n'),
                t ? t(r.join("")) : r.join("")
            },
            _render: function(t) {
                var e;
                t.beginPath(),
                this._applyPointOffset && (this.group && "path-group" === this.group.type || this._applyPointOffset(), this._applyPointOffset = null),
                t.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 0,
                r = this.points.length; i < r; i++) e = this.points[i],
                t.lineTo(e.x, e.y);
                this._renderFill(t),
                this._renderStroke(t)
            },
            _renderDashedStroke: function(t) {
                var i, r;
                t.beginPath();
                for (var n = 0,
                o = this.points.length; n < o; n++) i = this.points[n],
                r = this.points[n + 1] || i,
                e.util.drawDashedLine(t, i.x, i.y, r.x, r.y, this.strokeDashArray)
            },
            complexity: function() {
                return this.get("points").length
            }
        }), e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polyline.fromElement = function(t, i) {
            if (!t) return null;
            i || (i = {});
            var r = e.parsePointsAttribute(t.getAttribute("points")),
            n = e.parseAttributes(t, e.Polyline.ATTRIBUTE_NAMES);
            return null === r ? null: new e.Polyline(r, e.util.object.extend(n, i))
        },
        e.Polyline.fromObject = function(t) {
            var i = t.points;
            return new e.Polyline(i, t, !0)
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend,
        r = e.util.array.min,
        n = e.util.array.max,
        o = e.util.toFixed;
        e.Polygon ? e.warn("fabric.Polygon is already defined") : (e.Polygon = e.util.createClass(e.Object, {
            type: "polygon",
            points: null,
            initialize: function(t, e) {
                e = e || {},
                this.points = t,
                this.callSuper("initialize", e),
                this._calcDimensions()
            },
            _calcDimensions: function() {
                var t = this.points,
                e = r(t, "x"),
                i = r(t, "y"),
                o = n(t, "x"),
                s = n(t, "y");
                this.width = o - e || 1,
                this.height = s - i || 1,
                this.left = e,
                this.top = i
            },
            _applyPointOffset: function() {
                this.points.forEach(function(t) {
                    t.x -= this.left + this.width / 2,
                    t.y -= this.top + this.height / 2
                },
                this)
            },
            toObject: function(t) {
                return i(this.callSuper("toObject", t), {
                    points: this.points.concat()
                })
            },
            toSVG: function(t) {
                for (var e = [], i = this._createBaseSVGMarkup(), r = 0, n = this.points.length; r < n; r++) e.push(o(this.points[r].x, 2), ",", o(this.points[r].y, 2), " ");
                return i.push("<polygon ", 'points="', e.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n'),
                t ? t(i.join("")) : i.join("")
            },
            _render: function(t) {
                var e;
                t.beginPath(),
                this._applyPointOffset && (this.group && "path-group" === this.group.type || this._applyPointOffset(), this._applyPointOffset = null),
                t.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 0,
                r = this.points.length; i < r; i++) e = this.points[i],
                t.lineTo(e.x, e.y);
                this._renderFill(t),
                (this.stroke || this.strokeDashArray) && (t.closePath(), this._renderStroke(t))
            },
            _renderDashedStroke: function(t) {
                var i, r;
                t.beginPath();
                for (var n = 0,
                o = this.points.length; n < o; n++) i = this.points[n],
                r = this.points[n + 1] || this.points[0],
                e.util.drawDashedLine(t, i.x, i.y, r.x, r.y, this.strokeDashArray);
                t.closePath()
            },
            complexity: function() {
                return this.points.length
            }
        }), e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polygon.fromElement = function(t, r) {
            if (!t) return null;
            r || (r = {});
            var n = e.parsePointsAttribute(t.getAttribute("points")),
            o = e.parseAttributes(t, e.Polygon.ATTRIBUTE_NAMES);
            return null === n ? null: new e.Polygon(n, i(o, r))
        },
        e.Polygon.fromObject = function(t) {
            return new e.Polygon(t.points, t, !0)
        })
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        function e(t) {
            return "H" === t[0] ? t[1] : t[t.length - 2]
        }
        function i(t) {
            return "V" === t[0] ? t[1] : t[t.length - 1]
        }
        var r = t.fabric || (t.fabric = {}),
        n = r.util.array.min,
        o = r.util.array.max,
        s = r.util.object.extend,
        a = Object.prototype.toString,
        h = r.util.drawArc,
        c = {
            m: 2,
            l: 2,
            h: 1,
            v: 1,
            c: 6,
            s: 4,
            q: 4,
            t: 2,
            a: 7
        },
        l = {
            m: "l",
            M: "L"
        };
        r.Path ? r.warn("fabric.Path is already defined") : (r.Path = r.util.createClass(r.Object, {
            type: "path",
            path: null,
            initialize: function(t, e) {
                if (e = e || {},
                this.setOptions(e), !t) throw new Error("`path` argument is required");
                var i = "[object Array]" === a.call(t);
                this.path = i ? t: t.match && t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi),
                this.path && (i || (this.path = this._parsePath()), this._initializePath(e), e.sourcePath && this.setSourcePath(e.sourcePath))
            },
            _initializePath: function(t) {
                var e = "width" in t && null != t.width,
                i = "height" in t && null != t.width,
                r = "left" in t,
                n = "top" in t,
                o = r ? this.left: 0,
                a = n ? this.top: 0;
                e && i ? (n || (this.top = this.height / 2), r || (this.left = this.width / 2)) : (s(this, this._parseDimensions()), e && (this.width = t.width), i && (this.height = t.height)),
                this.pathOffset = this.pathOffset || this._calculatePathOffset(o, a)
            },
            _calculatePathOffset: function(t, e) {
                return {
                    x: this.left - t - this.width / 2,
                    y: this.top - e - this.height / 2
                }
            },
            _render: function(t, e) {
                var i, r, n, o, s, a = null,
                c = 0,
                l = 0,
                u = 0,
                f = 0,
                d = 0,
                p = 0,
                g = -(this.width / 2 + this.pathOffset.x),
                m = -(this.height / 2 + this.pathOffset.y);
                e && (g += this.width / 2, m += this.height / 2);
                for (var v = 0,
                b = this.path.length; v < b; ++v) {
                    switch ((i = this.path[v])[0]) {
                    case "l":
                        u += i[1],
                        f += i[2],
                        t.lineTo(u + g, f + m);
                        break;
                    case "L":
                        u = i[1],
                        f = i[2],
                        t.lineTo(u + g, f + m);
                        break;
                    case "h":
                        u += i[1],
                        t.lineTo(u + g, f + m);
                        break;
                    case "H":
                        u = i[1],
                        t.lineTo(u + g, f + m);
                        break;
                    case "v":
                        f += i[1],
                        t.lineTo(u + g, f + m);
                        break;
                    case "V":
                        f = i[1],
                        t.lineTo(u + g, f + m);
                        break;
                    case "m":
                        c = u += i[1],
                        l = f += i[2],
                        t.moveTo(u + g, f + m);
                        break;
                    case "M":
                        c = u = i[1],
                        l = f = i[2],
                        t.moveTo(u + g, f + m);
                        break;
                    case "c":
                        r = u + i[5],
                        n = f + i[6],
                        d = u + i[3],
                        p = f + i[4],
                        t.bezierCurveTo(u + i[1] + g, f + i[2] + m, d + g, p + m, r + g, n + m),
                        u = r,
                        f = n;
                        break;
                    case "C":
                        u = i[5],
                        f = i[6],
                        d = i[3],
                        p = i[4],
                        t.bezierCurveTo(i[1] + g, i[2] + m, d + g, p + m, u + g, f + m);
                        break;
                    case "s":
                        r = u + i[3],
                        n = f + i[4],
                        d = d ? 2 * u - d: u,
                        p = p ? 2 * f - p: f,
                        t.bezierCurveTo(d + g, p + m, u + i[1] + g, f + i[2] + m, r + g, n + m),
                        d = u + i[1],
                        p = f + i[2],
                        u = r,
                        f = n;
                        break;
                    case "S":
                        r = i[3],
                        n = i[4],
                        d = 2 * u - d,
                        p = 2 * f - p,
                        t.bezierCurveTo(d + g, p + m, i[1] + g, i[2] + m, r + g, n + m),
                        u = r,
                        f = n,
                        d = i[1],
                        p = i[2];
                        break;
                    case "q":
                        r = u + i[3],
                        n = f + i[4],
                        d = u + i[1],
                        p = f + i[2],
                        t.quadraticCurveTo(d + g, p + m, r + g, n + m),
                        u = r,
                        f = n;
                        break;
                    case "Q":
                        r = i[3],
                        n = i[4],
                        t.quadraticCurveTo(i[1] + g, i[2] + m, r + g, n + m),
                        u = r,
                        f = n,
                        d = i[1],
                        p = i[2];
                        break;
                    case "t":
                        r = u + i[1],
                        n = f + i[2],
                        null === a[0].match(/[QqTt]/) ? (d = u, p = f) : "t" === a[0] ? (d = 2 * u - o, p = 2 * f - s) : "q" === a[0] && (d = 2 * u - d, p = 2 * f - p),
                        o = d,
                        s = p,
                        t.quadraticCurveTo(d + g, p + m, r + g, n + m),
                        f = n,
                        d = (u = r) + i[1],
                        p = f + i[2];
                        break;
                    case "T":
                        r = i[1],
                        n = i[2],
                        d = 2 * u - d,
                        p = 2 * f - p,
                        t.quadraticCurveTo(d + g, p + m, r + g, n + m),
                        u = r,
                        f = n;
                        break;
                    case "a":
                        h(t, u + g, f + m, [i[1], i[2], i[3], i[4], i[5], i[6] + u + g, i[7] + f + m]),
                        u += i[6],
                        f += i[7];
                        break;
                    case "A":
                        h(t, u + g, f + m, [i[1], i[2], i[3], i[4], i[5], i[6] + g, i[7] + m]),
                        u = i[6],
                        f = i[7];
                        break;
                    case "z":
                    case "Z":
                        u = c,
                        f = l,
                        t.closePath()
                    }
                    a = i
                }
            },
            render: function(t, e) {
                if (this.visible) {
                    t.save(),
                    e && t.translate( - this.width / 2, -this.height / 2);
                    var i = this.transformMatrix;
                    i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                    e || this.transform(t),
                    this._setStrokeStyles(t),
                    this._setFillStyles(t),
                    this._setShadow(t),
                    this.clipTo && r.util.clipContext(this, t),
                    t.beginPath(),
                    t.globalAlpha = this.group ? t.globalAlpha * this.opacity: this.opacity,
                    this._render(t, e),
                    this._renderFill(t),
                    this._renderStroke(t),
                    this.clipTo && t.restore(),
                    this._removeShadow(t),
                    t.restore()
                }
            },
            toString: function() {
                return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
            },
            toObject: function(t) {
                var e = s(this.callSuper("toObject", t), {
                    path: this.path.map(function(t) {
                        return t.slice()
                    }),
                    pathOffset: this.pathOffset
                });
                return this.sourcePath && (e.sourcePath = this.sourcePath),
                this.transformMatrix && (e.transformMatrix = this.transformMatrix),
                e
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.path = this.sourcePath),
                delete e.sourcePath,
                e
            },
            toSVG: function(t) {
                for (var e = [], i = this._createBaseSVGMarkup(), r = 0, n = this.path.length; r < n; r++) e.push(this.path[r].join(" "));
                var o = e.join(" ");
                return i.push("<path ", 'd="', o, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n"),
                t ? t(i.join("")) : i.join("")
            },
            complexity: function() {
                return this.path.length
            },
            _parsePath: function() {
                for (var t, e, i, r, n, o = [], s = [], a = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, h = 0, u = this.path.length; h < u; h++) {
                    for (r = (t = this.path[h]).slice(1).trim(), s.length = 0; i = a.exec(r);) s.push(i[0]);
                    n = [t.charAt(0)];
                    for (var f = 0,
                    d = s.length; f < d; f++) e = parseFloat(s[f]),
                    isNaN(e) || n.push(e);
                    var p = n[0],
                    g = c[p.toLowerCase()],
                    m = l[p] || p;
                    if (n.length - 1 > g) for (var v = 1,
                    b = n.length; v < b; v += g) o.push([p].concat(n.slice(v, v + g))),
                    p = m;
                    else o.push(n)
                }
                return o
            },
            _parseDimensions: function() {
                var t = [],
                e = [],
                i = {};
                this.path.forEach(function(r, n) {
                    this._getCoordsFromCommand(r, n, t, e, i)
                },
                this);
                var r = n(t),
                s = n(e),
                a = o(t) - r,
                h = o(e) - s;
                return {
                    left: this.left + (r + a / 2),
                    top: this.top + (s + h / 2),
                    width: a,
                    height: h
                }
            },
            _getCoordsFromCommand: function(t, r, n, o, s) {
                var a = !1;
                "H" !== t[0] && (s.x = e(0 === r ? t: this.path[r - 1])),
                "V" !== t[0] && (s.y = i(0 === r ? t: this.path[r - 1])),
                t[0] === t[0].toLowerCase() && (a = !0);
                var h, c = this._getXY(t, a, s);
                h = parseInt(c.x, 10),
                isNaN(h) || n.push(h),
                h = parseInt(c.y, 10),
                isNaN(h) || o.push(h)
            },
            _getXY: function(t, r, n) {
                return {
                    x: r ? n.x + e(t) : "V" === t[0] ? n.x: e(t),
                    y: r ? n.y + i(t) : "H" === t[0] ? n.y: i(t)
                }
            }
        }), r.Path.fromObject = function(t, e) {
            "string" == typeof t.path ? r.loadSVGFromURL(t.path,
            function(i) {
                var n = i[0],
                o = t.path;
                delete t.path,
                r.util.object.extend(n, t),
                n.setSourcePath(o),
                e(n)
            }) : e(new r.Path(t.path, t))
        },
        r.Path.ATTRIBUTE_NAMES = r.SHARED_ATTRIBUTES.concat(["d"]), r.Path.fromElement = function(t, e, i) {
            var n = r.parseAttributes(t, r.Path.ATTRIBUTE_NAMES);
            e && e(new r.Path(n.d, s(n, i)))
        },
        r.Path.async = !0)
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend,
        r = e.util.array.invoke,
        n = e.Object.prototype.toObject;
        e.PathGroup ? e.warn("fabric.PathGroup is already defined") : (e.PathGroup = e.util.createClass(e.Path, {
            type: "path-group",
            fill: "",
            initialize: function(t, e) {
                e = e || {},
                this.paths = t || [];
                for (var i = this.paths.length; i--;) this.paths[i].group = this;
                this.setOptions(e),
                e.widthAttr && (this.scaleX = e.widthAttr / e.width),
                e.heightAttr && (this.scaleY = e.heightAttr / e.height),
                this.setCoords(),
                e.sourcePath && this.setSourcePath(e.sourcePath)
            },
            render: function(t) {
                if (this.visible) {
                    t.save();
                    var i = this.transformMatrix;
                    i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                    this.transform(t),
                    this._setShadow(t),
                    this.clipTo && e.util.clipContext(this, t);
                    for (var r = 0,
                    n = this.paths.length; r < n; ++r) this.paths[r].render(t, !0);
                    this.clipTo && t.restore(),
                    this._removeShadow(t),
                    t.restore()
                }
            },
            _set: function(t, e) {
                if ("fill" === t && e && this.isSameColor()) for (var i = this.paths.length; i--;) this.paths[i]._set(t, e);
                return this.callSuper("_set", t, e)
            },
            toObject: function(t) {
                var e = i(n.call(this, t), {
                    paths: r(this.getObjects(), "toObject", t)
                });
                return this.sourcePath && (e.sourcePath = this.sourcePath),
                e
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.paths = this.sourcePath),
                e
            },
            toSVG: function(t) {
                for (var e = this.getObjects(), i = "translate(" + this.left + " " + this.top + ")", r = ["<g ", 'style="', this.getSvgStyles(), '" ', 'transform="', i, this.getSvgTransform(), '" ', ">\n"], n = 0, o = e.length; n < o; n++) r.push(e[n].toSVG(t));
                return r.push("</g>\n"),
                t ? t(r.join("")) : r.join("")
            },
            toString: function() {
                return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
            },
            isSameColor: function() {
                var t = (this.getObjects()[0].get("fill") || "").toLowerCase();
                return this.getObjects().every(function(e) {
                    return (e.get("fill") || "").toLowerCase() === t
                })
            },
            complexity: function() {
                return this.paths.reduce(function(t, e) {
                    return t + (e && e.complexity ? e.complexity() : 0)
                },
                0)
            },
            getObjects: function() {
                return this.paths
            }
        }), e.PathGroup.fromObject = function(t, i) {
            "string" == typeof t.paths ? e.loadSVGFromURL(t.paths,
            function(r) {
                var n = t.paths;
                delete t.paths;
                var o = e.util.groupSVGElements(r, t, n);
                i(o)
            }) : e.util.enlivenObjects(t.paths,
            function(r) {
                delete t.paths,
                i(new e.PathGroup(r, t))
            })
        },
        e.PathGroup.async = !0)
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend,
        r = e.util.array.min,
        n = e.util.array.max,
        o = e.util.array.invoke;
        if (!e.Group) {
            var s = {
                lockMovementX: !0,
                lockMovementY: !0,
                lockRotation: !0,
                lockScalingX: !0,
                lockScalingY: !0,
                lockUniScaling: !0
            };
            e.Group = e.util.createClass(e.Object, e.Collection, {
                type: "group",
                initialize: function(t, e) {
                    e = e || {},
                    this._objects = t || [];
                    for (var r = this._objects.length; r--;) this._objects[r].group = this;
                    this.originalState = {},
                    this.callSuper("initialize"),
                    this._calcBounds(),
                    this._updateObjectsCoords(),
                    e && i(this, e),
                    this._setOpacityIfSame(),
                    this.setCoords(),
                    this.saveCoords()
                },
                _updateObjectsCoords: function() {
                    this.forEachObject(this._updateObjectCoords, this)
                },
                _updateObjectCoords: function(t) {
                    var e = t.getLeft(),
                    i = t.getTop();
                    t.set({
                        originalLeft: e,
                        originalTop: i,
                        left: e - this.left,
                        top: i - this.top
                    }),
                    t.setCoords(),
                    t.__origHasControls = t.hasControls,
                    t.hasControls = !1
                },
                toString: function() {
                    return "#<fabric.Group: (" + this.complexity() + ")>"
                },
                addWithUpdate: function(t) {
                    return this._restoreObjectsState(),
                    t && (this._objects.push(t), t.group = this),
                    this.forEachObject(this._setObjectActive, this),
                    this._calcBounds(),
                    this._updateObjectsCoords(),
                    this
                },
                _setObjectActive: function(t) {
                    t.set("active", !0),
                    t.group = this
                },
                removeWithUpdate: function(t) {
                    return this._moveFlippedObject(t),
                    this._restoreObjectsState(),
                    this.forEachObject(this._setObjectActive, this),
                    this.remove(t),
                    this._calcBounds(),
                    this._updateObjectsCoords(),
                    this
                },
                _onObjectAdded: function(t) {
                    t.group = this
                },
                _onObjectRemoved: function(t) {
                    delete t.group,
                    t.set("active", !1)
                },
                delegatedProperties: {
                    fill: !0,
                    opacity: !0,
                    fontFamily: !0,
                    fontWeight: !0,
                    fontSize: !0,
                    fontStyle: !0,
                    lineHeight: !0,
                    textDecoration: !0,
                    textAlign: !0,
                    backgroundColor: !0
                },
                _set: function(t, e) {
                    if (t in this.delegatedProperties) {
                        var i = this._objects.length;
                        for (this[t] = e; i--;) this._objects[i].set(t, e)
                    } else this[t] = e
                },
                toObject: function(t) {
                    return i(this.callSuper("toObject", t), {
                        objects: o(this._objects, "toObject", t)
                    })
                },
                render: function(t) {
                    if (this.visible) {
                        t.save(),
                        this.clipTo && e.util.clipContext(this, t);
                        for (var i = 0,
                        r = this._objects.length; i < r; i++) this._renderObject(this._objects[i], t);
                        this.clipTo && t.restore(),
                        t.restore()
                    }
                },
                _renderControls: function(t, e) {
                    this.callSuper("_renderControls", t, e);
                    for (var i = 0,
                    r = this._objects.length; i < r; i++) this._objects[i]._renderControls(t)
                },
                _renderObject: function(t, e) {
                    var i = t.hasRotatingPoint;
                    t.visible && (t.hasRotatingPoint = !1, t.render(e), t.hasRotatingPoint = i)
                },
                _restoreObjectsState: function() {
                    return this._objects.forEach(this._restoreObjectState, this),
                    this
                },
                _moveFlippedObject: function(t) {
                    var e = t.get("originX"),
                    i = t.get("originY"),
                    r = t.getCenterPoint();
                    t.set({
                        originX: "center",
                        originY: "center",
                        left: r.x,
                        top: r.y
                    }),
                    this._toggleFlipping(t);
                    var n = t.getPointByOrigin(e, i);
                    return t.set({
                        originX: e,
                        originY: i,
                        left: n.x,
                        top: n.y
                    }),
                    this
                },
                _toggleFlipping: function(t) {
                    this.flipX && (t.toggle("flipX"), t.set("left", -t.get("left")), t.setAngle( - t.getAngle())),
                    this.flipY && (t.toggle("flipY"), t.set("top", -t.get("top")), t.setAngle( - t.getAngle()))
                },
                _restoreObjectState: function(t) {
                    return this._setObjectPosition(t),
                    t.setCoords(),
                    t.hasControls = t.__origHasControls,
                    delete t.__origHasControls,
                    t.set("active", !1),
                    t.setCoords(),
                    delete t.group,
                    this
                },
                _setObjectPosition: function(t) {
                    var e = this.getLeft(),
                    i = this.getTop(),
                    r = this._getRotatedLeftTop(t);
                    t.set({
                        angle: t.getAngle() + this.getAngle(),
                        left: e + r.left,
                        top: i + r.top,
                        scaleX: t.get("scaleX") * this.get("scaleX"),
                        scaleY: t.get("scaleY") * this.get("scaleY")
                    })
                },
                _getRotatedLeftTop: function(t) {
                    var e = this.getAngle() * (Math.PI / 180);
                    return {
                        left: -Math.sin(e) * t.getTop() * this.get("scaleY") + Math.cos(e) * t.getLeft() * this.get("scaleX"),
                        top: Math.cos(e) * t.getTop() * this.get("scaleY") + Math.sin(e) * t.getLeft() * this.get("scaleX")
                    }
                },
                destroy: function() {
                    return this._objects.forEach(this._moveFlippedObject, this),
                    this._restoreObjectsState()
                },
                saveCoords: function() {
                    return this._originalLeft = this.get("left"),
                    this._originalTop = this.get("top"),
                    this
                },
                hasMoved: function() {
                    return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
                },
                setObjectsCoords: function() {
                    return this.forEachObject(function(t) {
                        t.setCoords()
                    }),
                    this
                },
                _setOpacityIfSame: function() {
                    var t = this.getObjects(),
                    e = t[0] ? t[0].get("opacity") : 1;
                    t.every(function(t) {
                        return t.get("opacity") === e
                    }) && (this.opacity = e)
                },
                _calcBounds: function(t) {
                    for (var e, i = [], r = [], n = 0, o = this._objects.length; n < o; ++n) { (e = this._objects[n]).setCoords();
                        for (var s in e.oCoords) i.push(e.oCoords[s].x),
                        r.push(e.oCoords[s].y)
                    }
                    this.set(this._getBounds(i, r, t))
                },
                _getBounds: function(t, i, o) {
                    var s = e.util.invertTransform(this.getViewportTransform()),
                    a = e.util.transformPoint(new e.Point(r(t), r(i)), s),
                    h = e.util.transformPoint(new e.Point(n(t), n(i)), s),
                    c = {
                        width: h.x - a.x || 0,
                        height: h.y - a.y || 0
                    };
                    return o || (c.left = (a.x + h.x) / 2 || 0, c.top = (a.y + h.y) / 2 || 0),
                    c
                },
                toSVG: function(t) {
                    for (var e = ["<g ", 'transform="', this.getSvgTransform(), '">\n'], i = 0, r = this._objects.length; i < r; i++) e.push(this._objects[i].toSVG(t));
                    return e.push("</g>\n"),
                    t ? t(e.join("")) : e.join("")
                },
                get: function(t) {
                    if (t in s) {
                        if (this[t]) return this[t];
                        for (var e = 0,
                        i = this._objects.length; e < i; e++) if (this._objects[e][t]) return ! 0;
                        return ! 1
                    }
                    return t in this.delegatedProperties ? this._objects[0] && this._objects[0].get(t) : this[t]
                }
            }),
            e.Group.fromObject = function(t, i) {
                e.util.enlivenObjects(t.objects,
                function(r) {
                    delete t.objects,
                    i && i(new e.Group(r, t))
                })
            },
            e.Group.async = !0
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = fabric.util.object.extend;
        t.fabric || (t.fabric = {}),
        t.fabric.Image ? fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
            type: "image",
            crossOrigin: "",
            initialize: function(t, e) {
                e || (e = {}),
                this.filters = [],
                this.callSuper("initialize", e),
                this._initElement(t, e),
                this._initConfig(e),
                e.filters && (this.filters = e.filters, this.applyFilters())
            },
            getElement: function() {
                return this._element
            },
            setElement: function(t, e) {
                return this._element = t,
                this._originalElement = t,
                this._initConfig(),
                0 !== this.filters.length && this.applyFilters(e),
                this
            },
            setCrossOrigin: function(t) {
                return this.crossOrigin = t,
                this._element.crossOrigin = t,
                this
            },
            getOriginalSize: function() {
                var t = this.getElement();
                return {
                    width: t.width,
                    height: t.height
                }
            },
            _stroke: function(t) {
                t.save(),
                this._setStrokeStyles(t),
                t.beginPath(),
                t.strokeRect( - this.width / 2, -this.height / 2, this.width, this.height),
                t.closePath(),
                t.restore()
            },
            _renderDashedStroke: function(t) {
                var e = -this.width / 2,
                i = -this.height / 2,
                r = this.width,
                n = this.height;
                t.save(),
                this._setStrokeStyles(t),
                t.beginPath(),
                fabric.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray),
                fabric.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray),
                fabric.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray),
                fabric.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray),
                t.closePath(),
                t.restore()
            },
            toObject: function(t) {
                return e(this.callSuper("toObject", t), {
                    src: this._originalElement.src || this._originalElement._src,
                    filters: this.filters.map(function(t) {
                        return t && t.toObject()
                    }),
                    crossOrigin: this.crossOrigin
                })
            },
            toSVG: function(t) {
                var e = [],
                i = -this.width / 2,
                r = -this.height / 2;
                if (this.group && (i = this.left, r = this.top), e.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', '<image xlink:href="', this.getSvgSrc(), '" x="', i, '" y="', r, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="none"', "></image>\n"), this.stroke || this.strokeDashArray) {
                    var n = this.fill;
                    this.fill = null,
                    e.push("<rect ", 'x="', i, '" y="', r, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'),
                    this.fill = n
                }
                return e.push("</g>\n"),
                t ? t(e.join("")) : e.join("")
            },
            getSrc: function() {
                if (this.getElement()) return this.getElement().src || this.getElement()._src
            },
            toString: function() {
                return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
            },
            clone: function(t, e) {
                this.constructor.fromObject(this.toObject(e), t)
            },
            applyFilters: function(t) {
                if (this._originalElement) {
                    if (0 === this.filters.length) return this._element = this._originalElement,
                    void(t && t());
                    var e = this._originalElement,
                    i = fabric.util.createCanvasElement(),
                    r = fabric.util.createImage(),
                    n = this;
                    return i.width = e.width,
                    i.height = e.height,
                    i.getContext("2d").drawImage(e, 0, 0, e.width, e.height),
                    this.filters.forEach(function(t) {
                        t && t.applyTo(i)
                    }),
                    r.width = e.width,
                    r.height = e.height,
                    fabric.isLikelyNode ? (r.src = i.toBuffer(undefined, fabric.Image.pngCompression), n._element = r, t && t()) : (r.onload = function() {
                        n._element = r,
                        t && t(),
                        r.onload = i = e = null
                    },
                    r.src = i.toDataURL("image/png")),
                    this
                }
            },
            _render: function(t, e) {
                this._element && t.drawImage(this._element, e ? this.left: -this.width / 2, e ? this.top: -this.height / 2, this.width, this.height),
                this._renderStroke(t)
            },
            _resetWidthHeight: function() {
                var t = this.getElement();
                this.set("width", t.width),
                this.set("height", t.height)
            },
            _initElement: function(t) {
                this.setElement(fabric.util.getById(t)),
                fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
            },
            _initConfig: function(t) {
                t || (t = {}),
                this.setOptions(t),
                this._setWidthHeight(t),
                this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin)
            },
            _initFilters: function(t, e) {
                t.filters && t.filters.length ? fabric.util.enlivenObjects(t.filters,
                function(t) {
                    e && e(t)
                },
                "fabric.Image.filters") : e && e()
            },
            _setWidthHeight: function(t) {
                this.width = "width" in t ? t.width: this.getElement() ? this.getElement().width || 0 : 0,
                this.height = "height" in t ? t.height: this.getElement() ? this.getElement().height || 0 : 0
            },
            complexity: function() {
                return 1
            }
        }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function(t, e) {
            fabric.util.loadImage(t.src,
            function(i) {
                fabric.Image.prototype._initFilters.call(t, t,
                function(r) {
                    t.filters = r || [];
                    var n = new fabric.Image(i, t);
                    e && e(n)
                })
            },
            null, t.crossOrigin)
        },
        fabric.Image.fromURL = function(t, e, i) {
            fabric.util.loadImage(t,
            function(t) {
                e(new fabric.Image(t, i))
            },
            null, i && i.crossOrigin)
        },
        fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height xlink:href".split(" ")), fabric.Image.fromElement = function(t, i, r) {
            var n = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
            fabric.Image.fromURL(n["xlink:href"], i, e(r ? fabric.util.object.clone(r) : {},
            n))
        },
        fabric.Image.async = !0, fabric.Image.pngCompression = 1)
    } (void 0 !== exports ? exports: this),
    fabric.Image.filters = fabric.Image.filters || {},
    fabric.Image.filters.BaseFilter = fabric.util.createClass({
        type: "BaseFilter",
        toObject: function() {
            return {
                type: this.type
            }
        },
        toJSON: function() {
            return this.toObject()
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.Brightness = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Brightness",
            initialize: function(t) {
                t = t || {},
                this.brightness = t.brightness || 0
            },
            applyTo: function(t) {
                for (var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.brightness, o = 0, s = r.length; o < s; o += 4) r[o] += n,
                r[o + 1] += n,
                r[o + 2] += n;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    brightness: this.brightness
                })
            }
        }),
        e.Image.filters.Brightness.fromObject = function(t) {
            return new e.Image.filters.Brightness(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.Convolute = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Convolute",
            initialize: function(t) {
                t = t || {},
                this.opaque = t.opaque,
                this.matrix = t.matrix || [0, 0, 0, 0, 1, 0, 0, 0, 0];
                var i = e.util.createCanvasElement();
                this.tmpCtx = i.getContext("2d")
            },
            _createImageData: function(t, e) {
                return this.tmpCtx.createImageData(t, e)
            },
            applyTo: function(t) {
                for (var e = this.matrix,
                i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = Math.round(Math.sqrt(e.length)), o = Math.floor(n / 2), s = r.data, a = r.width, h = r.height, c = a, l = h, u = this._createImageData(c, l), f = u.data, d = this.opaque ? 1 : 0, p = 0; p < l; p++) for (var g = 0; g < c; g++) {
                    for (var m = p,
                    v = g,
                    b = 4 * (p * c + g), y = 0, x = 0, w = 0, S = 0, C = 0; C < n; C++) for (var _ = 0; _ < n; _++) {
                        var T = m + C - o,
                        O = v + _ - o;
                        if (! (T < 0 || T > h || O < 0 || O > a)) {
                            var k = 4 * (T * a + O),
                            E = e[C * n + _];
                            y += s[k] * E,
                            x += s[k + 1] * E,
                            w += s[k + 2] * E,
                            S += s[k + 3] * E
                        }
                    }
                    f[b] = y,
                    f[b + 1] = x,
                    f[b + 2] = w,
                    f[b + 3] = S + d * (255 - S)
                }
                i.putImageData(u, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    opaque: this.opaque,
                    matrix: this.matrix
                })
            }
        }),
        e.Image.filters.Convolute.fromObject = function(t) {
            return new e.Image.filters.Convolute(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.GradientTransparency = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "GradientTransparency",
            initialize: function(t) {
                t = t || {},
                this.threshold = t.threshold || 100
            },
            applyTo: function(t) {
                for (var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.threshold, o = r.length, s = 0, a = r.length; s < a; s += 4) r[s + 3] = n + 255 * (o - s) / o;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold
                })
            }
        }),
        e.Image.filters.GradientTransparency.fromObject = function(t) {
            return new e.Image.filters.GradientTransparency(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Grayscale = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Grayscale",
            applyTo: function(t) {
                for (var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, o = r.width * r.height * 4, s = 0; s < o;) e = (n[s] + n[s + 1] + n[s + 2]) / 3,
                n[s] = e,
                n[s + 1] = e,
                n[s + 2] = e,
                s += 4;
                i.putImageData(r, 0, 0)
            }
        }),
        e.Image.filters.Grayscale.fromObject = function() {
            return new e.Image.filters.Grayscale
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Invert = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Invert",
            applyTo: function(t) {
                var e, i = t.getContext("2d"),
                r = i.getImageData(0, 0, t.width, t.height),
                n = r.data,
                o = n.length;
                for (e = 0; e < o; e += 4) n[e] = 255 - n[e],
                n[e + 1] = 255 - n[e + 1],
                n[e + 2] = 255 - n[e + 2];
                i.putImageData(r, 0, 0)
            }
        }),
        e.Image.filters.Invert.fromObject = function() {
            return new e.Image.filters.Invert
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.Mask = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Mask",
            initialize: function(t) {
                t = t || {},
                this.mask = t.mask,
                this.channel = [0, 1, 2, 3].indexOf(t.channel) > -1 ? t.channel: 0
            },
            applyTo: function(t) {
                if (this.mask) {
                    var i, r = t.getContext("2d"),
                    n = r.getImageData(0, 0, t.width, t.height),
                    o = n.data,
                    s = this.mask.getElement(),
                    a = e.util.createCanvasElement(),
                    h = this.channel,
                    c = n.width * n.height * 4;
                    a.width = s.width,
                    a.height = s.height,
                    a.getContext("2d").drawImage(s, 0, 0, s.width, s.height);
                    var l = a.getContext("2d").getImageData(0, 0, s.width, s.height).data;
                    for (i = 0; i < c; i += 4) o[i + 3] = l[i + h];
                    r.putImageData(n, 0, 0)
                }
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    mask: this.mask.toObject(),
                    channel: this.channel
                })
            }
        }),
        e.Image.filters.Mask.fromObject = function(t, i) {
            e.util.loadImage(t.mask.src,
            function(r) {
                t.mask = new e.Image(r, t.mask),
                i && i(new e.Image.filters.Mask(t))
            })
        },
        e.Image.filters.Mask.async = !0
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.Noise = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Noise",
            initialize: function(t) {
                t = t || {},
                this.noise = t.noise || 0
            },
            applyTo: function(t) {
                for (var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, o = this.noise, s = 0, a = n.length; s < a; s += 4) e = (.5 - Math.random()) * o,
                n[s] += e,
                n[s + 1] += e,
                n[s + 2] += e;
                i.putImageData(r, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    noise: this.noise
                })
            }
        }),
        e.Image.filters.Noise.fromObject = function(t) {
            return new e.Image.filters.Noise(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.Pixelate = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Pixelate",
            initialize: function(t) {
                t = t || {},
                this.blocksize = t.blocksize || 4
            },
            applyTo: function(t) {
                var e, i, r, n, o, s, a, h = t.getContext("2d"),
                c = h.getImageData(0, 0, t.width, t.height),
                l = c.data,
                u = c.height,
                f = c.width;
                for (i = 0; i < u; i += this.blocksize) for (r = 0; r < f; r += this.blocksize) {
                    n = l[e = 4 * i * f + 4 * r],
                    o = l[e + 1],
                    s = l[e + 2],
                    a = l[e + 3];
                    for (var d = i,
                    p = i + this.blocksize; d < p; d++) for (var g = r,
                    m = r + this.blocksize; g < m; g++) l[e = 4 * d * f + 4 * g] = n,
                    l[e + 1] = o,
                    l[e + 2] = s,
                    l[e + 3] = a
                }
                h.putImageData(c, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    blocksize: this.blocksize
                })
            }
        }),
        e.Image.filters.Pixelate.fromObject = function(t) {
            return new e.Image.filters.Pixelate(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.RemoveWhite = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "RemoveWhite",
            initialize: function(t) {
                t = t || {},
                this.threshold = t.threshold || 30,
                this.distance = t.distance || 20
            },
            applyTo: function(t) {
                for (var e, i, r, n = t.getContext("2d"), o = n.getImageData(0, 0, t.width, t.height), s = o.data, a = this.threshold, h = this.distance, c = 255 - a, l = Math.abs, u = 0, f = s.length; u < f; u += 4) e = s[u],
                i = s[u + 1],
                r = s[u + 2],
                e > c && i > c && r > c && l(e - i) < h && l(e - r) < h && l(i - r) < h && (s[u + 3] = 1);
                n.putImageData(o, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold,
                    distance: this.distance
                })
            }
        }),
        e.Image.filters.RemoveWhite.fromObject = function(t) {
            return new e.Image.filters.RemoveWhite(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Sepia = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Sepia",
            applyTo: function(t) {
                var e, i, r = t.getContext("2d"),
                n = r.getImageData(0, 0, t.width, t.height),
                o = n.data,
                s = o.length;
                for (e = 0; e < s; e += 4) i = .3 * o[e] + .59 * o[e + 1] + .11 * o[e + 2],
                o[e] = i + 100,
                o[e + 1] = i + 50,
                o[e + 2] = i + 255;
                r.putImageData(n, 0, 0)
            }
        }),
        e.Image.filters.Sepia.fromObject = function() {
            return new e.Image.filters.Sepia
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Sepia2 = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Sepia2",
            applyTo: function(t) {
                var e, i, r, n, o = t.getContext("2d"),
                s = o.getImageData(0, 0, t.width, t.height),
                a = s.data,
                h = a.length;
                for (e = 0; e < h; e += 4) i = a[e],
                r = a[e + 1],
                n = a[e + 2],
                a[e] = (.393 * i + .769 * r + .189 * n) / 1.351,
                a[e + 1] = (.349 * i + .686 * r + .168 * n) / 1.203,
                a[e + 2] = (.272 * i + .534 * r + .131 * n) / 2.14;
                o.putImageData(s, 0, 0)
            }
        }),
        e.Image.filters.Sepia2.fromObject = function() {
            return new e.Image.filters.Sepia2
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.Tint = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Tint",
            initialize: function(t) {
                t = t || {},
                this.color = t.color || "#000000",
                this.opacity = void 0 !== t.opacity ? t.opacity: new e.Color(this.color).getAlpha()
            },
            applyTo: function(t) {
                var i, r, n, o, s, a, h, c, l, u = t.getContext("2d"),
                f = u.getImageData(0, 0, t.width, t.height),
                d = f.data,
                p = d.length;
                for (r = (l = new e.Color(this.color).getSource())[0] * this.opacity, n = l[1] * this.opacity, o = l[2] * this.opacity, c = 1 - this.opacity, i = 0; i < p; i += 4) s = d[i],
                a = d[i + 1],
                h = d[i + 2],
                d[i] = r + s * c,
                d[i + 1] = n + a * c,
                d[i + 2] = o + h * c;
                u.putImageData(f, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color,
                    opacity: this.opacity
                })
            }
        }),
        e.Image.filters.Tint.fromObject = function(t) {
            return new e.Image.filters.Tint(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend;
        e.Image.filters.Multiply = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Multiply",
            initialize: function(t) {
                t = t || {},
                this.color = t.color || "#000000"
            },
            applyTo: function(t) {
                var i, r, n = t.getContext("2d"),
                o = n.getImageData(0, 0, t.width, t.height),
                s = o.data,
                a = s.length;
                for (r = new e.Color(this.color).getSource(), i = 0; i < a; i += 4) s[i] *= r[0] / 255,
                s[i + 1] *= r[1] / 255,
                s[i + 2] *= r[2] / 255;
                n.putImageData(o, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color
                })
            }
        }),
        e.Image.filters.Multiply.fromObject = function(t) {
            return new e.Image.filters.Multiply(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric;
        e.Image.filters.Blend = e.util.createClass({
            type: "Blend",
            initialize: function(t) {
                t = t || {},
                this.color = t.color || "#000",
                this.image = t.image || !1,
                this.mode = t.mode || "multiply",
                this.alpha = t.alpha || 1
            },
            applyTo: function(t) {
                var i, r, n, o, s, a, h, c = t.getContext("2d"),
                l = c.getImageData(0, 0, t.width, t.height),
                u = l.data,
                f = !1;
                if (this.image) {
                    f = !0;
                    var d = e.util.createCanvasElement();
                    d.width = this.image.width,
                    d.height = this.image.height;
                    var p = new e.StaticCanvas(d);
                    p.add(this.image),
                    h = p.getContext("2d").getImageData(0, 0, p.width, p.height).data
                } else i = (h = new e.Color(this.color).getSource())[0] * this.alpha,
                r = h[1] * this.alpha,
                n = h[2] * this.alpha;
                for (var g = 0,
                m = u.length; g < m; g += 4) switch (o = u[g], s = u[g + 1], a = u[g + 2], f && (i = h[g] * this.alpha, r = h[g + 1] * this.alpha, n = h[g + 2] * this.alpha), this.mode) {
                case "multiply":
                    u[g] = o * i / 255,
                    u[g + 1] = s * r / 255,
                    u[g + 2] = a * n / 255;
                    break;
                case "screen":
                    u[g] = 1 - (1 - o) * (1 - i),
                    u[g + 1] = 1 - (1 - s) * (1 - r),
                    u[g + 2] = 1 - (1 - a) * (1 - n);
                    break;
                case "add":
                    u[g] = Math.min(255, o + i),
                    u[g + 1] = Math.min(255, s + r),
                    u[g + 2] = Math.min(255, a + n);
                    break;
                case "diff":
                case "difference":
                    u[g] = Math.abs(o - i),
                    u[g + 1] = Math.abs(s - r),
                    u[g + 2] = Math.abs(a - n);
                    break;
                case "subtract":
                    var v = o - i,
                    b = s - r,
                    y = a - n;
                    u[g] = v < 0 ? 0 : v,
                    u[g + 1] = b < 0 ? 0 : b,
                    u[g + 2] = y < 0 ? 0 : y;
                    break;
                case "darken":
                    u[g] = Math.min(o, i),
                    u[g + 1] = Math.min(s, r),
                    u[g + 2] = Math.min(a, n);
                    break;
                case "lighten":
                    u[g] = Math.max(o, i),
                    u[g + 1] = Math.max(s, r),
                    u[g + 2] = Math.max(a, n)
                }
                c.putImageData(l, 0, 0)
            }
        }),
        e.Image.filters.Blend.fromObject = function(t) {
            return new e.Image.filters.Blend(t)
        }
    } (void 0 !== exports ? exports: this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
        i = e.util.object.extend,
        r = e.util.object.clone,
        n = e.util.toFixed,
        o = e.StaticCanvas.supports("setLineDash");
        if (e.Text) e.warn("fabric.Text is already defined");
        else {
            var s = e.Object.prototype.stateProperties.concat();
            s.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "useNative", "path"),
            e.Text = e.util.createClass(e.Object, {
                _dimensionAffectingProps: {
                    fontSize: !0,
                    fontWeight: !0,
                    fontFamily: !0,
                    textDecoration: !0,
                    fontStyle: !0,
                    lineHeight: !0,
                    stroke: !0,
                    strokeWidth: !0,
                    text: !0
                },
                _reNewline: /\r?\n/,
                type: "text",
                fontSize: 40,
                fontWeight: "normal",
                fontFamily: "Times New Roman",
                textDecoration: "",
                textAlign: "left",
                fontStyle: "",
                lineHeight: 1.3,
                textBackgroundColor: "",
                path: null,
                useNative: !0,
                stateProperties: s,
                stroke: null,
                shadow: null,
                initialize: function(t, e) {
                    e = e || {},
                    this.text = t,
                    this.__skipDimension = !0,
                    this.setOptions(e),
                    this.__skipDimension = !1,
                    this._initDimensions()
                },
                _initDimensions: function() {
                    if (!this.__skipDimension) {
                        var t = e.util.createCanvasElement();
                        this._render(t.getContext("2d"))
                    }
                },
                toString: function() {
                    return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
                },
                _render: function(t) {
                    void 0 === Cufon || !0 === this.useNative ? this._renderViaNative(t) : this._renderViaCufon(t)
                },
                _renderViaNative: function(t) {
                    var i = this.text.split(this._reNewline);
                    this._setTextStyles(t),
                    this.width = this._getTextWidth(t, i),
                    this.height = this._getTextHeight(t, i),
                    this.clipTo && e.util.clipContext(this, t),
                    this._renderTextBackground(t, i),
                    this._translateForTextAlign(t),
                    this._renderText(t, i),
                    "left" !== this.textAlign && "justify" !== this.textAlign && t.restore(),
                    this._renderTextDecoration(t, i),
                    this.clipTo && t.restore(),
                    this._setBoundaries(t, i),
                    this._totalLineHeight = 0
                },
                _renderText: function(t, e) {
                    t.save(),
                    this._setShadow(t),
                    this._setupFillRule(t),
                    this._renderTextFill(t, e),
                    this._renderTextStroke(t, e),
                    this._restoreFillRule(t),
                    this._removeShadow(t),
                    t.restore()
                },
                _translateForTextAlign: function(t) {
                    "left" !== this.textAlign && "justify" !== this.textAlign && (t.save(), t.translate("center" === this.textAlign ? this.width / 2 : this.width, 0))
                },
                _setBoundaries: function(t, e) {
                    this._boundaries = [];
                    for (var i = 0,
                    r = e.length; i < r; i++) {
                        var n = this._getLineWidth(t, e[i]),
                        o = this._getLineLeftOffset(n);
                        this._boundaries.push({
                            height: this.fontSize * this.lineHeight,
                            width: n,
                            left: o
                        })
                    }
                },
                _setTextStyles: function(t) {
                    this._setFillStyles(t),
                    this._setStrokeStyles(t),
                    t.textBaseline = "alphabetic",
                    this.skipTextAlign || (t.textAlign = this.textAlign),
                    t.font = this._getFontDeclaration()
                },
                _getTextHeight: function(t, e) {
                    return this.fontSize * e.length * this.lineHeight
                },
                _getTextWidth: function(t, e) {
                    for (var i = t.measureText(e[0] || "|").width, r = 1, n = e.length; r < n; r++) {
                        var o = t.measureText(e[r]).width;
                        o > i && (i = o)
                    }
                    return i
                },
                _renderChars: function(t, e, i, r, n) {
                    e[t](i, r, n)
                },
                _renderTextLine: function(t, e, i, r, n, o) {
                    if (n -= this.fontSize / 4, "justify" === this.textAlign) {
                        var s = e.measureText(i).width,
                        a = this.width;
                        if (a > s) for (var h = i.split(/\s+/), c = (a - e.measureText(i.replace(/\s+/g, "")).width) / (h.length - 1), l = 0, u = 0, f = h.length; u < f; u++) this._renderChars(t, e, h[u], r + l, n, o),
                        l += e.measureText(h[u]).width + c;
                        else this._renderChars(t, e, i, r, n, o)
                    } else this._renderChars(t, e, i, r, n, o)
                },
                _getLeftOffset: function() {
                    return e.isLikelyNode ? 0 : -this.width / 2
                },
                _getTopOffset: function() {
                    return - this.height / 2
                },
                _renderTextFill: function(t, e) {
                    if (this.fill || this._skipFillStrokeCheck) {
                        this._boundaries = [];
                        for (var i = 0,
                        r = 0,
                        n = e.length; r < n; r++) i += this._getHeightOfLine(t, r, e),
                        this._renderTextLine("fillText", t, e[r], this._getLeftOffset(), this._getTopOffset() + i, r)
                    }
                },
                _renderTextStroke: function(t, e) {
                    if (this.stroke && 0 !== this.strokeWidth || this._skipFillStrokeCheck) {
                        var i = 0;
                        t.save(),
                        this.strokeDashArray && (1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray), o && t.setLineDash(this.strokeDashArray)),
                        t.beginPath();
                        for (var r = 0,
                        n = e.length; r < n; r++) i += this._getHeightOfLine(t, r, e),
                        this._renderTextLine("strokeText", t, e[r], this._getLeftOffset(), this._getTopOffset() + i, r);
                        t.closePath(),
                        t.restore()
                    }
                },
                _getHeightOfLine: function() {
                    return this.fontSize * this.lineHeight
                },
                _renderTextBackground: function(t, e) {
                    this._renderTextBoxBackground(t),
                    this._renderTextLinesBackground(t, e)
                },
                _renderTextBoxBackground: function(t) {
                    this.backgroundColor && (t.save(), t.fillStyle = this.backgroundColor, t.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height), t.restore())
                },
                _renderTextLinesBackground: function(t, e) {
                    if (this.textBackgroundColor) {
                        t.save(),
                        t.fillStyle = this.textBackgroundColor;
                        for (var i = 0,
                        r = e.length; i < r; i++) if ("" !== e[i]) {
                            var n = this._getLineWidth(t, e[i]),
                            o = this._getLineLeftOffset(n);
                            t.fillRect(this._getLeftOffset() + o, this._getTopOffset() + i * this.fontSize * this.lineHeight, n, this.fontSize * this.lineHeight)
                        }
                        t.restore()
                    }
                },
                _getLineLeftOffset: function(t) {
                    return "center" === this.textAlign ? (this.width - t) / 2 : "right" === this.textAlign ? this.width - t: 0
                },
                _getLineWidth: function(t, e) {
                    return "justify" === this.textAlign ? this.width: t.measureText(e).width
                },
                _renderTextDecoration: function(t, e) {
                    function i(i) {
                        for (var o = 0,
                        s = e.length; o < s; o++) {
                            var a = n._getLineWidth(t, e[o]),
                            h = n._getLineLeftOffset(a);
                            t.fillRect(n._getLeftOffset() + h, ~~ (i + o * n._getHeightOfLine(t, o, e) - r), a, 1)
                        }
                    }
                    if (this.textDecoration) {
                        var r = this._getTextHeight(t, e) / 2,
                        n = this;
                        this.textDecoration.indexOf("underline") > -1 && i(this.fontSize * this.lineHeight),
                        this.textDecoration.indexOf("line-through") > -1 && i(this.fontSize * this.lineHeight - this.fontSize / 2),
                        this.textDecoration.indexOf("overline") > -1 && i(this.fontSize * this.lineHeight - this.fontSize)
                    }
                },
                _getFontDeclaration: function() {
                    return [e.isLikelyNode ? this.fontWeight: this.fontStyle, e.isLikelyNode ? this.fontStyle: this.fontWeight, this.fontSize + "px", e.isLikelyNode ? '"' + this.fontFamily + '"': this.fontFamily].join(" ")
                },
                render: function(t, e) {
                    if (this.visible) {
                        t.save(),
                        this._transform(t, e);
                        var i = this.transformMatrix,
                        r = this.group && "path-group" === this.group.type;
                        r && t.translate( - this.group.width / 2, -this.group.height / 2),
                        i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                        r && t.translate(this.left, this.top),
                        this._render(t),
                        t.restore()
                    }
                },
                toObject: function(t) {
                    var e = i(this.callSuper("toObject", t), {
                        text: this.text,
                        fontSize: this.fontSize,
                        fontWeight: this.fontWeight,
                        fontFamily: this.fontFamily,
                        fontStyle: this.fontStyle,
                        lineHeight: this.lineHeight,
                        textDecoration: this.textDecoration,
                        textAlign: this.textAlign,
                        path: this.path,
                        textBackgroundColor: this.textBackgroundColor,
                        useNative: this.useNative
                    });
                    return this.includeDefaultValues || this._removeDefaultValues(e),
                    e
                },
                toSVG: function(t) {
                    var e = [],
                    i = this.text.split(this._reNewline),
                    r = this._getSVGLeftTopOffsets(i),
                    n = this._getSVGTextAndBg(r.lineTop, r.textLeft, i),
                    o = this._getSVGShadows(r.lineTop, i);
                    return r.textTop += this._fontAscent ? this._fontAscent / 5 * this.lineHeight: 0,
                    this._wrapSVGTextAndBg(e, n, o, r),
                    t ? t(e.join("")) : e.join("")
                },
                _getSVGLeftTopOffsets: function(t) {
                    var e = this.useNative ? this.fontSize * this.lineHeight: -this._fontAscent - this._fontAscent / 5 * this.lineHeight,
                    i = -this.width / 2,
                    r = this.useNative ? this.fontSize - 1 : this.height / 2 - t.length * this.fontSize - this._totalLineHeight;
                    return {
                        textLeft: i + (this.group && "path-group" === this.group.type ? this.left: 0),
                        textTop: r + (this.group && "path-group" === this.group.type ? this.top: 0),
                        lineTop: e
                    }
                },
                _wrapSVGTextAndBg: function(t, e, i, r) {
                    t.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', e.textBgRects.join(""), "<text ", this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ': "", this.fontSize ? 'font-size="' + this.fontSize + '" ': "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ': "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ': "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ': "", 'style="', this.getSvgStyles(), '" ', 'transform="translate(', n(r.textLeft, 2), " ", n(r.textTop, 2), ')">', i.join(""), e.textSpans.join(""), "</text>\n", "</g>\n")
                },
                _getSVGShadows: function(t, i) {
                    var r, o, s = [],
                    a = 1;
                    if (!this.shadow || !this._boundaries) return s;
                    for (r = 0, o = i.length; r < o; r++) if ("" !== i[r]) {
                        var h = this._boundaries && this._boundaries[r] ? this._boundaries[r].left: 0;
                        s.push('<tspan x="', n(h + a + this.shadow.offsetX, 2), 0 === r || this.useNative ? '" y': '" dy', '="', n(this.useNative ? t * r - this.height / 2 + this.shadow.offsetY: t + (0 === r ? this.shadow.offsetY: 0), 2), '" ', this._getFillAttributes(this.shadow.color), ">", e.util.string.escapeXml(i[r]), "</tspan>"),
                        a = 1
                    } else a++;
                    return s
                },
                _getSVGTextAndBg: function(t, e, i) {
                    var r = [],
                    n = [],
                    o = 1;
                    this._setSVGBg(n);
                    for (var s = 0,
                    a = i.length; s < a; s++)"" !== i[s] ? (this._setSVGTextLineText(i[s], s, r, t, o, n), o = 1) : o++,
                    this.textBackgroundColor && this._boundaries && this._setSVGTextLineBg(n, s, e, t);
                    return {
                        textSpans: r,
                        textBgRects: n
                    }
                },
                _setSVGTextLineText: function(t, i, r, o, s) {
                    var a = this._boundaries && this._boundaries[i] ? n(this._boundaries[i].left, 2) : 0;
                    r.push('<tspan x="', a, '" ', 0 === i || this.useNative ? "y": "dy", '="', n(this.useNative ? o * i - this.height / 2 : o * s, 2), '" ', this._getFillAttributes(this.fill), ">", e.util.string.escapeXml(t), "</tspan>")
                },
                _setSVGTextLineBg: function(t, e, i, r) {
                    t.push("<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', n(i + this._boundaries[e].left, 2), '" y="', n(r * e - this.height / 2, 2), '" width="', n(this._boundaries[e].width, 2), '" height="', n(this._boundaries[e].height, 2), '"></rect>\n')
                },
                _setSVGBg: function(t) {
                    this.backgroundColor && this._boundaries && t.push("<rect ", this._getFillAttributes(this.backgroundColor), ' x="', n( - this.width / 2, 2), '" y="', n( - this.height / 2, 2), '" width="', n(this.width, 2), '" height="', n(this.height, 2), '"></rect>')
                },
                _getFillAttributes: function(t) {
                    var i = t && "string" == typeof t ? new e.Color(t) : "";
                    return i && i.getSource() && 1 !== i.getAlpha() ? 'opacity="' + i.getAlpha() + '" fill="' + i.setAlpha(1).toRgb() + '"': 'fill="' + t + '"'
                },
                _set: function(t, e) {
                    "fontFamily" === t && this.path && (this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, "$1" + e + "$3")),
                    this.callSuper("_set", t, e),
                    t in this._dimensionAffectingProps && (this._initDimensions(), this.setCoords())
                },
                complexity: function() {
                    return 1
                }
            }),
            e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" ")),
            e.Text.DEFAULT_SVG_FONT_SIZE = 16,
            e.Text.fromElement = function(t, i) {
                if (!t) return null;
                var r = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES);
                i = e.util.object.extend(i ? e.util.object.clone(i) : {},
                r),
                "dx" in r && (i.left += r.dx),
                "dy" in r && (i.top += r.dy),
                "fontSize" in i || (i.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE),
                i.originX || (i.originX = "left");
                var n = new e.Text(t.textContent, i),
                o = 0;
                return "left" === n.originX && (o = n.getWidth() / 2),
                "right" === n.originX && (o = -n.getWidth() / 2),
                n.set({
                    left: n.getLeft() + o,
                    top: n.getTop() - n.getHeight() / 2
                }),
                n
            },
            e.Text.fromObject = function(t) {
                return new e.Text(t.text, r(t))
            },
            e.util.createAccessors(e.Text)
        }
    } (void 0 !== exports ? exports: this)
}.call({},
window, document, html2canvas);