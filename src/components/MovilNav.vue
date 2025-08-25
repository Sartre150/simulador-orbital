<script setup>
defineEmits(['setActivePanel'])
</script>

<template>
  <div class="mobile-nav">
    <button @click="$emit('setActivePanel', 'controls')">Show Controls</button>
    <button @click="$emit('setActivePanel', 'data')">Show Data</button>
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
  padding: 10px 0;
  border-top: 1px solid rgba(100, 100, 120, 0.5);
  z-index: 20;
}
button {
  background-color: #4a4a8a;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
button:hover {
  background-color: #6a6ac0;
}
</style>
