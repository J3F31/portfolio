<template>
  <BabylonMain/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BabylonMain from './components/BabylonMain.vue';

export default defineComponent({
  name: 'App',
  components: {
    BabylonMain
  },
  mounted() {
    document.querySelector("body")!.style.margin = "0";
  }
});
</script>

<style>
template {
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  background-color: lightblue;
  width: 100vw;
  height: 100vh;
}
</style>
