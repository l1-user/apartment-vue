<script setup lang="ts">
import AiAssistant from './components/AiAssistant.vue'
</script>

<template>
  <div>
    <router-view />
    <AiAssistant />
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>