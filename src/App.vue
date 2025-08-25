<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SimulationCanvas from './components/SimulationCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'
import InfoPanel from './components/InfoPanel.vue'
import MobileNav from './components/MovilNav.vue'

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

// --- LÓGICA FINAL Y PERFECTA PARA LA INTERFAZ MÓVIL ---
const isMobile = ref(window.innerWidth <= 768)
// El panel activo ahora puede ser 'controls', 'data', o 'none' (oculto)
const activePanel = ref('none') // <<< Empezamos con los paneles ocultos por defecto en móvil

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Esta función ahora es un 'toggle' inteligente
const setActivePanel = (panelName) => {
  // Si volvemos a pulsar el botón del panel que ya está activo, lo ocultamos.
  if (activePanel.value === panelName) {
    activePanel.value = 'none'
  } else {
    // Si no, mostramos el panel que se ha pedido.
    activePanel.value = panelName
  }
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

    <!-- En escritorio, se muestran ambos. -->
    <!-- En móvil, solo se muestra el panel que esté activo. -->
    <ControlPanel
      v-if="!isMobile || activePanel === 'controls'"
      @updateCometParams="handleParamsUpdate"
      @resetSimulation="handleReset"
      @togglePause="togglePause"
      @updateSpeed="updateSpeed"
      @updateVisuals="updateVisuals"
    />

    <InfoPanel v-if="!isMobile || activePanel === 'data'" :simData="simulationData" />

    <!-- La barra de navegación se renderiza en móvil y le pasamos el panel activo -->
    <MobileNav v-if="isMobile" @setActivePanel="setActivePanel" :activePanel="activePanel" />
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #000000;
  overflow: hidden;
}
</style>
