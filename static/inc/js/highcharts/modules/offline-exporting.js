/*
 Highstock JS v2.1.9 (2015-10-07)
 Client side exporting module

 (c) 2015 Torstein Honsi / Oystein Moseng

 License: www.highcharts.com/license
*/
(function (d) {
  d.CanVGRenderer = {}; d.Chart.prototype.exportChartLocal = function (x, y) {
    const i = this; const e = d.merge(i.options.exporting, x); const q = navigator.userAgent.includes('WebKit') && !navigator.userAgent.includes('Chrome'); const l = e.scale || 2; let n; const r = window.URL || window.webkitURL || window; let f; let s = 0; let o; let m; let t; const g = function () { if (e.fallbackToExportServer === !1) { throw 'Fallback to export server disabled' } i.exportChart(e) }; const u = function (a, b, c, g, k, d, e) {
      const j = new Image(); if (!q) { j.crossOrigin = 'Anonymous' }j.onload = function () {
        const h = document.createElement('canvas')
        const d = h.getContext && h.getContext('2d'); let i; if (d) { h.height = j.height * l; h.width = j.width * l; d.drawImage(j, 0, 0, h.width, h.height); try { i = h.toDataURL(), c(i, b) } catch (f) { if (f.name === 'SecurityError' || f.name === 'SECURITY_ERR' || f.message === 'SecurityError') { g(a, b) } else { throw f } } } else { k(a, b) }e && e(a, b)
      }; j.onerror = function () { d(a, b); e && e(a, b) }; j.src = a
    }; const v = function (a) {
      try { if (!q && !navigator.userAgent.toLowerCase().includes('firefox')) { return r.createObjectURL(new Blob([a], { type: 'image/svg+xml;charset-utf-16' })) } } catch (b) {} return 'data:image/svg+xml;charset=UTF-8,' +
encodeURIComponent(a)
    }; const p = function (a, b) { const c = document.createElement('a'); const d = (e.filename || 'chart') + '.' + b; let k; if (navigator.msSaveOrOpenBlob) { navigator.msSaveOrOpenBlob(a, d) } else if (typeof c.download !== 'undefined') { c.href = a, c.download = d, c.target = '_blank', document.body.appendChild(c), c.click(), document.body.removeChild(c) } else { try { if (k = window.open(a, 'chart'), typeof k === 'undefined' || k === null) { throw 1 } } catch (g) { window.location.href = a } } }; const w = function () {
      let a; let b; const c = i.sanitizeSVG(n.innerHTML); if (e && e.type === 'image/svg+xml') {
        try {
          navigator.msSaveOrOpenBlob
            ? (b = new MSBlobBuilder(), b.append(c), a = b.getBlob('image/svg+xml')) : a = v(c), p(a, 'svg')
        } catch (f) { g() }
      } else {
        a = v(c), u(a, {}, function (a) { try { p(a, 'png') } catch (c) { g() } }, function () {
          const a = document.createElement('canvas'); const b = a.getContext('2d'); const e = c.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * l; const f = c.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * l; const h = function () { b.drawSvg(c, 0, 0, e, f); try { p(navigator.msSaveOrOpenBlob ? a.msToBlob() : a.toDataURL('image/png'), 'png') } catch (d) { g() } }; a.width = e; a.height = f; window.canvg
            ? h() : (i.showLoading(), HighchartsAdapter.getScript(d.getOptions().global.canvasToolsURL, function () { i.hideLoading(); h() }))
        }, g, g, function () { try { r.revokeObjectURL(a) } catch (b) {} })
      }
    }; d.wrap(d.Chart.prototype, 'getChartHTML', function (a) { n = this.container.cloneNode(!0); return a.apply(this, Array.prototype.slice.call(arguments, 1)) }); i.getSVGForExport(e, y); f = n.getElementsByTagName('image'); try {
      f.length || w(); const z = function (a, b) {
        ++s; b.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', a); s === f.length &&
w()
      }; for (m = 0, t = f.length; m < t; ++m) { o = f[m], u(o.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), { imageElement: o }, z, g, g, g) }
    } catch (A) { g() }
  }; d.getOptions().exporting.buttons.contextButton.menuItems = [{ textKey: 'printChart', onclick () { this.print() } }, { separator: !0 }, { textKey: 'downloadPNG', onclick () { this.exportChartLocal() } }, { textKey: 'downloadSVG', onclick () { this.exportChartLocal({ type: 'image/svg+xml' }) } }]
})(Highcharts)
