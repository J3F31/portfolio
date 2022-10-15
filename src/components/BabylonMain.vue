<template>
  <canvas></canvas>
</template>

<script lang="ts">
import { MainScene } from '@/babylon/MainScene';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BabylonMain',
  mounted() {
    const canvas = document.querySelector("canvas")!;
    new MainScene(canvas);
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 100%;
  height: 100%;
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
}
</style>
