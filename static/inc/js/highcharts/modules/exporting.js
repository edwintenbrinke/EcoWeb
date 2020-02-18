/*
 Highstock JS v2.1.9 (2015-10-07)
 Exporting module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (g) {
  const z = g.Chart; const s = g.addEvent; const A = g.removeEvent; const B = HighchartsAdapter.fireEvent; const j = g.createElement; const p = g.discardElement; const u = g.css; const l = g.merge; const m = g.each; const q = g.extend; const E = g.splat; const F = Math.max; const k = document; const C = window; const G = g.isTouchDevice; const H = g.Renderer.prototype.symbols; const r = g.getOptions(); let x; q(r.lang, { printChart: 'Print chart', downloadPNG: 'Download PNG image', downloadJPEG: 'Download JPEG image', downloadPDF: 'Download PDF document', downloadSVG: 'Download SVG vector image', contextButtonTitle: 'Chart context menu' }); r.navigation =
{ menuStyle: { border: '1px solid #A0A0A0', background: '#FFFFFF', padding: '5px 0' }, menuItemStyle: { padding: '0 10px', background: 'none', color: '#303030', fontSize: G ? '14px' : '11px' }, menuItemHoverStyle: { background: '#4572A5', color: '#FFFFFF' }, buttonOptions: { symbolFill: '#E0E0E0', symbolSize: 14, symbolStroke: '#666', symbolStrokeWidth: 3, symbolX: 12.5, symbolY: 10.5, align: 'right', buttonSpacing: 3, height: 22, theme: { fill: 'white', stroke: 'none' }, verticalAlign: 'top', width: 24 } }; r.exporting = {
    type: 'image/png',
    url: 'http://export.highcharts.com/',
    buttons: { contextButton: { menuClassName: 'highcharts-contextmenu', symbol: 'menu', _titleKey: 'contextButtonTitle', menuItems: [{ textKey: 'printChart', onclick () { this.print() } }, { separator: !0 }, { textKey: 'downloadPNG', onclick () { this.exportChart() } }, { textKey: 'downloadJPEG', onclick () { this.exportChart({ type: 'image/jpeg' }) } }, { textKey: 'downloadPDF', onclick () { this.exportChart({ type: 'application/pdf' }) } }, { textKey: 'downloadSVG', onclick () { this.exportChart({ type: 'image/svg+xml' }) } }] } }
  }
  g.post = function (b, a, e) { let c; var b = j('form', l({ method: 'post', action: b, enctype: 'multipart/form-data' }, e), { display: 'none' }, k.body); for (c in a) { j('input', { type: 'hidden', name: c, value: a[c] }, null, b) }b.submit(); p(b) }; q(z.prototype, {
    sanitizeSVG (b) {
      return b.replace(/zIndex="[^"]+"/g, '').replace(/isShadow="[^"]+"/g, '').replace(/symbolName="[^"]+"/g, '').replace(/jQuery[0-9]+="[^"]+"/g, '').replace(/url\([^#]+#/g, 'url(#').replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g,
        ' xlink:href=').replace(/\n/, ' ').replace(/<\/svg>.*?$/, '</svg>').replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g, '\u00A0').replace(/&shy;/g, '\u00AD').replace(/<IMG /g, '<image ').replace(/<(\/?)TITLE>/g, '<$1title>').replace(/height=([^" ]+)/g, 'height="$1"').replace(/width=([^" ]+)/g, 'width="$1"').replace(/hc-svg-href="([^"]+)">/g, 'xlink:href="$1"/>').replace(/ id=([^" >]+)/g, ' id="$1"').replace(/class=([^" >]+)/g, 'class="$1"').replace(/ transform /g,
        ' ').replace(/:(path|rect)/g, '$1').replace(/style="([^"]+)"/g, function (a) { return a.toLowerCase() })
    },
    getChartHTML () { return this.container.innerHTML },
    getSVG (b) {
      const a = this; let e; let c; let f; let y; let h; let d = l(a.options, b); const I = d.exporting.allowHTML; if (!k.createElementNS) { k.createElementNS = function (a, b) { return k.createElement(b) } }c = j('div', null, { position: 'absolute', top: '-9999em', width: a.chartWidth + 'px', height: a.chartHeight + 'px' }, k.body); f = a.renderTo.style.width; h = a.renderTo.style.height; f = d.exporting.sourceWidth ||
d.chart.width || /px$/.test(f) && parseInt(f, 10) || 600; h = d.exporting.sourceHeight || d.chart.height || /px$/.test(h) && parseInt(h, 10) || 400; q(d.chart, { animation: !1, renderTo: c, forExport: !0, renderer: 'SVGRenderer', width: f, height: h }); d.exporting.enabled = !1; delete d.data; d.series = []; m(a.series, function (a) { y = l(a.options, { animation: !1, enableMouseTracking: !1, showCheckbox: !1, visible: a.visible }); y.isInternal || d.series.push(y) }); b && m(['xAxis', 'yAxis'], function (a) { m(E(b[a]), function (b, c) { d[a][c] = l(d[a][c], b) }) }); e = new g.Chart(d,
        a.callback); m(['xAxis', 'yAxis'], function (b) { m(a[b], function (a, c) { const d = e[b][c]; var f = a.getExtremes(); const h = f.userMin; var f = f.userMax; d && (h !== void 0 || f !== void 0) && d.setExtremes(h, f, !0, !1) }) }); f = e.getChartHTML(); d = null; e.destroy(); p(c); if (I && (c = f.match(/<\/svg>(.*?$)/))) { c = '<foreignObject x="0" y="0" width="200" height="200"><body xmlns="http://www.w3.org/1999/xhtml">' + c[1] + '</body></foreignObject>', f = f.replace('</svg>', c + '</svg>') }f = this.sanitizeSVG(f); return f = f.replace(/(url\(#highcharts-[0-9]+)&quot;/g, '$1').replace(/&quot;/g,
        "'")
    },
    getSVGForExport (b, a) { const e = this.options.exporting; return this.getSVG(l({ chart: { borderRadius: 0 } }, e.chartOptions, a, { exporting: { sourceWidth: b && b.sourceWidth || e.sourceWidth, sourceHeight: b && b.sourceHeight || e.sourceHeight } })) },
    exportChart (b, a) { const e = this.getSVGForExport(b, a); var b = l(this.options.exporting, b); g.post(b.url, { filename: b.filename || 'chart', type: b.type, width: b.width || 0, scale: b.scale || 2, svg: e }, b.formAttributes) },
    print () {
      const b = this; const a = b.container; const e = []; const c = a.parentNode
      const f = k.body; const g = f.childNodes; if (!b.isPrinting) { b.isPrinting = !0, B(b, 'beforePrint'), m(g, function (a, b) { if (a.nodeType === 1) { e[b] = a.style.display, a.style.display = 'none' } }), f.appendChild(a), C.focus(), C.print(), setTimeout(function () { c.appendChild(a); m(g, function (a, b) { if (a.nodeType === 1) { a.style.display = e[b] } }); b.isPrinting = !1; B(b, 'afterPrint') }, 1e3) }
    },
    contextMenu (b, a, e, c, f, g, h) {
      const d = this; const l = d.options.navigation; const D = l.menuItemStyle; const n = d.chartWidth; const o = d.chartHeight; const k = 'cache-' + b; let i = d[k]; const t = F(f, g); let v; let w; let p; const r = function (a) {
        d.pointer.inClass(a.target,
          b) || w()
      }; if (!i) {
        d[k] = i = j('div', { className: b }, { position: 'absolute', zIndex: 1e3, padding: t + 'px' }, d.container), v = j('div', null, q({ MozBoxShadow: '3px 3px 10px #888', WebkitBoxShadow: '3px 3px 10px #888', boxShadow: '3px 3px 10px #888' }, l.menuStyle), i), w = function () { u(i, { display: 'none' }); h && h.setState(0); d.openMenu = !1 }, s(i, 'mouseleave', function () { p = setTimeout(w, 500) }), s(i, 'mouseenter', function () { clearTimeout(p) }), s(document, 'mouseup', r), s(d, 'destroy', function () { A(document, 'mouseup', r) }), m(a, function (a) {
          if (a) {
            const b =
a.separator ? j('hr', null, null, v) : j('div', { onmouseover () { u(this, l.menuItemHoverStyle) }, onmouseout () { u(this, D) }, onclick (b) { b.stopPropagation(); w(); a.onclick && a.onclick.apply(d, arguments) }, innerHTML: a.text || d.options.lang[a.textKey] }, q({ cursor: 'pointer' }, D), v); d.exportDivElements.push(b)
          }
        }), d.exportDivElements.push(v, i), d.exportMenuWidth = i.offsetWidth, d.exportMenuHeight = i.offsetHeight
      }a = { display: 'block' }; e + d.exportMenuWidth > n ? a.right = n - e - f - t + 'px' : a.left = e - t + 'px'; c + g + d.exportMenuHeight >
o && h.alignOptions.verticalAlign !== 'top' ? a.bottom = o - c - t + 'px' : a.top = c + g - t + 'px'; u(i, a); d.openMenu = !0
    },
    addButton (b) {
      const a = this; const e = a.renderer; const c = l(a.options.navigation.buttonOptions, b); const f = c.onclick; const k = c.menuItems; let h; let d; const m = { stroke: c.symbolStroke, fill: c.symbolFill }; const j = c.symbolSize || 12; if (!a.btnCount) { a.btnCount = 0 } if (!a.exportDivElements) { a.exportDivElements = [], a.exportSVGElements = [] } if (c.enabled !== !1) {
        const n = c.theme; var o = n.states; const p = o && o.hover; var o = o && o.select; let i; delete n.states; f ? i = function (b) {
          b.stopPropagation()
          f.call(a, b)
        } : k && (i = function () { a.contextMenu(d.menuClassName, k, d.translateX, d.translateY, d.width, d.height, d); d.setState(2) }); c.text && c.symbol ? n.paddingLeft = g.pick(n.paddingLeft, 25) : c.text || q(n, { width: c.width, height: c.height, padding: 0 }); d = e.button(c.text, 0, 0, i, n, p, o).attr({ title: a.options.lang[c._titleKey], 'stroke-linecap': 'round' }); d.menuClassName = b.menuClassName || 'highcharts-menu-' + a.btnCount++; c.symbol && (h = e.symbol(c.symbol, c.symbolX - j / 2, c.symbolY - j / 2, j, j).attr(q(m, {
          'stroke-width': c.symbolStrokeWidth ||
1,
          zIndex: 1
        })).add(d)); d.add().align(q(c, { width: d.width, x: g.pick(c.x, x) }), !0, 'spacingBox'); x += (d.width + c.buttonSpacing) * (c.align === 'right' ? -1 : 1); a.exportSVGElements.push(d, h)
      }
    },
    destroyExport (b) {
      var b = b.target; let a; let e; for (a = 0; a < b.exportSVGElements.length; a++) { if (e = b.exportSVGElements[a]) { e.onclick = e.ontouchstart = null, b.exportSVGElements[a] = e.destroy() } } for (a = 0; a < b.exportDivElements.length; a++) {
        e = b.exportDivElements[a], A(e, 'mouseleave'), b.exportDivElements[a] = e.onmouseout = e.onmouseover = e.ontouchstart =
e.onclick = null, p(e)
      }
    }
  }); H.menu = function (b, a, e, c) { return ['M', b, a + 2.5, 'L', b + e, a + 2.5, 'M', b, a + c / 2 + 0.5, 'L', b + e, a + c / 2 + 0.5, 'M', b, a + c - 1.5, 'L', b + e, a + c - 1.5] }; z.prototype.callbacks.push(function (b) { let a; const e = b.options.exporting; const c = e.buttons; x = 0; if (e.enabled !== !1) { for (a in c) { b.addButton(c[a]) }s(b, 'destroy', b.destroyExport) } })
})(Highcharts)
