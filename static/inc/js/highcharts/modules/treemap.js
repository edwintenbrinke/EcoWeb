/*
 Highstock JS v2.1.9 (2015-10-07)

 (c) 2014 Highsoft AS
 Authors: Jon Arild Nygard / Oystein Moseng

 License: www.highcharts.com/license
*/
(function (h) {
  const j = h.seriesTypes; const A = h.map; const o = h.merge; const t = h.extend; const u = h.extendClass; const v = h.getOptions().plotOptions; const w = function () {}; const k = h.each; const r = HighchartsAdapter.grep; const i = h.pick; const m = h.Series; const x = h.Color; const B = function (a, b, c) { let d; var c = c || this; for (d in a) { a.hasOwnProperty(d) && b.call(c, a[d], d, a) } }; const y = function (a, b, c, d) { d = d || this; a = a || []; k(a, function (e, f) { c = b.call(d, c, e, f, a) }); return c }; var q = function (a, b, c) { c = c || this; a = b.call(c, a); a !== !1 && q(a, b, c) }; v.treemap = o(v.scatter, {
    showInLegend: !1,
    marker: !1,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    dataLabels: { enabled: !0, defer: !1, verticalAlign: 'middle', formatter () { return this.point.name || this.point.id }, inside: !0 },
    tooltip: { headerFormat: '', pointFormat: '<b>{point.name}</b>: {point.node.val}</b><br/>' },
    layoutAlgorithm: 'sliceAndDice',
    layoutStartingDirection: 'vertical',
    alternateStartingDirection: !1,
    levelIsConstant: !0,
    states: { hover: { borderColor: '#A0A0A0', brightness: j.heatmap ? 0 : 0.1, shadow: !1 } },
    drillUpButton: { position: { align: 'left', x: 10, y: -50 } }
  }); j.treemap = u(j.scatter, o({
    pointAttrToOptions: {},
    pointArrayMap: ['value'],
    axisTypes: j.heatmap ? ['xAxis', 'yAxis', 'colorAxis'] : ['xAxis', 'yAxis'],
    optionalAxis: 'colorAxis',
    getSymbol: w,
    parallelArrays: ['x', 'y', 'value', 'colorValue'],
    colorKey: 'colorValue',
    translateColors: j.heatmap && j.heatmap.prototype.translateColors
  }, {
    type: 'treemap',
    trackerGroups: ['group', 'dataLabelsGroup'],
    pointClass: u(h.Point, { setVisible: j.pie.prototype.pointClass.prototype.setVisible }),
    getListOfParents (a, b) {
      const c = y(a, function (a, c, b) {
        c = i(c.parent, ''); a[c] === void 0 && (a[c] = [])
        a[c].push(b); return a
      }, {}); B(c, function (a, c, f) { c !== '' && HighchartsAdapter.inArray(c, b) === -1 && (k(a, function (a) { f[''].push(a) }), delete f[c]) }); return c
    },
    getTree () {
      let a; const b = this; a = A(this.data, function (a) { return a.id }); a = b.getListOfParents(this.data, a); b.nodeMap = []; a = b.buildNode('', -1, 0, a, null); q(this.nodeMap[this.rootNode], function (a) { let d = !1; const e = a.parent; a.visible = !0; if (e || e === '') { d = b.nodeMap[e] } return d }); q(this.nodeMap[this.rootNode].children, function (a) {
        let b = !1; k(a, function (a) {
          a.visible = !0
          a.children.length && (b = (b || []).concat(a.children))
        }); return b
      }); this.setTreeValues(a); return a
    },
    init (a, b) { m.prototype.init.call(this, a, b); this.options.allowDrillToNode && this.drillTo() },
    buildNode (a, b, c, d, e) { const f = this; const g = []; const n = f.points[b]; let z; k(d[a] || [], function (b) { z = f.buildNode(f.points[b].id, b, c + 1, d, a); g.push(z) }); b = { id: a, i: b, children: g, level: c, parent: e, visible: !1 }; f.nodeMap[b.id] = b; if (n) { n.node = b } return b },
    setTreeValues (a) {
      const b = this; const c = b.options; let d = 0; const e = []; let f; const g = b.points[a.i]; k(a.children,
        function (a) { a = b.setTreeValues(a); b.insertElementSorted(e, a, function (a, c) { return a.val > c.val }); a.ignore ? q(a.children, function (a) { let c = !1; k(a, function (a) { t(a, { ignore: !0, isLeaf: !1, visible: !1 }); a.children.length && (c = (c || []).concat(a.children)) }); return c }) : d += a.val }); f = i(g && g.value, d); t(a, { children: e, childrenTotal: d, ignore: !(i(g && g.visible, !0) && f > 0), isLeaf: a.visible && !d, levelDynamic: c.levelIsConstant ? a.level : a.level - b.nodeMap[b.rootNode].level, name: i(g && g.name, ''), val: f }); return a
    },
    calculateChildrenAreas (a,
      b) {
      const c = this; var d = c.options; const e = this.levelMap[a.levelDynamic + 1]; const f = i(c[e && e.layoutAlgorithm] && e.layoutAlgorithm, d.layoutAlgorithm); const g = d.alternateStartingDirection; let n = []; var d = r(a.children, function (a) { return !a.ignore }); if (e && e.layoutStartingDirection) { b.direction = e.layoutStartingDirection === 'vertical' ? 0 : 1 }n = c[f](b, d); k(d, function (a, d) {
        const e = n[d]; a.values = o(e, { val: a.childrenTotal, direction: g ? 1 - b.direction : b.direction }); a.pointValues = o(e, { x: e.x / c.axisRatio, width: e.width / c.axisRatio }); a.children.length && c.calculateChildrenAreas(a,
          a.values)
      })
    },
    setPointValues () {
      const a = this.xAxis; const b = this.yAxis; k(this.points, function (c) {
        let d = c.node.pointValues; let e; let f; let g; d ? (e = Math.round(a.translate(d.x, 0, 0, 0, 1)), f = Math.round(a.translate(d.x + d.width, 0, 0, 0, 1)), g = Math.round(b.translate(d.y, 0, 0, 0, 1)), d = Math.round(b.translate(d.y + d.height, 0, 0, 0, 1)), c.shapeType = 'rect', c.shapeArgs = { x: Math.min(e, f), y: Math.min(g, d), width: Math.abs(f - e), height: Math.abs(d - g) }, c.plotX = c.shapeArgs.x + c.shapeArgs.width / 2, c.plotY = c.shapeArgs.y + c.shapeArgs.height / 2) : (delete c.plotX,
        delete c.plotY)
      })
    },
    setColorRecursive (a, b) { const c = this; let d; let e; if (a) { d = c.points[a.i]; e = c.levelMap[a.levelDynamic]; b = i(d && d.options.color, e && e.color, b); if (d) { d.color = b }a.children.length && k(a.children, function (a) { c.setColorRecursive(a, b) }) } },
    alg_func_group (a, b, c, d) {
      this.height = a; this.width = b; this.plot = d; this.startDirection = this.direction = c; this.lH = this.nH = this.lW = this.nW = this.total = 0; this.elArr = []; this.lP = {
        total: 0,
        lH: 0,
        nH: 0,
        lW: 0,
        nW: 0,
        nR: 0,
        lR: 0,
        aspectRatio (a, c) {
          return Math.max(a /
c, c / a)
        }
      }; this.addElement = function (a) {
        this.lP.total = this.elArr[this.elArr.length - 1]; this.total += a; this.direction === 0 ? (this.lW = this.nW, this.lP.lH = this.lP.total / this.lW, this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH), this.nW = this.total / this.height, this.lP.nH = this.lP.total / this.nW, this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH)) : (this.lH = this.nH, this.lP.lW = this.lP.total / this.lH, this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH), this.nH = this.total / this.width, this.lP.nW = this.lP.total / this.nH, this.lP.nR =
this.lP.aspectRatio(this.lP.nW, this.nH)); this.elArr.push(a)
      }; this.reset = function () { this.lW = this.nW = 0; this.elArr = []; this.total = 0 }
    },
    alg_func_calcPoints (a, b, c, d) {
      let e; let f; let g; let n; let h = c.lW; let s = c.lH; const l = c.plot; let j; let i = 0; const p = c.elArr.length - 1; b ? (h = c.nW, s = c.nH) : j = c.elArr[c.elArr.length - 1]; k(c.elArr, function (a) { if (b || i < p) { c.direction === 0 ? (e = l.x, f = l.y, g = h, n = a / g) : (e = l.x, f = l.y, n = s, g = a / n), d.push({ x: e, y: f, width: g, height: n }), c.direction === 0 ? l.y += n : l.x += g }i += 1 }); c.reset(); c.direction === 0 ? c.width -= h : c.height -= s; l.y = l.parent.y +
(l.parent.height - c.height); l.x = l.parent.x + (l.parent.width - c.width); if (a) { c.direction = 1 - c.direction }b || c.addElement(j)
    },
    alg_func_lowAspectRatio (a, b, c) { const d = []; const e = this; let f; const g = { x: b.x, y: b.y, parent: b }; let h = 0; const j = c.length - 1; const i = new this.alg_func_group(b.height, b.width, b.direction, g); k(c, function (c) { f = b.width * b.height * (c.val / b.val); i.addElement(f); i.lP.nR > i.lP.lR && e.alg_func_calcPoints(a, !1, i, d, g); h === j && e.alg_func_calcPoints(a, !0, i, d, g); h += 1 }); return d },
    alg_func_fill (a, b, c) {
      const d = []; let e; let f = b.direction
      let g = b.x; let h = b.y; let i = b.width; let j = b.height; let l; let o; let m; let p; k(c, function (c) { e = b.width * b.height * (c.val / b.val); l = g; o = h; f === 0 ? (p = j, m = e / p, i -= m, g += m) : (m = i, p = e / m, j -= p, h += p); d.push({ x: l, y: o, width: m, height: p }); a && (f = 1 - f) }); return d
    },
    strip (a, b) { return this.alg_func_lowAspectRatio(!1, a, b) },
    squarified (a, b) { return this.alg_func_lowAspectRatio(!0, a, b) },
    sliceAndDice (a, b) { return this.alg_func_fill(!0, a, b) },
    stripes (a, b) { return this.alg_func_fill(!1, a, b) },
    translate () {
      let a, b; m.prototype.translate.call(this)
      if (this.points.length) { this.rootNode = i(this.options.rootId, ''), this.levelMap = y(this.options.levels, function (a, b) { a[b.level] = b; return a }, {}), b = this.tree = this.getTree(), this.axisRatio = this.xAxis.len / this.yAxis.len, this.nodeMap[''].pointValues = a = { x: 0, y: 0, width: 100, height: 100 }, this.nodeMap[''].values = a = o(a, { width: a.width * this.axisRatio, direction: this.options.layoutStartingDirection === 'vertical' ? 0 : 1, val: b.val }), this.calculateChildrenAreas(b, a) } this.colorAxis ? this.translateColors() : this.options.colorByPoint ||
this.setColorRecursive(this.tree, void 0); b = this.nodeMap[this.rootNode].pointValues; this.xAxis.setExtremes(b.x, b.x + b.width, !1); this.yAxis.setExtremes(b.y, b.y + b.height, !1); this.xAxis.setScale(); this.yAxis.setScale(); this.setPointValues()
    },
    drawDataLabels () {
      const a = this; const b = r(a.points, function (a) { return a.node.visible }); let c; let d; k(b, function (b) {
        d = a.levelMap[b.node.levelDynamic]; c = { style: {} }; if (!b.node.isLeaf) { c.enabled = !1 } if (d && d.dataLabels) { c = o(c, d.dataLabels), a._hasPointLabels = !0 } if (b.shapeArgs) {
          c.style.width =
b.shapeArgs.width
        }b.dlOptions = o(c, b.options.dataLabels)
      }); m.prototype.drawDataLabels.call(this)
    },
    alignDataLabel: j.column.prototype.alignDataLabel,
    pointAttribs (a, b) {
      var c = this.levelMap[a.node.levelDynamic] || {}; const d = this.options; const e = b && d.states[b] || {}; var c = { stroke: a.borderColor || c.borderColor || e.borderColor || d.borderColor, 'stroke-width': i(a.borderWidth, c.borderWidth, e.borderWidth, d.borderWidth), dashstyle: a.borderDashStyle || c.borderDashStyle || e.borderDashStyle || d.borderDashStyle, fill: a.color || this.color }
      if (b === 'hover') { c.zIndex = 1 } if (a.node.level <= this.nodeMap[this.rootNode].level) { c.fill = 'none', c['stroke-width'] = 0 } else if (a.node.isLeaf) { if (b) { c.fill = x(c.fill).brighten(e.brightness).get() } } else { c.fill = i(d.interactByLeaf, !d.allowDrillToNode) ? 'none' : x(c.fill).setOpacity(b === 'hover' ? 0.75 : 0.15).get() } return c
    },
    drawPoints () {
      const a = this; const b = r(a.points, function (a) { return a.node.visible }); k(b, function (c) {
        const b = 'levelGroup-' + c.node.levelDynamic; a[b] || (a[b] = a.chart.renderer.g(b).attr({ zIndex: 1e3 - c.node.levelDynamic }).add(a.group))
        c.group = a[b]; c.pointAttr = { '': a.pointAttribs(c), hover: a.pointAttribs(c, 'hover'), select: {} }
      }); j.column.prototype.drawPoints.call(this); a.options.allowDrillToNode && k(b, function (b) { let d; if (b.graphic) { d = b.drillId = a.options.interactByLeaf ? a.drillToByLeaf(b) : a.drillToByGroup(b), b.graphic.css({ cursor: d ? 'pointer' : 'default' }) } })
    },
    insertElementSorted (a, b, c) { let d = 0; let e = !1; a.length !== 0 && k(a, function (f) { c(b, f) && !e && (a.splice(d, 0, b), e = !0); d += 1 }); e || a.push(b) },
    drillTo () {
      const a = this; h.addEvent(a, 'click',
        function (b) { var b = b.point; const c = b.drillId; let d; c && (d = a.nodeMap[a.rootNode].name || a.rootNode, b.setState(''), a.drillToNode(c), a.showDrillUpButton(d)) })
    },
    drillToByGroup (a) { let b = !1; if (a.node.level - this.nodeMap[this.rootNode].level === 1 && !a.node.isLeaf) { b = a.id } return b },
    drillToByLeaf (a) { let b = !1; if (a.node.parent !== this.rootNode && a.node.isLeaf) { for (a = a.node; !b;) { if (a = this.nodeMap[a.parent], a.parent === this.rootNode) { b = a.id } } } return b },
    drillUp () {
      let a = null; this.rootNode && (a = this.nodeMap[this.rootNode],
      a = a.parent !== null ? this.nodeMap[a.parent] : this.nodeMap['']); if (a !== null) { this.drillToNode(a.id), a.id === '' ? this.drillUpButton = this.drillUpButton.destroy() : (a = this.nodeMap[a.parent], this.showDrillUpButton(a.name || a.id)) }
    },
    drillToNode (a) { this.options.rootId = a; this.isDirty = !0; this.chart.redraw() },
    showDrillUpButton (a) {
      const b = this; var a = a || '< Back'; const c = b.options.drillUpButton; let d; let e; if (c.text) { a = c.text } this.drillUpButton ? this.drillUpButton.attr({ text: a }).align() : (e = (d = c.theme) && d.states, this.drillUpButton =
this.chart.renderer.button(a, null, null, function () { b.drillUp() }, d, e && e.hover, e && e.select).attr({ align: c.position.align, zIndex: 9 }).add().align(c.position, !1, c.relativeTo || 'plotBox'))
    },
    buildKDTree: w,
    drawLegendSymbol: h.LegendSymbolMixin.drawRectangle,
    getExtremes () { m.prototype.getExtremes.call(this, this.colorValueData); this.valueMin = this.dataMin; this.valueMax = this.dataMax; m.prototype.getExtremes.call(this) },
    getExtremesFromAll: !0,
    bindAxes () {
      const a = {
        endOnTick: !1,
        gridLineWidth: 0,
        lineWidth: 0,
        min: 0,
        dataMin: 0,
        minPadding: 0,
        max: 100,
        dataMax: 100,
        maxPadding: 0,
        startOnTick: !1,
        title: null,
        tickPositions: []
      }; m.prototype.bindAxes.call(this); h.extend(this.yAxis.options, a); h.extend(this.xAxis.options, a)
    }
  }))
})(Highcharts)
