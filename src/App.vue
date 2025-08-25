<script setup>
import { ref } from 'vue'
import SimulationCanvas from './components/SimulationCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'
import InfoPanel from './components/InfoPanel.vue'

const cometParams = ref({ excentricidad: 0.8, afelio: 2.82 })
const simulationData = ref({})
const isPaused = ref(false)
const simulationSpeed = ref(1.0)

// Añadimos el nuevo estado al objeto de toggles
const visualToggles = ref({
  showFoci: false,
  showAxis: false,
  showEarthOrbit: true,
  showCometOrbit: true,
})

const handleParamsUpdate = (newParams) => {
  cometParams.value = newParams
}
const handleReset = () => {
  cometParams.value = { excentricidad: 0.8, afelio: 2.82 }
}
const handleDataUpdate = (data) => {
  simulationData.value = data
}
const togglePause = () => {
  isPaused.value = !isPaused.value
}
const updateSpeed = (speed) => {
  simulationSpeed.value = speed
}
const updateVisuals = (toggles) => {
  visualToggles.value = toggles
}
</script>

<template>
  <div>
    <SimulationCanvas
      :cometParams="cometParams"
      :isPaused="isPaused"
      :simulationSpeed="simulationSpeed"
      :visualToggles="visualToggles"
      @dataUpdate="handleDataUpdate"
    />
    <ControlPanel
      @updateCometParams="handleParamsUpdate"
      @resetSimulation="handleReset"
      @togglePause="togglePause"
      @updateSpeed="updateSpeed"
      @updateVisuals="updateVisuals"
    />
    <InfoPanel :simData="simulationData" />
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #000000;
  overflow: hidden;
}
</style>
