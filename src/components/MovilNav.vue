<script setup>
defineProps({
  activePanel: String, // Recibimos qué panel está activo para darle un estilo especial
})
defineEmits(['setActivePanel'])
</script>

<template>
  <div class="mobile-nav">
    <!-- El botón de Controls es 'activo' si el panel activo es 'controls' -->
    <button
      :class="{ active: activePanel === 'controls' }"
      @click="$emit('setActivePanel', 'controls')"
    >
      Controls
    </button>

    <!-- El botón de Data es 'activo' si el panel activo es 'data' -->
    <button :class="{ active: activePanel === 'data' }" @click="$emit('setActivePanel', 'data')">
      Data
    </button>

    <!-- El botón de Hide siempre oculta todo -->
    <button class="hide-button" @click="$emit('setActivePanel', 'none')">Hide Panels</button>
  </div>
</template>

<style scoped>
.mobile-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(10, 10, 20, 0.9);
  display: flex;
  justify-content: space-around;
  padding: 10px 5px; /* Menos padding horizontal para que quepan los botones */
  border-top: 1px solid rgba(100, 100, 120, 0.5);
  z-index: 20;
}
button {
  background-color: #4a4a8a;
  border: 1px solid #4a4a8a; /* Borde del mismo color */
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px; /* Un poco más pequeño para que quepa bien */
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #6a6ac0;
}
/* Estilo para el botón del panel activo */
button.active {
  background-color: #6a6ac0;
  border-color: #8a8aff;
}
.hide-button {
  background-color: transparent;
  border-color: #8a4a4a;
}
.hide-button:hover {
  background-color: #8a4a4a;
}
</style>
