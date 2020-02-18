/*

 Highcharts funnel module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (c) {
  const q = c.getOptions(); const w = q.plotOptions; const r = c.seriesTypes; const G = c.merge; const F = function () {}; const C = c.each; const x = c.pick; w.funnel = G(w.pie, { animation: !1, center: ['50%', '50%'], width: '90%', neckWidth: '30%', height: '100%', neckHeight: '25%', reversed: !1, dataLabels: { connectorWidth: 1, connectorColor: '#606060' }, size: !0, states: { select: { color: '#C0C0C0', borderColor: '#000000', shadow: !1 } } }); r.funnel = c.extendClass(r.pie, {
    type: 'funnel',
    animate: F,
    translate () {
      var a = function (b, a) {
        return /%$/.test(b) ? a * parseInt(b, 10) / 100 : parseInt(b,
          10)
      }; let D = 0; var f = this.chart; const d = this.options; const c = d.reversed; const n = d.ignoreHiddenPoint; const g = f.plotWidth; const h = f.plotHeight; let q = 0; var f = d.center; const i = a(f[0], g); const r = a(f[1], h); const w = a(d.width, g); let k; let s; const e = a(d.height, h); const t = a(d.neckWidth, g); const u = a(d.neckHeight, h); const y = e - u; var a = this.data; let z; let A; const x = d.dataLabels.position === 'left' ? 1 : 0; let B; let l; let E; let p; let j; let v; let m; this.getWidthAt = s = function (b) { return b > e - u || e === u ? t : t + (w - t) * ((e - u - b) / (e - u)) }; this.getX = function (b, a) { return i + (a ? -1 : 1) * (s(c ? h - b : b) / 2 + d.dataLabels.distance) }; this.center = [i, r, e]; this.centerX = i; C(a, function (b) {
        if (!n ||
b.visible !== !1) { D += b.y }
      }); C(a, function (b) { m = null; A = D ? b.y / D : 0; l = r - e / 2 + q * e; j = l + A * e; k = s(l); B = i - k / 2; E = B + k; k = s(j); p = i - k / 2; v = p + k; l > y ? (B = p = i - t / 2, E = v = i + t / 2) : j > y && (m = j, k = s(y), p = i - k / 2, v = p + k, j = y); c && (l = e - l, j = e - j, m = m ? e - m : null); z = ['M', B, l, 'L', E, l, v, j]; m && z.push(v, m, p, m); z.push(p, j, 'Z'); b.shapeType = 'path'; b.shapeArgs = { d: z }; b.percentage = A * 100; b.plotX = i; b.plotY = (l + (m || j)) / 2; b.tooltipPos = [i, b.plotY]; b.slice = F; b.half = x; if (!n || b.visible !== !1) { q += A } })
    },
    drawPoints () {
      const a = this; const c = a.options; const f = a.chart.renderer; C(a.data,
        function (d) { const o = d.options; const n = d.graphic; const g = d.shapeArgs; n ? n.animate(g) : d.graphic = f.path(g).attr({ fill: d.color, stroke: x(o.borderColor, c.borderColor), 'stroke-width': x(o.borderWidth, c.borderWidth) }).add(a.group) })
    },
    sortByAngle (a) { a.sort(function (a, c) { return a.plotY - c.plotY }) },
    drawDataLabels () {
      const a = this.data; const c = this.options.dataLabels.distance; let f; let d; let o; let n = a.length; let g; let h; for (this.center[2] -= 2 * c; n--;) {
        o = a[n], d = (f = o.half) ? 1 : -1, h = o.plotY, g = this.getX(h, f), o.labelPos = [0, h, g + (c - 5) * d, h, g + c * d, h, f ? 'right'
          : 'left', 0]
      }r.pie.prototype.drawDataLabels.call(this)
    }
  }); q.plotOptions.pyramid = c.merge(q.plotOptions.funnel, { neckWidth: '0%', neckHeight: '0%', reversed: !0 }); c.seriesTypes.pyramid = c.extendClass(c.seriesTypes.funnel, { type: 'pyramid' })
})(Highcharts)
