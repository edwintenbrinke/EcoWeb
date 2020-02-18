<template>
    <div class="map-wrapper-1">
        <!-- Start map control panel -->
        <div class="map-control-panel">

            <!-- Map Layer -->
            <div class="map-layer-select-wrapper">
                <i class="fa fa-fw fa-caret-down"></i>
                <!-- TODO  -->
                    <select class="map-layer-select" style="width: 100%">
                        <option value="" class="localize" translate-key="59">Select Map Layer</option>
                    </select>
                    <a href="#" class="compare-maps-button">
                            <span class="localize" translate-key="161">Compare Maps</span>
                    </a>

            </div>

            <!-- Map & Info -->
            <div id="main-map" class="view-map">
                <p id="map-position-text"></p>
                <p id="map-info-text">.</p>
                <div type="text" class="progress-day" name="progress-day"><span class="localize" translate-key="64">Day</span> 0, 00:00</div>
                <!-- switch form 2d to 3d & back  -->
                <input type="button" data-type="2" value="2D" id="map-toggle-2d">
            </div>

            <map-controls />
        </div>
    </div>
</template>

<script>
import MapControls from '@/components/WorldMap/MapControls'
export default {
    components: {MapControls}
}
</script>

<style scoped>

</style>