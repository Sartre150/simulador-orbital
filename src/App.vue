<script setup>
// 1. Importamos los hooks del ciclo de vida para detectar el tamaño de la pantalla
import { ref, onMounted, onUnmounted } from 'vue'
import SimulationCanvas from './components/SimulationCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'
import InfoPanel from './components/InfoPanel.vue'
// 2. Importamos el nuevo componente de navegación móvil
import MobileNav from './components/MovilNav.vue'

// --- ESTADOS DE LA SIMULACIÓN (tu código original) ---
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

// --- INICIO DE LA NUEVA LÓGICA PARA LA INTERFAZ MÓVIL ---
const isMobile = ref(window.innerWidth <= 768)
const activePanel = ref('controls') // Por defecto, mostramos el panel de controles

// Función para actualizar 'isMobile' si el usuario cambia el tamaño de la ventana
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// Hooks para añadir y quitar el listener de 'resize' de forma segura
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Función que se llamará cuando se toque un botón en la MobileNav
const setActivePanel = (panelName) => {
  activePanel.value = panelName
}
// --- FIN DE LA NUEVA LÓGICA MÓVIL ---

// --- MANEJADORES DE EVENTOS (tu código original) ---
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

    <!-- 3. LÓGICA DE RENDERIZADO CONDICIONAL -->
    <!-- En escritorio (!isMobile), los paneles siempre son visibles. -->
    <!-- En móvil (isMobile), solo se muestra el panel activo ('controls' o 'data'). -->
    <ControlPanel
      v-if="!isMobile || activePanel === 'controls'"
      @updateCometParams="handleParamsUpdate"
      @resetSimulation="handleReset"
      @togglePause="togglePause"
      @updateSpeed="updateSpeed"
      @updateVisuals="updateVisuals"
    />

    <InfoPanel v-if="!isMobile || activePanel === 'data'" :simData="simulationData" />

    <!-- 4. La barra de navegación solo se renderiza si estamos en móvil -->
    <MobileNav v-if="isMobile" @setActivePanel="setActivePanel" />
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #000000;
  overflow: hidden;
}
</style>
