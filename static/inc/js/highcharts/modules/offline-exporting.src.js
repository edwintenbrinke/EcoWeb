/**
 * @license Highstock JS v2.1.9 (2015-10-07)
 * Client side exporting module
 *
 * (c) 2015 Torstein Honsi / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/* global Highcharts, HighchartsAdapter, document, window, Blob, MSBlobBuilder */

(function (Highcharts) {
// Dummy object so we can reuse our canvas-tools.js without errors
  Highcharts.CanVGRenderer = {}

  /**
 * Add a new method to the Chart object to perform a local download
 */
  Highcharts.Chart.prototype.exportChartLocal = function (exportingOptions, chartOptions) {
    const chart = this
    const options = Highcharts.merge(chart.options.exporting, exportingOptions)
    const webKit = navigator.userAgent.includes('WebKit') && !navigator.userAgent.includes('Chrome') // Webkit and not chrome
    const scale = options.scale || 2
    let chartCopyContainer
    const domurl = window.URL || window.webkitURL || window
    let images
    let imagesEmbedded = 0
    let el
    let i
    let l
    const fallbackToExportServer = function () {
      if (options.fallbackToExportServer === false) {
        throw 'Fallback to export server disabled'
      }
      chart.exportChart(options)
    }
    // Get data:URL from image URL
    // Pass in callbacks to handle results. finallyCallback is always called at the end of the process. Supplying this callback is optional.
    // All callbacks receive two arguments: imageURL, and callbackArgs. callbackArgs is used only by callbacks and can contain whatever.
    const imageToDataUrl = function (imageURL, callbackArgs, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
      const img = new Image()
      if (!webKit) {
        img.crossOrigin = 'Anonymous' // For some reason Safari chokes on this attribute
      }
      img.onload = function () {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext && canvas.getContext('2d')
        let dataURL

        if (!ctx) {
          noCanvasSupportCallback(imageURL, callbackArgs)
        } else {
          canvas.height = img.height * scale
          canvas.width = img.width * scale
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Now we try to get the contents of the canvas.
          try {
            dataURL = canvas.toDataURL()
            successCallback(dataURL, callbackArgs)
          } catch (e) {
            // Failed - either tainted canvas or something else went horribly wrong
            if (e.name === 'SecurityError' || e.name === 'SECURITY_ERR' || e.message === 'SecurityError') {
              taintedCallback(imageURL, callbackArgs)
            } else {
              throw e
            }
          }
        }
        if (finallyCallback) {
          finallyCallback(imageURL, callbackArgs)
        }
      }
      img.onerror = function () {
        failedLoadCallback(imageURL, callbackArgs)
        if (finallyCallback) {
          finallyCallback(imageURL, callbackArgs)
        }
      }
      img.src = imageURL
    }
    // Get blob URL from SVG code. Falls back to normal data URI.
    const svgToDataUrl = function (svg) {
      try {
        // Safari requires data URI since it doesn't allow navigation to blob URLs
        // Firefox has an issue with Blobs and internal references, leading to gradients not working using Blobs (#4550)
        if (!webKit && !navigator.userAgent.toLowerCase().includes('firefox')) {
          return domurl.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset-utf-16' }))
        }
      } catch (e) {
        // Ignore
      }
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
    }
    // Download contents by dataURL/blob
    const download = function (dataURL, extension) {
      const a = document.createElement('a')
      const filename = (options.filename || 'chart') + '.' + extension
      let windowRef

      // IE specific blob implementation
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(dataURL, filename)
        return
      }

      // Try HTML5 download attr if supported
      if (typeof a.download !== 'undefined') {
        a.href = dataURL
        a.download = filename // HTML5 download attribute
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        // No download attr, just opening data URI
        try {
          windowRef = window.open(dataURL, 'chart')
          if (typeof windowRef === 'undefined' || windowRef === null) {
            throw 1
          }
        } catch (e) {
          // window.open failed, trying location.href
          window.location.href = dataURL
        }
      }
    }
    // Get data URL to an image of the chart and call download on it
    const initiateDownload = function () {
      let svgurl
      let blob
      const svg = chart.sanitizeSVG(chartCopyContainer.innerHTML) // SVG of chart copy

      // Initiate download depending on file type
      if (options && options.type === 'image/svg+xml') {
        // SVG download. In this case, we want to use Microsoft specific Blob if available
        try {
          if (navigator.msSaveOrOpenBlob) {
            blob = new MSBlobBuilder()
            blob.append(svg)
            svgurl = blob.getBlob('image/svg+xml')
          } else {
            svgurl = svgToDataUrl(svg)
          }
          download(svgurl, 'svg')
        } catch (e) {
          fallbackToExportServer()
        }
      } else {
        // PNG download - create bitmap from SVG

        // First, try to get PNG by rendering on canvas
        svgurl = svgToDataUrl(svg)
        imageToDataUrl(svgurl, { /* args */ }, function (imageURL) {
          // Success
          try {
            download(imageURL, 'png')
          } catch (e) {
            fallbackToExportServer()
          }
        }, function () {
          // Failed due to tainted canvas
          // Create new and untainted canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const imageWidth = svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale
          const imageHeight = svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale
          const downloadWithCanVG = function () {
            ctx.drawSvg(svg, 0, 0, imageWidth, imageHeight)
            try {
              download(navigator.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL('image/png'), 'png')
            } catch (e) {
              fallbackToExportServer()
            }
          }

          canvas.width = imageWidth
          canvas.height = imageHeight
          if (window.canvg) {
            // Use preloaded canvg
            downloadWithCanVG()
          } else {
            // Must load canVG first
            chart.showLoading()
            HighchartsAdapter.getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
              chart.hideLoading()
              downloadWithCanVG()
            })
          }
        },
        // No canvas support
        fallbackToExportServer,
        // Failed to load image
        fallbackToExportServer,
        // Finally
        function () {
          try {
            domurl.revokeObjectURL(svgurl)
          } catch (e) {
            // Ignore
          }
        })
      }
    }

    // Hook into getSVG to get a copy of the chart copy's container
    Highcharts.wrap(Highcharts.Chart.prototype, 'getChartHTML', function (proceed) {
      chartCopyContainer = this.container.cloneNode(true)
      return proceed.apply(this, Array.prototype.slice.call(arguments, 1))
    })

    // Trigger hook to get chart copy
    chart.getSVGForExport(options, chartOptions)
    images = chartCopyContainer.getElementsByTagName('image')

    try {
      // If there are no images to embed, just go ahead and start the download process
      if (!images.length) {
        initiateDownload()
      }

      // Success handler, we converted image to base64!
      function embeddedSuccess (imageURL, callbackArgs) {
        ++imagesEmbedded

        // Change image href in chart copy
        callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL)

        // Start download when done with the last image
        if (imagesEmbedded === images.length) {
          initiateDownload()
        }
      }

      // Go through the images we want to embed
      for (i = 0, l = images.length; i < l; ++i) {
        el = images[i]
        imageToDataUrl(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), { imageElement: el },
          embeddedSuccess,
          // Tainted canvas
          fallbackToExportServer,
          // No canvas support
          fallbackToExportServer,
          // Failed to load source
          fallbackToExportServer
        )
      }
    } catch (e) {
      fallbackToExportServer()
    }
  }

  // Extend the default options to use the local exporter logic
  Highcharts.getOptions().exporting.buttons.contextButton.menuItems = [{
    textKey: 'printChart',
    onclick () {
      this.print()
    }
  }, {
    separator: true
  }, {
    textKey: 'downloadPNG',
    onclick () {
      this.exportChartLocal()
    }
  }, {
    textKey: 'downloadSVG',
    onclick () {
      this.exportChartLocal({
        type: 'image/svg+xml'
      })
    }
  }]
}(Highcharts))
