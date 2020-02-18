/*
  Highstock JS v2.1.9 (2015-10-07)
 Solid angular gauge module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (a) {
  const q = a.getOptions().plotOptions; const r = a.pInt; const s = a.pick; const j = a.each; let k; q.solidgauge = a.merge(q.gauge, { colorByPoint: !0 }); k = {
    initDataClasses (b) { const c = this; const e = this.chart; let d; let o = 0; const f = this.options; this.dataClasses = d = []; j(b.dataClasses, function (g, h) { let p; var g = a.merge(g); d.push(g); if (!g.color) { f.dataClassColor === 'category' ? (p = e.options.colors, g.color = p[o++], o === p.length && (o = 0)) : g.color = c.tweenColors(a.Color(f.minColor), a.Color(f.maxColor), h / (b.dataClasses.length - 1)) } }) },
    initStops (b) {
      this.stops =
b.stops || [[0, this.options.minColor], [1, this.options.maxColor]]; j(this.stops, function (b) { b.color = a.Color(b[1]) })
    },
    toColor (b, c) {
      let e; let d = this.stops; let a; const f = this.dataClasses; let g; let h; if (f) { for (h = f.length; h--;) { if (g = f[h], a = g.from, d = g.to, (a === void 0 || b >= a) && (d === void 0 || b <= d)) { e = g.color; if (c) { c.dataClass = h } break } } } else {
        this.isLog && (b = this.val2lin(b)); e = 1 - (this.max - b) / (this.max - this.min); for (h = d.length; h--;) { if (e > d[h][0]) { break } } a = d[h] || d[h + 1]; d = d[h + 1] || a; e = 1 - (d[0] - e) / (d[0] - a[0] || 1); e = this.tweenColors(a.color,
          d.color, e)
      } return e
    },
    tweenColors (b, c, a) { let d; !c.rgba.length || !b.rgba.length ? b = c.raw || 'none' : (b = b.rgba, c = c.rgba, d = c[3] !== 1 || b[3] !== 1, b = (d ? 'rgba(' : 'rgb(') + Math.round(c[0] + (b[0] - c[0]) * (1 - a)) + ',' + Math.round(c[1] + (b[1] - c[1]) * (1 - a)) + ',' + Math.round(c[2] + (b[2] - c[2]) * (1 - a)) + (d ? ',' + (c[3] + (b[3] - c[3]) * (1 - a)) : '') + ')'); return b }
  }; j(['fill', 'stroke'], function (b) { HighchartsAdapter.addAnimSetter(b, function (c) { c.elem.attr(b, k.tweenColors(a.Color(c.start), a.Color(c.end), c.pos)) }) }); a.seriesTypes.solidgauge =
a.extendClass(a.seriesTypes.gauge, {
  type: 'solidgauge',
  pointAttrToOptions: {},
  bindAxes () { let b; a.seriesTypes.gauge.prototype.bindAxes.call(this); b = this.yAxis; a.extend(b, k); b.options.dataClasses && b.initDataClasses(b.options); b.initStops(b.options) },
  drawPoints () {
    const b = this; const c = b.yAxis; const e = c.center; const d = b.options; const o = b.chart.renderer; const f = d.overshoot; const g = f && typeof f === 'number' ? f / 180 * Math.PI : 0; a.each(b.points, function (a) {
      const f = a.graphic; let i = c.startAngleRad + c.translate(a.y, null, null, null, !0); const j = r(s(a.options.radius,
        d.radius, 100)) * e[2] / 200; let l = r(s(a.options.innerRadius, d.innerRadius, 60)) * e[2] / 200; let m = c.toColor(a.y, a); let n = Math.min(c.startAngleRad, c.endAngleRad); const k = Math.max(c.startAngleRad, c.endAngleRad); m === 'none' && (m = a.color || b.color || 'none'); if (m !== 'none') { a.color = m }i = Math.max(n - g, Math.min(k + g, i)); d.wrap === !1 && (i = Math.max(n, Math.min(k, i))); n = Math.min(i, c.startAngleRad); i = Math.max(i, c.startAngleRad); i - n > 2 * Math.PI && (i = n + 2 * Math.PI); a.shapeArgs = l = { x: e[0], y: e[1], r: j, innerR: l, start: n, end: i, fill: m }; a.startR = j; if (f) {
        if (a = l.d,
        f.animate(l), a) { l.d = a }
      } else { a.graphic = o.arc(l).attr({ stroke: d.borderColor || 'none', 'stroke-width': d.borderWidth || 0, fill: m, 'sweep-flag': 0 }).add(b.group) }
    })
  },
  animate (b) { if (!b) { this.startAngleRad = this.yAxis.startAngleRad, a.seriesTypes.pie.prototype.animate.call(this, b) } }
})
})(Highcharts)
