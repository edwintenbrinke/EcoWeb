(function (f) {
  function A (b, a, c) { let d; !a.rgba.length || !b.rgba.length ? b = a.raw || 'none' : (b = b.rgba, a = a.rgba, d = a[3] !== 1 || b[3] !== 1, b = (d ? 'rgba(' : 'rgb(') + Math.round(a[0] + (b[0] - a[0]) * (1 - c)) + ',' + Math.round(a[1] + (b[1] - a[1]) * (1 - c)) + ',' + Math.round(a[2] + (b[2] - a[2]) * (1 - c)) + (d ? ',' + (a[3] + (b[3] - a[3]) * (1 - c)) : '') + ')'); return b } const t = function () {}; var q = f.getOptions(); const h = f.each; const l = f.extend; const B = f.format; const u = f.pick; const r = f.wrap; const m = f.Chart; const p = f.seriesTypes; const v = p.pie; const n = p.column; const w = f.Tick; const x = HighchartsAdapter.fireEvent; const y = HighchartsAdapter.inArray
  let z = 1; h(['fill', 'stroke'], function (b) { HighchartsAdapter.addAnimSetter(b, function (a) { a.elem.attr(b, A(f.Color(a.start), f.Color(a.end), a.pos)) }) }); l(q.lang, { drillUpText: '\u25C1 Back to {series.name}' }); q.drilldown = { activeAxisLabelStyle: { cursor: 'pointer', color: '#0d233a', fontWeight: 'bold', textDecoration: 'underline' }, activeDataLabelStyle: { cursor: 'pointer', color: '#0d233a', fontWeight: 'bold', textDecoration: 'underline' }, animation: { duration: 500 }, drillUpButton: { position: { align: 'right', x: -10, y: 10 } } }; f.SVGRenderer.prototype.Element.prototype.fadeIn =
function (b) { this.attr({ opacity: 0.1, visibility: 'inherit' }).animate({ opacity: u(this.newOpacity, 1) }, b || { duration: 250 }) }; m.prototype.addSeriesAsDrilldown = function (b, a) { this.addSingleSeriesAsDrilldown(b, a); this.applyDrilldown() }; m.prototype.addSingleSeriesAsDrilldown = function (b, a) {
    const c = b.series; const d = c.xAxis; const g = c.yAxis; let e; e = b.color || c.color; let i; let f = []; let j = []; let k; let o; if (!this.drilldownLevels) { this.drilldownLevels = [] } k = c.options._levelNumber || 0; (o = this.drilldownLevels[this.drilldownLevels.length - 1]) && o.levelNumber !==
k && (o = void 0); a = l({ color: e, _ddSeriesId: z++ }, a); i = y(b, c.points); h(c.chart.series, function (a) { if (a.xAxis === d && !a.isDrilling) { a.options._ddSeriesId = a.options._ddSeriesId || z++, a.options._colorIndex = a.userOptions._colorIndex, a.options._levelNumber = a.options._levelNumber || k, o ? (f = o.levelSeries, j = o.levelSeriesOptions) : (f.push(a), j.push(a.options)) } }); e = {
      levelNumber: k,
      seriesOptions: c.options,
      levelSeriesOptions: j,
      levelSeries: f,
      shapeArgs: b.shapeArgs,
      bBox: b.graphic ? b.graphic.getBBox() : {},
      color: e,
      lowerSeriesOptions: a,
      pointOptions: c.options.data[i],
      pointIndex: i,
      oldExtremes: { xMin: d && d.userMin, xMax: d && d.userMax, yMin: g && g.userMin, yMax: g && g.userMax }
    }; this.drilldownLevels.push(e); e = e.lowerSeries = this.addSeries(a, !1); e.options._levelNumber = k + 1; if (d) { d.oldPos = d.pos, d.userMin = d.userMax = null, g.userMin = g.userMax = null } if (c.type === e.type) { e.animate = e.animateDrilldown || t, e.options.animation = !0 }
  }; m.prototype.applyDrilldown = function () {
    const b = this.drilldownLevels; let a; if (b && b.length > 0) {
      a = b[b.length - 1].levelNumber, h(this.drilldownLevels,
        function (b) { b.levelNumber === a && h(b.levelSeries, function (b) { b.options && b.options._levelNumber === a && b.remove(!1) }) })
    } this.redraw(); this.showDrillUpButton()
  }; m.prototype.getDrilldownBackText = function () { let b = this.drilldownLevels; if (b && b.length > 0) { return b = b[b.length - 1], b.series = b.seriesOptions, B(this.options.lang.drillUpText, b) } }; m.prototype.showDrillUpButton = function () {
    const b = this; const a = this.getDrilldownBackText(); const c = b.options.drilldown.drillUpButton; let d; let g; this.drillUpButton ? this.drillUpButton.attr({ text: a }).align()
      : (g = (d = c.theme) && d.states, this.drillUpButton = this.renderer.button(a, null, null, function () { b.drillUp() }, d, g && g.hover, g && g.select).attr({ align: c.position.align, zIndex: 9 }).add().align(c.position, !1, c.relativeTo || 'plotBox'))
  }; m.prototype.drillUp = function () {
    for (var b = this, a = b.drilldownLevels, c = a[a.length - 1].levelNumber, d = a.length, g = b.series, e, i, f, j, k = function (a) {
      let c; h(g, function (b) { b.options._ddSeriesId === a._ddSeriesId && (c = b) }); c = c || b.addSeries(a, !1); if (c.type === f.type && c.animateDrillupTo) { c.animate = c.animateDrillupTo }
      a === i.seriesOptions && (j = c)
    }; d--;) {
      if (i = a[d], i.levelNumber === c) {
        a.pop(); f = i.lowerSeries; if (!f.chart) { for (e = g.length; e--;) { if (g[e].options.id === i.lowerSeriesOptions.id && g[e].options._levelNumber === c + 1) { f = g[e]; break } } }f.xData = []; h(i.levelSeriesOptions, k); x(b, 'drillup', { seriesOptions: i.seriesOptions }); if (j.type === f.type) { j.drilldownLevel = i, j.options.animation = b.options.drilldown.animation, f.animateDrillupFrom && f.chart && f.animateDrillupFrom(i) }j.options._levelNumber = c; f.remove(!1); if (j.xAxis) {
          e = i.oldExtremes,
          j.xAxis.setExtremes(e.xMin, e.xMax, !1), j.yAxis.setExtremes(e.yMin, e.yMax, !1)
        }
      }
    } this.redraw(); this.drilldownLevels.length === 0 ? this.drillUpButton = this.drillUpButton.destroy() : this.drillUpButton.attr({ text: this.getDrilldownBackText() }).align(); this.ddDupes.length = []
  }; n.prototype.supportsDrilldown = !0; n.prototype.animateDrillupTo = function (b) {
    if (!b) {
      const a = this; const c = a.drilldownLevel; h(this.points, function (a) { a.graphic && a.graphic.hide(); a.dataLabel && a.dataLabel.hide(); a.connector && a.connector.hide() }); setTimeout(function () {
        a.points &&
h(a.points, function (a, b) { const e = b === (c && c.pointIndex) ? 'show' : 'fadeIn'; const f = e === 'show' ? !0 : void 0; if (a.graphic) { a.graphic[e](f) } if (a.dataLabel) { a.dataLabel[e](f) } if (a.connector) { a.connector[e](f) } })
      }, Math.max(this.chart.options.drilldown.animation.duration - 50, 0)); this.animate = t
    }
  }; n.prototype.animateDrilldown = function (b) {
    const a = this; const c = this.chart.drilldownLevels; let d; const g = this.chart.options.drilldown.animation; const e = this.xAxis; if (!b) {
      h(c, function (b) {
        if (a.options._ddSeriesId === b.lowerSeriesOptions._ddSeriesId) {
          d = b.shapeArgs,
          d.fill = b.color
        }
      }), d.x += u(e.oldPos, e.pos) - e.pos, h(this.points, function (a) { a.graphic && a.graphic.attr(d).animate(l(a.shapeArgs, { fill: a.color }), g); a.dataLabel && a.dataLabel.fadeIn(g) }), this.animate = null
    }
  }; n.prototype.animateDrillupFrom = function (b) {
    const a = this.chart.options.drilldown.animation; let c = this.group; const d = this; h(d.trackerGroups, function (a) { if (d[a]) { d[a].on('mouseover') } }); delete this.group; h(this.points, function (d) {
      const e = d.graphic; const i = function () { e.destroy(); c && (c = c.destroy()) }; e && (delete d.graphic, a ? e.animate(l(b.shapeArgs,
        { fill: b.color }), f.merge(a, { complete: i })) : (e.attr(b.shapeArgs), i()))
    })
  }; v && l(v.prototype, {
    supportsDrilldown: !0,
    animateDrillupTo: n.prototype.animateDrillupTo,
    animateDrillupFrom: n.prototype.animateDrillupFrom,
    animateDrilldown (b) {
      const a = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1]; const c = this.chart.options.drilldown.animation; const d = a.shapeArgs; const g = d.start; const e = (d.end - g) / this.points.length; if (!b) {
        h(this.points, function (b, h) {
          b.graphic.attr(f.merge(d, { start: g + h * e, end: g + (h + 1) * e, fill: a.color }))[c
            ? 'animate' : 'attr'](l(b.shapeArgs, { fill: b.color }), c)
        }), this.animate = null
      }
    }
  }); f.Point.prototype.doDrilldown = function (b, a) {
    const c = this.series.chart; const d = c.options.drilldown; let f = (d.series || []).length; let e; if (!c.ddDupes) { c.ddDupes = [] } for (;f-- && !e;) { d.series[f].id === this.drilldown && y(this.drilldown, c.ddDupes) === -1 && (e = d.series[f], c.ddDupes.push(this.drilldown)) }x(c, 'drilldown', { point: this, seriesOptions: e, category: a, points: a !== void 0 && this.series.xAxis.ddPoints[a].slice(0) }); e && (b ? c.addSingleSeriesAsDrilldown(this, e)
      : c.addSeriesAsDrilldown(this, e))
  }; f.Axis.prototype.drilldownCategory = function (b) { let a; let c; const d = this.ddPoints[b]; for (a in d) { (c = d[a]) && c.series && c.series.visible && c.doDrilldown && c.doDrilldown(!0, b) } this.chart.applyDrilldown() }; f.Axis.prototype.getDDPoints = function (b, a) { let c = this.ddPoints; if (!c) { this.ddPoints = c = {} } c[b] || (c[b] = []); if (c[b].levelNumber !== a) { c[b].length = 0 } return c[b] }; w.prototype.drillable = function () {
    const b = this.pos; const a = this.label; const c = this.axis; const d = c.ddPoints && c.ddPoints[b]; if (a && d && d.length) {
      if (!a.basicStyles) {
        a.basicStyles =
f.merge(a.styles)
      }a.addClass('highcharts-drilldown-axis-label').css(c.chart.options.drilldown.activeAxisLabelStyle).on('click', function () { c.drilldownCategory(b) })
    } else if (a && a.basicStyles) { a.styles = {}, a.css(a.basicStyles), a.on('click', null) }
  }; r(w.prototype, 'addLabel', function (b) { b.call(this); this.drillable() }); r(f.Point.prototype, 'init', function (b, a, c, d) {
    const g = b.call(this, a, c, d); var b = (c = a.xAxis) && c.ticks[d]; var c = c && c.getDDPoints(d, a.options._levelNumber); if (g.drilldown && (f.addEvent(g, 'click', function () {
      a.xAxis &&
a.chart.options.drilldown.allowPointDrilldown === !1 ? a.xAxis.drilldownCategory(d) : g.doDrilldown()
    }), c)) { c.push(g), c.levelNumber = a.options._levelNumber }b && b.drillable(); return g
  }); r(f.Series.prototype, 'drawDataLabels', function (b) { const a = this.chart.options.drilldown.activeDataLabelStyle; b.call(this); h(this.points, function (b) { b.drilldown && b.dataLabel && b.dataLabel.attr({ class: 'highcharts-drilldown-data-label' }).css(a) }) }); let s; var q = function (b) {
    b.call(this); h(this.points, function (a) {
      a.drilldown && a.graphic &&
a.graphic.attr({ class: 'highcharts-drilldown-point' }).css({ cursor: 'pointer' })
    })
  }; for (s in p) { p[s].prototype.supportsDrilldown && r(p[s].prototype, 'drawTracker', q) }
})(Highcharts)
