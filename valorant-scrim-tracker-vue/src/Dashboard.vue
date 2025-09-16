<script setup lang="ts">
  import ScrimList from './components/ScrimList.vue';
  import RecentScrims from './components/scrims/RecentScrims.vue';
</script>

<template>
  <!-- Make the body a component -->
  <div class="main-content">
    <div class="container pad-top-20">
      <div class="flex-1 panel">
        <div class="panel-title">
          Round Win%
        </div>
        <div class="panel-body">
          <div class="plhd"></div>
        </div>
      </div>
      <div class="flex-1 panel">
        <div class="panel-title">
          First Kill Rate
        </div>
        <div class="panel-body">
          <div class="plhd"></div>
        </div>
      </div>
      <div class="flex-1 panel">
        <div class="panel-title">
          Map Win Rate
        </div>
        <div class="panel-body">
          <div class="plhd"></div>
        </div>
      </div>
      <div class="flex-1 panel">
        <div class="panel-title">
          Recent Performance
        </div>
        <div class="panel-body">
          <div class="plhd"></div>
        </div>
      </div>
    </div>

    <RecentScrims />

  </div>
</template>