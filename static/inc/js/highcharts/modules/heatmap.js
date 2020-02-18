/*
 Highstock JS v2.1.9 (2015-10-07)

 (c) 2011-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (h) {
  const n = h.Axis; let r = h.Chart; const k = h.Color; const y = h.Legend; const t = h.LegendSymbolMixin; const u = h.Series; const z = h.Point; const v = h.getOptions(); const i = h.each; const s = h.extend; const w = h.extendClass; const l = h.merge; const m = h.pick; const p = h.seriesTypes; const x = h.wrap; const o = function () {}; const q = h.ColorAxis = function () { this.isColorAxis = !0; this.init.apply(this, arguments) }; s(q.prototype, n.prototype); s(q.prototype, {
    defaultColorAxisOptions: {
      lineWidth: 0,
      minPadding: 0,
      maxPadding: 0,
      gridLineWidth: 1,
      tickPixelInterval: 72,
      startOnTick: !0,
      endOnTick: !0,
      offset: 0,
      marker: {
        animation: { duration: 50 },
        color: 'gray',
        width: 0.01
      },
      labels: { overflow: 'justify' },
      minColor: '#EFEFFF',
      maxColor: '#003875',
      tickLength: 5
    },
    init (a, b) { const c = a.options.legend.layout !== 'vertical'; let e; e = l(this.defaultColorAxisOptions, { side: c ? 2 : 1, reversed: !c }, b, { opposite: !c, showEmpty: !1, title: null, isColor: !0 }); n.prototype.init.call(this, a, e); b.dataClasses && this.initDataClasses(b); this.initStops(b); this.horiz = c; this.zoomEnabled = !1 },
    tweenColors (a, b, c) {
      let e; !b.rgba.length || !a.rgba.length ? a = b.raw || 'none' : (a = a.rgba, b = b.rgba,
      e = b[3] !== 1 || a[3] !== 1, a = (e ? 'rgba(' : 'rgb(') + Math.round(b[0] + (a[0] - b[0]) * (1 - c)) + ',' + Math.round(b[1] + (a[1] - b[1]) * (1 - c)) + ',' + Math.round(b[2] + (a[2] - b[2]) * (1 - c)) + (e ? ',' + (b[3] + (a[3] - b[3]) * (1 - c)) : '') + ')'); return a
    },
    initDataClasses (a) {
      const b = this; const c = this.chart; let e; let d = 0; const f = this.options; const g = a.dataClasses.length; this.dataClasses = e = []; this.legendItems = []; i(a.dataClasses, function (a, h) {
        let i; var a = l(a); e.push(a); if (!a.color) {
          f.dataClassColor === 'category' ? (i = c.options.colors, a.color = i[d++], d === i.length && (d = 0)) : a.color =
b.tweenColors(k(f.minColor), k(f.maxColor), g < 2 ? 0.5 : h / (g - 1))
        }
      })
    },
    initStops (a) { this.stops = a.stops || [[0, this.options.minColor], [1, this.options.maxColor]]; i(this.stops, function (a) { a.color = k(a[1]) }) },
    setOptions (a) { n.prototype.setOptions.call(this, a); this.options.crosshair = this.options.marker; this.coll = 'colorAxis' },
    setAxisSize () {
      let a = this.legendSymbol; const b = this.chart; let c; let e; let d; if (a) {
        this.left = c = a.attr('x'), this.top = e = a.attr('y'), this.width = d = a.attr('width'), this.height = a = a.attr('height'),
        this.right = b.chartWidth - c - d, this.bottom = b.chartHeight - e - a, this.len = this.horiz ? d : a, this.pos = this.horiz ? c : e
      }
    },
    toColor (a, b) {
      let c; let e = this.stops; let d; const f = this.dataClasses; let g; let j; if (f) { for (j = f.length; j--;) { if (g = f[j], d = g.from, e = g.to, (d === void 0 || a >= d) && (e === void 0 || a <= e)) { c = g.color; if (b) { b.dataClass = j } break } } } else {
        this.isLog && (a = this.val2lin(a)); c = 1 - (this.max - a) / (this.max - this.min || 1); for (j = e.length; j--;) { if (c > e[j][0]) { break } } d = e[j] || e[j + 1]; e = e[j + 1] || d; c = 1 - (e[0] - c) / (e[0] - d[0] || 1); c = this.tweenColors(d.color, e.color,
          c)
      } return c
    },
    getOffset () { const a = this.legendGroup; const b = this.chart.axisOffset[this.side]; if (a) { this.axisParent = a; n.prototype.getOffset.call(this); if (!this.added) { this.added = !0, this.labelLeft = 0, this.labelRight = this.width } this.chart.axisOffset[this.side] = b } },
    setLegendColor () { let a; const b = this.options; a = this.reversed; a = this.horiz ? [+a, 0, +!a, 0] : [0, +!a, 0, +a]; this.legendColor = { linearGradient: { x1: a[0], y1: a[1], x2: a[2], y2: a[3] }, stops: b.stops || [[0, b.minColor], [1, b.maxColor]] } },
    drawLegendSymbol (a,
      b) { const c = a.padding; var e = a.options; const d = this.horiz; const f = m(e.symbolWidth, d ? 200 : 12); const g = m(e.symbolHeight, d ? 12 : 200); const j = m(e.labelPadding, d ? 16 : 30); var e = m(e.itemDistance, 10); this.setLegendColor(); b.legendSymbol = this.chart.renderer.rect(0, a.baseline - 11, f, g).attr({ zIndex: 1 }).add(b.legendGroup); b.legendSymbol.getBBox(); this.legendItemWidth = f + c + (d ? e : j); this.legendItemHeight = g + c + (d ? j : 0) },
    setState: o,
    visible: !0,
    setVisible: o,
    getSeriesExtremes () {
      let a; if (this.series.length) {
        a = this.series[0], this.dataMin = a.valueMin, this.dataMax =
a.valueMax
      }
    },
    drawCrosshair (a, b) { const c = b && b.plotX; const e = b && b.plotY; let d; const f = this.pos; const g = this.len; if (b) { d = this.toPixels(b[b.series.colorKey]), d < f ? d = f - 2 : d > f + g && (d = f + g + 2), b.plotX = d, b.plotY = this.len - d, n.prototype.drawCrosshair.call(this, a, b), b.plotX = c, b.plotY = e, this.cross && this.cross.attr({ fill: this.crosshair.color }).add(this.legendGroup) } },
    getPlotLinePath (a, b, c, e, d) {
      return typeof d === 'number' ? this.horiz ? ['M', d - 4, this.top - 6, 'L', d + 4, this.top - 6, d, this.top, 'Z'] : ['M', this.left, d, 'L', this.left - 6, d + 6, this.left -
6, d - 6, 'Z'] : n.prototype.getPlotLinePath.call(this, a, b, c, e)
    },
    update (a, b) { const c = this.chart; const e = c.legend; i(this.series, function (a) { a.isDirtyData = !0 }); if (a.dataClasses && e.allItems) { i(e.allItems, function (a) { a.isDataClass && a.legendGroup.destroy() }), c.isDirtyLegend = !0 }c.options[this.coll] = l(this.userOptions, a); n.prototype.update.call(this, a, b); this.legendItem && (this.setLegendColor(), e.colorizeItem(this, !0)) },
    getDataClassLegendSymbols () {
      const a = this; const b = this.chart; const c = this.legendItems; const e = b.options.legend
      const d = e.valueDecimals; const f = e.valueSuffix || ''; let g; c.length || i(this.dataClasses, function (e, n) {
        let k = !0; const l = e.from; const m = e.to; g = ''; l === void 0 ? g = '< ' : m === void 0 && (g = '> '); l !== void 0 && (g += h.numberFormat(l, d) + f); l !== void 0 && m !== void 0 && (g += ' - '); m !== void 0 && (g += h.numberFormat(m, d) + f); c.push(s({
          chart: b,
          name: g,
          options: {},
          drawLegendSymbol: t.drawRectangle,
          visible: !0,
          setState: o,
          isDataClass: !0,
          setVisible () {
            k = this.visible = !k; i(a.series, function (a) { i(a.points, function (a) { a.dataClass === n && a.setVisible(k) }) }); b.legend.colorizeItem(this,
              k)
          }
        }, e))
      }); return c
    },
    name: ''
  }); i(['fill', 'stroke'], function (a) { HighchartsAdapter.addAnimSetter(a, function (b) { b.elem.attr(a, q.prototype.tweenColors(k(b.start), k(b.end), b.pos)) }) }); x(r.prototype, 'getAxes', function (a) { const b = this.options.colorAxis; a.call(this); this.colorAxis = []; b && new q(this, b) }); x(y.prototype, 'getAllItems', function (a) { let b = []; const c = this.chart.colorAxis[0]; c && (c.options.dataClasses ? b = b.concat(c.getDataClassLegendSymbols()) : b.push(c), i(c.series, function (a) { a.options.showInLegend = !1 })); return b.concat(a.call(this)) })
  r = {
    pointAttrToOptions: { stroke: 'borderColor', 'stroke-width': 'borderWidth', fill: 'color', dashstyle: 'dashStyle' },
    pointArrayMap: ['value'],
    axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
    optionalAxis: 'colorAxis',
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    getSymbol: o,
    parallelArrays: ['x', 'y', 'value'],
    colorKey: 'value',
    translateColors () {
      const a = this; const b = this.options.nullColor; const c = this.colorAxis; const e = this.colorKey; i(this.data, function (d) {
        let f = d[e]; if (f = d.options.color || (f === null ? b : c && f !== void 0 ? c.toColor(f,
          d) : d.color || a.color)) { d.color = f }
      })
    }
  }; v.plotOptions.heatmap = l(v.plotOptions.scatter, { animation: !1, borderWidth: 0, nullColor: '#F8F8F8', dataLabels: { formatter () { return this.point.value }, inside: !0, verticalAlign: 'middle', crop: !1, overflow: !1, padding: 0 }, marker: null, pointRange: null, tooltip: { pointFormat: '{point.x}, {point.y}: {point.value}<br/>' }, states: { normal: { animation: !0 }, hover: { halo: !1, brightness: 0.2 } } }); p.heatmap = w(p.scatter, l(r, {
    type: 'heatmap',
    pointArrayMap: ['y', 'value'],
    hasPointSpecificOptions: !0,
    pointClass: w(z, { setVisible (a) { const b = this; const c = a ? 'show' : 'hide'; i(['graphic', 'dataLabel'], function (a) { if (b[a]) { b[a][c]() } }) } }),
    supportsDrilldown: !0,
    getExtremesFromAll: !0,
    directTouch: !0,
    init () { let a; p.scatter.prototype.init.apply(this, arguments); a = this.options; this.pointRange = a.pointRange = m(a.pointRange, a.colsize || 1); this.yAxis.axisPointRange = a.rowsize || 1 },
    translate () {
      const a = this.options; const b = this.xAxis; const c = this.yAxis; const e = function (a, b, c) { return Math.min(Math.max(b, a), c) }; this.generatePoints()
      i(this.points, function (d) { var f = (a.colsize || 1) / 2; var g = (a.rowsize || 1) / 2; const h = e(Math.round(b.len - b.translate(d.x - f, 0, 1, 0, 1)), 0, b.len); var f = e(Math.round(b.len - b.translate(d.x + f, 0, 1, 0, 1)), 0, b.len); const i = e(Math.round(c.translate(d.y - g, 0, 1, 0, 1)), 0, c.len); var g = e(Math.round(c.translate(d.y + g, 0, 1, 0, 1)), 0, c.len); d.plotX = d.clientX = (h + f) / 2; d.plotY = (i + g) / 2; d.shapeType = 'rect'; d.shapeArgs = { x: Math.min(h, f), y: Math.min(i, g), width: Math.abs(f - h), height: Math.abs(g - i) } }); this.translateColors(); this.chart.hasRendered && i(this.points, function (a) {
        a.shapeArgs.fill =
a.options.color || a.color
      })
    },
    drawPoints: p.column.prototype.drawPoints,
    animate: o,
    getBox: o,
    drawLegendSymbol: t.drawRectangle,
    getExtremes () { u.prototype.getExtremes.call(this, this.valueData); this.valueMin = this.dataMin; this.valueMax = this.dataMax; u.prototype.getExtremes.call(this) }
  }))
})(Highcharts)
