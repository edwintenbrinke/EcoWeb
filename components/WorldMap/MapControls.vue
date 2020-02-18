<template>
    <div class="map-controls-wrapper">

                <!-- Play Button -->
                <div class="play-button-wrapper">
                    <div id="map-toggle-play"><i class="fa fa-play" aria-hidden="true"></i></div>
                </div>

                <!-- Range Controls -->
                <div class="range-controls-wrapper">
                    <div class="map-progress-bar-wrapper">
                        <progress id="map-progress-bar" value="0.75" max="1.0" ></progress>
                    </div>

                    <div class="range-controls-wrapper-2">
                        <div id="range-controls-time-wrapper">
                            <div id="range-controls-time-1">
                                <!-- <span class="localize" translate-key="64">Day</span> 0<br>00:00 -->
                                <span class="localize range-control-time-span-day" translate-key="64">Day</span>
                                <span class="range-controls-time-span-1"> 0<br>00:00 </span>
                            </div>
                        </div>
                        <div class="multi-range-content">
                            <div id="slider-range"></div>
                        </div>
                        <div id="range-controls-time-wrapper">
                            <div id="range-controls-time-2">
                                <!-- <span class="localize" translate-key="64">Day</span> 0<br>00:00 -->
                                <span class="localize range-control-time-span-day" translate-key="64">Day</span>
                                <span class="range-controls-time-span-2"> 0<br>00:00 </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Speed Controls -->
                <div class="speed-controls-wrapper">
                    <div id="speed-button"><span class="speed-button">0.5</span><br><span class="localize" translate-key="70">days/sec</span></div>
                    <input type="range" name="speed" id="map-play-speed" class="renge" min="-10" max="10" value="5" step="0.01">
                </div>
            </div>
        </div><!-- End map control panel -->
</template>