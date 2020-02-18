/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function (renderer, renderTarget) {
  this.renderer = renderer

  if (renderTarget === undefined) {
    const parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    }

    const size = renderer.getDrawingBufferSize()
    renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, parameters)
    renderTarget.texture.name = 'EffectComposer.rt1'
  }

  this.renderTarget1 = renderTarget
  this.renderTarget2 = renderTarget.clone()
  this.renderTarget2.texture.name = 'EffectComposer.rt2'

  this.writeBuffer = this.renderTarget1
  this.readBuffer = this.renderTarget2

  this.passes = []

  // dependencies

  if (THREE.CopyShader === undefined) {
    console.error('THREE.EffectComposer relies on THREE.CopyShader')
  }

  if (THREE.ShaderPass === undefined) {
    console.error('THREE.EffectComposer relies on THREE.ShaderPass')
  }

  this.copyPass = new THREE.ShaderPass(THREE.CopyShader)
}

Object.assign(THREE.EffectComposer.prototype, {

  swapBuffers () {
    const tmp = this.readBuffer
    this.readBuffer = this.writeBuffer
    this.writeBuffer = tmp
  },

  addPass (pass) {
    this.passes.push(pass)

    const size = this.renderer.getDrawingBufferSize()
    pass.setSize(size.width, size.height)
  },

  insertPass (pass, index) {
    this.passes.splice(index, 0, pass)
  },

  render (delta) {
    let maskActive = false

    let pass; let i; const il = this.passes.length

    for (i = 0; i < il; i++) {
      pass = this.passes[i]

      if (pass.enabled === false) { continue }

      pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive)

      if (pass.needsSwap) {
        if (maskActive) {
          const context = this.renderer.context

          context.stencilFunc(context.NOTEQUAL, 1, 0xFFFFFFFF)

          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta)

          context.stencilFunc(context.EQUAL, 1, 0xFFFFFFFF)
        }

        this.swapBuffers()
      }

      if (THREE.MaskPass !== undefined) {
        if (pass instanceof THREE.MaskPass) {
          maskActive = true
        } else if (pass instanceof THREE.ClearMaskPass) {
          maskActive = false
        }
      }
    }
  },

  reset (renderTarget) {
    if (renderTarget === undefined) {
      const size = this.renderer.getDrawingBufferSize()

      renderTarget = this.renderTarget1.clone()
      renderTarget.setSize(size.width, size.height)
    }

    this.renderTarget1.dispose()
    this.renderTarget2.dispose()
    this.renderTarget1 = renderTarget
    this.renderTarget2 = renderTarget.clone()

    this.writeBuffer = this.renderTarget1
    this.readBuffer = this.renderTarget2
  },

  setSize (width, height) {
    this.renderTarget1.setSize(width, height)
    this.renderTarget2.setSize(width, height)

    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].setSize(width, height)
    }
  }

})

THREE.Pass = function () {
  // if set to true, the pass is processed by the composer
  this.enabled = true

  // if set to true, the pass indicates to swap read and write buffer after rendering
  this.needsSwap = true

  // if set to true, the pass clears its buffer before rendering
  this.clear = false

  // if set to true, the result of the pass is rendered to screen
  this.renderToScreen = false
}

Object.assign(THREE.Pass.prototype, {

  setSize (width, height) {},

  render (renderer, writeBuffer, readBuffer, delta, maskActive) {
    console.error('THREE.Pass: .render() must be implemented in derived pass.')
  }

})
