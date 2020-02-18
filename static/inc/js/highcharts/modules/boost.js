(function (g, p) {
  function x (a, b, c, d, i) { i = i || 0; d = d || y; m(a.slice(i, i + d), b); i + d < a.length ? setTimeout(function () { x(a, b, c, d, i + d) }) : c && c() } const O = function () {}; const P = g.Color; const l = g.Series; const e = g.seriesTypes; var m = g.each; const s = g.extend; const Q = p.addEvent; const R = p.fireEvent; const S = g.merge; const T = g.pick; const k = g.wrap; const q = g.getOptions().plotOptions; var y = 5e4; m(['area', 'arearange', 'column', 'line', 'scatter'], function (a) { if (q[a]) { q[a].boostThreshold = 5e3 } }); m(['translate', 'generatePoints', 'drawTracker', 'drawPoints', 'render'], function (a) {
    function b (b) {
      const d = this.options.stacking &&
(a === 'translate' || a === 'generatePoints'); if ((this.processedXData || this.options.data).length < (this.options.boostThreshold || Number.MAX_VALUE) || d) { if (a === 'render' && this.image) { this.image.attr({ href: '' }), this.animate = null } b.call(this) } else if (this[a + 'Canvas']) { this[a + 'Canvas']() }
    }k(l.prototype, a, b); a === 'translate' && (e.column && k(e.column.prototype, a, b), e.arearange && k(e.arearange.prototype, a, b))
  }); k(l.prototype, 'getExtremes', function (a) {
    this.hasExtremes() || a.apply(this, Array.prototype.slice.call(arguments,
      1))
  }); k(l.prototype, 'setData', function (a) { this.hasExtremes(!0) || a.apply(this, Array.prototype.slice.call(arguments, 1)) }); k(l.prototype, 'processData', function (a) { this.hasExtremes(!0) || a.apply(this, Array.prototype.slice.call(arguments, 1)) }); g.extend(l.prototype, {
    pointRange: 0,
    hasExtremes (a) {
      const b = this.options; const c = this.xAxis && this.xAxis.options; const d = this.yAxis && this.yAxis.options; return b.data.length > (b.boostThreshold || Number.MAX_VALUE) && typeof d.min === 'number' && typeof d.max === 'number' && (!a || typeof c.min ===
'number' && typeof c.max === 'number')
    },
    destroyGraphics () { const a = this; const b = this.points; let c; let d; for (d = 0; d < b.length; d += 1) { if ((c = b[d]) && c.graphic) { c.graphic = c.graphic.destroy() } }m(['graph', 'area'], function (b) { a[b] && (a[b] = a[b].destroy()) }) },
    getContext () {
      const a = this.chart.plotWidth; const b = this.chart.plotHeight; this.canvas ? this.ctx.clearRect(0, 0, a, b) : (this.canvas = document.createElement('canvas'), this.image = this.chart.renderer.image('', 0, 0, a, b).add(this.group), this.ctx = this.canvas.getContext('2d')); this.canvas.setAttribute('width',
        a); this.canvas.setAttribute('height', b); this.image.attr({ width: a, height: b }); return this.ctx
    },
    canvasToSVG () { this.image.attr({ href: this.canvas.toDataURL('image/png') }) },
    cvsLineTo (a, b, c) { a.lineTo(b, c) },
    renderCanvas () {
      const a = this; const b = a.options; const c = a.chart; const d = this.xAxis; const i = this.yAxis; let h; let g; let e = 0; const k = a.processedXData; const l = a.processedYData; const m = b.data; var j = d.getExtremes(); const p = j.min; const q = j.max; var j = i.getExtremes(); const U = j.min; const V = j.max; const z = {}; let t; const W = !!a.sampling; let A; const B = b.marker && b.marker.radius; const C = this.cvsDrawPoint; const D = b.lineWidth
        ? this.cvsLineTo : !1; const E = B <= 1 ? this.cvsMarkerSquare : this.cvsMarkerCircle; const X = b.enableMouseTracking !== !1; let F; var j = b.threshold; let n = i.getThreshold(j); const G = typeof j === 'number'; const H = n; const Y = this.fill; const I = a.pointArrayMap && a.pointArrayMap.join(',') === 'low,high'; const J = !!b.stacking; const Z = a.cropStart || 0; var j = c.options.loading; const $ = a.requireSorting; let K; const aa = b.connectNulls; const L = !k; let u; let v; let o; let r; const ba = a.fillOpacity ? (new P(a.color)).setOpacity(T(b.fillOpacity, 0.75)).get() : a.color; const M = function () {
        Y ? (h.fillStyle = ba, h.fill()) : (h.strokeStyle = a.color, h.lineWidth = b.lineWidth,
        h.stroke())
      }; const N = function (a, b, c) { e === 0 && h.beginPath(); K ? h.moveTo(a, b) : C ? C(h, a, b, c, F) : D ? D(h, a, b) : E && E(h, a, b, B); e += 1; e === 1e3 && (M(), e = 0); F = { clientX: a, plotY: b, yBottom: c } }; const w = function (a, b, c) { X && !z[a + ',' + b] && (A.push({ clientX: a, plotX: a, plotY: b, i: Z + c }), z[a + ',' + b] = !0) }; this.points && this.destroyGraphics(); a.plotGroup('group', 'series', a.visible ? 'visible' : 'hidden', b.zIndex, c.seriesGroup); a.getAttribs(); a.markerGroup = a.group; Q(a, 'destroy', function () { a.markerGroup = null }); A = this.points = []; h = this.getContext(); a.buildKDTree =
O; if (m.length > 99999) { c.options.loading = S(j, { labelStyle: { backgroundColor: 'rgba(255,255,255,0.75)', padding: '1em', borderRadius: '0.5em' }, style: { backgroundColor: 'none', opacity: 1 } }), c.showLoading('Drawing...'), c.options.loading = j, c.loadingShown === !0 ? c.loadingShown = 1 : c.loadingShown += 1 }g = 0; x(J ? a.data : k || m, function (b) {
        let c; let f; let e; let h = !0; L ? (c = b[0], f = b[1]) : (c = b, f = l[g]); if (I) { L && (f = b.slice(1, 3)), e = f[0], f = f[1] } else if (J) { c = b.x, f = b.stackY, e = f - b.y }b = f === null; $ || (h = f >= U && f <= V); if (!b && c >= p && c <= q && h) {
          if (c = Math.round(d.toPixels(c,
            !0)), W) { if (o === void 0 || c === t) { I || (e = f); if (r === void 0 || f > v) { v = f, r = g } if (o === void 0 || e < u) { u = e, o = g } }c !== t && (o !== void 0 && (f = i.toPixels(v, !0), n = i.toPixels(u, !0), N(c, G ? Math.min(f, H) : f, G ? Math.max(n, H) : n), w(c, f, r), n !== f && w(c, n, o)), o = r = void 0, t = c) } else { f = Math.round(i.toPixels(f, !0)), N(c, f, n), w(c, f, g) }
        } K = b && !aa; g += 1; g % y === 0 && a.canvasToSVG()
      }, function () {
        const b = c.loadingDiv; const d = +c.loadingShown; M(); a.canvasToSVG(); R(a, 'renderedCanvas'); if (d === 1) {
          s(b.style, { transition: 'opacity 250ms', opacity: 0 }), c.loadingShown = !1, setTimeout(function () {
            b.parentNode &&
b.parentNode.removeChild(b); c.loadingDiv = c.loadingSpan = null
          }, 250)
        } if (d) { c.loadingShown = d - 1 }a.directTouch = !1; a.options.stickyTracking = !0; delete a.buildKDTree; a.buildKDTree()
      }, c.renderer.forExport ? Number.MAX_VALUE : void 0)
    }
  }); e.scatter.prototype.cvsMarkerCircle = function (a, b, c, d) { a.moveTo(b, c); a.arc(b, c, d, 0, 2 * Math.PI, !1) }; e.scatter.prototype.cvsMarkerSquare = function (a, b, c, d) { a.moveTo(b, c); a.rect(b - d, c - d, d * 2, d * 2) }; e.scatter.prototype.fill = !0; s(e.area.prototype, {
    cvsDrawPoint (a, b, c, d, e) {
      e && b !== e.clientX &&
(a.moveTo(e.clientX, e.yBottom), a.lineTo(e.clientX, e.plotY), a.lineTo(b, c), a.lineTo(b, d))
    },
    fill: !0,
    fillOpacity: !0,
    sampling: !0
  }); s(e.column.prototype, { cvsDrawPoint (a, b, c, d) { a.rect(b - 1, c, 1, d - c) }, fill: !0, sampling: !0 }); k(l.prototype, 'searchPoint', function (a) { const b = a.apply(this, [].slice.call(arguments, 1)); let c = b; if (b && !(b instanceof this.pointClass)) { c = (new this.pointClass()).init(this, this.options.data[b.i]), c.dist = b.dist, c.category = c.x, c.plotX = b.plotX, c.plotY = b.plotY } return c })
})(Highcharts, HighchartsAdapter)
