<script setup>
// 'panelsVisible' será un prop que nos dirá el texto del botón
defineProps({
  panelsVisible: Boolean,
})
// Este componente solo emite un evento para decirle al padre que alterne la visibilidad
defineEmits(['togglePanels'])
</script>

<template>
  <div class="mobile-nav">
    <button @click="$emit('togglePanels')">
      {{ panelsVisible ? 'Hide Panels' : 'Show Panels' }}
    </button>
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
  justify-content: center; /* Centramos el único botón */
  padding: 10px 0;
  border-top: 1px solid rgba(100, 100, 120, 0.5);
  z-index: 20;
}
button {
  background-color: #4a4a8a;
  border: none;
  color: white;
  padding: 10px 30px; /* Hacemos el botón más grande */
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 80%; /* Hacemos que ocupe un buen ancho */
}
button:hover {
  background-color: #6a6ac0;
}
</style>
