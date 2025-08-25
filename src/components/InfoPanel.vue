<script setup>
defineProps({
  simData: {
    type: Object,
    required: true,
  },
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '...'
  if (num > 10000) {
    return num.toExponential(2)
  }
  return num.toFixed(2)
}
</script>

<template>
  <div class="panel-info">
    <h2>Real-Time Data</h2>

    <div class="status-box" :class="{ danger: simData.isClose }">
      <span>STATUS:</span>
      <span>{{ simData.isClose ? 'COLLISION WARNING!' : 'All Clear' }}</span>
    </div>

    <div class="data-group">
      <h3>Comet "Doomsday"</h3>
      <div class="data-row">
        <span>Velocity:</span>
        <span>{{ formatNumber(simData.cometVelocity) }} km/s</span>
      </div>
      <div class="data-row">
        <span>Distance to Sun:</span>
        <span>{{ formatNumber(simData.cometDistance) }} AU</span>
      </div>
    </div>

    <div class="data-group">
      <h3>Earth</h3>
      <div class="data-row">
        <span>Velocity:</span>
        <span>{{ formatNumber(simData.earthVelocity) }} km/s</span>
      </div>
      <div class="data-row">
        <span>Distance to Sun:</span>
        <span>{{ formatNumber(simData.earthDistance) }} AU</span>
      </div>
    </div>

    <div class="data-group-highlight">
      <h3>Risk Analysis</h3>
      <div class="data-row">
        <span>Earth-Comet Distance:</span>
        <span>{{ formatNumber(simData.separationDistance) }} AU</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* El CSS no cambia */
.panel-info {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background-color: rgba(30, 20, 20, 0.8);
  border-radius: 10px;
  padding: 15px 25px;
  color: #f0f0f0;
  font-family: sans-serif;
  border: 1px solid rgba(120, 100, 100, 0.5);
}
h2,
h3 {
  margin-top: 0;
  border-bottom: 1px solid rgba(120, 100, 100, 0.3);
  padding-bottom: 10px;
}
.data-group {
  margin-top: 15px;
}
.data-group-highlight {
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(80, 80, 80, 0.3);
  border-radius: 5px;
}
.data-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}
.data-row span:first-child {
  color: #a0a0b0;
}
.data-row span:last-child {
  font-weight: bold;
  color: #ffffff;
}
.status-box {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  background-color: rgba(60, 150, 60, 0.3);
  border: 1px solid rgba(60, 150, 60, 0.5);
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  transition: all 0.3s ease;
}
.status-box.danger {
  background-color: rgba(200, 50, 50, 0.5);
  border-color: rgba(200, 50, 50, 0.7);
  color: #ffffff;
}

@media (max-width: 768px) {
  .panel-info {
    /* Hacemos que ocupe casi todo el ancho y lo centramos */
    width: 90%;
    left: 5%;
    /* Lo movemos hacia abajo para que no choque con el panel de control */
    top: auto;
    bottom: 20px;
    /* Hacemos que el fondo sea un poco más opaco para la legibilidad */
    background-color: rgba(30, 20, 20, 0.9);
  }
}
</style>
