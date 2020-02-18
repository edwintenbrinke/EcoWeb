<template>
  <div class="map-wrapper-1">
    <!-- Start map control panel -->
    <div class="map-control-panel">
      <!-- Map Layer -->
      <map-layer />

      <!-- Map & Info -->
      <div id="main-map" class="view-map">
        <p id="map-position-text" />
        <p id="map-info-text">
          .
        </p>
        <div type="text" class="progress-day" name="progress-day">
          <span class="localize" translate-key="64">Day</span> 0, 00:00
        </div>
        <input id="map-toggle-2d" type="button" data-type="2" value="2D">
      </div>

      <!-- Map Controls -->
      <map-controls />
    </div>

    <script>
      let currentPage = 'dashboard'
      const url = window.location.href
      const arr = url.split('/')
      const result = arr[0] + '//' + arr[2]
      const APPIQUERYURL = result
      console.log('index  ' + APPIQUERYURL)
    </script>

    <!-- Jquery -->
    <script src="inc/js/jquery/jquery-latest.min.js" type="text/javascript" />

    <script src="inc/js/menu.js" />
    <script src="inc/js/globalVariables.js" />
    <script src="inc/js/convertSeconds.js" />

    <!-- Map js -->
    <script src="inc/js/Map.js" />
    <script src="inc/js/three.min.js" />
    <script src="inc/js/postprocessing/EffectComposer.js" />
    <script src="inc/js/postprocessing/RenderPass.js" />
    <script src="inc/js/postprocessing/ShaderPass.js" />
    <script src="inc/js/shaders/CopyShader.js" />
    <script src="inc/js/OrbitControls.js" />
    <script src="inc/js/Detector.js" />
    <script src="inc/js/dat.gui.min.js" />
    <script src="inc/js/ecomap.js" />
    <script src="inc/js/mapcontrols.js" />
    <script src="inc/js/localize.js" />
    <!-- end Map js -->

    <script src="inc/bootstrap/js/bootstrap-toggle.min.js" />
  </div>
</template>

<script>
// Get URL Parameters - Relative protocol, domain, port
import MapControls from '@/components/WorldMap/MapControls'
import MapLayer from '@/components/WorldMap/MapLayer'

export default {
  components: { MapControls, MapLayer }
}
</script>

<style scoped>

</style>
