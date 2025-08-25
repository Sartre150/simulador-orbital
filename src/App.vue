<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SimulationCanvas from './components/SimulationCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'
import InfoPanel from './components/InfoPanel.vue'
import MobileNav from './components/MovilNav.vue' // Mantenemos la importación

const cometParams = ref({ excentricidad: 0.8, afelio: 2.82 })
const simulationData = ref({})
const isPaused = ref(false)
const simulationSpeed = ref(1.0)
const visualToggles = ref({
  showFoci: false,
  showAxis: false,
  showEarthOrbit: true,
  showCometOrbit: true,
})

// --- LÓGICA FINAL PARA LA INTERFAZ MÓVIL ---
const isMobile = ref(window.innerWidth <= 768)
const panelsVisible = ref(true) // Por defecto, los paneles son visibles

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Esta función simplemente invierte el estado de visibilidad
const togglePanels = () => {
  panelsVisible.value = !panelsVisible.value
}
// --- FIN DE LA LÓGICA MÓVIL ---

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

    <!-- RENDERIZADO CONDICIONAL FINAL -->
    <!-- En escritorio, los paneles siempre se muestran. -->
    <!-- En móvil, los paneles solo se muestran si 'panelsVisible' es true. -->
    <template v-if="!isMobile || panelsVisible">
      <ControlPanel
        @updateCometParams="handleParamsUpdate"
        @resetSimulation="handleReset"
        @togglePause="togglePause"
        @updateSpeed="updateSpeed"
        @updateVisuals="updateVisuals"
      />
      <InfoPanel :simData="simulationData" />
    </template>

    <!-- La barra de navegación solo se renderiza en móvil -->
    <MobileNav v-if="isMobile" @togglePanels="togglePanels" :panelsVisible="panelsVisible" />
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #000000;
  overflow: hidden;
}
</style>
