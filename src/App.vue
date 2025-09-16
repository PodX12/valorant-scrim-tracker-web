<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <main>
    <Sidebar />
    <RouterView />
    <div class="footer"></div>
  </main>
</template>
