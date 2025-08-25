<script setup>
import { ref } from 'vue'

const emit = defineEmits([
  'updateCometParams',
  'resetSimulation',
  'togglePause',
  'updateSpeed',
  'updateVisuals',
])

const excentricidad = ref(0.8)
const afelio = ref(2.82)
const simulationSpeed = ref(1.0)
const showFoci = ref(false)
const showAxis = ref(false)
const showEarthOrbit = ref(true)
const showCometOrbit = ref(true)

const onParamsChange = () => {
  emit('updateCometParams', {
    excentricidad: parseFloat(excentricidad.value),
    afelio: parseFloat(afelio.value),
  })
}
const handleReset = () => {
  excentricidad.value = 0.8
  afelio.value = 2.82
  emit('resetSimulation')
}
const onSpeedChange = () => {
  emit('updateSpeed', parseFloat(simulationSpeed.value))
}

const onVisualsChange = () => {
  emit('updateVisuals', {
    showFoci: showFoci.value,
    showAxis: showAxis.value,
    showEarthOrbit: showEarthOrbit.value,
    showCometOrbit: showCometOrbit.value,
  })
}
</script>

<template>
  <div class="panel">
    <h2>Simulation Controls</h2>

    <div class="control-group">
      <button @click="emit('togglePause')" class="pause-button">Pause / Resume</button>
      <div class="control">
        <label for="speed">Simulation Speed</label>
        <input
          type="range"
          id="speed"
          min="0.1"
          max="5"
          step="0.1"
          v-model="simulationSpeed"
          @input="onSpeedChange"
        />
        <span>x{{ parseFloat(simulationSpeed).toFixed(1) }}</span>
      </div>
    </div>

    <div class="control-group">
      <h3>Comet Parameters</h3>
      <div class="control">
        <label for="excentricidad">Eccentricity (e)</label>
        <input
          type="range"
          id="excentricidad"
          min="0.1"
          max="0.95"
          step="0.01"
          v-model="excentricidad"
          @input="onParamsChange"
        />
        <span>{{ parseFloat(excentricidad).toFixed(2) }}</span>
      </div>
      <div class="control">
        <label for="afelio">Aphelion (AU)</label>
        <input
          type="range"
          id="afelio"
          min="1.5"
          max="5.0"
          step="0.01"
          v-model="afelio"
          @input="onParamsChange"
        />
        <span>{{ parseFloat(afelio).toFixed(2) }} AU</span>
      </div>
      <button @click="handleReset">Reset Simulation</button>
    </div>

    <div class="control-group">
      <h3>Visual Aids</h3>
      <div class="checkbox-control">
        <input type="checkbox" id="show-foci" v-model="showFoci" @change="onVisualsChange" />
        <label for="show-foci">Show Center & Foci</label>
      </div>
      <div class="checkbox-control">
        <input type="checkbox" id="show-axis" v-model="showAxis" @change="onVisualsChange" />
        <label for="show-axis">Show Major Axis</label>
      </div>
      <div class="checkbox-control">
        <input
          type="checkbox"
          id="show-earth-orbit"
          v-model="showEarthOrbit"
          @change="onVisualsChange"
        />
        <label for="show-earth-orbit">Draw Earth Orbit</label>
      </div>
      <div class="checkbox-control">
        <input
          type="checkbox"
          id="show-comet-orbit"
          v-model="showCometOrbit"
          @change="onVisualsChange"
        />
        <label for="show-comet-orbit">Draw Comet Orbit</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* El CSS no cambia */
.panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(20, 20, 30, 0.8);
  border-radius: 10px;
  padding: 15px 25px;
  color: #f0f0f0;
  font-family: sans-serif;
  width: 300px;
  border: 1px solid rgba(100, 100, 120, 0.5);
}
h2,
h3 {
  margin-top: 0;
  border-bottom: 1px solid rgba(100, 100, 120, 0.3);
  padding-bottom: 10px;
}
.control-group {
  margin-top: 20px;
}
.control {
  margin-bottom: 15px;
}
.control label {
  display: block;
  margin-bottom: 5px;
  color: #a0a0b0;
}
.control input[type='range'] {
  width: 70%;
  vertical-align: middle;
}
.control span {
  margin-left: 10px;
  color: #ffffff;
  font-weight: bold;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #4a4a8a;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
button:hover {
  background-color: #6a6ac0;
}
.pause-button {
  background-color: #8a4a4a;
  margin-bottom: 15px;
}
.pause-button:hover {
  background-color: #c06a6a;
}
.checkbox-control {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.checkbox-control input {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .panel {
    /* Hacemos que ocupe casi todo el ancho, con un pequeño margen */
    width: 90%;
    /* Lo centramos horizontalmente */
    left: 5%;
    /* Lo hacemos un poco más compacto */
    padding: 10px 15px;
    /* Reducimos el tamaño de la fuente para que quepa todo */
    font-size: 14px;
  }

  h2,
  h3 {
    font-size: 1.2em;
  }
}
</style>
